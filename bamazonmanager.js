const inquirer = require("inquirer")
const mysql = require("mysql")
const strpad = require("strpad")

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "bamazonDB"
})

connection.connect(err => {
    if (err) throw err;
    mainMenu();
    
})

function mainMenu() {
    inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do today?',
      choices: [
        'View Products for Sale',
        'View Low Inventory Items',
        'Update stock available',
        'Add a New Product for Sale',
        'Exit'
      ]
    }).then(answer => {
      switch(answer.action) {
        case 'View Products for Sale':
          viewProducts();
          break;
        case 'View Low Inventory Items':
          viewLowInventory();
          break;
        case 'Update stock available':
          updateInventory();
          break;
        case 'Add a New Product for Sale':
          newProduct();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

const viewProducts = function () {
    connection.query("select * from products", (err, data) => {
        if (err) throw err;
        prettyInventory(data)
        mainMenu();
    })
}

const viewLowInventory = function () {
    connection.query("select * from products where stock <= 10", (err, data) => {
        if (err) throw err;
        prettyInventory(data);
        mainMenu();
    })
}

const updateInventory = function () {
    inquirer.prompt([{
        name: "idNumber",
        message: "Please enter the product ID you wish to update."
    },{
        name: "amount",
        message: "Please enter the amount of items being added to the inventory."
    }]).then(answer => {
        let id = answer.idNumber;
        let amount = parseInt(answer.amount);
        connection.query("select stock from products where ?", {id: id}, (err, data) => {
            if (err) throw err;
            let currentStock = data[0].stock;
            let newStock = amount + currentStock
            connection.query("update products set ? where ?", 
                [{stock: newStock},
                {id: id}], (err, data) => {
                    console.log(`Inventory Added Sucessfully`)
                    mainMenu();
            })
        })
    })
}

const newProduct = function () {
    inquirer.prompt([{
        name: "product",
        message: "New Product's Name?"
    },{
        name: "department",
        message: "New Product's Department?"
    },{
        name: "price",
        message: "New Prodcut's Price?"
    }, {
        name: "stock",
        message: "Amount of stock to add?"
    }]).then(answer => {
        let product = answer.product;
        let department = answer.department;
        let price = answer.price;
        let stock = answer.stock;
        connection.query("insert into products set ?", {
            productName: product,
            department: department,
            price: price,
            stock: stock
        }, (err, data) => {
            if (err) throw err;
            console.log(`New Product Added Successfully.`)
            mainMenu();
        })
    });
}

const prettyInventory = function(data) {
    console.log(strpad.right('-', 83, '-'));
    console.log(`${strpad.right("ID", 2)} | ${strpad.right("Product", 20)} | ${strpad.right("Department", 20)} | ${strpad.right("Price", 20)} | ${strpad.right("Quantity", 20)}`);
    console.log(strpad.right('-', 83, '-'));
    for (let i = 0; i < data.length; i++) {
        console.log(`${strpad.right(data[i].id.toString(), 2)} | ${strpad.right(data[i].productName, 20)} | ${strpad.right(data[i].department, 20)} | ${strpad.right(data[i].price.toString(), 20)} | ${strpad.right(data[i].stock.toString(), 20)}`);
    }
    console.log(strpad.right('-', 83, '-'));
    console.log('\n\r');
}