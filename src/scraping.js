import axios from 'axios';
import {load} from 'cheerio';
import { meses } from './constants.js';

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
  const $ = load(html);

  const precios = [];
  const fechaActualizacion = $('.price-board-footer b').text().trim();

  const { fecha, hora } = extractFechaHora(fechaActualizacion);

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

  return { activos: precios, info: { 
    fechaActualizacion: fecha || '',
    horaActualizacion: hora || '',
   } };
}



function extractFechaHora(fechaHoraActualizacion) {
  const regexFechaHora = /(\d{2}) de ([a-zA-Z]+) del (\d{4}) - Hora: (\d{2}:\d{2}) hs\./;
  const matches = fechaHoraActualizacion.match(regexFechaHora);

  if (matches && matches.length === 5) {
    const dia = matches[1];
    const mes = matches[2];
    const anio = matches[3];
    const hora = matches[4];
   
    const mesNumero = meses[mes];

    const fecha = `${dia}/${mesNumero}/${anio}`;
    return { fecha, hora };
  } else {
    return { fecha: '', hora: '' };
  }
}