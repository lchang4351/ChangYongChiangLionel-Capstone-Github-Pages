import { useEffect, useState } from 'react';
import './Form.css';

function Form() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [stocks, setStocks] = useState([]);
    const [currentPrice, setCurrentPrice] = useState("")

    const handleSymbolChange = (event) => {
        setSymbol(event.target.value.toUpperCase());
    };
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const data = {
        "Global Quote": {
            "01. symbol": "IBM",
            "02. open": "246.2700",
            "03. high": "247.5700",
            "04. low": "242.0700",
            "05. price": "644.0000",
            "06. volume": "3125594",
            "07. latest trading day": "2025-03-28",
            "08. previous close": "246.2100",
            "09. change": "-2.2100",
            "10. change percent": "-0.8976%"
        }
    }
    useEffect(() => {
        // Check if symbol is not empty before making the fetch request
        // if (symbol) {
        //     // Fetch the stock price from the API
        //     fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=de2CW52HR5Y0COT7I0mo`)
        //         .then((response) => response.json())
        //         .then((data) => {
        //             // Check if the response contains valid stock data
        //             if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
        //                 setCurrentPrice(data["Global Quote"]["05. price"]);
        //             } else {
        //                 setCurrentPrice(""); // If no valid data found, reset the price
        //             }
        //         })
        //         .catch((error) => {
        //             console.error("Error fetching stock data:", error);
        //             setCurrentPrice(""); // Reset price if there's an error
        //         });
        // }
        setCurrentPrice(data["Global Quote"]["05. price"])
    }, [symbol]); // Only trigger the effect when the symbol changes

    // useEffect(() => {
    //     // fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=de2CW52HR5Y0COT7I0mo`)
    //     // .then((response) => {return response.json()})
    //     // .then((data) =>{
    //     setCurrentPrice(data["Global Quote"]["05. price"])
    //     // })
    // },[symbol])
    console.log(currentPrice)

    const handleSubmit = (event) => {
        event.preventDefault();

        setStocks((currentStocks) => {
            return [
            ...currentStocks,
            { symbol, quantity, price, currentPrice }
        ]});
        
        setSymbol("");
        setQuantity("");
        setPrice("");
    };
    console.log(stocks)

    return (
        <>
            <form className='form-group' onSubmit={handleSubmit}>
                <input 
                    className='form-box' 
                    type="text" 
                    placeholder="Stock Symbol" 
                    value={symbol} 
                    onChange={handleSymbolChange}
                />
                <input 
                    className='form-box' 
                    type="number" 
                    placeholder="Quantity" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                />
                <input 
                    className='form-box' 
                    type="number" 
                    placeholder="Purchase Price" 
                    value={price} 
                    onChange={handlePriceChange}
                />
                <button className='button'>Add Stock</button>
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
                            <p>Purchase Price: {Number(stock.price).toFixed(2)}</p>
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

export default Form;