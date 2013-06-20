function check(){
    /* check if every button has correct solution on it */
    j = 1;
    i = 80;

    do{
        if(get(i).value != u[i]){
            j = 0;
            break;
        }
    }while(i--);

    alert(j ? 'Correct! You win!' : 'Sorry, try again.');
}

function display_number_select(i){
    /* reset button zIndex values */
    j = 80;
    do{
        get(j).style.zIndex = 0;
    }while(j--);

    if(selected_button == -1 || selected_button != i){
        selected_button = i;

        /* increase zIndex of selected button */
        get(selected_button).style.zIndex = 2;

        /* display number-select behind selected button */
        get('number-select').style.left = (get(i).offsetLeft - 50) + 'px';
        get('number-select').style.top = (get(i).offsetTop - 50) + 'px';
        get('number-select').style.display = 'block';

    }else{
        /* hide number select */
        selected_button = -1;
        get('number-select').style.display = 'none';
    }
}

function generate_puzzle(){
    save();

    j = 0;
    m = 0;
    q = 0;

    /* base sudoku puzzle */
    u = [
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

    /* switch all instances of two random numbers 100 times */
    i = 99;
    do{
        /* pick two different numbers between 1 and 9 */
        j = Math.ceil(Math.random() * 9);
        do{
            q = Math.ceil(Math.random() * 9);
        }while(j == q);

        /* iterate through all buttons and switch those two numbers */
        t = 80;
        do{
            if(u[t] == j){
                u[t] = q;

            }else if(u[t] == q){
                u[t] = j;
            }
        }while(t--);
    }while(i--);

    /* switch columns between different blocks of 3 columns 100 times */
    i = 99;
    do{
        /* pick a column number to switch */
        m = random_number(3);

        /* pick two different blocks of 3 columns to switch the selected column number between */
        j = random_number(3);
        do{
            q = random_number(3);
        }while(j == q);

        /* iterate through each value in the selected column and swap them between the two selected blocks of 3 columns */
        t = 8;
        do{
            var temp = u[9 * t + 3 * j + m];
            u[9 * t + 3 * j + m] = u[9 * t + 3 * q + m];
            u[9 * t + 3 * q + m] = temp;
        }while(t--);
    }while(i--);

    /* switch columns within a block of 3 columns 100 times */
    i = 99;
    do{
        /* pick the block of 3 columns in which to switch two columns */
        m = random_number(3);

        /* pick two different columns to switch */
        j = random_number(3);
        do{
            q = random_number(3);
        }while(j == q);

        /* iterate through each value and swap the values between the two selected columns */
        t = 8;
        do{
            var temp = u[9 * t + 3 * m + j];
            u[9 * t + 3 * m + j] = u[9 * t + 3 * m + q];
            u[9 * t + 3 * m + q] = temp;
        }while(t--);
    }while(i--);

    /* switch random rows within a block of 3 rows 100 times */
    i = 99;
    do{
        /* pick one of the 3 blocks of 3 rows */
        m = random_number(3);

        /* pick two different rows */
        j = random_number(3);
        do{
            q = random_number(3);
        }while(j == q);

        /* iterate through each value and swap the values between the two selected rows */
        t = 8;
        do{
            var temp = u[m * 27 + j * 9 + t];
            u[m * 27 + j * 9 + t] = u[m * 27 + q * 9 + t];
            u[m * 27 + q * 9 + t] = temp;
        }while(t--);
    }while(i--);

    /* reset all buttons */
    i = 80;
    do{
        get(i).disabled = 0;
        get(i).style.background = '#333';
        get(i).style.color = '#aaa';
        get(i).value = '';
    }while(i--);

    /* add solutions to some random buttons */
    i = get('locked').value - 1;
    do{
        j = random_number(81);

        get(j).disabled = 1;
        get(80 - j).disabled = 1;

        get(j).style.background = '#777';
        get(80 - j).style.background = '#777';

        get(j).style.color = '#000';
        get(80 - j).style.color = '#000';

        get(j).value = u[j];
        get(80 - j).value = u[80 - j];
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

function select_number(i){
    get(s).value = i > 0 ? i : '';
    s = -1;
    get('number-select').style.display = 'none';
}

function showhide(){
    i = get('showhide-button').value === '-' ? 1 : 0;
    get('settings-span').style.display = ['inline', 'none'][i];
    get('showhide-button').value = ['-', '+'][i];
}

var i = 80;
var j = [];
var ls = window.localStorage;
var m = 0;
var q = 0;
var selected_button = -1;
var t = 0;
var u = [];

get('audio-volume').value = ls.getItem('sudoku-0') === null ? 1 : parseFloat(ls.getItem('sudoku-0'));
get('locked').value = ls.getItem('sudoku-1') === null ? 15 : parseInt(ls.getItem('sudoku-1'));

/* create buttons and add to game-area */
do{
    j.push('<input class=buttons id=' + i + ' onclick=display_number_select(' + i + ') style=background:#333 type=button>');
    if(i % 9 === 0 && i !== 0){
        j.push('<br>');
    }
}while(i--);
get('game-area').innerHTML = j.join('');

/* setup margins */
i = 8;
do{
    get(3 + 9 * i).style.marginRight = '5px';
    get(27 + i).style.marginBottom = '5px';
    get(54 + i).style.marginBottom = '5px';
    get(6 + 9 * i).style.marginRight = '5px';
}while(i--);

generate_puzzle();
