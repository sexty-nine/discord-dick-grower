module.exports = {
    calculateBattleResult: async (user, opponent, userData, opponentData) => {
        // Validate input data
        if (!user || !opponent || !userData || !opponentData) {
            throw new Error("Invalid input data: All user and opponent data must be provided.");
        }

        // Ensure dick sizes are valid
        const userSize = userData.size || 0;
        const opponentSize = opponentData.size || 0;
        if (userSize <= 0 && opponentSize <= 0) {
            throw new Error("Invalid dick sizes: Both sizes cannot be zero or negative.");
        }

        // Step 1: Win/Lose Streak Adjustment
        const maxStreakBonus = 50; // Maximum streak bonus (from 90% - 10% random adjustment)
        const maxStreak = 10; // Maximum streak to consider

        const calculateStreakBonus = (winStreak, loseStreak) => {
            const loseBonus = Math.min(loseStreak, maxStreak) * (maxStreakBonus / maxStreak);
            const winPenalty = Math.min(winStreak, maxStreak) * (maxStreakBonus / maxStreak);
            return loseBonus - winPenalty;
        };

        let userStreakBonus = calculateStreakBonus(userData.winStreak, userData.loseStreak);
        let opponentStreakBonus = calculateStreakBonus(opponentData.winStreak, opponentData.loseStreak);

        // Normalize streak bonuses to avoid negatives
        const totalStreakBonus = Math.max(0, userStreakBonus) + Math.max(0, opponentStreakBonus);
        userStreakBonus = (Math.max(0, userStreakBonus) / totalStreakBonus) * maxStreakBonus || 0;
        opponentStreakBonus = (Math.max(0, opponentStreakBonus) / totalStreakBonus) * maxStreakBonus || 0;

        // Step 2: Random Adjustment (10%)
        const randomAdjustment = 20;
        const userRandomBonus = Math.random() * randomAdjustment;
        const opponentRandomBonus = randomAdjustment - userRandomBonus;

        // Step 3: Dick Size Adjustment (10%)
        const dickAdjustment = 30;
        const totalDickSize = userSize + opponentSize;
        const userDickBonus = (userSize / totalDickSize) * dickAdjustment;
        const opponentDickBonus = (opponentSize / totalDickSize) * dickAdjustment;

        // Step 4: Calculate Final Probabilities
        const userWinRate = userStreakBonus + userRandomBonus + userDickBonus;
        const opponentWinRate = opponentStreakBonus + opponentRandomBonus + opponentDickBonus;

        // Normalize to ensure the sum is 100
        const totalProbability = userWinRate + opponentWinRate;
        if (totalProbability <= 0) {
            throw new Error("Invalid probabilities: Total probability cannot be zero or negative.");
        }
        const normalizedUserWinRate = (userWinRate / totalProbability) * 100;
        const normalizedOpponentWinRate = (opponentWinRate / totalProbability) * 100;

        // Determine the winner based on higher win rate
        const winner = normalizedUserWinRate > normalizedOpponentWinRate ? user : opponent;

        return {
            user: user.username,
            opponent: opponent.username,
            userDickSize: Math.round(userSize),
            opponentDickSize: Math.round(opponentSize),
            userWinRate: Math.round(normalizedUserWinRate),
            opponentWinRate: Math.round(normalizedOpponentWinRate),
            winner: winner,
        };
    },
};
