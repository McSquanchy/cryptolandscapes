import "./App.css";
import Web3  from "web3";

import * as LandscapeAuction from './contracts_abi/LandscapeAuction.json'

window.addEventListener('load', async function() {
  if (window.ethereum) {
    const accounts = await window.ethereum.send('eth_requestAccounts');

    const web3 = new Web3(window.ethereum);
    console.log(accounts);
    const userAccount = accounts.result[0]


    const contract = new web3.eth.Contract(LandscapeAuction.abi, '0x04e0C45163b8e17D6B6bB6Ff34bbc68F6771CeC9');
    contract.events.NewLandscape().on("data", function(event) {
      console.log('received data: ', event);
    }).on("error", console.error);
  
    document.getElementById("read-btn").onclick = async function(event){
      const landscapeIds = (await contract.methods.getLandscapesByOwner(userAccount).call());
      const testContainer = document.getElementById("test-area");
      testContainer.innerHTML = '';
      const list = document.createElement("ul");
      testContainer.appendChild(list);
      landscapeIds.forEach(async l => {
        const landscape = await contract.methods.landscapes(l).call();
        const x = document.createElement('li')
        x.innerText = landscape.name + ' (DNA: ' + landscape.dna + ")";
        list.append(x);
      })
    }

    document.getElementById("send-btn").onclick = function(event){
      contract.methods.createRandomLandscape(document.getElementById("input-field").value).send({from: userAccount});
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
