const logger = require('../functions/logging.js')
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require("../config.js")

module.exports = {
	name: "ready",
    once: true,
	async execute(c) {
        logger.log(`${c.user.username} is ready`)
        const clientId = c.user.id
        const commands = [];
        // Grab all the command folders from the commands directory you created earlier
        const foldersPath = path.join(__dirname, '../commands/slash');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory you created earlier
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
            }
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(token);

        try {
            logger.log(`Started loading ${commands.length} (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            logger.log(`Successfully reloaded ${data.length} (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            logger.error(error);
        }


        const filePath = path.join(__dirname, '../messages/embeds');
        const files = fs.readdirSync(filePath);

        setInterval(async () => {
            for (const file of files) {
                const fPath = path.join(filePath, file);
                const f = require(fPath);
                f(c)
            }
        }, 30000)

    },
};