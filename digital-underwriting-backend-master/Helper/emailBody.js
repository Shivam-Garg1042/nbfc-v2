import transporter from "./transporterEmail.js";

export default async function emailBody({ email, password, name }) {
  const mailOptions = {
    from: process.env.HOST_AUTH_EMAIL,
    to: email,
    subject: "Welcome To Digital Underwriting Module.",
    html: `<p>Hello <strong>${name}</strong>,</p>
            <p>We're thrilled to have you onboard.</p>
                <p>User Id: ${email}</p>
                <p>Password: ${password}</p>

            <p>Best regards,<br>Chargeup.</p>`,
  };

  return await transporter.sendMail(mailOptions);
}
