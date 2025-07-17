export interface ExchangeRate {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export interface ConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}