const LIMIT = 60;
const OFFSET = 0;
let endpoint = `https://pokeapi.co/api/v2/pokemon/?offset=${OFFSET}&limit=${LIMIT}`;
let end = false;

const $loader = document.querySelector(".pokemon-list__loader");

export default async function searchManyPokemons() {
  try {
    $loader.classList.remove("none");
    const res = await fetch(endpoint);
    if(res.ok){
      success(await res.json())
    }else{
      throw res;
    }

  } catch (error) {
    failure(error);
  }
}


//PINTA TODOS LOS POKEMONS (JUNTO A SUS IMÁGENES)
const success = async ({results: pokemons, next}) => {

  document.querySelector(".pokemons__error").classList.add("none");

  if(next){
    endpoint = next;
  }else{
    end = true;
  }

  let $pokemonList = document.querySelector(".pokemon-list");
  let $template = document.getElementById("template-pokemon").content;
  let $fragment = document.createDocumentFragment();

  let imagesToSearch = pokemons.map(pokemon => fetch(pokemon.url))
  let foundImages = await Promise.all(imagesToSearch);
  let imagesToJson = foundImages.map(image => image.json())
  let images = await Promise.all(imagesToJson);

  // console.log(pokemons, images)

  pokemons.forEach((pokemon, key) => {
    let {name} = pokemon;
    let nameToUpper = name[0].toUpperCase() + name.slice(1);
    $template.querySelector(".pokemon__name").textContent = nameToUpper;

    let {sprites} = images[key];
    let image;
    if(sprites.other['official-artwork'].front_default){
      image = sprites.other['official-artwork'].front_default;
    }else if(sprites.other.home.front_default){
      image = sprites.other.home.front_default;
    } else if(sprites.front_default){
      image = sprites.front_default;
    } else if(sprites.versions['generation-v']['black-white'].front_shiny){
      image = sprites.versions['generation-v']['black-white'].front_shiny;
    } else {
      image = sprites.versions['generation-viii'].icons.front_default;
    }
    $template.querySelector(".pokemon__img").setAttribute("src", image);
    $template.querySelector(".pokemon__img").setAttribute("alt", name);
    let $clone = document.importNode($template, true);
    $fragment.append($clone)
  })

  $pokemonList.append($fragment);

  $loader.classList.add("none");
}


//SCROLL INFINITO
window.addEventListener("scroll", e => {
  let { clientHeight, scrollHeight, scrollTop} = document.documentElement;
  if(scrollTop + clientHeight + 100>= scrollHeight){
    // console.log("cargar más pokemons", endpoint);
    if(!end){
      searchManyPokemons();
    }
  }
})

//PINTA EL ERROR AL FALLAR LA BÚSQUEDA
const failure = (error) => {
  console.log("failure: ", error);
  $loader.classList.add("none");
  document.querySelector(".pokemons__error").classList.remove("none");
}
