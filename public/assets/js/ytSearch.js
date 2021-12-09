let search_input = document.getElementById('search_input');
let result_list = document.getElementById('result_list');
let list_exist = false;

function createResultDiv(item) {
    let result = document.createElement('div');
    result.className = 'result';
    console.log(result);

    let result_img = document.createElement('div');
    result_img.className = 'result_img';

    let img = document.createElement('img');
    img.src = item.snippet.thumbnails.medium.url;
    result_img.appendChild(img);
    result_img.alt = "Thumbnail of Youtube video" 
    
    let result_info = document.createElement('div');
    result_info.className = 'result_info';

    let result_title = document.createElement('p');
    result_title.className = 'result_title';
    result_title.innerHTML = titleInBold(item.snippet.title);

    result_info.appendChild(result_title);

    result.appendChild(result_img);
    result.appendChild(result_info);

    result_list.appendChild(result);
}

function removeResultDiv() {
    let result_div = document.getElementsByClassName("result");
    for (let i = result_div.length-1; i >= 0 ; i--) {
        console.log(i);
        result_list.removeChild(result_div[i]);
    }
}

function titleInBold(title) {
    let found = title.match('[-]');
    if (found != null) {
        let splitTitle = title.split(' -');
        return '<b>' + splitTitle.shift() + ' -</b>' + splitTitle.join(' -');
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
    console.log(url);
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
                console.log(item);
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