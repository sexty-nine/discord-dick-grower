require('dotenv').config({path:__dirname + '/.env'});

module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
    ownerIds: JSON.parse(process.env.OWNER_IDS)
}

// just for not using process.env thing