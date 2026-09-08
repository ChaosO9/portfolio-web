import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { PROFILE_CONTEXT_PROMPT, PROJECTS, EXPERIENCES } from "@/data/portfolioData";

const region = process.env.AWS_REGION || "ap-southeast-1";
const bedrockRegion = process.env.AWS_BEDROCK_REGION || "ap-southeast-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const sessionToken = process.env.AWS_SESSION_TOKEN;
const modelId = process.env.AWS_BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";
const knowledgeBaseId = process.env.AWS_BEDROCK_KB_ID || "CH3JGLS5OS";

// Determine environment: Lambda runtime or local
const isAwsLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_EXECUTION_ENV);
const hasExplicitKeys = Boolean(accessKeyId && secretAccessKey);

export const isBedrockConfigured = isAwsLambda || hasExplicitKeys;

let bedrockClient: BedrockRuntimeClient | null = null;
let agentClient: BedrockAgentRuntimeClient | null = null;

try {
  if (isAwsLambda) {
    // 1. In AWS Lambda, let default credential provider chain handle the IAM role execution credentials & session token
    bedrockClient = new BedrockRuntimeClient({ region: bedrockRegion });
    agentClient = new BedrockAgentRuntimeClient({ region: bedrockRegion });
  } else if (hasExplicitKeys) {
    // 2. Explicit keys from .env.local (local development)
    bedrockClient = new BedrockRuntimeClient({
      region: bedrockRegion,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
        sessionToken: sessionToken || undefined,
      },
    });
    agentClient = new BedrockAgentRuntimeClient({
      region: bedrockRegion,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
        sessionToken: sessionToken || undefined,
      },
    });
  } else {
    bedrockClient = new BedrockRuntimeClient({ region: bedrockRegion });
    agentClient = new BedrockAgentRuntimeClient({ region: bedrockRegion });
  }
} catch (err) {
  console.warn("Bedrock client initialization warning:", err);
}

// Helper to invoke model supporting Amazon Nova, Anthropic Claude, and Amazon Titan
async function invokeFoundationModel(
  client: BedrockRuntimeClient,
  activeModelId: string,
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string | null> {
  const isNova = activeModelId.includes("nova");
  const isClaude = activeModelId.includes("claude");

  if (isNova) {
    const payload = {
      system: [{ text: systemPrompt }],
      messages: messages.map((m) => ({
        role: m.role,
        content: [{ text: m.content }],
      })),
      inferenceConfig: {
        max_new_tokens: 700,
        temperature: 0.3,
      },
    };

    const command = new InvokeModelCommand({
      modelId: activeModelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const parsed = JSON.parse(decoded);
    return parsed.output?.message?.content?.[0]?.text || null;
  } else if (isClaude) {
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 700,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    const command = new InvokeModelCommand({
      modelId: activeModelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const parsed = JSON.parse(decoded);
    return parsed.content?.[0]?.text || null;
  } else {
    const payload = {
      inputText: `${systemPrompt}\n\nUser: ${messages[messages.length - 1]?.content}\nAssistant:`,
    };
    const command = new InvokeModelCommand({
      modelId: activeModelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });
    const response = await client.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const parsed = JSON.parse(decoded);
    return parsed.results?.[0]?.outputText || null;
  }
}

export async function askBedrock(
  userPrompt: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  sessionId?: string
): Promise<{ text: string; mode: "bedrock" | "demo"; sessionId?: string }> {
  const effectiveSessionId = sessionId || `session-${Date.now()}`;

  // Filter out any leading assistant greeting to ensure the message list starts with "user"
  const validHistory = history.filter((h, idx) => !(idx === 0 && h.role === "assistant"));
  const conversationMessages = [
    ...validHistory.map((h) => ({
      role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: h.content,
    })),
    { role: "user" as const, content: userPrompt },
  ];

  // 1. Try Bedrock Knowledge Base RAG (Retrieve chunks + Invoke foundation model)
  if (bedrockClient && agentClient && knowledgeBaseId) {
    try {
      let retrievedContext = "";
      try {
        // Bedrock Knowledge Base retrieval query has a strict character limit (<= 1000)
        const trimmedQuery = userPrompt.trim().slice(0, 350);
        const retrieveCommand = new RetrieveCommand({
          knowledgeBaseId,
          retrievalQuery: { text: trimmedQuery },
        });
        const retrieveRes = await agentClient.send(retrieveCommand);
        const chunks = retrieveRes.retrievalResults
          ?.map((r) => r.content?.text)
          .filter(Boolean);
        if (chunks && chunks.length > 0) {
          retrievedContext = `\n\nVerified Knowledge Base Chunks:\n${chunks.join("\n\n---\n\n")}`;
        }
      } catch (kbErr) {
        console.warn("Bedrock Retrieve failed:", kbErr);
      }

      const ragSystemPrompt = `${PROFILE_CONTEXT_PROMPT}${retrievedContext}\n\nInstructions: You are Irfan's AI Assistant. Answer conversationally in the first person ("I", "my work"). Maintain conversational context from earlier messages in this conversation. Be concise, structured, and helpful.`;

      const modelAnswer = await invokeFoundationModel(
        bedrockClient,
        modelId,
        ragSystemPrompt,
        conversationMessages
      );

      if (modelAnswer) {
        return {
          text: modelAnswer,
          sessionId: effectiveSessionId,
          mode: "bedrock",
        };
      }
    } catch (ragErr) {
      console.warn("Bedrock RAG workflow failed, falling back to direct model invocation:", ragErr);
    }
  }

  // 2. Direct Foundation Model fallback (without Knowledge Base)
  if (bedrockClient) {
    try {
      const modelAnswer = await invokeFoundationModel(
        bedrockClient,
        modelId,
        PROFILE_CONTEXT_PROMPT,
        conversationMessages
      );

      if (modelAnswer) {
        return {
          text: modelAnswer,
          sessionId: effectiveSessionId,
          mode: "bedrock",
        };
      }
    } catch (directErr) {
      console.warn("Bedrock direct model invocation failed:", directErr);
    }
  }

  // 3. Smart Contextual Demo Engine (Multi-turn aware fallback when AWS is offline/unreachable)
  const recentHistoryText = history.slice(-4).map((h) => h.content).join(" ");
  const combinedContext = `${recentHistoryText} ${userPrompt}`.toLowerCase();
  const currentLower = userPrompt.toLowerCase();

  let reply = "";

  if (
    currentLower.includes("bedrock") ||
    currentLower.includes("talenttrail") ||
    (combinedContext.includes("talenttrail") && (currentLower.includes("tech") || currentLower.includes("stack") || currentLower.includes("how") || currentLower.includes("what")))
  ) {
    reply = `I integrated **AWS Bedrock** in production at **PT Panasonic Manufacturing Indonesia** for the **TalentTrail E-Recruitment** web app. In TalentTrail, Bedrock foundation models automatically parse candidate CVs and score them against predefined criteria (education, skills, experience), cutting manual HR screening time by over 60%! The stack is built on **ASP.NET Core, Blazor UI, SQL Server, Redis, and Tailwind CSS**.`;
  } else if (
    currentLower.includes("satusehat") ||
    currentLower.includes("fhir") ||
    (combinedContext.includes("satusehat") && (currentLower.includes("tech") || currentLower.includes("stack") || currentLower.includes("how") || currentLower.includes("what") || currentLower.includes("database") || currentLower.includes("replica")))
  ) {
    reply = `For my D4 final project at **PENS**, I engineered the **SATUSEHAT HL7 FHIR Interoperability Agent** connecting Trustmedis EMR records to the Indonesian Ministry of Health across 23 inpatient modules. Built with **Node.js, Docker Compose, PostgreSQL, and Redis**, it achieved 0% extra read overhead on production by reading exclusively from a master-slave read replica database.`;
  } else if (
    currentLower.includes("panasonic") ||
    currentLower.includes("romansy") ||
    currentLower.includes("ptc") ||
    (combinedContext.includes("panasonic") && (currentLower.includes("tech") || currentLower.includes("stack") || currentLower.includes("what") || currentLower.includes("role") || currentLower.includes("achievement")))
  ) {
    reply = `At **PT Panasonic Manufacturing Indonesia** (HRMS - Information System Center), I digitized employee contract renewals and in-city business trips with automated **Microsoft Teams approvals** (Power Automate & n8n), developed **PTC (People Traffic Control)** to secure and log contractor/visitor entry, and built **TalentTrail AI E-Recruitment**. The tech stack utilizes **.NET Web Forms, C#, SQL Server, IIS, and Microsoft 365 APIs**.`;
  } else if (
    currentLower.includes("vpn") ||
    currentLower.includes("wireguard") ||
    (combinedContext.includes("wireguard") && (currentLower.includes("tech") || currentLower.includes("how") || currentLower.includes("why") || currentLower.includes("latency")))
  ) {
    reply = `I provisioned a self-hosted **WireGuard VPN on AWS EC2**. When diagnosing high latency from Indonesia on the initial US-East deployment, I took an EBS snapshot and migrated the tunnel to AWS Singapore (ap-southeast-1), drastically lowering round-trip ping times with private cryptographic key authentication.`;
  } else if (
    currentLower.includes("proxmox") ||
    currentLower.includes("cloudflare") ||
    (combinedContext.includes("proxmox") && (currentLower.includes("tunnel") || currentLower.includes("how") || currentLower.includes("zero trust")))
  ) {
    reply = `I exposed an on-premise **Proxmox VE cluster** via **Cloudflare Zero Trust & Cloudflare Tunnel (cloudflared)** on a campus lab network without public inbound IP access. This allows encrypted, zero-trust remote web management for Proxmox, Grafana, and Prometheus without opening a single inbound firewall port!`;
  } else if (
    currentLower.includes("cloudraya") ||
    (combinedContext.includes("cloudraya") && (currentLower.includes("tech") || currentLower.includes("stack") || currentLower.includes("gcp") || currentLower.includes("cloud run")))
  ) {
    reply = `For my D3 final project at **POLNES** (in collaboration with Wowrack Indonesia), I developed the **Microservice for Backend Cloudraya** Android app on **Google Cloud Platform (Cloud Run, Docker, Cloud Build CI/CD, Artifact Registry)** with a TensorFlow.js microservice to detect anomalous virtual machine behavior.`;
  } else if (
    currentLower.includes("education") ||
    currentLower.includes("college") ||
    currentLower.includes("pens") ||
    currentLower.includes("polnes")
  ) {
    reply = `I hold an **Applied Bachelor's Degree (D4) in Informatics** from **Politeknik Elektronika Negeri Surabaya (PENS)** (Graduated 2026, Final Project: SATUSEHAT HL7 FHIR Interoperability Agent) and an **Associate's Degree (D3) in Information Technology** from **Politeknik Negeri Samarinda (POLNES)** (2021-2024, Final Project: Cloudraya Microservices on GCP).`;
  } else if (
    currentLower.includes("contact") ||
    currentLower.includes("hire") ||
    currentLower.includes("email") ||
    currentLower.includes("whatsapp")
  ) {
    reply = `I'd love to connect! You can reach me directly on **WhatsApp** at [+6287784312184](https://wa.me/6287784312184) or email me at [irfannoorh@gmail.com](mailto:irfannoorh@gmail.com). You can also connect with me on [LinkedIn](https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/).`;
  } else {
    reply = `Hello! I'm Irfan's AI Assistant. Irfan is a Cloud Engineer & DevOps Developer with enterprise hands-on expertise in **AWS, GCP, Docker, Cloudflare Zero Trust, .NET, and Node.js microservices**. He is currently at PT Panasonic Manufacturing Indonesia and holds degrees from PENS and POLNES. Feel free to ask about any specific project (like SATUSEHAT, CloudRaya, Proxmox, or TalentTrail), his cloud architecture, or his experience!`;
  }

  return {
    text: reply,
    sessionId: effectiveSessionId,
    mode: isBedrockConfigured ? "bedrock" : "demo",
  };
}

export async function explainProjectWithBedrock(
  projectTitle: string
): Promise<{ text: string; mode: "bedrock" | "demo"; sessionId?: string }> {
  // Find project by title, ID, or substring match
  const normalizedSearch = projectTitle.trim().toLowerCase();
  const project = PROJECTS.find(
    (p) =>
      p.title.toLowerCase() === normalizedSearch ||
      p.id.toLowerCase() === normalizedSearch ||
      normalizedSearch.includes(p.title.toLowerCase()) ||
      p.title.toLowerCase().includes(normalizedSearch)
  );

  const title = project?.title || projectTitle;
  const category = project?.category || "Cloud & DevOps Engineering";
  const skills = project?.skills?.join(", ") || "Cloud Architecture";
  const problem = project?.problem || "Enterprise scalability, automation, or reliability challenges";
  const role = project?.role || "Lead Cloud / DevOps Engineer";
  const solution = project?.solution || "Engineered scalable cloud and automation solutions";
  const results = project?.results || "Delivered verified operational reliability and efficiency";

  // 1. Invoke Bedrock foundation model for deep architectural analysis
  if (bedrockClient) {
    try {
      let retrievedContext = "";
      if (agentClient && knowledgeBaseId) {
        try {
          const query = `${title} architecture ${skills}`.slice(0, 300);
          const retrieveRes = await agentClient.send(
            new RetrieveCommand({
              knowledgeBaseId,
              retrievalQuery: { text: query },
            })
          );
          const chunks = retrieveRes.retrievalResults
            ?.map((r) => r.content?.text)
            .filter(Boolean);
          if (chunks && chunks.length > 0) {
            retrievedContext = `\n\nVerified Knowledge Base Chunks:\n${chunks.join("\n\n---\n\n")}`;
          }
        } catch (kbErr) {
          console.warn("Knowledge Base retrieval for project failed:", kbErr);
        }
      }

      const systemPrompt = `You are a Principal Cloud & DevOps Solutions Architect analyzing engineering projects built by Irfan Noor Hidayat.
Provide an insightful, technically rigorous architecture deep-dive for a technical hiring manager or senior engineering leader.
Format with clean markdown headings and bullet points.
Project Metadata:${retrievedContext}
- Project: ${title}
- Domain: ${category}
- Tech Stack: ${skills}
- Role & Contribution: ${role}
- Problem Statement: ${problem}
- Implemented Solution & Design: ${solution}
- Measurable Impact: ${results}`;

      const userPrompt = `Provide a comprehensive technical architecture deep-dive for "${title}". Cover:
1. **Architectural Overview & Core Decisions** (Why this stack was chosen and how components connect)
2. **Key Technical Implementations & Data Flow** (How data/traffic flows securely and reliably)
3. **Engineering Trade-offs & Production Impact** (Why this design beats alternative patterns and measurable results)`;

      const answer = await invokeFoundationModel(
        bedrockClient,
        modelId,
        systemPrompt,
        [{ role: "user", content: userPrompt }]
      );

      if (answer) {
        return {
          text: answer,
          sessionId: `explainer-${Date.now()}`,
          mode: "bedrock",
        };
      }
    } catch (err) {
      console.warn("Bedrock project explainer encountered an error, falling back to structured generator:", err);
    }
  }

  // 2. Structured, project-specific architectural deep dive fallback (never generic intro)
  const fallbackText = `### Architectural Overview: ${title}

**Engineering Context & Core Decisions:**
For this ${category} project, the architecture was engineered to address a critical challenge: *${problem}*. To solve this cleanly, Irfan selected a specialized stack comprising **${skills}**. The primary architectural goal was to ensure maximum security, high throughput, and seamless operational reliability without introducing unnecessary maintenance overhead.

---

### Technical Implementation & Data Flow
- **Primary Mechanism**: ${solution}
- **Role & Execution**: As ${role}, the implementation involved structuring modular interfaces, enforcing strict access boundaries, and optimizing connection latency.
- **Resilience & Isolation**: Components are decoupled to guarantee that failure domains remain isolated and do not cascade into upstream enterprise dependencies.

---

### Engineering Trade-offs & Measurable Results
- **Production Impact**: ${results}
- **Trade-off Analysis**: Rather than relying on legacy manual patterns or unmanaged public endpoints, the solution leverages modern containerization and zero-trust tunneling to ensure complete auditability, rapid disaster recovery, and zero unauthorized attack surface.`;

  return {
    text: fallbackText,
    sessionId: `explainer-demo-${Date.now()}`,
    mode: isBedrockConfigured ? "bedrock" : "demo",
  };
}
