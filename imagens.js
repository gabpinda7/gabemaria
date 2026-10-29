// Busca a foto principal de cada verbete da Wikipédia e coloca no <img>
const FALLBACK = "https://placehold.co/600x400/f0c987/c0392b?text=Receita";

async function buscarImagem(titulo) {
  const url =
    "https://en.wikipedia.org/api/rest_v1/page/summary/" +
    encodeURIComponent(titulo);
  const resposta = await fetch(url);
  if (!resposta.ok) return null;

  const dados = await resposta.json();
  if (dados.originalimage && dados.originalimage.width <= 2500) {
    return dados.originalimage.source;
  }
  if (dados.thumbnail) {
    return dados.thumbnail.source;
  }
  return null;
}

document.querySelectorAll("img[data-wiki]").forEach(async (img) => {
  const titulos = img.dataset.wiki.split("|");

  for (const titulo of titulos) {
    try {
      const src = await buscarImagem(titulo.trim());
      if (src) {
        img.src = src;
        return;
      }
    } catch (erro) {
      // tenta o próximo nome
    }
  }
  img.src = FALLBACK;
});