const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
const Dick = require('../../../database/schemas/Dick.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give someone else your dick!')
        .addUserOption((option) => option.setName('user').setDescription('The user you want to give the dick to!').setRequired(true))
        .addIntegerOption((option) => option.setName('size').setDescription('The dick size you want to give!').setRequired(true))
        .addBooleanOption((option) => option.setName('ephemeral').setDescription('Only you can see the response'))
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),

    async execute(interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral');
        await interaction.deferReply({ ephemeral });

        // The size given by the user!
        const givenSize = interaction.options.getInteger('size');
        // The user the dick size is going to be given to
        const targetedUser = interaction.options.getUser('user')

        const chatId = interaction.guildId ?? interaction.channelId;

        const dick = await Dick.findOne({
            chatId: chatId,
            userId: interaction.user.id,
        }).exec()

        const targetedDick = await Dick.findOne({
            chatId: chatId,
            userId: targetedUser.id,
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

        // Stops the user from giving dick while they don't have enough
        if (givenSize > dick.size){
            await interaction.editReply('Sorry! your dick is not long enough!')
            return;
        }

        // Stops the users from providing the bot with a zero or a negative number
        if (givenSize <= 0) {
            await interaction.editReply('Sorry! You can\'t provide a zero or a negative number!')
            return;
        }

        await dick.updateOne({
            size: dick.size - givenSize,
        })

        await targetedDick.updateOne({
            size: targetedDick.size + givenSize,
        })

        const embed = new EmbedBuilder()
            .setTitle('Congrats')
            .setDescription(`🎉 You successfully gave **${givenSize}cm** of your dick to **<@${targetedUser.id}>**.\nNow you got a **${dick.size - givenSize}cm** dick.`)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()

        await interaction.editReply({ embeds: [embed] });
    },
}