let original = "Nenhum texto carregado...";
let content = "Nenhum texto carregado...";

let [size, speed, columns] = JSON.parse(localStorage.getItem('prompter') || '[2, 1, 140]');

let initialTextPosition = [50, window.innerHeight - 100];
let currentTextPosition = initialTextPosition;

function setup() {

    noLoop();

    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('display', 'block');
    background(10);
    frameRate(10);

    noStroke();
    fill(20);

    rect(0, 0, windowWidth, 25);
    stroke(255);
    fill(255);

    const fileLabel = createP('File:');
    fileLabel.position(20, 20);

    const fileInput = createFileInput(onFileChange);
    fileInput.position(60, 20);
    fileInput.size(250, 30);

    const sizeLabel = createP('Size:');
    sizeLabel.position(320, 20)

    const sizeInput = createInput(size, 'number');
    sizeInput.position(370, 20);
    sizeInput.size(50, 20);
    sizeInput.input(persistOnEvent(onSizeChange));

    const speedLabel = createP('Speed:');
    speedLabel.position(440, 20);

    const speedInput = createInput(speed, 'number');
    speedInput.position(500, 20);
    speedInput.size(50, 20);
    speedInput.input(persistOnEvent(onSpeedChange));

    const columnLabel = createP('Columns:');
    columnLabel.position(560, 20);

    const columnInput = createInput(columns, 'number');
    columnInput.position(635, 20);
    columnInput.size(50, 20);
    columnInput.input(persistOnEvent(onColumnChange));

    const pauseButton = createButton('PAUSE');
    pauseButton.position(700, 20);
    pauseButton.mousePressed(() => noLoop());

    const resumeButton = createButton('RESUME');
    resumeButton.position(770, 20);
    resumeButton.mousePressed(() => loop());

    const backButton = createButton('BACK');
    backButton.position(858, 20);
    backButton.mousePressed(onBack);

    const resetButton = createButton('RESET');
    resetButton.position(918, 20);
    resetButton.mousePressed(onReset);

}

function draw() {
    const [x, y] = currentTextPosition;
    currentTextPosition = [x, y - speed];
    drawText(content, currentTextPosition);
    noStroke();
    fill(10);
    rect(0, 0, windowWidth, 60);
    stroke(255);
    fill(255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initialTextPosition = [50, window.innerHeight - 100];
    onReset();
}

const onBack = () => {
    const [x, y] = currentTextPosition;
    currentTextPosition = [x, y + speed * 10];
    drawText(content, currentTextPosition);
}


const onFileChange = file => {
    original = file.data;
    content = prepareText(original, columns, size);
    drawText(content, initialTextPosition);
    currentTextPosition = initialTextPosition;
}

const prepareText = (text, columns, size) => {
    const txtData = text.split(" ");
    const maxDigits = columns / size;

    return txtData.reduce((res, word) => {

        if (res.length === 0) return [[word]];

        const lastArr = res[res.length - 1];
        const projectedSize = lastArr.join(' ').length + word.length;
        if (projectedSize > maxDigits) return [...res, [word]];
        const [last, rest] = spreadLast(res);
        return [...rest, [...last, word]];

    }, []).map(x => x.join(' ')).join("\n");
}

const drawText = (txt, [w, h]) => {
    background(10);
    textSize(size * 20);
    textLeading((1 + size * 0.2) * 50);
    text(txt, w, h);
}

const onSizeChange = ({ target: { value } }) => {
    size = value;
    content = prepareText(original, columns, size);
    drawText(content, currentTextPosition);
}

const onColumnChange = ({ target: { value } }) => {
    columns = value;
    content = prepareText(original, columns, size);
    drawText(content, currentTextPosition);
}

const onSpeedChange = ({ target: { value } }) => speed = value;

const onReset = () => {
    currentTextPosition = initialTextPosition;
    drawText(content, currentTextPosition);
}

const persistOnEvent = func => evt => {
    const result = func(evt);
    localStorage.setItem('prompter', JSON.stringify([size, speed, columns]));
    return result;
}

const spreadLast = arr => {

    if (!arr || !arr instanceof Array) throw "Provide an array as first parameter";
    if (arr.length === 0) return [null, []];
    if (arr.length === 1) return [arr[0], []];

    let rest = arr.slice(0, arr.length - 1);
    const last = arr[arr.length - 1];
    return [last, rest];
}