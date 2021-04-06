// let token = document.getElementById("tokenTag");
// if (token && token.innerHTML != "") {
//     console.log("SETTING TOKEN localstorage TO: ",token.innerHTML)
//     window.localStorage.setItem("token", token.innerHTML)
// }

let emailDisplayed = document.getElementById("emailDisplayed");
let user = false;
// if (document.getElementById("logout").innerHTML == "true") {
//     console.log("ERASING COOKIE")
//     eraseCookie("token");
// }

// function createCookie(name,value,days) {
//     if (days) {
//        var date = new Date();
//        date.setTime(date.getTime()+(days*24*60*60*1000));
//        var expires = "; expires="+date.toGMTString();
//     }
//     else var expires = "";
//     document.cookie = name+"="+value+expires+";";
//     console.log("SETTING TOKEN cookie TO: ",token.innerHTML)
// }
// if (token && token.innerHTML != "") {
//     createCookie("token", token.innerHTML, 7)
// }

// function eraseCookie(name) {   
//     document.cookie = name+'=; Max-Age=-99999999;';  
// }
let token = null;
const handleLogin = async function () {
    console.log("HandleLogin clicked")
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let loginStatus
    try {
        loginStatus = await axios.post("http://" + window.location.hostname + ":3000/users/loginCheck", JSON.stringify({"email": email, "password": password}),
        {
            headers: {
              'Content-Type': 'application/json'
            }
          });
    } catch (err) {console.log(err)}

    console.log("LOGINSTATUS: ",loginStatus)
    token = loginStatus.data.token
    document.location.href = "http://" + window.location.hostname + ":3000/users/dashboard"
};

const handleRegister = async function() {
    let registerStatus;
    try {
        let payload = {}
        payload.username = document.querySelector("#username").value
        payload.email = document.querySelector("#email").value
        payload.password = document.querySelector("#password").value
        registerStatus = await axios.post("http://" + window.location.hostname + ":3000/users/registerCheck",  payload,     
        {
            headers: {
              'Content-Type': 'application/json',
              'token': token
            }
        })
        console.log(registerStatus)
    }catch(err) {console.log(err)}
    document.location.href = "http://" + window.location.hostname + ":3000/users/login"
};

const handleLogout = async function() {
    let logoutStatus;
    try {
         
        logoutStatus = await axios.post("http://" + window.location.hostname + ":3000/users/logout",        
        {
            headers: {
              'Content-Type': 'application/json',
              'token': token
            }
        })
        location.reload();
    }catch(err) {console.log(err)}
}

const checkLoginStatus = async function() {

    try {
        let user = await axios.get("http://" + window.location.hostname + ":3000/users/me",        {
            headers: {
              'Content-Type': 'application/json',
              'token': token
            }
          })
        if (user.data.status != "failed"){
            return user
        }
        else { return false}
    } catch (err) {
        console.log(err)
        return false
    }
};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

(async function() {
    if (getCookie("token") != "") {
        token = getCookie("token")
        user = await checkLoginStatus()
    }
    else {
        user = await checkLoginStatus()
    }
    handleLoginState()
})()

function handleLoginState() {
    if (user) {
        emailDisplayed.innerHTML = user.data.email;

        loginNavLink.style.display = "none" 
        registerNavLink.style.display = "none"
        dashboardNavLink.style.display = "block"
        logoutNavLink.style.display = "block"
    } else {
        emailDisplayed.innerHTML = "";
        
        loginNavLink.style.display ="block"
        registerNavLink.style.display ="block"
        dashboardNavLink.style.display = "none"
        logoutNavLink.style.display = "none"
    }
}

let loginButton = document.getElementById("loginButton");
let registerButton = document.getElementById("registerButton");
let loginNavLink =  document.getElementById("loginNavLink");
let registerNavLink = document.getElementById("registerNavLink");
let logoutNavLink =  document.getElementById("logoutNavLink");
let dashboardNavLink = document.getElementById("dashboardNavLink");

if (loginButton)
    loginButton.onclick = () => {handleLogin();};
if (registerButton)
    registerButton.onclick = () => {handleRegister();};

logoutNavLink.onclick = () => {handleLogout();};
loginNavLink.onclick = () => {document.location.href = "http://" + window.location.hostname + ":3000/users/login" }
registerNavLink.onclick = () => {document.location.href = "http://" + window.location.hostname + ":3000/users/register" }
dashboardNavLink.onclick = () => {document.location.href = "http://" + window.location.hostname + ":3000/users/dashboard" }