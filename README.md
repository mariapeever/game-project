# game-project
Strawberries - A game project. Rules - collect strawberries, avoiding enemies (snakes) and canyons until you reach the flag.

The scene of the game is composed of randomly-positioned elements to generate a “new” scene on startGame(). The game features sound for jumping and loss of life tokens on contact with a snake or falling into a canyon and carefully drawn graphics to be visually attractive. Other extensions added include platforms and enemies.

Platforms resemble rocks, positioned just below the x position of a specified number of random strawberries. The position of these strawberries is adjusted to be relative to the platform rather than the ground so that they can only be collected from a platform. Function createPlatforms() contains a constructor object with three methods -  draw() draws a platform template, which is utilised in startGame() to create multiple platforms in a for loop – each with a unique set of random values for positioning as well as length and height. checkContact() checks if the character is standing on a platform and checkPlatformAhead() defines the area of a platform to prevent the character from passing through it. 

Enemies are created using the constructor function Enemy() and resemble snakes, which are randomly positioned and crawling in the opposite direction of the character. In contact with a snake, life tokens are reduced by 1 and startGame() re-starts the game. 

As a result of building the extensions, I have learnt to use constructer objects (eg. for platforms) and constructor functions (eg. for enemies), position objects randomly or relative to other objects, create random variations of an object and add sound and interaction.
