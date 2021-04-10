console.log("UTILS LOADED")

let emailDisplayed = document.getElementById("emailDisplayed");
let user = false;


let token = null;
const handleLogin = async function () {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let loginStatus
    try {
        loginStatus = await axios.post("http://" + window.location.hostname + ":80/users/loginCheck", JSON.stringify({"email": email, "password": password}),
        {
            headers: {
              'Content-Type': 'application/json'
            }
          });
    } catch (err) {
        if (err.response.status) {
            document.getElementById("errorSection").innerHTML = "Email or password invalid";

            return;
        }
    }

    token = loginStatus.data.token
    document.location.href = "http://" + window.location.hostname + ":80/users/dashboard"
};

const handleRegister = async function() {
    let registerStatus;
    try {
        let payload = {}
        payload.username = document.querySelector("#username").value
        payload.email = document.querySelector("#email").value
        payload.password = document.querySelector("#password").value
        registerStatus = await axios.post("http://" + window.location.hostname + ":80/users/registerCheck",  payload,     
        {
            headers: {
              'Content-Type': 'application/json',
              'token': token
            }
        })

    }catch(err) {console.log(err)}
    document.location.href = "http://" + window.location.hostname + ":80/users/login"
};

const handleLogout = async function() {
    let logoutStatus;
    try {
         
        logoutStatus = await axios.post("http://" + window.location.hostname + ":80/users/logout",        
        {
            headers: {
              'Content-Type': 'application/json',
              'token': token
            }
        })
        document.location.href = "http://" + window.location.hostname + ":80/users/login"
    }catch(err) {
        console.log(err)
    }
}

const checkLoginStatus = async function() {

    try {
        let user = await axios.get("http://" + window.location.hostname + ":80/users/me",        {
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
    await handleUnauthorized()
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
loginNavLink.onclick = () => {document.location.href = "http://" + window.location.hostname + ":80/users/login" }
registerNavLink.onclick = () => {document.location.href = "http://" + window.location.hostname + ":80/users/register" }
dashboardNavLink.onclick = () => {
    if (user) {
        document.location.href = "http://" + window.location.hostname + ":80/users/dashboard"
    } else {
        document.location.href = "http://" + window.location.hostname + ":80/users/login"
    }
}


let userHistory;
async function handleUnauthorized() {
    if (window.location.pathname == "/users/dashboard") {
        if (!user) {
            document.location.href = "http://" + window.location.hostname + ":80/users/login"
            return
        }


        try {
            userHistory = await axios.post("http://" + window.location.hostname + ":80/users/course/visited", JSON.stringify({"email": user.data.email}),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
                });
        } catch (err) {
            console.log(err)

        }











        // <------DASHBOARD ------>



        let userMostRecent = userHistory.data.mostRecent.split(",");



        let labsDropdown = document.getElementById("labsDropdown");
        let modulesSection = document.getElementById("modulesSection");
        let goal = document.getElementById("goal");
        let learningOutcomes = document.getElementById("learningOutcomes");
        // let labName = document.getElementById("labName");
        let labProgress = document.getElementById("labProgress");
        let labNumberHeader = document.getElementById("labNumber");

        let dashboardCommunityChat = document.getElementById("dashboardCommunityChat");
        let userSubjects;
        try {
            userSubjects = await axios.post("http://" + window.location.hostname + ":80/users/communitychat/usersubjects", JSON.stringify({"email": user.data.email}),
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            });
            console.log(userSubjects);

            for (let n = 0; n < userSubjects.data.subjects.length; n++) {
                let li = document.createElement("li")
                li.className = "list-group-item m-1 p-1"
                li.innerHTML = "<div class='h4'>" + userSubjects.data.subjects[n].subject + "</div>" +
                "<div class='text-muted'>" + userSubjects.data.subjects[n].author + "</div>" +
                "<div class='text-muted'>" + userSubjects.data.subjects[n].createdAt + "</div> <br>"
                dashboardCommunityChat.appendChild(li)
            }


        } catch (err) {
            console.log(err)
        }

        
        for (let i = 0; i < LABS.length; i++) {
            if (i == parseInt(userMostRecent[0])-1) {
                let labsDefaultSelection = document.createElement("option");
                labsDefaultSelection.innerText = LABS[parseInt(userMostRecent[0])-1][0]
                labsDefaultSelection.selected = "selected"
                labsDropdown.appendChild(labsDefaultSelection)
                
            } else {
                let labSelection = document.createElement("option");
                labSelection.innerHTML = LABS[i][0]
                labsDropdown.appendChild(labSelection)
            }
        }
        
        labsDropdown.addEventListener('change', (event)=> {
            changeLab(event.target.value)
        })
        

        function changeLab(lab) {
            let progressNumerator = 0;
            let progressDenominator = 0;
            
            modulesSection.innerHTML = "";
            for (let i = 0; i < LABS.length; i++) {
                if (lab == LABS[i][0]) {
                    // labName.innerHTML = lab;

                    labNumberHeader.innerHTML = "Lab " + (i + 1) + ":"

                    console.log("CURRENT LAB: ", lab)
                    for (let j = 0; j < LABS[i][1].length; j++) {
                        let moduleListing = document.createElement("li");
                        moduleListing.className = "list-group-item d-flex h5 mb-0 border-bottom"

                        if (parseInt(userHistory.data["lab"+(i+1)]) & Math.pow(2, j+1) ) {
                            moduleListing.className += " list-group-item-secondary"
                            moduleListing.style.border = "none";
                            progressNumerator++;
                        }
                        progressDenominator++;
                        moduleListing.innerText = LABS[i][2][j]
        
                        let goToModuleLink = document.createElement("a")
                        let goToModuleIcon = document.createElement("i")
                        goToModuleIcon.className = "fas fa-arrow-right fa-2x"
                        goToModuleLink.className ="ml-auto"
        
                        goToModuleLink.href = "http://" + window.location.hostname + ":80/users/course/" + i + "/" + j
        
                        // TODO: Add link to course
        
                        goToModuleLink.appendChild(goToModuleIcon)
                        moduleListing.appendChild(goToModuleLink)
        
                        modulesSection.appendChild(moduleListing);
                    }

                    goal.innerHTML = LABS[i][5];
                    learningOutcomes.innerHTML = "";

                     for (let j = 0; j < LABS[i][6].length; j++) {
                         let learningOutcome = document.createElement("li");
                         learningOutcome.className = "list-group-item list-group-item-" + (j%2 == 0 ? "light" : "secondary");
                         learningOutcome.innerHTML = LABS[i][6][j];
                         learningOutcomes.appendChild(learningOutcome);
                     }
                }
            }
            labProgressPercentage = parseInt((progressNumerator / progressDenominator)*100);
            labProgress.innerHTML = labProgressPercentage + "%";
            labProgress.setAttribute("aria-valuenow", labProgressPercentage);
            labProgress.style.width = labProgressPercentage + "%";
            if (labProgressPercentage == 100) {
                labProgress.innerHTML = "Lab Completed!"
                labProgress.className = "progress-bar progress-bar-striped bg-success";
            } 
            else {
                labProgress.className = "progress-bar progress-bar-striped"
            }
        }
        
        changeLab(LABS[parseInt(userMostRecent[0])-1][0])
        
        // <-------Account Management------->
        
        let updateEmailInput = document.getElementById("updateEmailInput")
        let updateEmailButton = document.getElementById("updateEmailButton")
        let updateEmailStatusText = document.getElementById("updateEmailStatusText")
        
        
        let updatePasswordInput = document.getElementById("updatePasswordInput")
        let updatePasswordInputRepeat = document.getElementById("updatePasswordInputRepeat")
        let updatePasswordButton = document.getElementById("updatePasswordButton")
        let updatePasswordStatusText = document.getElementById("updatePasswordStatusText")
        
        updateEmailButton.addEventListener("click", async (event)=> {
            let updateStatus
            console.log("USER EMAIL HERE BABYYYY:",user.data.email)
            try {
                updateStatus = await axios.post("http://" + window.location.hostname + ":80/users/updateEmail", JSON.stringify({"oldEmail": user.data.email,"newEmail": updateEmailInput.value}),
                {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
            } catch (err) {
                console.log(err)
                console.log(err.response)
                if (err.response.status == 400) {
                    console.log(err.response.data.message)
                    if (err.response.data.message) {
                        updateEmailStatusText.innerHTML = "Email <b>" + updateEmailInput.value + "</b> is taken"
                        updateEmailStatusText.className = "text-danger d-block"
                        updateEmailInput.value = ""
                        
                    } else {
                        updateEmailStatusText.innerHTML = "Email <b>" + updateEmailInput.value + "</b> is invalid ( Ex. email@example.com )"
                        updateEmailStatusText.className = "text-danger d-block"
                        updateEmailInput.value = ""
                    }
                    return
                } 
            }
        
            token = updateStatus.data.token
        
            emailDisplayed.innerHTML = updateEmailInput.value;
            user.data.email = updateEmailInput.value;
        
            updateEmailStatusText.innerHTML = "Email changed!<br>New email: <b>" + updateEmailInput.value + "</b>"
            updateEmailStatusText.className = "text-success d-block"
            updateEmailInput.value = ""
            // document.location.href = "http://" + window.location.hostname + ":80/users/dashboard"
        })
        
        updatePasswordButton.addEventListener("click", async (event)=> {
        
            if (updatePasswordInput.value !== updatePasswordInputRepeat.value) {
                updatePasswordStatusText.innerHTML = "Passwords don't match"
                updatePasswordStatusText.className = "text-danger d-block"
                updatePasswordInput.value = ""
                updatePasswordInputRepeat.value = ""
                return
            }
        
            let updateStatus
            try {
                updateStatus = await axios.post("http://" + window.location.hostname + ":80/users/updatePassword", JSON.stringify({"email": user.data.email,"newPassword": updatePasswordInput.value}),
                {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
            } catch (err) {
                console.log(err)
                console.log(err.response)
                if (err.response.status == 400 && err.response) {
                    updatePasswordStatusText.innerHTML = "Password is invalid ( Please use > 6 characters )"
                    updatePasswordStatusText.className = "text-danger d-block"
                    updatePasswordInput.value = ""
                    updatePasswordInputRepeat.value = ""
                    return
                }
            }
        
            token = updateStatus.data.token
        
            updatePasswordStatusText.innerHTML = "Password changed!"
            updatePasswordStatusText.className = "text-success d-block"
            updatePasswordInput.value = ""
            updatePasswordInputRepeat.value = ""
        
        })
        
        let mostRecentModuleButton = document.getElementById("mostRecentModule");
        mostRecentModuleButton.innerHTML += "<br><b>Lab " +userMostRecent[0] + " -  Module " + userMostRecent[1]+"</b>";
        mostRecentModuleButton.href = "http://" + window.location.hostname + ":80/users/course/" + (parseInt(userMostRecent[0])-1) + "/" + (parseInt(userMostRecent[1])-1)
        

        // <------DASHBOARD ------>



        










    }
    if (window.location.pathname == "/users/communitychat") {
        let subjectsList = document.getElementById("subjectsList");
        let backToSubjectsButton = document.getElementById("backToSubjectsButton");
        let communityChatHeader = document.getElementById("communityChatHeader");
        let openPostSubjectButton = document.getElementById("openPostSubjectButton");
        let openPostChatButton = document.getElementById("openPostChatButton");
        let postSubjectSection = document.getElementById("postSubjectSection");
        let postChatSection = document.getElementById("postChatSection");
        let subjectBody = document.getElementById("subjectBody");
        let authorSection = document.getElementById("authorSection");
        let subjectDateCreated = document.getElementById("subjectDateCreated");
        let postSubjectSubjectSection = document.getElementById("postSubjectSubjectSection");
        let postSubjectBodySection = document.getElementById("postSubjectBodySection");
        let postChatBodySection = document.getElementById("postChatBodySection");
        let postSubjectButton = document.getElementById("postSubjectButton");
        let postChatButton = document.getElementById("postChatButton");

        postChatSection.style.display = "none";
        postSubjectSection.style.display = "none";
        openPostSubjectButton.style.display = "inline-block"
        openPostChatButton.style.display = "none";


        postSubjectButton.addEventListener("click", async ()=> {
            let body = postSubjectBodySection.value;
            let sbj = postSubjectSubjectSection.value;
            let response;
            try {
                response = await axios.post("http://" + window.location.hostname + ":80/users/communitychat/postsubject", {author: user.data.email ,subject: sbj , "body": body},
                {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                });
                console.log(response)
                location.reload();
            } catch (err) {
                console.log(err)
            }
        })

        openPostChatButton.addEventListener("click", ()=> {
            if (!user) {
                document.location.href = "http://" + window.location.hostname + ":80/users/login"
                return
            } 
            if (openPostChatButton.className == "btn btn-outline-success float-right") {
                postChatSection.style.display = "block"
                openPostChatButton.className = "btn btn-outline-danger float-right"
                openPostChatButton.innerHTML = "<i class='fas fa-minus-circle'></i>"
            } else {
                postChatSection.style.display = "none"
                openPostChatButton.className = "btn btn-outline-success float-right"
                openPostChatButton.innerHTML = "<i class='fas fa-plus-circle'></i>"
            }
        })

        openPostSubjectButton.addEventListener("click", ()=> {
            if (!user) {
                document.location.href = "http://" + window.location.hostname + ":80/users/login"
                return
            } 
            if (openPostSubjectButton.className == "btn btn-outline-success float-right") {
                postSubjectSection.style.display = "block"
                openPostSubjectButton.className = "btn btn-outline-danger float-right"
                openPostSubjectButton.innerHTML = "<i class='fas fa-minus-circle'></i>"
            } else {
                postSubjectSection.style.display = "none"
                openPostSubjectButton.className = "btn btn-outline-success float-right"
                openPostSubjectButton.innerHTML = "<i class='fas fa-plus-circle'></i>"
            }
        })

        let subjectsResponse;
        try {
            subjectsResponse = await axios.get("http://" + window.location.hostname + ":80/users/communitychat/subjects",
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            });
            console.log(subjectsResponse)
        } catch (err) {
            console.log(err)

        }

        for (let i = 0; i < subjectsResponse.data.status.length; i++) {
            let sub = document.createElement("li");
            sub.className = "list-group-item";
            let currentSubject = subjectsResponse.data.status[i].subject
            sub.innerHTML = "<div class='h3'>" + subjectsResponse.data.status[i].subject + "</div>" +
                            "<div class='lead'>" + subjectsResponse.data.status[i].body + "</div>" +
                            "<div class='text-muted'>" + subjectsResponse.data.status[i].author + "</div>" +
                            "<div class='text-muted'>" + subjectsResponse.data.status[i].createdAt + "</div> <br>"
                            



            sub.addEventListener("click", async (ev)=> {
                let subj = currentSubject


                subjectBody.innerHTML = subjectsResponse.data.status[i].body
                authorSection.innerHTML = subjectsResponse.data.status[i].author
                subjectDateCreated.innerHTML = subjectsResponse.data.status[i].createdAt


                let subjectResponse;
                try {
                    subjectResponse = await axios.post("http://" + window.location.hostname + ":80/users/communitychat/subject", {subject: subj},
                    {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                    });
                    console.log(subjectResponse)
                    subjectsList.innerHTML = "";
                    for (let j = 0; j < subjectResponse.data.chats.length; j++) {
                        let subb = document.createElement("li");
                        subb.className = "list-group-item";
                        subb.innerHTML = "<div class='lead'>" + subjectResponse.data.chats[j].body + "</div>" + 
                                        "<div class='text-muted'>" + subjectResponse.data.chats[j].author + "<div>" +
                                        "<div class='text-muted float-right'>" + subjectResponse.data.chats[j].createdAt + "<div>";
                        subjectsList.appendChild(subb);
                    }


                } catch (err) {
                    console.log(err)
                }

                backToSubjectsButton.className = "btn btn-outline-primary"
                communityChatHeader.innerHTML = subj;

                postChatSection.style.display = "none";
                postSubjectSection.style.display = "none";
                openPostSubjectButton.style.display = "none"
                openPostChatButton.style.display = "inline-block";


                postChatButton.addEventListener("click", async ()=> {
                    let body = postChatBodySection.value;
                    let response;
                    try {
                        response = await axios.post("http://" + window.location.hostname + ":80/users/communitychat/postchat", {author: user.data.email ,subject: currentSubject, "body": body},
                        {
                            headers: {
                              'Content-Type': 'application/json'
                            }
                        });
                        console.log(response)
                        let li = document.createElement("li");

                        li.className = "list-group-item";
                        li.innerHTML = "<div class='lead'>" + response.data.chat.body + "</div>" + 
                                        "<div class='text-muted'>" + response.data.chat.author + "<div>" +
                                        "<div class='text-muted float-right'>" + response.data.chat.createdAt + "<div>";
                        subjectsList.appendChild(li)
                        openPostChatButton.click()
                    } catch (err) {
                        console.log(err)
                    }
                })

            })


            subjectsList.appendChild(sub);
        }

        backToSubjectsButton.addEventListener("click", () => {
            document.location.href = "http://" + window.location.hostname + ":80/users/communitychat"
        })
    }
}

