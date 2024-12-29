import dotenv from 'dotenv';

dotenv.config()

module.exports = {
    token: process.env.TOKEN,
    databaseUri: process.env.DATABASE_URI,
    ownerIds: JSON.parse(process.env.OWNER_IDS ?? "673518013332455434") 
}

// just for not using process.env thing