audio.addEventListener("ended",() => {
  if (allTrackList.length <= futureMusic) {
    setPlaying("track")
    sortMusiclist(musicList);
    if (musicList.length === 0 ) {
      musicList[0] = currentMusicPlaying;
    }
    setAudio(musicList[0].path);
    currentMusicPlaying = musicList[0];
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
    currentMusicPlaying = musicList[0];
    currentMusic++;
    futureMusic++;
    spliceList(musicList);
    nextLoadMusic();
  }
})
window.addEventListener("load",async() => {
  await callTrackList(playlistID);
  if (allTrackList.length > 0) {
    if (allTrackList[currentMusic].state_track === "READY") {
      promiseList[currentMusic] = callMusic(allTrackList[currentMusic].download_path);
      await callMusicBlob(promiseList[currentMusic],allTrackList[currentMusic]);
    }
    if (musicList.length > 0) {
      setAudio(musicList[0].path);
      currentMusicPlaying = musicList[0];
      spliceList(musicList);
      loadCallMusic();
    }
    else {
      let intervalID = setInterval(function () {
        if (musicList.length >= 1) {
          setAudio(musicList[0].path);
          currentMusicPlaying  = musicList[0];
          spliceList(musicList);
          loadCallMusic();
          clearInterval(intervalID);
        }
      }, 700);
    }
  }
})
