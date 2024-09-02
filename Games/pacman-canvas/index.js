const canvas = document.querySelector('#canvas');
let scoreEl = document.querySelector('#score');
const c = canvas.getContext('2d');

canvas.height = 400;
canvas.width = innerWidth;

let beginSound = new Audio();
beginSound.src = './pacman_beginning.wav';

let sirenSound = new Audio();
sirenSound.src = './Pacman_Siren_Sound_Effect.mp3';

let chompSound = new Audio();

let score = 0;

class Boundary {
    static width = canvas.width / 23;
    static height = canvas.height / 15;
    constructor({position}) {
        this.position = position;
        this.width = canvas.width / 23;
        this.height = canvas.height / 15;
    }

    draw() {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 12;
    }

    draw() {
        c.fillStyle = 'yellow';
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Ghost {
    constructor({position, velocity, color="red"}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 12;
        this.color = color;
        this.prevCol = [];
    }

    draw() {
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Pellet {
    constructor({position}) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        c.fillStyle = 'white';
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }
}

class PowerUp {
    constructor({position}) {
        this.position = position;
        this.radius = 6;
    }

    draw() {
        c.fillStyle = 'white';
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }
}

const map = [
    ['0', '0', '0', '0', '0','0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '.', '.', '.', '.','.', '0', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.', '.', '.', '.', '.', 'p', '0'],
    ['0', '.', '.', '.', '.','p', '0', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '.', '.', '.','0', '0', '0', '.', '.', '.', '.', '0', '0', '0', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '.', '.', '.','.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '0', '.', '.', '.','.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '0'],
    ['-', '-', '.', '.', '.','.', '.', '.', '.', '0', '0', '.', '.', '0', '0', '.', '.', '0', '.', '.', '.', '-', '-'],
    ['-', '-', '.', '.', '.','.', '.', '.', '.', '0', '.', '.', '.', '.', '0', '.', '.', '0', '0', '0', '.', '-', '-'],
    ['-', '-', '.', '.', '0','0', '0', '.', '.', '0', '.', '.', '.', '.', '0', '.', '.', '0', '.', '.', '.', '-', '-'],
    ['0', '0', '.', '.', '.','0', '.', '.', '.', '0', '0', '0', '0', '0', '0', '.', '.', '0', '.', '.', '.', '0', '0'],
    ['0', '.', '.', '.', '.','0', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '.', '.', '.','.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '.', '0', '.','.', '.', '.', '0', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0', '.', '.', '0'],
    ['0', 'p', '.', '0', '.','.', '.', '.', '0', '.', '.', '.', 'p', '.', '.', '.', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '0', '0', '0', '0','0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
];

const boundaries = [];
const pellets = [];
const powerUps = [];
const ghosts = [
    new Ghost({
        position:{
            x:(Boundary.width * 10) + Boundary.width * 0.5,
            y:(Boundary.height * 7) + Boundary.height * 0.5
        },
        velocity:{
            x:1,
            y:0
        }
    })
];

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol) {
            case '0':
                boundaries.push(
                    new Boundary({
                        position:{
                            x:Boundary.width * j,
                            y:Boundary.height * i
                        }
                    })
                );
                break;
            case '.':
                pellets.push(
                    new Pellet({
                        position:{
                            x:(Boundary.width * j) + Boundary.width * 0.5,
                            y:(Boundary.height * i) + Boundary.height * 0.5
                        }
                    })
                );
                break;
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position:{
                            x:(Boundary.width * j) + Boundary.width * 0.5,
                            y:(Boundary.height * i) + Boundary.height * 0.5
                        }
                    })
                );
                break;
        }
    })
});


const player = new Player({
    position:{
        x:Boundary.width + Boundary.width * 0.5,
        y:Boundary.height + Boundary.height * 0.5
    },
    velocity:{
        x:0,
        y:0
    }
});
 
const keys = {
    up:{
        pressed:false
    },
    left:{
        pressed:false
    },
    down:{
        pressed:false
    },
    right:{
        pressed:false
    }
}

let lastKey = '';
window.addEventListener('keydown', ({key}) => {
    // console.log(key)
    switch(key) {
        case 'ArrowUp':
            keys.up.pressed = true;
            lastKey = 'up'
            break;
        case 'ArrowLeft':
            keys.left.pressed = true;
            lastKey = 'left'
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            lastKey = 'right'
            break;
        case 'ArrowDown':
            keys.down.pressed = true;
            lastKey = 'down'
            break;
    }
});
window.addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'ArrowUp':
            keys.up.pressed = false;
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        case 'ArrowDown':
            keys.down.pressed = false;
            break;
    }
});
function circleCollision({circle, rect}) {
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rect.position.y + rect.height &&
        circle.position.x + circle.radius + circle.velocity.x >= rect.position.x &&
        circle.position.y + circle.radius + circle.velocity.y >=rect.position.y &&
        circle.position.x - circle.radius + circle.velocity.x <= rect.position.x + rect.width
    )
}
let lastTime = 0;
function animate(timestamp) {
    lastTime = timestamp - lastTime;
    lastTime = timestamp;
    c.clearRect(0, 0, canvas.width, canvas.height);
    if(keys.up.pressed && lastKey == 'up') {
        player.velocity.x = 0;
        for(let i=0;i<boundaries.length; i+=1){
            const boundary = boundaries[i];
            if(circleCollision({
                circle: {...player, velocity: {
                    x:0,
                    y:-3
                }},
                rect: boundary
            }))
            {
                player.velocity.y = 0;
                break;
            }else {
                player.velocity.y = -3;
            }
        }
    }else if(keys.down.pressed && lastKey == 'down'){
        player.velocity.x = 0;
        for(let i=0;i<boundaries.length; i+=1){
            const boundary = boundaries[i];
            if(circleCollision({
                circle: {...player, velocity: {
                    x:0,
                    y:2
                }},
                rect: boundary
            }))
            {
                player.velocity.y = 0;
                break;
            }else {
                player.velocity.y = 3;
            }
        }
    }else if(keys.left.pressed && lastKey == 'left'){
        player.velocity.y = 0;
        for(let i=0;i<boundaries.length; i+=1){
            const boundary = boundaries[i];
            if(circleCollision({
                circle: {...player, velocity: {
                    x:-3,
                    y:0
                }},
                rect: boundary
            }))
            {
                player.velocity.x = 0;
                break;
            }else {
                player.velocity.x = -3;
            }
        }
    }else if(keys.right.pressed && lastKey == 'right'){
        player.velocity.y = 0;
        for(let i=0;i<boundaries.length; i+=1){
            const boundary = boundaries[i];
            if(circleCollision({
                circle: {...player, velocity: {
                    x:3,
                    y:0
                }},
                rect: boundary
            }))
            {
                player.velocity.x = 0;
                break;
            }else {
                player.velocity.x = 3;
            }
        }
    }

    if(player.position.x + player.radius + 0.01 < 0) {
        player.position.x = canvas.width - player.radius;
    }else if(player.position.x + player.radius + 0.01 > canvas.width) {
        player.position.x = 0;
    }

    for(let i=pellets.length -1;0 <= i;i--) {
        const pellet = pellets[i];
        pellet.draw();
        if(Math.hypot(
            pellet.position.x - player.position.x,
            pellet.position.y - player.position.y
        ) < pellet.radius + player.radius) {
            pellets.splice(i, 1);
            score +=10;
            scoreEl.innerHTML = score;
        }
    }

    if(pellets.length == 50) {
        console.log("Chase....>>>>")
        sirenSound.playbackRate += 0.1;
    }

    for(let i=powerUps.length-1; 0<=i; i--) {
        const powerUp = powerUps[i];
        powerUp.draw();
        if(Math.hypot(
            powerUp.position.x - player.position.x,
            powerUp.position.y - player.position.y
        ) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1);
            score +=50;
            scoreEl.innerHTML = score;
        }
    }

    boundaries.forEach(boundary => {
        boundary.draw();
        if(circleCollision({
            circle: player,
            rect: boundary
        })) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    }); 
    player.update();

    for(let i=ghosts.length-1; 0<=i; i--) {
        const ghost = ghosts[i];
        ghost.update();
        if(ghost.position.x + ghost.radius + 0.01 < 0) {
            ghost.position.x = canvas.width - ghost.radius;
        }else if(ghost.position.x + ghost.radius + 0.01 > canvas.width) {
            ghost.position.x = 0;
        }
        const collsions = [];
        boundaries.forEach(boundary => {
            if(
                !collsions.includes('right') &&
                circleCollision({
                    circle: {...ghost, velocity: {
                        x:2,
                        y:0
                    }},
                    rect: boundary
                })
            ) {
                collsions.push('right');
            }

            if(
                !collsions.includes('left') &&
                circleCollision({
                    circle: {...ghost, velocity: {
                        x:-2,
                        y:0
                    }},
                    rect: boundary
                }
            )) {
                collsions.push('left');
            }

            if(
                !collsions.includes('top') &&
                circleCollision({
                    circle: {...ghost, velocity: {
                        x:0,
                        y:-2
                    }},
                    rect: boundary
                })
            ) {
                collsions.push('top');
            }

            if(
                !collsions.includes('down') &&
                circleCollision({
                    circle: {...ghost, velocity: {
                        x:0,
                        y:2
                    }},
                    rect: boundary
                })
            ) {
                collsions.push('down');
            }
        });
        if(collsions.length > ghost.prevCol.length){
            ghost.prevCol = collsions;
        }

        // console.log(collsions);
        // console.log('prev',ghost.prevCol )

        if(JSON.stringify(collsions) != JSON.stringify(ghost.prevCol)) {
            console.log("Sed")
            if(ghost.velocity.x > 0) {
                ghost.prevCol.push('right');
            }
            else if(ghost.velocity.x < 0) {
                ghost.prevCol.push('left');
            }
            else if(ghost.velocity.y > 0) {
                ghost.prevCol.push('down');
            }
            else if(ghost.velocity.y < 0) {
                ghost.prevCol.push('up');
            }

            const pathways = ghost.prevCol.filter(collision => {
                return !collsions.includes(collision);
            });

            // console.log({pathways})

            const direction = pathways[Math.floor(Math.random() * pathways.length)];
            switch(direction) {
                case 'down':
                    ghost.velocity.x = 0;
                    ghost.velocity.y = 2;
                    break;
                case 'up':
                    ghost.velocity.x = 0;
                    ghost.velocity.y = -2;
                    break;
                case 'left':
                    ghost.velocity.x = -2;
                    ghost.velocity.y = 0;
                    break;
                case 'right':
                    ghost.velocity.x = 2;
                    ghost.velocity.y = 0;
                    break;
            }
            ghost.prevCol = [];
            // console.log(ghost.prevCol);
        }
    }
    // ghosts.forEach(ghost => {
        
    // }); 

    requestAnimationFrame(animate);
}

animate(0);

function startGame() {
    beginSound.play();
    // sirenSound.loop = true;
}
window.onload = () => {
    startGame();

}