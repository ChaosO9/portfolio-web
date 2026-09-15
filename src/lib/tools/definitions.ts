import { ToolConfiguration } from "@aws-sdk/client-bedrock-runtime";

/**
 * Bedrock Converse API Tool Configuration for GitHub and Tavily search
 */
export const BEDROCK_AGENT_TOOLS: ToolConfiguration = {
  tools: [
    {
      toolSpec: {
        name: "crawl_github",
        description:
          "Inspect Irfan's public GitHub repositories (@ChaosO9) and open-source project repositories. Use this tool ONLY when the user explicitly asks to view code, inspect repository file trees, check latest commits, read a README, or list public repositories.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: ["list_repos", "get_tree", "get_file"],
                description:
                  "Action to perform: 'list_repos' (lists public repos for a user), 'get_tree' (shows repository file/folder structure), or 'get_file' (reads file content like README.md or source code).",
              },
              repo: {
                type: "string",
                description:
                  "Repository name or full path, e.g. 'portfolio-web', 'ChaosO9/jlpt-bot', or an open-source project like 'cloudflare/cloudflared'.",
              },
              owner: {
                type: "string",
                description: "GitHub owner or username (defaults to 'ChaosO9').",
              },
              path: {
                type: "string",
                description:
                  "File path or subfolder within the repository. Defaults to 'README.md' for get_file, or root for get_tree.",
              },
            },
            required: ["action"],
          },
        },
      },
    },
    {
      toolSpec: {
        name: "search_web",
        description:
          "Search the live web via Tavily Search API. Use this tool ONLY when the user asks about recent external news, latest cloud/DevOps technologies, external company information (e.g. Panasonic or OJK news), or Irfan's public LinkedIn profile updates.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "The search query. For LinkedIn profile lookups, use queries like 'Irfan Noor Hidayat LinkedIn' or 'site:linkedin.com/in/irfan-noor-hidayat-5847b2156'.",
              },
              domains: {
                type: "array",
                items: { type: "string" },
                description: "Optional list of domains to restrict search to (e.g. ['linkedin.com']).",
              },
            },
            required: ["query"],
          },
        },
      },
    },
  ],
};
