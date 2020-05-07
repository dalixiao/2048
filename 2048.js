CANVAS_SIZE = 700
CANVAS_BACKGROUND_COLOR = "#333333"
GAME_SIZE = 4
BLOCK_SIZE = 150
BLOCK_PLACEHOLDER_COLOR = "red"

// Global Utility Functions
randInt = function(a,b){
  return a + Math.floor(Math.random()*(b+1-a));
}
randChoice = function(arr){
  return arr[randInt(0,arr.length-1)];
}

//Model
class Game{
    constructor(){
      this.data = [];
      this.initializeData();
    }

    initializeData(){
      this.data = [];
      for(let i = 0; i < GAME_SIZE ; i++){
        let temp = []
        for (let j = 0; j < GAME_SIZE; j++){
          temp.push(null);
        }
        this.data.push(temp)
      }
      this.generateNewBlock()
      this.generateNewBlock()
    }

    generateNewBlock(){
      let possiblePositions = [];
      for(let i = 0; i< GAME_SIZE;i++){
        for(let j = 0; j < GAME_SIZE; j++){
          if(this.data[i][j] == null){
            possiblePositions.push([i,j]);
          }
        }
      }
      let position = randChoice(possiblePositions);
      this.data[position[0]][position[1]] = 2;
    }

}
//View
class View{
   constructor(container){
     this.container = container;
     this.initializeContainer();
   }

   initializeContainer(){
     this.container.style.width = CANVAS_SIZE;
     this.container.style.height = CANVAS_SIZE;
     this.container.style.backgroundColor = CANVAS_BACKGROUND_COLOR;
     this.container.style.position = "relative";
     this.container.style.display = "inline-block";
   }

   drawGame(){
     for(let i = 0; i < GAME_SIZE; i++){
       for(let j = 0; j < GAME_SIZE;j++){
         this.drawBackgroundBlock(i,j);
       }
     }
   }

   drawBackgroundBlock(i,j){
     let block = document.createElement("div");
     block.style.width = BLOCK_SIZE;
     block.style.height = BLOCK_SIZE;
     block.style.backgroundColor = BLOCK_PLACEHOLDER_COLOR;
     block.style.position = "absolute"
     block.style.top = (i+1)*20+i*BLOCK_SIZE;
     block.style.left = (j+1)*  20+j*BLOCK_SIZE;
     this.container.append(block);
   }
}
//Controller
var container =  document.getElementById("game-container");
var game = new Game();
var view = new View(container);
view.drawGame();
