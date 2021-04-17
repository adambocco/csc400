const LAB1 = "Assembly Line Simulation";
const LAB1LINKS = ["lBvjUTHeU5E", "zxwhCrkfoiM", "gV81KmNw5vk", "YYBELBuuEOM", 
                "nxkv7HZ7SkE", "4jJSoMwZoaw", "tjvz9G_RVHE", "dR0d6E-QoSw",
                "qJyv152GNUY", "q6ERxYjSZxY", "MsLzc3a_yV4", "Mvl2R6dUQgo",
                "0AdYeFACScw", "YG3tTNfdPy4", "4e0P_QJZE3c", "_WgG86endzo",
                 "EFD7NMd-H28", "j6qYPKkK_YY"];
const LAB1NAMES = ["Introduction", "Building the Robotic Arm", "Adding Conveyor Belt and Tables",
            "Adding a Vision Sensor", "Writing the Factory Code (Part 1)", "Writing the Factory Code (Part 2)",
            "Vision Sensor and Conveyor Belt Control", "Sensing the Product Type", "Configuring Inverse Kinematics",
            "Idle and Grab Positions", "Color and Path Positions", "Defining Dummy Positions",
            "Definint Robotic Arm Targets", "Defining Robotic Arm Behavior", "Grabbing and Dropping Products",
            "Placing Cuboids in a Row", "Clearing the Tables", "Conclusion"];
const LAB1CODE = [  
                    // Module 1
                    "", 

                    // Module 2
                    `
<b>Shift Gripper (Relative to World):</b>
    Z: -0.02
<b>Rotate Gripper (Relative to Own Frame):</b>
    Y: 180 
                    `,

                    // Module 3
                    `
<b>Table Heights:</b> 
    0.41

<b>Shift Factory (Relative to World):</b>
    Z: 0.5
                    `,

                    // Module 4
                    `
<b>Shift Vision Sensor (Relative to World):</b>
    Z: 0.455
<b>Rotate Vision Sensor (Relative to Own Frame):</b>
    X: 90
<b>Vision Sensor Far Clipping Plane:</b>
    0.3
<b>Vision Sensor Resolution:</b>
    X: 1
    Y: 1
                    `,

                    // Module 5
                    `
<b>Factory Script:</b>

    factory = sim.getObjectHandle("Factory")
    factoryPosition = sim.getObjectPosition(factory, -1)
    colors = {{0.9, 0.5, 0.5}, {0.5, 0.9, 0.5}, {0.5, 0.5, 0.9}}
    currentColor = colors[1]

    ...

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
<b>Factory Script:</b>

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
<b>Conveyor Belt Script:</b>

    visionSensor = sim.getObjectHandle("Vision_sensor")

    ...

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
<b>IRB140 Script:</b>

    visionSensor = sim.getObjectHandle("Vision_sensor")

    ...

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
                    `
<b>Shift IRB140_tip (Relative to World):</b>
    Y: -0.015
    Z: -0.1
                    `,

                    // Module 10
                    `
<b>Shift Grab Position (Relative to World):</b>
    Z: 0.03
                    `,

                    // Module 11
                    `
<b>Shift Red, Green, and Blue Positions (Relative to World):</b>
    Z: 0.05
<b>Shift Red, Green, and Blue Path Positions (Relative to World):</b>
    Z: 0.2
                    `,

                    // Module 12
                    `
<b>IRB140 Script:</b>

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
<b>IRB140 Script:</b>

    function changeTarget(position, orientation)
        sim.setObjectPosition(target, -1, position)
        sim.setObjectOrientation(target, -1, orientation)
    end

    ...

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
<b>IRB140 Script:</b>

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
<b>IRB140 Script:</b>

    gripperSensor=sim.getObjectHandle('ROBOTIQ_85_attachProxSensor')
    connector=sim.getObjectHandle('ROBOTIQ_85_attachPoint')
    attachedObject=nil

    ...

    function grabCuboid()
        index=0
        while (true) do
            objectInScene=sim.getObjects(index,sim.object_shape_type)

            if (objectInScene==-1) then break end

            objectName = sim.getObjectName(objectInScene)
            isCuboid = "Cuboid" == string.sub(objectName,1,6)

            if ((isCuboid) and 
                (sim.getObjectInt32Parameter(objectInScene,sim.shapeintparam_respondable)~=0) and
                (sim.checkProximitySensor(gripperSensor,objectInScene)==1)) then
            
                attachedObject = objectInScene
                sim.setObjectParent(objectInScene,connector,true)
                break
            end
            index=index+1
        end
    end

    ...

    function dropCuboid()
	    sim.setObjectParent(attachedObject,-1,true)
	end

    ...

    changeTarget(grabPosition, grabOrientation)
    sim.wait(1)
    <b>grabCuboid()
    sim.wait(1)</b>
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
    <b>dropCuboid()
    sim.wait(1)</b>
    changeTarget(targetPathPosition, targetPathOrientation)
    sim.wait(1)
    if (g > r and g > b) then
        changeTarget(colorPathPositions[3], colorPathOrientations[3])
        sim.wait(1)
    end
    changeTarget(idlePosition, idleOrientation)
    sim.wait(1)

                    `,

                    // Module 16
                    `
<b>IRB14 Script:</b>

    redProducts={}
    greenProducts={}
    blueProducts={}

    ...

    function getLength(t)
        count = 0

        for index,value in pairs(t) do
            count = count + 1
        end
        return count
    end

    ...

    if (r > g and r > b) then …
        targetPosition[1] = targetPosition[1] - (0.1*getLength(redProducts))
        targetPathPosition[1] = targetPathPosition[1] - (0.1*getLength(redProducts))
        cuboidColor="red"
    elseif (g > r and g > b) then …
        targetPosition[2] = targetPosition[2] - (0.1*getLength(greenProducts))
        targetPathPosition[2] = targetPathPosition[2] - (0.1*getLength(greenProducts))
        cuboidColor="green"
    elseif (b > r and b > g) then …
        targetPosition[1] = targetPosition[1] - (0.1*getLength(blueProducts))
        targetPathPosition[1] = targetPathPosition[1] - (0.1*getLength(blueProducts))
        cuboidColor="blue"
    end
                    `,
                    
                    // Module 17
                    `
<b>IRB140 Script:</b>

    function clearTables()

        redCount=getLength(redProducts)
        greenCount=getLength(greenProducts)
        blueCount=getLength(blueProducts)

        if (redCount >= 3) then 
            for i,v in pairs(redProducts) do
                sim.removeObject(redProducts[i])
            end
            redProducts={}
        end
        
        if (greenCount >= 3) then 
            for i,v in pairs(greenProducts) do
                sim.removeObject(greenProducts[i])
            end
            greenProducts={}
        end

        if (blueCount >= 3) then 
            for i,v in pairs(blueProducts) do
                sim.removeObject(blueProducts[i])
            end
            blueProducts={}
        end
    end
                    `,

                    //Module 18
                    ``
                    ];
const LAB1RESOURCES = ["Lab1Script.pdf"];
const LAB1GOAL = "At the end of this lab you will have a completed scene in which products coming down a conveyor belt are identified as a certain class of product. You will create a robot arm capable of removing these items to a specific location.";
const LAB1LEARNINGOUTCOMES = [  "Importing models",
                                "Using vision sensor to product types by color",
                                "Manipulation of revolute joints",
                                "Programmatically create and modify shapes",
                                "Basics of inverse kinematics to dynamically control jointed models",
                                "Setting inverse kinematic waypoints and paths"];
const LAB1QUIZ = [
    {
        // Multiple choice question
        question: "What is the correct API call that returns the handle of the object <b>Ball</b> in the scene?",
        // Choices
        choices: ["sim.objectHandle('Ball')","object_handle('Ball')", "sim.getObjectHandle('Ball')", "sim.object('Ball').handle"],
        // Index of answer
        answer: 2,
        explanation: "sim.getObjectHandle() can be passed a string of the object's name and returns it's ID" 
    },
    {
        // Multiple choice question
        question: "Inverse kinematics is the process of:",
        // Choices
        choices: ["Calculating joint child hitboxes","Calculating joint parameters", "Calculating distance from target to tip", "Calculating tip position from joint parameters"],
        // Index of answer
        answer: 1,
        explanation: "Inverse kinematics is the process of calculating joint parameters to move an end-effector (tip) to a desired position. (FYI: Calculating tip position from joint parameters is known as forward kinematics!)"
    },
    {
        // Multiple choice question
        question: "What is the correct API call that pauses the execution of a thread for <b>5 seconds</b>:",
        // Choices
        choices: ["simulationWait(5)","sim.sleep(5)", "sim.pause(5)", "sim.wait(5)"],
        // Index of answer
        answer: 3,
        explanation: "Calling the function sim.wait() and passing it a number will wait for that amount of time before proceeding with synchronous execution of the script"
    }
]

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
    `
<b>Floor Size:</b>
    X: 15
    Y:15

<b>Resizable Floor Script:</b>

    maze = {{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0},
            {0,1,1,1,1,1,1,1,1,1,1,1,1,1,0},
            {0,1,1,0,0,1,0,0,0,1,0,0,0,1,0},
            {0,1,1,1,0,1,0,1,0,1,0,1,0,1,0},
            {0,1,0,1,0,1,0,1,0,0,0,1,0,1,0},
            {0,1,0,1,0,1,0,1,1,1,1,1,0,1,0},
            {0,1,0,1,0,0,0,1,0,0,0,1,0,1,0},
            {0,1,0,1,1,1,1,1,0,1,0,1,0,1,0},
            {0,1,0,0,0,0,0,0,0,1,0,1,0,1,0},
            {0,1,0,1,1,1,1,1,1,1,0,1,0,1,0},
            {0,1,0,1,0,0,0,1,0,0,0,1,0,1,0},
            {0,1,0,1,0,1,0,1,1,1,1,1,0,1,0},
            {0,1,0,0,0,1,0,0,0,0,0,0,0,1,0},
            {0,1,1,1,1,1,1,1,1,1,1,1,1,1,0},
            {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}}

            width = 15
            height = 15
            size = {1, 1, 1}

            for i=1,width,1 do
                for j=1,height,1 do
                    if (maze[i][j] == 1) then

                        handle = sim.createPureShape(0, 8, size, 10, nil)
                        sim.setObjectPosition(handle, -1, {i-8.0, j-8.0, 0.5})
                        sim.setObjectSpecialProperty(handle, sim.objectspecialproperty_detectable_all)
           
                    end
                end
            end
            
    `,

    // Module 3
    `
    
<b>Disc Size:</b>
    X: 1

<b>Position Disc (Relative to World):</b>
    X: -3
    Y: -6
    Z: 2.0e-3
    `,

    // Module 4
    `
<b>Rotate Robotnik Summit XL (Relative to Own Frame):</b>
    Z: 90

<b>Position Front Proximity Sensor (Relative to Parent Frame):</b>
    X: 3.0456e-01
    Y: 1.6570e-04
    Z: 4.7439e-02

<b>Rotate Front Proximity Sensor (Relative to Own Frame):</b>
    X: 270

<b>Position Left Proximity Sensor (Relative to Parent Frame):</b>
    X: 2.6085e-01
    Y: 1.5107e-01
    Z: -2.245e-04

<b>Position Right Proximity Sensor (Relative to Parent Frame):</b>
    X: 2.6116e-01
    Y: -1.4912e-01
    Z: 2.1708e-04

<b>Rotate Left Proximity Sensor (Relative to Own Frame):</b>
    Y: 270

<b>Rotate Right Proximity Sensor (Relative to Own Frame):</b>
    Y: 90
    `,

    // Module 5
    `    
<b>Front Proximity Sensor Volume:</b>
    Range: 1.2
    Angle: 20

<b>Left and Right Proximity Sensor Volume:</b>
    Range: 0.6

<b>Rotate Vision Sensor (Relative to Own Frame):</b>
    X: 180

<b>Vision Sensor Resolution:</b>
    X: 1
    Y: 1

<b>Vision Sensor Far Clipping Plane:</b>
    0.5
    `,

    // Module 6
    `
<b>Robotnik Summit XL Script:</b>

    while true do
        drive(0)
    end


    ...

    function drive(direction)
        offset=direction*speed

        if (direction > 1 or direction < -1) then return end
            if (direction >= 0) then
                offset=-offset*2
                fl=speed
                fr=speed+offset
                br=speed+offset
                bl=speed
            else
                offset=offset*2
                fl=speed+offset
                fr=speed
                br=speed
                bl=speed+offset
            end
        fr = -fr
        br = -br
        sim.setJointTargetVelocity(motorHandles[1],fl)
        sim.setJointTargetVelocity(motorHandles[2],fr)
        sim.setJointTargetVelocity(motorHandles[3],br)
        sim.setJointTargetVelocity(motorHandles[4],bl)
    end

    ...

	function stop()
        for i=1,4,1 do
            sim.setJointTargetVelocity(motorHandles[i],0)
        end
    end
    `,

    // Module 7
    `
<b>Robotnik Summit XL Script:</b>

    sensorHandles={-1,-1,-1,-1}
    sensorHandles[1]=sim.getObjectHandle('frontProximity')
    sensorHandles[2]=sim.getObjectHandle('leftProximity')
    sensorHandles[3]=sim.getObjectHandle('rightProximity')
    sensorHandles[4]=sim.getObjectHandle('visionDown') 

    wall=1 
    direction=0
    wallDist={0.350, 0.355}
    turningRadius=0.25

    ...

    function followWall(wall)
        if (wall == 1) then
            if (rightBlocked == 1) then
                if (rightDist < wallDist[1]) then
                    direction = -turningRadius
                    elseif (rightDist > wallDist[2]) then
                    direction = turningRadius
                else 
                    direction = 0
                end
            end
        end
        if (wall == -1) then
            if (leftBlocked == 1) then
                if (leftDist < wallDist[1]) then
                    direction = turningRadius
                elseif (leftDist > wallDist[2]) then
                    direction = -turningRadius
                else 
                    direction = 0
                end
            end
        end
    end
    `,

    // Module 8
    `
<b>Robotnik Summit XL Script:</b>

    if (leftBlocked == 0 or rightBlocked==0) then follow90()
    else followWall(wall) end

    ...

    function follow90()
        drive(0)
        simulationWait(2/speed)
        stop()
        
        leftBlocked,leftDist=sim.checkProximitySensor(sensorHandles[2],sim.handle_all)
        rightBlocked,rightDist=sim.checkProximitySensor(sensorHandles[3],sim.handle_all)
        
        if (leftBlocked == 1) then d=1 elseif (rightBlocked == 1) then d=-1 else d=1 end 

        drive(d*0.5)
        simulationWait(12/speed)
        drive(0)
        simulationWait(1/speed)
    end
    `,

    // Module 9
    `
<b>Robotnik Summit XL Script:</b>

    frontBlocked,frontDistance=sim.checkProximitySensor(sensorHandles[1],sim.handle_all)

    if (frontBlocked==1 and frontDist <= 0.3) then turn180()
    elseif (leftBlocked == 0 or rightBlocked==0) then follow90()
    else followWall(wall) end 
        
    ...

    function turn180()
        stop()
        sim.wait(0.5)
        drive(1)
        sim.wait(13)
    end
    `,

    // Module 10
    `
<b>Robotnik Summit XL Script:</b>
    
    sim.readVisionSensor(visionSensor)

    image = sim.getVisionSensorCharImage(visionSensor,0,0,1,1)

    redValue = tonumber(string.byte(image, 1))

    if (redValue >250) then stop() print("Finished!") return end
    `,

    // Module 11
    `
<b>Robotnik Summit XL Script:</b>

    if (frontBlocked==0) and 
        (wall==1 and leftBlocked==0) or
        (wall==-1 and rightBlocked==0)) then

        followWall(wall)
    else
        follow90()
    end
    `,

    // Module 12
    ""];
const LAB2RESOURCES = ["Lab2Script.pdf", "mazes.txt"];
const LAB2GOAL = ["In this lab you will create a 4-wheeled mobile robot equipped with sensors to automate movement and obstacle avoidance. This robot will be placed in a maze and programmed with the 'Wall-Following Algorithm' to traverse the maze until it finds the end."]
const LAB2LEARNINGOUTCOMES = [  "Attaching sensor to model body",
                                "Reading from proximity and vision sensors",
                                "Programatically produce an environment (maze)",
                                "'Wall-Following Algorithm' for maze traversal",
                                "Using joint explicit handling to drive vehicle"]
const LAB2QUIZ = [
    {
        // Multiple choice question
        question: "Using the <b>Left Wall Following Algorithm</b>, which path should the robot take at an intersection that is blocked to the left but is not blocked ahead and not blocked on the right.",
        // Choices
        choices: ["Go straight","Turn around", "Turn right"],
        // Index of answer
        answer: 0,
        explanation: "Using the <b>Left Wall Following Algorithm</b>, the robot should always take the left most path. This includes turning around counter-clockwise in the case of a dead end." 
    },
    {
        // Multiple choice question
        question: "The property necessary for an object to be read by a vision sensor is:",
        // Choices
        choices: ["Detectable","Renderable", "Collidable", "Textured"],
        // Index of answer
        answer: 1,
        explanation: "An image must be rendered by a vision sensor which is essentially a camera and therefore an object must be renderable."
    },
    {
        // Multiple choice question
        question: "Inverse kinematics is the process of:",
        // Choices
        choices: ["Calculating joint child hitboxes","Calculating joint parameters", "Calculating distance from target to tip", "Calculating tip position from joint parameters"],
        // Index of answer
        answer: 1,
        explanation: "Inverse kinematics is the process of calculating joint parameters to move an end-effector (tip) to a desired position. (FYI: Calculating tip position from joint parameters is known as forward kinematics!)"
    }
]









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
const LAB3QUIZ = [];








const LAB4 = "Garbage Collection Simulation";
const LAB4LINKS = ["-L3d204Wvq4", "I6J5L3gZ9Lg", "v2NCKhxQ7us",
                    "Eksrad83g_c", "k8rkNIsHZKs", "fWTaa_GDAHM",
                    "jr09XRXSh5E", "FqriIs13rmo", "mBK1mLqPqnc",
                    "xdbjaSy_T0Q", "kaieqhQd3BE", "Oqsc8zVWcPI",
                    "0OAOnbFXXg0", "bJ5j2yVXNSk", "vpAr7QQLQZM"];
const LAB4NAMES = ["Introduction", "Building the Environment", "Building the Robot",
                    "Adding Vision Sensors", "Coding the Vision Sensors", "Adding Proximity Sensors",
                    "Configuring Sensors", "Coding the Proximity Sensors", "Gripper and Robotic Arm","Path Dummies", "Completing Robot Pickup", "Dropping Trash in Receptacle",
                    "Dropping Trash", "Returning to Trash Pickup Area", "Conclusion"];
const LAB4CODE = [  
    // Module 1
    ``, 

    // Module 2
    ``,

    // Module 3
    ``,

    // Module 4
    `
<b>YouBot Script:</b>

    wheelJoints = {-1, -1, -1, -1}

    wheelJoints[1] = sim.getObjectHandle('rollingJoint_fl')
    wheelJoints[2] = sim.getObjectHandle('rollingJoint_rl')
    wheelJoints[3] = sim.getObjectHandle('rollingJoint_rr')
    wheelJoints[4] = sim.getObjectHandle('rollingJoint_fr')
    
    
    leftVision = sim.getObjectHandle("leftVisionUnder")
    rightVision = sim.getObjectHandle("rightVisionUnder")
    
    function drive(fbVelocity, lrVelocity, rotVelocity)

        sim.setJointTargetVelocity(wheelJoints[1], -fbVelocity-lrVelocity-rotVelocity)
        
        sim.setJointTargetVelocity(wheelJoints[2], -fbVelocity+lrVelocity-rotVelocity)
        
        sim.setJointTargetVelocity(wheelJoints[3], -fbVelocity-lrVelocity+rotVelocity)
        
        sim.setJointTargetVelocity(wheelJoints[4], -fbVelocity+lrVelocity+rotVelocity)
    end
    `,
    // Module 5
    `
<b>YouBot Script:</b>

    while true do
        
        sim.readVisionSensor(leftVision)
        sim.readVisionSensor(rightVision)

        imageBufferLeft = sim.getVisionSensorCharImage(leftVision,0,0,1,1)

        leftRed = tonumber(string.byte(imageBufferLeft, 1))
        leftGreen = tonumber(string.byte(imageBufferLeft, 2))
        leftBlue = tonumber(string.byte(imageBufferLeft, 3))

        imageBufferRight = sim.getVisionSensorCharImage(rightVision,0,0,1,1)

        rightRed = tonumber(string.byte(imageBufferRight, 1))
        rightGreen = tonumber(string.byte(imageBufferRight, 2))
        rightBlue = tonumber(string.byte(imageBufferRight, 3))


        if (leftRed < 50 and leftGreen < 50 and leftBlue < 50) then
            drive(0,0,1)
            sim.wait( (13.085) + (sim.getRandom()*6.0425))
            drive(1, 0, 0)
            sim.wait(5)
        elseif (rightRed < 50 and rightGreen < 50 and rightBlue < 50) then
            drive(0,0,-1)
            sim.wait( (13.085) + (sim.getRandom()*6.0425))
            drive(1, 0, 0)
            sim.wait(5)
        else 
            drive(1, 0, 0)
            
        end
    end
    `,
        // Module 6
    `
    <b>YouBot Script:</b>
    
    
        
        `,
                // Module 7
    `
    <b>YouBot Script:</b>
    
    
        
        `,
            // Module 8
    `
    <b>YouBot Script:</b>
    
    
        
        `,
            // Module 9
    `
    <b>YouBot Script:</b>
    
    
        
        `,
            // Module 10
    `
    <b>YouBot Script:</b>
    
    
        
        `,
            // Module 11
    `
    <b>YouBot Script:</b>
    
    
        
        `,
                    // Module 12
    `
    <b>YouBot Script:</b>
    
    
        
        `,
                    // Module 13
    `
    <b>YouBot Script:</b>
    
    
        
        `,
                    // Module 14
    `
    <b>YouBot Script:</b>
    
    
        
        `,
                    // Module 15
    `
    <b>YouBot Script:</b>
    
    
        
        `
];
const LAB4RESOURCES = [];
const LAB4GOAL = "In this lab you will be creating a simulation of a mobile garbage collection robot. This robot will be able to autonomously move about an area, detecting where there is trash, and bringing it to the correct receptacle. This simulation has many other implications such as autonomous robots that can reorganize items and collect information about an area.";
const LAB4LEARNINGOUTCOMES = ["YouBot - A mobile robot with robotic arm using inverse kinematics",
                                "Gripping items and controlling a robotic arm",
                                "Bounds detection with vision sensors",
                                "Object detection with ray and pyramid type proximity sensors"];
const LAB4QUIZ = [];


const LABS = [  [LAB1, LAB1LINKS, LAB1NAMES, LAB1CODE, LAB1RESOURCES, LAB1GOAL, LAB1LEARNINGOUTCOMES, LAB1QUIZ],
                [LAB2, LAB2LINKS, LAB2NAMES, LAB2CODE, LAB2RESOURCES, LAB2GOAL, LAB2LEARNINGOUTCOMES, LAB2QUIZ],
                [LAB3, LAB3LINKS, LAB3NAMES, LAB3CODE, LAB3RESOURCES, LAB3GOAL, LAB3LEARNINGOUTCOMES, LAB3QUIZ],
                [LAB4, LAB4LINKS, LAB4NAMES, LAB4CODE, LAB4RESOURCES, LAB4GOAL, LAB4LEARNINGOUTCOMES, LAB4QUIZ]];

              