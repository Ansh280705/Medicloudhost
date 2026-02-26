import twilio from "twilio";

/**
 * Twilio Notification Service (WhatsApp Only)
 * 
 * DESIGN PHILOSOPHY:
 * - Minimal, Singleton pattern for connection reuse.
 * - Handles India-specific constraints (prefer WhatsApp utility messages).
 * - Production-ready with fallback error logging.
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+14155238886' (sandbox) or your production number

class TwilioService {
  constructor() {
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    } else {
      console.warn("TWILIO: Missing credentials. Notifications will be logged to console only.");
    }
  }

  /**
   * Sends a WhatsApp notification to a doctor about a new appointment.
   * 
   * @param {string} to - Doctor's phone number (with country code, e.g. '+919876543210')
   * @param {Object} details - Appointment details (patientName, startTime, date)
   */
  async notifyDoctorOfAppointment(to, { patientName, startTime, date }) {
    if (!to) {
      console.error("TWILIO: Cannot send notification, doctor phone is missing.");
      return;
    }

    // Ensure 'whatsapp:' prefix
    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    
    const message = `*DoctorDesk Alert*\n\nHi Doctor, you have a new appointment!\n\n👤 *Patient:* ${patientName}\n⏰ *Time:* ${startTime}\n📅 *Date:* ${date}\n\nPlease log in to your dashboard for details.`;

    try {
      if (this.client) {
        const result = await this.client.messages.create({
          body: message,
          from: fromPhone,
          to: formattedTo,
        });
        console.log(`TWILIO: Notification sent to ${to}. SID: ${result.sid}`);
        return { success: true, sid: result.sid };
      } else {
        console.log("TWILIO (DRY RUN):", message);
        return { success: true, dryRun: true };
      }
    } catch (error) {
      console.error("TWILIO ERROR:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export const twilioService = new TwilioService();
