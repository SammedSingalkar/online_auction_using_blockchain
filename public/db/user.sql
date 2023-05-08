use online_auction;

CREATE TABLE `user` (
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL unique,
  `Aadhar_Card` bigint(20) NOT NULL,
  `Mobile_No` bigint(10) NOT NULL,
  `DOB` date NOT NULL,
  `User_Id` varchar(10) NOT NULL,
  `Password` varchar(20) NOT NULL,
  `Shipping_Add` varchar(100) NOT NULL,
  `accound_address` text Not NUll,
  primary key(User_Id)
);

INSERT INTO `user` (`Name`, `Email`, `Aadhar_Card`, `Mobile_No`, `DOB`, `User_Id`, `Password`, `Shipping_Add`, `accound_address`) VALUES
('Adele', 'adele@gmail.com', 784598851254, 8665232603, '1993-09-08', 'adele@104', 'adele@104', '5454 Beier Plain, Apt. 147, 74963-4646, New Elvie, Montana, United States','0x390304700Cd47Ad881Ee6cd1d5F81ae76dF42a75'),
('Alan', 'alan@gmail.com', 798465541252, 8989598778, '1976-11-04', 'alan@105', 'alan@105', '181 Valentine Union, Suite 792, 80312-1723, Port Babymouth, Kansas, United States','0xDC131271459873E2663DA6526ef8eaf55Adf227C'),
('Alfred', 'alfred@gmail.com', 123809812398, 7878989856, '1972-04-12', 'alfred@106', 'alfred@106', '4498 Nolan Garden, Suite 697, 83482-9959, Lubowitzbury, California, United States','0x09306cfe43a883e5Ed31fC0B4cE1077eBaEF6b42'),
('Henrey', 'henrey@gmail.com', 45454652321, 9494636363, '1943-01-12', 'henrey@107', 'henrey@107', '2943 Jazlyn Tunnel, Apt. 342, 11336-8240, New Arne, Florida, United States','0x9deC2f57e948131aD5919AdBa6f0a541aeeCD0Ae'),
('Jett', 'jett@gmail.com', 132156431222, 9326515312, '2000-01-27', 'jett@101', 'jett@101', '1315 Wolks Vegas Ridges, Apt. 167, 80484, Oklahoma, United States','0xccDb1C47fe381569B7173e7a259395b22096c165'),
('Kylie', 'kylie@gmail.com', 123443219889, 1234567890, '1995-06-15', 'kylie@108', 'kylie@108', '38032 Olen Ville, Apt. 861, 26594-1999, New Katelynmouth, Indiana, United States','0x1164e3ef83eB7121A80EEb1ee50F76D0e469BFA9'),
('Ram', 'ram@gmail.com', 999944442222, 9797979755, '1996-04-10', 'ram@102', 'ram@102', '486 Greenfelder Forges, Apt. 077, 65022, New Cindy, Illinois, United States','0x538dc345151748d35764E7e01E03639f50841DDa'),
('Sam', 'sam@gmail.com', 111122223333, 9494948787, '2000-01-18', 'sam@101', 'sam@101', '751 Greenfelder Ridges, Apt. 167, 80484, Port Virginia, Oklahoma, United States','0x8FbFFAe6cCF561fd8B121EC1D4e6BED74CAc1051');
INSERT INTO `user`VALUES ('Sammed', 'sammedsingalkar@gmail.com', 784598851254, 8665232603, '1993-09-08', 'sam@102', 'iamsammed@12', '5454 Beier Plain, Apt. 147, 74963-4646, New Elvie, Montana, United States','0x28D3915D4A10b9fC6A807518c553518D7E6B93F0');

select * from user;
drop table user;

ALTER TABLE user RENAME COLUMN `Mobile No` TO `Mobile_No`;