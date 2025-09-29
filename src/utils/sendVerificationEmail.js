import nodemailer from "nodemailer"

export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verifica tu cuenta',
        html: `
            <h1>Verifica tu cuenta de usuario</h1>
            <p>Gracias por registrarte. Por favor, usa el siguiente código para verificar tu cuenta:</p>
            <h2>${code}</h2>
        `
    };

    await transporter.sendMail(mailOptions);
};
