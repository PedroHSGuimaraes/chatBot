import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";

import TwilioServices from "./services/twilio.service";
import dotenv from "dotenv";

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const twilioConfig = {
  accountSid: process.env.ACCOUNT_SID as string,
  authToken: process.env.AUTH_TOKEN as string,
};
const whatsAppNumber = process.env.WHATSAPP_NUMBER as string;
const twilioService = new TwilioServices(twilioConfig, whatsAppNumber);

app.post("/chat/send", async (req: Request, res: Response) => {
  const { to, body } = req.body;
  try {
    await twilioService.sendWhatsAppMensseger(`whatsapp:${to}`, body);
    res.status(200).json({ success: true, body });
    console.log(
      "app.post ➜ twilioService.sendWhatsAppMensseger:",
      twilioService.sendWhatsAppMensseger(`whatsapp:${to}`, body)
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const port: number | string = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
