let search_input = document.getElementById('search_input');
let result_list = document.getElementById('result_list');
let list_exist = false;
const API_KEY = '';//'AIzaSyChQda9SVL9Lql8-KBX-6XsNJzB4hrSbkM'; // Token for YT API requests. Please limit requests, we have 100 each day.

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
    result.className = 'result';
    result.id = item.id.videoId;
    result.addEventListener('click', function () {console.log('ok')});

    result.appendChild(result_img);
    result.appendChild(result_info);

    result_list.appendChild(result);
}

function removeResultDiv() {
    let result_div = document.getElementsByClassName("result");
    for (let i = result_div.length-1; i >= 0 ; i--) {
        result_list.removeChild(result_div[i]);
    }
}

function titleInBold(title) {
    let found = title.match('[-]');
    if (found != null) {
        let splitTitle = title.split(' -');
        return '<b>' + splitTitle.shift() + '</b> -' + splitTitle.join(' -');
    }
    return title;
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
                throw new TypeError('Request failed ! Status code : ' + response.status);
            }
        })
        .then(function (data) {
            for (const item of data.items) {
                createResultDiv(item);
            }
        })
        .catch(function (e) {
            console.log(e);
            // Afficher une erreur dans le front ?
        }
    );
}

search_input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (list_exist) {
            removeResultDiv();
            list_exist = false
        }
        if (search_input.value.length > 0) {
            requestToYoutube(search_input.value);
            list_exist = true;
        }
    }
})

function getPartyUid() {
    return window.location.href.split('/').pop();
}

let all_results = Array.from(document.getElementsByClassName('result'));
all_results.forEach(e => e.addEventListener('click', addTrack));

function addTrack() {
    let party = getPartyUid();
    let url =  'http://0.0.0.0:8000/api/add/' + party + '/' + this.id;
    console.log(url);

    
}