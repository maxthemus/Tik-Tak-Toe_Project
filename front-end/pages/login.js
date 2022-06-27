//Function for logging in user
async function loginUser() {
    //variables for the username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginResult = await fetch("http://localhost:4000/api/login", {
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
            alert("Server are currently down sorry!");
            return false;
        }
       const {loggedIn} = data;
       
       if(!loggedIn) {
        return false;
       }
       return true;
    });

    if(loginResult) {
        //Login worked
        alert("You have logged in");
    } else {
        //Login failed
        document.getElementById('invalid').innerHTML = "Invalid username or password";
        document.getElementById('loginBut').style.height = "30px";
    }
}



