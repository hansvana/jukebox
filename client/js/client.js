"use strict";

var client = {

    lastSearch: "",

    init: function init() {
        var _this = this;

        console.log("Hello world!");

        ['keypress', 'paste', 'input'].forEach(function (event) {
            id("search").addEventListener(event, function () {
                _this.fuzzySearch();
            });
        });
    },
    fuzzySearch: function fuzzySearch() {
        var _this2 = this;

        var search = id("search").value;

        if (search !== this.lastSearch) {

            this.loadJSON('http://127.0.0.1:3000/fuzzySearch', { txt: search }, function (data) {
                _this2.populateList(data);
            }, function (failed) {
                console.log(failed);
            });

            this.lastSearch = search;
        }
    },
    populateList: function populateList(data) {
        var _this3 = this;

        console.log(data);
        id("song-list").innerHTML = "";

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var track = _step.value;

                var a = document.createElement('a');
                a.className = "list-group-item";
                a.href = "#";
                a.innerHTML = track;

                a.addEventListener("click", function () {
                    _this3.sendRequest(track);
                });

                id("song-list").appendChild(a);
            };

            for (var _iterator = data.results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                _loop();
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },
    sendRequest: function sendRequest(track) {
        var sure = confirm(track + " aanvragen?");

        if (sure) {
            this.loadJSON('http://127.0.0.1:3000/sendRequest', { track: track, user: id("name").value }, function (data) {
                console.log(data);
            }, function (failed) {
                console.log(failed);
            });
        }
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

        xhr.open("POST", path, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
};

function id(id) {
    return document.getElementById(id);
}

window.addEventListener("load", function () {
    client.init();
});

//# sourceMappingURL=client.js.map