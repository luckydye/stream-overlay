import { OAuthClient } from "./OAuthClient.js";

export class Nightbot extends OAuthClient {

    static get client_name() { return "nightobt" }
    static get api_url() { return "https://api.nightbot.tv/1"; }
    static get client_id() { return "3d1ccd33ad79e98d7ebd22d531449fd8"; }

    static get auth_url() {
        return `https://api.nightbot.tv/oauth2/authorize?client_id=${this.client_id}&response_type=token&redirect_uri=${this.redirect_uri}&scope=commands`;
    }

    static async getCommand(commandString) {
        const result = await this.query('/commands', {
            name: commandString
        });
        
        this.commands = result.commands;

        if(this.commands) {
            for(let cmd of this.commands) {
                if(cmd.name == commandString) {
                    return cmd;
                }
            }
        }
        
        return null;
    }

}
