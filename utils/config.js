require('dotenv').config({path:__dirname + '/.env'})

module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
    ownerId: process.env.OWNER_ID
}

// just for not using process.env thing