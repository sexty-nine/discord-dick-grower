import { Client, GatewayIntentBits, ActivityType, Collection } from "discord.js";

import Config from '../utils/config'

export default class extends Client {
    public events: Collection<string, any>;
    public commands: Collection<string, any>;
    public readonly config: typeof Config
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds
            ],
            presence: {
                status: 'dnd',
                activities: [{
                    name: "Growing my dick",
                    type: ActivityType.Custom
                }]
            }
        })

        this.events = new Collection()
        this.commands = new Collection()
        this.config = Config

        this.login(this.config.token)
    }
}