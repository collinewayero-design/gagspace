// Safe environment variable retrieval
const getEnv = (key: string, viteKey: string): string => {
  let val = '';
  try {
    if (typeof process !== 'undefined' && process.env) {
      val = process.env[key] || process.env[viteKey] || '';
    }
  } catch (e) {}

  if (!val) {
    try {
      // @ts-ignore
      if (import.meta && import.meta.env) {
        // @ts-ignore
        val = import.meta.env[viteKey] || '';
      }
    } catch (e) {}
  }
  return val;
};

const RESEND_API_KEY = getEnv('RESEND_API_KEY', 'VITE_RESEND_API_KEY');

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!RESEND_API_KEY) {
    console.warn("Resend API Key missing. Email not sent.");
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'GigSpace <onboarding@resend.dev>', // Verify a domain in Resend for production usage
        to: [to],
        subject: subject,
        html: html
      })
    });
    
    if (!response.ok) {
        const error = await response.json();
        console.error("Resend Error:", error);
    }
  } catch (error) {
    console.error("Network Error sending email:", error);
  }
};