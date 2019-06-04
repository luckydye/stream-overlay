import { Config } from './src/Config.js';
import { Loader } from './src/Loader.js';

import './components/SpotifyOverlay.js';
import './components/FollowerOverlay.js';
import './components/RaidedOverlay.js';

const devEnabled = localStorage.getItem('dev');

if(devEnabled == "true") {
    const streamlabs = localStorage.getItem('streamlabs');

    document.body.setAttribute('dev', '');
    Config.set('streamlabs', streamlabs);
    console.log('using streamlabs key:', streamlabs);
}

window.addEventListener('click', () => {
    Config.set('layout', Config.get('layout') == 'luckydye' ? 'default' : 'luckydye');
})

Loader.loadComponents([
    Config.load().then(() => {
        Config.set('layout', Config.get('layout'));
        const layout = Config.get('layout');
        console.log("using layout:", layout);
        return Loader.loadStyles('./layouts/' + layout);
    }),
])
