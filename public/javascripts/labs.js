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
const LAB1CODE = [  
                    // Module 1
                    "", 

                    // Module 2
                    "Mod 2",

                    // Module 3
                    "",

                    // Module 4
                    "",

                    // Module 5
                    `
factory = sim.getObjectHandle("Factory")
factoryPosition = sim.getObjectPosition(factory, -1)
colors = {{0.9, 0.5, 0.5}, {0.5, 0.9, 0.5}, {0.5, 0.5, 0.9}}
currentColor = colors[1]

function changeColor()
    randomNumber=sim.getRandom()
    if (randomNumber < 0.33) then
        return colors[1]
    elseif (randomNumber >=0.33 and randomNumber < 0.67) then
        return colors[2]
    else
        return colors[3]
    end
end
                    `,

                    // Module 6
                    `
while (true) do
    currentColor=changeColor()

    cuboid = sim.createPureShape(0, 15, {0.05, 0.05, 0.05}, 0.2, nil)

    sim.setObjectInt32Parameter( cuboid, 3003, 0)
    sim.setObjectInt32Parameter( cuboid, 3004, 1)

    sim.setObjectSpecialProperty( cuboid, sim.objectspecialproperty_renderable)

    sim.setShapeColor(cuboid, nil, sim.colorcomponent_ambient, currentColor)

    sim.setObjectParent(cuboid, -1, true)

    sim.setObjectPosition( cuboid, -1, factoryPosition)

    sim.wait(10)
end
                    `,

                    // Module 7
                    `
visionSensor = sim.getObjectHandle("Vision_sensor")



imageBuffer = sim.getVisionSensorCharImage(visionSensor, 0, 0, 1, 1)
    
r = tonumber(string.byte(imageBuffer, 1))
g = tonumber(string.byte(imageBuffer, 2))
b = tonumber(string.byte(imageBuffer, 3))

local beltVelocity = nil

if (r~=0 and g~=0 and b~=0) then
    beltVelocity=0
else
    beltVelocity=sim.getScriptSimulationParameter(sim.handle_self,"conveyorBeltVelocity")
end
                    `,

                    // Module 8
                    `
visionSensor = sim.getObjectHandle("Vision_sensor")



while (true) do 
    imageBuffer = sim.getVisionSensorCharImage(visionSensor, 0, 0, 1, 1)

    r = tonumber(string.byte(imageBuffer, 1))
    g = tonumber(string.byte(imageBuffer, 2))
    b = tonumber(string.byte(imageBuffer, 3))

    sim.wait(5)

    print("R: "..r.." G: "..g.." B: "..b)
end
        
                    `,

                    // Module 9
                    "",

                    // Module 10
                    "",

                    // Module 11
                    "",

                    // Module 12
                    `
target=sim.getObjectHandle("IRB140_target")

grabDummy=sim.getObjectHandle("grabPosition")
idleDummy=sim.getObjectHandle("idlePosition")
redDummy=sim.getObjectHandle("redPosition")
greenDummy=sim.getObjectHandle("greenPosition")
blueDummy=sim.getObjectHandle("bluePosition")

redPath=sim.getObjectHandle("redPathPosition")
greenPath=sim.getObjectHandle("greenPathPosition")
bluePath=sim.getObjectHandle("bluePathPosition")

grabPosition=sim.getObjectPosition(grabDummy, -1)
grabOrientation=sim.getObjectOrientation(grabDummy, -1)

idlePosition=sim.getObjectPosition(idleDummy, -1)
idleOrientation=sim.getObjectOrientation(idleDummy, -1)

colorReleasePositions={ sim.getObjectPosition(redDummy, -1),
                        sim.getObjectPosition(greenDummy, -1),
                        sim.getObjectPosition(blueDummy, -1)}
colorReleaseOrientations={  sim.getObjectOrientation(redDummy, -1),
                            sim.getObjectOrientation(greenDummy, -1),
                            sim.getObjectOrientation(blueDummy, -1)}
colorPathPositions={    sim.getObjectPosition(redPath, -1),
                        sim.getObjectPosition(greenPath, -1),
                        sim.getObjectPosition(bluePath, -1)}
colorPathOrientations={ sim.getObjectOrientation(redPath, -1),
                        sim.getObjectOrientation(greenPath, -1),
                        sim.getObjectOrientation(bluePath, -1)}
changeTarget(idlePosition, idleOrientation)

                    `,

                    // Module 13
                    `
function changeTarget(position, orientation)
    sim.setObjectPosition(target, -1, position)
    sim.setObjectOrientation(target, -1, orientation)
end



if (r ~= 0 and g ~= 0 and b ~= 0) then
            
    targetPosition = nil
    targetOrientation = nil
    targetPathPosition = nil
    targetPathOrientation = nil

    if (r > g and r > b) then
        targetPosition = {	colorReleasePositions[1][1],
                            colorReleasePositions[1][2],
                            colorReleasePositions[1][3]}
        targetOrientation = {	colorReleaseOrientations[1][1],
                                colorReleaseOrientations[1][2],
                                colorReleaseOrientations[1][3]}
        targetPathPosition = {	colorPathPositions[1][1],
                                colorPathPositions[1][2],
                                colorPathPositions[1][3]}
        targetPathOrientation = {   colorPathOrientations[1][1],
                                    colorPathOrientations[1][2],
                                    colorPathOrientations[1][3]}

    elseif (g > r and g > b) then
        targetPosition = {	colorReleasePositions[2][1],
                            colorReleasePositions[2][2],
                            colorReleasePositions[2][3]}
        targetOrientation = {	colorReleaseOrientations[2][1],
                                colorReleaseOrientations[2][2],
                                colorReleaseOrientations[2][3]}
        targetPathPosition = {	colorPathPositions[2][1],
                                colorPathPositions[2][2],
                                colorPathPositions[2][3]}
        targetPathOrientation = {   colorPathOrientations[2][1],
                                    colorPathOrientations[2][2],
                                    colorPathOrientations[2][3]}

    elseif (b > r and b > g) then
        targetPosition = {	colorReleasePositions[3][1],
                            colorReleasePositions[3][2],
                            colorReleasePositions[3][3]}
        targetOrientation = {	colorReleaseOrientations[3][1],
                                colorReleaseOrientations[3][2],
                                colorReleaseOrientations[3][3]}
        targetPathPosition = {	colorPathPositions[3][1],
                                colorPathPositions[3][2],
                                colorPathPositions[3][3]}
        targetPathOrientation = {   colorPathOrientations[3][1],
                                    colorPathOrientations[3][2],
                                    colorPathOrientations[3][3]}
    end
end


                    `,

                    // Module 14
                    `
changeTarget(grabPosition, grabOrientation)
sim.wait(1)
changeTarget(idlePosition, idleOrientation)
sim.wait(1)
if (g > r and g > b) then
    changeTarget(colorPathPositions[3], colorPathOrientations[3])
    sim.wait(1)
end
changeTarget(targetPathPosition, targetPathOrientation)
sim.wait(2)
changeTarget(targetPosition, targetOrientation)
sim.wait(2)
changeTarget(targetPathPosition, targetPathOrientation)
sim.wait(1)
if (g > r and g > b) then
    changeTarget(colorPathPositions[3], colorPathOrientations[3])
    sim.wait(1)
end
changeTarget(idlePosition, idleOrientation)
sim.wait(1)

                    `,

                    // Module 15
                    `
                    
                    `,

                    // Module 16
                    ""];
const LAB1RESOURCES = ["Lab1Script.pdf"];
const LAB1GOAL = "At the end of this lab you will have a completed scene in which products coming down a conveyor belt are identified as a certain class of product. You will create a robot arm capable of removing these items to a specific location.";
const LAB1LEARNINGOUTCOMES = [  "Importing models",
                                "Using vision sensor to product types by color",
                                "Manipulation of revolute joints",
                                "Programmatically create and modify shapes",
                                "Basics of inverse kinematics to dynamically control jointed models",
                                "Setting inverse kinematic waypoints and paths"];

const LAB2 = "Maze Traversal Simulation";
const LAB2LINKS = ["L2-14VdjpZ0", "gfD5Y4t89lE", "jhNr_7D1qwA", "4yZCF6grTMg", 
                "zzZtPfRIAQQ", "-VFRPylIWF0", "hZahk9ft_ZQ", "qA7NfoAQUTU",
                "k2rCh7W2uz0", "9zxNyzY-IKM", "aB9TOzUbO-M", "cMv9ig8nDc0"];
const LAB2NAMES = ["Introduction", "Creating the Maze", "Configuring the Maze and Finish Line",
            "Adding and Positioning Sensors", "Configuring Sensors", "Driving the Mobile Robot",
            "Staying Between the Walls", "Turning Corners", "Turning Around",
            "Configuring the Vision Sensor", "Taking the Correct Path", "Conclusion"];
const LAB2CODE = [  
    // Module 1
    "", 

    // Module 2
    "",

    // Module 3
    "",

    // Module 4
    "",

    // Module 5
    `    

    `,

    // Module 6
    "",

    // Module 7
    "",

    // Module 8
    "",

    // Module 9
    "",

    // Module 10
    "",

    // Module 11
    "",

    // Module 12
    ""];
const LAB2RESOURCES = ["Lab2Script.pdf", "mazes.txt"];
const LAB2GOAL = ["In this lab you will create a 4-wheeled mobile robot equipped with sensors to automate movement and obstacle avoidance. This robot will be placed in a maze and programmed with the 'Wall-Following Algorithm' to traverse the maze until it finds the end."]
const LAB2LEARNINGOUTCOMES = [  "Attaching sensor to model body",
                                "Reading from proximity and vision sensors",
                                "Programatically produce an environment (maze)",
                                "'Wall-Following Algorithm' for maze traversal",
                                "Using joint explicit handling to drive vehicle"]


const LAB3 = "Soccer Free Shot Simulation";
const LAB3LINKS = ["zmxWTv78Xsk", "afaRanm81nM", "0FS5Q-9FkBM", "LWA6UUrLc-I"];
const LAB3NAMES = ["Introduction and Environment Setup", "Creating a Robot to Shoot a Soccer Ball", 
                    "Triggering a Goalie with Proximity Sensors", "Creating a UI Element"];
const LAB3CODE = [  
    // Module 1
    "", 

    // Module 2
    "",

    // Module 3
    "",

    // Module 4
    ""];
const LAB3RESOURCES = ["Lab3Script.pdf"];
const LAB3GOAL = "";
const LAB3LEARNINGOUTCOMES = [];



const LABS = [  [LAB1, LAB1LINKS, LAB1NAMES, LAB1CODE, LAB1RESOURCES, LAB1GOAL, LAB1LEARNINGOUTCOMES],
                [LAB2, LAB2LINKS, LAB2NAMES, LAB2CODE, LAB2RESOURCES, LAB2GOAL, LAB2LEARNINGOUTCOMES],
                [LAB3, LAB3LINKS, LAB3NAMES, LAB3CODE, LAB3RESOURCES, LAB3GOAL, LAB3LEARNINGOUTCOMES]];

              