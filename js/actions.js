var progress;
let song;
function addKeyControls(song) {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case " ":
                playPause();
                break;
            case "ArrowLeft":
                if(song.currentTime - 5.0 >= 0.0) {
                    song.currentTime -= 5.0;
                } else {
                    song.currentTime = 0;
                }
                break;
            case "ArrowRight":
                    if(song.currentTime + 5.0 <= song.duration) {
                        song.currentTime += 5.0;
                    } else {
                        song.currentTime = song.duration;
                    }
                    break;
            case "ArrowUp":
                if(song.volume + 0.05 <= 1) {
                    song.volume += 0.05;
                } else {
                    song.volume = 1;
                }
                break;
            case "ArrowDown":
                if(song.volume - 0.05 >= 0) {
                    song.volume -= 0.05;
                } else {
                    mute();
                }
                break;
            default:
                break;
        }
    })
}

function setUploadedSong(uploadedFile) {
    song = document.querySelector('#song');
    song.setAttribute('src', URL.createObjectURL(uploadedFile));
    song.load();
    addKeyControls(song);
    jsmediatags.read(uploadedFile, {
        onSuccess: (metadata) => {
            document.querySelector('#title').innerText = metadata.tags.title;
            document.querySelector('#artist').innerText = metadata.tags.artist;
            document.querySelector('#cover').setAttribute('src', getCoverArt(metadata.tags.picture));
            song.volume = 0.5;
            updateVolumeBar(0.5);
        },
        onError: (err) => {
            console.log(err);
        }
    });
    progress = setInterval(function() {
        song.ontimeupdate = updateTimeBar(song);
    }, 1000);
    song.addEventListener('volumechange', (e) => {
        updateVolumeBar(e.target.volume);
    });
}

function getCoverArt(picture) {
    let { data, format } = picture;
    let base64String = "";
    for(let i = 0; i < data.length; i++) {
    base64String += String.fromCharCode(data[i]);
    }
    return `data:${data.format};base64,${window.btoa(base64String)}`;
}

function playPause() {
    var btn = document.querySelector('#play');
    var song = document.querySelector('#song');
    if(btn.getAttribute('src') === 'img/play.png') {
        song.play();
        btn.setAttribute('src', 'img/pause.png');
    } else {
        song.pause();
        btn.setAttribute('src', 'img/play.png');
    }
}

function mute() {
    if(song.volume === 0) {
        song.volume = 0.5;
        document.querySelector('#mute').setAttribute('src', 'img/volume.png');
    } else {
        song.volume = 0;
        document.querySelector('#mute').setAttribute('src', 'img/mute.png');
    }
}

function secondsToMinutes(e) {
    let minutes = 0;
    let seconds = 0;
    if(e >= 60) {
        minutes = Math.floor(e/60);
    }
    seconds = Math.floor(e-minutes*60)
    if(seconds < 10) {
        return minutes+":0"+seconds
    }
    return minutes+":"+seconds
}

function updateTimeBar(e) {
    document.querySelector('#start').innerText = secondsToMinutes(e.currentTime);
    document.querySelector('#end').innerText = secondsToMinutes(e.duration);

    percentage = (e.currentTime/e.duration) * 100;
    document.querySelector('#timeprogress').style.width = percentage+"%";
    if(percentage == 100) {
        clearInterval(progress);
        
        document.querySelector('#start').innerText = secondsToMinutes(0);
        document.querySelector('#end').innerText = secondsToMinutes(e.duration);
        document.querySelector('#progress').style.width = 0+"%";
        document.querySelector('#play').setAttribute('src', 'img/play.png');
    }
}

function updateVolumeBar(vol) {
    let e = document.querySelector('#volumeprogress');
    volume = vol * 100;
    document.querySelector('#volevel').innerText = `${Math.floor(volume)}%`
    document.querySelector('#volumeprogress').style.width = volume+"%";
}