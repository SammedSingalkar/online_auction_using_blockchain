use online_auction;

create table `type`(
`typename` varchar(30) NOT NULL unique
);

insert into `type` values ("Antique Coins");
insert into `type` values ("Car");
insert into `type` values ("Bike");
insert into `type` values ("Gadgets");
insert into `type` values ("Books");
insert into `type` values ("Arts");
insert into `type` values ("Historic Documents");