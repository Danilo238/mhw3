const client_id = '2g9gv8obyn06srcxntpcgkf0gi8ovc';
const client_secret = 'zfwq9tw5ubc2bqcezifnplggymm1zf'; //Cambia ogni volta che riapri il sito di Twitch
let responses;
let j;

function chiudiModale(event)
{
    console.log(event.currentTarget);
    const modalView = document.querySelector('#modal-view');
    const container = document.querySelector('#modal-view div');
    container.classList.remove('container-modale')
    document.body.classList.remove('no-scroll');
    modalView.classList.add('hidden');
    modalView.innerHTML = '';

    modalView.addEventListener('click', apriModale);
}

function apriModale(event)
{
    let c;

    const modalView = document.querySelector('#modal-view');
    modalView.addEventListener('click', chiudiModale);

    document.body.classList.add('no-scroll');
    modalView.style.top = window.pageYOffset + 'px';

    const image = document.createElement('img');
    const container = document.createElement('div');

    c = event.currentTarget.dataset.number;
    console.log(c);
    const description = document.createElement('p');
    const titolo = document.createElement('h2');
    titolo.textContent = responses[c].name;
    container.appendChild(titolo);
    description.textContent = "Description: " + responses[c].summary;
    container.appendChild(description);

    image.src = event.currentTarget.querySelector('img').src;
    container.classList.add('container-modale');

    container.appendChild(image);
    modalView.appendChild(container);

    modalView.classList.remove('hidden');

    modalView.removeEventListener('click', apriModale)
}

function onJsonImage(response)
{
    console.log(response);
    const namee = (responses[j].name);
    const summary = (responses[j].summary);

    const gameAlbum = document.querySelector('#game-view');

    const container = document.createElement('div');
    const titolo = document.createElement('h2');
    titolo.textContent = namee;
    container.appendChild(titolo);
    container.classList.add('div');

    container.setAttribute = ('data-number', 1);
    container.dataset.number = j;

    const img = document.createElement('img');
    img.classList.add('size');
    img.src = "overwatch.jpg";
    //img.src = response[0].url;
    
    container.appendChild(img);
    gameAlbum.appendChild(container);

    container.addEventListener('click', apriModale);

    j++;
}

function onResponseImage(response)
{
    return response.json();
}

function onJsonGiveaway(response)
{
    const container = document.querySelector('#giveaway');

    const titolo = document.createElement('h2');
    titolo.textContent = "Giveaways più popolari (generici)"
    container.appendChild(titolo);

    for(let i = 0; i < 5; i++)
    {
        const div = document.createElement('div');

        const nome = document.createElement('h4');
        nome.textContent = "Nome del giveaway: " + response[i].title;
        const link = document.createElement('h4');
        link.textContent = "Link del giveaway: " + response[i].open_giveaway_url;

        div.appendChild(nome);
        div.appendChild(link);

        const image = document.createElement('img');
        image.src = response[i].image;
        div.appendChild(image);

        container.appendChild(div);
    }
}

function onJson(response)
{ 

    j = 0;
    responses = response;

    for(i = 0; i < 5; i++)
    {
        gameId = response[i].id;

        const requestBody = `
        fields url;
        where game = ${gameId};
        `;
    
        fetch(`https://api.igdb.com/v4/covers/`, {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Client-ID': client_id,
                'Authorization': 'Bearer ' + token_data,
            },
            body: requestBody,
        }).then(onResponseImage).then(onJsonImage);
    }
}

function onResponse(response)
{
    return response.json();
}

function search(event)
{
    event.preventDefault();

    const album = document.querySelector('#game-view');
    album.innerHTML = '';

    const container = document.querySelector('#content');
    const text = encodeURIComponent(container.value);

    fetch('https://api.igdb.com/v4/games/?search=' + text + '&fields=id,name,summary', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Client-ID': client_id,
            'Authorization': 'Bearer ' + token_data,
        },
    }).then(onResponse).then(onJson);

    fetch('https://www.gamerpower.com/api/giveaways?title=' + text, {
        method: 'GET',
    }).then(onResponse).then(onJsonGiveaway);
}

function onJsonToken(response)
{
    token_data = response.access_token;
}

function onResponseToken(response)
{
    return response.json();
}
console.log('https://id.twitch.tv/oauth2/token?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials');
fetch('https://id.twitch.tv/oauth2/token?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials', {
    method: "post"
}).then(onResponseToken).then(onJsonToken);

let token_data;
let gameId;

const box = document.querySelector('form');
box.addEventListener('submit', search);