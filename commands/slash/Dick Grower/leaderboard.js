const { SlashCommandBuilder, ButtonStyle, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
const Dick = require('../../../database/schemas/Dick.js');
const { Pagination } = require('pagination.djs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Top well lengthed dicks in this chat')
        .addBooleanOption(option => option.setName('ephemeral').setDescription('Only you can see the response'))
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

        const chatId = interaction.guildId ?? interaction.channelId;
        const dicks = await Dick.find({ chatId }).exec();

        dicks.sort((a, b) => b.size - a.size);

        const leaderboard = await Promise.all(dicks.map(async (dick, index) => {
            const user = await interaction.client.users.fetch(dick.userId);
            return {
            name: `${index + 1}. ${user.displayName}`,
            value: `Length: **${dick.size} cm**, Grown today: ${dick.nextGrowTimestamp > Date.now() ? '**Yes**' : '**No**'}`
            };
        }));
        
        const pagination = new Pagination(interaction, {
            limit: 20,
            idle: 60000,
            ephemeral: ephemeral
        })
            .setButtonAppearance({
                first: {
                    label: '<<',
                    emoji: '',
                    style: ButtonStyle.Primary
                },
                prev: {
                    label: '<',
                    emoji: '',
                    style: ButtonStyle.Secondary
                },
                next: {
                    label: '>',
                    emoji: '',
                    style: ButtonStyle.Secondary
                },
                last: {
                    label: '>>',
                    emoji: '',
                    style: ButtonStyle.Primary
                }
            })
            .setTitle('Dick Length Leaderboard')
            .setFields(leaderboard)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .paginateFields(true)
            .render()

    },
};

