"use strict";const searchBtn=document.querySelector(".js-btn-search"),listSearch=document.querySelector(".js-search-results");let listFavorite=document.querySelector(".js-favorites-list"),favoriteListArray=[],getLocalSerie=JSON.parse(localStorage.getItem("serie"));function searchSerie(e){e.preventDefault(e);const t=document.querySelector(".js-search-title").value;""!==t&&fetch(`http://api.tvmaze.com/search/shows?q=${t}`).then((function(e){return e.json()})).then((function(e){let t=e;console.log("lista 2 "+t),paintSearchResult(t)}))}function paintSearchResult(e){listSearch.innerHTML="";for(let t=0;t<e.length;t++){const i=document.createElement("li"),r=document.createElement("img"),a=document.createElement("p");i.setAttribute("class","list-search-element"),i.setAttribute("id",`${e[t].show.id}`),i.setAttribute("value",`${e[t].show.name}`),a.setAttribute("class","list-search-element-title"),r.setAttribute("class","list-search-element-image");for(let r=0;r<getLocalSerie.length;r++){parseInt(getLocalSerie[r].id)===e[t].show.id&&i.setAttribute("class","favorite")}i.appendChild(r),i.appendChild(a),i.addEventListener("click",addFavoriteStiles),listSearch.appendChild(i),null===e[t].show.image?(a.innerHTML=e[t].show.name,r.src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"):""!==e[t].show.image.medium&&(r.src=e[t].show.image.medium,a.innerHTML=e[t].show.name)}}function paintFavoriteList(e){if(listFavorite.innerHTML="",null!==e){for(let t=0;t<e.length;t++){const i=document.createElement("li"),r=document.createElement("img"),a=document.createElement("p"),l=document.createElement("i");i.setAttribute("class","list-favorite-element"),i.setAttribute("id",`${e[t].id}`),i.setAttribute("value",`${e[t].name}`),a.setAttribute("class","list-favorite-element-title"),r.setAttribute("class","list-favorite-element-image"),l.setAttribute("class","fas fa-times-circle"),l.setAttribute("id",`${e[t].id}`),i.appendChild(r),i.appendChild(a),i.appendChild(l),listFavorite.appendChild(i),l.addEventListener("click",removeFavorite),null===e[t].image?(a.innerHTML=e[t].name,r.src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"):""!==e[t].image&&(r.src=e[t].src,a.innerHTML=e[t].name)}const t=document.createElement("button"),i=document.createTextNode("ELIMINAR TODAS");t.setAttribute("class","list-favorite-element-delete"),t.appendChild(i),listFavorite.appendChild(t),document.querySelector(".list-favorite-element-delete").addEventListener("click",deleteAllFavorites)}}function removeFavorite(e){let t,i=getLocalSerie,r=e.currentTarget,a=(r.name,r.id);for(let e=0;e<i.length;e++)i[e].id===a&&(t=e);for(let e=0;e<i.length;e++)if(i[e].id===r.id){let t=document.getElementById(i[e].id);t.parentNode.removeChild(t)}i.splice(t,1),searchSerie(e),localStorage.setItem("serie",JSON.stringify(i))}function addFavoriteStiles(e){const t=e.currentTarget;t.classList.contains("favorite")?(t.classList.remove("favorite"),t.classList.add("list-search-element"),removeFavoriteList(t)):(t.classList.add("favorite"),t.classList.remove("list-search-element"),addFavoriteList(t))}function removeFavoriteList(e){e.textContent;const t=e.id;e.children[0].src;let i;for(let e=0;e<getLocalSerie.length;e++)getLocalSerie[e].id===t&&(i=e);getLocalSerie.splice(i,1),localStorage.setItem("serie",JSON.stringify(getLocalSerie)),paintFavoriteList(getLocalSerie)}function addFavoriteList(e){const t={name:e.textContent,id:e.id,src:e.children[0].src};console.log(getLocalSerie),getLocalSerie.push(t),localStorage.setItem("serie",JSON.stringify(getLocalSerie)),paintFavoriteList(getLocalSerie)}function deleteAllFavorites(e){e.preventDefault(e);for(let t=0;t<getLocalSerie.length;t++)getLocalSerie.splice([t]),paintFavoriteList(getLocalSerie),searchSerie(e);localStorage.setItem("serie",JSON.stringify(getLocalSerie))}null===getLocalSerie&&(getLocalSerie=[]),paintFavoriteList(getLocalSerie),searchBtn.addEventListener("click",searchSerie);