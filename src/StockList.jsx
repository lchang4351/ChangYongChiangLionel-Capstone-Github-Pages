import { useContext } from "react";
import { StockContext } from "./StockContext";
import { Card } from "antd";


export default function StockList () {
    const { stocks } = useContext(StockContext)
    
    return(
        <>
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
                        <Card
                        key={index}
                        title={stock.symbol}
                        style={{ width: 300, marginBottom: "20px" }}
                        >
                            <p >Quantity: {stock.quantity}</p>
                            <p>Purchase Price: {stock.price.toFixed(2)}</p>
                            <p>Current Price: {formattedCurrentPrice}</p>
                            <p style={{ color: profitLoss > 0 ? "green" : profitLoss < 0 ? "red" : "black" }}>
                                Profit/Loss: {profitLoss !== "N/A" ? ` ${profitLoss > 0 ? "+" : ""}${profitLoss}` : " N/A"}
                            </p>

                        </Card>
                    )
                })}
            </ul>
        </>
    );
}