import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { shouldAllowRequest } from './firebaseService';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/poets', async (req, res) => {
  const ip = req.ip || 'unknown';

  const allowed = await shouldAllowRequest(ip);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const response = await axios.get('https://api.ganjoor.net/api/ganjoor/poets');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching poets:', error);
    res.status(500).json({ error: 'Failed to fetch poets' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
