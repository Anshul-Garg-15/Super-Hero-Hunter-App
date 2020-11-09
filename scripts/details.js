// Commonly used values
const access_token = "3714727448640869";
const api_url = "https://www.superheroapi.com/api.php/"+access_token+"/";
const favFalse = '../assets/images/white_star.png';
const favTrue = '../assets/images/red_star.png';

driver();

async function driver(){
    const id = extractId();
    const data = await getInfo(id);
    renderPage(data);
}

document.addEventListener('click', (event) => {
    if(event.target.id == 'add-to-fav-btn'){
        var id = event.target.parentNode.parentNode.name;
        var favs = JSON.parse(localStorage.getItem('superheroFavs'));
        if (favs.indexOf(id) != -1){         
            favs = favs.filter((item) => item!=id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favFalse;
            customAlert('failure','Superhero Removed');
        }
        else{                               
            favs.push(id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favTrue;
            customAlert('success','SuperHero Added');
        }
    }
});

function extractId(){
    const url = location.search;
    return url.substring(url.indexOf('=')+1);
}

async function getInfo(id){
    let response = await fetch(api_url+id);
    if(response.ok){
        var jsonData = await response.json();
        console.log(jsonData);
        return jsonData;
    }
    else{
        alert("HTTP-Error: ",response.status);
    }
}


function renderPage(data){
    document.getElementById('info-container').name = data.id;

    var image = document.getElementById('image-container');
    image.firstElementChild.src = `${data.image.url}`;
    var favs = JSON.parse(localStorage.getItem('superheroFavs'));
    if(favs.indexOf(data.id) != -1){
        image.lastElementChild.src = favTrue;
    }
    else{
        image.lastElementChild.src = favFalse;
    }

    var combat = document.getElementsByClassName('combat');
    combat[0].innerHTML = `${data.powerstats.combat}`;
    combat[0].style = `width: ${data.powerstats.combat}%;`;

    var durability = document.getElementsByClassName('durability');
    durability[0].innerHTML = `${data.powerstats.durability}`;
    durability[0].style = `width: ${data.powerstats.durability}%;`;

    var intelligence = document.getElementsByClassName('intelligence');
    intelligence[0].innerHTML = `${data.powerstats.intelligence}`;
    intelligence[0].style = `width: ${data.powerstats.intelligence}%;`;

    var power = document.getElementsByClassName('power');
    power[0].innerHTML = `${data.powerstats.power}`;
    power[0].style = `width: ${data.powerstats.power}%;`;

    var speed = document.getElementsByClassName('speed');
    speed[0].innerHTML = `${data.powerstats.speed}`;
    speed[0].style = `width: ${data.powerstats.speed}%;`;

    var strength = document.getElementsByClassName('strength');
    strength[0].innerHTML = `${data.powerstats.strength}`;
    strength[0].style = `width: ${data.powerstats.strength}%;`;

    // Biography
    document.getElementById('biography').innerHTML = makePresentable(data.biography);
    // Appearance
    document.getElementById('appearance').innerHTML = makePresentable(data.appearance);
    // Occupation
    document.getElementById('occupation').innerHTML = makePresentable(data.work);
    // Connections
    document.getElementById('connections').innerHTML = makePresentable(data.connections);
}

// Converting JSON objects to paragraph
function makePresentable(jsonData){
    var str='';
    for (var key in jsonData){
        str += 
            '<p><b>'+key.charAt(0).toUpperCase()+key.slice(1) +'</b> : '+ jsonData[key]+ '</p>';
    }
    return str;
}


function customAlert(type, message){
    var element = document.getElementsByClassName(type);
    element[0].innerHTML = message;
    element[0].style.visibility = "visible"
    setTimeout(() => {
        element[0].style.visibility = "hidden";
    }, 1500);
}