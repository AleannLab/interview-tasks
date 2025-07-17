import express, { Request, Response } from 'express';

import currencyRouter from './routes/currency.routes';
import cors from 'cors';


export const app = express();

app.use(cors());

app.use(express.json());

app.use('/', currencyRouter);


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

