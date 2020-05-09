CANVAS_SIZE = 700
CANVAS_BACKGROUND_COLOR = "#333333"
GAME_SIZE = 4
BLOCK_SIZE = 150
PADDING_SIZE = (CANVAS_SIZE-BLOCK_SIZE)/5;
BLOCK_PLACEHOLDER_COLOR = "22222"
BLOCK_BACKGROUND_COLOR = "655233"
FRAME_PER_SECONDS = 30;
ANIMATION_TIME = 1;
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
        let moveOneD = []
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
                    moveOneD.push([tail,head]);
                    arr[tail] = null;
                    tail += incr;
                }
                else if(arr[head] == arr[tail]){
                    arr[head] = arr[head]*2;
                    moveOneD.push([tail,head]);
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
        return moveOneD;
    }

    advance(command){
        let reverse = false;
        let moves = [];
        if(command == "left" || command == "right"){
            if(command == "right"){
                reverse = true;
            }
            for(let i = 0; i < 4;  i++){
                let moveOneD = this.shiftBlock(this.data[i],reverse);
                for(let item of moveOneD){
                    moves.push([ [ i,item[0] ], [ i, item[1] ] ]);
                }
            }
        }
        if(command == "up" || command == "down"){

            for(let i = 0; i< 4; i++){
                if(command == "down"){
                    reverse = true;
                }
                let arr = [];
                for(let j = 0; j<4; j++){
                    arr.push(this.data[j][i]);
                }
                let moveOneD = this.shiftBlock(arr,reverse);
                for (let item of moveOneD){
                    moves.push([ [item[0],i] , [item[1],i] ]);
                }
                for(let j = 0; j < 4; j++){
                    this.data[j][i] = arr[j];
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
    }

    gridToPositions(i,j){
        let top = i * (BLOCK_SIZE+PADDING_SIZE)+ PADDING_SIZE;
        let left = j * (BLOCK_SIZE + PADDING_SIZE) + PADDING_SIZE;
        return [top,left];
    }

    animate(moves){
        this.doFrame(moves,0,ANIMATION_TIME);
    }

    doFrame(moves,currTime,totalTime){
        if(currTime < totalTime){
            setTimeout(()=>{
                this.doFrame(moves,currTime+ 1/FRAME_PER_SECONDS,totalTime);
            }, 1/FRAME_PER_SECONDS*1000);
            for(let move of moves){
                let block = this.blocks[move[0][0]][move[0][1]];
                let origin = this.gridToPositions(move[0][0],move[0][1]);
                let destination = this.gridToPositions(move[1][0],move[1][1]);
                let currPosition = [
                    origin[0] + currTime / totalTime * (destination[0]-origin[0]),
                    origin[1] + currTime / totalTime * (destination[1]-origin[1])
                ]
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
        for(let i = 0; i < GAME_SIZE; i++){
           let temp = [];
           for(let j = 0; j < GAME_SIZE;j++){
               this.drawBackgroundBlock(i,j,BLOCK_PLACEHOLDER_COLOR);
               let block = null;
               if(this.game.data[i][j]){
                   block = this.drawBlock(i,j,this.game.data[i][j])
               }
               temp.push(block);
           }
           this.blocks.push(temp);
       }
    }

    drawBackgroundBlock(i,j,color){
       let block = document.createElement("div");
       block.style.width = BLOCK_SIZE;
       block.style.height = BLOCK_SIZE;
       block.style.backgroundColor = color;
       block.style.position = "absolute";
       let [top,left] = this.gridToPositions(i,j);
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
        //view.drawGame();
    }
}
