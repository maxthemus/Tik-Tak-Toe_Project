
//Local user info
let userId = sessionStorage.getItem('userId');
let username = "";
let userWins = 0;
let userLosses = 0;
let userTies = 0;
let userToken;

//Game info
let gameId = sessionStorage.getItem('gameId');
let board = [];
let currentTurn;
let gameIsPrivate;
let usersInGame;

//Other user info
let otherUserId;
let otherUsername;
let otherWins;
let otherLosses;
let othterTies;
let otherToken;

//If user isn't logged in redirect to main page
if(!sessionStorage.getItem('userId')) {
    window.location.href='../index.html';
}

window.onload = function getUserInfo () {

    fetch('http://localhost:4000/api/user/'+userId)
        .then((res) => {
            return res.json();
        }).then(data => {

            if(data.valid) {
                username =  data.user.username;
                sessionStorage.setItem('username', username);
                
            } else {
                alert("STOP HACKING PLZ");
                logoutUser();
            }
        })
        .then(() => getGameInfo())
        .then(() => updateText());
}

//Function for the user to leave the game 
function leaveGame(wasValidGame) {
    //Request to server saying leave game
    sessionStorage.removeItem("gameId");

    if(!wasValidGame) {
        //Add a request to api for stopping game state
    }

    window.location.href = './menu.html';
}

function logoutUser() {
    sessionStorage.clear;
    window.localStorage.href = "../index.html";
}

function updateText() {
    //Updating usernames
    document.getElementById('dis__username').innerHTML = username;
    document.getElementById('sml__username').innerHTML = username;
    //Other username
    if(otherUserId) {
        document.getElementById('other__username').innerHTML = otherUsername;
    } else {
        document.getElementById('other__username').innerHTML = "...";
    }

    //Updating the users w-l-t
    //Updating the other users w-l-t
    

    //Updating the lobby number
    document.getElementById('game__num').innerHTML = `Lobby: ${gameId}`;

    if(currentTurn === userId) {
        //Make left side have turn
        document.getElementById('turn__arrow').innerHTML = '<-';
    } else {
        //Make right side have the current turn
        document.getElementById('turn__arrow').innerHTML = '->';
    }

    //Setting the users tokens
    document.getElementById('sml__piece').innerHTML = userToken;
    document.getElementById('other__piece').innerHTML = otherToken;
}


//Funcitons for getting game information for setup
function getGameInfo() {

    fetch('http://localhost:4000/api/game/getGame/'+gameId, {
        method: 'POST',
        body: JSON.stringify({
            userId: userId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((res) => {
        return res.json();
    }).then(data => {
        //Check game is valid
        if(!data.gameIsValid) {
            //Game isn't valid
            leaveGame(false);
        }
        //Check user is valid
        if(!data.userIsValid) {
            //User isn't valid
            logoutUser();
        }

        //Data is valid
        storeRequestData(data.gameState);

    }).then(() => updateText())
    .catch((err) => {
        clearInterval(timer);
    })
}

function getOtherUserInfo(otherUserId) {

    fetch('http://localhost:4000/api/user/'+otherUserId)
        .then((res) => {
            return res.json();
        }).then(data => {

            if(data.valid) {
                otherUsername =  data.user.username;
            } else {
                alert("STOP HACKING PLZ");
                logoutUser();
            }
        }).then(() => updateText());
}

//Function for making a turn
function placePiece(index) {
    //Check if it is users turn
    if(currentTurn === userId) {
        //Is local players turn
        
        //Check if place is empty
        if(board[index] ===  ' ') {
            //send Request to make game
            board[index] = userToken;
            makeTurn(index);
        } else {
            console.log("can't place here");
        }
 
        console.log(index);
    } else {
        alert("Isn't your turn!");
    }
}

//Function for make a turn and send the api request
function makeTurn(index) {
    //Making the api request
    fetch('http://localhost:4000/api/game/makeTurn/'+gameId, {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            gameState: {
                gameId: gameId,
                gameIsPrivate: gameIsPrivate,
                gameBoard: board,
                userId, usersInGame,
                currentTurn: currentTurn
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => {
        return res.json();
    }).then((data) => {
        console.log(data);

        //Check to see if game is valid
        if(!data.gameValid) {
            //Game isn't valid
            console.log("IN HERE");
            leaveGame(false);
        }

        //if data is valid
        storeRequestData(data.gameState);

    }).then(() => updateText());
}

//Function for storing game state object from api requests
function storeRequestData(gameState) {
//Move data into variables
    if(gameState.userId.length > 1) {
        //Setting other user ID
        if(gameState.userId[0] === userId) {
            //First person in the array has the token '0'
            //setting the users token
            otherToken = 'X';
            userToken = '0';
            otherUserId = gameState.userId[1];
        } else {
            //Setting the users token
            otherToken = '0';
            userToken = 'X';
            otherUserId = gameState.userId[0];
        }

        getOtherUserInfo(otherUserId);
    } else {
        otherUserId = null;
        userToken = '0';
        otherToken = ' ';
    }

    usersInGame = gameState.userId;
    gameIsPrivate = gameState.gameIsPrivate;    
    board = gameState.gameBoard;
    currentTurn = gameState.userId[gameState.currentTurn];
}

//CODE FOR API REQUEST FOR GAME DATA KINDA LIKE UDP but slower with responses
const delayTimer = 5000;
const timer = setInterval(() => {
    //During timer we need to check a couple things
    //Update game data
    getGameInfo();

}, delayTimer);

//To cancel just call 
//clearInterval(timer);