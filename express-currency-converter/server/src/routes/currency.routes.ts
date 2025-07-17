import express from 'express';
import { getRate, handleConvertRequest } from '../controllers/convert.controller';

const currencyRouter = express.Router();

currencyRouter.post('/api/convert', handleConvertRequest );
currencyRouter.get('/api/rate', getRate);

export default currencyRouter;