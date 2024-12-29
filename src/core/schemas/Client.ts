import { Client, GatewayIntentBits, ActivityType, Collection } from "discord.js";


export default class extends Client {
    public events: Collection<string, any>;
    public commands: Collection<string, any>;

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
    }
}