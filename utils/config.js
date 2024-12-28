require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
    ownerIds: JSON.parse(process.env.OWNER_IDS)
}

// just for not using process.env thing