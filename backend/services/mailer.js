const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS)')
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return transporter
}

async function sendMail({ to, subject, html, text, replyTo }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const tx = getTransporter()
  const info = await tx.sendMail({ from, to, subject, html, text, ...(replyTo ? { replyTo } : {}) })
  return info
}

module.exports = { sendMail }
