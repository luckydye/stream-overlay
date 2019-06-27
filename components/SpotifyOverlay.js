import { Spotify } from "../src/Spotify.js";
import { OverlayElement } from "../src/OverlayElement.js";

export class SpotifyOverlay extends OverlayElement {

    static template(props) {
        return `
            <div class="cover">
                <div class="playing-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <img width="75px" src="${props.cover}" />
            </div>
            <div class="details">
                <div class="title">${props.title}</div>
                <div class="artists">${props.artist}</div>
            </div>
        `;
    }

    connectedCallback() {
        this.update();
        setInterval(() => this.update(), 1200);
    }

    load() {

    }
    
    async update() {
        if(!Spotify.authorized && !Spotify.authorizing) {
            await Spotify.authorize();
        }

        if(!Spotify.authorizing && Spotify.authorized) {

            const songData = await Spotify.getPlayingSong();

            if(songData && songData.timestamp != this.state.timestamp) {
                this.setState({
                    playing: songData.is_playing,
                    cover: songData.item.album.images[1].url,
                    artist: songData.item.artists.map(artist => artist.name).join(', '),
                    title: songData.item.name
                });

                this.setAttribute('playing', this.state.playing);
            }
        }
    }

}

customElements.define('overlay-spotify', SpotifyOverlay);