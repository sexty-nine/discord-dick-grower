// Importing discord.js, chalk & logger
import { Client, GatewayIntentBits, Collection } from "discord.js";
import logger from "./functions/logging.js";
import chalk from "chalk";
import fs from 'node:fs';



declare module "discord.js" {
    export interface Client {
      commands: Collection<string, any>;
      messageCommands: Collection<string, any>;
      coolDowns: Collection<string , number>;
      config: any
      logger: logger
    }
  }

// Creating a new Client

const client:Client = new Client({
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
client.coolDowns = new Collection();
client.config = require("./utils/config");
client.logger = new logger


// some prototypes for making the code more readable

// TODO fix this 
/*
Array.prototype.random = function () {
    return this[ Math.floor((Math.random() * this.length)) ];
}
*/

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
