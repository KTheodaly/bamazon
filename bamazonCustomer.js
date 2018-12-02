
var mysql = require("mysql");
var inquirer = require("inquirer");
var bamazon = require("./bamazonItems.sql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    buyItem();
});

function buyItem() {
    connection.query('SELECT * FROM Items', function (err, res) {


        for (var i = 0; i < res.length; i++) {
            console.log('Item: ' + res[i].ItemName + ' /n Price: ' + res[i].Price + ' /n Stock: ' + res[i].StockQuantity);
        }

        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    message: "What would you like to buy?",
                    choices: function (value) {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
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
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ])
            .then(function (answer) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].ItemName == answer.choice) {
                        var chosenItem = res[i];
                    }
                }
                var updateStock = +chosenItem.StockQuantity - +answer.quantity;

                if (chosenItem.StockQuantity < +answer.quantity) {
                    console.log("Insufficient quantity!");

                    again();
                }

                else {
                    connection.query("UPDATE Items SET ? WHERE ?", [{ StockQuantity: updateStock }, { ItemId: chosenItem.ItemId }], function (err, res) {
                        console.log("Purchase successful!");

                        var Total = +answer.quantity * chosenItem.Price.toFixed(2);
                        console.log("Your total is $" + Total);

                        again();
                    });
                }
            });

    });

}
//ok there is an error in here on line 80 somewhere?? I don't know where it is!//
//I've compared all these class activities and can't figure out the problem :(//

function again() {
    inquirer.prompt({
        name: "repurchase",
        type: "list",
        choices: ["Yes", "No"],
        message: "Would you like to purchase other items?"
    }).then(function (answer) {
        if (answer.repurchase == "Yes") {
            buyItem();
        }
        else {
            console.log("Thanks for shopping. Have a great day!")
        }
    });
}