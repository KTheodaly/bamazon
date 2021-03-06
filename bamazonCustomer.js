
let mysql = require("mysql");
let inquirer = require("inquirer");


let connection = mysql.createConnection({
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


        for (let i = 0; i < res.length; i++) {
            console.log('Item: ' + res[i].ItemName + ' \n Price: ' + res[i].Price + ' \n Stock: ' + res[i].StockQuantity);
        }

        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "What would you like to buy?",
                choices: function (value) {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
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
        ]) //code stops working here, does not update the total items remaining
            .then(function (answer) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].ItemName == answer.choice) {
                        var chosenItem = res[i];
                    }
                    //it says buy again is not defined but I know it is, tried to move within this scope, by putting higher up but then the "purchase successful" stops working
                    let updateStock = +(chosenItem.StockQuantity) - +(answer.quantity);

                    if (+(chosenItem.StockQuantity) < +(answer.quantity)) {
                        console.log("Insufficient quantity!");

                        buyAgain();
                    }

                    else {
                        connection.query("UPDATE Items SET ? WHERE ?", [{ StockQuantity: updateStock }, { ItemId: chosenItem.ItemId }], function (err, res) {
                            console.log("Purchase successful!");

                            var Total = +answer.quantity * chosenItem.Price.toFixed(2);
                            console.log("Your total is $" + Total);

                            buyAgain();
                        });
                    }
                };
            },
            )

    },
        function buyAgain() {
            inquirer.prompt({
                name: "buyAgain",
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
        })
}