const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get api latency')
        .addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response'))
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

        const { version } = require("../../../package.json");

        const uptime = Math.floor(Date.now() / 1000) - Math.floor(process.uptime());

        // Measure database ping
        const dbStart = Date.now();
        await mongoose.connection.db.command({ ping: 1 });
        const dbPing = Date.now() - dbStart;

        // Determine the quality of the database ping
        const dbQuality = dbPing < 100 ? '🟢 Excellent' : dbPing < 200 ? '🟡 Good' : '🔴 Poor';

        const embed = new EmbedBuilder()
            .setTitle("📡 Pong!")
            .addFields(
                { name: `📶 Websocket Latency`, value: `- \`${interaction.client.ws.ping}ms\`` },
                { name: `🕒 Uptime`, value: `- <t:${uptime}> <t:${uptime}:R>`},
                { name: `💾 Database Response time`, value: `- \`${dbPing}ms\` (${dbQuality})` }
            )
            .setFooter({ text: `${interaction.client.user.username} V${version} - Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};


