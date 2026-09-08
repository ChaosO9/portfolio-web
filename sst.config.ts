/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "irfan-portfolio",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-1",
        },
        cloudflare: { package: "@pulumi/cloudflare", version: "6.20.0" },
      },
    };
  },
  async run() {
    new sst.aws.Nextjs("PortfolioWeb", {
      domain: {
        name: "irfannoorhidayat.my.id",
        aliases: ["www.irfannoorhidayat.my.id"],
        dns: sst.cloudflare.dns(),
      },
      environment: {
        AWS_BEDROCK_REGION: "ap-southeast-2",
        AWS_BEDROCK_MODEL_ID: "amazon.nova-lite-v1:0",
        AWS_BEDROCK_KB_ID: "CH3JGLS5OS",
      },
      permissions: [
        {
          actions: [
            "bedrock:InvokeModel",
            "bedrock:RetrieveAndGenerate",
            "bedrock:Retrieve",
          ],
          resources: ["*"],
        },
      ],
    });
  },
});
