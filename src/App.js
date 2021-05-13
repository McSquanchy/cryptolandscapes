import "./App.css";
import Web3  from "web3";

import * as Storage from 'contracts/Storage.json'

window.addEventListener('load', async function() {
  if (window.ethereum) {
    const accounts = await window.ethereum.send('eth_requestAccounts');

    const web3 = new Web3(window.ethereum);
    console.log(accounts);
    const userAccount = accounts.result[0]


    const contract = new web3.eth.Contract(Storage.abi, '0xf51a91644609BdB55e562Ffb2fF1e88B6e9f1967');
    contract.events.NewData().on("data", function(event) {
      console.log('received data: ', event);
    }).on("error", console.error);
  
    document.getElementById("read-btn").onclick = async function(event){
      const {0: msg} = (await contract.methods.read().call());
      alert('Storage has: ' + msg);
    }

    document.getElementById("send-btn").onclick = function(event){
      console.log('is sending');
      contract.methods.put(document.getElementById("input-field").value).send({from: userAccount});
    }
  }
});

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
