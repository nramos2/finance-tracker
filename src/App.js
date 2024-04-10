import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState('');

  useEffect(() => {
    getTransactions().then((transactions) => {
      setTransactions(transactions);
      updateBalance(transactions);
    });
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = name.split(' ')[0];//grabs first part
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        setTransactions([json, ...transactions]);
        updateBalance([json, ...transactions]);
        // setTransactions([...transactions, json]);
        // updateBalance([...transactions, json]);
      });
    });
  }

  // let balance = 0;
  // for(const transaction of transactions) {
  //   balance += transaction.price;
  // }
  function updateBalance(transactions) {
    let newBalance = 0;
    for(const transaction of transactions) {
      newBalance += transaction.price;
    }
    newBalance = newBalance.toFixed(2);
    setBalance(newBalance);
  }

  //balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  const wholeBalance = balance.split('.')[0];

  return (
    <main>
      <h1>${wholeBalance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basicInfo">
          <input type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={'+200 new xbox series s'} />
          <input value={datetime}
            onChange={e => setDatetime(e.target.value)}
            type="datetime-local" />
        </div>
        <div className="description">
          <input type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={'description'} />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className="datetime">{transaction.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
