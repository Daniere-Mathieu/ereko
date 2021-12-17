class Playlist {
    list_of_tracks;

    constructor() {
        this.list_of_tracks = [];
    }

    addTrack(track) {
        this.list_of_tracks.push(track);
    }

    removeTrack(track_id) {

    }

    load() {
        let party = window.location.href.split('/').pop();
        let url =  window.location.origin+"/api/playlist/" + party;

        const results = fetch(url, {
                headers: {'Content-Type': 'application/json'},
                method: 'GET',
            })
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new TypeError('Request failed ! Status code : ' + response.status);
                }
            })
            .then(function (data) {
                return data;
            })
            .catch(function (e) {
                console.log('une grosse erreur', e);
            }
        );

        results.then((server_playlist) => {
            for (let i = 0; i < server_playlist.length; i++) {
                let t = server_playlist[i];
                let track = new Track(t.party_id, t.track_id, t.state_for_party, t.order, t.state_track, t.download_path);

                this.list_of_tracks.push(track)
                track.displayTrack(t.track_title, t.order);
            }
        });
    }

    update() {
        console.log("UPDATE")
        let party = window.location.href.split('/').pop();
        let url =  window.location.origin+'/api/playlist/' + party;

        const results = fetch(url, {
                headers: {'Content-Type': 'application/json'},
                method: 'GET',
            })
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new TypeError('Request failed ! Status code : ' + response.status);
                }
            })
            .then(function (data) {
                return data;
            })
            .catch(function (e) {
                console.log(e);
            }
        );

        results.then((server_playlist) => {
            for (let i = 0; i < server_playlist.length; i++) {
                if (this.list_of_tracks[i].state_track != 'READY' && server_playlist[i].state_track == 'READY') {
                    this.list_of_tracks[i].setState(server_playlist[i]);
                }
                console.log(this.list_of_tracks[i].state_track, server_playlist[i].state_track) // DEBUG
            }
        });
    }

    displayTracks() {
        this.list_of_tracks.forEach(track => {
            track.displayTrack(track.track_title, track.order);
        });
    }
}
