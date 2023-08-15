import axios from 'axios';
import cheerio from 'cheerio';

const URL = 'https://www.cac.bcr.com.ar/es/precios-de-pizarra';

async function fetchHTML() {
  try {
    const { data } = await axios.get(URL);
    return data;
  } catch (error) {
    console.error('Error fetching the HTML:', error);
  }
}

export async function scrapeData() {
  const html = await fetchHTML();
  const $ = cheerio.load(html);

  const precios = [];

  $('.board-wrapper').each((index, element) => {
    const activo = $(element).find('h3').text().trim();
    const precio = $(element).find('.price').text().trim();
    const difTonelada = $(element).find('.cell:nth-child(2)').text().trim();
    const difPorcentaje = $(element).find('.cell:nth-child(4)').text().trim();
    const tendencia = $(element).find('.direction').hasClass('fa-arrow-up') ? 'up' : 'down';

    precios.push({
      activo,
      precio,
      difTonelada,
      difPorcentaje,
      tendencia,
    });
  });

  return precios;
}

