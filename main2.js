const express = require("express");
var mysql = require("mysql");
const session = require("express-session");
const fs = require("fs");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const Web3 = require("web3");
const flash = require('express-flash');
const notifier = require('node-notifier')
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")); 

var router = express.Router();
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use("/", router);
router.use(fileUpload());

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,});

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
    },}));

router.route("/signin").post((req, res) => {
    let email = req.body.email;
    const password = req.body.password;
    con.query(`SELECT * FROM user WHERE Email='${email}'`, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        if (password === result[0].Password) {
          var email = result[0];
          req.session.user = email;
          req.session.isLoggedIn = true;
          res.redirect("/profile");
        } else {
          res.render("signin", { message: "password is wrong", alert:"true",alertTitle:"Password is wrong",alertMessage:"Please Put Correct Password" });
        } } else {
        res.render("signin", { message: "User Not Found", alert:"true",alertTitle:"User Not Found",alertMessage:"Please Put Correct Email Id" });
} });});

  router.route("/list_product").post((req, res) => {
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
        null, product_name, product_description, starting_price, status, current_price, seller_Id, Buyer_Id, auction_start, auction_end, category,
      ];
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
        req.flash('addproduct', 'true');
        res.redirect("/category_products/"+category);
      });
    }
  });

router.route("/product_detail/:id").get((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      const id = req.params.id;
      var user_id = req.session.user.User_Id;
      var user_address = req.session.user.accound_address;
      const lessAmount =  req.flash('lessAmount');
      const notstarted =  req.flash('notstarted');
      const expired =  req.flash('expired');
      const insufficient =  req.flash('insufficient');
      const addwatchlist = req.flash('addwatchlist');
      const alreadywatchlist = req.flash('alreadywatchlist');
      const bid = req.flash('bid');
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
                            arguments: [timeDiffInSeconds, seller_address],
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
                          } });});  }  }); }
              res.render("product_detail", { result: result, result1:result1, lessAmount:lessAmount, notstarted:notstarted, expired:expired, insufficient:insufficient, addwatchlist:addwatchlist, alreadywatchlist:alreadywatchlist, bid:bid});
            }
          );
        } else {
          res.status(404).send("Product does not exist");
        }   }); } })
  .post((req, res) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/signin");
    } else {
      var id = req.params.id;
      var amount = req.body.amount;
      var user_id = req.session.user.User_Id;
      var user_address = req.session.user.accound_address;
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
                      req.flash('bid', 'true');
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
                      })
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
                        const values = [next_Id, user_id, seller_id, id, amount, status, dateTimeString, receipt.transactionHash,
                        ];
                        con.query(sql, values, (err, result) => {
                          if (err) throw err;
                          res.redirect("/product_detail/" + id);
                        });
                      });
                    }
                  });
                })
                .on("error", (error) => {
                  req.flash('insufficient', 'true');
                  res.redirect("/product_detail/" + id);
                });
            } else {
              req.flash('lessAmount', 'true');
              res.redirect("/product_detail/" + id);              
            } 
          } 
          else if (start_time > now) {
            req.flash('notstarted', 'true');
            res.redirect("/product_detail/" + id);
          } else {
            req.flash('expired', 'true');
            res.redirect("/product_detail/" + id);
          }
        }
      );
    }
  });
  app.listen(3000, function () {
    console.log("Server Started");
  });