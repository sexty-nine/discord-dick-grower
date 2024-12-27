const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js")

const slashCommandLoader = require('../../../handlers/client/slashCommands.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reload the commands')
        .addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response'))
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
		.setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),
	async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

        if (interaction.user.id !== interaction.client.config.ownerId) return await interaction.editReply("No")

        await slashCommandLoader(interaction.client)
		
		const embed = new EmbedBuilder()
			.setTitle('Reloaded')
			.setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setTimestamp()

		await interaction.editReply({ embeds: [embed] })

	},
};