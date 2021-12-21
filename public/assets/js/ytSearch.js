let search_input = document.getElementById('search_input');
let result_list = document.getElementById('result_list');
let request_error = document.getElementById('request_error');

let list_exist = false;

// const API_KEY = 'AIzaSyARXz1iQ3SEIknARH5LibTNzzRpQRvt-oo'; // Token for YT API requests. Please limit requests, we have 100 each day.
const API_KEY = 'AIzaSyChQda9SVL9Lql8-KBX-6XsNJzB4hrSbkM'; // Token for YT API requests. Please limit requests, we have 100 each day.

function createResultDiv(item) {
    let img = document.createElement('img');
    img.src = item.snippet.thumbnails.medium.url;
    img.alt = "Thumbnail of Youtube video";

    let result_img = document.createElement('div').appendChild(img);
    result_img.className = 'result_img';

    let result_title = document.createElement('p');
    result_title.className = 'result_title';
    result_title.innerHTML = titleInBold(item.snippet.title);

    let result_info = document.createElement('div').appendChild(result_title);
    result_info.className = 'result_info';

    let result = document.createElement('div');
    result.addEventListener('click', function(){addTrackApi(item.snippet.title, item.id.videoId)}, false);
    result.className = 'result';
    result.id = item.id.videoId;

    result.appendChild(result_img);
    result.appendChild(result_info);

    result_list.appendChild(result);
}

function createErrorDiv(error) {
    let error_div = document.getElementById('error');
    if (error_div) {
        request_error.removeChild(error_div);
    }

    let error_p = document.createElement('p');
    error_p.id = "error";
    error_p.innerText = error;

    request_error.appendChild(error_p);
}

function removeResultDiv() {
    let result_div = document.getElementsByClassName("result");
    for (let i = result_div.length-1; i >= 0 ; i--) {
        result_list.removeChild(result_div[i]);
    }
    list_exist = false
}

function clearInputSearch() {
    search_input.value = "";
}

function titleInBold(title) {
    let found = title.match('[-]');
    if (found != null) {
        let splitTitle = title.split(' -');
        return '<b>' + splitTitle.shift() + '</b> -' + splitTitle.join(' -');
    }
    return title;
}

function getPartyUid() {
    return window.location.href.split('/').pop();
}

async function requestToYoutube(research) {
    let url = new URL('https://www.googleapis.com/youtube/v3/search?');
    let params = {
        'part': 'snippet',
        'q': research,
        'maxResults': 5,
        'type': 'video',
        'videoDuration': 'medium', // Entre 4 et 20 mn
        'key': API_KEY,
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    await fetch(url, {headers: {'Accept': 'application/json'}})
        .then(function (response) {
            if (response.status == 200) {
                return response.json();
            } else {
                throw new TypeError('Youtube request failed ! Status code : ' + response.status);
            }
        })
        .then(function (data) {
            for (const item of data.items) {
                createResultDiv(item);
            }
        })
        .catch(function (e) {
            console.log(e);
            createErrorDiv("Something went wrong - RESEARCH");
        }
    );
}

async function addTrackApi(track_title, track_id) {
    let party = getPartyUid();
    let url =  window.location.origin + '/api/add/' + party + '/' + track_id;

    await fetch(url, {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({'title': track_title}),
        })
        .then(function (response) {
            if (response.status == 200) {
                removeResultDiv();
                clearInputSearch();
                return response.json();
            } else {
                throw new TypeError('Request failed ! Status code : ' + response.status);
            }
        })
        .then(function (data) {
            let track = new Track(
                data.party_id,
                data.track_id,
                data.state_for_party,
                data.order,
                data.state_track,
                data.download_path,
                data.track_title
                );
            allTrackList.push(track);
            myPlaylist.addTrack(track);
            track.displayTrack();
        })
        .catch(function (e) {
            console.log(e);
            createErrorDiv("Something went wrong - ADD TRACK");
        }
    );
}

search_input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (search_input.value.length > 0) {
            if (list_exist) {
                removeResultDiv();
            }
            requestToYoutube(search_input.value);
            list_exist = true;
        }
    }
})
