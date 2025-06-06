/**************************   Fetch section  *********************************/

/**************************Begin game section*********************************/


const size = 10;
const left = [-1,0], right = [1,0], up = [0,-1], down = [0,1];

let startButton = document.querySelector(".StartButton");
let player_Position = [];

startButton.addEventListener("click", function() {
    startButton.removeEventListener("click", arguments.callee);
    startButton.remove();

    if(!document.contains(startButton)){
        createNewTable(size);

        let player_Board = document.querySelectorAll("#playerCell");
        let shipSize = [2,2,3,3,4,5];
        let playerShipNo = 0;
        let direction;
        changePlacingPhase();
        let horizonButton = document.querySelector("#horizon");
        let verticalButton = document.querySelector("#vertical");
        let beginButton = document.querySelector("#begin");
        
        verticalButton.addEventListener('click', function(){
            if(playerShipNo < shipSize.length){
                direction = 'vertical';
            } else {
                verticalButton.className = "Invalid";
            }
        })

        horizonButton.addEventListener("click", function() {
            if(playerShipNo < shipSize.length){
                direction = 'horizontal';
            } else {
                horizonButton.className = "Invalid";
            }
        });

        beginButton.addEventListener('click', function(){
            if(playerShipNo < shipSize.length){
                beginButton.className = "Invalid";
            } else{
                let newText = document.querySelector('.NewText');
                horizonButton.remove();
                verticalButton.remove();
                beginButton.remove();
                newText.textContent = 'Combat phase';
                game(shipSize,player_Position);
            }
        });

        player_Board.forEach(function(cell){
            cell.addEventListener('click', function(){
                if(playerShipNo < shipSize.length && direction != undefined){
                    let x = parseInt(cell.dataset.col);
                    let y = parseInt(cell.dataset.row);
                    console.log(cell.dataset.value+" "+x+" "+y+" "+direction+" "+checkPositionValid(x,y,player_Board,shipSize,direction));
                    if(checkPositionValid(x,y,player_Board,shipSize[playerShipNo],direction)){
                        if (direction == "vertical") {
                            console.log("Check");
                            player_Board.forEach(function (playerCell) {
                            for (let i = 0; i < shipSize[playerShipNo]; i++) {
                                if (playerCell.dataset.col == (x) && playerCell.dataset.row == (parseInt(y) + i)) {
                                        playerCell.dataset.value = 1;
                                        playerCell.classList.add("selected");
                                        let position = [playerShipNo, playerCell.dataset.col, playerCell.dataset.row];
                                        player_Position.push(position);
                                    }
                                }
                            });
                        } else {
                            console.log("Check");
                            player_Board.forEach(function (playerCell) {
                                for (let i = 0; i < shipSize[playerShipNo]; i++) {
                                    if (playerCell.dataset.col == (parseInt(x) + i) && playerCell.dataset.row == (y)) {
                                        playerCell.dataset.value = 1;
                                        playerCell.classList.add("selected");
                                        let position = [playerShipNo, playerCell.dataset.col, playerCell.dataset.row];
                                        player_Position.push(position);
                                    }
                                }
                            });
                        }
                        playerShipNo++;
                    }
                }
                else if(playerShipNo >= shipSize){
                    cell.removeEventListener("click", arguments.callee);
                }
            })
        });
    
    }
});

function game(ship, player_Position){
    /*
    Debug Section

    // computer_Board[size*3+1].dataset.value = 1;
    // computer_Board[size*3+2].dataset.value = 1;
    // computer_Board[size*3+3].dataset.value = 1;
    // console.log(checkPositionValid(3,1,computer_Board,4,"vertical"));
    
    Ending Debug
    */
    
    let computer_Position = [];
    let ComputerShipArray = [0,0,0,0,0,0];
    let computerAttackArray = [];
    let computer_Board = document.querySelectorAll("#computerCell");

    let player_Board = document.querySelectorAll("#playerCell");
    let playerShipArray = [0,0,0,0,0,0];

    computer_placeShip(computer_Board,computer_Position);

    drawPlayerShip(ship);
    drawComputerShip(ship);

    let currentPosition = [];
    let direction = randomComputerDirection();
    let directionArray = [];
    const rootPosition = new Queue();

    //Player attack on ComputerZone
    computer_Board.forEach(function(computerCell) {
        computerCell.addEventListener("click", function() {
            // console.log(computerCell.dataset.col+" "+computerCell.dataset.row+" "+computerCell.dataset.value);

            if(computerCell.dataset.value != -1){
                computerAttack(player_Board,computerAttackArray,playerShipArray,player_Position, rootPosition, currentPosition, direction, directionArray);
            }

            attack(computer_Board,computerCell.dataset.col,computerCell.dataset.row,ComputerShipArray,computer_Position);

            if(checkWinningCondition(computer_Board)){
                console.log("Winner");
            }
        });
    });
}

/**************************Begin function section*********************************/
function createNewTable(size){
    /*
        New Section: 
        create ComputerTable
    */

    let rightContentDiv = document.querySelector('.RightContent');
    
    // Tạo một đối tượng table
    let computerTable = document.createElement('computerTable');
    computerTable.id = 'computer_Board';
    computerTable.className = 'board';

    // Tạo các hàng trong bảng
    for (let i = 0; i < size; i++) {
        let computerRow = document.createElement('tr');

        // Tạo các ô trong mỗi hàng
        for (let j = 0; j < size; j++) {
            let computerCell = document.createElement('td');
            computerCell.className = 'board-cell';
            computerCell.id = 'computerCell';
            // Khởi tạo giá trị
            computerCell.dataset.row = i;
            computerCell.dataset.col = j;
            computerCell.dataset.value = 0;
            computerRow.appendChild(computerCell);
        }
        
        // Thêm hàng vào bảng
        computerTable.appendChild(computerRow);
    }

    // Thêm bảng vào phần tử div có class "content"
    rightContentDiv.appendChild(computerTable);

    /*
        New Section: 
        Tạo bảng Player 
    */
    let leftContentDiv = document.querySelector('.LeftContent');
    let playerTable = document.createElement('playerTable');
    playerTable.id = 'player_Board';
    playerTable.className = 'board';

    // Tạo các hàng trong bảng
    for (let i = 0; i < size; i++) {
        let playerRow = document.createElement('tr');

        // Tạo các ô trong mỗi hàng
        for (let j = 0; j < size; j++) {
            let playerCell = document.createElement('td');
            playerCell.className = 'board-cell';
            playerCell.id = 'playerCell';
            // Khởi tạo giá trị
            playerCell.dataset.row = i;
            playerCell.dataset.col = j;
            playerCell.dataset.value = 0;
            playerRow.appendChild(playerCell);
        }
        
        // Thêm hàng vào bảng
        playerTable.appendChild(playerRow);
    }

    // Thêm bảng vào phần tử div có class "content"
    leftContentDiv.appendChild(playerTable);
}

function checkPositionValid(x, y, table, shipSize, direction) {
    if (direction == "vertical") {
        for (let i = 0; i < shipSize; i++) {
            if (parseInt(x) >= size || parseInt(y) + i >= size || table[(parseInt(y) + i) * size + parseInt(x)].dataset.value != 0 ) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < shipSize; i++) {
            if (parseInt(x) + i >= size || parseInt(y) >= size || table[parseInt(y) * size + parseInt(x) + i].dataset.value != 0 ) {
                return false;
            }
        }
    }
    return true;
}

function randomDirection(){
    return Math.floor(Math.random() * 2) == 0 ? "horizontal" : "vertical";
};

function computer_placeShip(computer_Board, computer_Position){
    const maxtries = 100;
    let count = 0;
    let computer_Ship = [2,2,3,3,4,5];
    computer_Ship.forEach(function(shipSize){
        let tries = 1;
        let x = Math.floor(Math.random()*size);
        let y = Math.floor(Math.random()*size);
        let direction = randomDirection();
        console.log(shipSize+" "+tries+" "+x+" "+y+" "+direction+" "+checkPositionValid(x,y,computer_Board,shipSize,direction));
        while(checkPositionValid(x,y,computer_Board,shipSize,direction)==false){
            x = Math.floor(Math.random()*size);
            y = Math.floor(Math.random()*size);
            direction = randomDirection();
            
            if(tries > maxtries){
                console.log("Maximum tries");
            }
            
            console.log(shipSize+" "+tries+" "+x+" "+y+" "+direction+" "+checkPositionValid(x,y,computer_Board,shipSize,direction));
            tries++;
        }

        if(direction == "vertical"){
            computer_Board.forEach(function(computerCell){
                for(let i = 0; i < shipSize; i++){
                    if(computerCell.dataset.col == (x) && computerCell.dataset.row == (y+i)){
                        if(computerCell.dataset.value == 1){
                            console.log("Trùng");
                            console.log(shipSize);
                        }
                        computerCell.dataset.value = 1;
                        let position = [count,computerCell.dataset.col,computerCell.dataset.row];
                        computer_Position.push(position);
                    }
                }
            })
        } else {
            computer_Board.forEach(function(computerCell){
                for(let i = 0; i < shipSize; i++){
                    if(computerCell.dataset.col == (x+i) && computerCell.dataset.row == (y)){
                        if(computerCell.dataset.value == 1){
                            console.log("Trùng");
                            console.log(shipSize);
                        }
                        computerCell.dataset.value = 1;
                        let position = [count,computerCell.dataset.col,computerCell.dataset.row];
                        computer_Position.push(position);

                    }
                }
            })
        }
        count++;
    });
}

function checkWinningCondition(table) {  
    for (let i = 0; i < size*size; i++) {  
        if (table[i].dataset.value == 1) {  
            return false; 
        }
    }
    return true;
};

function drawPlayerShip(shipSize){
    shipSize.forEach(function(sizeIndex){
        let playerShipdiv = document.querySelector('.PlayerShip');
        let playerShipTable = document.createElement('table');
        playerShipTable.id = 'player_Board';
        playerShipTable.className = 'dboard';
    
        let playerShipRow = document.createElement('tr');
        for (let i = 0; i < sizeIndex; i++) {
            let playerShipCell = document.createElement('td');
            playerShipCell.className = 'PShip-dboard-cell';
            // Khởi tạo giá trị
            playerShipCell.dataset.row = 0;
            playerShipCell.dataset.col = i;
            playerShipCell.dataset.value = i;
            playerShipRow.appendChild(playerShipCell);
        }
        playerShipTable.appendChild(playerShipRow);
        playerShipdiv.appendChild(playerShipTable);
    })
}

function drawComputerShip(shipSize) {
    let index = 0;
    shipSize.forEach(function (sizeIndex) {
        let computerShipDiv = document.querySelector('.ComputerShip');
        let computerShipTable = document.createElement('table'); // changed shiptable to table
        computerShipTable.id = 'computer_Board';
        computerShipTable.className = 'dboard';

        let computerShipRow = document.createElement('tr');
        for (let i = 0; i < sizeIndex; i++) {
            let computerShipCell = document.createElement('td');
            computerShipCell.className = 'CShip-dboard-cell';
            // Khởi tạo giá trị
            computerShipCell.dataset.row = 0;
            computerShipCell.dataset.col = i;
            computerShipCell.dataset.value = index;
            computerShipRow.appendChild(computerShipCell);
        }

        computerShipTable.appendChild(computerShipRow);
        computerShipDiv.appendChild(computerShipTable);
        index++;
    });
}

function shipAttacked(ship ,position, table){
    // console.log("Begin method");
    for (let i = 0; i < table.length; i++) {
        // console.log("Run"+table[i].dataset.value+" "+table[i].dataset.col+" "+table[i].dataset.row);
        if(position[0] == table[i].dataset.value && ship[position[0]] == table[i].dataset.col){
            table[i].id = "attacked";
            console.log("true");
            ship[position[0]]++;
            break;
        }
    }
}

function changePlacingPhase(){
    let midContent = document.querySelector('.MidContent');

    let text = document.createElement('div');
    text.textContent = 'Prepare Phase';
    text.className = 'NewText';

    midContent.appendChild(text);
 
    if (!midContent) {
       console.error("Element with class 'MidContent' not found.");
       return;
    }
 
    const button = document.createElement('div');
    button.className = 'Button';
 
    const horizontalButton = document.createElement('button');
    horizontalButton.textContent = 'Horizontal';
    horizontalButton.id = "horizon";
    button.appendChild(horizontalButton);
 
    const verticalButton = document.createElement('button');
    verticalButton.textContent = 'Vertical';
    verticalButton.id = "vertical";
    button.appendChild(verticalButton);
    
    const beginButton = document.createElement('button');
    beginButton.textContent = 'Begin';
    beginButton.id = "begin";
    button.appendChild(beginButton);
 
    midContent.appendChild(button);
    console.log(player_Position);
}

function computerAttack(table, computerAttackArray, shipArray, position, rootPosition, currentPosition, direction, directionArray) {
    if (computerAttackArray.length == 0) {
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        computerAttackArray.push([x, y, ...table[y * size + x].dataset.value]);
        PlayerAttacked(table, x, y, shipArray, position);
    } else {
        if(rootPosition.length === 0){
            let lastAttack = computerAttackArray[computerAttackArray.length-1];
            let x = lastAttack[0];
            let y = lastAttack[1];
            let value = lastAttack[2];

            if(value == 1){
                rootPosition.enqueue(lastAttack);
            } else if(value == 0){
                while(computerAttackArray.some(pos => x == pos[0] && y == pos[1])){
                    x = Math.floor(Math.random() * size);
                    y = Math.floor(Math.random() * size);
                }

                computerAttackArray.push([x, y, ...table[y * size + x].dataset.value]);
                PlayerAttacked(table, x, y, shipArray, position);
            } 
        }

        if(rootPosition.length != 0){
            if(directionArray.length == 0){
                console.log('first');
                currentPosition = rootPosition.peek();
            }
            if(directionArray.length >= 4){
                console.log('reset');
                rootPosition.dequeue();
                directionArray.splice(0, directionArray.length);
                state = 'random';
                let x = Math.floor(Math.random() * size);
                let y = Math.floor(Math.random() * size);
                
                while(computerAttackArray.some(pos => x == pos[0] && y == pos[1])){
                    x = Math.floor(Math.random() * size);
                    y = Math.floor(Math.random() * size);
                }
                computerAttackArray.push([x, y, ...table[y * size + x].dataset.value]);
                PlayerAttacked(table, x, y, shipArray, position);
            } else {
                ShipAttack(table,rootPosition, currentPosition, direction, directionArray);
                computerAttackArray.push([...currentPosition]);
                console.log(currentPosition);
                PlayerAttacked(table, currentPosition[0], currentPosition[1], shipArray, position);
            }
        }
        console.log(computerAttackArray);
    }
}

function attack(table, x, y, shipArray, position){
    let cell = table[parseInt(y)*size+parseInt(x)];
    if(cell.dataset.value == 0){
        cell.classList.add("selected");
        cell.id = "Empty";
        cell.dataset.value = -1;

    } else if(cell.dataset.value==1){
        cell.classList.add("selected");
        cell.id = "Ship";
        cell.dataset.value = -1;

        let tables = document.querySelectorAll(".CShip-dboard-cell");
        position.forEach(function (position){
            // console.log("checking:"+position+"Position:"+computerCell.dataset.col+" "+computerCell.dataset.row);
            if(position[1] == cell.dataset.col && position[2] == cell.dataset.row){
                shipAttacked(shipArray,position,tables);
            }
        })

    }
}

function PlayerAttacked(table, x, y, shipArray, position){
    let cell = table[parseInt(y)*size+parseInt(x)];
    if(cell.dataset.value == 0){
        cell.classList.remove('.selected');
        cell.classList.add('.playerAttacked');
        cell.dataset.value = -1;

    } else if(cell.dataset.value==1){
        cell.classList.remove('.selected');
        cell.classList.add('.playerShipAttacked');
        cell.dataset.value = -1;

        let tables = document.querySelectorAll(".PShip-dboard-cell");
        position.forEach(function (position){
            // console.log("checking:"+position+"Position:"+computerCell.dataset.col+" "+computerCell.dataset.row);
            if(position[1] == cell.dataset.col && position[2] == cell.dataset.row){
                shipAttacked(shipArray,position,tables);
            }
        })
    }
}

function ShipAttack(board, rootPosition, currentPosition, direction, directionArray){
    console.log(directionArray);
    console.log(currentPosition + ' '+ direction +' ' +rootPosition);
    if(currentPosition[2] == 1){
        if(currentPosition[0] == 0 && direction == 'left'){
            changeDir(currentPosition, rootPosition, directionArray);
            currentPosition = [...rootPosition];
        }

        if(currentPosition[0] == 9 && direction == 'right'){
            changeDir(currentPosition, rootPosition, directionArray);
            currentPosition = [...rootPosition];
        }

        if(currentPosition[1] == 0 && direction == 'up'){
            changeDir(currentPosition, rootPosition, directionArray);
            currentPosition = [...rootPosition];
        }

        if(currentPosition[1] == 9 && direction == 'down'){
            changeDir(currentPosition, rootPosition, directionArray);
            currentPosition = [...rootPosition];
        }

        if(direction == 'left'){
            currentPosition[0] = currentPosition[0] + left[0];
            currentPosition[1] = currentPosition[1] + left[1];
        } else if (direction == 'right'){
            currentPosition[0] = currentPosition[0] + right[0];
            currentPosition[1] = currentPosition[1] + right[1];
        } else if (direction == 'up'){
            currentPosition[0] = currentPosition[0] + up[0];
            currentPosition[1] = currentPosition[1] + up[1];
        } else {
            currentPosition[0] = currentPosition[0] + down[0];
            currentPosition[1] = currentPosition[1] + down[1];
        }
        currentPosition[2] = board[currentPosition[1]*size+currentPosition[0]].dataset.value;
        console.log(board[currentPosition[1]*size+currentPosition[0]].dataset.value);
    } else {
        if(directionArray.length >= 4){
            console.log('Full Direction');
            return;
        } else {
            changeDir(currentPosition, rootPosition, directionArray);
            direction = [...directionArray[directionArray.length-1]];
        }

        currentPosition = updatePos(...rootPosition, direction);
        
        while(currentPosition[2] === -1){
            changeDir(currentPosition, rootPosition, directionArray);
            direction = [...directionArray[directionArray.length-1]];
            currentPosition = updatePos(...rootPosition, direction);
        }
    }
}

function randomComputerDirection() {
    let directions = ["up", "down", "left", "right"];
    let randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}

function changeDir(currentPosition, rootPosition, directionArray){
    if(directionArray.length >= 4){
        return;
    }

    if(currentPosition[0] == 0 || currentPosition[1] == 0 || currentPosition[0] == 9 || currentPosition[1] == 9){
        if(currentPosition[0] == 0){
            directionArray.push('left');
        }

        if(currentPosition[0] == 9){
            directionArray.push('right');
        }

        if(currentPosition[1] == 0){
            directionArray.push('up');
        }

        if(currentPosition[1] == 9){
            directionArray.push('down');
        }
    }

    if(Math.abs(currentPosition[0] - rootPosition[0]) > 1 || Math.abs(currentPosition[1] - rootPosition[1]) > 1){
        console.log('OppositeDirection')
        if(direction == 'left' ){
            direction = 'right';
        } else if(direction == 'right'){
            direction = 'up';
        } else if(direction == 'up'){
            direction = 'down';
        } else{
            direction = 'left';
        }
    } else{
        console.log('randomDirection')
        direction = randomComputerDirection();
        while(directionArray.some(dir => direction === dir)){
            direction = randomComputerDirection();
        }
        directionArray.push([...direction]);
    }
}

function updatePos(currentPosition, direction){
    if(direction == 'left'){
        currentPosition[0] = currentPosition[0] + left[0];
        currentPosition[1] = currentPosition[1] + left[1];
    } else if (direction == 'right'){
        currentPosition[0] = currentPosition[0] + right[0];
        currentPosition[1] = currentPosition[1] + right[1];
    } else if (direction == 'up'){
        currentPosition[0] = currentPosition[0] + up[0];
        currentPosition[1] = currentPosition[1] + up[1];
    } else {
        currentPosition[0] = currentPosition[0] + down[0];
        currentPosition[1] = currentPosition[1] + down[1];
    }

    currentPosition[2] = board[currentPosition[1]*size+currentPosition[0]].dataset.value;

    return currentPosition;
}
/**************************End function section*********************************/