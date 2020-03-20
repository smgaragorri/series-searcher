'use strict';

const searchBtn = document.querySelector('.js-btn-search"');

// Traer datos de local storage
const setLocalSerie = JSONparse(localStorage.getItem());

// función para procesar datos del local storage
function createFavoriteList() {
  // Document.query al UL (Lista padre)
  // BUCLE --->
			// recorrer el array obtenido y crear un LI por cada elemento (darle a cada elemento un listener)
			// Se añade a la lista padre
}

// Función para buscar la serie
function searchSerie() {
  //Escuchar el click
  // Recoger valor del input de texto. Comprobamos que no esta vacío (solo if)
  // Hacer un fetch a la API
  // Array de series
  // Llamar a función de pintar
}

// Función para pintar la lista de resultados
function paintSearchResult() {
  // Coger lista a pintar
  // BUCLE --->
			// recorrer el array obtenido y crear un LI por cada elemento (darle a cada elemento un listener)
			// Comprobar si tiene foto o no + añadir titulo (if con foto , else foto por defecto)
			// Comprueba si ya está en favoritos (si está, se añaden los estilos de favoritos)
			// Se añaden a la lista padre
}

// Función para comprobar las películas favoritas
function toggleFavoriteSerie() {
  // Comprueba si ya está en favoritos
  // Si esta en favoritos, se quita de la lista (y del array del local tambien)
  removeFavorite();
  // Si NO esta en favoritos, se añade (y al array del local tambien)
  addFavorite();
  // Toggle a los estilos (sea el resultado que sea)
  // Se manda al Local Storage el Array completo de favoritas
}

function addFavorite() {
  // Crear LI del elemento
  // Meterlo en su lista padre
}

function removeFavorite() {
  // eliminarlo del array (splice)
  // Mandar el array completo al local
  // Traerlo de local y ejecutar createFavoriteList()
  o;
  // eliminarlo del array (splice)
  // Mandar el array completo al local
	// eliminar el elemento del DOM usando el ID que nos da la API. Ejemplo --- > 
			// 	const itemList = document.querySelector('.items');
			// const item2 = itemList.querySelector('.item--2');
			// itemList.removeChild(item2)
			// }


searchBtn.addEventListener('click', searchSerie);