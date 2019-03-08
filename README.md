# Bamazon
Bamazon is a CLI app via node.JS that will allow users to access a MYSQL database in real time and manipulate it's data.

The Bamazon app has two working javaScript files the first being the customer and the second, the manager.

Using the bamazoncustomer.js file will allow the user to access the inventory of the database and make purchases if the quantity of the product is available to buy. It will also update the remaining quantity if the purchase is valid.

The bamazonmanager.js app has 4 different tools available to manipulate the database. The user can View all Products avaiable, view low inventory(any items with less than or equal to 10 in stock), update the avaiable stock of an item, or add a new product entirely.

The apps were made using the mysql, inquirer, and strpad npm packages.
