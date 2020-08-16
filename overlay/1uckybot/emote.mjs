import FFZ from './services/FFZ.mjs';
import BTTV from './services/BTTV.mjs';
import Twitch from './services/Twitch.mjs';

let emoteCache = {};

export class Emotes {

    static async updateCache(channelName) {
        const channel = await Twitch.getUserByLogin(channelName);
        console.log(channel);

        for(let service of [ 
            FFZ, 
            BTTV, 
            // Twitch
         ]) {

            const globalEmoteSet = await service.getEmotesGlobal();
            const channelEmoteSet = await service.getEmotesByChannel(channel);

            emoteCache = Object.assign(emoteCache, globalEmoteSet);
            emoteCache = Object.assign(emoteCache, channelEmoteSet);
        }

        return emoteCache;
    }

    static async getOrUpdateCache(channelName) {
        if(Object.keys(emoteCache).length == 0) {
            await this.updateCache(channelName);
        }
        return emoteCache;
    }

    static parseMessage(channel, message) {
        const emotesCache = Emotes.getOrUpdateCache(channel);

        const emotes = [];

        if(!emotesCache) return emotes;

        const emoteList = Object.keys(emotesCache);

        const words = message.split(" ");

        for(let word of words) {
            if(emoteList.indexOf(word) != -1) {
                emotes.push(emotesCache[word]);
            }
        }

        return emotes;
    }
}
