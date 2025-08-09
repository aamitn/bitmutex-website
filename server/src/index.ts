import { Server } from "socket.io";
import axios from "axios";
import { eventEmitter } from "./events";
import { bot } from "./discord-bot";

export default {
  register() {},

  async bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, { cors: { origin: "*" } });
    strapi.io = io;
    const connectedClients = new Map();
    let liveUserCount = 0;

    eventEmitter.emit("ioReady", io);

    io.on("connection", (socket) => {
      connectedClients.set(socket.id, socket);
      liveUserCount++;
      io.emit("liveUserCount", { count: liveUserCount });

      console.log(`✅ Visitor connected: ${socket.id} | Live Users: ${liveUserCount}`);

      socket.on("chatMessage", async (msg) => {
        console.log(`📨 Visitor Message [${socket.id}]:`, msg);

        const guild = bot.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        if (!guild) {
          console.error("❌ Error: Discord server not found.");
          return;
        }

        const adminUserId = process.env.DISCORD_ADMIN_ID;
        const admin = await guild.members.fetch(adminUserId).catch(() => null);
        const isAdminOnline = admin?.presence?.status !== "offline";

        let discordMessage = `**${msg.sender}**: ${msg.text} *(wsid:${socket.id})*`;
        if (!isAdminOnline) {
          discordMessage += " [missed message]";
        }

        await axios.post(
          `https://discord.com/api/channels/${process.env.DISCORD_CHANNEL_ID}/messages`,
          { content: discordMessage },
          { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
        );
        console.log("✅ Message sent to Discord");

        if (!isAdminOnline) {
          socket.emit("adminMessage", { text: "Our staff is currently offline. If you need assistance, please drop your message along with your email/contact details.", sender: "system" });
          console.log(`⚠️ Admin is offline. Auto-reply sent to visitor ${socket.id}`);
        }
      });

      socket.on("disconnect", () => {
        connectedClients.delete(socket.id);
        liveUserCount = Math.max(0, liveUserCount - 1);
        io.emit("liveUserCount", { count: liveUserCount });

        console.log(`❌ Visitor disconnected: ${socket.id} | Live Users: ${liveUserCount}`);
      });
    });

    
    // ✅ **Auto-Create Admin User on First Run**
    const adminExists = await strapi.db.query("admin::user").count();
    if (!adminExists) {

      
    // ✅ **Auto-Create Admin User Only if `AUTO_CREATE_ADMIN=true`**
    if (process.env.AUTO_CREATE_ADMIN !== "true") {
      console.log("ℹ️ AUTO_CREATE_ADMIN is not enabled. Skipping admin creation.");
      return;
    }

      console.log("🛠️ No admin user found. Creating default admin...");

      try {
        const superAdminRole = await strapi.db.query("admin::role").findOne({ where: { code: "strapi-super-admin" } });

        await strapi.db.query("admin::user").create({
          data: {
            email: process.env.ADMIN_EMAIL || "admin@bitmutex.com",
            firstname: "Bitmutex",
            lastname: "Admin",
            //Password  Bcrypted 10 rounds for "strapiadmin"
            password: process.env.ADMIN_PASSWORD || "$2a$10$joIlSsHxTGdb8XT7cfcVzO5JgUiQSWgbFwbNrT2D/sMbuyhc2y9zW",
            isActive: true,
            roles: [superAdminRole.id],
          },
        });

        console.log("✅ Admin user created successfully!");
      } catch (error) {
        console.error("❌ Failed to create admin user:", error);
      }
    } else {
      console.log("✅ Admin user already exists.");
    }

  },
};
