import OpenAI from "openai";
export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});
// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "qwen/qwen3-0.6b-04-28:free",
//     messages: [
//       {
//         role: "user",
//         content: "What is the meaning of life?",
//       },
//     ],
//   });

//   console.log(completion.choices[0].message);
// }

// main();
