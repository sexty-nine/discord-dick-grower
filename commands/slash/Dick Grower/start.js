const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
const Dick = require('../../../database/schemas/Dick.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start growing your dick!')
        .addStringOption((option) => option.setName('name').setDescription('Whats his name? (your dick i mean)'))
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

        if (dick) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`⚠️ You already have a dick here. His name's \`${dick.name}\``)
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] });
            return
        }

        const name = interaction.options.getString('name') ?? require('../../../utils/first-names.json').random()

        const newDick = await Dick.create({
            chatId: chatId,
            userId: interaction.user.id,
            name: name,
            size: 0,
            nextGrowTimestamp: null,
            growTime: 12 * 60 * 60 * 1000,
            GrowMultiplier: 1,        
        })

        const embed = new EmbedBuilder()
            .setTitle('Happy new dick!')
            .setDescription('You made a new dick for this chat! Start growing it using `/grow`')
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()

        await interaction.editReply({ embeds: [embed] });
    },
};


