const monsters = {
    Emby: {
        position: {
            x: 285,
            y: 330,
        },
        image: {
            src: './images/embySprite.png',
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Emby',
        attacks: [monsterAttacks.Tackle, monsterAttacks.Fireball],
    },
    Draggle: {
        position: {
            x: 800,
            y: 100,
        },
        image: {
            src: './images/draggleSprite.png',
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle',
        attacks: [monsterAttacks.Tackle],
    },
    Bubbla: {
        position: {
            x: 790,
            y: 100,
        },
        image: {
            src: './images/bubblaSprite.png',
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Bubbla',
        attacks: [monsterAttacks.Tackle, monsterAttacks.Bubble],
    }
}