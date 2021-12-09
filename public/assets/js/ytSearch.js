let search_input = document.getElementById('search_input');
let result_list = document.getElementById('result_list');

function createResultDiv() {
    let result = document.createElement('div');
    result.className = 'result';
    console.log(result);

    let result_img = document.createElement('div');
    result_img.className = 'result_img';

    let img = document.createElement('img');
    img.src = "https://i.ytimg.com/vi/BmSzWXl5Ofg/mqdefault.jpg";
    result_img.appendChild(img);
    // Ajouter img alt

    let result_info = document.createElement('div');
    result_info.className = 'result_info';

    let result_title = document.createElement('p');
    result_title.className = 'result_title';
    result_title.innerHTML = "<b>Jackson 5</b>- Eye of the tiger 1 aaaaaaaaaaaa fdsgfdg gfdgfdggfdg gfdgfdg gfdgfdg gfdgfdg gfdgfdg ";

    let result_time = document.createElement('p');
    result_time.innerText = "03:45";

    result_info.appendChild(result_title);
    result_info.appendChild(result_time);

    
    result.appendChild(result_img);
    result.appendChild(result_info);

    result_list.appendChild(result);
}

search_input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (search_input.value.length > 0) {
            requestToYoutube(search_input.value);
        }
    }
})

createResultDiv()
createResultDiv()
createResultDiv()
createResultDiv()
createResultDiv()