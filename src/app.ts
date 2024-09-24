import "dotenv/config";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";

import TwilioServices, { ItwilioConfig } from "./services/twilio.service";

import openaiService from "./services/openai.service";

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const twilioConfig: ItwilioConfig = {
  accountSid: process.env.ACCOUNT_SID as string,
  authToken: process.env.AUTH_TOKEN as string,
};
const whatsAppNumber: string = process.env.WHATSAPP_NUMBER as string;
const twilioService: TwilioServices = new TwilioServices(
  twilioConfig,
  whatsAppNumber
);

app.post("/chat/send", async (req: Request, res: Response): Promise<void> => {
  const { to, body } = req.body;
  try {
    await twilioService.sendWhatsAppMensseger(`whatsapp:${to}`, body);
    res.status(200).json({ success: true, body });
    console.log(
      "app.post ➜ twilioService.sendWhatsAppMensseger:",
      twilioService.sendWhatsAppMensseger(`whatsapp:${to}`, body)
    );
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

app.post(
  "/chat/receive",
  async (req: Request, res: Response): Promise<void> => {
    const twilioRequestBody: any = req.body;
    const messageBody: string = twilioRequestBody.Body;

    const to: string = twilioRequestBody.From;

    try {
      const completion = await openaiService.getOpenAICompletion(messageBody);
      await twilioService.sendWhatsAppMensseger(to, completion);
      res.status(200).json({ success: true, body: messageBody });
    } catch (error: unknown) {
      console.error(error);
    }
  }
);

const port: number | string = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
