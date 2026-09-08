import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { PROFILE_CONTEXT_PROMPT, PROJECTS, EXPERIENCES } from "@/data/portfolioData";

const region = process.env.AWS_REGION || "ap-southeast-1";
const bedrockRegion = process.env.AWS_BEDROCK_REGION || "ap-southeast-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const modelId = process.env.AWS_BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";
const knowledgeBaseId = process.env.AWS_BEDROCK_KB_ID || "CH3JGLS5OS";

// Determine environment: Lambda runtime or local
const isAwsLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_EXECUTION_ENV);
const hasExplicitKeys = Boolean(accessKeyId && secretAccessKey);

export const isBedrockConfigured = isAwsLambda || hasExplicitKeys;

let bedrockClient: BedrockRuntimeClient | null = null;
let agentClient: BedrockAgentRuntimeClient | null = null;

try {
  if (hasExplicitKeys) {
    // 1. Explicit keys from .env.local (local development)
    bedrockClient = new BedrockRuntimeClient({
      region: bedrockRegion,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    });
    agentClient = new BedrockAgentRuntimeClient({
      region: bedrockRegion,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    });
  } else if (isAwsLambda) {
    // 2. AWS Lambda Execution Role provided by SST permissions
    bedrockClient = new BedrockRuntimeClient({ region: bedrockRegion });
    agentClient = new BedrockAgentRuntimeClient({ region: bedrockRegion });
  } else {
    // 3. Try default AWS SDK credential chain (e.g. AWS CLI profile)
    bedrockClient = new BedrockRuntimeClient({ region: bedrockRegion });
    agentClient = new BedrockAgentRuntimeClient({ region: bedrockRegion });
  }
} catch (err) {
  console.warn("Bedrock client initialization warning:", err);
}

export async function askBedrock(
  userPrompt: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ text: string; mode: "bedrock" | "demo" }> {
  // 1. Try Bedrock Knowledge Base RAG first if configured
  if (agentClient && knowledgeBaseId) {
    try {
      const modelArn = `arn:aws:bedrock:${bedrockRegion}::foundation-model/${modelId}`;
      const ragCommand = new RetrieveAndGenerateCommand({
        input: { text: userPrompt },
        retrieveAndGenerateConfiguration: {
          type: "KNOWLEDGE_BASE",
          knowledgeBaseConfiguration: {
            knowledgeBaseId,
            modelArn,
            generationConfiguration: {
              promptTemplate: {
                textPromptTemplate: `You are the personal AI Assistant representing Irfan Noor Hidayat, a Cloud Engineer & DevOps Developer.
Answer the user's question conversationally in the first person ("I", "my experience", "my projects") based on the retrieved context from my resume and portfolio library.
Be concise, accurate, and structured with markdown bullets where helpful. If information is not found in the context, speak to my general background in cloud and DevOps.

Retrieved Context:
$search_results$

User Question: $query$
Assistant Answer:`,
              },
            },
          },
        },
      });

      const ragResponse = await agentClient.send(ragCommand);
      if (ragResponse.output?.text) {
        return {
          text: ragResponse.output.text,
          mode: "bedrock",
        };
      }
    } catch (ragErr) {
      console.warn("Knowledge Base RAG failed, falling back to direct model invocation:", ragErr);
    }
  }

  // 2. Fallback to direct model invocation (Prompt Context)
  if (bedrockClient) {
    try {
      const messages = [
        ...history.map((h) => ({
          role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: h.content,
        })),
        { role: "user" as const, content: userPrompt },
      ];

      const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 600,
        system: PROFILE_CONTEXT_PROMPT,
        messages: messages,
      };

      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });

      const response = await bedrockClient.send(command);
      const decoded = new TextDecoder().decode(response.body);
      const parsed = JSON.parse(decoded);

      if (parsed.content && parsed.content[0]?.text) {
        return {
          text: parsed.content[0].text,
          mode: "bedrock",
        };
      }
    } catch (err) {
      console.warn("Bedrock call encountered an issue, falling back to contextual demo engine:", err);
    }
  }

  // Fallback / Demo mode when AWS credentials aren't plugged in
  const lower = userPrompt.toLowerCase();
  let reply = "";

  if (lower.includes("bedrock") || lower.includes("ai") || lower.includes("talenttrail")) {
    reply = `I integrated **AWS Bedrock** in production at **Panasonic** for the **TalentTrail E-Recruitment** web app, and also built a personal **Serverless RAG Chatbot** over my CV. In TalentTrail, Bedrock foundation models automatically parse candidate resumes and score them against predefined criteria (education, skills, experience), which reduced HR screening time by over 60%!`;
  } else if (lower.includes("satusehat") || lower.includes("health") || lower.includes("fhir")) {
    reply = `For my final project at PENS, I engineered the **SATUSEHAT HL7 FHIR Interoperability Agent**. It standardized Trustmedis EMR records into national HL7 FHIR formats across 23 inpatient modules for the Indonesian Ministry of Health. A key architectural decision was implementing a master-slave database replication so the sync service strictly read from replicas with 0% extra load on production!`;
  } else if (lower.includes("panasonic") || lower.includes("work") || lower.includes("job") || lower.includes("experience")) {
    reply = `At **PT Panasonic Manufacturing Indonesia**, I work as an IT Engineer in the Information System Center (HRMS). My key achievements include digitizing employee contracts and business trips with automated **Microsoft Teams approvals** (Power Automate & n8n), developing **PTC (People Traffic Control)** to track on-site facility access, and architecting the **TalentTrail AI E-Recruitment App** using ASP.NET Core and AWS Bedrock.`;
  } else if (lower.includes("vpn") || lower.includes("wireguard") || lower.includes("network")) {
    reply = `I provisioned a self-hosted **WireGuard VPN on AWS EC2**. During testing from Indonesia, I diagnosed latency bottlenecks on US-East, then migrated the EBS volume snapshot to AWS Singapore (ap-southeast-1) for a high-speed connection with private cryptographic key authentication.`;
  } else if (lower.includes("proxmox") || lower.includes("cloudflare") || lower.includes("tunnel")) {
    reply = `I solved an on-premise access challenge by exposing a campus **Proxmox VE cluster** via **Cloudflare Zero Trust and Cloudflare Tunnel**. This enabled encrypted, remote browser-based management of Proxmox, Grafana, and Prometheus without opening a single inbound port on a restricted network!`;
  } else if (lower.includes("docker") || lower.includes("cloud run") || lower.includes("gcp") || lower.includes("cloudraya")) {
    reply = `For my D3 final project at **POLNES** (collaborating with Wowrack Indonesia), I developed the **Microservice for Backend Cloudraya** Android App. I built RESTful APIs in Hapi.js and PostgreSQL, deployed containerized services on **GCP Cloud Run**, automated CI/CD via **Cloud Build & Artifact Registry**, and integrated a TensorFlow.js microservice to detect anomalous VM activity.`;
  } else if (lower.includes("education") || lower.includes("pens") || lower.includes("polnes") || lower.includes("college") || lower.includes("graduat") || lower.includes("final project")) {
    reply = `I earned my **Applied Bachelor's Degree (D4) in Informatics** from **Politeknik Elektronika Negeri Surabaya (PENS)** (Graduated March 2026), where my final project was the **SATUSEHAT HL7 FHIR Interoperability Agent**. Prior to that, I earned an **Associate's Degree (D3) in Information Technology** from **Politeknik Negeri Samarinda (POLNES)** (2021-2024), where my final project was **Microservice for Backend Cloudraya**.`;
  } else if (lower.includes("contact") || lower.includes("hire") || lower.includes("email") || lower.includes("whatsapp")) {
    reply = `I'd love to connect! You can reach me directly via **WhatsApp** at [+6287784312184](https://wa.me/6287784312184) or email me at [irfannoorh@gmail.com](mailto:irfannoorh@gmail.com). You can also connect on [LinkedIn](https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/).`;
  } else {
    reply = `Hello! I'm Irfan's AI Assistant. Irfan is a Cloud Engineer & DevOps Developer with strong hands-on expertise in **AWS, GCP, Docker, Cloudflare Zero Trust, .NET, and Node.js microservices**. He is currently at PT Panasonic Manufacturing Indonesia and holds degrees from PENS and POLNES. Feel free to ask about any specific project (like SATUSEHAT, CloudRaya, or Proxmox), his cloud architecture, or his experience!`;
  }

  return {
    text: reply,
    mode: isBedrockConfigured ? "bedrock" : "demo",
  };
}

export async function explainProjectWithBedrock(projectTitle: string): Promise<{ text: string; mode: "bedrock" | "demo" }> {
  const project = PROJECTS.find(
    (p) => p.title.toLowerCase() === projectTitle.toLowerCase() || p.id === projectTitle
  );

  const prompt = `You are a Senior Cloud and DevOps Architect. Explain the technical implementation, architectural decisions, and why the tech stack was chosen for the project: "${project?.title || projectTitle}".
Project Details:
- Category: ${project?.category}
- Tech Stack: ${project?.skills.join(", ")}
- Problem: ${project?.problem}
- Solution: ${project?.solution}
- Results: ${project?.results}

Provide an insightful, technically deep explanation in 2-3 paragraphs suitable for an engineering manager or recruiter.`;

  return askBedrock(prompt);
}
