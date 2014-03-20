function check(){
    // check if every button has correct solution on it
    var win = 1;
    i = 80;
    do{
        if(document.getElementById(i).value != puzzle[i]){
            win = 0;
            break;
        }
    }while(i--);

    alert(win ? 'Correct! You win!' : 'Incorrect, try again.');
}

function display_number_select(id){
    // reset button zIndex values
    i = 80;
    do{
        document.getElementById(i).style.zIndex = 0;
    }while(i--);

    if(selected_button == -1 || selected_button != id){
        selected_button = id;

        // increase zIndex of selected button
        document.getElementById(selected_button).style.zIndex = 2;

        // display number-select behind selected button
        update_number_select(id);
        document.getElementById('number-select').style.display = 'block';

    }else{
        // hide number select
        selected_button = -1;
        document.getElementById('number-select').style.display = 'none';
    }
}

function generate_puzzle(){
    document.getElementById('lol-a-table').style.marginTop = parseInt(document.getElementById('y-margin').value)+'px';
    save();

    var first = 0;
    var second = 0;
    var which = 0;

    // base sudoku puzzle
    puzzle = [
      8,7,6,5,4,3,2,1,9,
      5,4,3,2,1,9,8,7,6,
      2,1,9,8,7,6,5,4,3,
      7,6,5,4,3,2,1,9,8,
      4,3,2,1,9,8,7,6,5,
      1,9,8,7,6,5,4,3,2,
      6,5,4,3,2,1,9,8,7,
      3,2,1,9,8,7,6,5,4,
      9,8,7,6,5,4,3,2,1
    ];

    // switch all instances of two random numbers 100 times
    i = 99;
    do{
        // pick two different numbers between 1 and 9
        first = Math.ceil(Math.random() * 9);
        do{
            second = Math.ceil(Math.random() * 9);
        }while(first == second);

        // iterate through all buttons and switch those two numbers
        times = 80;
        do{
            if(puzzle[times] == first){
                puzzle[times] = second;

            }else if(puzzle[times] == second){
                puzzle[times] = first;
            }
        }while(times--);
    }while(i--);

    // switch columns between different blocks of 3 columns 100 times
    i = 99;
    do{
        // pick a column number to switch
        which = random_number(3);

        // pick two different blocks of 3 columns to switch the selected column number between
        first = random_number(3);
        do{
            second = random_number(3);
        }while(first == second);

        // iterate through each value in the selected column and swap them between the two selected blocks of 3 columns
        times = 8;
        do{
            var temp = puzzle[9 * times + 3 * first + which];
            puzzle[9 * times + 3 * first + which] = puzzle[9 * times + 3 * second + which];
            puzzle[9 * times + 3 * second + which] = temp;
        }while(times--);
    }while(i--);

    // switch columns within a block of 3 columns 100 times
    i = 99;
    do{
        // pick the block of 3 columns in which to switch two columns
        which = random_number(3);

        // pick two different columns to switch
        first = random_number(3);
        do{
            second = random_number(3);
        }while(first == second);

        // iterate through each value and swap the values between the two selected columns
        times = 8;
        do{
            var temp = puzzle[9 * times + 3 * which + first];
            puzzle[9 * times + 3 * which + first] = puzzle[9 * times + 3 * which + second];
            puzzle[9 * times + 3 * which + second] = temp;
        }while(times--);
    }while(i--);

    // switch random rows within a block of 3 rows 100 times
    i = 99;
    do{
        // pick one of the 3 blocks of 3 rows
        which = random_number(3);

        // pick two different rows
        first = random_number(3);
        do{
            second = random_number(3);
        }while(first == second);

        // iterate through each value and swap the values between the two selected rows
        times = 8;
        do{
            var temp = puzzle[which * 27 + first * 9 + times];
            puzzle[which * 27 + first * 9 + times] = puzzle[which * 27 + second * 9 + times];
            puzzle[which * 27 + second * 9 + times] = temp;
        }while(times--);
    }while(i--);

    // reset all buttons
    i = 80;
    do{
        document.getElementById(i).disabled = 0;
        document.getElementById(i).style.background = '#333';
        document.getElementById(i).style.color = '#aaa';
        document.getElementById(i).value = '';
    }while(i--);

    // add solutions to some random buttons
    i = document.getElementById('locked').value - 1;
    do{
        first = random_number(81);

        document.getElementById(first).disabled = 1;
        document.getElementById(80 - first).disabled = 1;

        document.getElementById(first).style.background = '#777';
        document.getElementById(80 - first).style.background = '#777';

        document.getElementById(first).style.color = '#000';
        document.getElementById(80 - first).style.color = '#000';

        document.getElementById(first).value = puzzle[first];
        document.getElementById(80 - first).value = puzzle[80 - first];
    }while(i--);
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('locked').value = 15;
        document.getElementById('y-margin').value = 50;
        save();
    }
}

function save(){
    i = 2;
    j = [
      'audio-volume',
      'locked',
      'y-margin'
    ];
    do{
        if(isNaN(document.getElementById(j[i]).value)
          || document.getElementById(j[i]).value === [1, 15, 50][i]
          || document.getElementById(j[i]).value < [0, 1, 0][i]){
            window.localStorage.removeItem('sudoku-' + i);
            document.getElementById(j[i]).value = [
              1,
              15,
              50
            ][i];
        }else{
            window.localStorage.setItem(
              'sudoku-' + i,
              document.getElementById(j[i]).value
            );
        }
    }while(i--);
    j = 0;
}

function select_number(number){
    document.getElementById(selected_button).value = number > 0
      ? number
      : '';
    selected_button = -1;
    document.getElementById('number-select').style.display = 'none';
}

function showhide(){
    i = document.getElementById('showhide-button').value === '-'
      ? 1
      : 0;
    document.getElementById('settings-span').style.display = ['inline', 'none'][i];
    document.getElementById('showhide-button').value = ['-', '+'][i];
}

function update_number_select(id){
    // make sure the number select box doesn't go past the left/right edges
    i = document.getElementById(id).offsetLeft - 50 - window.pageXOffset;
    if(i < 0){
        i = 0;
    }else if(i > window.innerWidth - 150){
        i = window.innerWidth - 150;
    }
    document.getElementById('number-select').style.left = i + 'px';

    // there is no worry of the number select box going past the top/bottom edges
    document.getElementById('number-select').style.top  = (document.getElementById(id).offsetTop  - 50 - window.pageYOffset) + 'px';
}

var i = 80;
var j = [];
var puzzle = [];
var selected_button = -1;
var times = 0;

document.getElementById('audio-volume').value = window.localStorage.getItem('sudoku-0') === null
  ? 1
  : parseFloat(window.localStorage.getItem('sudoku-0'));
document.getElementById('locked').value = window.localStorage.getItem('sudoku-1') === null
  ? 15
  : parseInt(window.localStorage.getItem('sudoku-1'));
document.getElementById('y-margin').value = window.localStorage.getItem('sudoku-2') === null
  ? 50
  : parseInt(window.localStorage.getItem('sudoku-2'));

// create buttons and add to game-area
do{
    j.push('<input class=buttons id=' + i + ' onclick=display_number_select(' + i + ') style=background:#333 type=button>');
    if(i % 9 === 0 && i !== 0){
        j.push('<br>');
    }
}while(i--);
document.getElementById('game-area').innerHTML = j.join('');

// setup margins
i = 8;
do{
    document.getElementById(3 + 9 * i).style.marginRight = '5px';
    document.getElementById(27 + i).style.marginBottom   = '5px';
    document.getElementById(54 + i).style.marginBottom   = '5px';
    document.getElementById(6 + 9 * i).style.marginRight = '5px';
}while(i--);

generate_puzzle();

window.onkeydown = function(e){
    if(selected_button != -1){
        i = window.event ? event : e;
        if((i.charCode ? i.charCode : i.keyCode) == 27){// ESC
            // hide number select
            display_number_select(selected_button);
        }
    }
};

window.onresize = function(e){
    // update position of number select if visible
    if(selected_button != -1){
        update_number_select(selected_button);
    }
};

window.onscroll = function(e){
    // update position of number select if visible
    if(selected_button != -1){
        update_number_select(selected_button);
    }
};
