function callMusic(url){
  return fetch(url).then(function(response) {
  if(response.ok) {
    response.blob().then(function(blob) {
      musicList[counter] = URL.createObjectURL(blob);
      if (counter < 3) {
        counter++;
      }
    });
  } else {
    console.log('Network request for musicCall' + response.status + ': ' + response.statusText);
  }
});
}
//fonction qui demande au serveur les musiques
