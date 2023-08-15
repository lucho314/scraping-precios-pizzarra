import { scrapeData } from "./src/scraping.js";
import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 8080;



app.get('/valores', async (req, res) => {
    try {
      const data = await scrapeData();
      res.json(data);
    } catch (error) {
      console.error('Error al obtener los datos :', error);
      res.status(500).json({ error: 'Ocurrio un error al obtener los valores.' });
    }
  });
  


  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
