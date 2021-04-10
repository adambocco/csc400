let youtubePlayerSection = document.getElementById("youtubePlayerSection");

let labModuleInfo = document.getElementById("labModuleInfo").innerHTML.split(',');
let labNumber = labModuleInfo[0];
let moduleNumber = labModuleInfo[1];

console.log("Lab number: ",labNumber)
console.log("module number: ", moduleNumber)

let youtubePlayer = document.createElement("iframe")
youtubePlayer.setAttribute("src", "https://www.youtube.com/embed/"+LABS[labNumber][1][moduleNumber])
youtubePlayer.setAttribute("frameborder","0")
youtubePlayer.setAttribute("allow","fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;")


let youtubePlayerContainer = document.createElement("div")
youtubePlayerContainer.className = "video-container";


youtubePlayerContainer.appendChild(youtubePlayer);
youtubePlayerSection.appendChild(youtubePlayerContainer);

// <---- Video Navigation ---->
let videoNavigation = document.getElementById("videoNavigation");


let codeSection = document.getElementById("codeSection");

let leftNav = document.createElement("a");
if ( moduleNumber > 0 ) {
    leftNav.href = "http://" + window.location.hostname + ":80/users/course/" + labNumber + "/" + (parseInt(moduleNumber)-1)
}
let leftNavIcon = document.createElement("i");
leftNavIcon.className = "fas fa-arrow-circle-left fa-3x"
leftNav.appendChild(leftNavIcon)

// let videoTitle = document.createElement("h3");
// videoTitle.className = "p-3 d-inline"
// videoTitle.innerText = LABS[labNumber][2][moduleNumber]

let selectModuleDropdown = document.createElement("select");
selectModuleDropdown.className = "h3 m-3";
selectModuleDropdown.style.position = "relative";
selectModuleDropdown.style.bottom = "4px";
selectModuleDropdown.style.border = "0px";
selectModuleDropdown.style["text-align-last"] = "center";

for (let i = 0; i < LABS[labNumber][2].length; i++) {
    if (i == moduleNumber) {
        let modulesDefaultSelection = document.createElement("option");
        modulesDefaultSelection.innerText = (parseInt(moduleNumber)+1) + ": " + LABS[labNumber][2][moduleNumber]
        modulesDefaultSelection.selected = "selected"
        modulesDefaultSelection.className = ""
        selectModuleDropdown.appendChild(modulesDefaultSelection)

        // <--- Code Snippets --->
        codeSection.innerHTML = LABS[labNumber][3][moduleNumber]

        continue
    }
    let moduleSelection = document.createElement("option");
    moduleSelection.innerText = (i + 1) + ": " + LABS[labNumber][2][i]
    moduleSelection.className = ""
    selectModuleDropdown.appendChild(moduleSelection)
}



let rightNav = document.createElement("a");
if ( moduleNumber < LABS[labNumber][1].length - 1 ) {
    rightNav.href = "http://" + window.location.hostname + ":80/users/course/" + labNumber + "/" + (parseInt(moduleNumber)+1)
}
let rightNavIcon = document.createElement("i");
rightNavIcon.className = "fas fa-arrow-circle-right fa-3x"
rightNav.appendChild(rightNavIcon)


videoNavigation.appendChild(leftNav)
videoNavigation.appendChild(selectModuleDropdown)
videoNavigation.appendChild(rightNav)

// <------ Lab and Modules Dropdown ------>

let navLabSelect = document.getElementById("navLabSelect");
let labsDropdown = document.getElementById("labsDropdown");


// let modulesDropdown = document.getElementById("modulesDropdown");


for (let i = 0; i < LABS.length; i++) {
    if (i == labNumber) {
        let labsDefaultSelection = document.createElement("option");
        labsDefaultSelection.innerText = "Lab " +(parseInt(labNumber)+1) + ": " + LABS[labNumber][0]
        labsDefaultSelection.selected = "selected"
        labsDropdown.appendChild(labsDefaultSelection)

        continue;
    }
    let labSelection = document.createElement("option");
    labSelection.innerText = "Lab " + (i + 1) + ": " + LABS[i][0]
    labsDropdown.appendChild(labSelection)


}


navLabSelect.appendChild(labsDropdown);


labsDropdown.addEventListener('change', (event)=> {
    let newLabNumber = parseInt(event.target.value.split(":")[0].split(" ")[1]) -1;
    document.location.href = "http://" + window.location.hostname + ":80/users/course/" + newLabNumber + "/0"
})

selectModuleDropdown.addEventListener('change', (event)=> {
    let newModuleNumber = parseInt(event.target.value) - 1
    document.location.href = "http://" + window.location.hostname + ":80/users/course/" + labNumber + "/" + newModuleNumber
})

let resourcesDropdown = document.getElementById("resourcesDropdown")
let downloadResourcesButton = document.getElementById("downloadResourcesButton")

for (let i = 0; i < LABS[labNumber][4].length; i++) {
    let resourceSelection = document.createElement("option");
    resourceSelection.innerHTML = LABS[labNumber][4][i]
    resourcesDropdown.appendChild(resourceSelection)
}
downloadResourcesButton.href = "/resources/"+resourcesDropdown.value

resourcesDropdown.addEventListener('change', (event)=> {
    downloadResourcesButton.href = "/resources/"+resourcesDropdown.value
})



setTimeout(async ()=> {
    try {
        userHistory = await axios.post("http://" + window.location.hostname + ":80/users/course/visit", JSON.stringify({"email": user.data.email, "labNumber": labNumber, "moduleNumber": moduleNumber}),
        {
            headers: {
                'Content-Type': 'application/json'
            }
            });
    } catch (err) {
        console.log(err)

    }
},2000)