module.exports = {
    calculateBattleResult: (user, opponent, userDick, opponentDick) => {
        // Win rate is based on the size of the dicks
        const userWinRate = userDick.size / (userDick.size + opponentDick.size);
        const opponentWinRate = opponentDick.size / (userDick.size + opponentDick.size);
        // Generates a number between  0 and 9 | This will add some randomness to the algorithm
        const userRandomFactor = Math.floor(Math.random()* 10);
        const opponentRandomFactor = Math.floor(Math.random() * 10);
        // Will decrease the total win rate by 5 if the player has more than 5 streak 
        const userStreakAdjustment = Math.min(userDick.loseStreak, 5) - Math.min(userDick.winStreak, 5);
        const opponentStreakAdjustment = Math.min(opponentDick.loseStreak, 5) - Math.min(opponentDick.winStreak, 5);
        // Determines the win rate based on the the three inputs above 
        const totalWinRate = (userWinRate + userStreakAdjustment + userRandomFactor) + (opponentWinRate + opponentStreakAdjustment + opponentRandomFactor)
        const totalUserWinRate = ((userWinRate + userStreakAdjustment + userRandomFactor) / totalWinRate) * 100;
        const totalOpponentWinRate = ((opponentWinRate + opponentStreakAdjustment + opponentRandomFactor) / totalWinًate) * 100;
        // Whoever has the highest win rate wins
        const winner = totalOpponentWinRate < totalUserWinRate ? user : opponent;
        // These are the values that the users see as win rates

        return {
            user: user.username,
            opponent: opponent.username,
            userDickSize: Math.round(userDick.size),
            opponentDickSize: Math.round(totalUserWinRate),
            userWinRate: Math.round(totalOpponentWinRate),
            opponentWinRate: Math.round(opponentWinRate),
            winner: winner
        };
    }
}