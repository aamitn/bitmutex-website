/**
 * appointment controller
 */

import { factories } from "@strapi/strapi";

// Jitsi Meet base URL
const JITSI_MEET_URL = "https://meet.jit.si/";

export default factories.createCoreController("api::appointment.appointment", ({ strapi }) => ({
  async create(ctx) {
    const { guest_name, guest_email, date_time } = ctx.request.body;

    // Get authenticated user if available
    const user = ctx.state.user;

    if (!guest_name && !user) {
      return ctx.badRequest("Guest name is required if not logged in.");
    }

    if (!guest_email && !user) {
      return ctx.badRequest("Guest email is required if not logged in.");
    }

    // Generate a Jitsi meeting link
    const meetingId = `appointment-${Date.now()}`;
    const meeting_link = `${JITSI_MEET_URL}${meetingId}`;

    // Construct data for saving
    const appointmentData = {
      user: user ? user.id : null,
      guest_name: guest_name || null,
      guest_email: guest_email || null,
      date_time,
      meeting_link,
      appointment_status: "pending",
    };

    // Save to Strapi database
    const appointment = await strapi.entityService.create("api::appointment.appointment", {
      data: appointmentData,
    });

    return appointment;
  },
}));
