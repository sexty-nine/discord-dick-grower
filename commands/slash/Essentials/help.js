const { SlashCommandBuilder, EmbedBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js")
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get a list of the commands used to interact with the bot')
        .addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response'))
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
		.setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),
	async execute(interaction) {

        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

		const appcmds = await interaction.client.application.commands.fetch();
		
		let commands = [];

		const foldersPath = path.join(__dirname, '../');
		const commandFolders = fs.readdirSync(foldersPath);
	
		for (const folder of commandFolders) {
			if (commands.findIndex(cmd => cmd.c === folder) === -1) {
				commands.push({ c: folder, cmds: [] })
			}
			const catindex = commands.findIndex(cmd => cmd.c === folder);
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);
				if ('data' in command && 'execute' in command) {
					const cmdid = appcmds.find(c => c.name === command.data.name).id;
					if (command.data.options.every(option => !(option instanceof SlashCommandSubcommandBuilder) && !(option instanceof SlashCommandSubcommandBuilder))) {
						commands[catindex].cmds.push(`</${command.data.name}:${cmdid}>`)
					} else {
						for (const option of command.data.options) {
							if (option instanceof SlashCommandSubcommandBuilder) {
								commands[catindex].cmds.push(`</${command.data.name} ${option.name}:${cmdid}>`)
							} else
							if (option instanceof SlashCommandSubcommandGroupBuilder) {
								for (const option2 of option.options) {
									commands[catindex].cmds.push(`</${command.data.name} ${option.name} ${option2.name}:${cmdid}>`)
								}
							}	
						}
					}
				}
			}
		}
		


		const embed = new EmbedBuilder()
			.setTitle('🤔 Need help? Here\'s my command list')
			.setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setTimestamp()
		
		for (category of commands) {
			embed.addFields({ name: `- ${category.c}`, value: `${category.cmds.join(' ')}` })
		}

		await interaction.editReply({ embeds: [embed] })

	},
};