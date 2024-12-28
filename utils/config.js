<<<<<<< HEAD
require('dotenv').config({path:__dirname + '/.env'})

=======
require('dotenv').config()
>>>>>>> abc61c0 (Add 'eval' subcommand to admin command and support multiple owner IDs)
module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
    ownerIds: JSON.parse(process.env.OWNER_IDS)
}

// just for not using process.env thing