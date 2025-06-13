
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/poets', async (req, res) => {
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
