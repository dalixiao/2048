CANVAS_SIZE = 700
GAME_SIZE = 4
BLOCK_SIZE = 150
PADDING_SIZE = (CANVAS_SIZE - GAME_SIZE * BLOCK_SIZE) / 5;
CANVAS_BACKGROUND_COLOR = "D4DfE6"
BLOCK_PLACEHOLDER_COLOR = "C4CFD6"
BLOCK_BACKGROUND_COLOR_START = "CADBE9"
BLOCK_BACKGROUND_COLOR_END = "BEC0E4"
BLOCK_FONT_COLOR = "444444"

FRAME_PER_SECOND = 30;
ANIMATION_TIME = 0.15;

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
        let moves = [];
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
                    moves.push([tail,head]);
                    arr[tail] = null;
                    tail += incr;
                }
                else if(arr[head] == arr[tail]){
                    arr[head] = arr[head]*2;
                    moves.push([tail,head]);
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
        return moves;
    }

    advance(command){
        let reverse = command == "right" || command == "down";
        let moves = [];
        if(command == "left" || command == "right"){
            for(let i = 0; i < 4;  i++){
                let rowMove = this.shiftBlock(this.data[i],reverse);
                for(let move of rowMove){
                    moves.push([[i,move[0]],[i,move[1]]]);
                }
            }
        }
        if(command == "up" || command == "down"){

            for(let j = 0; j< 4; j++){
                let arr = [];
                for(let i = 0; i<4; i++){
                    arr.push(this.data[i][j]);
                }
                let colMove = this.shiftBlock(arr,reverse);
                for(let move of colMove){
                    moves.push([[move[0],j],[move[1],j]]);
                }
                for(let i = 0; i < 4; i++){
                    this.data[i][j] = arr[i];
                }
            }
        }
        if(moves.length != 0){
            this.generateNewBlock();
        }
        return moves;
    }

}
//View
class View{
    constructor(game,container){
       this.game = game;
       this.blocks = [];
       this.container = container;
       this.initializeContainer();
    }

    initializeContainer(){
       this.container.style.width = CANVAS_SIZE;
       this.container.style.height = CANVAS_SIZE;
       this.container.style.backgroundColor = CANVAS_BACKGROUND_COLOR;
       this.container.style.position = "relative";
       this.container.style.display = "inline-block";
       this.container.style.borderRadius = "15px";
       this.container.zIndex = 1;
       this.container.color = BLOCK_FONT_COLOR;
    }

    gridToPosition(i,j){
        let top = i*(BLOCK_SIZE + PADDING_SIZE) + PADDING_SIZE;
        let left = j*(BLOCK_SIZE + PADDING_SIZE) + PADDING_SIZE;
        return [top,left];
    }

    animate(moves){
        this.doFrame(moves,0,ANIMATION_TIME);
    }

    doFrame(moves,currTime,totalTime){
        if(currTime < totalTime){
            setTimeout(() => {
                this.doFrame(moves,currTime + 1/FRAME_PER_SECOND,totalTime);
            },1/FRAME_PER_SECOND*1000);

            for(let move of moves){
                let block = this.blocks[[move[0][0]]][move[0][1]];
                let origin = this.gridToPosition(move[0][0],move[0][1]);
                let destination = this.gridToPosition(move[1][0],move[1][1]);
                let currPosition = [
                    origin[0] + currTime / totalTime *(destination[0]-origin[0]),
                    origin[1] + currTime / totalTime *(destination[1]-origin[1])
                ]
                //console.log(move)
                block.style.top = currPosition[0];
                block.style.left = currPosition[1];
            }
        }
        else{
            view.drawGame();
        }
    }

    drawGame(){
        this.container.innerHTML = "";
        this.blocks = [];
        for(let i = 0; i < GAME_SIZE; i++){
            let temp = [];
           for(let j = 0; j < GAME_SIZE;j++){
               this.drawBackgroundBlock(i,j,BLOCK_PLACEHOLDER_COLOR);
               let block = null;
               if(this.game.data[i][j]){
                   block = this.drawBlock(i,j,this.game.data[i][j]);
               }
               temp.push(block);
           }
           this.blocks.push(temp);

       }
    }

    drawBackgroundBlock(i,j,color){
       let block = document.createElement("div");
       let position = this.gridToPosition(i,j);
       block.style.width = BLOCK_SIZE;
       block.style.height = BLOCK_SIZE;
       block.style.backgroundColor = color;
       block.style.position = "absolute"
       block.style.top = position[0];
       block.style.left = position[1];
       block.style.zIndex = 3;
       block.style.borderRadius = "8px";
       this.container.append(block);
       return block;
    }

    drawBlock(i,j,number){
       let span = document.createElement("span");
       let text = document.createTextNode(number);
       let block = this.drawBackgroundBlock(i,j,BLOCK_BACKGROUND_COLOR_START);
       span.appendChild(text);
       block.appendChild(span);
       block.style.zIndex= 5;
       span.style.fontSize = 50;
       span.style.position = "absolute";
       span.style.top = (BLOCK_SIZE-span.offsetHeight) / 2;
       span.style.left = (BLOCK_SIZE-span.offsetWidth) / 2;
       return block;
    }
}
//Controller
var container =  document.getElementById("game-container");
var game = new Game();
var view = new View(game,container);
view.drawGame();

document.onkeydown = function(event){
    let moves = null;
    if(event.key=="ArrowLeft"){
        moves = game.advance("left");
    }
    else if(event.key == "ArrowRight"){
        moves = game.advance("right");
    }
    else if(event.key == "ArrowUp"){
        moves = game.advance("up");
    }
    else if(event.key == "ArrowDown"){
        moves = game.advance("down");
    }
    if(moves.length > 0){
        console.log(moves);
        view.animate(moves);
    }

}
