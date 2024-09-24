import twilio, { Twilio } from "twilio";

interface ItwilioConfig {
  accountSid: string;
  authToken: string;
}

class TwilioServices {
  private client: Twilio;
  whatsAppNumber: string;

  constructor(config: ItwilioConfig, whatsAppNumber: string) {
    this.client = twilio(config.accountSid, config.authToken);
    this.whatsAppNumber = whatsAppNumber;
  }

  public async sendWhatsAppMensseger(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        to: to,
        from: this.whatsAppNumber,
        body: body,
      });
      console.log(`Mensagem enviada para ${to}: ${body}`);
    } catch (error) {
      console.error(`Error while sending message to ${to}: ${error}`, error);
    }
  }
}

export default TwilioServices;
