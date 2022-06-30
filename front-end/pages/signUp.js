let ip = location.host;
if(ip === '') {
    ip = "localhost";
}

//function for signing up new users
async function signupUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;

    if(password === repassword) {
        //Create new user
        //Check to see if username is taken in the DB
        const usernameTaken = await fetch(`http://${ip}:4000/api/signup`, {
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
            console.log(data);

            if(err) { 
                alert("Server are currently down sorry!");
                return true;
            }
        const {usernameTaken} = data;
        
        if(!usernameTaken) {
            return false;
        }
        return true;
        }).catch((err) => {
            alert("Server are currently down sorry!");
            return true;
        });

        if(usernameTaken) {
            //if username is taken
            document.getElementById('invalid').innerHTML = "Username is taken!";
            document.getElementById('signBut').style.height = "30px";
            return;
        } else {
            alert("Created new user!");
            window.location.href="./login.html";
        }
    } else {
        //prompt try again
        document.getElementById('invalid').innerHTML = "Passwords don't match!";
        document.getElementById('signBut').style.height = "30px";
    }
}