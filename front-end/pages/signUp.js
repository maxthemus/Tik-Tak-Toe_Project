//function for signing up new users
function signupUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;

    //Check to see if username is taken in the DB
    const usernameTake = false; // ACCESS DB HERE

    if(usernameTake) {
        //if username is taken
        document.getElementById('invalid').innerHTML = "Username is taken!";
        document.getElementById('signBut').style.height = "30px";
        return;
    } 
    //if username is not taken
    //Check if the passwords match up
    if(password === repassword) {
        //Create new user
        
        //ACCESS DB HERE

    } else {
        //prompt try again
        document.getElementById('invalid').innerHTML = "Passwords don't match!";
        document.getElementById('signBut').style.height = "30px";
    }
}