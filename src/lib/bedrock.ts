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
        temperature: 0,
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
      temperature: 0,
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
      textGenerationConfig: {
        maxTokenCount: 700,
        temperature: 0,
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
    return parsed.results?.[0]?.outputText || null;
  }
}

export async function askBedrock(
  userPrompt: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  sessionId?: string
): Promise<{ text: string; mode: "bedrock"; sessionId?: string }> {
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

      const ragSystemPrompt = `${PROFILE_CONTEXT_PROMPT}${retrievedContext}\n\nInstructions: You are Irfan's AI Assistant. Answer conversationally in the first person ("I", "my work"). Maintain conversational context from earlier messages in this conversation. Be concise, structured, and helpful. Note: If asked about personal opinions, commitments, or official representations, clarify that you are an AI assistant whose responses may contain inaccuracies and do not officially represent Irfan's views.`;

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
        `${PROFILE_CONTEXT_PROMPT}\n\nInstructions: You are Irfan's AI Assistant. Answer conversationally in the first person ("I", "my work"). Be concise, structured, and helpful. Note: If asked about personal opinions, commitments, or official representations, clarify that you are an AI assistant whose responses may contain inaccuracies and do not officially represent Irfan's views.`,
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
      console.error("Bedrock direct model invocation failed:", directErr);
      throw new Error(`Bedrock direct model invocation failed: ${(directErr as Error).message}`);
    }
  }

  throw new Error("AWS Bedrock service is currently unavailable. Please verify AWS configuration or try again.");
}

export async function explainProjectWithBedrock(
  projectTitle: string
): Promise<{ text: string; mode: "bedrock"; sessionId?: string }> {
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

  // Invoke Bedrock foundation model for deep architectural analysis
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
      console.error("Bedrock project explainer encountered an error:", err);
      throw new Error(`AWS Bedrock explainer failed: ${(err as Error).message}`);
    }
  }

  throw new Error("AWS Bedrock service is currently unavailable. Please verify AWS configuration or try again.");
}
