let ip = location.host;
if(ip === '') {
    ip = "localhost";
}

//Function for logging in user
async function loginUser() {
    console.log(ip);
    //variables for the username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginResult = await fetch(`http://${ip}:4000/api/login`, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.json())
    .then((data, err) => {
        if(err) { 
            alert("Servers are currently down sorry!");
            return {res: false};
        }
        const {loggedIn} = data;
        

        if(!loggedIn) {
            return {res: false};
        }
        return {
            res: true,
            userId: data.userId
        };
    }).catch((err) => {
        alert("Servers are currently down sorry!");
        return {res: false};
    });

    if(loginResult.res) {
        //Login worked
        sessionStorage.setItem("userId", loginResult.userId);
        /*
            could add this if you wanted a remember me button on login
            localStorage.setItem('userId', loginResult.userId);
        */
        window.location.href='./menu.html';
    } else {
        //Login failed
        document.getElementById('invalid').innerHTML = "Invalid username or password";
        document.getElementById('loginBut').style.height = "30px";
    }
}



