var pokemon = [];

var numPerPage = 10;
const numPageBtn = 5;
var numPages = 0;

const setup = async () => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810')
    console.log(response.data.results);

    const pokemon = response.data.results;
    numPages = Math.ceil(pokemon.length / numPerPage);
    console.log("numPages: ", numPages);

    showPage(1);

    $('body').on('click', '.pokeCard', async function (e) {
        console.log(this);
        const pokemonName = $(this).attr('pokeName')
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        console.log("res.data: ", res.data);
        const types = res.data.types.map((type) => type.type.name)
        console.log("types: ", types);

        console.log(res.data.abilities.map((item) => `<li>${item.ability.name}</li>`).join(``));
        console.log(res.data.abilities.map((item) => { return { name: item.ability.name, url: item.ability.url } }));

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
    })

    $('body').on('click', '.pageBtn', async function (e) {
        const pageNum = parseInt($(this).attr('pageNum'))
        console.log("pageBtn clicked");
        console.log("pageNum: ", pageNum);
        showPage(pageNum);
    });

    async function showPage(currentPage) {
        if (currentPage < 1) {
            currentPage = 1;
        }
        if (currentPage > numPages) {
            currentPage = numPages;
        }

        console.log("showPage: ", currentPage);
        console.log("start: ", ((currentPage - 1) * numPerPage));
        console.log("end: ", ((currentPage - 1) * numPerPage) + numPerPage);
        console.log("pokemon.length: ", pokemon.length);

        $('#pokemon').empty();
        for (let i = ((currentPage - 1) * numPerPage); i < ((currentPage - 1) * numPerPage) + numPerPage; i++) {
            console.log("i: ", i);
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

        $(`#pagination`).empty();
        var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
        var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));
        console.log("startI: ", startI);
        console.log("engI: ", endI);
        console.log("numPages: ", numPages);
        console.log("currentPage: ", currentPage);
        console.log("numPageBtn: ", numPageBtn);

        for (let i = startI; i <= endI; i++) {
            var active = "";
            if (i == currentPage) {
                active = "active";
            }
            $(`#pagination`).append(`
        <button type="button" class="btn btn-primary pageBtn ${active}" id="page${i}" pageNum="${i}">${i}</button>
        `)
        }
    };
};

$(document).ready(setup)