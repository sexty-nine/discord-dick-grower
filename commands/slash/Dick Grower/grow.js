const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
const Dick = require('../../../database/schemas/Dick.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grow')
        .setDescription('Grow your dick and have the longest dick in the server!')
        .addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response'))
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

        const chatId = interaction.guildId ?? interaction.channelId;

        const dick = await Dick.findOne({
            chatId: chatId,
            userId: interaction.user.id
        }).exec()

        if (!dick) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`⚠️ You don't have a dick here. Create one by using \`/start\``)
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
            
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const date = new Date().getTime()

        if (dick.nextGrowTimestamp > date) {
            const timeLeft = Math.floor((dick.nextGrowTimestamp - date) / 1000) // Convert milliseconds to seconds
            
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`⚠️ You need to wait for <t:${Math.floor(date / 1000) + timeLeft}:R>`) // Use Discord's relative time format
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()

            await interaction.editReply({ embeds: [embed] });
            return;
    
        }

        const increment = Math.floor(Math.random() * 16) * dick.growMultiplier;

        const newDick = await dick.updateOne({
            size: dick.size + increment,
            nextGrowTimestamp: date + dick.growTime
        })

        const embed = new EmbedBuilder()
            .setTitle('Congrats')
            .setDescription(`You added **${increment} cm** to your dick.\nNow you got a **${dick.size + increment} cm** dick.`)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()

        await interaction.editReply({ embeds: [embed] });
    },
}
