import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

let cards = [
  { id: 1, title: "Gangnam Style", desc: "L'energia vibrante del distretto tecnologico." },
  { id: 2, title: "Hanon Breeze", desc: "La calma delle architetture tradizionali." },
  { id: 3, title: "Digital Soul", desc: "L'anima tech delle nuove startup di Seoul." },
  { id: 4, title: "Calendar Page", desc: "Ecco un calendario per gli appuntamenti." },
];

app.get('/api/cards', (req, res) => {
  res.json(cards);
});

// Ascolta su '0.0.0.0' per essere visibile in tutta la rete locale
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server K-App pronto su:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://192.1.1.101:${PORT}`); // Sostituisci con il tuo vero IP
});