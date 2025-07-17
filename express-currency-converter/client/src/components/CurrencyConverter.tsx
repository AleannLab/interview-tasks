import React, { useEffect, useState } from "react"
import axios from "axios"
import "./styles.css" // import the CSS file

type CurrencyCode = "USD" | "EUR" | "UAH"

interface Currency {
  code: CurrencyCode
  name: string
}

export const API_BASE_URL = "http://localhost:8000"

const defaultCurrencies: Currency[] = [
  { code: "USD", name: "Долар США" },
  { code: "EUR", name: "Євро" },
  { code: "UAH", name: "Гривня" },
]

const CurrencyConverter: React.FC = () => {
  const [from, setFrom] = useState<CurrencyCode>("USD")
  const [to, setTo] = useState<CurrencyCode>("UAH")
  const [amount, setAmount] = useState<string>("1") // string for text input
  const [rate, setRate] = useState<number | null>(null)
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // Fetch rate when currencies change
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/rate`, {
          params: { fromCurrency: from, toCurrency: to },
        })
        console.log(response.data, "rate");
        setRate(response.data.rate)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Не вдалося отримати курс валют")
        setRate(null)
      }
    }

    if (from && to) {
      fetchRate()
    }
  }, [from, to])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Allow only numbers, optional decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val)
      setError(null)
    } else {
      setError("Введіть коректне числове значення")
    }
  }

  const handleConvert = async () => {
    const amountNumber = Number(amount)
    if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
      setError("Введіть коректну суму")
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/convert`, {
        fromCurrency: from,
        toCurrency: to,
        amount: amountNumber,
      })
      console.log(response.data, "convert");
      setResult(response.data.result)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Не вдалося виконати конвертацію")
    }
  }

  return (
    <div className="converter-container">
      <h2>Конвертер валют (НБУ)</h2>

      <div>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Введіть суму"
          className="amount-input"
        />
      </div>

      <div className="select-wrapper">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as CurrencyCode)}
          className="currency-select"
        >
          {defaultCurrencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="arrow">→</span>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value as CurrencyCode)}
          className="currency-select"
        >
          {defaultCurrencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {rate !== null && (
        <p className="rate-text">
          Курс: <strong>1 {from} = {rate.toFixed(4)} {to}</strong>
        </p>
      )}

      <button onClick={handleConvert} className="convert-button">
        Конвертувати
      </button>

      {result && <p className="result-text">{result}</p>}

      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default CurrencyConverter