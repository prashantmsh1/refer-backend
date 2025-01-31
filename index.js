import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { sendMail } from "./mail.js";
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.post("/", (req, res) => {});
app.post("/api/referral", async (req, res) => {
    try {
        const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
        console.log(req.body);
        if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const referrer = await prisma.referral.create({
            data: {
                referrerName: referrerName,
                referrerEmail: referrerEmail,
                refereeName: refereeName,
                refereeEmail: refereeEmail,
            },
        });

        if (!referrer) {
            return res.status(500).json({ error: "Something went wrong" });
        }
        if (referrer) {
            sendMail({ data: referrer })
                .then((result) => console.log(result))
                .catch((error) => console.log(error));
        }
        console.log(referrer);
        return res.status(201).json(referrer);
    } catch (error) {
        res.status(500).json(error);
    }
});
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
