import chalk from "chalk";

function extraiLinks(arrLinks) {
  return arrLinks.map(link => Object.values(link).join());
}

async function checaStatus(listaURLs) {
  const arrStatus = await Promise.all(
    listaURLs.map(async (url) => {
      try {
        const response = await fetch(url);
        return response.status;
      } catch (error) {
        return manejaErros(error);
      }
    })
  );

  return arrStatus;
}

function manejaErros(erro) {
  if (erro.cause.code === 'ENOTFOUND') {
    return 'link nao encontrado';
  } else {
    return 'ocorreu algum erro';
  }
}

async function listaValidada(listaDeLinks) {
  const urls = extraiLinks(listaDeLinks);
  const status = await checaStatus(urls);

  return listaDeLinks.map((objeto, indice) => ({
    ...objeto,
    status: status[indice]
  }));
}

export default listaValidada;

