'use strict';

function check(){
    let complete = true;
    let win = true;
    let loop_counter = 80;
    do{
        const button_value = document.getElementById(loop_counter).value;

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
    let loop_counter = 80;
    do{
        document.getElementById(loop_counter).style.zIndex = 0;
    }while(loop_counter--);

    if(selected_button === -1
      || selected_button !== id){
        selected_button = id;
        document.getElementById(selected_button).style.zIndex = 2;
        update_number_select(id);
        document.getElementById('number-select').style.display = 'block';

    }else{
        selected_button = -1;
        document.getElementById('number-select').style.display = 'none';
    }
}

function generate_puzzle(){
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
            const temp = puzzle[9 * times + 3 * first + which];
            puzzle[9 * times + 3 * first + which] = puzzle[9 * times + 3 * second + which];
            puzzle[9 * times + 3 * second + which] = temp;
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
            const temp = puzzle[9 * times + 3 * which + first];
            puzzle[9 * times + 3 * which + first] = puzzle[9 * times + 3 * which + second];
            puzzle[9 * times + 3 * which + second] = temp;
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
            const temp = puzzle[which * 27 + first * 9 + times];
            puzzle[which * 27 + first * 9 + times] = puzzle[which * 27 + second * 9 + times];
            puzzle[which * 27 + second * 9 + times] = temp;
        }while(times--);
    }while(loop_counter--);

    loop_counter = 80;
    do{
        const element = document.getElementById(loop_counter);
        element.disabled = false;
        element.style.backgroundColor = '#333';
        element.style.color = '#aaa';
        element.style.position = 'relative';
        element.value = ' ';
    }while(loop_counter--);

    loop_counter = core_storage_data['locked'] - 1;
    if(loop_counter >= 0){
        do{
            first = core_random_integer({
              'max': 81,
            });
            let element = document.getElementById(first);
            element.disabled = true;
            element.style.backgroundColor = '#777';
            element.style.color = '#000';
            element.value = puzzle[first];

            element = document.getElementById(80 - first);
            element.disabled = true;
            element.style.backgroundColor = '#777';
            element.style.color = '#000';
            element.value = puzzle[80 - first];
        }while(loop_counter--);
    }
}

function hint(){
    const valid = [];

    var loop_counter = 80;
    do{
        if(document.getElementById(loop_counter).value === ' '){
            valid.push(loop_counter);
        }
    }while(loop_counter--);

    if(valid.length === 0){
        return;
    }

    document.getElementById('number-select').style.display = 'none';

    const random_button = core_random_integer({
      'max': valid.length,
    });
    const element = document.getElementById(valid[random_button]);
    element.disabled = true;
    element.style.backgroundColor = '#700';
    element.style.color = '#fff';
    element.value = puzzle[valid[random_button]];
}

function select_number(number){
    if(selected_button === -1){
        return;
    }

    document.getElementById(selected_button).value = number > 0
      ? number
      : ' ';
    selected_button = -1;
    document.getElementById('number-select').style.display = 'none';
}

function update_number_select(id){
    const element = document.getElementById(id);

    let xpos = element.offsetLeft - 100 - globalThis.pageXOffset;
    if(xpos < 0){
        xpos = 0;

    }else if(xpos > globalThis.innerWidth - 150){
        xpos = globalThis.innerWidth - 150;
    }

    const number_select = document.getElementById('number-select');
    number_select.style.left = xpos + 'px';
    number_select.style.top = (element.offsetTop  - 50 - globalThis.pageYOffset) + 'px';
}
