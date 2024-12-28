const { SlashCommandBuilder, ButtonStyle, ApplicationIntegrationType, InteractionContextType } = require("discord.js")
const { Pagination } = require('pagination.djs');

const { getAllContributors } = require('../../../functions/contributers.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('contributers')
		.setDescription('See how many people have contributed to this open-source project')
        .addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response'))
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
		.setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),
	async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

        const contributers = await getAllContributors('mohammad87115/discord-dick-grower');

        new Pagination(interaction, {
            idle: 60000,
            ephemeral: ephemeral
        }).setButtonAppearance({
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
            }})
            .setTitle('Contributers')
            .setEmbeds(contributers)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .render()

	},
};