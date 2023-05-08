router
  .route("/product_detail/:id")
  .get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const id = req.params.id;
      var user_id = req.session.user.User_Id;
      var user_address = req.session.user.accound_address;
      con.query("SELECT * FROM item where Item_Id = ?", [id], (err, result) => {
        if (err) throw err;
        const filePath = "public/smart_contract_address/" + id + ".txt";
        var product_name = result[0].Item_Name;
        var stat = result[0].Status;
        if (result.length > 0) {
          var now = new Date();
          var end_time = result[0].Auction_End_Time;
          var start_time = result[0].Auction_Start_Time;
          const endTimestamp = new Date(end_time).getTime();
          const startTimestamp = new Date(start_time).getTime();
          const timeDiffInSeconds = Math.floor(
            (endTimestamp - startTimestamp) / 1000
          );
          // console.log(`Time difference in seconds: ${timeDiffInSeconds}`);
          con.query(
            "SELECT * FROM bid where item_Id = ?",
            [id],
            (err, result1) => {
              if (err) throw err;

              if (now >= end_time) {
                var s = result[0].Status;
                if (s != "Sold" && s != "Expired") {
                  if (result1.length > 0) {
                    const filePath =
                      "public/smart_contract_address/" + id + ".txt";
                    // let fileContent;
                    const contractAddress = fs.readFileSync(filePath, "utf-8");
                    const contractABI = JSON.parse(
                      fs.readFileSync(
                        "./contracts_Auction_sol_SimpleAuction.abi"
                      )
                    );
                    const contract = new web3.eth.Contract(
                      contractABI,
                      contractAddress
                    );
                    const account = user_address;
                    contract.methods
                      .auctionEnd()
                      .send({ from: account })
                      .on("receipt", (receipt) => {
                        console.log("Auction ended:", receipt);
                      })
                      .on("error", (error) => {
                        console.error("Auction end failed:", error);
                      });
                      con.query("SELECT buyer_ID FROM bid WHERE item_Id = ? ORDER BY bid_ID DESC LIMIT 1", [id], (err, result2) => {
                        if (err) throw err;
                        const buyer_id = result2[0].buyer_ID;

                        con.query("UPDATE item SET Buyer_Id = ? where Item_Id = ?",[buyer_id,id],(error,results,fields)=>{
                          if (err) throw err;
                        })
                    });
                    var status = "Sold";
                    con.query(
                      "UPDATE item SET Status = ? WHERE Item_Id  = ?",
                      [status, id],
                      (error, results, fields) => {
                        if (error) console.error(error);
                      }
                    );
                  } else {
                    var status = "Expired";
                    con.query(
                      "UPDATE item SET Status = ? WHERE Item_Id  = ?",
                      [status, id],
                      (error, results, fields) => {
                        if (error) console.error(error);
                      }
                    );
                  }
                } else {
                  console.log("Payment Already done");
                }
              } else if (now <= end_time && now >= start_time) {
                var status = "Active";
                con.query(
                  "UPDATE item SET Status = ? WHERE Item_Id  = ?",
                  [status, id],
                  (error, results, fields) => {
                    if (error) console.error(error);
                  }
                );

                fs.access(filePath, fs.constants.F_OK, (err) => {
                  if (err) {
                    // console.error(`File '${filePath}' does not exist.`);
                    const contractABI = JSON.parse(
                      fs.readFileSync(
                        "./contracts_Auction_sol_SimpleAuction.abi"
                      )
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
                            arguments: [timeDiffInSeconds, user_address], // Pass the first account in Ganache as the beneficiary
                          })
                          .send({
                            from: user_address,
                            gas: 1500000,
                            gasPrice: "10000000000",
                          });
                      })
                      .then((contractInstance) => {
                        console.log(
                          "Contract deployed at address:",
                          contractInstance.options.address
                        );
                        const filePath =
                          "public/smart_contract_address/" + id + ".txt";
                        const fileContent = contractInstance.options.address;
                        fs.writeFile(filePath, fileContent, (err) => {
                          if (err) {
                            console.error(err);
                            return;
                          }
                          console.log(
                            "File created and content written successfully!"
                          );
                        });
                      });
                  } else {
                    console.log(`File '${filePath}' exists.`);
                  }
                  //end of smart contract deployement
                });
              }
              // Render the product detail page after updating the status
              res.render("product_detail", { result: result });
            }
          );
        } else {
          // Handle the case where result is empty
          // res.render("product_detail", { result: [] });
          res.status(404).send("Product does not exist");
        }

        // res.render("product_detail", { result: result });
      });
    }
  })
  .post((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      var id = req.params.id;
      var amount = req.body.amount;
      var user_id = req.session.user.User_Id;
      var user_address = req.session.user.accound_address;
      console.log("User Address is"+user_address)
      con.query(
        "SELECT Curr_Bid_Price, Seller_Id, Status, Auction_End_Time, Auction_Start_Time FROM item where Item_Id = ?",
        [id],
        (err, result) => {
          if (err) throw err;
          var end_time = result[0].Auction_End_Time;
          var start_time = result[0].Auction_Start_Time;
          const endTimestamp = new Date(end_time).getTime();
          const startTimestamp = new Date(start_time).getTime();
          const now = new Date();

          // const timeDiffInSeconds = Math.floor((endTimestamp - startTimestamp) / 1000);
          // console.log(`Time difference in seconds: ${timeDiffInSeconds}`);

          if (end_time >= now && start_time <= now) {
            var current_price = result[0].Curr_Bid_Price;
            var status = result[0].Status;
            var seller_id = result[0].Seller_Id;
            if (amount > current_price) {
              const filePath = "public/smart_contract_address/" + id + ".txt";
              let fileContent;
              const contractAddress = fs.readFileSync(filePath, "utf-8");
              // console.log(fileContent);
              // const contractAddress = fileContent; // replace with your contract address
              const contractABI = JSON.parse(
                fs.readFileSync("./contracts_Auction_sol_SimpleAuction.abi")
              );
              const contract = new web3.eth.Contract(
                contractABI,
                contractAddress
              );

              const value = web3.utils.toWei(amount, "ether"); // set the bid value to 1 ETH
              const account = user_address; // replace with the bidder's account address
              contract.methods
                .bid()
                .send({ from: account, value: value })
                .on("receipt", (receipt) => {
                  // console.log("Bid successful:", receipt);
                  console.log(
                    "Bid successful. Transaction hash:",
                    receipt.transactionHash
                  ); //0xa9c291845022c53ad3473aa8fc9f87a30c414960fd1e6248d51c16305382176d
                  con.query(
                    "UPDATE item SET Curr_Bid_Price = ? WHERE Item_Id  = ?",
                    [amount, id],
                    (error, results, fields) => {
                      if (error) {
                        console.error(error);
                      } else {
                        alert("Bid is placed successfully");

                        con.query("SELECT * from bid where item_Id = ? order by bid_ID DESC",[id],(err,result3)=>{
                            if (err) throw err;
                         const pre_id = result3[0].buyer_ID;

                         con.query("SELECT * from user where User_Id = ?",[pre_id],(err,result4)=>{

                         const pre_address = result4[0].accound_address;
                        
                        contract.methods
                          .withdraw()
                          .send({ from: pre_address })
                          .on("receipt", (receipt) => {
                            console.log("Withdrawal successful:", receipt);
                          })
                          .on("error", (error) => {
                            console.error("Withdrawal failed:", error);
                          });
                        })
                    })

                        con.query(
                          "SELECT bid_ID FROM bid ORDER BY bid_ID DESC LIMIT 1;",
                          (err, result) => {
                            if (err) throw err;
                            let last_Id = result[0].bid_ID;
                            let next_Id = last_Id + 1;
                            const sql = `INSERT INTO Bid (bid_ID, buyer_ID, seller_ID, item_Id, Bid_Amount, Product_Status, Date_Time, Transaction_Hash) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                            const now = new Date();
                            const year = now.getFullYear();
                            const month = String(now.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(now.getDate()).padStart(2, "0");
                            const hour = String(now.getHours()).padStart(
                              2,
                              "0"
                            );
                            const minute = String(now.getMinutes()).padStart(
                              2,
                              "0"
                            );
                            const second = String(now.getSeconds()).padStart(
                              2,
                              "0"
                            );
                            const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                            const values = [
                              next_Id,
                              user_id,
                              seller_id,
                              id,
                              amount,
                              status,
                              dateTimeString,
                              receipt.transactionHash,
                            ];
                            con.query(sql, values, (err, result) => {
                              if (err) throw err;
                              alert("Data inserted successfully");
                              res.redirect("/product_detail/" + id);
                            });
                          }
                        );
                        // res.redirect("/product_detail/" + id);
                      }
                    }
                  );
                })
                .on("error", (error) => {
                  console.error("Bid failed:", error);
                  alert("Insufficient balance");
                });
            } else {
              alert("Enter bigger amount than current amount");
            }
          } else if (start_time > now) {
            alert("bidding is Not Started Yet");
            res.redirect("/product_detail/" + id);
          } else {
            alert("bidding is Expired");
            res.redirect("/product_detail/" + id);
          }
        }
      );
    }
  });