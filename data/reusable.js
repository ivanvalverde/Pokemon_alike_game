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