require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const YOUR_EMAIL = process.env.YOUR_EMAIL;
const PDF_LINK = process.env.PDF_LINK;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-pdf-link', async (req, res) => {
  const { email, message, options } = req.body;

  const adminMessage = `
    New PDF request:
    Email: ${email}
    Options: ${options.join(', ')}
    Message: ${message}
  `;

  try {
    await transporter.sendMail({
      from: 'PDF Bot <' + process.env.EMAIL_USER + '>',
      to: YOUR_EMAIL,
      subject: 'New PDF Request',
      text: adminMessage
    });

    await transporter.sendMail({
      from: 'PDF Bot <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Your PDF Download Link',
      text: `Thanks for your request! You can download your PDF here:
${PDF_LINK}`
    });

    res.json({ message: 'Email sent! Check your inbox.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
