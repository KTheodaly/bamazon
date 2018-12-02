
const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
    user: "root",
    password: "Hotdog18!",
    database: "bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    buyItem();
});

function buyItem() {
    connection.query('SELECT * FROM Products', function (err, res) {


        for (const i = 0; i < res.length; i++) {
            console.log('Item: ' + res[i].ItemName + ' \n Price: ' + res[i].Price + ' \n Stock: ' + res[i].StockQuantity);
        }
        //these prompts look weird? figure out the line breaks
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "What would you like to buy?",
                choices: function (value) {
                    const choiceArray = [];
                    for (const i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].ItemName);
                    }
                    return choiceArray;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function (answer) {
                for (const i = 0; i < res.length; i++) {
                    if (res[i].ItemName == answer.choice) {
                        const chosenItem = res[i];
                    }
                }
                const updateStock = +chosenItem.StockQuantity - +answer.quantity;

                if (chosenItem.StockQuantity < +answer.quantity) {
                    console.log("Insufficient quantity!");

                    buyAgain();
                }

                else {
                    connection.query("UPDATE Items SET ? WHERE ?", [{ StockQuantity: updateStock }, { ItemId: chosenItem.ItemId }], function (err, res) {
                        console.log("Purchase successful!");

                        const Total = +answer.quantity * chosenItem.Price.toFixed(2);
                        console.log("Your total is $" + Total);

                        buyAgain();
                    });
                }
            });

    });

}


function buyAgain() {
    inquirer.prompt({
        name: "repurchase",
        type: "list",
        choices: ["Yes", "No"],
        message: "Would you like to purchase other items?",
    }).then(function (answer) {
        if (answer.repurchase == "Yes") {
            buyItem();
        }
        else {
            console.log("Thanks for shopping. Have a great day!")
        }
    });
}