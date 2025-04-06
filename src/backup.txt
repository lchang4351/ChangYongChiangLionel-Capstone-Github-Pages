import { useEffect, useState } from 'react';
import './Form.css';

export default function Form() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [stocks, setStocks] = useState([]);

    const handleSymbolChange = (event) => setSymbol(event.target.value.toUpperCase());
    const handleQuantityChange = (event) => setQuantity(event.target.value);
    const handlePriceChange = (event) => setPrice(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!symbol) return;

        // Add stock entry with a temporary currentPrice of "Fetching..."
        setStocks((currentStocks) => [
            ...currentStocks,
            { symbol, quantity: Number(quantity), price: Number(price), currentPrice: "Fetching..." }
        ]);

        setSymbol("");
        setQuantity("");
        setPrice("");
    };

    useEffect(() => {
        const fetchPrices = async () => {
            const updatedStocks = await Promise.all(
                stocks.map(async (stock) => {
                    if (stock.currentPrice !== "Fetching...") return stock; // Skip already fetched stocks

                    try {
                        const response = await fetch(
                            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=de2CW52HR5Y0COT7I0mo`
                        );
                        const data = await response.json();
                        const fetchedPrice = parseFloat(data["Global Quote"]?.["05. price"]);

                        if (!isNaN(fetchedPrice)) {
                            return { ...stock, currentPrice: fetchedPrice };
                        }
                    } catch (error) {
                        console.error(`Error fetching price for ${stock.symbol}:`, error);
                    }
                    return { ...stock, currentPrice: "N/A" }; // If error or invalid, mark as N/A
                })
            );

            setStocks(updatedStocks);
        };

        if (stocks.some(stock => stock.currentPrice === "Fetching...")) {
            fetchPrices();
        }
    }, [stocks]); // Trigger effect when stocks array updates

    return (
        <>
            <form className="form-group" onSubmit={handleSubmit}>
                <input className="form-box" type="text" placeholder="Stock Symbol" value={symbol} onChange={handleSymbolChange} />
                <input className="form-box" type="number" placeholder="Quantity" value={quantity} onChange={handleQuantityChange} />
                <input className="form-box" type="number" placeholder="Purchase Price" value={price} onChange={handlePriceChange} />
                <button className="button">Add Stock</button>
            </form>

            <h1>Stock List</h1>
            <ul>
                {stocks.map((stock, index) => {
                    const formattedCurrentPrice =
                        !isNaN(stock.currentPrice) && stock.currentPrice !== "N/A"
                            ? Number(stock.currentPrice).toFixed(2)
                            : "N/A";

                    const profitLoss =
                        !isNaN(stock.currentPrice) && !isNaN(stock.price)
                            ? ((stock.currentPrice - stock.price) * stock.quantity).toFixed(2)
                            : "N/A";

                    return (
                        <li key={index}>
                            <p>Symbol: {stock.symbol}</p>
                            <p>Quantity: {stock.quantity}</p>
                            <p>Purchase Price: {stock.price.toFixed(2)}</p>
                            <p>Current Price: {formattedCurrentPrice}</p>
                            <p style={{ color: profitLoss > 0 ? "green" : profitLoss < 0 ? "red" : "black" }}>
                                Profit/Loss: {profitLoss !== "N/A" ? ` ${profitLoss > 0 ? "+" : ""}${profitLoss}` : " N/A"}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}


