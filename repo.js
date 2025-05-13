'use strict';

function check(){
    let complete = true;
    let win = true;
    let loop_counter = 80;
    do{
        const button_value = core_elements[loop_counter].textContent;

        if(Number(button_value) !== puzzle[loop_counter]){
            if(button_value === ' '){
                complete = false;
            }
            win = false;
            break;
        }
    }while(loop_counter--);

    let message = 'Correct!';
    if(!complete){
        message = 'You must fill in all the numbers.';

    }else if(!win){
        message = 'Incorrect! Try again.';
    }

    globalThis.alert(message);
}

function display_number_select(id){
    if(selected_button === -1
      || selected_button !== id){
        selected_button = id;

        const style = core_elements['number-select'].style;
        style.display = 'block';
        style.left = Math.max(
          0,
          Math.min(
            globalThis.innerWidth - 250,
            core_elements[id].offsetLeft - 100 - globalThis.pageXOffset
          )
        ) + 'px';
        style.top = (core_elements[id].offsetTop - 50 - globalThis.pageYOffset) + 'px';

    }else{
        hide_number_select();
    }
}

function generate_puzzle(confirm){
    if(confirm === true
      && !globalThis.confirm('Generate new puzzle?')){
        return;
    }

    core_storage_save();

    let first = 0;
    let second = 0;
    let which = 0;

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

    let loop_counter = 99;
    do{
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

        let times = 80;
        do{
            if(puzzle[times] === first){
                puzzle[times] = second;

            }else if(puzzle[times] === second){
                puzzle[times] = first;
            }
        }while(times--);
    }while(loop_counter--);

    loop_counter = 99;
    do{
        which = core_random_integer({
          'max': 3,
        });

        first = core_random_integer({
          'max': 3,
        });
        do{
            second = core_random_integer({
              'max': 3,
            });
        }while(first === second);

        let times = 8;
        do{
            const first_value = 9 * times + 3 * first + which;
            const second_value = 9 * times + 3 * second + which;
            [puzzle[first_value], puzzle[second_value]] = [puzzle[second_value], puzzle[first_value]];
        }while(times--);
    }while(loop_counter--);

    loop_counter = 99;
    do{
        which = core_random_integer({
          'max': 3,
        });

        first = core_random_integer({
          'max': 3,
        });
        do{
            second = core_random_integer({
              'max': 3,
            });
        }while(first === second);

        let times = 8;
        do{
            const first_value = 9 * times + 3 * which + first;
            const second_value = 9 * times + 3 * which + second;
            [puzzle[first_value], puzzle[second_value]] = [puzzle[second_value], puzzle[first_value]];
        }while(times--);
    }while(loop_counter--);

    loop_counter = 99;
    do{
        which = core_random_integer({
          'max': 3,
        });

        first = core_random_integer({
          'max': 3,
        });
        do{
            second = core_random_integer({
              'max': 3,
            });
        }while(first === second);

        let times = 8;
        do{
            const first_value = which * 27 + first * 9 + times;
            const second_value = which * 27 + second * 9 + times;
            [puzzle[first_value], puzzle[second_value]] = [puzzle[second_value], puzzle[first_value]];
        }while(times--);
    }while(loop_counter--);

    loop_counter = 80;
    do{
        const element = core_elements[loop_counter];
        element.disabled = false;
        element.style.backgroundColor = '';
        element.style.color = '#aaa';
        element.style.position = 'relative';
        element.textContent = ' ';
    }while(loop_counter--);

    loop_counter = Math.floor(core_storage_data['locked']) - 1;
    if(loop_counter >= 0){
        do{
            first = core_random_integer({
              'max': 81,
            });
            let element = core_elements[first];
            element.disabled = true;
            element.style.backgroundColor = '#777';
            element.style.color = '#000';
            element.textContent = puzzle[first];

            element = core_elements[80 - first];
            element.disabled = true;
            element.style.backgroundColor = '#777';
            element.style.color = '#000';
            element.textContent = puzzle[80 - first];
        }while(loop_counter--);
    }
}

function hide_number_select(){
    selected_button = -1;
    core_elements['number-select'].style.display = 'none';
}

function hint(confirm){
    if(confirm === true
      && !globalThis.confirm('Add 1 hint?')){
        return;
    }

    const valid = [];

    let loop_counter = 80;
    do{
        if(core_elements[loop_counter].textContent === ' '){
            valid.push(loop_counter);
        }
    }while(loop_counter--);

    if(valid.length === 0){
        return;
    }

    core_elements['number-select'].style.display = 'none';

    const random_button = core_random_integer({
      'max': valid.length,
    });
    const element = core_elements[valid[random_button]];
    element.disabled = true;
    element.style.backgroundColor = '#700';
    element.style.color = '#fff';
    element.textContent = puzzle[valid[random_button]];
}

function repo_escape(){
    hide_number_select();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            event.preventDefault();
        },
      },
      'events': {
        'check': {
          'onclick': check,
        },
        'generate': {
          'onclick': function(){
              generate_puzzle(true);
          },
        },
        'hint': {
          'onclick': function(){
              hint(true);
          },
        },
      },
      'globals': {
        'puzzle': [],
        'selected_button': -1,
      },
      'keybinds': {
        'Backspace': {
          'todo': function(){
              select_number(-1);
          },
        },
        'Digit0': {
          'todo': function(){
              select_number(0);
          },
        },
        'Digit1': {
          'todo': function(){
              select_number(1);
          },
        },
        'Digit2': {
          'todo': function(){
              select_number(2);
          },
        },
        'Digit3': {
          'todo': function(){
              select_number(3);
          },
        },
        'Digit4': {
          'todo': function(){
              select_number(4);
          },
        },
        'Digit5': {
          'todo': function(){
              select_number(5);
          },
        },
        'Digit6': {
          'todo': function(){
              select_number(6);
          },
        },
        'Digit7': {
          'todo': function(){
              select_number(7);
          },
        },
        'Digit8': {
          'todo': function(){
              select_number(8);
          },
        },
        'Digit9': {
          'todo': function(){
              select_number(9);
          },
        },
      },
      'storage': {
        'locked': 15,
      },
      'storage-menu': '<table><tr><td><input class=mini id=locked min=0 step=1 type=number><td>*2 &gt; Locked</table>',
      'title': 'Sudoku.htm',
      'ui-elements': [
        'number-select',
      ],
    });

    let loop_counter = 80;
    let output = '';
    do{
        output +=
          '<button class=gridbuttonclickable id='
          + loop_counter
          + ' onclick=display_number_select('
          + loop_counter
          + ') type=button></button>';
        if(loop_counter % 9 === 0){
            output += '<br>';
        }
    }while(loop_counter--);
    const element = document.getElementById('game-div');
    element.innerHTML = output;
    element.style.minWidth = '500px';

    loop_counter = 80;
    do{
        core_elements[loop_counter] = document.getElementById(loop_counter);
    }while(loop_counter--);

    loop_counter = 8;
    do{
        core_elements[3 + 9 * loop_counter].style.marginRight = '5px';
        core_elements[27 + loop_counter].style.marginBottom = '5px';
        core_elements[54 + loop_counter].style.marginBottom = '5px';
        core_elements[6 + 9 * loop_counter].style.marginRight = '5px';
    }while(loop_counter--);

    core_elements['number-select'].style.position = 'fixed';

    generate_puzzle();

    loop_counter = 9;
    do{
        core_elements['select-' + loop_counter] = document.getElementById('select-' + loop_counter);
        core_elements['select-' + loop_counter].onclick = function(){
            const id = this.id;
            select_number(id.substring(id.indexOf('-') + 1));
        };
    }while(loop_counter--);

    document.documentElement.onclick = function(event){
        if(!event.target.id
          || globalThis.isNaN(event.target.id)){
            hide_number_select();
        }
    };
}

function select_number(number){
    if(selected_button === -1){
        return;
    }

    core_elements[selected_button].textContent = number > 0
      ? number
      : ' ';
    hide_number_select();
}
