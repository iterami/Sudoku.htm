function check(){
    // check if every button has correct solution on it
    var win = 1;
    i = 80;
    do{
        if(get(i).value != puzzle[i]){
            win = 0;
            break;
        }
    }while(i--);

    alert(win ? 'Correct! You win!' : 'Sorry, try again.');
}

function display_number_select(id){
    // reset button zIndex values
    i = 80;
    do{
        get(i).style.zIndex = 0;
    }while(i--);

    if(selected_button == -1 || selected_button != id){
        selected_button = id;

        // increase zIndex of selected button
        get(selected_button).style.zIndex = 2;

        // display number-select behind selected button
        update_number_select(id);
        get('number-select').style.display = 'block';

    }else{
        // hide number select
        selected_button = -1;
        get('number-select').style.display = 'none';
    }
}

function generate_puzzle(){
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
        get(i).disabled = 0;
        get(i).style.background = '#333';
        get(i).style.color = '#aaa';
        get(i).value = '';
    }while(i--);

    // add solutions to some random buttons
    i = get('locked').value - 1;
    do{
        first = random_number(81);

        get(first).disabled = 1;
        get(80 - first).disabled = 1;

        get(first).style.background = '#777';
        get(80 - first).style.background = '#777';

        get(first).style.color = '#000';
        get(80 - first).style.color = '#000';

        get(first).value = puzzle[first];
        get(80 - first).value = puzzle[80 - first];
    }while(i--);
}

function get(i){
    return document.getElementById(i);
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function reset(){
    if(confirm('Reset settings?')){
        get('audio-volume').value = 1;
        get('locked').value = 15;
        save();
    }
}

function save(){
    i = 1;
    j = [
        'audio-volume',
        'locked'
    ];
    do{
        if(isNaN(get(j[i]).value) || get(j[i]).value === [1, 15][i] || get(j[i]).value < [0, 1][i]){
            ls.removeItem('sudoku-' + i);
            get(j[i]).value = [
                1,
                15
            ][i];
        }else{
            ls.setItem(
                'sudoku-' + i,
                get(j[i]).value
            );
        }
    }while(i--);
    j = 0;
}

function select_number(number){
    get(selected_button).value = number > 0 ? number : '';
    selected_button = -1;
    get('number-select').style.display = 'none';
}

function showhide(){
    i = get('showhide-button').value === '-' ? 1 : 0;
    get('settings-span').style.display = ['inline', 'none'][i];
    get('showhide-button').value = ['-', '+'][i];
}

function update_number_select(id){
    get('number-select').style.left = (get(id).offsetLeft - 50 - window.pageXOffset) + 'px';
    get('number-select').style.top  = (get(id).offsetTop  - 50 - window.pageYOffset) + 'px';
}

var i = 80;
var j = [];
var ls = window.localStorage;
var puzzle = [];
var selected_button = -1;
var times = 0;

get('audio-volume').value = ls.getItem('sudoku-0') === null ? 1 : parseFloat(ls.getItem('sudoku-0'));
get('locked').value = ls.getItem('sudoku-1') === null ? 15 : parseInt(ls.getItem('sudoku-1'));

// create buttons and add to game-area
do{
    j.push('<input class=buttons id=' + i + ' onclick=display_number_select(' + i + ') style=background:#333 type=button>');
    if(i % 9 === 0 && i !== 0){
        j.push('<br>');
    }
}while(i--);
get('game-area').innerHTML = j.join('');

// setup margins
i = 8;
do{
    get(3 + 9 * i).style.marginRight = '5px';
    get(27 + i).style.marginBottom   = '5px';
    get(54 + i).style.marginBottom   = '5px';
    get(6 + 9 * i).style.marginRight = '5px';
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
