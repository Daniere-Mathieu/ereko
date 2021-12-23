let counter = 0;
// initilization d'un compteur
let currentMusic = 0;
// initilization du numéro de la musique actuel
let futureMusic = currentMusic + 1;
// initilization du numéro de la musique a venir
let lastLoadMusic = currentMusic + 4;
// initilization du numéro de la prochaine musique a charger avec fetch
let autoplay = 0;
// initilization d'une variable qui permet d'activer l'autoplay a la premier écoute
let allTrackList = [];
// tableau temporaire servant de remplacant a la réponse du serveur sur la liste de musique
let musicList = [];
//j'initilize le tableau de musique
let test = [];
let first = true;
let audio = new Audio();
//object audio
audio.volume = .75;
// je donne la valeur au volume du son
let promiseList = [];
//
let loop = 0;
let reset = false;
let myPlaylist = new Playlist();
let currentMusicPlaying = [];

let playlistID = decodeUrl()
function setAudio(source){
      audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  let endVerification = currentMusic + 1;
  if (allTrackList.length <= endVerification) {
    setPlaying("track")
    sortMusiclist(musicList);
    if (musicList.length === 0 ) {
      musicList[0] = currentMusicPlaying[0];
    }
    setAudio(musicList[0].path);
    currentMusicPlaying[0] = musicList[0];
    spliceList(musicList);
    if (allTrackList.length > 1) {
      nextLoadMusic();
    }
    currentMusic = 0;
    futureMusic = 1;
  }else {
    setPlaying("track");
    sortMusiclist(musicList);
    setAudio(musicList[0].path);
    currentMusicPlaying[0] = musicList[0];
    currentMusic++;
    futureMusic++;
    spliceList(musicList);
    nextLoadMusic();
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
window.addEventListener("load",async() => {
  await callTrackList(playlistID);
  for (let i = 0; i < allTrackList.length; i++) {
      let t = allTrackList[i];
  }
  if (allTrackList.length > 0) {
    if (allTrackList[currentMusic].state_track === "READY") {
      promiseList[currentMusic] = callMusic(allTrackList[currentMusic].download_path);
      await callMusicBlob(promiseList[currentMusic],allTrackList[currentMusic]);
    }
    if (musicList.length > 0) {
      setAudio(musicList[0].path);
      currentMusicPlaying[0] = musicList[0];
      spliceList(musicList);
      counter = 0;
      loadCallMusic();
    }
    else {
      let intervalID = setInterval(function () {
        if (musicList.length >= 1) {
          setAudio(musicList[0].path);
          currentMusicPlaying[0]  = musicList[0];
          spliceList(musicList);
          counter = 0;
          loadCallMusic();
          clearInterval(intervalID);
        }
      }, 700);
    }
  }
})
// fonction qui capte le chargement de la page pour load les premier musique
async function loadCallMusic(){
    if (allTrackList.length < 5) {
      for (let i = futureMusic; i <= allTrackList.length ; i++) {
        if (i > (allTrackList.length -1)) {
          break;
        }
        else {
          if (allTrackList[i].state_track === "READY") {
            promiseList[i] = callMusic(allTrackList[i].download_path);
            await callMusicBlob(promiseList[i],allTrackList[i])
          }
        }
      }
    }
    else {
      for (let i = futureMusic; i < lastLoadMusic+1 ; i++) {
        if (allTrackList[i].state_track === "READY") {
          promiseList[i] = callMusic(allTrackList[i].download_path);
          await callMusicBlob(promiseList[i],allTrackList[i])
        }
      }
    }
}
async function nextLoadMusic(){
  if (first) {
    lastLoadMusic++;
    first = false;
  }
  if (lastLoadMusic < allTrackList.length) {
    if(allTrackList[lastLoadMusic].state_track == "ON_ERROR"  || allTrackList[lastLoadMusic].state_track=="TOO_LONG"){
      lastLoadMusic++;
    }
  }
  if (lastLoadMusic >= allTrackList.length) {
    if (reset) {
      lastLoadMusic -= allTrackList.length;
    }
    else {
      lastLoadMusic = 0;
      loop++;
      reset = true;
    }
    promiseList[lastLoadMusic] = callMusic(allTrackList[lastLoadMusic].download_path);
    await callMusicBlob(promiseList[lastLoadMusic],allTrackList[lastLoadMusic]);
    lastLoadMusic++;
  }
  else {
     promiseList[lastLoadMusic] = callMusic(allTrackList[lastLoadMusic].download_path);
    await callMusicBlob(promiseList[lastLoadMusic],allTrackList[lastLoadMusic]);
    lastLoadMusic++;
    if (lastLoadMusic === allTrackList.length) {
      reset = false;
    }
  }
}
// fonction qui a pour but de d'apeller la prochaine musique loadable
function spliceList(array){
      array.splice(0,1);
}
function setPlaying(className){
  // I think nexr three lines are useless
  let trackDiv = document.getElementById(allTrackList[currentMusic].order);
  let idCurrentMusic = trackDiv.getAttribute("id");
  if(currentMusicPlaying[0].number == idCurrentMusic){
    songName.innerHTML = allTrackList[currentMusic].track_title;
    trackDiv.setAttribute("class", className);
  }
  else {
    for (let i = 0; i < allTrackList.length; i++) {
      let trackGreatDiv = document.getElementById(allTrackList[i].order);
      let idGreatCurrentMusic = trackGreatDiv.getAttribute("id");
      if (idGreatCurrentMusic == currentMusicPlaying[0].number) {
        currentMusic = i;
        songName.innerHTML = allTrackList[i].track_title;
        trackGreatDiv.setAttribute("class", className);
        break;
      }
    }
  }
}
function setThumbnail(param){
  let thumbnail = document.getElementById("thumbnail");
    thumbnail.setAttribute("src",param[currentMusic].thumbnail_path);
}
function decodeUrl(){
  let url = location.href;
  let arrayDecodeUrl = url.split('/');
  return arrayDecodeUrl[4]
}

myPlaylist.load();
let update_id = setInterval(() => {
  myPlaylist.update();
}, 2500);

function sortMusiclist(tab){
  let changed;
  do{
    changed = false;
    for(let i=0; i < tab.length-1; i++) {
      if(tab[i].number > tab[i+1].number) {
        if(tab[i].loop === tab[i+1].loop) {
          let tmp = tab[i];
          tab[i] = tab[i+1];
          tab[i+1] = tmp;
          changed = true;
        }
      }
    }
  } while(changed);
}
async function addTrackInfFive(last){
    if (typeof musicList[0] == "undefined" && allTrackList.length === 1) {
      promiseList[0] = callMusic(allTrackList[0].download_path);
      await callMusicBlob(promiseList[0],allTrackList[0]);
      let emptyInterval = setInterval(()=> {
        if (typeof musicList[0] !== "undefined" && typeof allTrackList[0].thumbnail_path !== "undefined") {
            setAudio(musicList[0].path);
            currentMusicPlaying[0] = musicList[0];
            spliceList(musicList);
            clearInterval(emptyInterval);
        }
      },500)

    }
    else {
      addTrackMultAdd(last);
    }
}
async function addTrackSupFive(last){
  let loopNumber = 0;
  let tempArray = [];
  let validation = false ;
  for (let i = 0; i < musicList.length; i++) {
    if (allTrackList[last].order > musicList[i].number && currentMusicPlaying[0].loop !== musicList[i].loop) {
      loopNumber = currentMusicPlaying[0].loop;
      tempArray.push(musicList[i]);
      musicList.splice(i,1);
      validation = true;
      i--;
    }
  }
    let length = musicList.length;
    if (validation) {
      promiseList[last] = callMusic(allTrackList[last].download_path);
      await callMusicBlob(promiseList[last],allTrackList[last]);
      let intervalPut = setInterval(()=>{
        if (typeof musicList[length] !== "undefined") {
          let x = 0;
          musicList[length].loop = currentMusicPlaying[0].loop
          for (let i = musicList.length; i < 4; i++) {
            musicList[i] = tempArray[x];
            x++;
          }
          if (musicList.length === 4) {
            clearInterval(intervalPut);
          }
        }
      },500)
    }
}
async function addTrackMultAdd(last){
  let loopNumber = 0;
  let tempArray = [];
  let validation = false ;
  for (let i = 0; i < musicList.length; i++) {
    if (allTrackList[last].order > musicList[i].number && currentMusicPlaying[0].loop !== musicList[i].loop) {
      loopNumber = currentMusicPlaying[0].loop;
      tempArray.push(musicList[i]);
      musicList.splice(i,1);
      validation = true;
      i--;
    }
  }
    let length = musicList.length;
    if (validation) {
      promiseList[last] = callMusic(allTrackList[last].download_path);
      await callMusicBlob(promiseList[last],allTrackList[last]);
      let intervalPut = setInterval(()=>{
        if (typeof musicList[length] !== "undefined") {
          let x = 0;
          musicList[length].loop = currentMusicPlaying[0].loop
          let max = allTrackList.length -1;
          for (let i = musicList.length; i < max; i++) {
            musicList[i] = tempArray[x];
            x++;
          }
          if (musicList.length === max) {
            clearInterval(intervalPut);
          }
        }
      },500)
    }
    else{
      promiseList[last] = callMusic(allTrackList[last].download_path);
      await callMusicBlob(promiseList[last],allTrackList[last]);
      if (typeof currentMusicPlaying[0] === "undefined") {
        let idInterval = setInterval(()=>{
          if (typeof musicList[0] != "undefined") {
            setAudio(musicList[0].path);
            currentMusicPlaying[0] = musicList[0];
            spliceList(musicList);
            clearInterval(idInterval)
          }
        },500)
      }
      else {
      }
    }
}
