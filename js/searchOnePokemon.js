export default async function searchOnePokemon() {

  document.addEventListener("submit", async e => {
    if(e.target.matches(".form")){
      e.preventDefault();
      document.querySelector(".pokemon__error").classList.add("none");

      let name = e.target.name.value.toLowerCase();
      document.querySelector(".nav__loader").classList.remove("none")
      try {
        const URL = `https://pokeapi.co/api/v2/pokemon/${name}`;
        let res = await fetch(URL);

        if(res.ok){
          success(await res.json());
          e.target.name.value = "";
        } else{
          throw res;
        }
      } catch (error) {
        failure(error);
      }
    }
  })

  document.addEventListener("click", async e => {
    if(e.target.matches(".pokemon__img")){
      document.querySelector(".nav__loader").classList.remove("none");
      document.querySelector(".pokemon__error").classList.add("none");
      let name = e.target.alt;
      try {
        const URL = `https://pokeapi.co/api/v2/pokemon/${name}`;
        let res = await fetch(URL);

        if(res.ok){
          success(await res.json());
        } else{
          throw res;
        }
      } catch (error) {
        failure(error);
      }
    }

    if(e.target.matches(".modal__close")){
      document.querySelector(".modal").classList.add("none");
      document.documentElement.style.overflowY = "visible";
    }
  })
}

const success = async (pokemon) => {
  let {abilities, name: nombre, sprites, types} = pokemon;

  const $modal = document.querySelector(".modal");

  try {
    let habilidades = [];  //HABILIDADES
    for(let i = 0; i < abilities.length; i++){
      let res = await fetch(abilities[i].ability.url)
      habilidades.push(await res.json())
    }

    let imageUrl;
    if(sprites.other['official-artwork'].front_default){
      imageUrl = sprites.other['official-artwork'].front_default;
    }else if(sprites.other.home.front_default){
      imageUrl = sprites.other.home.front_default;
    } else if(sprites.front_default){
      imageUrl = sprites.front_default;
    } else if(sprites.versions['generation-v']['black-white'].front_shiny){
      imageUrl = sprites.versions['generation-v']['black-white'].front_shiny;
    } else {
      imageUrl = sprites.versions['generation-viii'].icons.front_default;
    }

    let {url} = await fetch(imageUrl),
      imagen = url; //IMAGEN

    let tipos = [];  //TIPOS
    for(let j = 0; j < types.length; j++){
      let res = await fetch(types[j].type.url);
      tipos.push(await res.json());
    }

    let $name = $modal.querySelector(".modal__poke-name");
    let $img = $modal.querySelector(".modal__poke-img");
    let $types = $modal.querySelector(".modal__poke-types");
    let $skills = $modal.querySelector(".modal__poke-skills");
    
    $name.textContent = nombre;
    $img.setAttribute("src", imagen);
    $img.setAttribute("alt", nombre);

    let ul = "";
    tipos.forEach(tipo => {
      ul += `<li>${tipo.names[5].name}</li>`;
    })
    $types.innerHTML = ul;


    let info = "";
    habilidades.forEach(habilidad => {
      let {names, flavor_text_entries : abilities} = habilidad;

      let abilityName = names.filter(name => name.language.name == "es");
      let nameES = abilityName.pop().name;

      let abilityInfo = abilities.filter(ability => ability.language.name == "es")
      let abilityES = abilityInfo.pop().flavor_text;
      // console.log( `${nameES} : ${abilityES}`)
      info += `<p class="modal__ability"><span class="modal__ability-name">${nameES}</span>: ${abilityES}</p>`
    })
    $skills.innerHTML = info;

  } catch (error) {
    console.log(error);
  }

  document.querySelector(".nav__loader").classList.add("none");
  document.querySelector(".modal").classList.remove("none");
  document.documentElement.style.overflowY = "hidden";
}

const failure = (error) => {
  console.log("el error", error);
  document.querySelector(".nav__loader").classList.add("none");
  document.querySelector(".pokemon__error").classList.remove("none");
}