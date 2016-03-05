"use strict";

var jukebox = {

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

    init: function init() {
        var _this = this;

        this.activeDeck = this.deckA;

        this.loadJSON('js/filelist.json', null, function (data) {
            data.filelist.forEach(function (s) {
                _this.addToPlaylist(s, "kees");
            });
            _this.playNext(_this.activeDeck);
        }, function (failed) {
            console.log(failed);
        });

        window.addEventListener("keyup", function () {
            return _this.crossfadeNow();
        });
    },

    playSong: function playSong(deck, fileName, user) {
        var _this2 = this;

        console.log("playing " + fileName);
        deck.src = "mp3/" + fileName;
        deck.play();
        deck.addEventListener("timeupdate", function () {
            return _this2.updateProgress();
        });

        var parsedName = this.parseFilename(fileName);

        this.loadJSON('https://api.spotify.com/v1/search' + '?q=' + parsedName.song + '%20artist:' + parsedName.artist + '&type=track', null, function (data) {
            var track = data.tracks.items[0];
            console.log(data);

            if (typeof track !== "undefined") {
                id("currentSong-title").innerHTML = track.name;
                id("currentSong-artist").innerHTML = track.artists[0].name + "<br>Aangevraagd door: " + user;
                id("currentSong-image").src = track.album.images[1].url;
            } else {
                id("currentSong-title").innerHTML = parsedName.song;
                id("currentSong-artist").innerHTML = parsedName.artist + "<br>Aangevraagd door: " + user;
                id("currentSong-image").src = "no-img.jpg";
            }
        }, function (failed) {
            console.log(failed);
        });
    },

    playNext: function playNext(deck) {
        this.playSong(deck, this.playlist[0].fileName, this.playlist[0].user);

        //this.activeDeck = (this.activeDeck == this.deckA ? this.deckB : this.deckA);

        var element = id("comingUp");
        element.removeChild(element.firstChild);

        this.playlist.shift();
    },

    addToPlaylist: function addToPlaylist(fileName, user) {
        this.playlist.push({ fileName: fileName, user: user });

        var fn = this.parseFilename(fileName);
        var a = document.createElement('a');
        a.className = "list-group-item";
        a.href = "#";
        a.innerHTML = '<strong>' + fn.song + '</strong> - ' + fn.artist;

        id("comingUp").appendChild(a);
    },

    // EVENT FUNCTIONS

    updateProgress: function updateProgress() {
        var duration = this.activeDeck.duration;
        var current = this.activeDeck.currentTime;

        var p = 100 / duration * current;

        id("progress").style.width = p + '%';

        if ((duration - current) * 1000 < this.FADE_TIME && !this.fade.isFading) this.crossfadeNow();

        var otherDeck = this.activeDeck == this.deckA ? this.deckB : this.deckA;

        if (this.fade.isFading) {
            if (Date.now() - this.fade.started > this.FADE_TIME) {
                this.activeDeck.pause();
                this.activeDeck = otherDeck;
                this.fade.isFading = false;
            } else {
                var volume = 1 / this.FADE_TIME * (Date.now() - this.fade.started);
                var invVolume = 1 - volume;

                this.activeDeck.volume = invVolume;
                otherDeck.volume = volume;
            }
        }
    },

    crossfadeNow: function crossfadeNow() {
        this.fade.started = Date.now();
        this.fade.isFading = true;

        var otherDeck = this.activeDeck == this.deckA ? this.deckB : this.deckA;
        this.playNext(otherDeck);
        otherDeck.volume = 0;
    },

    // HELPER FUNCTIONS

    parseFilename: function parseFilename(fileName) {
        var artist = fileName.substr(0, fileName.indexOf('-')).trim();
        var song = fileName.substr(fileName.indexOf('-') + 1, fileName.indexOf('.') - fileName.indexOf('-') - 1).trim();

        return { artist: artist, song: song };
    },

    loadJSON: function loadJSON(path, data, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success) success(JSON.parse(xhr.responseText));
                } else {
                    if (error) error(xhr);
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send(data);
    }

};

function id(id) {
    return document.getElementById(id);
}

window.addEventListener("load", function () {
    jukebox.init();
});

//# sourceMappingURL=script.js.map