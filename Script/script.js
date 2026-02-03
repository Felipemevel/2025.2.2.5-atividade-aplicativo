const key = '6bb6a1e9'
const url = 'https://api.hgbrasil.com/weather?key=6bb6a1e9&format=json-cors';

function carregarClima() {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log("Sucesso! Veja os dados abaixo:");
        console.log(data);

        if (data.results) {
            console.log(`Temperatura em ${data.results.city}: ${data.results.temp}°C |||| Velocidade do vento: ${data.results.wind_speedy} | Fase da lua${data.results.moon_phase}`)
        }
    })
    .catch(error => console.error("Erro na requisição", error));
}

