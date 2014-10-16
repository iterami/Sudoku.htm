function check(){
    // check if every button has correct solution on it
    var win = 1;
    var loop_counter = 80;
    do{
        if(document.getElementById(loop_counter).value != puzzle[loop_counter]){
            win = 0;
            break;
        }
    }while(loop_counter--);

    alert(
      win
        ? 'Correct! You win!'
        : 'Incorrect, try again.'
    );
}

function display_number_select(id){
    // reset button zIndex values
    var loop_counter = 80;
    do{
        document.getElementById(loop_counter).style.zIndex = 0;
    }while(loop_counter--);

    if(selected_button == -1
      || selected_button != id){
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

function generate_puzzle(confirmation_required){
    if(!confirmation_required
      || confirm('Generate new puzzle?')){
        document.getElementById('lol-a-table').style.marginTop =
          parseInt(document.getElementById('y-margin').value)
          + 'px';
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
        var loop_counter = 99;
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
        }while(loop_counter--);

        // switch columns between different blocks of 3 columns 100 times
        loop_counter = 99;
        do{
            // pick a column number to switch
            which = Math.floor(Math.random() * 3);

            // pick two different blocks of 3 columns to switch the selected column number between
            first = Math.floor(Math.random() * 3);
            do{
                second = Math.floor(Math.random() * 3);
            }while(first == second);

            // iterate through each value in the selected column
            // swap them between the two selected blocks of 3 columns
            times = 8;
            do{
                var temp = puzzle[9 * times + 3 * first + which];
                puzzle[9 * times + 3 * first + which] = puzzle[9 * times + 3 * second + which];
                puzzle[9 * times + 3 * second + which] = temp;
            }while(times--);
        }while(loop_counter--);

        // switch columns within a block of 3 columns 100 times
        loop_counter = 99;
        do{
            // pick the block of 3 columns in which to switch two columns
            which = Math.floor(Math.random() * 3);

            // pick two different columns to switch
            first = Math.floor(Math.random() * 3);
            do{
                second = Math.floor(Math.random() * 3);
            }while(first == second);

            // iterate through each value and swap the values between the two selected columns
            times = 8;
            do{
                var temp = puzzle[9 * times + 3 * which + first];
                puzzle[9 * times + 3 * which + first] = puzzle[9 * times + 3 * which + second];
                puzzle[9 * times + 3 * which + second] = temp;
            }while(times--);
        }while(loop_counter--);

        // switch random rows within a block of 3 rows 100 times
        loop_counter = 99;
        do{
            // pick one of the 3 blocks of 3 rows
            which = Math.floor(Math.random() * 3);

            // pick two different rows
            first = Math.floor(Math.random() * 3);
            do{
                second = Math.floor(Math.random() * 3);
            }while(first == second);

            // iterate through each value and swap the values between the two selected rows
            times = 8;
            do{
                var temp = puzzle[which * 27 + first * 9 + times];
                puzzle[which * 27 + first * 9 + times] = puzzle[which * 27 + second * 9 + times];
                puzzle[which * 27 + second * 9 + times] = temp;
            }while(times--);
        }while(loop_counter--);

        // reset all buttons
        loop_counter = 80;
        do{
            document.getElementById(loop_counter).disabled = 0;
            document.getElementById(loop_counter).style.background = '#333';
            document.getElementById(loop_counter).style.color = '#aaa';
            document.getElementById(loop_counter).value = '';
        }while(loop_counter--);

        // add solutions to some random buttons
        loop_counter = document.getElementById('locked').value - 1;
        do{
            first = Math.floor(Math.random() * 81);

            document.getElementById(first).disabled = 1;
            document.getElementById(80 - first).disabled = 1;

            document.getElementById(first).style.background = '#777';
            document.getElementById(80 - first).style.background = '#777';

            document.getElementById(first).style.color = '#000';
            document.getElementById(80 - first).style.color = '#000';

            document.getElementById(first).value = puzzle[first];
            document.getElementById(80 - first).value = puzzle[80 - first];
        }while(loop_counter--);
    }
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
    var loop_counter = 2;
    do{
        var id = [
          'audio-volume',
          'locked',
          'y-margin'
        ][loop_counter];

        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value === [1, 15, 50][loop_counter]
          || document.getElementById(id).value < [0, 1, 0][loop_counter]){
            window.localStorage.removeItem('Sudoku.htm-' + id);
            document.getElementById(id).value = [
              1,
              15,
              50
            ][loop_counter];

        }else{
            window.localStorage.setItem(
              'Sudoku.htm-' + id,
              document.getElementById(id).value
            );
        }
    }while(loop_counter--);
}

function select_number(number){
    document.getElementById(selected_button).value = number > 0
      ? number
      : '';
    selected_button = -1;
    document.getElementById('number-select').style.display = 'none';
}

function showhide(){
    if(document.getElementById('showhide-button').value === '-'){
        document.getElementById('settings-span').style.display = 'none';
        document.getElementById('showhide-button').value = '+';

    }else{
        document.getElementById('settings-span').style.display = 'inline';
        document.getElementById('showhide-button').value = '-';
    }
}

function update_number_select(id){
    // make sure the number select box doesn't go past the left/right edges
    var xpos = document.getElementById(id).offsetLeft - 50 - window.pageXOffset;
    if(xpos < 0){
        xpos = 0;

    }else if(xpos > window.innerWidth - 150){
        xpos = window.innerWidth - 150;
    }
    document.getElementById('number-select').style.left = xpos + 'px';

    // there is no worry of the number select box going past the top/bottom edges
    document.getElementById('number-select').style.top  =
      (document.getElementById(id).offsetTop  - 50 - window.pageYOffset)
      + 'px';
}

var j = [];
var puzzle = [];
var selected_button = -1;
var times = 0;

document.getElementById('audio-volume').value = window.localStorage.getItem('Sudoku.htm-audio-volume') === null
  ? 1
  : parseFloat(window.localStorage.getItem('Sudoku.htm-audio-volume'));
document.getElementById('locked').value = window.localStorage.getItem('Sudoku.htm-locked') === null
  ? 15
  : parseInt(window.localStorage.getItem('Sudoku.htm-locked'));
document.getElementById('y-margin').value = window.localStorage.getItem('Sudoku.htm-y-margin') === null
  ? 50
  : parseInt(window.localStorage.getItem('Sudoku.htm-y-margin'));

// create buttons and add to game-area
var loop_counter = 80;
do{
    j.push(
      '<input class=buttons id='
      + loop_counter
      + ' onclick=display_number_select('
      + loop_counter
      + ') style=background:#333 type=button>'
    );
    if(loop_counter % 9 === 0
      && loop_counter !== 0){
        j.push('<br>');
    }
}while(loop_counter--);
document.getElementById('game-area').innerHTML = j.join('');

// setup margins
loop_counter = 8;
do{
    document.getElementById(3 + 9 * loop_counter).style.marginRight = '5px';
    document.getElementById(27 + loop_counter).style.marginBottom   = '5px';
    document.getElementById(54 + loop_counter).style.marginBottom   = '5px';
    document.getElementById(6 + 9 * loop_counter).style.marginRight = '5px';
}while(loop_counter--);

generate_puzzle(0);

window.onkeydown = function(e){
    var key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    if(key == 71){// G
        generate_puzzle(1);

    }else if(key == 67){
        check();

    }else if(selected_button != -1
      && key == 27){// ESC
        // hide number select
        display_number_select(selected_button);
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
