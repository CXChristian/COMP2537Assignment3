var filteredTypes = [];

var numPerPage = 10;
const numPageBtn = 5;
var numPages = 0;
var pokemon = [];
var numPageLast = 0;

const setup = async () => {
    // pokemonRefName = (response.data.results[0].name)
    // console.log("Pokemon Name: ", pokemonRefName);

    // var pokemonReference = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonRefName}`)
    // console.log("Pokemon type: ", pokemonReference.data.types)
    // const types = pokemonReference.data.types.map((type) => type.type.name)
    // console.log("pokemon Types: ", types[0]);
    // console.log("Filtered types array: ", filteredTypes);

    // for (count = 0; count < (response.data.results).length; count++) {
    //     for (count2 = 0; count < filteredTypes.length; count2++) {
    //         if (response.data.result.)
    //     }
    // }

    // let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810')

    // pokemon = response.data.results;

    // numPages = Math.ceil(pokemon.length / numPerPage);
    // console.log("numPages: ", numPages);

    initialLoad();

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

    $('body').on('click', '.filterButton', async function (e) {
        console.log("Button clicked: ", this.value);
        if (this.checked) {
            filteredTypes.push(this.value);
        } else {
            filteredTypes = filteredTypes.filter(type => type !== this.value);
        }
        console.log("filteredTypes: ", filteredTypes);
        console.log("filteredTypes: ", filteredTypes[0]);

        if (filteredTypes.length == 0) {
            initialLoad()
        } else {
            filterLoad()
        }
    });
    
    async function initialLoad() {
        let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810')
            pokemon = response.data.results;
            numPages = Math.ceil(pokemon.length / numPerPage);
            console.log("numPages: ", numPages);

            showPage(1)
    }

    async function filterLoad() {
        let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810')
        pokemon=[]
            console.log("initial count pokemon", pokemon)
            var filterPokemon = response.data.results;

            for(count = 0; filterPokemon.length > count; count++){
                pokemonRefName = (filterPokemon[count].name)
                var pokemonReference = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonRefName}`)
                var pokemonRefTypes = pokemonReference.data.types.map((type) => type.type.name)

                for (count2 = 0; count2 < pokemonRefTypes.length; count2++) {
                    if (filteredTypes[0] == pokemonRefTypes[count2]){
                        if (filteredTypes.length == 2 && pokemonRefTypes.length == 2) {
                            if (count2 == 0){
                                if (filteredTypes[1] == pokemonRefTypes[1]){
                                    pokemon.push(filterPokemon[count])
                                } 
                            } else if (count2 == 1) {
                                if (filteredTypes[1] == pokemonRefTypes[0]){
                                    pokemon.push(filterPokemon[count])
                                }
                            }
                        } else if (filteredTypes.length == 1) {
                            pokemon.push(filterPokemon[count])
                        }
                    }
                }  
            }
            console.log("Filtered pokemon", pokemon)
            numPages = Math.ceil(pokemon.length / numPerPage);
            numPageLast = pokemon.length;

            for(var pageLastCount = 0; numPages-1 > pageLastCount; pageLastCount++){
                numPageLast = numPageLast - 10;
            }
            console.log("numPages: ", numPages);
            console.log("numPageLast: ", numPageLast)

            showPage(1)
    }

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

        $('#filter').empty();
        let types = await axios.get('https://pokeapi.co/api/v2/type');
        types = types.data.results
        console.log("Type Array: ", types);
        $('#filter').append(`<div class="filterButton">`);
        var selected = ""
        for (let i = 0; i < (types.length); i++) {
            console.log("Types: ", types[i].name);
            selected = "";
            for (count = 0; count < filteredTypes.length; count++) {
                if (types[i].name == filteredTypes[count]) {
                    selected = "checked"
                }
            }
            $('#filter').append(`
            <input type="checkbox" class="filterButton" value="${types[i].name}" ${selected}>${types[i].name}</input>
            `)
        }
        $('#filter').append(`</div>`);

        $('#pokemon').empty();
        let cardCount = 0;
        if (!(currentPage == numPages)) {
            for (let i = ((currentPage - 1) * numPerPage); i < ((currentPage - 1) * numPerPage) + numPerPage; i++) {
                cardCount++
                console.log(cardCount)
                let innerResponse = await axios.get(`${pokemon[i].url}`);
                let thisPokemon = innerResponse.data;
                console.log(thisPokemon);
                $('#pokemon').append(`
                <div class="pokeCard card" pokeName=${thisPokemon.name}>
                    <h3>${thisPokemon.name}</h3>
                    <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More</button>
                </div>  
                `)
            }
        } else {
            for (let i = ((currentPage - 1) * numPerPage); i < ((currentPage - 1) * numPerPage) + numPageLast; i++) {
                cardCount++
                console.log(cardCount)
                let innerResponse = await axios.get(`${pokemon[i].url}`);
                let thisPokemon = innerResponse.data;
                console.log(thisPokemon);
                $('#pokemon').append(`
                <div class="pokeCard card" pokeName=${thisPokemon.name}>
                    <h3>${thisPokemon.name}</h3>
                    <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More</button>
                </div>  
                `)      
        }}
        $('#header').empty();

        $('#header').append(`
        <h1>Showing ${cardCount} out of ${pokemon.length} Pokemon </h1>
        `)

        $(`#pagination`).empty();
        var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
        var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));
        console.log("startI: ", startI);
        console.log("engI: ", endI);
        console.log("numPages: ", numPages);
        console.log("currentPage: ", currentPage);
        console.log("numPageBtn: ", numPageBtn);

        if (currentPage > 1) {
            $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn" id="pagefirst" pageNum="1">First</button>
            `);
            $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn" id="pageprev" pageNum="${currentPage - 1}">Prev</button>
            `);
        }

        for (let i = startI; i <= endI; i++) {
            var active = "";
            if (i == currentPage) {
                active = "active";
            }
            $(`#pagination`).append(`
        <button type="button" class="btn btn-primary pageBtn ${active}" id="page${i}" pageNum="${i}">${i}</button>
        `)
        }

        if (currentPage < numPages) {
            $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn" id="pagenext" pageNum="${currentPage + 1}">Next</button>
            `);
            $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn" id="pagelast" pageNum="${numPages}">Last</button>
            `);
        }
    };
};

$(document).ready(setup)