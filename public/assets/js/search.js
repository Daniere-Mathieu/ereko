playlist = document.getElementById('playlist');
search_btn = document.getElementById('search_btn');

desk_left = document.getElementById('desktop_left')
search = document.getElementById('search');
search_back = document.getElementById('search_back');
player_full = document.getElementById('audio_player_full')

const treshold_window_width = 750;

function showSearch(evt) {
    playlist.style.display = "none";
    search_btn.style.display = "none";
    desk_left.style.height = "100%";
    player_full.style.height = 0;
    search.style.display = "flex";
}

function hideSearch() {
    playlist.style.display = "flex";
    search_btn.style.display = "flex";
    desk_left.style.height = "50px";
    player_full.style.height = 0;
    search.style.display = "none";

    // remove search value
    document.getElementById('search_input').value=""
}

function showSearchOnLargeScreen() {
    playlist.style.display = "flex";
    search_btn.style.display = "none";
    desk_left.style.height = "100%";
    player_full.style.height = "50%";
    search.style.display = "flex";
}

function ToggleSearchOnResize() {
    if ( window.matchMedia("(min-width: " + treshold_window_width + "px)").matches ) {
        showSearchOnLargeScreen()
    }
    else {
        // stay same if the playlist is hidden
        if (playlist.style.display !== "none") {
            hideSearch()
        }
    }
}

search_btn.addEventListener('click', showSearch);
search_back.addEventListener('click', hideSearch);
window.onresize = ToggleSearchOnResize;