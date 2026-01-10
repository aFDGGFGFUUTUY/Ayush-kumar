
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import twilio from "twilio";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let messages = [
  { role: "system", content: "You are a helpful WhatsApp chatbot." }
];

app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;

  messages.push({ role: "user", content: incomingMsg });

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages
  });

  const reply = response.choices[0].message.content;
  messages.push({ role: "assistant", content: reply });

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);

  res.type("text/xml").send(twiml.toString());
});

app.listen(3000, () => {
  console.log("WhatsApp bot running on port 3000");
});
