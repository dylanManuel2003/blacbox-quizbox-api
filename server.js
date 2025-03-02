import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv/config.js';
import db from './db/connection.js';

const app = express();

app.use(cors());
app.use(express.json());


const gameSchema = new mongoose.Schema({
  username: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

app.post('/api/games', async (req, res) => {
  const { username, score } = req.body;
  const games = await db.collection('games')
  const newGame = new Game({ username, score });

  try {
    await games.insertOne(newGame);
    res.status(201).send(newGame);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const games = await db.collection('games')
    const results = await games.find({}).toArray();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
