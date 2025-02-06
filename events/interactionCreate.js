// registering an event to handle slash commands
const logger = require('../functions/logging.js')
const { EmbedBuilder } = require("discord.js")
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
            try {
            	const logEmbed = new EmbedBuilder()
            		.setAuthor({
            			name: `${interaction.user.displayName} (${interaction.user.username})`,
            			iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            		})
            		.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            		.setDescription(
                        `**User:** ${interaction.user.username}\n` +
            		    `**Display Name:** ${interaction.user.displayName}\n` +
            		    `**User ID:** ${interaction.user.id}\n` +
            		    `**Channel:** ${interaction.channel.name} (${interaction.channel.id})\n` +
            	        `**Guild:** ${interaction.guild.name} (${interaction.guild.id})`
            		)
            		.setTimestamp();

				logEmbed.addFields({ name: 'Command', value: `\`/${interaction.commandName}\`` });            	
            		                                                                          
            	interaction.options.data.forEach(option => {
            		logEmbed.addFields({
            			name: option.name,
            			value: `\`\`\`${typeof option.value === 'object' ? JSON.stringify(option.value, null, 2) : option.value}\`\`\``,
            		})
            	});

            	const user = await interaction.client.users.fetch('988433294498607115');

            	await user.send({ embeds: [logEmbed] });

			} catch {
            	"pass"
            }
        }
	},
};
