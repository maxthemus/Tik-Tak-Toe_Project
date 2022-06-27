//Function for logging in user
function loginUser() {
    //variables for the username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === "test" && password === "test") {
        alert("LOGGED IN!");
    } else {
        document.getElementById('invalid').innerHTML = "Invalid username or password";
        document.getElementById('loginBut').style.height = "30px";
    }
}