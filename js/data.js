'use strict';

function check(){
    // Check if every button has correct solution on it.
    let win = true;
    let loop_counter = 80;
    do{
        if(document.getElementById(loop_counter).value !== puzzle[loop_counter]){
            win = false;
            break;
        }
    }while(loop_counter--);

    globalThis.alert(
      win
        ? 'Correct! You win!'
        : 'Incorrect, try again.'
    );
}

function display_number_select(id){
    // Reset button zIndex values.
    let loop_counter = 80;
    do{
        document.getElementById(loop_counter).style.zIndex = 0;
    }while(loop_counter--);

    if(selected_button === -1
      || selected_button !== id){
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

function generate_puzzle(){
    core_storage_save();

    let first = 0;
    let second = 0;
    let which = 0;

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
    let loop_counter = 99;
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
        let times = 80;
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
        let times = 8;
        do{
            const temp = puzzle[9 * times + 3 * first + which];
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
        let times = 8;
        do{
            const temp = puzzle[9 * times + 3 * which + first];
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
        let times = 8;
        do{
            const temp = puzzle[which * 27 + first * 9 + times];
            puzzle[which * 27 + first * 9 + times] = puzzle[which * 27 + second * 9 + times];
            puzzle[which * 27 + second * 9 + times] = temp;
        }while(times--);
    }while(loop_counter--);

    // Reset all buttons.
    loop_counter = 80;
    do{
        const element = document.getElementById(loop_counter);
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
            let element = document.getElementById(first);
            element.disabled = true;
            element.style.background = '#777';
            element.style.color = '#000';
            element.value = puzzle[first];

            element = document.getElementById(80 - first);
            element.disabled = true;
            element.style.background = '#777';
            element.style.color = '#000';
            element.value = puzzle[80 - first];
        }while(loop_counter--);
    }
}

function select_number(number){
    document.getElementById(selected_button).value = number > 0
      ? number
      : ' ';
    selected_button = -1;
    document.getElementById('number-select').style.display = 'none';
}

function update_number_select(id){
    const element = document.getElementById(id);

    // Make sure the number select box doesn't go past the left/right edges.
    let xpos = element.offsetLeft - 100 - globalThis.pageXOffset;
    if(xpos < 0){
        xpos = 0;

    }else if(xpos > globalThis.innerWidth - 150){
        xpos = globalThis.innerWidth - 150;
    }

    const number_select = document.getElementById('number-select');
    number_select.style.left = xpos + 'px';

    // There is no worry of the number select box going past the top/bottom edges.
    number_select.style.top = (element.offsetTop  - 50 - globalThis.pageYOffset) + 'px';
}
