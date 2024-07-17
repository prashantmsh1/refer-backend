import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

oAuth2Client.setCredentials({ refresh_token: refreshToken });

export const sendMail = async ({ data }) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = data;
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "prashantkr.msh@gmail.com",
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: "Prashan <prashantkr.msh@gmail.com>",
            to: refereeEmail,
            subject: "Hello from nodemailer",
            text: "Hello from nodemailer I am sending this mail using nodemailer",
            html:
                "<h1>Hello from nodemailer</h1><p>You have been successfully referred by</p>" +
                referrerName,
        };
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};
