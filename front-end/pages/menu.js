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
    fetch('http://localhost:4000/api/user/'+userId)
        .then((res) => {
            return res.json();
        }).then(data => {
            console.log(data);

            if(data.valid) {
                username =  data.user.username;
                sessionStorage.setItem('username', username);
                
            } else {
                alert("STOP HACKING PLZ");
                logoutUser();
            }
        }).then(() => updateText());
}

//Function to loggout user and redirect to index.html
function logoutUser() {
    sessionStorage.removeItem('userId');
    window.location = '../index.html';
}

function updateText() {
    console.log("CALLED");
    document.getElementById('dis__username').innerHTML = username;
}



//Functions for putting users into a queue to find games
let findingGame = false;

function findGame() {
    let findingGame = true;

    alert("You are finding a game");
}