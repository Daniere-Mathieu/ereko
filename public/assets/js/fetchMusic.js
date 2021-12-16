async function callMusic(url){
  console.log("callMusic1");
  console.log("callMusic1/url/"+url);
  return fetch(url)
};
//fonction qui demande au serveur les musiques
function callMusicBlob(promiseMusic,array){
  promiseMusic.then(response=> {
  if(response.ok) {
    console.log("if blob");
    response.blob().then(blob => {
      console.log("callMusic3");
      console.log("callMusic3/counter/"+counter);
      musicList[counter] = {path:URL.createObjectURL(blob),number: array.order};
      console.log("callMusic4");
      if (counter < 3) {
        counter++;
      }
    })
  } else {
    console.log('Network request for musicCall' + response.status + ': ' + response.statusText);
  }
});
}
function callMusicBlobUrl(promiseblob,array){
  promiseblob.then(blob => {
    console.log("callMusic3");
    console.log("callMusic3/counter/"+counter);
    musicList[counter] = {path:URL.createObjectURL(blob),number: array.order};
    console.log("callMusic4");
    if (counter < 3) {
      counter++;
    }
  })
}
