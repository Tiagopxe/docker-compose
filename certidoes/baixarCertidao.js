const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function baixarCertidao(cnpj) {
    const browser = await puppeteer.launch({
        headless: false, // deixa o navegador visível para resolver o captcha
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto('https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf', {
        waitUntil: 'networkidle2'
    });

    // Clica no botão "Consultar sem certificado digital"
    await page.waitForSelector('input[id="btnNaoSouCertificado"]', { visible: true });
    await page.click('input[id="btnNaoSouCertificado"]');

    // Espera o campo de inscrição (CNPJ) aparecer
    await page.waitForSelector('input[id="formConsulta:txtInscricao"]', { visible: true });
    await page.type('input[id="formConsulta:txtInscricao"]', cnpj);

    console.log('⚠️ Resolva o captcha manualmente na aba aberta e clique em "Consultar".');
    console.log('⏳ Script esperando você terminar...');

    // Espera até a página de resultado carregar (ajuste o seletor se mudar no site)
    await page.waitForSelector('a[id="formCertidao:downloadCertidao"]', { visible: true, timeout: 0 });

    // Clica para baixar a certidão
    const downloadPath = path.resolve(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    await page.click('a[id="formCertidao:downloadCertidao"]');
    console.log(`✅ Certidão baixada em: ${downloadPath}`);

    // Fecha o navegador
    // await browser.close();
}

baixarCertidao('00.000.000/0000-00'); // coloque o CNPJ desejado
