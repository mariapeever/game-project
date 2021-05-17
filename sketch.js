/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/

gameProject 7 (mpeev001)

The scene of the game is composed of randomly-positioned elements to generate a “new” scene on startGame(). The game features sound for jumping and loss of life tokens on contact with a snake or falling into a canyon and carefully drawn graphics to be visually attractive. Other extensions added include platforms and enemies.

Platforms resemble rocks, positioned just below the x position of a specified number of random strawberries. The position of these strawberries is adjusted to be relative to the platform rather than the ground so that they can only be collected from a platform. Function createPlatforms() contains a constructor object with three methods -  draw() draws a platform template, which is utilised in startGame() to create multiple platforms in a for loop – each with a unique set of random values for positioning as well as length and height. checkContact() checks if the character is standing on a platform and checkPlatformAhead() defines the area of a platform to prevent the character from passing through it. 

Enemies are created using the constructor function Enemy() and resemble snakes, which are randomly positioned and crawling in the opposite direction of the character. In contact with a snake, life tokens are reduced by 1 and startGame() re-starts the game. 

As a result of building the extensions, I have learnt to use constructer objects (eg. for platforms) and constructor functions (eg. for enemies), position objects randomly or relative to other objects, create random variations of an object and add sound and interaction.

*/

var jumpSound;
var endSound;

var game_score;
var flagpole;
var lives;

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isContact;

var gameCanvas;

var mountains;
var mountains_count;

var clouds;
var clouds_count;

var trees_x;
var trees_scale;
var trees_count;

var canyons;
var canyons_count;

var collectables;
var collectables_count;

var platforms;
var platforms_count;

var enemies;
var enemies_count;

function preload()
{
    soundFormats('mp3', 'wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    endSound = loadSound('assets/end.wav');
    endSound.setVolume(0.1);
    
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    lives = 4;
    
    startGame();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    game_score = 0;
    
    gameCanvas = 10000;
    
    // Trees
    trees_count = gameCanvas/200;
    
    trees_x = [];
    for(var i = 0; i < trees_count; i++)
    {
        trees_x.push(random(200 + i * 200, 
                            400 + i * 200));    
    }
    
    trees_scale = [];
    for(var i = 0; i < trees_count; i++)
    { 
        var tree_scale = random(0.5, 1.5);
        trees_scale.push(tree_scale);
    }
    
    // Clouds
    clouds_count = gameCanvas/300;
    
    clouds = [];
    for(var i = 0; i < clouds_count; i++)
    {
        var cloud = {posX: random(300 + i * 300, 
                                  600 + i * 300), 
                     posY: random(80, 180), 
                     scale: random(0.7, 1.0), 
                     speed: random(0.1, 0.3)};
        clouds.push(cloud);
    }
    
    // Mountains
    mountains_count = gameCanvas/600;
    
    mountains = [];
    for(var i = 0; i < mountains_count; i++)
    { 
        var mountain = {posX: random(0, gameCanvas), 
                        height: random(150, 250), 
                        width: random(400, 600), 
                        scale: random(0.8, 1.0)};
        mountains.push(mountain);
    }
    
    // Canyons
    canyons_count = gameCanvas/600;

    canyons = [];
    for(var i = 0; i < canyons_count; i++)
    { 
        var canyon = {posX: random(gameChar_x + 200 + i * 600, 
                                   gameChar_x + 600 + i * 600), 
                      width: random(140, 165)};
        canyons.push(canyon);
    }
    
    // Collectables (strawberries)
    collectables_count = gameCanvas/200;

    collectables = [];
    for(var i = 0; i < collectables_count; i++)
    { 
        var collectable = {posX: random(200 + i * 200, 
                                        400 + i * 200), 
                           posY: random(floorPos_y - 60, 
                                        floorPos_y - 120), 
                           scale: random(0.7, 1.2),
                           isFound: false};
        collectables.push(collectable);
    }
    
    // Collectable (strawberry) counter
    gameScoreBackground = {posX: 50, 
                           posY: 50, 
                           scale: 0.6, 
                           isFound: false};
    
    // Flagpole
    flagpole = {x_pos: gameCanvas, 
                isReached: false};
    
    // Decrement lives
    lives -= 1;
    if(lives < 3)
    {
        endSound.play();
    }
    
    // Platforms
    platforms_count = gameCanvas/400;
    
    platforms = [];
    for(var i = 0; i < platforms_count; i++)
    {  
        var length = random(90, 120);
        var height = random(35, 40);
        
        var pl_y = floorPos_y - height/2;
        
        var randomCollectable = collectables[Math.floor(random(0, collectables.length - 1))];
        randomCollectable.posY = pl_y - height/2 - random(180, 190);
        
        var pl_x = randomCollectable.posX - length/2;
        
        for(var j = 0; j < random(0, 2); j++)
        {
            platforms.push(createPlatform(pl_x + random(-j * length/2,
                                                         j * length/2), 
                                          pl_y - (j * height * 0.5,
                                                  j * height * 0.8), 
                                          length,
                                          height));
        }
    }
    
    // Enemies
    enemies_count = gameCanvas/1000;
    
    enemies = [];
    for(var i = 0; i < enemies_count; i++)
    {
        var x = random(0, gameCanvas);
        enemies.push( new Enemy(x, floorPos_y));
    }
    
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
	// Draw clouds.
    
    push();
    translate(scrollPos, 0);
    drawClouds(clouds_count);
    pop();

	// Draw mountains.
    
    push();
    translate(scrollPos, 0);
    drawMountains(mountains_count);
    pop();

	// Draw trees.
    
    push();
    translate(scrollPos, 0);
    drawTrees(trees_x, trees_scale);
    pop();
    
	// Draw canyons.
    
    push();
    translate(scrollPos, 0);
    for(var i = 0; i < canyons.length; i++)
    {  
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);      
    }
    pop();
    
    // Draw platforms
    
    push();
    translate(scrollPos, 0);
    for(i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    pop();
    
    // Draw enemies
    
    push();
    translate(scrollPos, 0);
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw();
    }
    pop();
    
    // Draw collectable items.
    
    push();
    translate(scrollPos, 0);
    for(var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }    
    }
    pop();
    
    // Render flagpole
    
    push();
    translate(scrollPos, 0);
    renderFlagpole();
    pop();
    
    // Check flagpole
    if(!flagpole.isReached)
    {
        checkFlagpole();
    }
    
	// Draw game character.
	
	drawGameChar(gameChar_x, gameChar_y);
    
    // Draw game_score
    
    push();
    drawCollectable(gameScoreBackground);
    fill(255);
    textSize(18);
    textAlign(CENTER);
    text(game_score, 56, 60);
    pop();
    
    // Draw lives
    
    for(var i = 0; i < lives; i++)
    {
        fill(255, 204, 0);
        ellipse(100 + 15 * i, 60, 10);
    }
    
    //Lives
    
    if(gameChar_y > height && lives > 0)
    {
        startGame();
    }
    
    // Game over
    
    if(lives < 1)
    {
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        fill(255);
        textSize(36);
        textAlign(CENTER);
        text("Game over. Press space to continue.", width/2, height/2);
        return;
    }
    
    // Level complete
    
    if(flagpole.isReached)
    {
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        fill(255);
        textSize(36);
        textAlign(CENTER);
        text("Level complete. Press space to continue.", width/2, height/2);
        return;
    }
    
    // Game logic
    
    // Enemy ahead
    
    for(var i = 0; i < enemies.length; i++)
    {
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }
    
    // Platform ahead
    
    for(var i = 0; i < platforms.length; i++)
    {
        if(platforms[i].checkPlatformAhead(gameChar_world_x, gameChar_y))
        {
            gameChar_y -= 10;
        }
    }
    
	// Logic to make the game character move or the background scroll.
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.

    if(gameChar_y < floorPos_y)
    {
        isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
            }
        }
        if(!isContact)
        {
            gameChar_y += 2;
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting)
    {
        gameChar_y += 5;
    }

	// Update real position of gameChar for collision detection.
    
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
    }   

    if(keyCode == 37)
    {
        isLeft = true;
    } 
    else if(keyCode == 39)
    {
        isRight = true;
    } 

    
    if(keyCode == 32 && (gameChar_y == floorPos_y || isContact == true))
    {
        gameChar_y -= 120;
        jumpSound.play();
    } 
    
	console.log("press" + keyCode);
	console.log("press" + key);

}

function keyReleased()
{
    if(keyCode == 37)
    {
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        isRight = false;
    }
    
	console.log("release" + keyCode);
	console.log("release" + key);

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        //face
        fill(255, 224, 198);
        ellipse(gameChar_x, 
                gameChar_y - 60, 
                28, 32); 
        //eyes
        fill(255);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                6);
        fill(38, 197, 255);
        ellipse(gameChar_x - 6, 
                gameChar_y - 60, 
                4);
        fill(0);
        ellipse(gameChar_x - 7, 
                gameChar_y - 60, 
                2);
        //mouth
        fill(229, 153, 128);
        ellipse(gameChar_x - 10, 
                gameChar_y - 51, 
                3, 2);
        // right arm
        fill(255, 224, 198);
        rect(gameChar_x, 
             gameChar_y - 42, 
             18, 8, 
             5);
        //clothes
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 43, 
             24, 26, 
             5);
        //clothes legs top
        rect(gameChar_x - 8, 
             gameChar_y - 23, 
             8, 10, 
             5);
        //legs bottom
        fill(255, 224, 198);
        rect(gameChar_x - 12, 
             gameChar_y - 22, 
             8, 10, 
             5);
        rect(gameChar_x + 2, 
             gameChar_y - 18, 
             10, 8, 
             5);
        //clothes legs bottom
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 22, 
             8, 4, 
             5, 5, 0, 0);
        rect(gameChar_x + 2, 
             gameChar_y - 18,
             6, 8, 
             5, 0, 0, 5);
        //pocket
        fill(215, 0, 0);
        rect(gameChar_x - 14, 
             gameChar_y - 39, 
             8, 18, 
             5);
        //arms
        fill(255, 224, 198);
        rect(gameChar_x - 18, 
             gameChar_y - 42, 
             18, 8, 
             5);
        //helmet
        fill(255, 0, 0);
        rect(gameChar_x - 20, 
             gameChar_y - 76, 
             24, 10, 
             30, 0, 0, 30);
        rect(gameChar_x + 4, 
             gameChar_y - 76, 
             20, 20, 
             0, 30, 30, 0);
        fill(255, 255, 0);
        rect(gameChar_x - 22, 
             gameChar_y - 74, 
             10, 6, 
             30);
        //shoes
        fill(0, 182, 255);
        rect(gameChar_x - 16, 
             gameChar_y - 14, 
             12, 6, 
             4);
        rect(gameChar_x + 12, 
             gameChar_y - 18, 
             6, 12, 
             4);
        //gloves
        ellipse(gameChar_x - 20, 
                gameChar_y - 38, 
                8);
        fill(0, 152, 225);
        ellipse(gameChar_x - 20, 
                gameChar_y - 38, 
                6);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //face
        fill(255, 224, 198);
        ellipse(gameChar_x, 
                gameChar_y - 60, 
                28, 32); 
        //eyes
        fill(255);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                6);
        fill(38, 197, 255);
        ellipse(gameChar_x + 6, 
                gameChar_y - 60, 
                4);
        fill(0);
        ellipse(gameChar_x + 7, 
                gameChar_y - 60, 
                2);
        //mouth
        fill(229, 153, 128);
        ellipse(gameChar_x + 10, 
                gameChar_y - 51, 
                3, 2);
        //left arm
        fill(255, 224, 198);
        rect(gameChar_x - 18, 
             gameChar_y - 42, 
             18, 8, 
             5);
        //clothes
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 43, 
             24, 26, 
             5);
        //pocket
        fill(215, 0, 0);
        rect(gameChar_x + 6, 
             gameChar_y - 39, 
             8, 18, 
             5);
        //clothes legs top
        fill(245, 0, 0);
        rect(gameChar_x + 1, 
             gameChar_y - 23, 
             8, 10, 
             5);
        //legs bottom
        fill(255, 224, 198);
        rect(gameChar_x + 5, 
             gameChar_y - 22, 
             8, 10, 
             5);
        rect(gameChar_x - 13, 
             gameChar_y - 18, 
             10, 8, 
             5);
        //clothes legs bottom
        fill(245, 0, 0);
        rect(gameChar_x + 5, 
             gameChar_y - 22, 
             8, 4, 
             5, 5, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18,
             6, 8, 
             0, 5, 5, 0);
        //arms
        fill(255, 224, 198);
        rect(gameChar_x, 
             gameChar_y - 42, 
             18, 8, 
             5);
        //helmet
        fill(255, 0, 0);
        rect(gameChar_x - 4, 
             gameChar_y - 76, 
             24, 10, 
             0, 30, 30, 0);
        rect(gameChar_x - 24, 
             gameChar_y - 76, 
             20, 20, 
             30, 0, 0, 30);
        fill(255, 255, 0);
        rect(gameChar_x + 12, 
             gameChar_y - 74, 
             10, 6, 
             30);
        //shoes
        fill(0, 182, 255);
        rect(gameChar_x + 6, 
             gameChar_y - 14, 
             12, 6, 
             4);
        rect(gameChar_x - 18, 
             gameChar_y - 18, 
             6, 12, 
             4);
        //gloves
        ellipse(gameChar_x + 20, 
                gameChar_y - 38, 
                8);
        fill(0, 152, 225);
        ellipse(gameChar_x + 20, 
                gameChar_y - 38, 
                6);

	}
	else if(isLeft)
	{
		// add your walking left code
        //face
        fill(255, 224, 198);
        ellipse(gameChar_x, 
                gameChar_y - 60, 
                28, 32);
        //eyes
        fill(255);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                6);
        fill(38, 197, 255);
        ellipse(gameChar_x - 6, 
                gameChar_y - 60, 
                4);
        fill(0);
        ellipse(gameChar_x - 7, 
                gameChar_y - 60, 
                2);
        //mouth
        fill(229, 153, 128);
        ellipse(gameChar_x - 10, 
                gameChar_y - 51, 
                3, 2);
        //body
        fill(255, 224, 198);
        //legs
        rect(gameChar_x - 14, 
             gameChar_y - 9, 
             10, 8, 
             5);
        rect(gameChar_x + 4, 
             gameChar_y - 9, 
             10, 8, 
             5);
        //clothes
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 43, 
             24, 26, 
             5);
        rect(gameChar_x - 12, 
             gameChar_y - 17, 
             10, 8, 
             5, 5, 2, 2);
        rect(gameChar_x + 2, 
             gameChar_y - 17, 
             10, 8, 
             5, 5, 2, 2); 
        rect(gameChar_x - 14, 
             gameChar_y - 9, 
             10, 4,
             2, 2, 0, 0);
        rect(gameChar_x + 4, 
             gameChar_y - 9, 
             10, 4,
             2, 2, 0, 0);
        fill(215, 0, 0);
        rect(gameChar_x - 14, 
             gameChar_y - 39, 
             8, 18, 
             5);
        //arms
        fill(255, 224, 198);
        rect(gameChar_x - 4, 
             gameChar_y - 42, 
             8, 18, 
             5);
        //helmet
        fill(255, 0, 0);
        rect(gameChar_x - 20, 
             gameChar_y - 76,
             24, 10, 
             30, 0, 0, 30);
        rect(gameChar_x + 4, 
             gameChar_y - 76, 
             20, 20, 
             0, 30, 30, 0);
        fill(255, 255, 0);
        rect(gameChar_x - 22, 
             gameChar_y - 74, 
             10, 6, 
             30);
        //shoes
        fill(0, 182, 255);
        rect(gameChar_x - 16, 
             gameChar_y - 2, 
             12, 6, 
             4);
        rect(gameChar_x + 4, 
             gameChar_y - 2, 
             12, 6, 
             4);
        //gloves
        ellipse(gameChar_x, 
                gameChar_y - 22, 
                10);
        fill(0, 162, 235);
        ellipse(gameChar_x, 
                gameChar_y - 22, 
                6);

	}
	else if(isRight)
	{
		// add your walking right code
        //face
        fill(255, 224, 198);
        ellipse(gameChar_x, 
                gameChar_y - 60, 
                28, 32); 
        //eyes
        fill(255);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                6);
        fill(38, 197, 255);
        ellipse(gameChar_x + 6, 
                gameChar_y - 60, 
                4);
        fill(0);
        ellipse(gameChar_x + 7, 
                gameChar_y - 60, 
                2);
        //mouth
        fill(229, 153, 128);
        ellipse(gameChar_x + 10, 
                gameChar_y - 51, 
                3, 2);
        //body
        fill(255, 224, 198);
        //legs
        rect(gameChar_x - 14, 
             gameChar_y - 9, 
             10, 8, 
             5);
        rect(gameChar_x + 4, 
             gameChar_y - 9, 
             10, 8,
             5); 
        //clothes
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 43, 
             24, 26, 
             5);
        rect(gameChar_x - 12, 
             gameChar_y - 17, 
             10, 8, 
             5, 5, 2, 2);
        rect(gameChar_x + 2, 
             gameChar_y - 17, 
             10, 8, 
             5, 5, 2, 2); 
        rect(gameChar_x - 14, 
             gameChar_y - 9, 
             10, 4,
             2, 2, 0, 0);
        rect(gameChar_x + 4, 
             gameChar_y - 9, 
             10, 4,
             2, 2, 0, 0);
        fill(215, 0, 0);
        rect(gameChar_x + 6,
             gameChar_y - 39, 
             8, 18, 
             5);
        //arms
        fill(255, 224, 198);
        rect(gameChar_x - 4, 
             gameChar_y - 42, 
             8, 18, 
             5);
        //helmet
        fill(255, 0, 0);
        rect(gameChar_x - 4, 
             gameChar_y - 76, 
             24, 10, 
             0, 30, 30, 0);
        rect(gameChar_x - 24, 
             gameChar_y - 76, 
             20, 20, 
             30, 0, 0, 30);
        fill(255, 255, 0);
        rect(gameChar_x + 12, 
             gameChar_y - 74, 
             10, 6, 
             30);
        //shoes
        fill(0, 182, 255);
        rect(gameChar_x - 16, 
             gameChar_y - 2, 
             12, 6, 
             4);
        rect(gameChar_x + 4, 
             gameChar_y - 2, 
             12, 6, 
             4);
        //gloves
        ellipse(gameChar_x, 
                gameChar_y - 22, 
                10);
        fill(0, 162, 235);
        ellipse(gameChar_x, 
                gameChar_y - 22, 
                6);

	}
	else if(isFalling)
	{
		// add your jumping facing forwards code
        fill(255, 224, 198);
        ellipse(gameChar_x, 
                gameChar_y - 60, 
                28, 32); 
        //eyes
        fill(255);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                6);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                6);
        fill(38, 197, 255);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                4);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                4);
        fill(0);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                2);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                2);
        //mouth
        fill(229, 153, 128);
        ellipse(gameChar_x, 
                gameChar_y - 51, 
                6, 2);
        //body
        fill(255, 224, 198);
        //arms
        rect(gameChar_x - 28, 
             gameChar_y - 42, 
             18, 8, 
             5);
        rect(gameChar_x + 10, 
             gameChar_y - 42, 
             18, 8, 
             5);
        //clothes legs top
        fill(245, 0, 0);
            rect(gameChar_x - 18, 
             gameChar_y - 23, 
             8, 10, 
             5);
        rect(gameChar_x + 10, 
             gameChar_y - 23, 
             8, 10, 
             5);
        //legs
        fill(255, 224, 198);
        rect(gameChar_x - 20, 
             gameChar_y - 24, 
             8, 10, 
             5);
        rect(gameChar_x + 12, 
             gameChar_y - 24, 
             8, 10, 
             5); 
        //clothes
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 43, 
             24, 26, 
             5);
        fill(215, 0, 0);
        rect(gameChar_x - 8, 
             gameChar_y - 39,
             16, 18, 
             5);
        fill(245, 0, 0);
        rect(gameChar_x - 20, 
             gameChar_y - 24, 
             8, 6, 
             5, 5, 0, 0);
        rect(gameChar_x + 12, 
             gameChar_y - 24, 
             8, 6, 
             5, 5, 0, 0); 
        //helmet
        fill(255, 0, 0);
        rect(gameChar_x - 14, 
             gameChar_y - 76, 
             28, 10);
        rect(gameChar_x - 22, 
             gameChar_y - 76, 
             10, 15, 
             30, 0, 0, 30);
        rect(gameChar_x + 12, 
             gameChar_y - 76, 
             10, 15, 
             0, 30, 30, 0);
        fill(255, 255, 0);
        rect(gameChar_x - 8, 
             gameChar_y - 74, 
             16, 6, 
             30);
        //shoes
        fill(0, 182, 255);
        rect(gameChar_x - 24, 
             gameChar_y - 15, 
             12, 6, 
             4);
        rect(gameChar_x + 12, 
             gameChar_y - 15, 
             12, 6, 
             4);
        //gloves
        fill(0, 182, 255);
        ellipse(gameChar_x - 32, 
                gameChar_y - 38, 
                8);
        ellipse(gameChar_x + 32, 
                gameChar_y - 38, 
                8);
        fill(0, 152, 225);
        ellipse(gameChar_x - 32, 
                gameChar_y - 38, 
                6);
        ellipse(gameChar_x + 32, 
                gameChar_y - 38, 
                6);
	}
	else
	{
		// add your standing front facing code
        //face
        fill(255, 224, 198);
        ellipse(gameChar_x, 
                gameChar_y - 60, 
                28, 32); 
        //eyes
        fill(255);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                6);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                6);
        fill(38, 197, 255);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                4);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                4);
        fill(0);
        ellipse(gameChar_x - 5, 
                gameChar_y - 60, 
                2);
        ellipse(gameChar_x + 5, 
                gameChar_y - 60, 
                2);
        //mouth
        fill(229, 153, 128);
        ellipse(gameChar_x, 
                gameChar_y - 51, 
                6, 2);
        //body
        fill(255, 224, 198);
        //arms
        rect(gameChar_x - 21,
             gameChar_y - 42, 
             8, 18, 
             5);
        rect(gameChar_x + 13, 
             gameChar_y - 42, 
             8, 18, 
             5);
        //legs
        rect(gameChar_x - 12, 
             gameChar_y - 9, 
             10, 8, 
             5);
        rect(gameChar_x + 2, 
             gameChar_y - 9, 
             10, 8, 
             5); 
        //clothes
        fill(245, 0, 0);
        rect(gameChar_x - 12, 
             gameChar_y - 43, 
             24, 26, 
             5);
        rect(gameChar_x - 12, 
             gameChar_y - 17, 
             10, 8, 
             5, 5, 0, 0);
        rect(gameChar_x + 2, 
             gameChar_y - 17, 
             10, 8, 
             5, 5, 0, 0); 
        rect(gameChar_x - 12, 
             gameChar_y - 9, 
             10, 4);
        rect(gameChar_x + 2, 
             gameChar_y - 9, 
             10, 4);
        fill(215, 0, 0);
        rect(gameChar_x - 8, 
             gameChar_y - 39, 
             16, 18, 
             5);
        //helmet
        fill(255, 0, 0);
        rect(gameChar_x - 14, 
             gameChar_y - 76, 
             28, 10);
        rect(gameChar_x - 22, 
             gameChar_y - 76, 
             10, 15, 
             30, 0, 0, 30);
        rect(gameChar_x + 12, 
             gameChar_y - 76, 
             10, 15, 
             0, 30, 30, 0);
        fill(255, 255, 0);
        rect(gameChar_x - 8, 
             gameChar_y - 74, 
             16, 6, 
             30);
        //shoes
        fill(0, 182, 255);
        rect(gameChar_x - 14, 
             gameChar_y - 2, 
             12, 6, 
             4);
        rect(gameChar_x + 2, 
             gameChar_y - 2, 
             12, 6, 
             4);
        //gloves
        ellipse(gameChar_x - 18, 
                gameChar_y - 22, 
                10);
        ellipse(gameChar_x + 18, 
                gameChar_y - 22, 
                10);
        fill(0, 162, 235);
        ellipse(gameChar_x - 18, 
                gameChar_y - 22, 
                6);
        ellipse(gameChar_x + 18, 
                gameChar_y - 22, 
                6);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(count)
{
    // Clouds
    for(var i = 0; i < count; i++)
    {
        // Cloud
        fill(255);
        ellipse(clouds[i].posX, 
                clouds[i].posY, 
                85 * clouds[i].scale, 
                60 * clouds[i].scale);
        fill(250);
        ellipse(clouds[i].posX + 30 * clouds[i].scale, 
                clouds[i].posY - 20 * clouds[i].scale, 
                110 * clouds[i].scale, 
                70 * clouds[i].scale);
        ellipse(clouds[i].posX + 40 * clouds[i].scale, 
                clouds[i].posY + 20 * clouds[i].scale, 
                80 * clouds[i].scale, 
                60 * clouds[i].scale);
        fill(255);
        ellipse(clouds[i].posX + 50 * clouds[i].scale, 
                clouds[i].posY - 10 * clouds[i].scale, 
                90 * clouds[i].scale, 
                60 * clouds[i].scale);
        ellipse(clouds[i].posX +  100 * clouds[i].scale,
                clouds[i].posY - 20 * clouds[i].scale, 
                85 * clouds[i].scale, 
                60 * clouds[i].scale);
        ellipse(clouds[i].posX + 100 * clouds[i].scale, 
                clouds[i].posY + 20 * clouds[i].scale, 
                85 * clouds[i].scale, 
                60 * clouds[i].scale);
        ellipse(clouds[i].posX + 120 * clouds[i].scale, 
                clouds[i].posY, 
                85 * clouds[i].scale, 
                60 * clouds[i].scale);         
    }    
}

// Function to draw mountains objects.
function drawMountains(count)
{
    for(var i = 0; i < count; i++)
    {
        // Mountain
        fill(54,19,0);
        triangle(mountains[i].posX, 
                 floorPos_y, 
                 mountains[i].posX + (mountains[i].width/2) * mountains[i].scale, 
                 floorPos_y - mountains[i].height * mountains[i].scale, 
                 mountains[i].posX + mountains[i].width * mountains[i].scale, 
                 floorPos_y);
        fill(90,50,0); 
        triangle(mountains[i].posX + 110 * mountains[i].scale, 
                 floorPos_y, 
                 mountains[i].posX + (mountains[i].width/2) * mountains[i].scale, 
                 floorPos_y-mountains[i].height * mountains[i].scale, 
                 mountains[i].posX + mountains[i].width * mountains[i].scale, 
                 floorPos_y);

        fill(0,35,0);
        triangle(mountains[i].posX + 100*mountains[i].scale, 
                 floorPos_y, 
                 mountains[i].posX + (mountains[i].width/2 + 50) * mountains[i].scale, 
                 floorPos_y - (mountains[i].height - 100) * mountains[i].scale, 
                 mountains[i].posX + mountains[i].width * mountains[i].scale, 
                 floorPos_y);
        fill(0,55,0);
        triangle(mountains[i].posX + 220 * mountains[i].scale, 
                 floorPos_y, 
                 mountains[i].posX + (mountains[i].width/2 + 50) * mountains[i].scale, 
                 floorPos_y -(mountains[i].height - 100) * mountains[i].scale, 
                 mountains[i].posX + mountains[i].width * mountains[i].scale, 
                 floorPos_y);
    }
}

// Function to draw trees objects.
function drawTrees(x, scale)
{
    for(var i = 0; i < x.length; i++)
    {
        // Tree
        // Trunk
        fill(80,40,0);
        beginShape();
        vertex(x[i], 
               floorPos_y);
        vertex(x[i] + 13 * scale[i], 
               floorPos_y - 32 * scale[i]);
        vertex(x[i] + 13 * scale[i], 
               floorPos_y - 100 * scale[i]);
        vertex(x[i] + 39 * scale[i], 
               floorPos_y - 100 * scale[i]);
        vertex(x[i] + 39 * scale[i], 
               floorPos_y - 32 * scale[i]);
        vertex(x[i] + 52 * scale[i], 
               floorPos_y);
        endShape();
        // Crown
        fill(0,145,0);
        ellipse(x[i] + 25 * scale[i],
                floorPos_y - 112 * scale[i],
                50 * scale[i], 
                50 * scale[i]);
        fill(0,165,0);
        ellipse(x[i] + 40 * scale[i],
                floorPos_y - 120 * scale[i],
                60 * scale[i],
                60 * scale[i]);
        ellipse(x[i] + 60 * scale[i],
                floorPos_y - 120 * scale[i],
                60 * scale[i],
                60 * scale[i]);
        fill(0,135,0);
        ellipse(x[i] + 45 * scale[i],
                floorPos_y - 172 * scale[i],
                70 * scale[i],
                70 * scale[i]);
        fill(0,156,0);
        ellipse(x[i] - 15 * scale[i],
                floorPos_y - 142 * scale[i],
                70 * scale[i],
                70 * scale[i]);
        fill(0,150,0);
        ellipse(x[i] - 10 * scale[i],
                floorPos_y - 117 * scale[i],
                70 * scale[i],
                70 * scale[i]);
        fill(0,130,0);
        ellipse(x[i],
                floorPos_y - 182 * scale[i],
                70 * scale[i],
                70 * scale[i]);
        fill(0,143,0);
        ellipse(x[i] + 15 * scale[i],
                floorPos_y - 142 * scale[i],
                70 * scale[i],
                70 * scale[i]);
        fill(0,150,0);
        ellipse(x[i] + 40 * scale[i],
                floorPos_y - 107 * scale[i],
                60 * scale[i],
                60 * scale[i]);
        fill(0,155,0);
        ellipse(x[i] + 15 * scale[i],
                floorPos_y - 100 * scale[i],
                60 * scale[i],
                60 * scale[i]);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(90, 50, 0);
    beginShape();
    vertex(t_canyon.posX, 
           floorPos_y);
    vertex(t_canyon.posX - 10, 
           floorPos_y + 20);
    vertex(t_canyon.posX + 20, 
           floorPos_y + 100);
    vertex(t_canyon.posX + 10, 
           floorPos_y + 144);
    vertex(t_canyon.posX + t_canyon.width - 20, 
           floorPos_y + 144);
    vertex(t_canyon.posX + t_canyon.width - 50, 
           floorPos_y + 120);
    vertex(t_canyon.posX + t_canyon.width, 
           floorPos_y + 40);
    vertex(t_canyon.posX + t_canyon.width-10, 
           floorPos_y + 30);
    vertex(t_canyon.posX + t_canyon.width-40, 
           floorPos_y);
    endShape();

    fill(70, 30, 0);
    beginShape();
    vertex(t_canyon.posX + 20, 
           floorPos_y);
    vertex(t_canyon.posX + 10, 
           floorPos_y + 20);
    vertex(t_canyon.posX + 40, 
           floorPos_y + 100);
    vertex(t_canyon.posX + 30, 
           floorPos_y + 144);    
    vertex(t_canyon.posX + t_canyon.width - 50, 
           floorPos_y + 144);
    vertex(t_canyon.posX + t_canyon.width - 70, 
           floorPos_y + 120);
    vertex(t_canyon.posX + t_canyon.width - 20, 
           floorPos_y + 40);
    vertex(t_canyon.posX + t_canyon.width - 30, 
           floorPos_y + 30);
    vertex(t_canyon.posX + t_canyon.width - 60, 
           floorPos_y);
    endShape();
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(t_canyon.posX + 20 < 
       gameChar_world_x && t_canyon.posX + t_canyon.width - 60 > 
       gameChar_world_x && gameChar_y >= 
       floorPos_y)
    {
        isPlummeting = true;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(0, 135, 0)
    beginShape();
    vertex(t_collectable.posX - 2 * t_collectable.scale, 
           t_collectable.posY - 27 * t_collectable.scale);
    vertex(t_collectable.posX - 10 * t_collectable.scale,
           t_collectable.posY - 45 * t_collectable.scale);
    vertex(t_collectable.posX + 10 * t_collectable.scale, 
           t_collectable.posY - 27 * t_collectable.scale);
    vertex(t_collectable.posX + 30 * t_collectable.scale,
           t_collectable.posY - 45 * t_collectable.scale);
    vertex(t_collectable.posX + 22 * t_collectable.scale, 
           t_collectable.posY - 27 * t_collectable.scale);
    vertex(t_collectable.posX + 10 * t_collectable.scale,
           t_collectable.posY - 27 * t_collectable.scale);
    endShape();
    // Collectable (strawberry)
    fill(255, 0, 0);
    ellipse(t_collectable.posX, 
            t_collectable.posY, 
            60 * t_collectable.scale, 
            60 * t_collectable.scale);
    fill(225, 0, 0);
    ellipse(t_collectable.posX + 20 * t_collectable.scale, 
            t_collectable.posY, 
            60 * t_collectable.scale, 
            60 * t_collectable.scale);
    ellipse(t_collectable.posX + 10 * t_collectable.scale, 
            t_collectable.posY + 15 * t_collectable.scale, 
            60 * t_collectable.scale, 
            70 * t_collectable.scale);
    //Seeds
    fill(0, 65, 0);
    ellipse(t_collectable.posX, 
            t_collectable.posY - 15 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX - 5 * t_collectable.scale, 
            t_collectable.posY + 20 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX - 5 * t_collectable.scale, 
            t_collectable.posY - 5 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX - 15 * t_collectable.scale, 
            t_collectable.posY - 10 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX - 20 * t_collectable.scale, 
            t_collectable.posY + 5 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 10 * t_collectable.scale, 
            t_collectable.posY - 5 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 10 * t_collectable.scale, 
            t_collectable.posY + 20 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 10 * t_collectable.scale, 
            t_collectable.posY + 25 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 10 * t_collectable.scale, 
            t_collectable.posY, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 20 * t_collectable.scale, 
            t_collectable.posY + 21 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 20 * t_collectable.scale, 
            t_collectable.posY + 10 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 30 * t_collectable.scale, 
            t_collectable.posY - 20 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 30 * t_collectable.scale, 
            t_collectable.posY + 23 * t_collectable.scale, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 40 * t_collectable.scale, 
            t_collectable.posY, 
            3 * t_collectable.scale);
    ellipse(t_collectable.posX + 40 * t_collectable.scale, 
            t_collectable.posY - 10 * t_collectable.scale, 
            3 * t_collectable.scale);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, 
            gameChar_y, 
            t_collectable.posX, 
            t_collectable.posY) < 100 * 
       t_collectable.scale)
    {
        t_collectable.isFound = true;
        game_score += 1;
    } 
}

function renderFlagpole()
{
    fill(255);
    rect(flagpole.x_pos, 
         floorPos_y - 50, 
         6, 50);
    fill(0);
    rect(flagpole.x_pos, 
         floorPos_y - 50, 
         6, 5);
    rect(flagpole.x_pos, 
         floorPos_y - 40, 
         6, 5);
    rect(flagpole.x_pos, 
         floorPos_y - 30, 
         6, 5);
    rect(flagpole.x_pos, 
         floorPos_y - 20, 
         6, 5);
    rect(flagpole.x_pos, 
         floorPos_y - 10, 
         6, 5);
    
    if(flagpole.isReached)
    {
        fill(0, 255, 255);
    }
    else
    {
        fill(255, 204, 0);
    }
    
    triangle(flagpole.x_pos, 
             floorPos_y - 45, 
             flagpole.x_pos + 30, 
             floorPos_y - 65, 
             flagpole.x_pos, 
             floorPos_y - 85);
}

function checkFlagpole()
{
    if(flagpole.x_pos - gameChar_world_x < 30)
    {
        flagpole.isReached = true;
    }
}

function createPlatform(x, y, length, height)
{
    var p = {
        x: x,
        y: y,
        length: length,
        height: height,
        draw: function()
        {
            fill(190);
            ellipse(this.x, 
                    this.y, 
                    this.length, 
                    this.height);
            fill(230);
            ellipse(this.x - 6, 
                    this.y, 
                    this.length - 12, 
                    this.height - 4);
        },
        checkContact: function(gc_x, gc_y)
        {
            //checks whether character is in contact with a platform
            if(gc_x > this.x - this.length/2 && 
               gc_x < this.x + this.length/2)
            {
                var d = (this.y - this.height/2) - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            else
            {
                return false;  
            }
        },
        checkPlatformAhead: function(gc_x, gc_y)
        {
            //checks whether character is passing through a platform
            if(gc_x > this.x - this.length/2 && 
               gc_x < this.x + this.length/2 && 
               this.y - gc_y < this.height/2 && 
               (gc_y - 76) - this.y < this.height/2)
            {
                return true;
            }
            else 
            {
                return false;
            }
        } 
    }
    
    return p;
}

function Enemy(x, y)
{
    this.pos = undefined;
    this.x = x;
    this.y = y;
    this.dir = undefined;
    this.tailFlick = 4;
    this.tailIncr = -1;
        
    this.setup = function(x, y)
    {
        this.pos = createVector(x, y);
        this.dir = createVector(-1, 0);
        this.dir.normalize();
    };
        
    this.draw = function()
    {
        push();

        translate(this.pos.x, this.pos.y);

        rotate(this.dir.heading());
        fill(162, 237, 16);
        stroke(162, 237, 16);
        ellipse(0, 20, 20, 15);
        fill(0);
        ellipse(2, 22, 4);
        strokeWeight(8);
        noFill();
        
        beginShape();
        curveVertex(-5, 20);
        curveVertex(-5, 20);
        curveVertex(-20, this.tailFlick);
        curveVertex(-40, 0);
        curveVertex(-40, 0);
        curveVertex(-60,-this.tailFlick);
        curveVertex(-80, 0);
        curveVertex(-80, 0);
        endShape();
        
        pop();
    };

    this.update = function()
    {

        this.tailFlick += this.tailIncr;

        if(abs(this.tailFlick) > 4)
        {
            this.tailIncr *= -1;
        }

        this.pos.add(this.dir);
    };

    this.isContact = function(gc_x, gc_y)
    {
        // returns true if contact is made
        var d = dist(gc_x, 
                     gc_y, 
                     this.pos.x, 
                     this.y);
        if(d < 25)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    this.setup(this.x, this.y);
}
