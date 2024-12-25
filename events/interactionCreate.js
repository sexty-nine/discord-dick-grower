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
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Error while executing command', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Error while executing command', ephemeral: true });
                }
                logger.error(error)
                console.error(error)
            }
        }
	},
};