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
let save;
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

let playlistID = decodeUrl()
function setAudio(source){
      audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  let endVerification = currentMusic + 1;
  console.log("ended")
  if (allTrackList.length <= endVerification) {
    console.log("endend")
    setPlaying("title_track")
    sortMusiclist(musicList);
    if (musicList.length === 0 ) {
      console.log(save)
      musicList[0] = save;
    }
    setAudio(musicList[0].path);
    spliceList(musicList,1);
    nextLoadMusic();
    currentMusic = 0;
    futureMusic = 1;
  }else {
    setPlaying("title_track");
    sortMusiclist(musicList);
    setAudio(musicList[0].path);
    currentMusic++;
    futureMusic++;
    spliceList(musicList,1);
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
      console.log(promiseList)
    }
    else{
      let onDownloadCounter = true;
      let dowloadable = false;
      while(allTrackList[currentMusic].state_track !== "READY"){
          await callTrackList(playlistID);
        if (currentMusic+1 === allTrackList.length) {
          let currentMusic = 0;
          let futureMusic = currentMusic + 1;
          let lastLoadMusic = currentMusic + 4;
          onDownloadCounter++;
        }
        else {
          currentMusic++;
          futureMusic++;
          lastLoadMusic++;
        }
        if (allTrackList[currentMusic].state_track === "READY") {
          dowloadable = true;
          break;
        }
        if (onDownloadCounter === 2) {
          dowloadable = false
          break;
        }
      }
      if (dowloadable === true) {
       promiseList[currentMusic] = callMusic(allTrackList[currentMusic].download_path);
        await callMusicBlob(promiseList[currentMusic],allTrackList[currentMusic])
      }
    }
    if (musicList.length > 0) {
      setAudio(musicList[0].path);
      if (allTrackList.length === 1) {
        save = musicList[0];
        spliceList(musicList,1);
      }
      else {
        spliceList(musicList,1);
      }
      counter = 0;
      loadCallMusic();
    }
    else {
      let intervalID = setInterval(function () {
        if (musicList.length >= 1) {
          setAudio(musicList[0].path);
          if (allTrackList.length === 1) {
            save = musicList[0];
            spliceList(musicList,1);
          }
          else {
            spliceList(musicList,1);
          }
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
  console.log("loadCallMusic")
    if (allTrackList.length < 5) {
      for (let i = futureMusic; i <= allTrackList.length ; i++) {
        console.log(i);
        console.log(allTrackList.length)
        if (i > (allTrackList.length -1)) {
          break;
        }
        else {
          if (allTrackList[i].state_track === "READY") {
            promiseList[i] = callMusic(allTrackList[i].download_path);
            console.log(promiseList)
            await callMusicBlob(promiseList[i],allTrackList[i])
          }
        }
      }
    }
    else {
      for (let i = futureMusic; i < lastLoadMusic+1 ; i++) {
        console.log(i);
        if (allTrackList[i].state_track === "READY") {
          promiseList[i] = callMusic(allTrackList[i].download_path);
          console.log(promiseList)
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
  console.log("nextLoadMusic/"+lastLoadMusic)
  if (lastLoadMusic >= allTrackList.length) {
    console.log("nextLoadMusic/if/"+lastLoadMusic)
    if (reset) {
      console.log("nextLoadMusic/if/reset"+lastLoadMusic)
      lastLoadMusic -= allTrackList.length;
    }
    else {
      console.log("nextLoadMusic/if/else"+lastLoadMusic)
      console.log(loop+"/loop")
      lastLoadMusic = 0;
      loop++;
      reset = true;
    }
    console.log(lastLoadMusic + "/lastLoadMusic");
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
function spliceList(array,size){
  console.log("splice")
    if (array.length >= size) {
      array.splice(0,1);
    }
}
function setPlaying(className){
  // I think nexr three lines are useless
  let trackDiv = document.getElementById(allTrackList[currentMusic].order);
  let idCurrentMusic = trackDiv.getAttribute("id");
  if(allTrackList[currentMusic].order == idCurrentMusic){
    songName.innerText = allTrackList[currentMusic].track_title;
    trackDiv.setAttribute("class", className);
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
setInterval(() => {
  myPlaylist.update();
}, 2500);
function sortMusiclist(tab){
    let changed;
    do{
        changed = false;
        for(let i=0; i < tab.length-1; i++) {
            if(tab[i].number > tab[i+1].number) {
              console.log("yes")
              if(tab[i].loop === tab[i+1].loop) {
                console.log("yes,yes,yes,yes")
                let tmp = tab[i];
                tab[i] = tab[i+1];
                tab[i+1] = tmp;
                changed = true;
              }
            }
        }
    } while(changed);
}
