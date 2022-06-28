//Adding Packages to project
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

//Setting up mysql connection
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password123",
    database: "tiktaktoe"
});
    //starting connection
connection.connect((err) => {
    if(err) throw err;
    console.log("Connected to DB");
})

//DB DONE

//Setting up expres app
const app = express();

//Adding middleware 
app.use(cors());
app.use(express.json());


//ROUTES
//login
app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    const tempUser = {username, password};

    /*
    sends back object { loggedIn: ture || false }
    */
    //Search DB For match of usename
    const statement = `SELECT * FROM users WHERE username='${username}';`;
    connection.query(statement, (err, results) => {
        if(results.length === 1) {
            const foundUser = {
                username: results[0].username,
                password: results[0].password,
                userId: results[0].userID
            }
            //if username match then check password 
            if(tempUser.password === foundUser.password) {
                //if both match return ture
                console.log(foundUser);

                res.send({
                    loggedIn: true,
                    userId: foundUser.userId
                });
            } else {
                res.send({
                    loggedIn: false
                })
            }
        } else {
            res.send({
                loggedIn: false
            })
        }
    });
});

//Signup
app.post('/api/signup', async (req, res) => {
    const {username, password} = req.body;
    const tempUser = {username, password};

    const statement = `SELECT * FROM users WHERE username='${username}';`;
    connection.query(statement, (err, results) => {
        if(results.length === 1) {
            //FOUND A MATCH
            res.send({usernameTaken: true});
        } else {
            //DIDN'T FIND A MATCH
            //Creating new user
            const newUserStatement = `INSERT INTO users (username, password) VALUES ('${tempUser.username}', '${tempUser.password}');`;
            connection.query(newUserStatement, (err, results) => {
                if(err) {
                    //Send back that username is taken
                    res.send({usernameTaken: true});
                }
                res.send({usernameTaken: false});
            })
        }
    })
})


//guest user



//Get user info
app.get('/api/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    const statement = `SELECT * FROM users WHERE userID='${userId}';`;
    connection.query(statement, (err, results) => {
        console.log(results);

        if(results.length === 1) {
            //The user was found
            const user = {
                username: results[0].username,
                userId: results[0].userID
            }
            res.send({
                valid: true,
                user
            });
        } else {
            res.send({
                valid: false
            })
        }
    });
})


//Starting the server
app.listen(4000, (err) => {
    if(err) throw err;
    console.log("Server has started on port " + 4000);
})