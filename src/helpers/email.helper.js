import { createTransport } from "nodemailer";

const transport = createTransport({
    host: "smtp.gmail.com", // Vamos a usar el servicio de Gmail
    port: 465, // El que normalmente se usar
    secure: true, // Tratamos de que no entre en SPAM
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASS,
    },
});

export const sendEmail = async (data) => {
    try {
        transport.sendMail({
            to: data.email || process.env.GOOGLE_EMAIL,
            from: data.from || process.env.GOOGLE_EMAIL,
            subject: data.subject || "test subject",
            html: data.body || "test body",
        });
    } catch (error) {
        console.log("Ocurrio un error al enviar el correo:", error);
    }
};

export const testEmail = async () => {
    await sendEmail({
        from: "Serivio de prueba de correos",
        subject: "Prueba de integridad de servicio",
        body: `
        <div class="container">
            <h1 class="header">¡Hola!</h1>
            <p>Este es un correo de prueba para verificar que todo está funcionando correctamente.</p>
            <p>Si recibiste este mensaje, significa que el sistema de envío de correos está activo y operativo.</p>
            <a href="#" class="button">Visitar el sitio</a>
            <div class="footer">
            <p>Este es un mensaje automático, por favor no responder.</p>
            </div>
        </div>
        `,
    });
};

export const sendVerificationEmail = async ({ email, verificationCode }) => {
    await sendEmail({
        email,
        from: "Servicio de verificación de cuenta",
        subject: "Verificá tu correo electrónico",
        body: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto;">
                <h1 style="color: #4CAF50;">¡Verificá tu cuenta!</h1>
                <p>Gracias por registrarte. Para completar tu registro, ingresá el siguiente código de verificación en la página:</p>

                <div style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; border: 2px dashed #4CAF50; color: #333; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
                    ${verificationCode}
                </div>

                <p>Este código tiene una validez limitada. Si no solicitaste este registro, podés ignorar este mensaje.</p>

                <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
                    <p>Este es un mensaje automático, por favor no responder.</p>
                </div>
            </div>
        </div>
        `,
    });
};

export default sendEmail;
