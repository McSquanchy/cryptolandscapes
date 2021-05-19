import "./App.css";
import Web3  from "web3";

import * as LandscapeContract from './contracts_abi/LandscapeLottery.json'

window.addEventListener('load', async function() {
  if (window.ethereum) {
    const accounts = await window.ethereum.send('eth_requestAccounts');

    const web3 = new Web3(window.ethereum);
    console.log(accounts);
    const userAccount = accounts.result[0]


    const contract = new web3.eth.Contract(LandscapeContract.abi, '0x4989421F73247FD501a126603Aa32fb36Ec6E65F');
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
      contract.methods.participate().send({from: userAccount, value: web3.utils.toWei("0.0005", "ether")});
      // contract.methods.createRandomLandscape(document.getElementById("input-field").value).send({from: userAccount});
    }

    this.document.getElementById("resolve-btn").onclick = function(event){
      contract.methods.resolve().send({from: userAccount});
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
