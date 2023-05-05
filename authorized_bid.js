const contractAddress = '0x...'; // replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

const value = web3.utils.toWei('1', 'ether'); // set the bid value to 1 ETH

async function bid() {
  const account = '0x...'; // replace with the bidder's account address
  const privateKey = prompt('Enter your private key:');
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      from: account,
      to: contractAddress,
      value: value,
      gas: 200000,
      data: contract.methods.bid().encodeABI()
    },
    privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('Bid successful:', receipt);
}

async function withdraw() {
  const account = '0x...'; // replace with the bidder's account address
  const privateKey = prompt('Enter your private key:');
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      from: account,
      to: contractAddress,
      gas: 200000,
      data: contract.methods.withdraw().encodeABI()
    },
    privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('Withdrawal successful:', receipt);
}

async function auctionEnd() {
  const account = '0x...'; // replace with the bidder's account address
  const privateKey = prompt('Enter your private key:');
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      from: account,
      to: contractAddress,
      gas: 200000,
      data: contract.methods.auctionEnd().encodeABI()
    },
    privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('Auction ended:', receipt);
}

async function getBalance() {
  const account = '0x...'; // replace with the bidder's account address
  const balance = await web3.eth.getBalance(account);
  console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
}
