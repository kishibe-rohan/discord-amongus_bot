require("dotenv").config();

const { Client } = require("discord.js");
const client = new Client({
  partials: ["MESSAGE", "REACTION"], //enable partials to handle uncached data
});

const PREFIX = "$"; //prefix for custom commands

//EVENT LISTENERS

//console log bot tag upon login
client.on("ready", () => {
  console.log(`${client.user.tag}`);
});

client.on("message", (message) => {
  if (message.author.bot) return; //make sure the message is from a human

  //detect commands and perform actions
  if (message.content.startsWith(PREFIX)) {
    //extract the command name and the arguments
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    //eject an impostor/user from the channel
    if (CMD_NAME === "voteout") {
      if (args.length === 0)
        return message.reply("Please provide Imposter's ID");

      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) =>
            message.channel.send(
              `${member.displayName} was ejected.. ${message.guild.memberCount} crewmates remain`
            )
          )
          .catch((err) =>
            message.channel.send(
              "I do not have authority to perform this action :( "
            )
          );
      } else {
        message.channel.send("Member not found");
      }
    }
  }

  //greet the user when the user sends a "Hello" on the channel
  if (message.content.toLowerCase() === "hello") {
    message.channel.send(`Hi ${message.author.username}`);
  }
});

//assign roles according to emoji
client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "767433894369951795") {
    switch (name) {
      case "🕵️":
        member.roles.add("767432779746770985");
        break;

      case "🤡":
        member.roles.add("767432955915927572");
        break;

      case "🍴":
        member.roles.add("767433117228204062");
        break;

      case "😵":
        member.roles.add("767433035989385228");
        break;
    }
  }
});

//remove roles upon removing emoji
client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "767433894369951795") {
    switch (name) {
      case "🕵️":
        member.roles.remove("767432779746770985");
        break;

      case "🤡":
        member.roles.remove("767432955915927572");
        break;

      case "🍴":
        member.roles.remove("767433117228204062");
        break;

      case "😵":
        member.roles.remove("767433035989385228");
        break;
    }
  }
});

//BOT GOES ONLINE
client.login(process.env.DISCORDJS_BOT_TOKEN);
