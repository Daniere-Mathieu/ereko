let counter = 0;
// initilization d'un compteur
let currentMusic = 0;
// initilization du numéro de la musique actuel
let futureMusic = currentMusic + 1;
// initilization du numéro de la musique a venir
let lastLoadMusic = currentMusic + 4;
// initilization du numéro de la prochaine musique a charger avec fetch
let allTrackList = [
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg",number:0,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:1,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg",number:2,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:3,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:4,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:5,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:6,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:7,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:8,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:9,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:10,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:11,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:12,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:13,},
];
// tableau temporaire servant de remplacant a la réponse du serveur sur la liste de musique
let musicList = [];
//j'initilize le tableau de musique
let audio = new Audio();
//object audio
audio.autoplay = true;
// je donne la valeur true a autoplay pour que les musique se jouent en automatique apres la premiere
audio.volume = .75;
// je donne la valeur au volume du son
function setAudio(source){
  console.log("setAudio");
  audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  console.log("ended");
  let endVerification = currentMusic + 1;
  if (allTrackList.length === endVerification) {
    currentMusic = 0;
    futureMusic = 1;
    setAudio(musicList[0]);
    spliceList(musicList,3);
    nextLoadMusic();
  }else {
    setAudio(musicList[futureMusic]);
    currentMusic = futureMusic;
    futureMusic++;
    spliceList(musicList,4);
    nextLoadMusic();
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
window.addEventListener("load",() => {
  console.log("load");
  for (let i = currentMusic; i < lastLoadMusic; i++) {
    callMusic(allTrackList[i].path);
  }
    let timeoutID = setTimeout(()=>{
    setAudio(musicList[currentMusic])
  },9000);
  console.log("c'est passé");
})
// fonction qui capte le chargement de la page pour load les premier musique
function nextLoadMusic(){
  console.log("nextLoadMusic")
  if (lastLoadMusic >= allTrackList.length) {
    console.log("nextLoadMusic/if");
    lastLoadMusic -= allTrackList.length;
    callMusic(allTrackList[lastLoadMusic].path);
    console.log(lastLoadMusic+"/lastLoadMusic");
    lastLoadMusic++;
  }
  else {
    callMusic(allTrackList[lastLoadMusic].path);
    console.log("nextLoadMusic/else");
    console.log(lastLoadMusic+"/lastLoadMusic");
    lastLoadMusic++;
  }
}
// fonction qui a pour but de d'apeller la prochaine musique loadable
function spliceList(array,size){
  console.log("spliceList");
  if (array.length >= size) {
    array.splice(0,1);
    console.log("spliceList/if");
  }
}
