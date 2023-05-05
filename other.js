// web3.eth.getAccounts()
// .then(accounts => {
//   console.log(accounts);
// })
// .catch(error => {
//   console.error(error);
// });

// web3.eth.getAccounts((error, accounts) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   console.log('Current account:', accounts[0]);
// });

// web3.request({ method: 'eth_accounts' })
//   .then((accounts) => {
//     console.log(`Accounts:\n${accounts.join('\n')}`);
//   })
//   .catch((error) => {
//     console.error(
//       `Error fetching accounts: ${error.message}.
//        Code: ${error.code}. Data: ${error.data}`
//     );
//   });


  // const contractAddress = contractInstance.options.address; // replace with your contract address
  // const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  // const value = web3.utils.toWei('1', 'ether'); // set the bid value to 1 ETH
  
  // async function bid() {
  //   const account = '0x...'; // replace with the bidder's account address
  //   const privateKey = prompt('Enter your private key:');
  //   const signedTx = await web3.eth.accounts.signTransaction(
  //     {
  //       from: account,
  //       to: contractAddress,
  //       value: value,
  //       gas: 200000,
  //       data: contract.methods.bid().encodeABI()
  //     },
  //     privateKey
  //   );
  //   const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  //   console.log('Bid successful:', receipt);
  // }
  
  // async function withdraw() {
  //   const account = '0x...'; // replace with the bidder's account address
  //   const privateKey = prompt('Enter your private key:');
  //   const signedTx = await web3.eth.accounts.signTransaction(
  //     {
  //       from: account,
  //       to: contractAddress,
  //       gas: 200000,
  //       data: contract.methods.withdraw().encodeABI()
  //     },
  //     privateKey
  //   );
  //   const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  //   console.log('Withdrawal successful:', receipt);
  // }
  
  // async function auctionEnd() {
  //   const account = '0x...'; // replace with the bidder's account address
  //   const privateKey = prompt('Enter your private key:');
  //   const signedTx = await web3.eth.accounts.signTransaction(
  //     {
  //       from: account,
  //       to: contractAddress,
  //       gas: 200000,
  //       data: contract.methods.auctionEnd().encodeABI()
  //     },
  //     privateKey
  //   );
  //   const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  //   console.log('Auction ended:', receipt);
  // }
  
  // async function getBalance() {
  //   const account = '0x...'; // replace with the bidder's account address
  //   const balance = await web3.eth.getBalance(account);
  //   console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
  // }











  // Create a new web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
const contractABI = JSON.parse(fs.readFileSync('./contracts_Auction_sol_SimpleAuction.abi'));
// const contractBytecode = fs.readFileSync('./contracts_Auction_sol_SimpleAuction.bin').toString();

// Get the accounts
const accounts =  web3.eth.getAccounts();

// Deploy the contract
const contract = new web3.eth.Contract(contractABI);
const contractInstance = contract.deploy({
  data: fs.readFileSync("./contracts_Auction_sol_SimpleAuction.bin").toString(),
  arguments: [120,accounts[0]],
});

// Get the contract address
const contractAddress =  contractInstance.address;

// Save the contract address
fs.writeFileSync("contractAddress.txt", contractAddress);

// Print the contract address
console.log("The contract address is: " + contractAddress);




// const ganache = require('ganache-cli');
// const provider = ganache.provider();
// const web3 = new Web3(provider);

// const detectProvider = require('@metamask/detect-provider');
// const provider = detectProvider();
// const web3 = new Web3(provider);






// const web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/4dcaa0d75ca2441ca8b6d0f5ae3ec3fe'));
// const newAccount = web3.eth.accounts.create();
// console.log('New account created:', newAccount.address);
// console.log('Private key:', newAccount.privateKey);







// const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/4dcaa0d75ca2441ca8b6d0f5ae3ec3fe"));
// const wallet = web3.eth.accounts.wallet.create();
// const account = web3.eth.accounts.privateKeyToAccount("99d163d960006b8044fcce8f77de47c8eca731a18c29f92f91854726b965c38c");

// wallet.add(account);
// console.log(wallet);

// const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-sepolia.g.alchemy.com/v2/l0SHnUVhQO0raJA7bU2kBl45REDeSqG_"));
// const account = web3.eth.accounts.privateKeyToAccount("99d163d960006b8044fcce8f77de47c8eca731a18c29f92f91854726b965c38c");


// const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
// const contractABI = JSON.parse(fs.readFileSync('./contracts_Auction_sol_SimpleAuction.abi'));


// console.log(contract)