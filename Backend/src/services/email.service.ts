import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP Server ready");
  }
});


export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Just My Rides" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Just My Rides | Registration Verification",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <h2 style="color: #222; text-align: center; margin-bottom: 20px;">
            Welcome to Just My Rides!
          </h2>

          <p style="color: #555; font-size: 15px;">
            Hello,
          </p>

          <p style="color: #555; font-size: 15px;">
            Use the following One-Time Password (OTP) to verify your account. 
            This OTP is valid for <b>5 minutes</b>.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="
              display: inline-block;
              padding: 14px 28px;
              font-size: 22px;
              font-weight: bold;
              letter-spacing: 4px;
              color: #ffffff;
              background-color: #0d6efd;
              border-radius: 6px;
            ">
              ${otp}
            </span>
          </div>

          <p style="color: #777; font-size: 14px;">
            If you did not request this OTP, please ignore this email. Your account remains secure.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Just My Rides. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
};



