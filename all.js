var popup = document.getElementById('popup');

window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = filmsXhrHandler;
    xhr.open('GET', 'https://swapi.co/api/films/', true);
    xhr.send();
}

function filmsXhrHandler (event) {
    var xhr = event.currentTarget;
    if (xhr.readyState != 4) return;
    checkXhrError( xhr, function (text) {
        var data = getJson(text);
        if (data) {
            renderFilmList(data.results);
            console.log(data.results);
        }
    });
}

function renderFilmList (listData) {
    var ul = document.querySelector('.episodes-list');
    listData.forEach(function(item) {
        var li = getFilmListItem (
            item.episode_id,
            item.characters,
            item.title,
            item.director,
            item.release_date,
            item.opening_crawl
        );

        var button = getButton('Characters', 'btn-characters');
        button.addEventListener( "click" , filmCharactersHandler);
        li.appendChild(button);
        ul.appendChild(li);
    });
}

function getButton (title, className) {
    var input = document.createElement('input');
    input.setAttribute('type', 'button');
    input.setAttribute('value', title);
    input.classList.add(className);
    return input;
}

function getFilmListItem (id, characters, title, director, release_date, opening_crawl) {
    var li = document.createElement('li');
    li.setAttribute('data-characters', encodeJson(characters));
    li.setAttribute('class', 'episode');

    li.innerHTML =
        `   <h2 class=\"title\">Star wars. Episode ${id}: ${title}</h2>` +
        `   <p class=\"description\">${opening_crawl}</p>`+
        `   <p class=\"director\">${director}</p>`+
        `   <p class=\"release\">${release_date}</p>`
    ;
    return li;
}

function filmCharactersHandler (event) {
    var el = event.currentTarget;
    var characters = getJson(el.parentNode.getAttribute('data-characters'));
    var ul = document.createElement('ul');

    renderFilmCharacters (characters, ul);
    popup.innerHTML = '';
    popup.appendChild(ul);

    var button = getButton('Hide', 'btn-hide');
    button.addEventListener( "click", popupHide);
    popup.appendChild(button);
    popup.classList.toggle('hidden');
}

function renderFilmCharacters (characters, container) {
        characters.forEach(function(item) {
        var characterXHR = new XMLHttpRequest();
        characterXHR.onreadystatechange = function() {
            if (characterXHR.readyState != 4) return;
            checkXhrError (characterXHR, function (text) {
                var data = getJson(text);
                if (data) {
                    var li = getCharacterListItem(
                        data.name,
                        data.gender
                    );
                    container.appendChild(li);
                }
            });
        };
        characterXHR.open('GET', item, true);
        characterXHR.send();
    });
}

function getCharacterListItem (name, gender) {
    var li = document.createElement('li');
    li.innerHTML =
        `<p class=\"character\">${name}<br><span class=\\"gender\\">(${gender})</span></p>`
    ;
    return li;
}

function getJson (text) {
    try {
        var data = JSON.parse(text);
    } catch (e) {
        handleError('Error ' + e.name + ":" + e.message + "\n" + e.stack);
    }
    if (!data) {
        handleError('Empty data');
    }
    return data;
}

function encodeJson (data) {
    return JSON.stringify(data);
}

function checkXhrError (xhr, callback) {
    if (xhr.status == 200) {
        callback(xhr.responseText);
    } else {
        console.log(xhr.status + ': ' + xhr.statusText);
    }
}

function popupHide (event) {
    event.preventDefault();
    popup.classList.toggle('hidden');
}