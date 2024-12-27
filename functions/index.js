module.exports = {
    calculateBattleResult: (user, opponent, userDick, opponentDick) => {
        const userWinRate = userDick.size / (userDick.size + opponentDick.size) * 100;
        const opponentWinRate = opponentDick.size / (userDick.size + opponentDick.size) * 100;
        const randomFactor = Math.round(Math.random() * 2) - 1;
        const userStreakAdjustment = Math.min(userDick.loseStreak, 5) - Math.min(userDick.winStreak, 5);
        const opponentStreakAdjustment = Math.min(opponentDick.loseStreak, 5) - Math.min(opponentDick.winStreak, 5);
        const adjustedUserWinRate = userWinRate + randomFactor + userStreakAdjustment;
        const adjustedOpponentWinRate = opponentWinRate - randomFactor + opponentStreakAdjustment;
    
        const randomChance = Math.random() * 100;
        const winner = randomChance < adjustedUserWinRate ? user : opponent;
    
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