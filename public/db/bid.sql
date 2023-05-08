use online_auction;

CREATE TABLE `bid`(
 `bid_ID` int(15) primary key,
  `buyer_ID` varchar(10) NOT NULL,
  `seller_ID` varchar(10) NOT NULL,
  `item_Id` int(10) not null,
  `Bid_Amount` int(10) ,
  `Product_Status` varchar(10) NOT NULL,
  `Date_Time` datetime NOT NULL,
  `Transaction_Hash` text Not NUll,
  foreign key (`item_Id`) references `item`(`Item_Id`),
  foreign key (`buyer_ID`) references `user`(`User_Id`),
  foreign key (`seller_ID`) references `user`(`User_Id`)
);

INSERT INTO bid VALUES ( 100001,'jett@101', 'adele@104',101, 12500, 'SOLD', '2023-05-18 19:23:30','0x96ab2cfef4fb6050ab83f9fcd35c7469ca9d6d1d3d0dc7738d177e1ca9c9cce2');

select * from bid;

drop table bid;
