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
        health: { max: 100 },
        status: {
            atk: 9,
            def: 4,
            spd: 6,
            lck: 6,
        },
        weakness: ['Water'],
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
        health: { max: 150 },
        status: {
            atk: 6,
            def: 9,
            spd: 5,
            lck: 5,
        }
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
        health: { max: 100 },
        status: {
            atk: 8,
            def: 5,
            spd: 6,
            lck: 6,
        },
    }
}