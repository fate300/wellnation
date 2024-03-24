const express = require('express');
const app = express();
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// 정적 파일 미들웨어 설정을 '/' 경로로 한정합니다.
app.use(express.static(path.join(__dirname, 'app/dist')));
app.set('view engine', 'ejs')

// '/' 경로에 대한 요청을 처리합니다. 이는 Vue 앱의 진입점인 'index.html' 파일을 제공합니다.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/dist/index.html'));
});

// MongoDB 연결 설정
const uri = "mongodb+srv://fate300000:JEy33783808@wellnation.bxyprgj.mongodb.net/?retryWrites=true&w=majority&appName=wellnation";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // JSON 데이터 처리를 위한 설정 추가
app.use(cors());

// MongoDB 연결
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    return client.db('wellnation_db');
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
// 서버 시작 및 MongoDB 연결  
const startServer = async () => {
    const db = await connectToMongoDB();
    if (!db) {
      console.error("Failed to connect to MongoDB, server not started");
      return;
    }
  
    // Express 서버 시작
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  }
  
  startServer().catch(console.error);
  