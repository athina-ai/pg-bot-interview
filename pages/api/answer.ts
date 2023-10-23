import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt, apiKey } = (await req.json()) as {
      prompt: string;
      apiKey: string;
    };

    const stream = await OpenAIStream(prompt, apiKey);

    const reader = stream.getReader();
    let responseBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      responseBuffer += new TextDecoder().decode(value);
    }
    reader.releaseLock();
    console.log(responseBuffer)

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
