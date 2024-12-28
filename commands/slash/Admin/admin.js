const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
const slashCommandLoader = require('../../../handlers/client/slashCommands.js')
const Dick = require('../../../database/schemas/Dick.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands!')
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild])
            .addSubcommand((sub) => sub
                .setName('reload')
                .setDescription('Reloads a command!')
                .addBooleanOption(option => option
                    .setName('ephemeral')
                    .setDescription('Only you can see the response')
                )
            ).addSubcommand(sub => sub
                .setName('set-size')
                .setDescription('Set the size of the dick of a user!')
                .addUserOption(option => option
                    .setName('user')
                    .setDescription('The user you want to set the size for')
                    .setRequired(true)
                )
                .addIntegerOption(option => option
                    .setName('size')
                    .setDescription('The size you want to set the dick to')
                    .setRequired(true)
                )
            )
            ,


        async execute(interaction) {

            const subCommand = interaction.options.getSubcommand();

            // Checks if the user is the owner or not
            if (interaction.user.id !== interaction.client.config.ownerId) return await interaction.editReply("No")

            const ephemeral = interaction.options.getBoolean('ephemeral');
            await interaction.deferReply({ ephemeral });

            switch (subCommand){
                case 'reload':

                    await slashCommandLoader(interaction.client)
                    
                    const reloadEmbed = new EmbedBuilder()
                        .setTitle('Reloaded')
                        .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()
            
                    await interaction.editReply({ embeds: [reloadEmbed] })

                    break

                case 'set-size':

                    const chatId = interaction.guildId ?? interaction.channelId;
                    const user = interaction.options.getUser('user');
                    const size = interaction.options.getInteger('size');

                    const dick = await Dick.findOne({
                        chatId:chatId,
                        userId: user.id,
                    }).exec()

                    await dick.updateOne({
                        size:size
                    })

                    const sizeSetEmbed = new EmbedBuilder()
                        .setTitle('Success')
                        .setDescription(`You successfully set the dick size of <@${user.id}> to **${size}**`)
                        .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()

                    await interaction.editReply({ embeds:[sizeSetEmbed] })

                    break

                    
                    

            }
        }
            
}