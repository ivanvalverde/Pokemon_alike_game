const audio = {
    map: new Howl({
        src: './audio/map.wav',
        html5: true,
        volume: 0.1,
        loop: true,
    }),
    initBattle: new Howl({
        src: './audio/initBattle.wav',
        html5: true,
        volume: 0.3
    }),
    battle: new Howl({
        src: './audio/battle.mp3',
        html5: true,
        volume: 0.1,
        loop: true,
    }),
    tackleHit: new Howl({
        src: './audio/tackleHit.wav',
        html5: true,
        volume: 0.1
    }),
    fireballHit: new Howl({
        src: './audio/fireballHit.wav',
        html5: true,
        volume: 0.1
    }),
    initFireball: new Howl({
        src: './audio/fireballHit.wav',
        html5: true,
        volume: 0.1
    }),
    victory: new Howl({
        src: './audio/victory.wav',
        html5: true,
        volume: 0.1
    }),
    bubbleHit: new Howl({
        src: './audio/bubbleHit.mp3',
        html5: true,
        volume: 1
    }),
};