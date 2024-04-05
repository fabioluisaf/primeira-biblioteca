import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from "./index.js";
import listaValidada from './http-validacao.js';

const caminho = process.argv;

async function imprimeLista(valida, resultado, nomeCaminho = '') {
  if (valida) {
    console.log(
      chalk.yellow('lista validada'), 
      chalk.black.bgGreen(nomeCaminho),
      await listaValidada(resultado)
    );
  } else {
    console.log(
      chalk.yellow('lista de links'), 
      chalk.black.bgGreen(nomeCaminho),
      resultado
    );
  }
}

async function processaTexto(args) {
  const caminho = args[2];
  const valida = args[3] === '--valida';

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log('arquivo ou diretorio nao existe');
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    const resultado = await pegaArquivo(args[2]);

    await imprimeLista(valida, resultado);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    const arquivos = await fs.promises.readdir(caminho);

    arquivos.forEach(async (nomeDeArquivo) => {
      const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`);
      await imprimeLista(valida, lista, nomeDeArquivo);
    });
  }
}

processaTexto(caminho);