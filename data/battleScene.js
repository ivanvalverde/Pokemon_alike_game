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
let enemy;
let emby;
let enemies = [monsters.Bubbla, monsters.Draggle];
emby = new Monster(monsters.Emby);

const initBattle = () => {
    if (emby.health <= 0) emby = new Monster({ ...monsters.Emby, level: emby.level, experience: emby.experience });
    document.querySelector('#user-interface').style.display = 'block';
    document.querySelector('#battle-texts').style.display = 'none';
    document.querySelector('#enemy-health-bar-filled').style.width = '100%';
    document.querySelector('#friend-level').innerHTML = emby.level;
    document.querySelector('#friend-health-bar-filled').style.width = `${emby.health}%`;
    document.querySelector('#friend-experience-bar-filled').style.width = `${emby.experience}%`;
    document.querySelector('#attacks-box').replaceChildren();
    enemy = new Monster({ ...enemies[Math.floor(Math.random() * enemies.length)] });
    document.querySelector('#enemy-level').innerHTML = enemy.level;
    renderedSprites = [enemy, emby];
    document.querySelector("#enemy-name").innerHTML = enemy.name;
    queue = [];

    emby.attacks.forEach((atk) => {
        const button = document.createElement('button');
        button.innerHTML = atk.name;
        document.querySelector("#attacks-box").append(button);
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener('click', (e) => {
            disableInterface();
            const selectedAttack = monsterAttacks[e.target.innerHTML];
            emby.attack({
                attack: selectedAttack,
                recipient: enemy,
                renderedSprites
            });

            if (enemy.health <= 0) {
                queue.push(() => {
                    endBattleProcedure({ battleWinner: emby, battleLoser: enemy });
                });
                queue.push(() => {
                    afterBattleInfo({ battleWinner: emby, battleLoser: enemy });
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
            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
            queue.push(() => {
                disableInterface();
                enemy.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                });
                if (emby.health <= 0) {
                    queue.push(() => {
                        endBattleProcedure({ battleWinner: enemy, battleLoser: emby });
                        audio.battle.stop();
                        audio.victory.play();
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

const endBattleProcedure = ({ battleWinner, battleLoser }) => {
    let remainerExp;
    const battleTexts = document.querySelector('#battle-texts');
    gsap.to(battleLoser, {
        opacity: 0,
    });
    if (!battleWinner.isEnemy) {
        battleWinner.experience += battleLoser.level * 40;
    };
    battleTexts.innerHTML = battleLoser.name + ' fainted';
    if (battleWinner.experience >= 100) {
        remainerExp = battleWinner.experience - 100;
        battleWinner.level += 1;
        gsap.to('#friend-experience-bar-filled', {
            width: `100%`,
            duration: 1,
            onComplete() {
                battleWinner.experience = 0;
                document.querySelector('#friend-level').innerHTML = battleWinner.level;
                battleWinner.experience = remainerExp;
                gsap.to('#friend-experience-bar-filled', {
                    width: `${battleWinner.experience}%`,
                    duration: 1,
                });
            }
        });
    } else {
        gsap.to('#friend-experience-bar-filled', {
            width: `${battleWinner.experience}%`
        });
    };
};

const afterBattleInfo = ({ battleWinner, battleLoser }) => {
    const battleTexts = document.querySelector('#battle-texts');
    const isFriendlyMonster = !battleWinner.isEnemy;

    if (isFriendlyMonster) {
        battleTexts.innerHTML = `${battleWinner.name} gained ${battleLoser.level * 40} experience points!`;
    };

    audio.battle.stop();
    audio.victory.play();
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