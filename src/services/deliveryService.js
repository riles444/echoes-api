const nodemailer = require('nodemailer')
const Echo = require('../models/Echo')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const deliverEcho = async (echo) => {
  try {
    const { user, type, content, mediaUrl, title } = echo

    const subject = title
      ? `Your echo: "${title}" has arrived`
      : `Your echo from ${new Date(echo.createdAt).toDateString()} has arrived`

    let html = `<p>Hi ${user.name},</p><p>A message from your past self:</p>`
    if (type === 'text') html += `<blockquote>${content}</blockquote>`
    if (mediaUrl) html += `<p><a href="${process.env.BASE_URL}${mediaUrl}">View your ${type}</a></p>`

    await transporter.sendMail({
      from: `"Echoes" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject,
      html
    })

    echo.status = 'delivered'
    echo.deliveredAt = new Date()
    await echo.save()
  } catch (error) {
    console.error(`Failed to deliver echo ${echo._id}:`, error.message)
    echo.status = 'failed'
    await echo.save()
  }
}

module.exports = { deliverEcho }
