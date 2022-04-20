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
    if (emby.health.current <= 0) emby = new Monster({ ...monsters.Emby, level: emby.level, experience: emby.experience, health: { max: emby.health.max, current: emby.health.max } });
    const embyHealthBar = (emby.health.current / emby.health.max) * 100
    userInterface.style.display = 'block';
    battleTexts.style.display = 'none';
    enemyHealthBar.style.width = '100%';
    friendLevel.innerHTML = emby.level;
    friendHealthBar.style.width = `${embyHealthBar}%`;
    friendExperienceBar.style.width = `${emby.experience}%`;
    attacksBox.replaceChildren();
    enemy = new Monster({ ...enemies[Math.floor(Math.random() * enemies.length)] });
    enemyLevel.innerHTML = enemy.level;
    renderedSprites = [enemy, emby];
    enemyName.innerHTML = enemy.name;
    queue = [];

    emby.attacks.forEach((atk) => {
        const button = document.createElement('button');
        button.innerHTML = atk.name;
        attacksBox.append(button);
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = monsterAttacks[e.target.innerHTML];
            const attackInfo = calculateDamage({
                monsterAtk: emby.status.atk,
                monsterLck: emby.status.lck,
                atk: selectedAttack,
                oponentWeakness: enemy.weakness,
                oponentDefense: enemy.status.def,
            });
            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
            const enemyAttackInfo = calculateDamage({
                monsterAtk: enemy.status.atk,
                monsterLck: enemy.status.lck,
                atk: randomAttack,
                oponentWeakness: emby.weakness,
                oponentDefense: emby.status.def,
            });

            if (doesEnemyAttackFirst({ player: emby, enemy })) {
                disableInterface();
                enemy.attack({
                    attack: enemyAttackInfo,
                    recipient: emby,
                    renderedSprites
                });
                criticalOrSuperEffectiveMsg(enemyAttackInfo);
                
                if (emby.health.current <= 0) {
                    queue.push(() => {
                        endBattleProcedure({ battleWinner: enemy, battleLoser: emby });
                        audio.battle.stop();
                        audio.victory.play();
                    });
                    queue.push(() => {
                        gsap.to('#overlapping-div', {
                            opacity: 1,
                            onComplete() {
                                transitionToMap();
                            },
                        });
                    });
                };
                queue.push(() => {
                    emby.attack({
                        attack: attackInfo,
                        recipient: enemy,
                        renderedSprites
                    });
                    criticalOrSuperEffectiveMsg(attackInfo);

                    if (enemy.health.current <= 0) {
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
                                    transitionToMap();
                                },
                            });
                        });
                    };
                });

            } else {
                disableInterface();
                emby.attack({
                    attack: attackInfo,
                    recipient: enemy,
                    renderedSprites
                });
                criticalOrSuperEffectiveMsg(attackInfo);

                if (enemy.health.current <= 0) {
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
                                transitionToMap();
                            },
                        });
                    });
                };

                queue.push(() => {
                    disableInterface();
                    enemy.attack({
                        attack: enemyAttackInfo,
                        recipient: emby,
                        renderedSprites
                    });
                    criticalOrSuperEffectiveMsg(enemyAttackInfo);

                    if (emby.health.current <= 0) {
                        queue.push(() => {
                            endBattleProcedure({ battleWinner: enemy, battleLoser: emby });
                            audio.battle.stop();
                            audio.victory.play();
                        });
                        queue.push(() => {
                            gsap.to('#overlapping-div', {
                                opacity: 1,
                                onComplete() {
                                    transitionToMap();
                                },
                            });
                        });
                    };
                });
            }
        });

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = monsterAttacks[e.target.innerHTML];
            attackType.innerHTML = selectedAttack.type;
            attackType.style.color = selectedAttack.color;

        });
    });
};

const endBattleProcedure = ({ battleWinner, battleLoser }) => {
    let remainerExp;
    const isFriendlyMonster = !battleWinner.isEnemy;
    gsap.to(battleLoser, {
        opacity: 0,
    });
    if (isFriendlyMonster) {
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
                friendLevel.innerHTML = battleWinner.level;
                battleWinner.experience = remainerExp;
                gsap.to('#friend-experience-bar-filled', {
                    width: `${battleWinner.experience}%`,
                    duration: 1,
                });
            }
        });
    } else {
        if (isFriendlyMonster) {
            gsap.to('#friend-experience-bar-filled', {
                width: `${battleWinner.experience}%`
            });
        }
    };
};

const afterBattleInfo = ({ battleWinner, battleLoser }) => {
    const isFriendlyMonster = !battleWinner.isEnemy;

    if (isFriendlyMonster) {
        battleTexts.innerHTML = `${battleWinner.name} gained ${battleLoser.level * 40} experience points!`;
    };

    audio.battle.stop();
    audio.victory.play();
};

const transitionToMap = () => {
    cancelAnimationFrame(battleAnimationId);
    animate();
    userInterface.style.display = "none";
    battle.initiated = false;
    gsap.to('#overlapping-div', {
        opacity: 0
    });
    audio.map.play();
};

const criticalOrSuperEffectiveMsg = (attack) => {
    if (attack.isCriticalHit) {
        queue.push(() => {
            battleTexts.innerHTML = 'A critical hit!';
        });
    };
    if (attack.isSuperEffective) {
        queue.push(() => {
            battleTexts.innerHTML = "It's super effective!";
        });
    };
};

const animateBattle = () => {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
};

battleTexts.addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style = 'none';
    };

});