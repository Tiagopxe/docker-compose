const fs = require('fs');
const path = require('path');
const printer = require('pdf-to-printer');

async function imprimirArquivos(pasta) {
  try {
    const arquivos = fs.readdirSync(pasta)
      .filter(f => /\.pdf$/i.test(f))
      .sort();

    console.log(`🖨 Encontrados ${arquivos.length} arquivos para imprimir.`);

    for (const arquivo of arquivos) {
      const caminhoCompleto = path.join(pasta, arquivo);
      console.log(`▶️ Imprimindo: ${arquivo}`);
      try {
        await printer.print(caminhoCompleto);
        console.log(`✔️ ${arquivo} impresso.`);
      } catch (error) {
        console.error(`❌ Erro na impressão do arquivo "${arquivo}":`, error);
      }
    }

    console.log('✅ Impressão finalizada.');
  } catch (error) {
    console.error('❌ Erro ao listar ou imprimir arquivos:', error);
  }
}

// Pega o caminho da pasta da linha de comando
const pasta = process.argv[2];

if (!pasta) {
  console.error('❌ Informe o caminho da pasta como argumento.');
  console.log('Exemplo: node imprimir.js "C:/Users/Usuário/OneDrive/PastaDosArquivos"');
  process.exit(1);
}

imprimirArquivos(pasta);
