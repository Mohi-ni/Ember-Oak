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
app.post("/api/contact", async (req, res) => {
  const {
    name,
    email,
    phone,
    subject,
    message
  } = req.body;

  // Check that all fields are strings
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "All contact fields are required."
    });
  }

  // Remove unnecessary spaces
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanPhone = phone.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  // Check for empty values
  if (
    !cleanName ||
    !cleanEmail ||
    !cleanPhone ||
    !cleanSubject ||
    !cleanMessage
  ) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty."
    });
  }

  // Length validation
  if (cleanName.length < 3 || cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Name must be between 3 and 100 characters."
    });
  }

  if (cleanEmail.length > 150) {
    return res.status(400).json({
      success: false,
      message: "Email address is too long."
    });
  }

  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be between 10 and 15 characters."
    });
  }

  if (cleanSubject.length < 3 || cleanSubject.length > 150) {
    return res.status(400).json({
      success: false,
      message: "Subject must be between 3 and 150 characters."
    });
  }

  if (cleanMessage.length < 10 || cleanMessage.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "Message must be between 10 and 2000 characters."
    });
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }

  // Phone validation
  const phonePattern = /^[0-9+\-\s()]{10,15}$/;

  if (!phonePattern.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number."
    });
  }

  try {
    // Send message to Ember & Oak
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.COMPANY_EMAIL,
      replyTo: cleanEmail,
      subject: `Ember & Oak Contact: ${cleanSubject}`,
      text: `
New contact message from Ember & Oak website

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone}
Subject: ${cleanSubject}

Message:
${cleanMessage}
      `
    });

    // Send confirmation to the visitor
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: cleanEmail,
      subject: "Ember & Oak - Message Received",
      text: `
Hello ${cleanName},

Thank you for contacting Ember & Oak Café & Bistro.

We have received your message successfully. Our team will review it and get back to you soon.

Subject: ${cleanSubject}

Thank you,
Ember & Oak Café & Bistro
      `
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully."
    });

  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Ember & Oak backend running on http://localhost:${PORT}`);
});