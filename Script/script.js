const key = '03f5150c '
const url = `https://api.hgbrasil.com/weather?&key=${key}&format=json-cors`;

const nomeCidade = document.getElementById('input-localizacao').value;

const inputLocalizacao = document.getElementById('input-localizacao');
const displayNomeCidade = document.getElementById('nome-cidade');
const temperaturaAtual = document.getElementById('temperatura-atual');
const dataAtual = document.getElementById('data');
const iconTempoAtual = document.getElementById('icon-tempo-atual');
const umidadeAtual = document.getElementById('umidade-atual');
const ventoAtual = document.getElementById('vento-atual');
const tempoDescricao = document.getElementById('tempo-descricao');
const addFavoritoBtn = document.getElementById('btn-favoritar');
const favoritosContainer = document.getElementById('cards-favoritos');
const rmvFavBtns = document.getElementsByClassName('remover-favorito');

const titulo01 = document.getElementById('titulo-1');
const img01 = document.getElementById('img1');
const graus01 = document.getElementById('graus-1');
const data01 = document.getElementById('data-1');

const titulo02 = document.getElementById('titulo-2');
const img02 = document.getElementById('img2');
const graus02 = document.getElementById('graus-2');
const data02 = document.getElementById('data-2');


function carregarClima(cidade = "") {

    const urlFinal = cidade ? `${url}&city_name=${cidade}` : url;

    fetch(urlFinal)
    .then(response => response.json())
    .then(data => {

        const res = data.results;
        displayNomeCidade.innerText = res.city;
        temperaturaAtual.innerText = `${res.temp}°C`;
        dataAtual.innerText = `Data: ${res.date} - ${res.time}`;
        umidadeAtual.innerText = `${res.humidity}%`;
        ventoAtual.innerText = res.wind_speedy;
        tempoDescricao.innerText = res.description;
        if (res.currently === "noite") {
            iconTempoAtual.innerHTML = `<img src="img/hg-brasil-moon-phases/${res.moon_phase}.png" alt="">`;
        } else {
            iconTempoAtual.innerHTML = `<img src="img/hg-brasil-conditions-slugs/${res.condition_slug}.svg" alt="">`;
        }


        titulo01.innerText = res.forecast[0].weekday;
        img01.src = `img/hg-brasil-conditions-slugs/${res.forecast[0].condition}.svg`;
        graus01.innerText = `${res.forecast[0].max}°C`;
        data01.innerText = res.forecast[0].date;

        titulo02.innerText = res.forecast[1].weekday;
        img02.src = `img/hg-brasil-conditions-slugs/${res.forecast[1].condition}.svg`;
        graus02.innerText = `${res.forecast[1].max}°C`;
        data02.innerText = res.forecast[1].date;


        if (data.results) {
            console.log(`Temperatura em ${data.results.city}: ${data.results.temp}°C |||| Velocidade do vento: ${data.results.wind_speedy} | Fase da lua${data.results.moon_phase}`)

            console.log(data.results)
        }
    })
    .catch(error => console.error("Erro na requisição", error));
}

inputLocalizacao.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const valorDigitado = inputLocalizacao.value;
        if (valorDigitado !== "") {
            displayNomeCidade.innerText = "Buscando...";
            carregarClima(valorDigitado);
        }
        inputLocalizacao.value = "";
    }
});

function addFavorito() {
    for (let i = 0; i < favoritosContainer.children.length; i++) {
        const child = favoritosContainer.children[i];
        if (child.querySelector('h5') && child.querySelector('h5').innerText === displayNomeCidade.innerText) {
            alert("Essa localidade já está nos favoritos!");
            return;
        }
    }


    const cidade = displayNomeCidade.innerText;
    const temp = temperaturaAtual.innerText;
    const data = dataAtual.innerText;

    const novoCard = document.createElement('div');
    novoCard.classList.add('mini-cards-favs');

    if (favoritosContainer.innerHTML.includes("Nenhuma localidade")) {
        favoritosContainer.innerHTML = "";
    }
    
    novoCard.innerHTML = `
        <div class="mini-cards-favoritos">
            <h5>${cidade}</h5>
            <p><strong>${temp}</strong></p>
            <small>${data}</small>
            <img src="${iconTempoAtual.querySelector('img').src}" alt="Ícone do tempo">
            <button class="remover-favorito">Remover</button>
        </div>
    `;

    favoritosContainer.appendChild(novoCard);

    localStorage.setItem('meusFavoritosHTML', favoritosContainer.innerHTML);
}

function carregarFavoritos() {
    const salvos = localStorage.getItem('meusFavoritosHTML');
    if (salvos) {
        favoritosContainer.innerHTML = salvos;
    }
}

favoritosContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remover-favorito')) {

        const cardParaRemover = e.target.closest('.mini-cards-favs');
        
        if (cardParaRemover) {
            cardParaRemover.remove();
            
            if (favoritosContainer.children.length === 0) {
                favoritosContainer.innerHTML = "<p>Nenhuma localidade foi favoritada</p>";
            }
            
            localStorage.setItem('meusFavoritosHTML', favoritosContainer.innerHTML);
        }
    }
});

favoritosContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remover-favorito')) return;

    const cardClicado = e.target.closest('.mini-cards-favs');

    if (cardClicado) {
        const cidadeFavoritada = cardClicado.querySelector('h5').innerText;

        displayNomeCidade.innerText = "Buscando...";
        carregarClima(cidadeFavoritada);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});


addFavoritoBtn.addEventListener('click', addFavorito);
carregarClima();
carregarFavoritos();