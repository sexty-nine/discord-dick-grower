const { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType, InteractionContextType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Dick = require('../../../database/schemas/Dick.js')
const { calculateBattleResult } = require('../../../functions/battleCalculation.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('battle')
        .setDescription('Lets sword fight! (DON\'T USE)')
        .addUserOption((option) => option.setName('user').setDescription('The user you want to battle with').setRequired(true))
        .addIntegerOption((option) => option.setName('bet').setDescription('How many centimeters are you willing to bet').setRequired(true).setMinValue(1))
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild]),

    async execute(interaction) {
        await interaction.deferReply()

        const chatId = interaction.guildId ?? interaction.channelId;
        const opponent = interaction.options.getUser('user')
        const bet = interaction.options.getInteger('bet') ?? 1;

        const userDick = await Dick.findOne({
            chatId: chatId,
            userId: interaction.user.id
        }).exec()

        const opponentDick = await Dick.findOne({
            chatId: chatId,
            userId: opponent.id
        }).exec()

        if (!userDick) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`⚠️ You don't have a dick here. Create one by using \`/start\``)
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
        
            await interaction.editReply({ embeds: [embed] });
            return;
        }
        if (!opponentDick) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`⚠️ Your opponent doesn't have a dick here. Ask them to create one by using \`/start\``)
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
            
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (userDick.size < bet) {
            const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`⚠️ You don't have enough centimeters to bet. You currently have ${userDick.size} cm.`)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
        
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (opponentDick.size < bet) {
            const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`⚠️ Your opponent doesn't have enough centimeters to bet. They currently have ${opponentDick.size} cm.`)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Success);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Decline')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

        const confirmEmbed = new EmbedBuilder()
            .setTitle('Battle')
            .setDescription(`<@${opponent.id}> Are you willing to fight with <@${interaction.user.id}>?`)
            .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()


		const resp = await interaction.editReply({
			content: `<@${opponent.id}>`,
            embeds: [confirmEmbed],
			components: [row],
		});

        const filter = i => i.user.id === opponent.id;

        try {
            const confirmation = await resp.awaitMessageComponent({ filter: filter, time: 60_000 });

            if (confirmation.customId === 'cancel') {
                const declineEmbed = new EmbedBuilder()
                .setTitle('Battle')
                    .setDescription(`<@${opponent.id}> Declined battling.`)
                    .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
    
    
                await interaction.editReply({
                    content: ``,
                    embeds: [declineEmbed],
                    components: [],
                });

                return;
            }

            const result = calculateBattleResult(interaction.user, opponent, userDick, opponentDick);

            const updateUserDick = {
                size: userDick.size + (result.winner === interaction.user ? bet : -bet),
                winStreak: result.winner === interaction.user ? userDick.winStreak + 1 : 0,
                loseStreak: result.winner === interaction.user ? 0 : userDick.loseStreak + 1
            };
    
            const updateOpponentDick = {
                size: opponentDick.size + (result.winner === opponent ? bet : -bet),
                winStreak: result.winner === opponent ? opponentDick.winStreak + 1 : 0,
                loseStreak: result.winner === opponent ? 0 : opponentDick.loseStreak + 1
            };
    
            await userDick.updateOne(updateUserDick);
            await opponentDick.updateOne(updateOpponentDick);
    
            const embed = new EmbedBuilder()
                .setTitle('Battle Result')
                .setDescription(`The battle between ${interaction.user.displayName} and ${opponent.displayName} has concluded!`)
                .addFields(
                    { name: 'User Dick Size', value: `${userDick.size}` },
                    { name: 'Opponent Dick Size', value: `${opponentDick.size}` },
                    { name: 'User Win Rate', value: `${result.userWinRate}%` },
                    { name: 'Opponent Win Rate', value: `${result.opponentWinRate}%` },
                    { name: 'Winner', value: `${result.winner.displayName}` }
                )
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
    
            
    
            await interaction.editReply({ content: '', embeds: [embed], components: [] });
    
        } catch (e) {
            const expiredEmbed = new EmbedBuilder()
                .setTitle('Battle')
                .setDescription(`Request expired`)
                .setFooter({ text: `Requested by ${interaction.member?.nickname || interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()

            await interaction.editReply({ content:'', embeds: [expiredEmbed], components: [] })
            console.error(e)
        }
    },
}

