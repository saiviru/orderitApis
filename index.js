import express from 'express';
// const router = Router();
import bodyParser from 'body-parser';
import router from './routes/api.js';
import {config} from 'dotenv';
import cors from 'cors';
import dbConnect from './db/dbConnect.js';

config();
dbConnect();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// app.use(express.static(path.join(__dirname, '/')));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

// app.use(bodyParser.json({
//   verify: (req, res, buf) => {
//     req.rawBody = buf
//   }
// }));


app.use('/api', router);


const port = process.env.PORT || 6000;


app.get('/', function (req, res) {
  res.send('Hellooooo');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});