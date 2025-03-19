import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::appointment.appointment",
  ({ strapi }) => ({
    async createFromWebhook(ctx) {
      try {
        const { triggerEvent, payload } = ctx.request.body;

        if (triggerEvent === "BOOKING_CREATED") {
          const existingAppointment = await strapi.entityService.findMany(
            "api::appointment.appointment",
            { filters: { calId: payload.uid } }
          );

          if (existingAppointment.length === 0) {
            const newAppointment = await strapi.entityService.create(
              "api::appointment.appointment",
              {
                data: {
                  calId: payload.uid,
                  userName: payload.responses.name.value,
                  email: payload.responses.email.value,
                  date_time: payload.startTime,
                  appointment_status: "confirmed", // Ensure this exists in Strapi Enumeration
                },
              }
            );

            return ctx.send({ message: "Appointment Created", data: newAppointment });
          } else {
            return ctx.send({ message: "Appointment already exists" });
          }
        } else {
          return ctx.badRequest("Invalid webhook event.");
        }
      } catch (error) {
        strapi.log.error("Webhook Error:", error);
        return ctx.internalServerError("Webhook processing failed.");
      }
    },
  })
);
