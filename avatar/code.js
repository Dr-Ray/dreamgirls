
window.onload = init;

function init() {
    state.i = 1;
    state.j = 1;
    state.k = 1;
}

var state = {
    i: 0,
    j: 0,
    k: 0
};

function nextdress() {
    var dress = document.getElementById("clothes");
    if (state.i === 0) {
        dress.setAttribute("class", "dress1");
        state.i++;
    }
    else
        if (state.i === 1) {
            dress.setAttribute("class", "dress2");
            state.i++;
        }
        else
            if (state.i === 2) {
                dress.setAttribute("class", "dress3");
                state.i = 0;
            }

}

function nextshoe() {
    var shoe = document.getElementById("shoes");
    if (state.j === 0) {
        shoe.setAttribute("class", "shoe1");
        state.j++;
    }
    else
        if (state.j === 1) {
            shoe.setAttribute("class", "shoe2");
            state.j++;
        }
        else
            if (state.j === 2) {
                shoe.setAttribute("class", "shoe3");
                state.j = 0;
            }

}

function nexthair() {
    console.log("inside function nexthair");

    var hairf = document.getElementById("hairfront");
    var hairb = document.getElementById("hairback");
    hairb.setAttribute("class", "hairback");

    if (state.k === 0) {
        hairf.setAttribute("class", "hairfront1");
        state.k++;
    }
    else
        if (state.k === 1) {
            hairf.setAttribute("class", "hairfront2");
            state.k++;
        }
        else
            if (state.k === 2) {
                hairf.setAttribute("class", "hairfront3");
                state.k = 0;
            }

}