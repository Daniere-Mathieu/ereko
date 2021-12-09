let search_input = document.getElementById('search_input');

search_input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (search_input.value.length > 0) {
            requestToYoutube(search_input.value);
        }
    }
})

