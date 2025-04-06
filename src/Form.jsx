import { useEffect, useState, useContext } from 'react';
import { StockContext } from './StockContext';

import Button from '@mui/material/Button';
import './Form.css';



export default function Form() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const {stocks, setStocks} = useContext(StockContext)


    const handleSymbolChange = (event) => setSymbol(event.target.value.toUpperCase());
    const handleQuantityChange = (event) => setQuantity(event.target.value);
    const handlePriceChange = (event) => setPrice(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!symbol.trim()) return;

        setStocks((prevStocks) => [
            ...prevStocks,
            { symbol: symbol.toUpperCase(), quantity: Number(quantity), price: Number(price), currentPrice: "Fetching..." }
        ]);

        setSymbol("");
        setQuantity("");
        setPrice("");
    };

    useEffect(() => {
        const fetchPrices = async () => {
            const updatedStocks = await Promise.all(
                stocks.map(async (stock) => {
                    if (stock.currentPrice !== "Fetching...") return stock;

                    try {
                        const response = await fetch(
                            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=de2CW52HR5Y0COT7I0mo`
                        );
                        const data = await response.json();
                        const fetchedPrice = parseFloat(data["Global Quote"]?.["05. price"]);

                        return { ...stock, currentPrice: !isNaN(fetchedPrice) ? fetchedPrice : "N/A" };
                    } catch (error) {
                        console.error(`Error fetching price for ${stock.symbol}:`, error);
                        return { ...stock, currentPrice: "N/A" };
                    }
                })
            );

            setStocks(updatedStocks);
        };

        if (stocks.some(stock => stock.currentPrice === "Fetching...")) {
            fetchPrices();
        }
    }, [stocks]);

    return (
        <>
            <form className="form-group" onSubmit={handleSubmit}>
            <input className="form-box" type="text" placeholder="Stock Symbol" value={symbol} onChange={handleSymbolChange} />
                <input className="form-box" type="number" placeholder="Quantity" value={quantity} onChange={handleQuantityChange} />
                <input className="form-box" type="number" placeholder="Purchase Price" value={price} onChange={handlePriceChange} />
                {/* <button className="button" disabled={!symbol || !quantity || !price}>Add Stock</button> */}
                <Button 
                type='submit'
                variant={!symbol  || !quantity || !price ? "outlined" : "contained"}
                color={!symbol || !quantity || !price ? "error": "success"}
                onClick ={(e) => {
                    if (!symbol || !quantity || !price){
                        e.preventDefault();
                    }
                }}
                >
                    Add Stock
                </Button>
            </form>
        </>
    );
}
