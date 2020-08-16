import Service from "./Service.mjs";

export default class Twitch extends Service {

    static API_CLIENT_ID = "yrnixdt837v8es0qsz66avlr0kcvmj";
    static API_CLIENT_SECRET = "qoegfp0xiuo0xxshebmz59npns9st6";

    static channelEmoteApiUrl = "https://api.twitchemotes.com/api/v4/channels";
    static globalEmoteApiUrl = "https://api.twitchemotes.com/api/v4/channels";

    static getEmoteImageUrl(emoteid) {
        return `https://static-cdn.jtvnw.net/emoticons/v1/${emoteid}/4.0`;
    }

    static async auth() {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${Twitch.API_CLIENT_ID}&client_secret=${Twitch.API_CLIENT_SECRET}&grant_type=client_credentials`;
        const json = await this.apiFetch(url, { method: "POST" });
        Twitch.api_credentials = json;
        return Twitch.api_credentials;
    }

    static async getUserByLogin(user) {
        if(!Twitch.api_credentials) {
            await Twitch.auth();
        }

        const url = `https://api.twitch.tv/helix/users?login=${user}`;
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Twitch.api_credentials.access_token}`,
            'Client-ID': Twitch.API_CLIENT_ID
        };

        const json = await this.apiFetch(url, { headers });
        return json.data[0];
    }
    
    static async getEmotesGlobal() {
        const url = this.globalEmoteApiUrl;
        return {};
    }

    static async getEmotesByChannel(channel) {
        const url = `${this.channelEmoteApiUrl}/${channel.id}`;
        const apiResult = await fetch(url).then(res => res.json());
        return this.parseEmoteSet(apiResult);
    }

    static parseEmoteSet(set) {
        const emoteSet = {};
        for(let emote of set.emotes) {
            emoteSet[emote.code] = this.getEmoteImageUrl(emote.id);
        }
        return emoteSet;
    }
}
