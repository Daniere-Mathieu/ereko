async function callMusic(url){
  return fetch(url)
};
//fonction qui demande au serveur les musiques
function callMusicBlob(promiseMusic,array){
  promiseMusic.then(response=> {
  if(response.ok) {
    response.blob().then(blob => {
      musicList.push({path:URL.createObjectURL(blob),number: array.order,loop:loop});
    })
  } else {
    console.log('Network request for musicCall' + response.status + ': ' + response.statusText);
  }
});
}
