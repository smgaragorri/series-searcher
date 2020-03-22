'use strict';

const searchBtn = document.querySelector('.js-btn-search');
const listSearch = document.querySelector('.js-search-results');
let listFavorite = document.querySelector('.js-favorites-list');

let favoriteListArray = [];

// Traer datos de local storage
let getLocalSerie = JSON.parse(localStorage.getItem('serie'));

if (getLocalSerie === null) {
  getLocalSerie = [];
}
paintFavoriteList(getLocalSerie);

// Función para buscar la serie
function searchSerie(ev) {
  ev.preventDefault(ev);
  const inputSearchTitle = document.querySelector('.js-search-title');
  const searchTitle = inputSearchTitle.value;
  if (searchTitle !== '') {
    fetch(`http://api.tvmaze.com/search/shows?q=${searchTitle}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let listApiArray = data;
        console.log('lista 2 ' + listApiArray);
        paintSearchResult(listApiArray);
      });
  }
}

// Función para pintar la lista de resultados. Llama a la función de cambiar estilos al click
function paintSearchResult(listApiArray) {
  listSearch.innerHTML = '';
  for (let i = 0; i < listApiArray.length; i++) {
    const listSearchElement = document.createElement('li');
    const listSearchImage = document.createElement('img');
    const listSearchTitle = document.createElement('p');
    listSearchElement.setAttribute('class', 'list-search-element');
    listSearchElement.setAttribute('id', `${listApiArray[i].show.id}`);
    listSearchElement.setAttribute('value', `${listApiArray[i].show.name}`);
    listSearchTitle.setAttribute('class', 'list-search-element-title');
    listSearchImage.setAttribute('class', 'list-search-element-image');
    for (let index = 0; index < getLocalSerie.length; index++) {
      let getLocalArrayID = parseInt(getLocalSerie[index].id);
      if (getLocalArrayID === listApiArray[i].show.id) {
        listSearchElement.setAttribute('class', 'favorite');
      }
    }
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

function paintFavoriteList(getLocalSerie) {
  listFavorite.innerHTML = '';
  if (getLocalSerie !== null) {
    for (let i = 0; i < getLocalSerie.length; i++) {
      // Crear todos los elementos de lista vacíos
      const listFavoriteElement = document.createElement('li');
      const listFavoriteImage = document.createElement('img');
      const listFavoriteTitle = document.createElement('p');
      const listFavoriteCross = document.createElement('i');
      // Darle a cada elemento sus atributos
      listFavoriteElement.setAttribute('class', 'list-favorite-element');
      listFavoriteElement.setAttribute('id', `${getLocalSerie[i].id}`);
      listFavoriteElement.setAttribute('value', `${getLocalSerie[i].name}`);
      listFavoriteTitle.setAttribute('class', 'list-favorite-element-title');
      listFavoriteImage.setAttribute('class', 'list-favorite-element-image');
      listFavoriteCross.setAttribute('class', 'fas fa-times-circle');
      listFavoriteCross.setAttribute('id', `${getLocalSerie[i].id}`);
      // Meter unos elementos dentro de otros
      listFavoriteElement.appendChild(listFavoriteImage);
      listFavoriteElement.appendChild(listFavoriteTitle);
      listFavoriteElement.appendChild(listFavoriteCross);
      listFavorite.appendChild(listFavoriteElement);
      // Agregar listener a la cruz de eliminar
      listFavoriteCross.addEventListener('click', removeFavorite);
      // Condición para elegir imagen
      if (getLocalSerie[i].image === null) {
        listFavoriteTitle.innerHTML = getLocalSerie[i].name;
        listFavoriteImage.src =
          'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
      } else if (getLocalSerie[i].image !== '') {
        listFavoriteImage.src = getLocalSerie[i].src;
        listFavoriteTitle.innerHTML = getLocalSerie[i].name;
      }
    }
    // Creamos botón de eliminar todas fuera del  bucle. Si está dentro se crea un elemento por botón
    const listDeleteAll = document.createElement('button');
    const listDeleteAlText = document.createTextNode('ELIMINAR TODAS');
    listDeleteAll.setAttribute('class', 'list-favorite-element-delete');
    listDeleteAll.appendChild(listDeleteAlText);
    listFavorite.appendChild(listDeleteAll);
    const buttonDeleteAll = document.querySelector(
      '.list-favorite-element-delete'
    );
    buttonDeleteAll.addEventListener('click', deleteAllFavorites);
  }
}

function removeFavorite(ev) {
  let localPaint = getLocalSerie;
  let target = ev.currentTarget;
  let removeObject = {
    name: target.name,
    id: target.id
  };
  let indexObjectRemove;
  for (let i = 0; i < localPaint.length; i++) {
    if (localPaint[i].id === removeObject.id) {
      indexObjectRemove = i;
    }
  }
  for (let j = 0; j < localPaint.length; j++) {
    if (localPaint[j].id === target.id) {
      let listFavoriteElement = document.getElementById(localPaint[j].id);
      listFavoriteElement.parentNode.removeChild(listFavoriteElement);
    }
  }
  localPaint.splice(indexObjectRemove, 1);
  // listFavorite.removeChild(target);
  searchSerie(ev);
  localStorage.setItem('serie', JSON.stringify(localPaint));
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
  for (let i = 0; i < getLocalSerie.length; i++) {
    if (getLocalSerie[i].id === removeObject.id) {
      indexObjectRemove = i;
    }
  }
  getLocalSerie.splice(indexObjectRemove, 1);
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
  paintFavoriteList(getLocalSerie);
}

// agregar favoritos al local storage
function addFavoriteList(target) {
  const saveObject = {
    name: target.textContent,
    id: target.id,
    src: target.children[0].src
  };
  console.log(getLocalSerie);
  getLocalSerie.push(saveObject);
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
  paintFavoriteList(getLocalSerie);
}

function deleteAllFavorites(ev) {
  ev.preventDefault(ev);
  for (let i = 0; i < getLocalSerie.length; i++) {
    getLocalSerie.splice([i]);
    paintFavoriteList(getLocalSerie);
    searchSerie(ev);
  }
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
}

searchBtn.addEventListener('click', searchSerie);
