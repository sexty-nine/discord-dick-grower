import Client from './core/schemas/Client'

const client = new Client()

client.once('ready', (c) => {
    console.log(`Logged in as ${c.user?.username}`)
})

client.login(client.config.token)
