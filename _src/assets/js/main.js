'use strict';

const searchBtn = document.querySelector('.js-btn-search');
const listSearch = document.querySelector('.js-search-results');
let listFavorite = document.querySelector('.js-favorites-list');
const logBtn = document.querySelector('.js-btn-log');

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
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let listApiArray = data;
        paintSearchResult(listApiArray);
      });
  }
}

// Función para pintar la lista de resultados. Llama a la función de cambiar estilos al click
function paintSearchResult(listApiArray) {
  listSearch.innerHTML = '';
  for (let i = 0; i < listApiArray.length; i++) {
    // Crear todos los elementos de lista vacíos
    const listSearchElement = document.createElement('li');
    const listSearchImage = document.createElement('img');
    const listSearchTitle = document.createElement('p');
    listSearchElement.setAttribute('class', 'list-search-element');
    listSearchElement.setAttribute('id', `${listApiArray[i].show.id}`);
    listSearchElement.setAttribute('value', `${listApiArray[i].show.name}`);
    listSearchTitle.setAttribute('class', 'list-search-element-title');
    listSearchImage.setAttribute('class', 'list-search-element-image');
    // Condición para determinar si esta en favoritas. Comparamos Array de Api con Array traido de local storage.
    //  El id de local storage viene en string, importante parsear para poder comparar.
    for (let index = 0; index < getLocalSerie.length; index++) {
      let getLocalArrayID = parseInt(getLocalSerie[index].id);
      if (getLocalArrayID === listApiArray[i].show.id) {
        listSearchElement.setAttribute('class', 'favorite');
      }
    }

    // Meter unos elementos dentro de otros
    listSearchElement.appendChild(listSearchImage);
    listSearchElement.appendChild(listSearchTitle);
    listSearch.appendChild(listSearchElement);
    // Agregar listener al emento de lista para agregar. Toda la superficie es clicable
    listSearchElement.addEventListener('click', addFavoriteStiles);
    // Condición para elegir imagen. Utilizamos el atributo Name (string en ambas variables) comparandolo con el innerHTML
    if (listApiArray[i].show.image === null) {
      listSearchTitle.innerHTML = listApiArray[i].show.name;
      listSearchImage.src =
        'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else if (listApiArray[i].show.image.medium !== '') {
      listSearchTitle.innerHTML = listApiArray[i].show.name;
      listSearchImage.src = listApiArray[i].show.image.medium;
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
      // Condición para elegir imagen. Utilizamos el atributo Name (string en ambas variables)
      if (getLocalSerie[i].image === null) {
        listFavoriteTitle.innerHTML = getLocalSerie[i].name;
        listFavoriteImage.src =
          'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
      } else if (getLocalSerie[i].image !== '') {
        listFavoriteImage.src = getLocalSerie[i].src;
        listFavoriteTitle.innerHTML = getLocalSerie[i].name;
      }
    }
    // Creamos botón de eliminar todas fuera del  bucle. Si está dentro se crea un botón por elemento. Añadimos una comparación para que el botón aparezca solo si tenemos cosas para eliminar.
    if (getLocalSerie[0] !== undefined) {
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
}
// Agregamos/eliminamos la clase favorite al target
function addFavoriteStiles(ev) {
  const target = ev.currentTarget;
  if (target.classList.contains('favorite')) {
    target.classList.remove('favorite');
    target.classList.add('list-search-element');
    // llama a una función para eliminar del array del local storage
    removeFavoriteList(target);
  } else {
    target.classList.add('favorite');
    target.classList.remove('list-search-element');
    // llama a una función para agregar al array del local storage
    addFavoriteList(target);
  }
}
// Función para eliminar del array del local storage
function removeFavoriteList(target) {
  // Creamos el objeto a eliminar
  const removeObject = {
    name: target.textContent,
    id: target.id,
    src: target.children[0].src,
  };
  let indexObjectRemove;
  // Obtenemos su índice dentro del Array del local storage comparando los ID
  for (let i = 0; i < getLocalSerie.length; i++) {
    if (getLocalSerie[i].id === removeObject.id) {
      indexObjectRemove = i;
    }
  }
  // Teniendo su índice, lo emininamos con splice
  getLocalSerie.splice(indexObjectRemove, 1);
  // Enviamos nueva lista sin ese elemento al Local Storage
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
  // Pintamos de nuevo la lista de favoritos
  paintFavoriteList(getLocalSerie);
}

// agregar favoritos al local storage
function addFavoriteList(target) {
  // Creamos el objeto a guardar. Propiedades dadas de la API
  const saveObject = {
    name: target.textContent,
    id: target.id,
    src: target.children[0].src,
  };
  // Se añade objeto a array
  getLocalSerie.push(saveObject);
  // Enviamos nueva lista con ese nuevo elemento al Local Storage
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
  // Pintamos de nuevo la lista de favoritos
  paintFavoriteList(getLocalSerie);
}

// En la lista de favoritos. Eliminar 1 solo elemento con la X
function removeFavorite(ev) {
  let target = ev.currentTarget;
  // Creamos el objeto a eliminar
  let removeObject = {
    name: target.name,
    id: target.id,
  };
  // Obtenemos su índice dentro del Array del local storage comparando los ID, para posteriormente eliminar del array getLocalSerie
  let indexObjectRemove;
  for (let i = 0; i < getLocalSerie.length; i++) {
    if (getLocalSerie[i].id === removeObject.id) {
      indexObjectRemove = i;
    }
  }
  // Para eliminar del DOM. Comparamos el id del target con el de las series (para eso, le hemos dado a la cruz de cada elemento el mismo id que el elemento en el que se encuentra)
  for (let i = 0; i < getLocalSerie.length; i++) {
    if (getLocalSerie[i].id === target.id) {
      // Seleccionamos por ID el primer elemento de la lista con ese ID, que será siempre el elemento LI, porque la cruz es descendiente del mismo
      let listFavoriteElement = document.getElementById(getLocalSerie[i].id);
      // Eliminamos el elemento LI
      listFavoriteElement.parentNode.removeChild(listFavoriteElement);
    }
  }
  getLocalSerie.splice(indexObjectRemove, 1);
  searchSerie(ev);
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
}

// Eliminar todas las favoritas
function deleteAllFavorites(ev) {
  ev.preventDefault(ev);
  for (let i = 0; i < getLocalSerie.length; i++) {
    // Se borran una a una del Array
    getLocalSerie.splice([i]);
  }
  // Se pinta de nuevo tanto la lista de favoritos, como la de resultados de búsquedas
  paintFavoriteList(getLocalSerie);
  searchSerie(ev);
  // Se manda lista (ahora vacía por completo) al local storage
  localStorage.setItem('serie', JSON.stringify(getLocalSerie));
}

function favoritesNumber(ev) {
  ev.preventDefault(ev);
}

searchBtn.addEventListener('click', searchSerie);
logBtn.addEventListener('click', favoritesNumber);
