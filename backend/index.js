import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', rootRouter);

app.listen(process.env.PORT, () => {
  console.log('server running on port', process.env.PORT);
});
