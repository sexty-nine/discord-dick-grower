const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
const slashCommandLoader = require('../../../handlers/client/slashCommands.js')
const { inspect } = require('util');
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
            )
            .addSubcommand((sub) => sub
                .setName('eval')
                .setDescription('Executes a piece of javascript shit.')
                .addStringOption(option => option
                    .setName('code')
                    .setDescription('The JavaScript code to evaluate.')
                    .setRequired(true))
                .addBooleanOption(option => option
                    .setName('async')
                    .setDescription('Evaluate the code in an async function scope.'))
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
            const ephemeral = interaction.options.getBoolean('ephemeral');
            await interaction.deferReply({ ephemeral });

            if (!interaction.client.config.ownerIds.includes(interaction.user.id)) return await interaction.editReply("No")

            const subCommand = interaction.options.getSubcommand();

            switch (subCommand){
                case 'reload':
            
                    await slashCommandLoader(interaction.client)
                    
                    const embed = new EmbedBuilder()
                        .setTitle('Reloaded')
                        .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()
            
                    await interaction.editReply({ embeds: [embed] })
                    break;
                case 'eval':
                    const code = interaction.options.getString('code');
                    const isAsync = interaction.options.getBoolean('async') || false;

                    try {
                        // Restrict execution scope
                        const evalCode = isAsync
                            ? `(async () => { ${code} })()`
                            : code;

                        let result = eval(evalCode);

                        // Handle async results
                        if (result instanceof Promise) {
                            result = await result;
                        }

                        // Ensure safe and readable output
                        const resultString = typeof result === 'object'
                            ? inspect(result, { depth: 2, maxArrayLength: 100 })
                            : String(result);

                        const embed = new EmbedBuilder()
                            .setTitle('Eval Result')
                            .setDescription(`\`\`\`js\n${resultString.slice(0, 2000)}\n\`\`\``)
                            .setColor('Green')
                            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                            .setTimestamp();

                        await interaction.editReply({ embeds: [embed] });
                    } catch (error) {
                        // Handle errors gracefully
                        const errorMessage = `Error: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack}`;
                        const embed = new EmbedBuilder()
                            .setTitle('Eval Error')
                            .setDescription(`\`\`\`js\n${errorMessage.slice(0, 2000)}\n\`\`\``)
                            .setColor('Red')
                            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                            .setTimestamp();
                        await interaction.editReply({ embeds: [embed] });
                    }
                    break;
    
            }
        }
            
}