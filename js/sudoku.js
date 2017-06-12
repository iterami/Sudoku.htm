'use strict';

function check(){
    // Check if every button has correct solution on it.
    var win = true;
    var loop_counter = 80;
    do{
        if(document.getElementById(loop_counter).value != puzzle[loop_counter]){
            win = false;
            break;
        }
    }while(loop_counter--);

    window.alert(
      win
        ? 'Correct! You win!'
        : 'Incorrect, try again.'
    );
}

function display_number_select(id){
    // Reset button zIndex values.
    var loop_counter = 80;
    do{
        document.getElementById(loop_counter).style.zIndex = 0;
    }while(loop_counter--);

    if(selected_button === -1
      || selected_button != id){
        selected_button = id;

        // Increase zIndex of selected button.
        document.getElementById(selected_button).style.zIndex = 2;

        // Display number-select behind selected button.
        update_number_select(id);
        document.getElementById('number-select').style.display = 'block';

    }else{
        // Hide number select.
        selected_button = -1;
        document.getElementById('number-select').style.display = 'none';
    }
}

function generate_puzzle(skip){
    if(!skip
      && !window.confirm('Generate new puzzle?')){
        return;
    }

    core_storage_save();

    document.getElementById('game-div').style.marginTop = parseInt(
      core_storage_data['y-margin'],
      10
    ) + 'px';

    var first = 0;
    var second = 0;
    var which = 0;

    // Base sudoku puzzle.
    puzzle = [
      8,7,6, 5,4,3, 2,1,9,
      5,4,3, 2,1,9, 8,7,6,
      2,1,9, 8,7,6, 5,4,3,

      7,6,5, 4,3,2, 1,9,8,
      4,3,2, 1,9,8, 7,6,5,
      1,9,8, 7,6,5, 4,3,2,

      6,5,4, 3,2,1, 9,8,7,
      3,2,1, 9,8,7, 6,5,4,
      9,8,7, 6,5,4, 3,2,1,
    ];

    // Switch all instances of two random numbers 100 times.
    var loop_counter = 99;
    do{
        // Pick two different numbers between 1 and 9.
        first = core_random_integer({
          'max': 9,
          'todo': 'ceil',
        });
        do{
            second = core_random_integer({
              'max': 9,
              'todo': 'ceil',
            });
        }while(first === second);

        // Iterate through all buttons and switch those two numbers.
        times = 80;
        do{
            if(puzzle[times] === first){
                puzzle[times] = second;

            }else if(puzzle[times] === second){
                puzzle[times] = first;
            }
        }while(times--);
    }while(loop_counter--);

    // Switch columns between different blocks of 3 columns 100 times.
    loop_counter = 99;
    do{
        // Pick a column number to switch.
        which = core_random_integer({
          'max': 3,
        });

        // Pick two different blocks of 3 columns to switch the selected column number between.
        first = core_random_integer({
          'max': 3,
        });
        do{
            second = core_random_integer({
              'max': 3,
            });
        }while(first === second);

        // Iterate through each value in the selected column.
        // Swap them between the two selected blocks of 3 columns.
        times = 8;
        do{
            var temp = puzzle[9 * times + 3 * first + which];
            puzzle[9 * times + 3 * first + which] = puzzle[9 * times + 3 * second + which];
            puzzle[9 * times + 3 * second + which] = temp;
        }while(times--);
    }while(loop_counter--);

    // Switch columns within a block of 3 columns 100 times.
    loop_counter = 99;
    do{
        // Pick the block of 3 columns in which to switch two columns.
        which = core_random_integer({
          'max': 3,
        });

        // Pick two different columns to switch.
        first = core_random_integer({
          'max': 3,
        });
        do{
            second = core_random_integer({
              'max': 3,
            });
        }while(first === second);

        // Iterate through each value and swap the values between the two selected columns.
        times = 8;
        do{
            var temp = puzzle[9 * times + 3 * which + first];
            puzzle[9 * times + 3 * which + first] = puzzle[9 * times + 3 * which + second];
            puzzle[9 * times + 3 * which + second] = temp;
        }while(times--);
    }while(loop_counter--);

    // Switch random rows within a block of 3 rows 100 times.
    loop_counter = 99;
    do{
        // Pick one of the 3 blocks of 3 rows.
        which = core_random_integer({
          'max': 3,
        });

        // Pick two different rows.
        first = core_random_integer({
          'max': 3,
        });
        do{
            second = core_random_integer({
              'max': 3,
            });
        }while(first === second);

        // Iterate through each value and swap the values between the two selected rows.
        times = 8;
        do{
            var temp = puzzle[which * 27 + first * 9 + times];
            puzzle[which * 27 + first * 9 + times] = puzzle[which * 27 + second * 9 + times];
            puzzle[which * 27 + second * 9 + times] = temp;
        }while(times--);
    }while(loop_counter--);

    // Reset all buttons.
    loop_counter = 80;
    do{
        var element = document.getElementById(loop_counter);
        element.disabled = false;
        element.style.background = '#333';
        element.style.color = '#aaa';
        element.style.position = 'relative';
        element.value = ' ';
    }while(loop_counter--);

    // Add solutions to some random buttons.
    loop_counter = core_storage_data['locked'] - 1;
    if(loop_counter >= 0){
        do{
            first = core_random_integer({
              'max': 81,
            });
            var first_element = document.getElementById(first);
            var element_80 = document.getElementById(80 - first);

            first_element.disabled = true;
            element_80.disabled = true;

            first_element.style.background = '#777';
            element_80.style.background = '#777';

            first_element.style.color = '#000';
            element_80.style.color = '#000';

            first_element.value = puzzle[first];
            element_80.value = puzzle[80 - first];
        }while(loop_counter--);
    }
}

function repo_escape(){
    if(selected_button != -1){
        display_number_select(selected_button);
    }
}

function repo_init(){
    core_repo_init({
      'keybinds': {
        67: {
          'todo': check,
        },
        71: {
          'todo': function(){
              generate_puzzle(false);
          },
        },
      },
      'storage': {
        'locked': 15,
        'y-margin': 50,
      },
      'storage-menu': '<input id=locked maxlength=2>*2 &gt; Locked<br><input id=y-margin>Y Margin',
      'title': 'Sudoku.htm',
    });

    // Create buttons and add to game-div.
    var loop_counter = 80;
    var output = '';
    do{
        output +=
          '<input class=gridbuttonclickable id='
          + loop_counter
          + ' onclick=display_number_select('
          + loop_counter
          + ') type=button>';
        if(loop_counter % 9 === 0
          && loop_counter !== 0){
            output += '<br>';
        }
    }while(loop_counter--);
    document.getElementById('game-div').innerHTML = output;

    // Setup margins.
    loop_counter = 8;
    do{
        document.getElementById(3 + 9 * loop_counter).style.marginRight = '5px';
        document.getElementById(27 + loop_counter).style.marginBottom = '5px';
        document.getElementById(54 + loop_counter).style.marginBottom = '5px';
        document.getElementById(6 + 9 * loop_counter).style.marginRight = '5px';
    }while(loop_counter--);

    // Setup number-select.
    document.getElementById('number-select').style.position = 'fixed';
    document.getElementById('number-select').style.zIndex = 1;

    generate_puzzle(true);

    document.getElementById('check').onclick = check;
    document.getElementById('generate').onclick = function(){
        generate_puzzle(false);
    };

    // Setup select-X onclicks.
    loop_counter = 9;
    do{
        document.getElementById('select-' + loop_counter).onclick = function(){
            var id = this.id;
            select_number(id.substring(id.indexOf('-') + 1));
        };
    }while(loop_counter--);

    window.onresize
      = window.onscroll = function(e){
        // Update position of number select if visible.
        if(selected_button != -1){
            update_number_select(selected_button);
        }
    };
}

function select_number(number){
    document.getElementById(selected_button).value = number > 0
      ? number
      : ' ';
    selected_button = -1;
    document.getElementById('number-select').style.display = 'none';
}

function update_number_select(id){
    // Make sure the number select box doesn't go past the left/right edges.
    var xpos = document.getElementById(id).offsetLeft - 100 - window.pageXOffset;
    if(xpos < 0){
        xpos = 0;

    }else if(xpos > window.innerWidth - 150){
        xpos = window.innerWidth - 150;
    }

    var number_select = document.getElementById('number-select');
    number_select.style.left = xpos + 'px';

    // There is no worry of the number select box going past the top/bottom edges.
    number_select.style.top  =
      (document.getElementById(id).offsetTop  - 50 - window.pageYOffset)
      + 'px';
}

var puzzle = [];
var selected_button = -1;
var times = 0;
