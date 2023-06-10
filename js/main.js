'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'check': {
          'onclick': check,
        },
        'generate': {
          'onclick': generate_puzzle,
        },
        'hint': {
          'onclick': hint,
        },
      },
      'globals': {
        'puzzle': [],
        'selected_button': -1,
      },
      'info': '<input id=generate type=button value="Generate New Puzzle"><br>'
        + '<input id=hint type=button value="Add 1 Hint"><input id=check type=button value="Check Solution">',
      'keybinds': {
        8: {
          'todo': function(){
              select_number(-1);
          },
        },
        46: {
          'todo': function(){
              select_number(-1);
          },
        },
        48: {
          'todo': function(){
              select_number(0);
          },
        },
        49: {
          'todo': function(){
              select_number(1);
          },
        },
        50: {
          'todo': function(){
              select_number(2);
          },
        },
        51: {
          'todo': function(){
              select_number(3);
          },
        },
        52: {
          'todo': function(){
              select_number(4);
          },
        },
        53: {
          'todo': function(){
              select_number(5);
          },
        },
        54: {
          'todo': function(){
              select_number(6);
          },
        },
        55: {
          'todo': function(){
              select_number(7);
          },
        },
        56: {
          'todo': function(){
              select_number(8);
          },
        },
        57: {
          'todo': function(){
              select_number(9);
          },
        },
      },
      'storage': {
        'locked': 15,
      },
      'storage-menu': '<table><tr><td><input class=mini id=locked min=0 step=any type=number><td>*2 &gt; Locked</table>',
      'title': 'Sudoku.htm',
    });

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

    loop_counter = 8;
    do{
        document.getElementById(3 + 9 * loop_counter).style.marginRight = '5px';
        document.getElementById(27 + loop_counter).style.marginBottom = '5px';
        document.getElementById(54 + loop_counter).style.marginBottom = '5px';
        document.getElementById(6 + 9 * loop_counter).style.marginRight = '5px';
    }while(loop_counter--);

    element = document.getElementById('number-select');
    element.style.position = 'fixed';
    element.style.zIndex = 1;

    generate_puzzle();

    loop_counter = 9;
    do{
        document.getElementById('select-' + loop_counter).onclick = function(){
            const id = this.id;
            select_number(id.substring(id.indexOf('-') + 1));
        };
    }while(loop_counter--);

    globalThis.onresize
      = globalThis.onscroll = function(e){
        if(selected_button !== -1){
            update_number_select(selected_button);
        }
    };
}
