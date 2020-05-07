CANVAS_SIZE = 600
CANVAS_BACKGROUND_COLOR = "#333333"
GAME_SIZE = 4
BLOCK_SIZE = 150
BLOCK_PLACEHOLDER_COLOR = "red"
//Model
class Game{
    constructor(){
      this.data = [];
      this.initializeData();
    }

    initializeData(){
      this.data = [];
      for(let i = 0; i < GAME_SIZE ; i++){
        temp = []
        for (let j = 0; j < GAME_SIZE; j++){
          temp.push(null);
        }
        this.data.push(temp)
      }
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
     block.style.top = i*BLOCK_SIZE;
     block.style.left = j*BLOCK_SIZE;
     this.container.append(block);
   }
}
//Controller
var container =  document.getElementById("game-container");
var view = new View(container);
view.drawGame();
