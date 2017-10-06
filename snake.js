// alert("JS connected!")

$(document).ready(function(){
	//Setting up canvas
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	//Set up grid system
	var gridNum = 20;
	var gridSize=canvas.width/gridNum;

	//Setting up player and candy objects
	var candy = {
		x:0,
		y:0,
		alive:false
	}

	var player ={
		x:7,
		y:7,
		//Not moving-5, Right-0, Left-1. Up-2, Down-3
		direction:5,
		alive:true,
		//length of the snake
		tail:1
	}

	//Storing the coordinates all body parts in pairs of [x,y] for each unit
	var snakeBody=[[7,7]];

	//Setting up keys
	var keyPressed = null;
	var leftKey=37;
	var upKey=38;
	var rightKey=39;
	var downKey=40;

	//Make a custom .insert() function/method for our snakeBody array
	Array.prototype.insert=function(index,item){
		// .splice(index_to_insert,no_of_items_to_delete,new_items)
		this.splice(index,0,item);
	}

	//define our update() function 
	function update(){
		//1. Changing the direction of the snake based on user's input
		if(keyPressed){
			if(keyPressed==rightKey &&player.direction!=1){
				player.direction=0;				
			}
			if(keyPressed==leftKey &&player.direction!=0){
				player.direction=1;				
			}
			if(keyPressed==upKey &&player.direction!=3){
				player.direction=2;				
			}
			if(keyPressed==downKey &&player.direction!=2){
				player.direction=3;				
			}
		}

		//2. Spwan the candy
		if(!candy.alive){
			//Generate random number from 0 to 19 (for 20x20 grid system)
			candy.x= Math.floor(Math.random()*gridNum);
			candy.y= Math.floor(Math.random()*gridNum);

			var collided;

			//checking to see if the candy is spawned on top of the snake. If yes, then spawn the candy at another random location

			do{
				collided=false;
				for (var i=0; i<player.tail;i++){
					if(candy.x==snakeBody[i][0] && candy.y==snakeBody[i][1]){
						collided=true;
						candy.x= Math.floor(Math.random()*gridNum);
						candy.y= Math.floor(Math.random()*gridNum);
						break;
					}
				}
			}while(collided);

			//candy is back to live
			candy.alive=true;
		}

		//3. check if the snake is eating the candy
		if (candy.x==player.x && candy.y==player.y){
			candy.alive=false;
			player.tail++;
		}

		//4. Check if the snake is eating itself
		if(player.tail>1){
			for (var i=0;i>player.tail;i++){
				if(player.x==snakeBody[i][0] && player.y==snakeBody[i][1]){
					player.alive=false;
					clearInterval(updates);
				}
			}
		}

		//5. check to see if the snake is colliding with the border
		if(player.x<0 || player.x>19 ||player.y<0 ||player.y>19){
			player.alive=false;
			clearInterval(updates);
		}

		snakeBody.insert(0,[player.x,player.y]);
		while(snakeBody.length>player.tail+1){
			snakeBody.pop();
		}

		switch(player.direction){
			//Right
			case 0: player.x+=1; 
			break;
			//Left
			case 1: player.x-=1;
			break;
			//Up
			case 2:player.y-=1;
			break;
			//Down
			case 3:player.y+=1;
			break;
		}
		if(player.alive){
			draw();
		}
	}

	//draw the game out
	function draw(){
		context.clearRect(0,0,canvas.width,canvas.height);
		//Drawing candy 
		context.fillStyle="red";
		context.fillRect(candy.x*gridSize,candy.y*gridSize,gridSize,gridSize);
		//Drawing the snake
		for (var i=0;i<player.tail;i++){
			context.fillStyle="black";
			context.fillRect(snakeBody[i][0]*gridSize,snakeBody[i][1]*gridSize,gridSize,gridSize);
		}
	}

	// Keydown events
	$(window).on("keydown", function(event){
		keyPressed = event.which
	});
	//Calling Functions
	update();
	var updates = setInterval(update,100);
})