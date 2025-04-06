import { createContext, useState } from "react";

export const StockContext = createContext(); 

export function StockProvider({ children }) {
    const [stocks, setStocks] = useState([]); 

    return (
        <StockContext.Provider value={{ stocks, setStocks }}>
            {children} 
        </StockContext.Provider>
    );
}
