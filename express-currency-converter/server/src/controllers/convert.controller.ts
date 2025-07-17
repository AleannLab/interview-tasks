import getExchangeRates from '../service/api.service';
import { ConversionRequest } from '../types/interfaces';
import { Request, Response } from 'express';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

const getExchangeRatesFromCache = async () => {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const exchangeRates = await getExchangeRates();
  cache = {
    data: exchangeRates,
    timestamp: now,
  };

  return exchangeRates;
};

// Calculate rate between two currencies
const calculateRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  const exchangeRates = await getExchangeRatesFromCache();

  const getRateToUAH = (currency: string): number => {
    if (currency === 'UAH') return 1;
    const found = exchangeRates.find((rate: any) => rate.cc === currency);
    if (!found) throw new Error(`Rate for ${currency} not found`);
    return found.rate;
  };

  const fromRate = getRateToUAH(fromCurrency);
  const toRate = getRateToUAH(toCurrency);

  return  fromRate/toRate;
};

// POST /api/convert
export const handleConvertRequest  = async (req: Request, res: Response) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body as ConversionRequest;
    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({ error: 'Missing fromCurrency, toCurrency, or amount' });
    }

    const rate = await calculateRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    res.json({
      result: `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`,
      rate,
    });
  } catch (error) {
    console.error('Convert error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/rate?fromCurrency=USD&toCurrency=EUR
export const getRate = async (req: Request, res: Response) => {
  try {
    const { fromCurrency, toCurrency } = req.query;

    if (typeof fromCurrency !== 'string' || typeof toCurrency !== 'string') {
      return res.status(400).json({ error: 'fromCurrency and toCurrency must be strings' });
    }

    const rate = await calculateRate(fromCurrency, toCurrency);
    res.json({ rate });
  } catch (error) {
    console.error('Rate error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

