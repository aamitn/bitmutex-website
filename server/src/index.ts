import { Server } from "socket.io";
import axios from "axios";
import { eventEmitter } from "./events";
import { bot } from "./discord-bot"; // ✅ Import the bot instance

export default {
  register() {},

  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, { cors: { origin: "*" } });

    strapi.io = io;
    const connectedClients = new Map();

    eventEmitter.emit("ioReady", io);

    io.on("connection", (socket) => {
      console.log("✅ Visitor connected:", socket.id);
      connectedClients.set(socket.id, socket);

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

        // ✅ Always send message to Discord, adding [missed message] if admin is offline
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

        // ❌ If admin is offline, send auto-reply to visitor
        if (!isAdminOnline) {
          const autoReplyText = "The admin is currently offline. Your message has been forwarded.";
          socket.emit("adminMessage", { text: autoReplyText, sender: "system" });
          console.log(`⚠️ Admin is offline. Auto-reply sent to visitor ${socket.id}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Visitor disconnected:", socket.id);
        connectedClients.delete(socket.id);
      });
    });
  },
};
