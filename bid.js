const contractAddress = '0x...'; // replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

const value = web3.utils.toWei('1', 'ether'); // set the bid value to 1 ETH
const account = '0x...'; // replace with the bidder's account address
contract.methods.bid().send({from: account, value: value})
  .on('receipt', receipt => {
    console.log('Bid successful:', receipt);
  })
  .on('error', error => {
    console.error('Bid failed:', error);
  });

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



  web3.eth.getBalance(account)
  .then(balance => {
    console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
  })
  .catch(error => {
    console.error('Failed to get balance:', error);
  });
