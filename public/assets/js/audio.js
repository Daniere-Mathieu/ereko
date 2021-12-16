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
let audio = new Audio();
//object audio
audio.volume = .75;
// je donne la valeur au volume du son
//

let objectTrackList = [];

let playlistID = decodeUrl()
function setAudio(source){
      audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  let endVerification = currentMusic + 1;
  if (allTrackList.length <= endVerification) {
    console.log("endend")
    setPlaying("title_track")
    setAudio(musicList[0].path);
    spliceList(musicList,4);
    nextLoadMusic();
    currentMusic = 0;
    futureMusic = 1;

  }else {
    setPlaying("title_track")
    setAudio(musicList[0].path);
    currentMusic++;
    futureMusic++;
    spliceList(musicList,4);
    nextLoadMusic();
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
window.addEventListener("load",async() => {
  await callTrackList(playlistID);
  for (let i = 0; i < allTrackList.length; i++) {
      let t = allTrackList[i];
      let track = new Track(t.party_id, t.track_id, t.state_for_party, t.order, t.state_track, t.download_path);
      track.displayTrack(allTrackList[i].track_title, allTrackList[i].order);
      objectTrackList.push(track);
  }
  if (allTrackList.length > 0) {
    if (allTrackList[currentMusic].state_track === "READY") {
      await callMusic(allTrackList[currentMusic].download_path,allTrackList[currentMusic]);
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
        await callMusic(allTrackList[currentMusic].download_path,allTrackList[currentMusic]);
      }
    }
    if (musicList.length > 0) {
      setAudio(musicList[0].path);
      spliceList(musicList,1);
      counter = 0;
      loadCallMusic();
    }
    else {
      let intervalID = setInterval(function () {
        if (musicList.length >= 1) {
          setAudio(musicList[0].path);
          spliceList(musicList,1);
          counter = 0;
          loadCallMusic();
          clearInterval(intervalID);
        }
      }, 700);
    }
  }
})
// fonction qui capte le chargement de la page pour load les premier musique
function loadCallMusic(){
  return new Promise(resolve=>{
    if (allTrackList.length < 5) {
      for (let i = futureMusic; i < allTrackList.length ; i++) {
        if (allTrackList[i].state_track === "READY") {
          callMusic(allTrackList[i].download_path,allTrackList[i]);
        }
      }
    }
    else {
      for (let i = futureMusic; i < lastLoadMusic+1 ; i++) {
        if (allTrackList[i].state_track === "READY") {
          callMusic(allTrackList[i].download_path,allTrackList[i]);
        }
      }
    }
    resolve("resolve");
  })
}
async function nextLoadMusic(){
  if (lastLoadMusic >= allTrackList.length) {
    lastLoadMusic -= allTrackList.length;
    await callMusic(allTrackList[lastLoadMusic].download_path,allTrackList[lastLoadMusic]);
    lastLoadMusic++;
  }
  else {
    await callMusic(allTrackList[lastLoadMusic].download_path,allTrackList[lastLoadMusic]);
    lastLoadMusic++;
  }
}
// fonction qui a pour but de d'apeller la prochaine musique loadable
function spliceList(array,size){
  console.log("splice")
    if (array.length >= size) {
      array.splice(0,1);
    }
}
function setPlaying(param){
  let trackTitle = document.getElementById(allTrackList[currentMusic].order);
  let idCurrentMusic = trackTitle.getAttribute("id");
  if(allTrackList[currentMusic].order == idCurrentMusic){
    songName.innerText = allTrackList[currentMusic].track_title;
    trackTitle.setAttribute("class",param);
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

async function checkTrackState() {
  // console.log('Voilà la liste des tracks', allTrackList);
  // console.log('taille alltracklist', allTrackList.length)
  // Récupérer la liste sur le serveur
  let updateList = await callTrackList(playlistID);
  console.log(updateList)

  // allTrackList.forEach(track => {
  //   if (track.state_track == 'READY') {
  //     console.log('READY');
  //   }
  // });

  // console.log(objectTrackList);
}

setInterval(checkTrackState, 3000);
