// Commonly used values
const access_token = '3714727448640869';
const url = 'https://superheroapi.com/api.php/'+access_token+'/search/';
const favFalse = '../assets/images/white_star.png';
const favTrue = '../assets/images/red_star.png';


// create object for this app in localStorage if not present
checkLocalStorage();

// main search event
const searchBar = document.getElementById('search-data');
searchBar.addEventListener('keyup', (e)=> {
    const searchString = e.target.value;
    console.log("Searching for: ",searchString);
    if (searchString.length < 2){  
        document.getElementById('search-results').innerHTML = 'Add atleast 3 characters';
    }
    else{
        searchHero(searchString);
    }
});

function checkLocalStorage(){
    if (localStorage.getItem('superheroFavs')==null){
        localStorage.setItem('superheroFavs', JSON.stringify(Array()));
    }
}

document.addEventListener('click', (event) => {
    if(event.target.id == 'details_btn'){
        var id = event.target.parentNode.id;
        window.open('./details.html'+'?id='+id, "_self");
    }
    else if(event.target.id == 'add_fav_btn'){
        var id = event.target.parentNode.parentNode.id;
        var favs = JSON.parse(localStorage.getItem('superheroFavs'));
        if (favs.indexOf(id) != -1){
            favs = favs.filter((item) => item!=id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favFalse;
            customAlert('failure','SuperHero Removed');
        }
        else{
            favs.push(id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favTrue;
            customAlert('success','SuperHero Added');
        }
    }
});


async function searchHero(searchString){
    
    let response = await fetch(url+searchString);
    if (response.ok) { 
        renderData(await response.json());
    }
    else {
        alert("HTTP-Error: " + response.status);
    }
}

function renderData(data){
    if(data.response=='error' || data.results.length === 0){
        document.getElementById('search-results').innerHTML = data.error;   
    }
    else{
        var results = document.getElementById('search-results');
        results.remove();

        var result_container = document.getElementById('result-container');
        var results = document.createElement('DIV');
        results.id = 'search-results';
        result_container.appendChild(results);
        data.results.forEach((element) => {
            results.appendChild(getCard(element));
        });
    }
}


function getCard(data){
    var cardContainer = document.createElement('DIV');
    cardContainer.className = 'card-container align';
    cardContainer.id = data.id;
    var srcFav;
    var favs = JSON.parse(localStorage.getItem('superheroFavs'));
    if(favs.indexOf(data.id) !== -1){
        srcFav = favTrue;
    }
    else{
        srcFav = favFalse;
    }
    cardContainer.innerHTML = `
        <div class="card-img-container">
            <img src="${data.image.url}">
        </div>
        <div id="details_btn" class="card-name">${data.name}</div>
        <div class="card-btns">
            <img id="add_fav_btn" src="${srcFav}" width="25">
        </div>
    `
    return cardContainer;
}


function customAlert(type, message){
    var element = document.getElementsByClassName(type);
    element[0].innerHTML = message;
    element[0].style.visibility = "visible"
    setTimeout(() => {
        element[0].style.visibility = "hidden";
    }, 1500);
}