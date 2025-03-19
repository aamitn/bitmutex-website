import { factories } from "@strapi/strapi";

// export default factories.createCoreRouter("api::appointment.appointment");

export default {
    routes: [
      {
        method: "POST",
        path: "/cal-webhook",
        handler: "appointment.handleWebhook",
        config: {
          auth: false, // Make it public
        },
      },
    ],
  };