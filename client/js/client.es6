let client = {

    lastSearch: "",

    init: function() {
        console.log("Hello world!");

        ['keypress', 'paste', 'input'].forEach( event => {
            id("search").addEventListener(event, () => { this.fuzzySearch() });
        });

    },
    fuzzySearch: function() {

        let search = id("search").value;

        if (search !== this.lastSearch) {

            this.loadJSON('http://127.0.0.1:3000/fuzzySearch',
                {txt: search},
                data => {
                    this.populateList(data)
                },
                failed => {
                    console.log(failed)
                }
            );

            this.lastSearch = search;

        }

    },
    populateList: function(data) {
        console.log(data);
        id("song-list").innerHTML = "";

        for (let track of data.results){
            let a = document.createElement('a');
            a.className = "list-group-item";
            a.href = "#";
            a.innerHTML = track;

            a.addEventListener("click", () => {
               this.sendRequest(track);
            });

            id("song-list").appendChild(a);
        }
    },
    sendRequest: function(track) {
        this.loadJSON('http://127.0.0.1:3000/sendRequest',
            {track, user: id("name").value},
            data => {
                this.populateList(data)
            },
            failed => {
                console.log(failed)
            }
        );
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

        xhr.open("POST", path, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    },
};

function id(id){
    return document.getElementById(id);
}

window.addEventListener("load", () => {client.init()});
