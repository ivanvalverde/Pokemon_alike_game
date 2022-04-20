const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const backgroundImage = new Image();
backgroundImage.src = './images/WonderTown.png';

const foregroundImage = new Image();
foregroundImage.src = './images/foregroundImages.png';

const playerDownImage = new Image();
playerDownImage.src = './images/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './images/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './images/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './images/playerRight.png';

const collisionsMap = [];
// dividing collisions array to smaller arrays representing each row of the map tile 
for (let i = 0; i < collisions.length; i += 70) { // width specified when creating the map tile
    collisionsMap.push(collisions.slice(i, 70 + i));
};

const battleZonesMap = [];
// dividing collisions array to smaller arrays representing each row of the map tile 
for (let i = 0; i < battleZonesData.length; i += 70) { // width specified when creating the map tile
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
};

const boundaries = [];
const offset = {
    x: -735,
    y: -680
}

collisionsMap.forEach((row, rowIndex) => {
    row.forEach((elem, elemIndex) => {
        if (elem === 1025) {
            boundaries.push(new Boundary({
                position: {
                    x: elemIndex * Boundary.width + offset.x, // for each different element, there is a different column, and we need to multiply by the width minus the offset
                    y: rowIndex * Boundary.height + offset.y // for each different array, there is a different row, and we need to multiply by the height minus the offset
                }
            }));
        }
    });
});

const battleZones = [];

battleZonesMap.forEach((row, rowIndex) => {
    row.forEach((elem, elemIndex) => {
        if (elem === 1025) {
            battleZones.push(new Boundary({
                position: {
                    x: elemIndex * Boundary.width + offset.x, // for each different element, there is a different column, and we need to multiply by the width minus the offset
                    y: rowIndex * Boundary.height + offset.y // for each different array, there is a different row, and we need to multiply by the height minus the offset
                }
            }));
        }
    });
});



const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 8, // initial x axis position, 192 -> size of image width 
        y: canvas.height / 2 - 50, // initial y axis position, 68 -> size of image height
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
});

const keys = {
    w: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

const rectangularCollision = ({ rectangle1, rectangle2 }) => {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
};

const movables = [background, ...boundaries, foreground, ...battleZones];

const battle = {
    initiated: false,
}

const animate = () => {
    const animationId = window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    battleZones.forEach((battleZone) => {
        battleZone.draw();
    });
    player.draw();
    foreground.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });

    let moving = true;
    player.animate = false;

    if (battle.initiated) {
        return;
    }
    // activating battle
    if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
                Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
                    - Math.max(player.position.y, battleZone.position.y));

            // overlappingArea is the intersection area between the player and the battle tile
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            }) && overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.02) {
                window.cancelAnimationFrame(animationId);
                audio.map.stop();
                audio.initBattle.play();
                audio.battle.play();
                battle.initiated = true;
                gsap.to('#overlapping-div', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: .4,
                    onComplete() {
                        gsap.to('#overlapping-div', {
                            opacity: 1,
                            duration: .4,
                            onComplete() {
                                initBattle();
                                animateBattle();
                                gsap.to('#overlapping-div', {
                                    opacity: 0,
                                    duration: .4,
                                });
                            }
                        });

                    }
                });
                break;
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.y += 3
            })
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y,
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x += 3
            })
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
    }
};
animate();


let lastKey = '';

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;

    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;

    }
});

let clicked = false;
addEventListener('click', () => {
    if (!clicked) {
        audio.map.play();
        clicked = true;
    };

});