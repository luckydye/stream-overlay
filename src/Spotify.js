const client_id = "cbc6f8fab7064000ba3fae1fd9e43996";

const path = location.pathname.split("/");
const redirect_uri = [location.origin, ...path.slice(0, path.length-1).filter(part => part), "authorized.html"].join("/");

let access_token = null, 
    authorize_service = null,
    authorized_timestamp = 0,
    expires = 0;

function parseSearchParams(string) {
    const params = {};
    const arr = string.split(/[\#|\?\&]/g);
    for(let item of arr) {
        const pair = item.split("=");
        if(pair[0]) {
            params[pair[0]] = pair[1];
        }
    }
    return params;
}

export class Spotify {

    static get expired() {
        return Date.now() - authorized_timestamp > expires;
    }

    static get authorized() {
        return access_token !== null;
    }

    static get authorizing() {
        return !this.authorized && authorize_service != null;
    }
    
    static async authorize() {
        authorize_service = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=user-read-currently-playing`;

        if(!location.hash) {
            window.location = authorize_service;
        }

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if(location.hash) {
                    const params = parseSearchParams(location.hash);
                    
                    authorized_timestamp = Date.now();
                    expires = parseInt(params.expires_in * 1000);
                    
                    if(params.access_token) {
                        clearInterval(interval);
                        access_token = params.access_token;
                        resolve(params.access_token);
                    }
                }
            }, 100);
        })
    }

    static async query(endpoint, params) {
        let query = "?";
        for(let key in params) {
            query += key + "=" + params[key];
        }
        if(!access_token) {
            throw "Not yet authorized";
        }
        if(this.expired) {
            console.log('reauthorized pls');
            await this.authorize();
            console.log('thx');
        }
        const service = "https://api.spotify.com/v1" + endpoint + query;
        const res = await fetch(service, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        }).catch(async err => console.error(err));
        const result = await res.json();
        return result;
    }

    static async getPlayingSong() {
        return await this.query('/me/player/currently-playing', { market: "de" }).catch(err => err);
    }

}
