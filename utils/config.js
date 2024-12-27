require('dotenv').config()

module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
    ownerId: process.env.OWNER_ID
}

// just for not using process.env thing