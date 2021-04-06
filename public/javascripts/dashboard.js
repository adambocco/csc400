
// <--------- ADD LABS HERE -------->

const LAB1 = "Assembly Line Simulation";
const LAB1LINKS = ["lBvjUTHeU5E", "zxwhCrkfoiM", "gV81KmNw5vk", "YYBELBuuEOM", 
                "nxkv7HZ7SkE", "4jJSoMwZoaw", "tjvz9G_RVHE", "dR0d6E-QoSw",
                "qJyv152GNUY", "q6ERxYjSZxY", "MsLzc3a_yV4", "Mvl2R6dUQgo",
                "0AdYeFACScw", "YG3tTNfdPy4", "4e0P_QJZE3c", "j6qYPKkK_YY"];
const LAB1NAMES = ["Introduction", "Building the Robotic Arm", "Adding Conveyor Belt and Tables",
            "Adding a Vision Sensor", "Writing the Factory Code (Part 1)", "Writing the Factory Code (Part 2)",
            "Vision Sensor and Conveyor Belt Control", "Sensing the Product Type", "Configuring Inverse Kinematics",
            "Idle and Grab Positions", "Color and Path Positions", "Defining Dummy Positions",
            "Definint Robotic Arm Targets", "Defining Robotic Arm Behavior", "Grabbing and Dropping Products",
            "Conclusion"];

const LAB2 = "Maze Traversal Simulation";
const LAB2LINKS = ["L2-14VdjpZ0", "gfD5Y4t89lE", "jhNr_7D1qwA", "4yZCF6grTMg", 
                "zzZtPfRIAQQ", "-VFRPylIWF0", "hZahk9ft_ZQ", "qA7NfoAQUTU",
                "k2rCh7W2uz0", "9zxNyzY-IKM", "aB9TOzUbO-M", "cMv9ig8nDc0"];
const LAB2NAMES = ["Introduction", "Creating the Maze", "Configuring the Maze and Finish Line",
            "Adding and Positioning Sensors", "Configuring Sensors", "Driving the Mobile Robot",
            "Staying Between the Walls", "Turning Corners", "Turning Around",
            "Configuring the Vision Sensor", "Taking the Correct Path", "Conclusion"];


const LAB3 = "Soccer Free Shot Simulation";
const LAB3LINKS = ["zmxWTv78Xsk", "afaRanm81nM", "0FS5Q-9FkBM", "LWA6UUrLc-I"];
const LAB3NAMES = ["Introduction and Environment Setup", "Creating a Robot to Shoot a Soccer Ball", 
                    "Triggering a Goalie with Proximity Sensors", "Creating a UI Element"];

const LABS = [  [LAB1, LAB1LINKS, LAB1NAMES],
                [LAB2, LAB2LINKS, LAB2NAMES],
                [LAB3, LAB3LINKS, LAB3NAMES]];

const LABSOBJECT = {LAB1: [LAB1LINKS, LAB1NAMES],
                    LAB2: [LAB2LINKS, LAB2NAMES],
                    LAB3: [LAB3LINKS, LAB3NAMES]}

let labsDropdown = document.getElementById("labsDropdown");
let modulesSection = document.getElementById("modulesSection");

let labsDefaultSelection = document.createElement("option");
labsDefaultSelection.innerText = LABS[0][0]
labsDefaultSelection.selected = "selected"
labsDropdown.appendChild(labsDefaultSelection)

for (let i = 1; i < LABS.length; i++) {
    let labSelection = document.createElement("option");
    labSelection.innerText = LABS[i][0]
    labsDropdown.appendChild(labSelection)
}

labsDropdown.addEventListener('change', (event)=> {
    changeLab(event.target.value)
})

function changeLab(lab) {
    modulesSection.innerHTML = "";
    for (let i = 0; i < LABS.length; i++) {
        if (lab == LABS[i][0]) {
            for (let j = 0; j < LABS[i][1].length; j++) {
                let moduleListing = document.createElement("li");
                moduleListing.className = "list-group-item d-flex"
                moduleListing.innerText = LABS[i][2][j]

                let goToModuleLink = document.createElement("a")
                let goToModuleIcon = document.createElement("i")
                goToModuleIcon.className = "fas fa-arrow-right fa-2x"
                goToModuleLink.className ="ml-auto"

                goToModuleLink.href = "http://" + window.location.hostname + ":3000/users/course/" + i + "/" + j

                // TODO: Add link to course

                goToModuleLink.appendChild(goToModuleIcon)
                moduleListing.appendChild(goToModuleLink)

                modulesSection.appendChild(moduleListing);
            }
        }
    }
}

changeLab(LABS[0][0])

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
        updateStatus = await axios.post("http://" + window.location.hostname + ":3000/users/updateEmail", JSON.stringify({"oldEmail": user.data.email,"newEmail": updateEmailInput.value}),
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
    // document.location.href = "http://" + window.location.hostname + ":3000/users/dashboard"
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
        updateStatus = await axios.post("http://" + window.location.hostname + ":3000/users/updatePassword", JSON.stringify({"email": user.data.email,"newPassword": updatePasswordInput.value}),
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
    // document.location.href = "http://" + window.location.hostname + ":3000/users/dashboard"
})
