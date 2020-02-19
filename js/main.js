'use strict';

function repo_escape(){
    if(selected_button !== -1){
        display_number_select(selected_button);
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'check': {
          'onclick': check,
        },
        'generate': {
          'onclick': generate_puzzle,
        },
      },
      'globals': {
        'puzzle': [],
        'selected_button': -1,
      },
      'info': '<input id=generate type=button value="Generate New Puzzle"><input id=check type=button value="Check Solution">',
      'menu': true,
      'storage': {
        'locked': 15,
      },
      'storage-menu': '<table><tr><td><input id=locked maxlength=2><td>*2 &gt; Locked</table>',
      'title': 'Sudoku.htm',
    });

    // Create buttons and add to game-div.
    let loop_counter = 80;
    let output = '';
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
    let element = document.getElementById('game-div');
    element.innerHTML = output;
    element.style.marginTop = '50px';
    element.style.minWidth = '600px';

    // Setup margins.
    loop_counter = 8;
    do{
        document.getElementById(3 + 9 * loop_counter).style.marginRight = '5px';
        document.getElementById(27 + loop_counter).style.marginBottom = '5px';
        document.getElementById(54 + loop_counter).style.marginBottom = '5px';
        document.getElementById(6 + 9 * loop_counter).style.marginRight = '5px';
    }while(loop_counter--);

    // Setup number-select.
    element = document.getElementById('number-select');
    element.style.position = 'fixed';
    element.style.zIndex = 1;

    generate_puzzle();

    // Setup select-X onclicks.
    loop_counter = 9;
    do{
        document.getElementById('select-' + loop_counter).onclick = function(){
            const id = this.id;
            select_number(id.substring(id.indexOf('-') + 1));
        };
    }while(loop_counter--);

    globalThis.onresize
      = globalThis.onscroll = function(e){
        // Update position of number select if visible.
        if(selected_button !== -1){
            update_number_select(selected_button);
        }
    };
}
