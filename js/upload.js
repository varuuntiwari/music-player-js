document.querySelector('#uploadSong').addEventListener('change', (e) => {
    if(e.target.files[0]) {
        song = e.target.files[0];
        document.querySelector('#fileName').innerText = e.target.files[0].name;
        document.querySelector('#readySong').classList.remove('hide');
        document.querySelector('#readySong').classList.add('show');
    }
})

function showSong() {
    document.querySelector('#getSong').classList.remove('show');
    document.querySelector('#getSong').classList.add('hide');
    document.querySelector('#player').classList.remove('hide');
    document.querySelector('#player').classList.add('show');
    setUploadedSong(song);
}