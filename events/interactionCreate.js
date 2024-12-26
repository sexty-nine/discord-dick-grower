// registering an event to handle slash commands
const logger = require('../functions/logging.js')
module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                await interaction.reply({ content: `No command found named \`${interaction.commandName}\``, ephemeral: true });
                return;
            }
        
            try {
                await command.execute(interaction);
            } catch (error) {
                let msg = 'Error while executing command'

                if (error.rawError?.message === 'Missing Permissions' || error.rawError?.message === 'Message was blocked by AutoMod') msg += '\n\nNote that this error can be caused by the automoderation system filtering bots messages (you can use the ephemeral mode if thats the case)'
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: msg, ephemeral: true });
                } else {
                    await interaction.reply({ content: msg, ephemeral: true });
                }
                logger.error(error)
                console.error(error)
            }
        }
	},
};