import "dotenv/config";
import OpenAI from "openai";

class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  public async getOpenAICompletion(text: string): Promise<string> {
    try {
      const completion: any = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }],
      });

      return completion.choices[0].message?.content as string;
    } catch (error) {
      console.error("Erro ao obter a conclusão:", error);
      throw new Error("Falha ao obter a conclusão do OpenAI");
    }
  }
}

export default new OpenAIService(process.env.OPENAI_API_KEY as string);
