let ip = location.host;
if(ip === '') {
    ip = "localhost";
}

let userId = sessionStorage.getItem('userId');
let username = "";
let userWins = 0;
let userLosses = 0;
let userTies = 0;
//If user isn't logged in redirect to main page
if(!sessionStorage.getItem('userId')) {
    window.location.href='../index.html';
}

window.onload = function getUserInfo () {

  fetch(`http://${ip}:4000/api/user/`+userId)
        .then((res) => {
            return res.json();
        }).then(data => {
            console.log(data);

            if(data.valid) {
                username =  data.user.username;
                sessionStorage.setItem('username', username);
                
                userWins = data.user.wins;
                userLosses = data.user.losses;
                userTies = data.user.ties;

            } else {
                alert("STOP HACKING PLZ");
                logoutUser();
            }
        }).then(() => updateText());

}

//Function to loggout user and redirect to index.html
function logoutUser() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('gameId');
    window.location = '../index.html';
}

function updateText() {
    console.log("CALLED");
    document.getElementById('dis__username').innerHTML = username;

    document.getElementById('local__top__stats').innerHTML = `${userWins}-${userLosses}-${userTies}`;

}



//Functions for putting users into a queue to find games
let findingGame = false;

async function findGame() {
    let findingGame = true;

    //Send post request to the api
    let serverRes = await fetch(`http://${ip}:4000/api/game/findGame`, {
        method: 'POST',
        body: JSON.stringify({
            userId: userId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => {
        console.log(res);
        return res.json();
    }).then(data => {
        console.log("data");
        console.log(data);
        return data;
    }).catch(err => {
        alert("Server is currently down. Try again later!");
        window.location.href="../index.html";
    })

    //Saving the gameData into session storage
    sessionStorage.setItem("gameId", serverRes.gameId);

    //Changing page to game page
    window.location.href="./game.html";
}