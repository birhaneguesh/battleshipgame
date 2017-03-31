/*
javascript code for simple Battleships Game

Assignment 2 

Birhane Guesh 
  
*/
var numAttempt = 0; // number of bombs 
var allTargets = 0; // all ships with gun 
var totalNumOfShoot = 0; 
var hitTarget =0; // holds the value of targeted shooting 
var gridsize = 0;
var remainingBombs = 0;

// Placement Direction 
var horizontal = 1; 
var vertical = 0;

// used to update the css of the grid based on the shooting 
var emptyCSS = 'empty'; // the grid is initialed with empty value's 
var shipCSS = 'ship';  // when there is  
var missCSS = 'miss';
var hitCSS = 'hit';

// code represeation of each cell in the board 
var empty = 0; // no ship
var ship = 1; // represets the availablity of ship with gun 
var miss = 2; // the hit was drawn to the water/ missed shoot
var hit = 3; // target shoot 


var ships= []; // stores the available ships in the board 
var cells = []; // array to hold the values of each cell in the board
var readytoplay=false; 

var StartGame = function(form, number){
    var shipcell = 0 ; // the nuber of cells that will be occupied by the ship    
    
    var count=0; // counts the number of fighting ships that the player select 
     gridsize = parseInt(form.numcells.value);      
     allTargets=0;
     totalNumOfShoot = 0; 
     hitTarget =0;
    
      for (i=0;i<form.ships.length;i++){        
        if(form.ships[i].checked===true){                              
            ships[count]=form.ships[i].value; // ship type by number of bombs 
            allTargets+=parseInt(form.ships[i].value); // the total number of guns 
            shipcell+=parseInt(form.ships[i].value);                
            count++;
        }
    } 
    if(shipcell>0){
        numAttempt =(parseFloat(shipcell)*number) + gridsize; // number of attempts
        remainingBombs=numAttempt;
        
        createGrid(gridsize); // this creates the board with the given size     
        placeShips(ships);  //  places the ship's on the board 
    }
    else{
        alert("Please Select at least one ship to start the game");
         gridDiv.innerHTML=""; 
    }
          
}
var createGrid = function(size){
    var gridDiv = document.getElementById('div_table_board'); //
    var childdiv = document.querySelectorAll('.grid-cell');   
    
    if(childdiv.length !==0){
        //childdiv.removeEventListener('') // removes existing event listner
        gridDiv.innerHTML="";          // and empy if there is any existing div in the board
        
    }        
        for(i=0; i<size; i++){        
        for(j=0; j<size; j++){            
            var divel = document.createElement('div');// creating div element for each ell of the board           
            divel.setAttribute('data-x', i);    // setting attribute data-x  with i value
            divel.setAttribute('data-y', j);    // setting attribute data-y  with j value
            divel.setAttribute('class', 'grid-cell grid-cell-' + i + '-' + j); // setting attribute class with value 
            divel.addEventListener('click', listenShoot, false); // adding event listener for each cell
            divel.addEventListener('mouseover', mouseOver, false);
            gridDiv.appendChild(divel);
        }
        var brk = document.createElement('br'); // breaks at the end of each row
        gridDiv.appendChild(brk);		
    }     
    // the 2D array for manipulating the game which holds the codes 
	for (var k= 0; k < size; k++) {
		var row = [];
		this.cells[k] = row;
		for (var y = 0; y < size; y++) {
			row.push(empty);
		}
	}
    readytoplay = true ;        
}
function listenShoot(e) { 
      
	var x = parseInt(e.target.getAttribute('data-x'), gridsize);      
	var y = parseInt(e.target.getAttribute('data-y'), gridsize);
    var result = null; // is used to hold the result of the shoot() function 
    
    if(readytoplay){
        //alert("you clicked me");        
        result = shoot(x,y); // calls the shoot function with the  clicked x and y values
        remainingBombs = remainingBombs-1;
        var updatePara = document.getElementById('p_bombs');
        updatePara.innerHTML = "Number of Remaining boambs :" + (remainingBombs) + '!!!';
        //updatePara.replaceChild(remainingBombs);
        
    }        
    
}

var mouseOver = function(e){
    var x = parseInt(e.target.getAttribute('data-x'), gridsize);      
	var y = parseInt(e.target.getAttribute('data-y'), gridsize);    
    if(cells[x][y]===empty || cells[x][y]===ship ){
        var type = 'hover';
        var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
	   document.querySelector('.grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    }
    
    
}
var placeShips = function(shipsarr){ 
    // Generate the radom X , Y  and Direction position from the grid to place the ship
    //alert(shipsarr.length);
    for(i=0; i<shipsarr.length; i++){
        wrongPlacement = true;
        while(wrongPlacement){
            var randX =Math.floor(gridsize*(Math.random()));
            var randY = Math.floor(gridsize*(Math.random()));
            var randDirection= Math.floor(2*(Math.random())); 
            //alert("ship of size" + parseInt(shipsarr[i]));
            //alert("rand x and y "+randX +','+ randY +','+randDirection);          
            
            if(isRightPlacement(randX, randY, randDirection ,parseInt(shipsarr[i]))){
                //alert("We are iside the placment ");               
                    if(randDirection === horizontal){
                        for(j=0; j<parseInt(shipsarr[i]); j++){
                            cells[randX][randY + j]= ship;                            
                            //alert("horizontal direction placement "+randX +','+ randY+j);
                        }
                    }else{
                        for(j=0; j<parseInt(shipsarr[i]); j++){
                           cells[randX+j][randY] =ship;
                            //alert("vertical direction placement " + randX+j+','+ randY);
                        }
                        
                    }         
          
               wrongPlacement= false; 
            }
            else {
				continue;
			}
        } 
        //alert(cells);
                      
    }   
    // the simplest version of placement 
    /*for(i=0;i<cells.length; i++){
       for(j=0; j<parseInt(shipsarr[i]); j++){
           //alert(i +","+ j)
           updateCell(i, j, 'ship');
           
       }
        
    }*/
}
var isRightPlacement = function(x, y, direction , shiplength){
    if(isInsideGrid(x, y, shiplength, direction)){
        for (var i = 0; i < shiplength; i++) {
			if (direction === horizontal) {
                if (cells[x][y + i] === ship ) {
					return false;
				}
				
			} else {
				if (cells[x + i][y] === ship ) {
					return false;
				}
			}
		}
		return true;
	} else {
		return false;
	}
        
} 
var isInsideGrid = function(x, y ,shiplength, direction){
    if (direction === vertical) { 
        //alert("vertical:"+ ','+x+ shiplength);
		return x + shiplength <= gridsize;
	} else {
		return y + shiplength <= gridsize;
	}
}

var isGameWon = function(){
    if( hitTarget===allTargets){
        alert("Congratulation , You win the game");
        var allCells = document.querySelectorAll('.grid-cell');
        for(i=0; i< allCells.length; i++){
            allCells[i].removeEventListener('click', listenShoot, false);
            //allCells[i].removeEventListener('mouseover', mouseOver, false);
        }
    }    
    if(totalNumOfShoot>=numAttempt){        
        var allCells = document.querySelectorAll('.grid-cell');
        if(hitTarget===allTargets){
            alert("Congratulation , You win the game");
        }
        else{            
        
        for(i=0; i< allCells.length; i++){
            allCells[i].removeEventListener('click', listenShoot, false);
            //allCells[i].removeEventListener('mouseover', mouseOver, false);
        }
        //alert(allCells.length);
        alert("You have zero bombs!! The computer wins!");
        
    }
    }
}
var shoot = function(x, y){  
    if (isCellDestroyed(x, y)) {
        //alert("checking is destroyed");
		return null;
	} else if (isMiss(x, y)) {
        //alert("checking ismissed");
		return null;
	} else if (isCellNotDestroyed(x, y)) {		
        //alert("checking if it is not destroyed ");
		updateCell(x, y, 'hit');        
        totalNumOfShoot++;
        hitTarget++;
        
		isGameWon();
		return hit;
	} else {
        //alert("updating to missed values");
		updateCell(x, y, 'miss');
        totalNumOfShoot++; 
        
		isGameWon(); // checks if your attempt is over and the computer will win 
		return miss;
	}         
}
// to check whether the values of the cell has undamaged ship
var isCellNotDestroyed = function(x, y) {
	return cells[x][y] === ship;
};
// to check the shoot was to missed/ to the sea
var isMiss = function(x, y) {
	return cells[x][y] === miss;
};
//checks if the cell has already been destroyed 
var isCellDestroyed = function(x, y) {
	return cells[x][y] === hit;
};

// each grid cell is updated based on the type 
var updateCell = function(x, y, type) {	
	switch (type) {
		case emptyCSS:
			cells[x][y] = empty;
			break;
		case shipCSS:
			cells[x][y] = ship;
			break;
		case missCSS:
			cells[x][y] = miss;
            //remove event listnet attached with the cell 
            document.querySelector('.grid-cell-' + x + '-' + y).removeEventListener('click',listenShoot,false);
            document.querySelector('.grid-cell-' + x + '-' + y).removeEventListener('mouseover',mouseOver,false);
			break;
		case hitCSS:
			cells[x][y] = hit;
            //remove event listnet attached with the cell 
            document.querySelector('.grid-cell-' + x + '-' + y).removeEventListener('click',listenShoot,false);
            document.querySelector('.grid-cell-' + x + '-' + y).removeEventListener('mouseover',mouseOver,false);
			break;		
		default:
			cells[x][y] = empty;
			break;
	}
	var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
	document.querySelector('.grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    
}


