'use strict';

function check(){
    let complete = true;
    let win = true;
    for(let i = 0; i < 81; i++){
        const button_value = core_elements[i].textContent;

        if(Number(button_value) !== puzzle[i]){
            if(button_value === ''){
                complete = false;
            }
            win = false;
            break;
        }
    }

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

        const style = core_elements.numbers.style;
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

    for(let i = 0; i < 100; i++){
        const choices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const first = core_random_splice(choices);
        const second = core_random_splice(choices);

        for(let j = 0; j < 9; j++){
            if(puzzle[j] === first){
                puzzle[j] = second;

            }else if(puzzle[j] === second){
                puzzle[j] = first;
            }
        }
    }

    for(let i = 0; i < 100; i++){
        const choices = [0, 1, 2];
        const first = core_random_splice(choices);
        const second = core_random_splice(choices);
        const which = core_random_integer(3);

        for(let j = 0; j < 9; j++){
            const first_value = 9 * j + 3 * first + which;
            const second_value = 9 * j + 3 * second + which;
            [puzzle[first_value], puzzle[second_value]] = [puzzle[second_value], puzzle[first_value]];
        }
    }

    for(let i = 0; i < 100; i++){
        const choices = [0, 1, 2];
        const first = core_random_splice(choices);
        const second = core_random_splice(choices);
        const which = core_random_integer(3);

        for(let j = 0; j < 9; j++){
            const first_value = 9 * j + 3 * which + first;
            const second_value = 9 * j + 3 * which + second;
            [puzzle[first_value], puzzle[second_value]] = [puzzle[second_value], puzzle[first_value]];
        }
    }

    for(let i = 0; i < 100; i++){
        const choices = [0, 1, 2];
        const first = core_random_splice(choices);
        const second = core_random_splice(choices);
        const which = core_random_integer(3);

        for(let j = 0; j < 9; j++){
            const first_value = which * 27 + first * 9 + j;
            const second_value = which * 27 + second * 9 + j;
            [puzzle[first_value], puzzle[second_value]] = [puzzle[second_value], puzzle[first_value]];
        }
    }

    core_elements.game.style.minWidth = (core_elements[0].offsetWidth * 9 + 40) + 'px';
    for(let i = 0; i < 81; i++){
        const element = core_elements[i];
        element.disabled = false;
        element.style.backgroundColor = '';
        element.style.color = '#aaa';
        element.style.height = core_storage_data.size;
        element.style.width = core_storage_data.size;
        element.textContent = '';

        const font = Math.ceil(element.offsetWidth / 1.5) + 'px';
        element.style.fontSize = font;
        element.style.lineHeight = font;
    }
    for(let i = 0; i < core_storage_data.locked; i++){
        const id = core_random_integer(81);
        let element = core_elements[id];
        element.disabled = true;
        element.style.backgroundColor = '#777';
        element.style.color = '#000';
        element.textContent = puzzle[id];

        element = core_elements[80 - id];
        element.disabled = true;
        element.style.backgroundColor = '#777';
        element.style.color = '#000';
        element.textContent = puzzle[80 - id];
    }
}

function hide_number_select(){
    selected_button = -1;
    core_elements.numbers.style.display = 'none';
}

function hint(confirm){
    if(confirm === true
      && !globalThis.confirm('Add 1 hint?')){
        return;
    }

    const valid = [];

    for(let i = 0; i < 81; i++){
        if(core_elements[i].textContent === ''){
            valid.push(i);
        }
    }

    if(valid.length === 0){
        return;
    }

    core_elements.numbers.style.display = 'none';

    const random_button = core_random_integer(valid.length);
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
          'down': function(){
              select_number(-1);
          },
        },
        'Digit0': {
          'down': function(){
              select_number(0);
          },
        },
        'Digit1': {
          'down': function(){
              select_number(1);
          },
        },
        'Digit2': {
          'down': function(){
              select_number(2);
          },
        },
        'Digit3': {
          'down': function(){
              select_number(3);
          },
        },
        'Digit4': {
          'down': function(){
              select_number(4);
          },
        },
        'Digit5': {
          'down': function(){
              select_number(5);
          },
        },
        'Digit6': {
          'down': function(){
              select_number(6);
          },
        },
        'Digit7': {
          'down': function(){
              select_number(7);
          },
        },
        'Digit8': {
          'down': function(){
              select_number(8);
          },
        },
        'Digit9': {
          'down': function(){
              select_number(9);
          },
        },
      },
      'storage': {
        'locked': 15,
        'size': '50px',
      },
      'storage_menu': '<table><tr><td><input class=mini id=locked min=0 step=1 type=number><td>*2 &gt; Locked'
        + '<tr><td><input class=mini id=size type=text><td>Button Size</table>',
      'title': 'Sudoku.htm',
      'ui_elements': [
        'game',
        'numbers',
      ],
    });

    let output = '';
    for(let i = 0; i < 81; i++){
        output += '<button class=gridbuttonclickable id='
          + i
          + ' onclick=display_number_select('
          + i
          + ') type=button></button>';

        if((i + 1) % 9 === 0){
            output += '<br>';
        }
    }
    core_elements.game.innerHTML = output;

    for(let i = 0; i < 81; i++){
        core_elements[i] = document.getElementById(i);
    }
    for(let i = 0; i < 9; i++){
        core_elements[3 + 9 * i].style.marginRight = '5px';
        core_elements[27 + i].style.marginBottom = '5px';
        core_elements[54 + i].style.marginBottom = '5px';
        core_elements[6 + 9 * i].style.marginRight = '5px';
    }

    generate_puzzle();

    core_elements.numbers.style.position = 'fixed';
    for(let i = 0; i < 10; i++){
        core_elements['select_' + i] = document.getElementById('select_' + i);
        core_elements['select_' + i].onclick = function(){
            const id = this.id;
            select_number(id.substring(id.indexOf('_') + 1));
        };
    }
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
      : '';
    hide_number_select();
}
