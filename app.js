// //working code
const contractABI = JSON.parse(fs.readFileSync('./contracts_Auction_sol_SimpleAuction.abi'));
const contractBytecode = fs.readFileSync('./contracts_Auction_sol_SimpleAuction.bin').toString();
web3.eth.getAccounts()
  .then(accounts => {
    const contract = new web3.eth.Contract(contractABI);
    return contract.deploy({
      data: contractBytecode,
      arguments: [6, accounts[0]] // Pass the first account in Ganache as the beneficiary
    })
    .send({
      from: accounts[0],
      gas: 1500000,
      gasPrice: '10000000000'
    })
  })
  .then(contractInstance => {
    console.log('Contract deployed at address:', contractInstance.options.address);
    const filePath = 'public/smart_contract_address/1.txt'
    const fileContent = contractInstance.options.address
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File created and content written successfully!');
    });
  });


  const filePath = 'public/smart_contract_address/1.txt';

  let fileContent;

  setTimeout(() => {
    fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log(fileContent);
  }, 4000);
  
  // Access fileContent here
  setTimeout(() => {
  // console.log(fileContent);
const contractAddress = fileContent; // replace with your contract address
// const contractAddress = "0xDC131271459873E2663DA6526ef8eaf55Adf227C"; // replace with your contract address


const contract = new web3.eth.Contract(contractABI, contractAddress);

const value = web3.utils.toWei('1', 'ether'); // set the bid value to 1 ETH
const account = '0x62a4B352E68264819afFf61229aBC768c95E3245'; // replace with the bidder's account address
contract.methods.bid().send({from: account, value: value})
  .on('receipt', receipt => {
    console.log('Bid successful:', receipt);
  })
  .on('error', error => {
    console.error('Bid failed:', error);
  });


  setTimeout(() => {
  const contractAddress = fileContent; // replace with your contract address
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  const value = web3.utils.toWei('2', 'ether'); // set the bid value to 1 ETH
  const account = '0xDC131271459873E2663DA6526ef8eaf55Adf227C'; // replace with the bidder's account address
  contract.methods.bid().send({from: account, value: value})
    .on('receipt', receipt => {
      console.log('Bid successful:', receipt);
    })
    .on('error', error => {
      console.error('Bid failed:', error);
    });
  }, 1000);

  
  // contract.methods.withdraw().send({from: account})
  // .on('receipt', receipt => {
  //   console.log('Withdrawal successful:', receipt);
  // })
  // .on('error', error => {
  //   console.error('Withdrawal failed:', error);
  // });

  setTimeout(() => {
      contract.methods.withdraw().send({from: account})
  .on('receipt', receipt => {
    console.log('Withdrawal successful:', receipt);
  })
  .on('error', error => {
    console.error('Withdrawal failed:', error);
  });
  contract.methods.auctionEnd().send({from: account})
  .on('receipt', receipt => {
    console.log('Auction ended:', receipt);
  })
  .on('error', error => {
    console.error('Auction end failed:', error);
  });
}, 3000);


  // web3.eth.getBalance(account)
  // .then(balance => {
  //   console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
  // })
  // .catch(error => {
  //   console.error('Failed to get balance:', error);
  // });

}, 4000);