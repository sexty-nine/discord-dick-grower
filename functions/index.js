module.exports = {
    calculateBattleResult: (user, opponent, userDick, opponentDick) => {
        // Win rate is based on the size of the dicks
        const userWinRate = userDick.size / (userDick.size + opponentDick.size) * 100;
        const opponentWinRate = opponentDick.size / (userDick.size + opponentDick.size) * 100;
        // Generates a number between 0 and 9 | This will add some randomness to the algorithm
        const userRandomFactor = Math.floor(Math.random() * 10);
        const opponentRandomFactor = Math.floor(Math.random() * 10);
        // Will decrease the total win rate by 5 if the player has more than 5 streak 
        const userStreakAdjustment = Math.min(userDick.loseStreak, 5) - Math.min(userDick.winStreak, 5);
        const opponentStreakAdjustment = Math.min(opponentDick.loseStreak, 5) - Math.min(opponentDick.winStreak, 5);
        // Determines the win rate based on the the three inputs above 
        // These are the values that the users see as win rates
        const adjustedUserWinRate = userWinRate + userStreakAdjustment + userRandomFactor;
        const adjustedOpponentWinRate = opponentWinRate + opponentStreakAdjustment + opponentRandomFactor;
    
        // Whoever has the highest win rate wins
        const winner = adjustedOpponentWinRate < adjustedUserWinRate ? user : opponent;
    
        return {
            user: user.username,
            opponent: opponent.username,
            userDickSize: Math.round(userDick.size),
            opponentDickSize: Math.round(opponentDick.size),
            userWinRate: Math.round(adjustedUserWinRate),
            opponentWinRate: Math.round(adjustedOpponentWinRate),
            winner: winner
        };
    }
}