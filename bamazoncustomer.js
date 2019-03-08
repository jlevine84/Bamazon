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
    readData();
    
})

const readData = function() {
    connection.query("select * from products", (err, data) => {
        if (err) throw err;
        prettyConsole(data)
        purchase();
    })
}

const prettyConsole = function(data) {
    console.log(strpad.right('-', 83, '-'));
    console.log(`${strpad.right("ID", 2)} | ${strpad.right("Product", 20)} | ${strpad.right("Department", 20)} | ${strpad.right("Price", 20)} | ${strpad.right("Quantity", 20)}`);
    console.log(strpad.right('-', 83, '-'));
    for (let i = 0; i < data.length; i++) {
        console.log(`${strpad.right(data[i].id.toString(), 2)} | ${strpad.right(data[i].productName, 20)} | ${strpad.right(data[i].department, 20)} | ${strpad.right(data[i].price.toString(), 20)} | ${strpad.right(data[i].stock.toString(), 20)}`);
    }
    console.log(strpad.right('-', 83, '-'));
    console.log('\n\r');
}

const purchase = function() {
    inquirer.prompt([
    {
    name: "idnumber",
    message: "Enter a product ID number to purchase that product."
    },
    {
    name: "amount",
    message: "Enter the quantity you would like to purchase."
    }
    ]).then(answer => {
        //Query the item and quantity. If the quantity for purchase is valid,
        //complete the purchase
        let id = answer.idnumber;
        let amount = answer.amount;
        connection.query("select * from products where ?", {
            id: id
        }, (err, data) => {
            if (err) throw err;
            let stock = data[0].stock;
            let price = data[0].price;
            if (amount <= stock) {
                let newStock = stock - amount;
                let purchasePrice = price*amount
                updateStock(id, newStock, purchasePrice); 
            } else if (amount > stock) {
                console.log(`Insufficient Quantity available for purchase. Please try again.`)
                connection.end();
            } 
        });
    }) 
}

const updateStock = function (id, newStock, purchasePrice) {
    connection.query("update products set ? where ?", [
        {
            stock: newStock
        }, 
        {
            id: id
        }
    ], (err, data) => {
        if (err) throw err;
        connection.query("select * from products", (err, data) => {
            if (err) throw err;
            prettyConsole(data)
            console.log(`Purchase successful. Amount due: $${purchasePrice}`)
            connection.end();
            })
        }
    )
}