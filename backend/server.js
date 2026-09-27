//@ts-nocheck
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Ember & Oak backend is running"
  });
});

app.post("/api/reservations", async (req, res) => {
  const {
    name,
    email,
    phone,
    guests,
    date,
    time
  } = req.body;

  if (!name || !email || !phone || !guests || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "All reservation fields are required."
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.COMPANY_EMAIL,
      replyTo: email,
      subject: "New Ember & Oak Reservation",
      text: `
New reservation request

Name: ${name}
Email: ${email}
Phone: ${phone}
Number of Guests: ${guests}
Date: ${date}
Time: ${time}
      `
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Ember & Oak Reservation Confirmation",
      text: `
Hello ${name},

Your reservation request has been received successfully.

Reservation Details:
Number of Guests: ${guests}
Date: ${date}
Time: ${time}

Thank you for choosing Ember & Oak Café & Bistro.
We look forward to welcoming you.
      `
    });

    res.status(200).json({
      success: true,
      message: "Reservation submitted successfully."
    });

  } catch (error) {
    console.error("Email sending error:", error);

    res.status(500).json({
      success: false,
      message: "Reservation received, but email could not be sent."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Ember & Oak backend running on http://localhost:${PORT}`);
});