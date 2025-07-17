import axios from 'axios';

const apiEndpoint = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

const getExchangeRates = async () => {
    try {
         const response = await axios.get(apiEndpoint);
  return response.data;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
    }
 
};

export default getExchangeRates;