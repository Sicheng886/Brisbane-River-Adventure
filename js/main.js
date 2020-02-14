/*
This script is oringinal work of DECO7180 C01T02: Team History Fan Club

code structure using PIXI.js references the official tutorial from https://github.com/pixijs/pixi.js?utm_source=html5weekly 
*/

$("#report-form").hide();

const viewWidth = $(window).width() * 0.6,
    viewHeight = viewWidth / 4 * 3;

let playerInfo = JSON.parse(sessionStorage.getItem("user-info"));
if (!playerInfo) {
    playerInfo = {
        pname: "Joe Doe",
        face: "img/character/face_yb.png",
        body: "img/character/body.png"
    };
}

// GamaeControl object for game elements managing
const gameControl = {
    river: [],
    backgroundBuilding: [],
    buildingContainer: null,
    currentBuilding: null,
    actualPosition: 0,
    goalPosition: 0,
    state: null,
    chapter: 0,
    chapterData: null,
    dialogIndex: 0,
    answer: null,
    textOnScreenData: {},
};

createChapterBtn();

updateChapterData(1);

// short names
const Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

// Initial the pixi instance
const app = new Application({
    width: viewWidth,
    height: viewHeight,
    backgroundColor: 0x000000,
    resolution: 1,
});
const mysec = document.getElementById("gameSec");
mysec.append(app.view);

// loading textures
app.loader
    .add([
        "img/cap1.png",
        "img/background.png",
        "img/river.png",
        "img/real-bg.png",
        "img/Toowong.png",
        playerInfo.face,
        playerInfo.body,
        "img/start.png",
        "img/continue.png",
        "img/end.png",
    ])
    .load((loader, resources) => {
        const bg = new Sprite(resources["img/background.png"].texture);
        bg.width = viewWidth;
        bg.height = viewHeight;
        bg.x = 0;
        bg.y = 0;
        app.stage.addChild(bg);
        gameControl.background = bg;
        for (let i = 0; i < 2; i++) {
            const river = new Sprite(resources["img/river.png"].texture);
            river.width = viewWidth;
            river.height = viewHeight / 3;
            river.anchor.x = 0;
            river.anchor.y = 1;
            river.x = (i - 1) * viewWidth;
            river.y = viewHeight;
            app.stage.addChild(river);
            gameControl.river.push(river);
        }

        for (let i = 0; i < 2; i++) {
            const backgroundBuilding = new Sprite(resources["img/real-bg.png"].texture);
            backgroundBuilding.width = viewWidth;
            backgroundBuilding.height = viewHeight;
            backgroundBuilding.x = (i - 1) * viewWidth;
            backgroundBuilding.y = 0;
            app.stage.addChild(backgroundBuilding);
            gameControl.backgroundBuilding.push(backgroundBuilding);
        }

        const buildingContainer = new Container();
        buildingContainer.position.set(0, 0);
        app.stage.addChild(buildingContainer);
        gameControl.buildingContainer = buildingContainer;

        const currentBuilding = new Sprite(resources["img/Toowong.png"].texture);
        currentBuilding.width = viewWidth;
        currentBuilding.height = viewHeight;
        currentBuilding.position.set(viewWidth, 0);
        buildingContainer.addChild(currentBuilding);
        gameControl.currentBuilding = currentBuilding;

        const boat = new Container();
        boat.position.set(viewWidth / 2, viewHeight * 3 / 4);
        app.stage.addChild(boat);
        boat.visible = true;
        boat.rotateSpeed = 0.0003;
        boat.ySpeed = 0.08;
        gameControl.boat = boat;

        const player = new Container();
        player.position.set(-viewWidth / 7, 0);
        boat.addChild(player);

        const playerbody = new Sprite(resources[playerInfo.body].texture);
        playerbody.width *= 0.3 * viewWidth / 600;
        playerbody.height *= 0.3 * viewWidth / 600;
        playerbody.anchor.x = 0.5;
        playerbody.anchor.y = 0.5;
        playerbody.position.set(0, 0);
        player.addChild(playerbody);

        const playerhead = new Sprite(resources[playerInfo.face].texture);
        playerhead.width *= 0.3 * viewWidth / 600;
        playerhead.height *= 0.3 * viewWidth / 600;
        playerhead.anchor.x = 0.5;
        playerhead.anchor.y = 0.5;
        playerhead.position.set(-viewWidth / 150, -viewHeight / 15);
        player.addChild(playerhead);

        const myCap = new Sprite(resources["img/cap1.png"].texture);
        myCap.height *= 0.4 * viewWidth / 600;
        myCap.width *= 0.4 * viewWidth / 600;
        myCap.position.set(0, 0);
        myCap.anchor.x = 0.5;
        myCap.anchor.y = 0.5;
        boat.addChild(myCap);

        gameControl.textOnScreenData.contentStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fill: "black",
            wordWrap: true,
            wordWrapWidth: 250,
            align: 'left'
        });

        const playerTextCon = new Container();
        //container for player dialog box
        playerTextCon.position.set(-viewWidth / 2.2, -viewHeight / 1.8);
        boat.addChild(playerTextCon);
        gameControl.textOnScreenData.playerContainer = playerTextCon;
        playerTextCon.visible = false;

        const playerTextBg = new Graphics();
        playerTextBg.beginFill(0xFFFFFF);
        playerTextBg.drawRect(0, 0, 256, 256);
        playerTextBg.endFill();
        playerTextCon.addChild(playerTextBg);

        const playerText = new Text("", gameControl.textOnScreenData.contentStyle);
        playerText.position.set(3, 3);
        gameControl.textOnScreenData.playerText = playerText;
        playerTextCon.addChild(playerText);

        const capTextCon = new Container();
        //container for captain dialog box
        capTextCon.position.set(0, -viewHeight / 1.8);
        boat.addChild(capTextCon);
        capTextCon.visible = false;
        gameControl.textOnScreenData.capContainer = capTextCon;

        const capTextBg = new Graphics();
        capTextBg.beginFill(0xFFFFFF);
        capTextBg.drawRect(0, 0, 256, 256);
        capTextBg.endFill();
        capTextCon.addChild(capTextBg);

        const capText = new Text("", gameControl.textOnScreenData.contentStyle);
        capText.position.set(3, 3);
        gameControl.textOnScreenData.capText = capText;
        capTextCon.addChild(capText);

        const start = new Sprite(resources["img/start.png"].texture);
        start.anchor.x = 0.5;
        start.anchor.y = 0.5;
        start.position.set(viewWidth / 2, viewHeight / 2);
        app.stage.addChild(start);
        gameControl.startMark = start;

        const continueSign = new Sprite(resources["img/continue.png"].texture);
        continueSign.anchor.x = 0.5;
        continueSign.anchor.y = 0.5;
        continueSign.position.set(viewWidth / 2, viewHeight / 2);
        app.stage.addChild(continueSign);
        continueSign.visible = false;
        gameControl.continueMark = continueSign;

        const endScene = new Container();
        app.stage.addChild(endScene);
        endScene.visible = false;
        gameControl.endMark = endScene;

        const end = new Sprite(resources["img/end.png"].texture);
        end.anchor.x = 0.5;
        end.anchor.y = 0.5;
        end.position.set(viewWidth / 2, viewHeight / 2);
        endScene.addChild(end);

        gameControl.state = movingLoop;

        gameControl.actualPosition = 0;
        gameControl.goalPosition = 0;

        mysec.addEventListener('DOMMouseScroll', wheel, false);
        mysec.onmousewheel = document.onmousewheel = wheel;

        mysec.addEventListener('click', function () {
            gameControl.dialogIndex += 1;
        });

        //add game looping function, similar function as request animation frame
        app.ticker.add(delta => gameLoop(delta));
    });

function gameLoop(delta) {
    //main control loop, controle the scene by chaning the gameControl.state
    gameControl.state(delta);
}

function movingLoop(delta) {
    //this loop is for moving the boat during the journey
    moveForward(0, 200, talkingLoop);
}

function talkingLoop(delta) {
    //this loop using to display dialog during journey

    staticRotate(gameControl.boat, 0.05);

    //keep two dialog box vertical
    gameControl.textOnScreenData.playerContainer.rotation = -gameControl.boat.rotation;
    gameControl.textOnScreenData.capContainer.rotation = -gameControl.boat.rotation;

    //changing content of dialog box by clicking
    if (gameControl.chapterData.content && gameControl.dialogIndex < gameControl.chapterData.content.length) {
        if (gameControl.chapterData.content[gameControl.dialogIndex]["type"] == "cap") {
            gameControl.textOnScreenData.capText.text = getPersonalSentence(gameControl.chapterData.content[gameControl.dialogIndex]["word"]);
            gameControl.textOnScreenData.capContainer.visible = true;
            gameControl.textOnScreenData.playerContainer.visible = false;
        } else {
            gameControl.textOnScreenData.playerText.text = getPersonalSentence(gameControl.chapterData.content[gameControl.dialogIndex]["word"]);
            gameControl.textOnScreenData.playerContainer.visible = true;
            gameControl.textOnScreenData.capContainer.visible = false;
        }
    } else {
        gameControl.textOnScreenData.playerContainer.visible = false;
        gameControl.textOnScreenData.capContainer.visible = false;
        $("#pic-display").attr("class", "flipped");
        $("#cover").attr("class", "flipped");

        gameControl.state = guessingLoop;
    }
}

function guessingLoop(delta) {
    //this loop runs when user play guessing with pictures
    staticRotate(gameControl.boat, 0.05);
    gameControl.textOnScreenData.playerContainer.rotation = -gameControl.boat.rotation;
    gameControl.textOnScreenData.capContainer.rotation = -gameControl.boat.rotation;
    gameControl.textOnScreenData.capContainer.visible = true;
    gameControl.textOnScreenData.playerContainer.visible = false;

    if (gameControl.answer) {
        if (gameControl.answer === "false") {
            gameControl.textOnScreenData.capText.text = getPersonalSentence(gameControl.chapterData.game[2]["word"]);
        } else if (gameControl.answer === "true") {
            gameControl.textOnScreenData.capText.text = getPersonalSentence(gameControl.chapterData.game[1]["word"]);
            setTimeout(function () {
                gameControl.answer = "done";
                gameControl.dialogIndex = 0;
            }, 2000);
        } else if (gameControl.dialogIndex == 0) {
            gameControl.textOnScreenData.capText.text = getPersonalSentence(gameControl.chapterData.game[3]["word"]);
        } else {
            gameControl.textOnScreenData.playerContainer.visible = false;
            gameControl.textOnScreenData.capContainer.visible = false;
            gameControl.answer = null;
            gameControl.startMark = gameControl.continueMark;
            gameControl.startMark.visible =true;
            gameControl.goalPosition = gameControl.actualPosition;
            gameControl.state = afterGuessingLoop;
        }
    } else {
        gameControl.textOnScreenData.capText.text = getPersonalSentence(gameControl.chapterData.game[0]["word"]);
    }
}

function afterGuessingLoop(delta) {
    //this loop si for landmark to move out of the screen
    moveForward(200, 360, resetLoop);
}

function resetLoop(delta) {
    //this loop si for reset the game to enter the other chapter
    resetGame();
}


function moveForward(minRange, maxRange, nextFunction) {
    //main functions control moving
    if (gameControl.actualPosition > minRange+20) {
        gameControl.startMark.visible = false;
    }

    let distance = gameControl.goalPosition - gameControl.actualPosition;
    if (Math.abs(distance) > 2) {
        gameControl.actualPosition += distance > 0 ? 1 : -1;
        gameControl.boat.rotation = Math.sin(gameControl.actualPosition / 10) / 20;
        gameControl.boat.x += Math.sin(gameControl.actualPosition / 8) * 2;
        gameControl.river.forEach(pic => {
            pic.x -= distance > 0 ? 8 : -8;
            if (pic.x < -viewWidth) {
                pic.x += 2 * viewWidth;
            } else if (pic.x > viewWidth) {
                pic.x -= 2 * viewWidth;
            }
        });

        gameControl.backgroundBuilding.forEach(pic => {
            pic.x -= distance > 0 ? 4 : -4;
            if (pic.x < -viewWidth) {
                pic.x += 2 * viewWidth;
            } else if (pic.x > viewWidth) {
                pic.x -= 2 * viewWidth;
            }
        });

        gameControl.currentBuilding.x -= distance > 0 ? 4 : -4;

    } else if (gameControl.actualPosition <= maxRange) {
        staticRotate(gameControl.boat, 0.05);
    }
    if (gameControl.actualPosition > maxRange) {
        if (Math.abs(gameControl.boat.rotation) > 0.01) {
            gameControl.boat.rotation -= gameControl.boat.rotation > 0 ? 0.0001 : -0.0001;
        } else {
            gameControl.dialogIndex = 0;
            gameControl.state = nextFunction;
        }
    }
}

function wheel(event) {
    //event function to capture the user wheel input
    if (gameControl.goalPosition >= 0 || event.wheelDelta < 0) {
        //stop boat going back before start
        gameControl.goalPosition += -event.wheelDelta / 240;
    }
}

function createChapterBtn() {
    //create chapter buttons
    const chapterSection = document.getElementById("chapter");
    for (let i = 0; i < 4; i++) {
        const chapBtn = document.createElement("button");
        chapBtn.id = `c${i+1}`;
        chapBtn.className = "chapter-btn";
        chapBtn.innerHTML = `Chapter ${i+1}`;
        chapterSection.appendChild(chapBtn);
    }
}

async function updateChapterData(chapter) {
    /*
    Request story script from local server then decode data and put into chaoterData ojbect

    Parameters: 
        chapter(int): the chapter number
    */
    const chapterData = await fetchChapterData(chapter);
    console.log(chapterData);
    try {
        gameControl.chapterData = chapterData;
        gameControl.chapter = chapter;
        gameControl.dialogIndex = 0;
        const photoArray = chapterData.photos;
        $("#pic-display img").each(function () {
            const photoData = photoArray.shift();
            $(this).attr({
                "src": photoData["url"],
                "data-type": photoData["type"]
            });
        });
        $(".chapter-btn").each(function () {
            $(this).attr("class", "chapter-btn deactive");
        });
        $(`.chapter-btn:nth-child(${chapter})`).attr("class", "chapter-btn");


        if (gameControl.buildingContainer) {
            gameControl.buildingContainer.removeChild(gameControl.currentBuilding);
            const loader = new PIXI.loaders.Loader();
            loader.add(gameControl.chapterData.landMark).load((loader, resources) => {
                const currentBuilding = new PIXI.Sprite(resources[gameControl.chapterData.landMark].texture);
                currentBuilding.width = viewWidth;
                currentBuilding.height = viewHeight;
                currentBuilding.position.set(viewWidth, 0);
                gameControl.buildingContainer.addChild(currentBuilding);
                gameControl.currentBuilding = currentBuilding;
            });
            gameControl.endMark.visible = false;
        }

    } catch (error) {
        alert(error + ": Please contact with developers.");
    }
}

async function fetchChapterData(chapter) {
    /*
    fetch data from server using fetch()
    Parameters: 
        chapter(int): the chapter number
    Returns: 
        (Promise)<json>: the chapter data json file
    */
    const url = "getContents.php";
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                chapter: chapter,
                pname: playerInfo.pname,
            }),
        });
        if (response.ok) {
            const jsonRes = await response.json();
            return jsonRes;
        }
        throw new Error("connet failed! Please try to refresh the page.");
    } catch (error) {
        console.log(error);
        alert(error);
    }
}

function staticRotate(boat, boundary) {
    /*
    boat (PIXI.container): the boat container
    boundary (float): the bondary for changing direction
    */
    boat.rotation += boat.rotateSpeed;
    // only rotate when head is above or below the water surface
    if ((boat.rotation * boat.rotateSpeed) > 0) {
        boat.y += boat.ySpeed;
    }
    // change direction when hit the boundary
    if (Math.abs(boat.rotation) > boundary) {
        boat.ySpeed = -boat.ySpeed;
        boat.rotateSpeed = -boat.rotateSpeed;
    }
}

function resetGame(chapter = null) {
    //a simple function to set every value to the default value when chapters start.
    gameControl.textOnScreenData.playerContainer.visible = false;
    gameControl.textOnScreenData.capContainer.visible = false;
    gameControl.answer = null;
    if (chapter) {
        gameControl.chapter = chapter;
    } else {
        gameControl.chapter += 1;
    }
    if (gameControl.chapter < 5) {
        gameControl.actualPosition = 0;
        gameControl.goalPosition = 0;
        $("#pic-display").attr("class", "flipback");
        $("#cover").attr("class", "flipback");
        $("#pic-display img").each(function () {
            $(this).css("border", "4px solid #DAC9A6");
        });
        updateChapterData(gameControl.chapter);
        gameControl.state = movingLoop;
    }
    else {
        gameControl.endMark.visible = true;
    }
}

async function uploadReport(report) {
    //This is a async function to upload error report for team members to maintain.
    try {
        const res = await fetch("report-handler.php", {
            method: "POST",
            body: JSON.stringify(report),
        });
        if (res.ok) {
            const jsonRes = await res.json();
            return jsonRes;
        }
        throw new Error("upload failed, connect error");
    } catch (error) {
        alert(error);
    }
}


function getPersonalSentence(word) {
    const pname = playerInfo.pname;
    // RegExp to replace "pname" keyword into real player nickname
    return word.replace(/\bpname\b/g, pname);
}


$("#reset-btn").click(function () {
    sessionStorage.removeItem("user-info");
    window.location.href = "index.html";
})

$(".chapter-btn").click(function () {
    gameControl.goalPosition = 0;
    gameControl.actualPosition = 0;
    let chapter = $(this).attr("id");
    chapter = chapter.split("");
    chapter = parseInt(chapter[1]);
    resetGame(chapter);
});

$("#pic-display img").click(function () {
    gameControl.answer = $(this).attr("data-type");
    $("#pic-display img").each(function () {
        $(this).css("border", "4px solid #DAC9A6");
    });
    if (gameControl.answer == 'true') {
        $(this).css("border", "4px solid green");
    } else {
        $(this).css("border", "4px solid red");
    }

});

$("#report-btn").click(function () {
    $("#report-form").show();
    $("#form-chapter").val(gameControl.chapter);
    for (let i = 0; i < 4; i++) {
        const picsrc = $(`#pic-display img:nth-child(${i+2})`).attr("src");
        $(`#form-pic${i+1}`).val(picsrc);
    }
});

$("#close-btn").click(function () {
    $("#report-form").hide();
})

$("#report-submit-btn").click(async function (event) {
    event.preventDefault();
    const report = {
        chapter: gameControl.chapter,
        pic: [],
        description: $("#form-discription").val(),
    }
    for (let i = 0; i < 4; i++) {
        report.pic.push($(`#form-pic${i+1}`).val());
    }
    const response = await uploadReport(report);
    alert(`${response.title}\n${response.content}`);
    $("#report-form").hide();
});