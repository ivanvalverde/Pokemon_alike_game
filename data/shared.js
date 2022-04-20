const userInterface = document.querySelector('#user-interface');
const battleTexts = document.querySelector('#battle-texts');
const attacksBox = document.querySelector('#attacks-box');
const attackType = document.querySelector('#attack-type');

const friendHealthBar = document.querySelector('#friend-health-bar-filled');
const friendExperienceBar = document.querySelector('#friend-experience-bar-filled');
const friendLevel = document.querySelector('#friend-level');

const enemyHealthBar = document.querySelector('#enemy-health-bar-filled');
const enemyLevel = document.querySelector('#enemy-level');
const enemyName = document.querySelector("#enemy-name");


const disableInterface = () => {
    document.querySelector('#battle-texts').style.pointerEvents = 'none';
    document.querySelector('#battle-texts').style.cursor = 'default';

    document.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
        button.style.cursor = 'default';
    });
};

const enableInterface = () => {
    setTimeout(() => {
        document.querySelector('#battle-texts').style.pointerEvents = 'auto';
        document.querySelector('#battle-texts').style.cursor = 'pointer';

        document.querySelectorAll("button").forEach((button) => {
            button.disabled = false;
            button.style.cursor = 'pointer';
        });
    }, 1000
    );
};

const calculateDamage = ({ monsterAtk, monsterLck, atk, oponentWeakness, oponentDefense }) => {
    const isCriticalHit = Math.floor(Math.random() * (101 + monsterLck)) >= 90;
    const isSuperEffective = oponentWeakness.includes(atk.type);
    console.log(atk.type, oponentWeakness);
    let calculatedDamage = isSuperEffective
        ?
        2 * (Math.floor(Math.random() * (monsterAtk + 1)) + atk.damage - oponentDefense)
        :
        (Math.floor(Math.random() * (monsterAtk + 1)) + atk.damage - oponentDefense);

    if (calculatedDamage < 1) calculatedDamage = 1;

    const damageDealt = isCriticalHit ? calculatedDamage * 2 : calculatedDamage;
    return {
        atkUsed: atk,
        dmg: damageDealt,
        isCriticalHit,
        isSuperEffective
    };
};

const doesEnemyAttackFirst = ({ player, enemy }) => {
    if (player.status.spd === enemy.status.spd) {
        return Boolean(Math.floor(Math.random() * 2));
    } else if (player.status.spd < enemy.status.spd) {
        return true;
    } else {
        return false
    };
};