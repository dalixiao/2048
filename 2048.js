CANVAS_SIZE = 700
CANVAS_BACKGROUND_COLOR = "#333333"
GAME_SIZE = 4
BLOCK_SIZE = 150
BLOCK_PLACEHOLDER_COLOR = "red"
BLOCK_BACKGROUND_COLOR = "655233"

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

    shiftBlock(arr,reverse = false){
        let head = 0;
        let  tail = 1;
        let incr = 1;
        if(reverse == true){
            head = arr.length -1;
            tail = head - 1;
            incr = -1;
        }
        while(tail >= 0 && tail < arr.length){
            if(arr[tail] == null){
                tail += incr;
            }
            else{
                if(arr[head] == null){
                    arr[head] = arr[tail];
                    arr[tail] = null;
                    tail += incr;
                }
                else if(arr[head] == arr[tail]){
                    arr[head] = arr[head]*2;
                    arr[tail] = null;
                    head += incr;
                    tail += incr;
                }
                else{
                    head += incr;
                    if(head == tail){
                        tail += incr;
                    }
                }
            }
        }
        return arr;
    }

    advance(command){
        let reverse = false;
        if(command == "left" || command == "right"){
            if(command == "right"){
                reverse = true;
            }
            for(let i = 0; i < 4;  i++){
                this.shiftBlock(this.data[i],reverse)
            }
        }
    }

}
//View
class View{
    constructor(game,container){
       this.game = game;
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
               this.drawBackgroundBlock(i,j,BLOCK_PLACEHOLDER_COLOR);
               if(this.game.data[i][j]){
                   this.drawBlock(i,j,this.game.data[i][j])
               }
           }
       }
    }

    drawBackgroundBlock(i,j,color){
       let block = document.createElement("div");
       block.style.width = BLOCK_SIZE;
       block.style.height = BLOCK_SIZE;
       block.style.backgroundColor = color;
       block.style.position = "absolute"
       block.style.top = (i+1)*(CANVAS_SIZE-4*BLOCK_SIZE)/5+i*BLOCK_SIZE;
       block.style.left = (j+1)*(CANVAS_SIZE-4*BLOCK_SIZE)/5+j*BLOCK_SIZE;
       this.container.append(block);
       return block;
    }

    drawBlock(i,j,number){
       let span = document.createElement("span");
       let text = document.createTextNode(number);
       let block = this.drawBackgroundBlock(i,j,BLOCK_BACKGROUND_COLOR);
       span.appendChild(text);
       block.appendChild(span);
       span.style.fontSize = 50;
       span.style.position = "absolute";
       span.style.top = (BLOCK_SIZE-span.offsetHeight) / 2;
       span.style.left = (BLOCK_SIZE-span.offsetWidth) / 2;
    }
}
//Controller
var container =  document.getElementById("game-container");
var game = new Game();
var view = new View(game,container);
view.drawGame();

document.onkeydown = function(event){
    if(event.key=="ArrowLeft"){
        game.advance("left");
    }
    else if(event.key == "ArrowRight"){
        game.advance("right");
    }
    view.drawGame();
}
