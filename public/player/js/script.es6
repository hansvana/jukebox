let jukebox = {

    FADE_TIME: 2000,

    deckA: new Audio(),
    deckB: new Audio(),
    activeDeck: null,
    
    fade: {
        isFading: false,
        progress: 0,
        started: 0
    },

    playlist: [],

    init: function() {
        this.activeDeck = this.deckA;

        this.loadJSON('js/filelist.json',
            null,
            data => {
                data.filelist.forEach( s => {
                    this.addToPlaylist(s,"kees");
                });
                this.playNext(this.activeDeck);
            },
            failed => {console.log(failed)}
        );

        window.addEventListener("keyup", () => this.crossfadeNow());
    },

    playSong: function(deck, fileName, user) {
        console.log("playing " + fileName)
        deck.src = "mp3/" + fileName;
        deck.play();
        deck.addEventListener("timeupdate", () => this.updateProgress());

        let parsedName = this.parseFilename(fileName);

        this.loadJSON('https://api.spotify.com/v1/search'+
            '?q='+parsedName.song+'%20artist:'+parsedName.artist+'&type=track',
            null,
            data => {
                var track  = data.tracks.items[0];
                console.log(data);

                if (typeof track !== "undefined"){
                    id("currentSong-title").innerHTML = track.name;
                    id("currentSong-artist").innerHTML =
                        track.artists[0].name +
                        "<br>Aangevraagd door: " + user;
                    id("currentSong-image").src = track.album.images[1].url;
                } else {
                    id("currentSong-title").innerHTML = parsedName.song;
                    id("currentSong-artist").innerHTML =
                        parsedName.artist +
                        "<br>Aangevraagd door: " + user;
                    id("currentSong-image").src = "no-img.jpg";
                }


            },
            failed => {console.log(failed)}
        )

    },

    playNext: function(deck) {
        this.playSong(
            deck,
            this.playlist[0].fileName,
            this.playlist[0].user
        );

        //this.activeDeck = (this.activeDeck == this.deckA ? this.deckB : this.deckA);

        var element = id("comingUp");
        element.removeChild(element.firstChild);

        this.playlist.shift();

    },

    addToPlaylist: function(fileName,user) {
        this.playlist.push({fileName,user});

        let fn = this.parseFilename(fileName);
        let a = document.createElement('a');
        a.className = "list-group-item";
        a.href = "#";
        a.innerHTML = '<strong>' + fn.song + '</strong> - ' + fn.artist;

        id("comingUp").appendChild(a);


    },

    // EVENT FUNCTIONS

    updateProgress: function() {
        let duration = this.activeDeck.duration;
        let current = this.activeDeck.currentTime;

        let p = (100/duration) * current;

        id("progress").style.width = p + '%';

        if ((duration-current)*1000 < this.FADE_TIME && !this.fade.isFading) this.crossfadeNow();

        let otherDeck = (this.activeDeck == this.deckA ? this.deckB : this.deckA);

        if (this.fade.isFading){
            if (Date.now() - this.fade.started > this.FADE_TIME){
                this.activeDeck.pause();
                this.activeDeck = otherDeck;
                this.fade.isFading = false;
            } else {
                let volume = (1 / this.FADE_TIME) * (Date.now() - this.fade.started);
                let invVolume = 1 - volume;

                this.activeDeck.volume = invVolume;
                otherDeck.volume = volume;
            }
        }
    },

    crossfadeNow: function() {
        this.fade.started = Date.now();
        this.fade.isFading = true;

        let otherDeck = (this.activeDeck == this.deckA ? this.deckB : this.deckA);
        this.playNext(otherDeck);
        otherDeck.volume = 0;
    },

    // HELPER FUNCTIONS

    parseFilename: function(fileName) {
        let artist = fileName.substr(0, fileName.indexOf('-')).trim();
        let song = fileName.substr(
            fileName.indexOf('-') + 1,
            fileName.indexOf('.') - fileName.indexOf('-') - 1).trim();

        return {artist, song};
    },

    loadJSON: function(path, data, success, error) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success)
                        success(JSON.parse(xhr.responseText));
                } else {
                    if (error)
                        error(xhr);
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send(data);
    },

};

function id(id){
    return document.getElementById(id);
}

window.addEventListener("load", () => {jukebox.init()});