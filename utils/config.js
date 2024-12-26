require('dotenv').config()

module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
}

// just for not using process.env thing