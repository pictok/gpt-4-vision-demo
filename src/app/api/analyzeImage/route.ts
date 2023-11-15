import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
// import OpenAI from "openai";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const { image } = await request.json();

  const response = await openai.createChatCompletion({
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 500, // No max tokens: super short / cut off response.
    messages: [
      {
        role: "user",
        //@ts-ignore
        content: [
          {
            type: "text",
            text: "Identify the objects in the image and describe the potential sounds it can be",
          },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
