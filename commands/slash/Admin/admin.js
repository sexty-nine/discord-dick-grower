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
            ).addSubcommand(sub => sub
                .setName('start')
                .setDescription('Forcefully starts a dick account for a user!')
                .addUserOption(option => option
                    .setName('user')
                    .setDescription('The user you want to start a dick for!')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('The name of the dick')
                    .setRequired(true)
                )
                .addIntegerOption(option => option
                    .setName('size')
                    .setDescription('The starting size of the dick')
                )
                .addBooleanOption(option => option 
                    .setName('ephemeral')
                    .setDescription('Show the message to everyone or not')
                )
            )
            ,


        async execute(interaction) {
            const ephemeral = interaction.options.getBoolean('ephemeral');
            await interaction.deferReply({ ephemeral });

            if (!interaction.client.config.ownerIds.includes(interaction.user.id)) return await interaction.editReply("No")

            const subCommand = interaction.options.getSubcommand();
            const chatId = interaction.guildId ?? interaction.channelId;
            const user = interaction.options.getUser('user');

            const dick = await Dick.findOne({
                chatId:chatId,
                userId: user.id,
            }).exec()


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

                case 'set-size':

                    await dick.updateOne({
                        size:size
                    })

                    const sizeSetEmbed = new EmbedBuilder()
                        .setTitle('Success')
                        .setDescription(`You successfully set the dick size of <@${user.id}> to **${size}**`)
                        .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()

                    await interaction.editReply({ embeds:[sizeSetEmbed] })

                    break;
                case 'start':
                    if (dick) {
                        const dickExistsErrorEmbed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(`<@${user.id}> already has an dick!`) 
                            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                            .setTimestamp()

                 
                
                        await interaction.editReply({ embeds:[dickExistsErrorEmbed]})
                        break;
                    }

                    try {
                        const size = interaction.options.getInteger('size') ?? 1;
                        const dickName = interaction.options.getString('name');

                        const startedDick = await Dick.create({
                        chatId:chatId,
                        userId:user.id,
                        size:size,
                        name:dickName,
                    })

                    const startEmbed = new EmbedBuilder()
                        .setTitle('Success')
                        .setDescription(`Successfully created a **${size}cm** dick for <@${user.id}> with the name of **${dickName}**`)
                        .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()

                    await interaction.editReply({embeds:[startEmbed]})
                    break;

                    } catch (e) {
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(e)
                            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                            .setTimestamp()

                    await interaction.editReply({embeds:[errorEmbed]})
                    break;

                    }


                    

    
            }
        }
            
}