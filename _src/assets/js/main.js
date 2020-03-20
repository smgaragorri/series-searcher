'use strict';

const searchBtn = document.querySelector('.js-btn-search');
const listSearch = document.querySelector('.js-search-results');
const listFavorite = document.querySelector('.js-favorites-list');

let listApiArray = '';
let favoriteListArray = [];

// Traer datos de local storage
const getLocalSerie = JSON.parse(localStorage.getItem('serie'));
listFavorite.innerHTML = getLocalSerie;

// Función para buscar la serie
function searchSerie(ev) {
  ev.preventDefault();
  const inputSearchTitle = document.querySelector('.js-search-title');
  const searchTitle = inputSearchTitle.value;
  if (searchTitle !== '') {
    fetch(`http://api.tvmaze.com/search/shows?q=${searchTitle}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let listApiArray = data;
        paintSearchResult(listApiArray);
        console.log(listApiArray);
        for (let i = 0; i < favoriteListArray.length; i++) {
          if (favoriteListArray[i].id === listApiArray[i].show.id) {
            listApiArray.classList.add('favorite');
          }
        }
      });
  }
}

// Función para pintar la lista de resultados. Llama a la función de cambiar estilos al click
function paintSearchResult(listApiArray) {
  for (let i = 0; i < listApiArray.length; i++) {
    const listSearchElement = document.createElement('li');
    const listSearchImage = document.createElement('img');
    const listSearchTitle = document.createElement('p');
    listSearchElement.setAttribute('class', 'list-search-element');
    listSearchElement.setAttribute('id', `${listApiArray[i].show.id}`);
    listSearchElement.setAttribute('value', `${listApiArray[i].show.name}`);
    listSearchTitle.setAttribute('class', 'list-search-element-title');
    listSearchImage.setAttribute('class', 'list-search-element-image');
    listSearchElement.appendChild(listSearchImage);
    listSearchElement.appendChild(listSearchTitle);
    listSearchElement.addEventListener('click', addFavoriteStiles);
    listSearch.appendChild(listSearchElement);
    if (listApiArray[i].show.image === null) {
      listSearchTitle.innerHTML = listApiArray[i].show.name;
      listSearchImage.src =
        'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else if (listApiArray[i].show.image.medium !== '') {
      listSearchImage.src = listApiArray[i].show.image.medium;
      listSearchTitle.innerHTML = listApiArray[i].show.name;
    }
  }
}

function addFavoriteStiles(ev) {
  const target = ev.currentTarget;
  if (target.classList.contains('favorite')) {
    target.classList.remove('favorite');
    target.classList.add('list-search-element');
    removeFavoriteList(target);
  } else {
    target.classList.add('favorite');
    target.classList.remove('list-search-element');
    addFavoriteList(target);
  }
}

function removeFavoriteList(target) {
  const removeObject = {
    name: target.textContent,
    id: target.id,
    src: target.children[0].src
  };
  let indexObjectRemove;
  for (let i = 0; i < favoriteListArray.length; i++) {
    if (favoriteListArray[i].id === removeObject.id) {
      indexObjectRemove = i;
    }
  }
  console.log(indexObjectRemove);
  favoriteListArray.splice(indexObjectRemove, 1);
  localStorage.setItem('serie', JSON.stringify(favoriteListArray));
}

// agregar favoritos al local storage
function addFavoriteList(target) {
  const saveObject = {
    name: target.textContent,
    id: target.id,
    src: target.children[0].src
  };
  favoriteListArray.push(saveObject);
  localStorage.setItem('serie', JSON.stringify(favoriteListArray));
}

// Función para comprobar las películas favoritas
// function toggleFavoriteSerie() {
// Comprueba si ya está en favoritos
// Si esta en favoritos, se quita de la lista (y del array del local tambien)
// removeFavorite();
// Si NO esta en favoritos, se añade (y al array del local tambien)
// addFavorite();
// Toggle a los estilos (sea el resultado que sea)
// Se manda al Local Storage el Array completo de favoritas
// }

// function removeFavoriteList() {
// eliminarlo del array (splice)
// Mandar el array completo al local
// Traerlo de local y ejecutar createFavoriteList()
// o;
// eliminarlo del array (splice)
// Mandar el array completo al local
// eliminar el elemento del DOM usando el ID que nos da la API. Ejemplo --- >
// 	const itemList = document.querySelector('.items');
// const item2 = itemList.querySelector('.item--2');
// itemList.removeChild(item2)
// }
// }

searchBtn.addEventListener('click', searchSerie);
