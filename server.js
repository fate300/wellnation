const express = require('express');
const app = express();
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB URI와 클라이언트 설정
const uri = "mongodb+srv://fate300000:JEy33783808@wellnation.bxyprgj.mongodb.net/?retryWrites=true&w=majority&appName=wellnation";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

let collection; // MongoDB 컬렉션 초기화를 위한 변수 선언

// 미들웨어 설정
app.use(express.static(path.join(__dirname, 'app/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // JSON 데이터 처리를 위한 설정 추가
app.use(cors());

// '/' 경로에 대한 요청을 처리합니다. 이는 Vue 앱의 진입점인 'index.html' 파일을 제공합니다.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/dist/index.html'));
});

// MongoDB 연결 및 서버 시작
async function startServer() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    // 연결이 성공하면 컬렉션을 초기화합니다.
    collection = client.db("wellnation_db").collection("post");

    // 포스트를 추가하는 엔드포인트
    app.post('/api/post', async (req, res) => {
      try {
        const post = { name: req.body.name };
        const result = await collection.insertOne(post);
        res.status(201).send(result.ops[0]);
      } catch (error) {
        console.error("Failed to insert post", error);
        res.status(500).send(error);
      }
    });

    // 모든 포스트를 가져오는 엔드포인트
    app.get('/api/post', async (req, res) => {
      try {
        const posts = await collection.find({}).toArray();
        res.json(posts);
      } catch (error) {
        console.error("Failed to retrieve posts", error);
        res.status(500).send(error);
      }
    });

    // Express 서버 시작
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

startServer().catch(console.error);
