fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // console.error(`File '${filePath}' does not exist.`);
      const contractABI = JSON.parse(
        fs.readFileSync("./contracts_Auction_sol_SimpleAuction.abi")
      );
      const contractBytecode = fs
        .readFileSync("./contracts_Auction_sol_SimpleAuction.bin")
        .toString();
      web3.eth
        .getAccounts()
        .then((accounts) => {
          const contract = new web3.eth.Contract(contractABI);
          return contract
            .deploy({
              data: contractBytecode,
              arguments: [6, accounts[0]], // Pass the first account in Ganache as the beneficiary
            })
            .send({
              from: accounts[0],
              gas: 1500000,
              gasPrice: "10000000000",
            });
        })
        .then((contractInstance) => {
          console.log(
            "Contract deployed at address:",
            contractInstance.options.address
          );
          const filePath = "public/smart_contract_address/" + id + ".txt";
          const fileContent = contractInstance.options.address;
          fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("File created and content written successfully!");
          });
        });
    } else {
      console.log(`File '${filePath}' exists.`);
    }
  });