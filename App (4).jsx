
import { useState, useEffect } from 'react';
import './App.css';

function WalletTransaction(props) {
  return (
    <div>
      <h1>Wallet Transaction Management</h1>
      <p>Transaction ID: {props.transactionid}</p>
      <p>Wallet Holder: {props.walletholder}</p>
      <p>Amount: {props.amount}</p>
      <p>Transaction Type: {props.transactiontype}</p>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Digital wallet system loaded');
  }, []);

  return (
    <div>
      <WalletTransaction
        transactionid="101"
        walletholder="Arun"
        amount={500}
        transactiontype="Credit"
      />

      <button onClick={() => setCount(count + 500)}>
        Balance: {count}
      </button>
    </div>
  );
}

export default App;
