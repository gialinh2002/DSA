import {Game, Position} from "./class.js";

const game = new Game();
let direction;

changeState();

function changeState(){
    console.log(game.controller.state);
    if(game.controller.state === "prepare"){
        const startButton = document.querySelector(".StartButton");

        startButton.addEventListener('click', function(){
            game.controller.setState("placing");
            startButton.removeEventListener('click', null);
            startButton.remove();
            game.createPlacingButton();
            changeState();
        })
    } else if(game.controller.state === "placing"){
        
        const verticalButton = document.querySelector("#verticalButton");
        const horizontalButton = document.querySelector("#horizontalButton");
        const beginButton = document.querySelector("#beginButton");
        const undoButton = document.querySelector("#undoButton");
        const playerTable = document.querySelectorAll("#playerCell");
        const text = document.querySelector(".PlacingText");
        const playerShip = document.querySelector('.PlayerShip');
        const ComputerShip = document.querySelector('.ComputerShip');

        verticalButton.addEventListener('click', function(){
            if(game.controller.playerTable.currentShip > 5){
                verticalButton.classList.add('selectedCell');
                return;
            }
            direction = "vertical";
            text.textContent = 'vertical';
        })

        horizontalButton.addEventListener('click', function(){
            if(game.controller.playerTable.currentShip > 5){
                horizontalButton.classList.add('selectedCell');
                return;
            }
            direction = "horizontal";
            text.textContent = 'horizontal';
        })

        undoButton.addEventListener('click', function(){
            text.textContent = 'Undo';
            game.controller.playerTable.deleteShip();
            game.controller.playerTable.syncPlayerShipToTable();
        })

        playerTable.forEach(function(cell){
            cell.addEventListener('click', function(){
                if(direction === undefined){
                    console.log("Invalid direction");
                } else{
                    game.controller.playerTable.createShip(new Position(cell.dataset.row,cell.dataset.col),direction);
                    game.controller.playerTable.syncPlayerShipToTable();
                }
            })
        })

        beginButton.addEventListener('click', function(){
            if(game.controller.playerTable.currentShip <= 5){
                beginButton.classList.add('selectedCell');
                return;
            }

            let playerText = document.createElement('div');
            playerText.textContent = 'Your Ship';
            playerText.className = 'Text';

            let computerText = document.createElement('div');
            computerText.textContent = 'Com Ship';
            computerText.className = 'Text';
            
            verticalButton.remove();
            horizontalButton.remove();
            undoButton.remove();
            text.textContent = 'Combat Phase';
            beginButton.remove();

            game.controller.setState('combat');
            
            playerTable.forEach(function(cell){
                cell.removeEventListener('click', null);
            })
            
            playerShip.appendChild(playerText);
            ComputerShip.appendChild(computerText);
            
            game.controller.computer.placingShip();
            game.drawShipTable(game.controller.playerTable.shipSize,"player",game.controller.playerTable);
            game.drawShipTable(game.controller.computerTable.shipSize,"computer",game.controller.computerTable);

            console.log(game.controller.playerTable.shipArray);
            changeState();
        })
    } else if(game.controller.state === "combat"){
        const computerTable = document.querySelectorAll("#computer_Cell");

        computerTable.forEach(function(cell){
            cell.addEventListener('click', function(){
                if(game.controller.computerTable.table[cell.dataset.col][cell.dataset.row] !== -1){
                    game.controller.computerTable.playerAttacked(new Position(cell.dataset.col, cell.dataset.row));
                    game.controller.computer.attack();
                    if(game.controller.checkLosingCondition()){
                        window.location = '/BattleShipNew/Ending/Losing.html';

                        
                    }
                    if(game.controller.checkWinningCondition()){
                        window.location = '/BattleShipNew/Ending/Winning.html';
                    }
                } else {
                    console.log(cell);
                }
            })
        })
    }
}

