const battleBackgroundImage = new Image();
battleBackgroundImage.src = './images/battleBackground.png';

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
});

let battleAnimationId;
let renderedSprites;
let queue;
let draggle;
let emby;

const initBattle = () => {
    document.querySelector('#user-interface').style.display = 'block';
    document.querySelector('#battle-texts').style.display = 'none';
    document.querySelector('#enemy-health-bar-filled').style.width = '100%';
    document.querySelector('#friend-health-bar-filled').style.width = '100%';
    document.querySelector('#attacks-box').replaceChildren();
    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];

    emby.attacks.forEach((atk) => {
        const button = document.createElement('button');
        button.innerHTML = atk.name;
        document.querySelector("#attacks-box").append(button);
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = monsterAttacks[e.target.innerHTML];
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            });

            if (draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint();
                });
                queue.push(() => {
                    gsap.to('#overlapping-div', {
                        opacity: 1,
                        onComplete() {
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            document.querySelector("#user-interface").style.display = "none";
                            battle.initiated = false;
                            gsap.to('#overlapping-div', {
                                opacity: 0
                            });
                            audio.map.play();
                        },
                    });
                });
            };
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                });
                if (emby.health <= 0) {
                    queue.push(() => {
                        emby.faint();
                    });
                    queue.push(() => {
                        gsap.to('#overlapping-div', {
                            opacity: 1,
                            onComplete() {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                document.querySelector("#user-interface").style.display = "none";
                                battle.initiated = false;
                                gsap.to('#overlapping-div', {
                                    opacity: 0
                                });
                                audio.map.play();
                            },
                        });
                    });
                };
            });
        });

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = monsterAttacks[e.target.innerHTML];
            const attackType = document.querySelector('#attack-type');
            attackType.innerHTML = selectedAttack.type;
            attackType.style.color = selectedAttack.color;

        });
    });
};

const animateBattle = () => {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
};

document.querySelector("#battle-texts").addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style = 'none';
    };

});