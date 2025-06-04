const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

const inputSection = document.getElementById('inputSection');
const matrixSection = document.getElementById('matrixSection');
const userMessageInput = document.getElementById('userMessage');
const generateMatrixButton = document.getElementById('generateMatrixButton');
const statusMessage = document.getElementById('statusMessage');
const shareLinkInput = document.getElementById('shareLink');
const copyLinkButton = document.getElementById('copyLinkButton');
const resetButton = document.getElementById('resetButton');

const globalKeywords = ["MATRIX", "CODE", "CYBER", "REALITY", "VIRTUAL"]; // デフォルトキーワード
const keywordColor = '#FFF';
const defaultCharColor = '#0F0';
let keywordAppearanceProbability = 0.0005; // キーワードの出現頻度を少し下げる

const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ';
const characters = matrixChars.split('');
const fontSize = 16;
let rows;
let streams = [];
let animationInterval;
const animationDelay = 50;

function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rows = Math.floor(canvas.height / fontSize);
}

function initializeStreams(customKeywords = []) {
    streams = [];
    const activeKeywords = customKeywords.length > 0 ? customKeywords : globalKeywords;
    keywordAppearanceProbability = customKeywords.length > 0 ? 0.002 : 0.0005; // カスタムメッセージがある場合は少し目立たせる

    for (let y = 0; y < rows; y++) {
        streams[y] = {
            x: 1 + Math.floor(Math.random() * (canvas.width / fontSize)),
            keyword: null,
            keywordIndex: 0,
            keywordDisplayCooldown: 0,
            currentKeywords: activeKeywords // 各ストリームが持つキーワードリスト
        };
    }
}

function generateKeywordsFromText(text, chunkSize = 5) {
    if (!text || text.trim() === "") return [];
    const cleanedText = text.replace(/\s+/g, ' '); // 連続する空白を一つに
    const words = [];
    for (let i = 0; i < cleanedText.length; i += chunkSize) {
        words.push(cleanedText.substring(i, i + chunkSize));
    }
    return words.filter(word => word.trim() !== "");
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        if (stream.keywordDisplayCooldown > 0) {
            stream.keywordDisplayCooldown--;
            ctx.fillStyle = defaultCharColor;
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, stream.x * fontSize, i * fontSize);
            stream.x++;
            if (stream.x * fontSize > canvas.width && Math.random() > 0.975) {
                 stream.x = 0;
            }
            continue;
        }

        if (!stream.keyword && stream.currentKeywords.length > 0 && Math.random() < keywordAppearanceProbability && stream.x * fontSize < canvas.width / 2) {
            stream.keyword = stream.currentKeywords[Math.floor(Math.random() * stream.currentKeywords.length)];
            stream.keywordIndex = 0;
        }

        let charToDraw;
        let charColor = defaultCharColor;

        if (stream.keyword) {
            charToDraw = stream.keyword[stream.keywordIndex];
            charColor = keywordColor; // カスタムメッセージも白で表示
            stream.keywordIndex++;
            if (stream.keywordIndex >= stream.keyword.length) {
                stream.keyword = null;
                stream.keywordIndex = 0;
                stream.keywordDisplayCooldown = 100 + Math.floor(Math.random() * 200); // 表示後のクールダウンを少し長めに
            }
        } else {
            charToDraw = characters[Math.floor(Math.random() * characters.length)];
        }
        ctx.fillStyle = charColor;
        ctx.fillText(charToDraw, stream.x * fontSize, i * fontSize);

        if (stream.x * fontSize > canvas.width && Math.random() > 0.975) {
            stream.x = 0;
            if (!stream.keyword) {
                 stream.keyword = null;
                 stream.keywordIndex = 0;
            }
        }
        stream.x++;
    }
}

function startMatrix(customKeywords = [], showControls = false) {
    inputSection.classList.add('hidden');
    canvas.classList.remove('hidden'); // Ensure canvas is visible

    if (showControls) {
        matrixSection.classList.remove('hidden');
    } else {
        matrixSection.classList.add('hidden');
    }
    initializeCanvas();
    initializeStreams(customKeywords);
    if (animationInterval) clearInterval(animationInterval);
    animationInterval = setInterval(draw, animationDelay);

    // 共有リンクの設定
    const currentUrl = new URL(window.location.href); // ベースURLとして現在のURLを使用
    if (customKeywords.length > 0 && userMessageInput.value) { // userMessageInput.value を正として使用
        currentUrl.searchParams.set('text', encodeURIComponent(userMessageInput.value));
    } else {
        currentUrl.searchParams.delete('text');
    }
    shareLinkInput.value = currentUrl.toString();
}

generateMatrixButton.addEventListener('click', () => {
    const userText = userMessageInput.value;
    if (userText.trim() === "") {
        // `alert` はCanvas環境では推奨されないため、statusMessageを使用
        statusMessage.textContent = "メッセージを入力してください。";
        setTimeout(() => statusMessage.textContent = '', 3000);
        return;
    }
    const newKeywords = generateKeywordsFromText(userText);
    
    startMatrix(newKeywords, true); // User generated, show controls
});

resetButton.addEventListener('click', () => {
    matrixSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    canvas.classList.add('hidden');
    if (animationInterval) clearInterval(animationInterval);
    
    userMessageInput.value = ""; 
    shareLinkInput.value = ""; // 共有リンクもクリア
});

copyLinkButton.addEventListener('click', () => {
    shareLinkInput.select();
    try {
        document.execCommand('copy');
        statusMessage.textContent = 'リンクがコピーされました！';
    } catch (err) {
        statusMessage.textContent = 'コピーに失敗しました。';
        console.error('Failed to copy: ', err);
    }
    setTimeout(() => statusMessage.textContent = '', 3000);
});

window.addEventListener('resize', () => {
    if (!canvas.classList.contains('hidden')) { // Check if canvas is visible
        initializeCanvas();
        // URLパラメータからテキストを復元する際のエラーを避けるため、userMessageInput.value を参照
        const currentTextInParam = new URLSearchParams(window.location.search).get('text');
        const textToUse = userMessageInput.value || (currentTextInParam ? decodeURIComponent(currentTextInParam) : "");
        initializeStreams(generateKeywordsFromText(textToUse));
    }
});

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const userTextParam = urlParams.get('text');

    if (userTextParam) {
        const decodedText = decodeURIComponent(userTextParam);
        userMessageInput.value = decodedText; 
        const newKeywords = generateKeywordsFromText(decodedText);
        startMatrix(newKeywords, false); // Loaded from URL, do not show controls
    } else {
        inputSection.classList.remove('hidden');
        matrixSection.classList.add('hidden');
        canvas.classList.add('hidden');
    }
}

init();
