import type { SSTConfig } from "sst";
import { Bucket, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "janked-form-builder",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, "public");

      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
          NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
        },
        bind: [bucket],
        warm: 1,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
