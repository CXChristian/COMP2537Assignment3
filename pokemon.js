const setup = async () => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810')
    console.log(response.data.results);

    const pokemon = response.data.results;

  $('body').on('click', '.pokeCard', async function (e) {
    console.log(this);
    const pokemonName = $(this).attr('pokeName')
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    console.log("types: ", types);
    $('.modal-body').html(`
        <div style="width:200px">
            <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
            <div>
                <h3>Abilities</h3>
                <ul>${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}</ul>
            </div>
            <div>
                <h3>Stats</h3>
                <ul>${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>
        </div>

        </div>
          <h3>Types</h3>
          <ul>${types.map((type) => `<li>${type}</li>`).join('')}</ul>
      
        `)
    $('.modal-title').html(`<h2>${res.data.name.toUpperCase()}</h2>`)
  });

    $('#pokemon').empty();
    for (let i = 0; i < pokemon.length; i++) {
        let innerResponse = await axios.get(`${pokemon[i].url}`);
        let thisPokemon = innerResponse.data;
        $('#pokemon').append(`
            <div class="pokeCard card" pokeName=${thisPokemon.name}>
                <h3>${thisPokemon.name}</h3>
                <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More</button>
            </div>  
        `)
    }
}
$(document).ready(setup)