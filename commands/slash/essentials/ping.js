const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get api latency')
		.addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response')),
	async execute(interaction) {

		if (interaction.options.getBoolean('ephemeral')) {
			await interaction.deferReply({ ephemeral: true });
		} else {
			await interaction.deferReply();
		}

		const { version } = require("../../../package.json")

		
		const uptime = Math.floor(Date.now() / 1000) - Math.floor(process.uptime())
		const embed = new EmbedBuilder()
			.setTitle("📡 Pong!")
			.addFields(
				{ name: `📶 Websocket Latency`, value: `- \`${interaction.client.ws.ping}ms\`` },
				{ name: `🕒 Uptime`, value: `- <t:${uptime}> <t:${uptime}:R>`},
			)
			.setFooter({ text: `${interaction.client.user.username} V${version} - Requested by ${interaction.member.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setTimestamp()

		await interaction.editReply({ embeds: [embed] })
	},
};


