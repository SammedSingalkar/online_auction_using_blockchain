const express = require("express");
const path = require("path");
const ejs = require("ejs");
var bodyParser = require("body-parser");
var mysql = require("mysql");
const session = require("express-session");
const nodemailer = require("nodemailer");
let alert = require("alert");
const fs = require("fs");
const solc = require("solc");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")); //replace with your Infura project ID

// const web3 = new Web3(Web3.givenProvider || 'https://sepolia.infura.io/v3/');
// const web3 = new Web3(Web3.currentProvider);
// var Contract = require('web3-eth-contract');
// set provider for all later instances to use
// const web3 = Contract.setProvider('https://sepolia.infura.io/v3/7dc1dad5e7174ab7886f46499f10da4d');

var router = express.Router();

var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

// app.use('/api',router)
app.use("/", router);
router.use(fileUpload());

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

router.use(
  session({
    secret: "teamwitonlineauction",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 360000000,
    }, // Session expires in 100 hour
  })
);

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const aadhar = req.body.aadhar;
    const mobile = req.body.mobile;
    const dob = req.body.date;
    const address = req.body.address;
    const acc_address = req.body.account_address;
    const random_number = Math.floor(Math.random() * 100);
    const userid = name.slice(0, 5) + "@" + random_number;
    const password = req.body.password;
    const profile = req.files.profile_img ? req.files.profile_img.data : null;

    const sql = `INSERT INTO user (Name, Email, Aadhar_Card, Mobile_No, DOB, User_Id, Password, Shipping_Add, accound_address) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      name,
      email,
      aadhar,
      mobile,
      dob,
      userid,
      password,
      address,
      acc_address,
    ];

    const folderPath = `public/images/user`;

    const buffer1 = Buffer.from(profile, "base64");
    fs.writeFileSync(`${folderPath}/${userid}.jpg`, buffer1);

    con.query(sql, values, (err, result) => {
      if (err) throw err;
      alert("Data inserted successfully");
      res.redirect("/signin");
    });
  });

router
  .route("/signin")
  .get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.render("signin", { message: "" });
    } else {
      res.redirect("/profile");
    }
  })
  .post((req, res) => {
    let email = req.body.email;
    const password = req.body.password;
    // console.log(email, password);
    con.query(`SELECT * FROM user WHERE Email='${email}'`, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        if (password === result[0].Password) {
          var email = result[0];
          req.session.user = email;
          req.session.isLoggedIn = true;

          res.redirect("/profile");
        } else {
          res.render("signin", { message: "password is wrong" });
        }
      } else {
        res.render("signin", { message: "User Not Found" });
      }
    });
  });

router.route("/").get((req, res) => {
  if (!req.session.isLoggedIn) {
    con.query(
      "SELECT * FROM item",
      (err, result) => {
        if (err) throw err;
        res.render("index", {
          msg: "Login",
          link: "/signin",
          link1: "/signin",
          result: result,
        });
      }
    );
  } else {
    con.query(
      "SELECT * FROM item",
      (err, result) => {
        if (err) throw err;
        res.render("index", {
          msg: "Logout",
          link: "/logout",
          link1: "/logout",
          result: result,
        });
      }
    );
  }
});

router.route("/about").get((req, res) => {
  res.render("about_us");
});

router.route("/privacy_&_policy").get((req, res) => {
  res.render("privacy_&_policy");
});

router.route("/terms_&_conditions").get((req, res) => {
  res.render("Terms_&_Conditions");
});

router.route("/contact").get((req, res) => {
  let email = "easybid@gmail.com";
  let address = "WIT Boys Hostel, Solapur";
  let number = 8759487525;
  res.render("contact", { email, address, number });
});

router.route("/all/categories").get((req, res) => {
  con.query(
    "SELECT category, COUNT(*) as count FROM item GROUP BY category",
    (err, result) => {
      if (err) throw err;
      res.render("Categories", { result: result });
    }
  );
});

router.route("/category_prodcuts").get((req, res) => {
  res.render("category_detail");
});

router
  .route("/profile")
  .get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const email = req.session.user.Email;

      con.query(
        "SELECT * FROM user WHERE Email = ?",
        [email],
        (err, result) => {
          if (err) throw err;
          account = result[0].accound_address;
          web3.eth
            .getBalance(account)
            .then((balance) => {
              // console.log("Account balance:",web3.utils.fromWei(balance, "ether"),"ETH");
              balance = web3.utils.fromWei(balance, "ether"),"ETH"
              res.render("user_content/profile", { result: result, balance:balance });
            })
            .catch((error) => {
              console.error("Failed to get balance:", error);
              res.render("user_content/profile", { result: result, balance:"Account not Found" });
            });
        }
      );
    }
  })


router
  .route("/wishlist")
  .get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      user_id = req.session.user.User_Id;
      con.query(
        "SELECT * FROM watchlist JOIN item ON watchlist.Item_Id = item.Item_Id where User_Id  = ?",
        [user_id],
        (err, result) => {
          if (err) throw err;
          res.render("user_content/wishlist", { result: result });
        }
      );
    }
  })
  .post((req, res) => {
    con.query("Delete from watchlist", (err, result) => {
      if (err) throw err;
      alert("Deleted Successfullt");
      res.redirect("/wishlist");
    });
  });

router.route("/wishlist/:id").post((req, res) => {
  var id = req.params.id;
  con.query(
    "Delete from watchlist where WatchList_Id = ?",
    [id],
    (err, result) => {
      if (err) throw err;
      alert("Deleted Successfullt");
      res.redirect("/wishlist");
    }
  );
}); 



router.route("/bid").get((req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/signin");
  } else {
    user_id = req.session.user.User_Id;
    con.query(
      "SELECT * FROM bid JOIN item on bid.item_Id = item.Item_Id WHERE bid.buyer_ID = ? ORDER BY bid.bid_ID DESC",
      [user_id],
      (err, result) => {
        if (err) throw err;
        res.render("user_content/bid", { result: result });
      }
    );
  }
});

router.route("/notifications").get((req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/signin");
  } else {
    user_id = req.session.user.User_Id;
    con.query(
      "SELECT * FROM notification where User_Id = ?",
      [user_id],
      (err, result) => {
        if (err) throw err;
        res.render("Notifications", { result: result });
      }
    );
  }
});

router.route("/notify").get((req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/signin");
  } else {
    user_id = req.session.user.User_Id;
    con.query(
      "SELECT * FROM notification where User_Id = ?",
      [user_id],
      (err, result) => {
        if (err) throw err;
        res.render("user_content/notifications", { result: result });
      }
    );
  }
});

router.route("/notify/:id").post((req, res) => {
  const id = req.params.id;
  con.query(
    "Delete from notification where Noti_Id = ?",
    [id],
    (err, result) => {
      if (err) throw err;
      alert("Deleted Successfullt");
      res.redirect("/notify");
    }
  );
});

router
  .route("/list_product")
  .get((req, res) => {
    con.query("SELECT DISTINCT Category FROM item", (err, result) => {
      if (err) throw err;
      res.render("user_content/list_product", { result: result });
    });
  })
  .post((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const product_name = req.body.product_name;
      const product_description = req.body.product_description;
      const starting_price = req.body.starting_price;
      const status = "Not Started"; //Sold, Active, Expired, Not Started
      const current_price = starting_price;
      const seller_Id = (user_id = req.session.user.User_Id);
      const Buyer_Id = "";

      const auction_starting = req.body.auction_start + ":00";
      const date = new Date(auction_starting);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const auction_start = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const auction_ending = req.body.auction_end + ":00";
      const date1 = new Date(auction_ending);
      const year1 = date1.getFullYear();
      const month1 = String(date1.getMonth() + 1).padStart(2, "0");
      const day1 = String(date1.getDate()).padStart(2, "0");
      const hours1 = String(date1.getHours()).padStart(2, "0");
      const minutes1 = String(date1.getMinutes()).padStart(2, "0");
      const seconds1 = String(date1.getSeconds()).padStart(2, "0");
      const auction_end = `${year1}-${month1}-${day1} ${hours1}:${minutes1}:${seconds1}`;
      const category = req.body.category;

      const img1 = req.files.product_image1
        ? req.files.product_image1.data
        : null;
      const img2 = req.files.product_image2
        ? req.files.product_image2.data
        : null;
      const img3 = req.files.product_image3
        ? req.files.product_image3.data
        : null;
      const img4 = req.files.product_image4
        ? req.files.product_image4.data
        : null;

      const sql = `INSERT INTO item (Item_Id, Item_Name, Description, Starting_Bid_Price, Status, Curr_Bid_Price, Seller_Id, Buyer_Id, Auction_Start_Time, Auction_End_Time, Category) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        null,
        product_name,
        product_description,
        starting_price,
        status,
        current_price,
        seller_Id,
        Buyer_Id,
        auction_start,
        auction_end,
        category,
      ];
      // Create a folder with the product name
      const folderPath = `public/images/product_images/${product_name}`;
      fs.mkdirSync(folderPath, { recursive: true });

      const buffer1 = Buffer.from(img1, "base64");
      const buffer2 = Buffer.from(img2, "base64");
      const buffer3 = Buffer.from(img3, "base64");
      const buffer4 = Buffer.from(img4, "base64");

      fs.writeFileSync(`${folderPath}/1.jpg`, buffer1);
      fs.writeFileSync(`${folderPath}/2.jpg`, buffer2);
      fs.writeFileSync(`${folderPath}/3.jpg`, buffer3);
      fs.writeFileSync(`${folderPath}/4.jpg`, buffer4);

      con.query(sql, values, (err, result) => {
        if (err) throw err;
        alert("Data inserted successfully");
        res.redirect("/list_product");
      });
    }
  });

router.route("/selling_history").get((req, res) => {
  // res.sendFile(path.join(__dirname+'/templates/user_content/selling_history.html'))
  if (!req.session.isLoggedIn) {
    res.redirect("/signin");
  } else {
    user_id = req.session.user.User_Id;
    con.query(
      "SELECT * from item where Seller_Id = ?",
      [user_id],
      (err, result) => {
        if (err) throw err;
        res.render("user_content/selling_history", { result: result });
      }
    );
  }
});

router.route("/purchases").get((req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/signin");
  } else {
    user_id = req.session.user.User_Id;
    con.query("SELECT * from item where Buyer_Id = ?",[user_id],(err,result)=>{
      if (err) throw err;
      res.render("user_content/purchases",{result:result});
    })
  }
});

router
  .route("/product_detail/:id")
  .get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const id = req.params.id;
      var user_id = req.session.user.User_Id;
      var user_address = req.session.user.accound_address;
      con.query("SELECT * FROM item INNER JOIN user ON item.Seller_Id = user.User_Id WHERE Item_Id = ?", [id], (err, result) => {
        if (err) throw err;
        const filePath = "public/smart_contract_address/" + id + ".txt";
        var product_name = result[0].Item_Name;
        var stat = result[0].Status;
        const seller_address = result[0].accound_address;
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
            "SELECT * FROM bid where item_Id = ? order by bid_ID DESC",
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
                    const account = seller_address;
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
                            arguments: [timeDiffInSeconds, seller_address], // Pass the first account in Ganache as the beneficiary
                          })
                          .send({
                            from: seller_address,
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
              res.render("product_detail", { result: result, result1:result1 });
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
              const contractABI = JSON.parse(
                fs.readFileSync("./contracts_Auction_sol_SimpleAuction.abi")
              );
              const contractBytecode = fs
                .readFileSync("./contracts_Auction_sol_SimpleAuction.bin")
                .toString();
              const contract = new web3.eth.Contract(
                contractABI,
                contractAddress
              );
            
              const value = web3.utils.toWei(amount, "ether");
              const account = user_address;
              
              contract.methods.bid().send({ from: account, value: value })
                .on("receipt", (receipt) => {
                  console.log("Bid successful. Transaction hash:", receipt.transactionHash);
                  con.query("UPDATE item SET Curr_Bid_Price = ? WHERE Item_Id  = ?", [amount, id], (error, results, fields) => {
                    if (error) {
                      console.error(error);
                    } else {
                      alert("Bid is placed successfully");
                      con.query("SELECT * from bid where item_Id = ? order by bid_ID DESC", [id], (err, result3) => {
                        if (err) throw err;
                        if (result3.length > 0) {
                        const pre_id = result3[0].buyer_ID;
                        con.query("SELECT * from user where User_Id = ?", [pre_id], (err, result4) => {
                          
                            const pre_address = result4[0].accound_address;
                            contract.methods.withdraw().send({ from: pre_address })
                              .on("receipt", (receipt) => {
                                console.log("Withdrawal successful:", receipt);
                              })
                              .on("error", (error) => {
                                console.error("Withdrawal failed:", error);
                              });
                            });
                          }
                      });
            
                      con.query("SELECT bid_ID FROM bid ORDER BY bid_ID DESC LIMIT 1;", (err, result) => {
                        if (err) throw err;
                        let last_Id = result[0].bid_ID;
                        let next_Id = last_Id + 1;
                        const sql = `INSERT INTO Bid (bid_ID, buyer_ID, seller_ID, item_Id, Bid_Amount, Product_Status, Date_Time, Transaction_Hash) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, "0");
                        const day = String(now.getDate()).padStart(2, "0");
                        const hour = String(now.getHours()).padStart(2, "0");
                        const minute = String(now.getMinutes()).padStart(2, "0");
                        const second = String(now.getSeconds()).padStart(2, "0");
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
                      });
                    }
                  });
                })
                .on("error", (error) => {
                  console.error("Bid failed:", error);
                  alert("Insufficient balance");
                });
            } else {
              alert("Enter bigger amount than current amount");
            }
            
          } 
          //end here
          else if (start_time > now) {
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

router.route("/addwishlist/:id").post((req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/signin");
  } else {
    const item_id = req.params.id;
    const user_id = req.session.user.User_Id;

    con.query(
      "SELECT * FROM watchlist WHERE Item_Id = ? AND User_Id = ?",
      [item_id, user_id],
      (err, result) => {
        if (err) throw err;

        if (result.length == 0) {
          const sql = `INSERT INTO watchlist (WatchList_Id, Item_Id, User_Id) 
                       VALUES (?, ?, ?)`;

          const values = [null, item_id, user_id];

          con.query(sql, values, (err, result) => {
            if (err) throw err;
            alert("Data inserted successfully");
            res.redirect("/product_detail/" + item_id);
          });
        } else {
          alert("Already present in watchlist");
          res.redirect("/product_detail/" + item_id);
        }
      }
    );
  }
});

router
  .route("/Update_user_profile")
  .get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const user_id = req.session.user.User_Id;
      con.query(
        "SELECT * FROM user where User_Id = ?",
        [user_id],
        (err, result) => {
          if (err) throw err;
          res.render("user_content/Update_user_profile", { result: result });
        }
      );
    }
  })
  .post((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const profile = req.files?.profile_img?.data;
      const folderPath = `public/images/user`;
      const userid = req.session.user.User_Id;

      if (profile) {
        const buffer1 = Buffer.from(profile, "base64");
        fs.writeFileSync(`${folderPath}/${userid}.jpg`, buffer1);
      }

      const name = req.body.name;
      const aadhar = req.body.aadhar;
      const mobile = req.body.mobile;
      const dob = req.body.date;
      const address = req.body.address;
      const password = req.body.password;
      const acc_address = req.body.account;

      // Hash the password before storing it in the database
      // const hashedPassword = bcrypt.hashSync(password, 10);

      const sql = `UPDATE user 
                   SET Name = ?, 
                       Aadhar_Card = ?, 
                       Mobile_No = ?, 
                       DOB = ?, 
                       Password = ?, 
                       Shipping_Add = ?, 
                       accound_address = ?
                   WHERE User_Id = ?`;

      const values = [name, aadhar, mobile, dob, password, address, acc_address, userid];

      // Sanitize user input using placeholders
      con.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error updating profile");
        } else {
          alert("Profile Updated Sucessfully");
          res.redirect("/logout");
        }
      });
      // res.redirect("/Update_user_profile");
    }
  });

router.route("/logout").get((req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server Started");
});