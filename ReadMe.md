IGN: GroxicTinch

I don't mind if others use my code but please give credit if you are going to, please and thank you :)

# How to use
#### mirrorEverything.html
Web to use to receive the tells
https://darkvamprism.github.io/AnylandWebCodeSnippets/mirrorEverything.html

The webpage listens for the following tell commands:
* `mirrorx` : Mirror all states of all parts along the X plane.
* `mirrory` : Mirror all states of all parts along the Y plane.
* `mirrorz` : Mirror all states of all parts along the Z plane.

* `mirrorleftright` : Swap all of the words `left` with the word `right` and viceversa in all scripts on all states of all parts.

* `wordleft AN EXAMPLE` : Sets the variable wordLeft to the value `AN EXAMPLE`.
* `wordright THIS IS` : Sets the variable wordLeft to the value `THIS IS`.
* `swapwords` : Finds all instances of wordLeft(in this case `AN EXAMPLE`) and replaces it with wordRight(in this case `THIS IS`) from all scripts on all states of all parts.

#### spiralStairMaker.html
Web to use(doesn't contain tells at the moment)
https://darkvamprism.github.io/AnylandWebCodeSnippets/spiralStairMaker.html

Steps:
* Build a thing with the center being where the steps rotate around
* Make a single step inside this thing
* Press the "Load Stair Parts" button
* Change the amount of steps you want, height of each step and rotation added for each step
* Press the "Update" button.

The code will make a copy of all the parts in the thing(which is why it can only be a single step) and make X amount of copies, rotating each one and adding height from the origin of the shape.

DISCLAIMER!: Don't use too many parts\Steps, could cause lag, also make a backup of your stair just incase, the code shouldn't touch the Thing settings except for the parts but you know how things are, I'm sure we will find a bug where it deletes half the internet.

##### mannyController.html
Dont.. it doesn't work and doesnt have many safeguards in place, it may ruin your things.
