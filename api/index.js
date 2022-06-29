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

/* code for making games and creating servers for the lobbies */

//Could be implemented later to make sure players don't get into 2 games
//let playersInGame = [];

let currentGames = [
    {
        gameId: 0, 
        gameIsPrivate: false,
        gameBoard: [],
        userId: [1,2],
        currentTurn: 0
    },
]

app.get('/api/game/:gameId', async (req, res) => {
    let gameId = req.params.gameId;
    let tempUserId = req.body.userId;

    let validObj = await validateGame(gameId, tempUserId);
    res.send(validObj);
});

app.post('/api/game/makeTurn/:gameId', async (req, res) => {
    let gameId = req.params.gameId;
    let tempUserId = req.body.userId;
    let newGameState = req.body.gameState;

    let validObj = await validateGame(gameId, tempUserId);

    if(validObj.gameIsValid && validObj.userIsValid) {
        let serverGameState = currentGames[gameId];
        //GAME IS VALID
        if(tempUserId === serverGameState.userId[serverGameState.currentTurn]) {
            //If correct player than make turn
            //Making turn
            //Copying gameBoard
            currentGames[gameId].gameBoard = newGameState.gameBoard;
            //Changing player turn
            if(currentGames[gameId].currentTurn === 0) {
                currentGames[gameId].currentTurn = 1;
            } else {
                currentGames[gameId].currentTurn = 0;
            }

            //Sending info back to the client
            res.send({
                turnMade: true,
                gameValid: true,
                gameState: currentGames[gameId]
            });
        } else {
            //Wrong player making the turn
            res.send({
                turnMade: false,
                gameValid: true
            });
        }
    } else {
        //GAME ISN'T VALID
        res.send({
            turnMade: false, 
            gameValid: false
        });
    }
})

app.post('/api/game/createGame', async (req, res) => {
    const creatorId = req.body.userId;
    const gameIsPrivate = req.body.gameIsPrivate;

    let gameId = await createGame(creatorId, gameIsPrivate);
    
    res.send({
        gameId: gameId
    });
})

app.post('/api/game/findGame', async (req, res) => {
    const userId = req.body.userId;

    let gameId = await findGame(userId);

    res.send({
        gameId: gameId,
        gameData: currentGames[gameId]
    });
})

//Function for creating new games
function createGame(creatorId, gameIsPrivate) {
    console.log(currentGames);

    let newGame = {
        gameId: 0,
        gameIsPrivate: gameIsPrivate,
        gameBoard: [],
        userId: [creatorId],
        currentTurn: 0
    }

    let gameId = (currentGames.push(newGame)) - 1;
    currentGames[gameId].gameId = gameId;

    return gameId;
}

//Function for finding games
async function findGame(userId) {
    //Look to see if currentGames length is greater than 0
    if(currentGames.length > 0) {
        //if greater than 0
        //search through games and see if the game only has one player
        for(let i = 0; i < currentGames.length; i++) {
            if(currentGames[i].userId.length == 1) {
                //Found Game
                joinGame(userId, i);
                //Returning the game ID
                return i;
            }
        }
    } else {
        //If all games are full create new game and add player
        //OR If there are no games
        let gameId = await createGame(userId, false);
        return gameId;
    }
}

//Function for adding player to the game
function joinGame (userId, gameId) {
    currentGames[gameId].userId.push(userId);
}

//Function for validating games
function validateGame (gameId, tempUserId) {
    //Checking for game validation
    if(gameId < currentGames.length) {
        //Game is valid
        let currentGameInfo = currentGames[gameId];

        //Checking for valid users playing the game
        if(currentGameInfo.userId.includes(tempUserId)) {
            //Users are valid
            return {
                gameIsValid: true,
                userIsValid: true,
                gameState: currentGameInfo
            }

        } else {
            //Users are not valid
            return {
                gameIsValid: true,
                userIsValid: false
            }
        }
    } else {
        //Game isn't valid
        return {
            gameIsValid: false,
        };
    }
}

//Funciton for removing the game from array
function endGame(gameId) {
    currentGames[gameId] = null;
}


/* TEMP END POINT TO END THE GAME! */
app.get('/temp/endGame/:gameId', (req, res) => {
    const gameId = req.params.gameId;

    //Check to see if game exists
    if(gameId > currentGames.length) {
        //Game doesn't exist
        res.send({
            message:"Game doesn't exist"
        })
    }
    console.log(`before == ${currentGames}`);
    let endGameVal = endGame(gameId);
    console.log(`after == ${currentGames}`);


    res.send("DONE");
})


//Starting the server
app.listen(4000, (err) => {
    if(err) throw err;
    console.log("Server has started on port " + 4000);
})