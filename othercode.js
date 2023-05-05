const express = require('express');
const app = express();
const MMSDK = new MetaMaskSDK(options);

const ethereum = MMSDK.getProvider(); 
ethereum.request({ method: 'eth_requestAccounts', params: [] });


// const MetaMaskConnector = require('node-metamask');
// const connector = new MetaMaskConnector({
//   port: 3333, // this is the default port
//   onConnect() { console.log('MetaMask client connected') }, // Function to run when MetaMask is connected (optional)
// });

// connector.start().then(() => {
//   // Now go to http://localhost:3333 in your MetaMask enabled web browser.
//   const web3 = new Web3(connector.getProvider());
//   // Use web3 as you would normally do. Sign transactions in the browser.
// });

app.get('/',()=>{
  // res.send("connector")
  console.log(connector)
})

app.listen(3000, () => {
  console.log('App listening on port 3000');
});



// const contractABI = JSON.parse(fs.readFileSync('./contracts_Auction_sol_SimpleAuction.abi'));
// const contractBytecode = fs.readFileSync('./contracts_Auction_sol_SimpleAuction.bin').toString();
// web3.eth.getAccounts()
//   .then(accounts => {
//     const contract = new web3.eth.Contract(contractABI);
//     return contract.deploy({
//       data: contractBytecode,
//       arguments: [120, accounts[0]] // Pass the first account in Ganache as the beneficiary
//     })
//     .send({
//       from: accounts[0],
//       gas: 1500000,
//       gasPrice: '10000000000'
//     })
//   })
//   .then(contractInstance => {
//     console.log('Contract deployed at address:', contractInstance.options.address);
//   });