let youtubePlayerSection = document.getElementById("youtubePlayerSection");

let labModuleInfo = document.getElementById("labModuleInfo").innerHTML.split(',');
let labNumber = labModuleInfo[0];
let moduleNumber = labModuleInfo[1];

console.log("Lab number: ",labNumber)
console.log("module number: ", moduleNumber)

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

let youtubePlayer = document.createElement("iframe")
youtubePlayer.setAttribute("src", "https://www.youtube.com/embed/"+LABS[labNumber][1][moduleNumber])
youtubePlayer.setAttribute("frameborder","0")
youtubePlayer.setAttribute("allow","accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture")


let youtubePlayerContainer = document.createElement("div")
youtubePlayerContainer.className = "video-container";


youtubePlayerContainer.appendChild(youtubePlayer);
youtubePlayerSection.appendChild(youtubePlayerContainer);

// <---- Video Navigation ---->
let videoNavigation = document.getElementById("videoNavigation");

let leftNav = document.createElement("a");
if ( moduleNumber > 0 ) {
    leftNav.href = "http://" + window.location.hostname + ":3000/users/course/" + labNumber + "/" + (parseInt(moduleNumber)-1)
}
let leftNavIcon = document.createElement("i");
leftNavIcon.className = "fas fa-arrow-circle-left fa-3x"
leftNav.appendChild(leftNavIcon)

let videoTitle = document.createElement("h3");
videoTitle.className = "p-3 d-inline"
videoTitle.innerText = LABS[labNumber][2][moduleNumber]

let rightNav = document.createElement("a");
if ( moduleNumber < LABS[labNumber][1].length - 1 ) {
    rightNav.href = "http://" + window.location.hostname + ":3000/users/course/" + labNumber + "/" + (parseInt(moduleNumber)+1)
}
let rightNavIcon = document.createElement("i");
rightNavIcon.className = "fas fa-arrow-circle-right fa-3x"
rightNav.appendChild(rightNavIcon)


videoNavigation.appendChild(leftNav)
videoNavigation.appendChild(videoTitle)
videoNavigation.appendChild(rightNav)

// <------ Lab and Modules Dropdown ------>

let labsDropdown = document.getElementById("labsDropdown");
let modulesDropdown = document.getElementById("modulesDropdown");

let labsDefaultSelection = document.createElement("option");
labsDefaultSelection.innerText = (parseInt(labNumber)+1) + ": " + LABS[labNumber][0]
labsDefaultSelection.selected = "selected"
labsDropdown.appendChild(labsDefaultSelection)

let modulesDefaultSelection = document.createElement("option");
modulesDefaultSelection.innerText = (parseInt(moduleNumber)+1) + ": " + LABS[labNumber][2][moduleNumber]
modulesDefaultSelection.selected = "selected"
modulesDropdown.appendChild(modulesDefaultSelection)

for (let i = 0; i < LABS.length; i++) {
    if (i == labNumber) {continue}
    let labSelection = document.createElement("option");
    labSelection.innerText = (i + 1) + ": " + LABS[i][0]
    labsDropdown.appendChild(labSelection)
}

for (let i = 0; i < LABS[labNumber][2].length; i++) {
    if (i == moduleNumber) {continue}
    let moduleSelection = document.createElement("option");
    moduleSelection.innerText = (i + 1) + ": " + LABS[labNumber][2][i]
    modulesDropdown.appendChild(moduleSelection)
}

labsDropdown.addEventListener('change', (event)=> {
    let newLabNumber = parseInt(event.target.value) - 1
    document.location.href = "http://" + window.location.hostname + ":3000/users/course/" + newLabNumber + "/0"
})

modulesDropdown.addEventListener('change', (event)=> {
    let newModuleNumber = parseInt(event.target.value) - 1
    document.location.href = "http://" + window.location.hostname + ":3000/users/course/" + labNumber + "/" + newModuleNumber
})