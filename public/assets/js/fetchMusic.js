async function callMusic(url,array){
  return fetch(url).then(function(response) {
  if(response.ok) {
    response.blob().then(function(blob) {
      musicList[counter].path = URL.createObjectURL(blob);
      musicList[counter].number = array
      if (counter < 3) {
        counter++;
      }
    });
  } else {
    console.log('Network request for musicCall' + response.status + ': ' + response.statusText);
  }
});
};
//fonction qui demande au serveur les musiques
