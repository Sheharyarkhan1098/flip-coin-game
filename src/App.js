import React, { useState } from 'react';
import Web3 from 'web3';
import { simpleStorageAbi } from './abi/abis';
import './App.css';

 // note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0xd78Fbc68F4262A558a756e63eC309E872fF39272';
const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

function App() {
  const [number, setNumber] = useState(1);
  const [flipResult, setFlipResult] = useState("");
  const [side, setSide] = useState(false);

  const handleSet = async (e) => {
    try{
    e.preventDefault();
    setFlipResult("Flipping coin........")
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(SimpleContract.methods)
    // const gas = await SimpleContract.methods.flipCoin(number, true).estimateGas();
    // const result = await SimpleContract.methods.set(number).send({ from: account, gas });
    const result = await SimpleContract.methods.flipCoin(number, side).send({ from: account });
    let res = 0;
    console.log(result);
    if(result.events.Transfer[1]){
      res = result.events.Transfer[1].returnValues.value;
    }else{
      res = result.events.Transfer.returnValues.value
    }
    // console.log(result.events.Transfer.returnValues[2]);
    if(res > number*10**18){
      setFlipResult("You Won!!")
    }else{
      setFlipResult("You Lost!!")
    }}
    catch(err){
      setFlipResult(err.message)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flip Coin Game</h1>
          
          {(flipResult !== "" && flipResult !== "Flipping coin........") && (flipResult === "You Won!!" && side && <><img src="/head.png" alt="head" /><h3>Its Head!! </h3></> )}
          {(flipResult !== "" && flipResult !== "Flipping coin........") && (flipResult === "You Lost!!" && side && <><img src="/tail.png" alt="tail" /><h3>Its Tail!! </h3></> )}
          {(flipResult !== "" && flipResult !== "Flipping coin........") && (flipResult === "You Won!!" && !side && <><img src="/tail.png" alt="head" /><h3>Its Tail!! </h3></> )}
          {(flipResult !== "" && flipResult !== "Flipping coin........") && (flipResult === "You Lost!!" && !side && <><img src="/head.png" alt="tail" /><h3>Its Head!! </h3></> )}
          {flipResult === "Flipping coin........" ? <><img src="/fliping.gif" alt="Flipping coin..." /><h3>{flipResult}</h3></> : <h3>{flipResult}</h3>}
          {(flipResult !== "" && flipResult !== "Flipping coin........") && <button onClick={() => setFlipResult("")}>Retry</button>}
          <label>
            Select Side: {" "}
            <button disabled={flipResult !== ""} onClick={() => setSide(true)}>Head</button>  
            <button disabled={flipResult !== ""} onClick={() => setSide(false)}>Tail</button> 
            {" "}
            <h5>{side ? "Head" : "Tail"}</h5>
          </label>
          <label>
            Enter Amount: {" "}
            <input type="text" name="name" value={number} onChange={ e => setNumber(e.target.value) }  />
            {" "}
            <p style={{fontSize: 20}}>(amount should be greater than 0 and less than 5)</p>
          </label>
          <button onClick={handleSet} disabled={flipResult !== "" || (number <= 0 && number >= 5)}>Flip Coin</button>
        
          
        
        <br/>
      </header>
    </div>
  );
}

export default App;
