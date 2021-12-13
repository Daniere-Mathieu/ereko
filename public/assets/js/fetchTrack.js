function callTrackList(uid){
  console.log("callTrackList");
  let url = "http://0.0.0.0:8000/api/"+uid;
  fetch(url).then((response)=>{
    if(response.ok){
      return response.json().then(json => {
        for(let i = 0; i < json.length ;i++)
        allTrackList[i] = json[i];
       });
    }
    else{
      console.log("il y a eu une erreur")
    }
  })
}