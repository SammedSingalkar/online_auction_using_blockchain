              Online Auction Project
This project is an online auction system built using blockchain technology. It allows users to buy and sell items through an auction mechanism, ensuring transparency and security through the use of smart contracts.

Table of Contents
Features
Installation
Usage
Technologies
License


Features

•	User registration and authentication
•	Create, and delete auction listings
•	Place bids on auction items
•	Automatic bidding system
•	Real-time updates on bid activity
•	Secure transactions through smart contracts


Installation
To run the online auction project locally, follow these steps:

Prerequisites
•	Node.js (version >= 12)
•	Ganache (for local blockchain development)
•	MySQL database
•	
Clone the Repository
git clone https://github.com/SammedSingalkar/online_auction_using_blockchain
cd online-auction-project

Install Dependencies
npm install


Configure the Database
1.	Create a MySQL database for the project.
2.	Update the database configuration in config/db.js with your MySQL credentials.

Configure the Blockchain
1.	Start Ganache and create a new workspace.
2.	Note the RPC server URL provided by Ganache.

Configure Environment Variables
1.	Create a .env file in the project root directory.
2.	Add the following environment variables to the file:



Host=localhost
USER=your-mysql-username
PASSWORD=your-mysql-password
DB=your-mysql-database
Note: Replace the values with your own configuration.

Start the Development Server
npm start

By default, the server will start on http://localhost:3000.

Usage
Once the server is running, you can access the online auction system through your web browser. Register a new account or log in with an existing account to start using the application.

Technologies
The following technologies were used in this project:

•	Frontend: HTML, CSS, JavaScript
•	Backend: Node.js, Express.js
•	Database: MySQL
•	Smart Contracts: Solidity
•	Blockchain Development: Ganache


License
This project is licensed by Student of Walchand Institute of Technology, Solapur.
