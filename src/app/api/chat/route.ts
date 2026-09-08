import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getRemainingQuota, MAX_REQUESTS_PER_IP } from "@/lib/rateLimit";
import { askBedrock, explainProjectWithBedrock, isBedrockConfigured } from "@/lib/bedrock";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

// GET endpoint to check current IP quota status
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const remaining = getRemainingQuota(ip);

  return NextResponse.json({
    remaining,
    limit: MAX_REQUESTS_PER_IP,
    isBedrockConfigured,
  });
}

// POST endpoint for chat interactions and project explanations
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded (Maximum 5 requests per IP address). Feel free to reach out to Irfan directly via WhatsApp or Email!",
        remaining: 0,
        limit: MAX_REQUESTS_PER_IP,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_IP),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { message, projectTitle, history, sessionId } = body;

    let result: { text: string; mode: "bedrock" | "demo"; sessionId?: string };

    if (projectTitle) {
      result = await explainProjectWithBedrock(projectTitle);
    } else if (message) {
      result = await askBedrock(message, history || [], sessionId);
    } else {
      return NextResponse.json(
        { error: "Please provide either a message or projectTitle." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        response: result.text,
        sessionId: result.sessionId,
        remaining: rateCheck.remaining,
        limit: MAX_REQUESTS_PER_IP,
        mode: result.mode,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_IP),
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (error) {
    console.error("API Chat Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
