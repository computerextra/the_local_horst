import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import nodemailer from "nodemailer"
import { env } from "@/env";

const MailConfig = z.object({
    host: z.string(),
    port: z.number().int(),
    auth: z.object({
      user: z.string(),
      pass: z.string(),
    }),
  });
  
  const Config = MailConfig.parse({
    host: env.EMAIL_SERVER_HOST,
    port: parseInt(env.EMAIL_SERVER_PORT),
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });
  type MailConfig = z.infer<typeof MailConfig>;

export const mailRouter = createTRPCRouter({
  paypal: publicProcedure
    .input(z.object({ 
        username: z.string(),
        schuldner: z.string(),
        geld: z.string(),
     }))
    .mutation(async ({ ctx, input }) => {
      const Mitarbeiter = await ctx.db.mitarbeiter.findUnique({
        where: {
            id: input.schuldner
        }
      })
      if (Mitarbeiter == null){
        return "Fehler"
      }
      if (Mitarbeiter.Email == null) return "Fehler"

      const PaypalLink = `https://paypal.me/${input.username}/${input.geld}`;
      const QRCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${PaypalLink}`;
      const body = `<h1>Hallo ${Mitarbeiter.Name}</h1><p>Bitte bezahle ${input.geld}€ über Paypal.</p><p>Link: ${PaypalLink}</p><p>Oder ganz Einfach mit dem Smartphone. Dafür einfach den QR-Code scannen</p><p><img src="${QRCode}"></p>`;

      const Transporter = nodemailer.createTransport(Config);
      const Message = {
        from: env.EMAIL_FROM,
        to: Mitarbeiter.Email,
        subject: "Abrechnung Paypal",
        html: body,
      };
      const res = await Transporter.sendMail(Message);
      if (res.response.includes("Ok")) {
        return "Ok";
      } else {
        return "Fehler";
      }
    }),

  

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
