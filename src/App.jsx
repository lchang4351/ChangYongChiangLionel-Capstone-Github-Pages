import { useEffect, useState } from 'react'

import Form from './Form.jsx'
import StockList from './StockList.jsx';
import { StockProvider } from './StockContext.jsx';


function App() {

  return(
    <StockProvider>
      <h1>Finance Dashboard</h1>
      <Form />
      <h1>Stock List</h1>
      <StockList />
      
    </StockProvider>
  )
}

export default App
