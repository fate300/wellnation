const express = require('express');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
let db;

// MongoDB 연결 URL
const url = "mongodb+srv://fate300000:JEy33783808@wellnation.bxyprgj.mongodb.net/?retryWrites=true&w=majority&appName=wellnation&tls=true&tlsInsecure=true";

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(url);
    db = client.db('wellnation_db');
    console.log('DB 연결 성공');
  } catch (err) {
    console.error('MongoDB 연결 에러:', err);
    process.exit(1);
  }
}

connectToMongoDB();

process.on('SIGINT', () => {
  client.close();
  console.log('MongoDB 연결이 종료되었습니다.');
});

app.use(express.json()); // JSON 데이터 파싱을 위한 미들웨어

app.post('/api/items', async (req, res) => {
  try {
    const item = req.body.item;
    const result = await db.collection('items').insertOne({ item });
    res.status(200).json({ message: 'Item added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding item' });
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

app.use('/', express.static(path.join(__dirname, 'app/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/dist/index.html'));
});