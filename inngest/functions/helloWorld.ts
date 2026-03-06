import { inngest } from "../client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ step }) => {

    await step.sleep("wait-a-moment", "1s");

    return {
      message: "Function finished successfully"
    };
  }
);