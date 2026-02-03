const key = '6bb6a1e9'
const url = `https://api.hgbrasil.com/weather?&key=${key}&format=json-cors`;

const nomeCidade = document.getElementById('input-localizacao').value;

const inputLocalizacao = document.getElementById('input-localizacao');
const displayNomeCidade = document.getElementById('nome-cidade');
const temperaturaAtual = document.getElementById('temperatura-atual');
const dataAtual = document.getElementById('data');

const titulo01 = document.getElementById('titulo-1')
const img01 = document.getElementById('img1')

const titulo02 = document.getElementById('titulo-2') 


const titulo03 = document.getElementById('titulo-3') 


const titulo04 = document.getElementById('titulo-4') 


const titulo05 = document.getElementById('titulo-5') 


const titulo06 = document.getElementById('titulo-6') 


function carregarClima(cidade = "") {

    const urlFinal = cidade ? `${url}&city_name=${cidade}` : url;

    fetch(urlFinal)
    .then(response => response.json())
    .then(data => {

        const res = data.results;
        displayNomeCidade.innerText = res.city;
        temperaturaAtual.innerText = `${res.temp}°C`;
        dataAtual.innerText = `Data: ${res.date} - ${res.time}`;

        if (data.results) {
            console.log(`Temperatura em ${data.results.city}: ${data.results.temp}°C |||| Velocidade do vento: ${data.results.wind_speedy} | Fase da lua${data.results.moon_phase}`)
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

carregarClima();