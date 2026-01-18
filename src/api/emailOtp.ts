const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE USED =", API_BASE);


export const sendEmailOtp = async (
  email: string,
  purpose: "login" | "signup"
) => {
  const res = await fetch(`${API_BASE}/api/auth/send-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
  });

  if (!res.ok) {
    let message = "Failed to send OTP";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // 👈 backend sent no JSON → ignore safely
    }

    throw new Error(message);
  }

  return true;
};

console.log("API_BASE USED =", API_BASE);


interface VerifyOtpPayload {
  email: string;
  otp: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const res = await fetch(`${API_BASE}/api/auth/verify-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Invalid OTP";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // 👈 backend sent no JSON
    }

    throw new Error(message);
  }

  return true;
};
