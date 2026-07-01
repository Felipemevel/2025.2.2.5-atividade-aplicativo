const translations = {
  pt: {
    "portal-title": "Infoclima - Portal Meteorológico",
    "search-placeholder": "Digite a localização",
    "weather-for": "Previsão do tempo para:",
    "humidity": "Umidade:",
    "wind": "Vento:",
    "weather": "Tempo:",
    "btn-favorite": "Adicionar aos favoritos",
    "fav-locations": "Locais favoritos",
    "no-favorites": "Nenhuma localidade foi favoritada"
  },
  en: {
    "portal-title": "Infoclima - Weather Portal",
    "search-placeholder": "Enter location...",
    "weather-for": "Weather forecast for:",
    "humidity": "Humidity:",
    "wind": "Wind:",
    "weather": "Condition:",
    "btn-favorite": "Add to favorites",
    "fav-locations": "Favorite locations",
    "no-favorites": "No locations have been favorited yet"
  }
};

const translateWeekdayEN = {
  "Dom": "Sun", "Seg": "Mon", "Ter": "Tue", "Qua": "Wed", "Qui": "Thu", "Sex": "Fri", "Sáb": "Sat",
  "Domingo": "Sunday", "Segunda": "Monday", "Terça": "Tuesday", "Quarta": "Wednesday", "Quinta": "Thursday", "Sexta": "Friday", "Sábado": "Saturday"
};

const translateDescriptionEN = {
  "Tempestade": "Storm", "Chuva": "Rain", "Embaçado": "Foggy", "Ensolarado": "Sunny",
  "Parcialmente nublado": "Partially cloudy", "Nublado": "Cloudy", "Tempo limpo": "Clear sky",
  "Chuvoso": "Rainy", "Pouco nublado": "Mostly sunny", "Carregando...": "Loading..."
};

const translateWeekdayPT = {
  "Sun": "Dom", "Mon": "Seg", "Tue": "Ter", "Wed": "Qua", "Thu": "Qui", "Fri": "Sex", "Sat": "Sáb",
  "Sunday": "Domingo", "Monday": "Segunda", "Tuesday": "Terça", "Wednesday": "Quarta", "Thursday": "Quinta", "Friday": "Sexta", "Saturday": "Sábado"
};

const translateDescriptionPT = {
  "Storm": "Tempestade", "Rain": "Chuva", "Foggy": "Embaçado", "Sunny": "Ensolarado",
  "Partially cloudy": "Parcialmente nublado", "Cloudy": "Nublado", "Clear sky": "Tempo limpo",
  "Rainy": "Chuvoso", "Mostly sunny": "Pouco nublado", "Loading...": "Carregando..."
};

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function criarMapaNormalizado(mapaOriginal) {
  const mapaNormalizado = {};
  for (const chave in mapaOriginal) {
    mapaNormalizado[normalizarTexto(chave)] = mapaOriginal[chave];
  }
  return mapaNormalizado;
}

const translateWeekdayEN_norm = criarMapaNormalizado(translateWeekdayEN);
const translateWeekdayPT_norm = criarMapaNormalizado(translateWeekdayPT);
const translateDescriptionEN_norm = criarMapaNormalizado(translateDescriptionEN);
const translateDescriptionPT_norm = criarMapaNormalizado(translateDescriptionPT);

function buscarTraducao(texto, mapaOriginal, mapaNormalizado) {
  if (mapaOriginal[texto]) return mapaOriginal[texto];
  const chaveNormalizada = normalizarTexto(texto);
  if (mapaNormalizado[chaveNormalizada]) return mapaNormalizado[chaveNormalizada];
  return null;
}

function changeLanguage(lang) {
  localStorage.setItem("preferred-lang", lang);
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang][key]) element.textContent = translations[lang][key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) element.setAttribute("placeholder", translations[lang][key]);
  });

  forçarTraducaoAtual();

  traduzirFavoritos();
}

function forçarTraducaoAtual() {
  ["data", "tempo-descricao", "titulo-1", "titulo-2"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const textoSalvo = el.innerText;
      el.innerText = textoSalvo; 
    }
  });
}

function traduzirFavoritos() {
  const currentLang = localStorage.getItem("preferred-lang") || "pt";
  const favoritosContainer = document.getElementById('cards-favoritos');
  if (!favoritosContainer) return;

  const smalls = favoritosContainer.querySelectorAll('.mini-cards-favs small');
  smalls.forEach(small => {
    const texto = small.textContent.trim();

    if (currentLang === "en" && texto.includes("Data:")) {
      small.textContent = texto.replace("Data:", "Date:");
    } else if (currentLang === "pt" && texto.includes("Date:")) {
      small.textContent = texto.replace("Date:", "Data:");
    }
  });


  if (smalls.length > 0) {
    localStorage.setItem('meusFavoritosHTML', favoritosContainer.innerHTML);
  }
}

function criarInterceptador(id, tipo) {
  const elemento = document.getElementById(id);
  if (!elemento) return;

  const propriedadeOriginal = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');

  Object.defineProperty(elemento, 'innerText', {
    get: function() {
      return propriedadeOriginal.get.call(this);
    },
    set: function(valor) {
      const currentLang = localStorage.getItem("preferred-lang") || "pt";
      let valorFinal = valor;
      const textoLimpo = valor.trim();

      if (currentLang === "en") {
        if (tipo === "data" && textoLimpo.includes("Data:")) {
          valorFinal = textoLimpo.replace("Data:", "Date:");
        } else if (tipo === "descricao") {
          const traducao = buscarTraducao(textoLimpo, translateDescriptionEN, translateDescriptionEN_norm);
          if (traducao) valorFinal = traducao;
        } else if (tipo === "dia") {
          const traducao = buscarTraducao(textoLimpo, translateWeekdayEN, translateWeekdayEN_norm);
          if (traducao) valorFinal = traducao;
        }
      } else if (currentLang === "pt") {
        if (tipo === "data" && textoLimpo.includes("Date:")) {
          valorFinal = textoLimpo.replace("Date:", "Data:");
        } else if (tipo === "descricao") {
          const traducao = buscarTraducao(textoLimpo, translateDescriptionPT, translateDescriptionPT_norm);
          if (traducao) valorFinal = traducao;
        } else if (tipo === "dia") {
          const traducao = buscarTraducao(textoLimpo, translateWeekdayPT, translateWeekdayPT_norm);
          if (traducao) valorFinal = traducao;
        }
      }

      propriedadeOriginal.set.call(this, valorFinal);
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {

  criarInterceptador("data", "data");
  criarInterceptador("tempo-descricao", "descricao");
  criarInterceptador("titulo-1", "dia");
  criarInterceptador("titulo-2", "dia");

  const btnPt = document.getElementById("btn-pt");
  const btnEn = document.getElementById("btn-en");

  if (btnPt) btnPt.addEventListener("click", () => changeLanguage("pt"));
  if (btnEn) btnEn.addEventListener("click", () => changeLanguage("en"));

  const savedLang = localStorage.getItem("preferred-lang") || "pt";
  changeLanguage(savedLang);
});