# Sprites 

I'd like to try and start making some sprites for our game. It doesn't have to be anything crazy, but later in the Spring we probably don't want to be messing around trying to make sprites. Most of our time is probably going to be spent working with the code and the functionality of the game. If we can get some of the
artsy parts out of the way now, that would be good.

## Sprite Standards

For each subset of sprites, we should have some standards. Ie. all playable characters should be able to move left, move right, jump, etc. and should all be the same size (ex. 128x128 pixels) or something like that. 

## Playable Characters

Playable characters are any sprites that our user/player will be able to control in our game. I've thought of a few basic animations that the players character should be able to do. 

#### Dimensions
* 128x128 px

#### Animations
* Idling
* Jumping
* Moving left
* Moving right
* Dying
* Dead

## AI / Bots

AI / Bots are any entities in the game that aren't controlled by our player. For now, they have the same actions as our playable character. I'm trying to keep things as generic as possible for now. 

#### Dimensions
* 128x128 px

#### Animations
* Idling
* Jumping
* Moving left
* Moving right
* Dying
* Dead

## Stationary Objects / Obstacles

Stationary objects will be anything that don't appear in the background of our game that we might want to use to build the games enviorment/play-space. I dunno, boxes, chairs, tables, etc. anything that the player may have to manouver around or traverse.

#### Dimensions
* Variable

#### Annimations
* Idling
