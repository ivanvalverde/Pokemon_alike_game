class Sprite {
    constructor({ position, image, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0 }) {
        this.position = position;
        this.image = new Image();
        this.frames = {
            ...frames,
            val: 0,
            elapsed: 0
        };

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.image.src = image.src;
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation;
    };


    draw() {
        context.save();
        context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        context.rotate(this.rotation)
        context.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        context.globalAlpha = this.opacity;
        context.drawImage(
            this.image,
            this.frames.val * this.width, // image crop from x axis beggining
            0, // image crop from y axis beggining
            this.image.width / this.frames.max, // image crop from x axis end
            this.image.height, // image crop from y axis end
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, // current width from img rendered on the screen
            this.image.height);  // current height from img rendered on the screen
        context.restore();

        if (!this.animate) return;
        if (this.frames.max > 1) {
            this.frames.elapsed++
        };

        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1)
                this.frames.val++;
            else this.frames.val = 0;
        }
    }
};

class Monster extends Sprite {
    constructor({ name, isEnemy = false, position, image, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0, attacks, experience, level = 1 }) {
        super({ position, image, frames, sprites, animate, rotation })
        this.isEnemy = isEnemy;
        this.name = name;
        this.attacks = attacks;
        this.health = 100;
        this.experience = 30;
        this.level = level;
    };

    attack({ attack, recipient, renderedSprites }) {
        const battleTexts = document.querySelector('#battle-texts');
        battleTexts.style.display = 'block';
        battleTexts.innerHTML = this.name + ' used ' + attack.name;

        let healthBar = '#enemy-health-bar-filled';
        if (this.isEnemy) healthBar = '#friend-health-bar-filled';

        let rotation = 1;
        if (this.isEnemy) rotation = -2.2;

        recipient.health = recipient.health - attack.damage;

        switch (attack.name) {
            case 'Fireball':
                audio.initFireball.play();
                const fireballImage = new Image();
                fireballImage.src = './images/fireball.png';
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation,
                });
                renderedSprites.splice(1, 0, fireball);
                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete() {
                        audio.fireballHit.play();
                        renderedSprites.splice(1, 1);
                        gsap.to(healthBar, {
                            width: `${recipient.health}%`
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 20,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        });
                        enableInterface();
                    },
                });

                break;
            case 'Bubble':
                audio.initFireball.play();
                const bubbleImage = new Image();
                bubbleImage.src = './images/bubbleTest.png';
                const bubble = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: bubbleImage,
                    frames: {
                        max: 4,
                        hold: 15
                    },
                    animate: true,
                });
                renderedSprites.splice(1, 0, bubble);
                gsap.to(bubble.position, {
                    x: recipient.position.x + 20,
                    y: recipient.position.y + 10,
                    yoyo: true,
                    duration: 2,
                    onComplete() {
                        audio.bubbleHit.play();
                        renderedSprites.splice(1, 1);
                        gsap.to(healthBar, {
                            width: `${recipient.health}%`
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 20,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.2
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        });
                        enableInterface();
                    },
                });

                break;
            case 'Tackle':
                const tl = gsap.timeline();
                let movementDistance = 20;
                if (this.isEnemy) movementDistance = -20;

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: .1,
                    onComplete() {
                        audio.tackleHit.play();
                        gsap.to(healthBar, {
                            width: `${recipient.health}%`
                        });
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 20,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08,
                        });
                        enableInterface();
                    }
                }).to(this.position, {
                    x: this.position.x,
                });
                break;
        };

    };
};

class Boundary {
    static height = 48;
    static width = 48;
    constructor({ position }) {
        this.position = position;
        this.height = Boundary.height; // map zoom (4) * size tile (12px)
        this.width = Boundary.width;
    };

    draw() {
        context.fillStyle = 'rgba(255,0,0,0)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
};