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

export class OAuthClient {

    static get client_name() {
        return "default";
    }

    static get auth_url() {
        return "";
    }

    static get api_url() {
        return "";
    }

    static get client_id() {
        return "";
    }

    static get redirect_uri() {
        const path = location.pathname.split("/");
        return [location.origin, ...path.slice(0, path.length-2).filter(part => part), "authorized.html"].join("/");
    }

    static get expired() {
        return Date.now() - this.authorized_timestamp > this.expires;
    }

    static get authorized() {
        return this.access_token != null;
    }

    static get authorizing() {
        return !this.authorized && this.authorize_service != null;
    }
    
    static async authorize() {
        this.authorize_service = this.auth_url;

        let auth_win = null;

        return new Promise((resolve) => {
            const params = parseSearchParams(window.location.search);
            if(params[this.client_name]) {
                this.access_token = params[this.client_name];
                return;
            }

            auth_win = open(this.authorize_service, '', "width=500,height=500,top=200,left=400,location=no");
            auth_win.focus();

            const checkFinished = setInterval(() => {
                const hash = auth_win.location.hash;

                if(hash) {
                    auth_win.close();

                    const params = parseSearchParams(auth_win.location.hash);
                    
                    this.authorized_timestamp = Date.now();
                    this.expires = parseInt(params.expires_in * 1000);
                    
                    if(params.access_token) {
                        clearInterval(checkFinished);
                        this.access_token = params.access_token;

                        location.search +=  (location.search[0] == '?' ? '' : '?') + 
                                            (location.search.length > 2 ? '&' : '') + 
                                            (this.client_name + "=" + this.access_token);

                        resolve(params.access_token);
                    }
                }
            }, 200);
        })
    }

    static async query(endpoint, params) {
        let query = "?";
        for(let key in params) {
            query += key + "=" + params[key];
        }
        if(!this.access_token) {
            throw "Not yet authorized";
        }
        if(this.expired) {
            console.log('reauthorized pls');
            await this.authorize();
            console.log('thx');
        }
        const service = this.api_url + endpoint + query;
        const res = await fetch(service, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
            }
        }).catch(err => console.error(err));
        const result = await res.json();
        return result;
    }

    static getCommand(commandString) {
        this.query('/commands', '');
    }

}
