import nodemailer from "nodemailer"

const sendPasswordResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    const resetUrl = `http://localhost:3000/reset-password/${token}`
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Restablecer contraseña",
        html: `
            <h1>Restablecer Contraseña</h1>
            <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetUrl}">Restablecer mi Contraseña</a>
            <p>Este enlace expirará en una hora.</p>
        `
    }
    await transporter.sendMail(mailOptions)
}

export default sendPasswordResetEmail