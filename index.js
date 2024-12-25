// Importing discord.js, chalk & logger
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const logger = require("./functions/logging.js");
const chalk = require("chalk");
const fs = require('node:fs');
// Creating a new Client

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

/* ----- Variables ----- */

client.commands = new Collection();
client.messageCommands = new Collection();
client.cooldowns = new Collection();
client.config = require("./utils/config.js");
client.logger = new logger

// some prototypes for making the code more readable

Array.prototype.random = function () {
    return this[ Math.floor((Math.random() * this.length)) ];
}

/* ----- Handlers ----- */

const handlerFolders = fs.readdirSync('./handlers');
for (const folder of handlerFolders) {
    const handlerFiles = fs.readdirSync(`./handlers/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of handlerFiles) {
        const handler = require(`./handlers/${folder}/${file}`);
        handler(client);
        logger.log(`(./handlers/${folder}/${file}) Loaded!`)
    }
}

/* ----- Anti Crash -----*/
process.on("unhandledRejection", (reason, p) => {
    console.log(chalk.gray("————————————————————————————————————————————————————"));
    console.log(
        chalk.white("["),
        chalk.red.bold("AntiCrash"),
        chalk.white("]"),
        chalk.gray(" : "),
        chalk.white.bold("Unhandled Rejection/Catch")
    );
    console.log(chalk.gray("————————————————————————————————————————————————————"));
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(chalk.gray("————————————————————————————————————————————————————"));
    console.log(
        chalk.white("["),
        chalk.red.bold("AntiCrash"),
        chalk.white("]"),
        chalk.gray(" : "),
        chalk.white.bold("Uncaught Exception/Catch")
    );
    console.log(chalk.gray("————————————————————————————————————————————————————"));
    console.log(err, origin);
});


/* ----- Logging in ----- */
logger.log("Trying to login with the token ...")
client.login(client.config.token)
