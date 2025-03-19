import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::appointment.appointment",
  ({ strapi }) => ({
    async handleWebhook(ctx) {
      try {
        const { event, payload } = ctx.request.body;

        if (!payload || !payload.id) {
          return ctx.badRequest("Invalid webhook payload");
        }

        // Check if the appointment already exists
        const existingAppointments = await strapi.entityService.findMany(
          "api::appointment.appointment",
          { filters: { calId: payload.id } }
        );

        const updateData: Partial<Record<string, any>> = {}; // Ensure TypeScript allows the status field

        if (event === "booking.created") {
          if (existingAppointments.length === 0) {
            await strapi.entityService.create("api::appointment.appointment", {
              data: {
                calId: payload.id,
                userName: payload.name,
                email: payload.email,
                date_time: payload.startTime,
                appointment_status: "confirmed", // Ensure this exists in the content-type
              } as any, // Explicit cast if TypeScript still complains
            });
          }
        } else if (event === "booking.updated") {
          if (existingAppointments.length > 0) {
            updateData.status = "updated";
          }
        } else if (event === "booking.canceled") {
          if (existingAppointments.length > 0) {
            updateData.status = "canceled";
          }
        }

        if (existingAppointments.length > 0) {
          await strapi.entityService.update(
            "api::appointment.appointment",
            existingAppointments[0].id,
            { data: updateData as any } // Explicitly cast to `any`
          );
        }

        ctx.send({ message: "Webhook processed successfully" });
      } catch (error) {
        strapi.log.error("Webhook processing failed:", error);
        ctx.internalServerError("Webhook processing failed");
      }
    },
  })
);
