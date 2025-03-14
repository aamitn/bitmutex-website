import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { eventEmitter } from "./events"; // ✅ Import event emitter

let io; // Declare io globally

// ✅ Wait for Strapi io to be ready
eventEmitter.on("ioReady", (ioInstance) => {
  io = ioInstance;
  console.log("✅ WebSocket (io) is now available in Discord bot");
});

const bot = new Client({ 
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages, 
      GatewayIntentBits.MessageContent, 
      GatewayIntentBits.GuildPresences,  // ✅ Required for presence (online/offline) detection
      GatewayIntentBits.GuildMembers     // ✅ Allows fetching user details
    ]
  });
  
  bot.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
  
    console.log("📩 Admin reply received:", message.content);
  
    const match = message.content.match(/^@wsid:([\w-]+|all)\s(.+)$/);
    if (match) {
      const wsid = match[1];
      const replyText = match[2];
  
      if (!io) {
        console.error("❌ Error: WebSocket (io) is not initialized yet.");
        return;
      }
  
      const userId = message.author.id;
      const guild = bot.guilds.cache.get(process.env.DISCORD_GUILD_ID);
  
      if (!guild) {
        console.error("❌ Error: Guild not found.");
        return;
      }
  
      // ✅ Check if the Discord user is online
      const member = await guild.members.fetch(userId).catch(() => null);
      const isUserOnline = member?.presence?.status !== "offline";
  
      if (isUserOnline) {
        if (wsid === "all") {
          io.emit("adminMessage", { text: replyText, sender: "admin" });
          console.log("✅ Broadcast message sent to all visitors.");
        } else {
          const visitorSocket = io.sockets.sockets.get(wsid);
          if (visitorSocket) {
            visitorSocket.emit("adminMessage", { text: replyText, sender: "admin" });
            console.log(`✅ Reply sent to visitor WebSocket ID: ${wsid}`);
          }
        }
      } else {
        // Auto-reply to all visitors if the user is offline
        const autoReplyText = "The admin is currently offline. If you need assistance, please try again later.";
        io.emit("adminMessage", { text: autoReplyText, sender: "system" });
        console.log(`⚠️ Admin is offline. Auto-reply sent to all visitors.`);
      }
    }
  });
  
  bot.login(process.env.DISCORD_BOT_TOKEN);

  export { bot };
