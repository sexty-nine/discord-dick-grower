const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
const slashCommandLoader = require('../../../handlers/client/slashCommands.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands!')
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild])
            .addSubcommand((sub) => sub
                .setName('reload')
                .setDescription('Reloads a command!')

                .addStringOption(option => 
                    option
                        .setName('command')    
                        .setDescription('The command to be restarted')
                        .setRequired(true),
        
                    )
                .addBooleanOption(option => option
                    .setName('ephemeral')
                    .setDescription('Only you can see the response')
                )
            ),

        async execute(interaction) {

            const subCommand = interaction.options.getSubcommand();

            switch (subCommand){
                case 'reload':
                    const ephemeral = interaction.options.getBoolean('ephemeral');
                    await interaction.deferReply({ ephemeral });
            
                    // Checks if the user is the owner or not
                    if (interaction.user.id !== interaction.client.config.ownerId) return await interaction.editReply("No")
            
                    await slashCommandLoader(interaction.client)
                    
                    const embed = new EmbedBuilder()
                        .setTitle('Reloaded')
                        .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()
            
                    await interaction.editReply({ embeds: [embed] })
            }
        }
            
}