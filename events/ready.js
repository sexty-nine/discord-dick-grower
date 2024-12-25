const logger = require('../functions/logging.js')
const { REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: "ready",
    once: true,
	async execute(c) {
        logger.log(`${c.user.username} is ready`)

        await mongoose.connect(c.config.databaseUri).then(async () => {
            logger.info('Connected to the database')
        }).catch(async (err) => {
            logger.error(err)
            throw new Error('Could not connect to the database')
        })

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
        const rest = new REST().setToken(c.config.token);

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
    },
};