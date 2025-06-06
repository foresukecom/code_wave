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
const backToHomeOverlayButtonContainer = document.getElementById('backToHomeOverlayButtonContainer');
const backToHomeOverlayButton = document.getElementById('backToHomeOverlayButton');

console.log("Script loaded.");
let originalMessage = ""; // 元のメッセージを保持する変数

const globalKeywords = ["MATRIX", "CODE", "CYBER", "REALITY", "VIRTUAL"]; // デフォルトキーワード
const keywordColor = '#FFF';
const defaultCharColor = '#0F0';
let keywordAppearanceProbability = 0.003; // キーワードの出現頻度を少し下げる

const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ';
const characters = matrixChars.split('');
const fontSize = 16;
let rows;
let streams = [];
let animationInterval;
let animationStartTime = 0; // アニメーション開始時刻
const animationDuration = 30000; // 30秒かけてメッセージ全体を表示 (ミリ秒)
const updateIntervalFrames = 60; // 約1秒ごとにキーワードリストを更新 (フレーム数)
const animationDelay = 50;

let frameCount = 0; // グローバルスコープにframeCountを宣言
function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`Canvas initialized: width=${canvas.width}, height=${canvas.height}`);
    rows = Math.floor(canvas.height / fontSize);
}

function initializeStreams(customKeywords = []) {
    streams = [];
    const activeKeywords = customKeywords.length > 0 ? customKeywords : globalKeywords;
    keywordAppearanceProbability = customKeywords.length > 0 ? 0.002 : 0.0005; // カスタムメッセージがある場合は少し目立たせる
    console.log(`Initializing streams with keywords:`, activeKeywords);

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

// 経過時間に基づいてチャンクサイズを計算する関数
function calculateChunkSize(elapsedTime, totalDuration, initialChunkSize, finalChunkSize) {
    if (elapsedTime >= totalDuration) {
        return finalChunkSize;
    }
    const progress = elapsedTime / totalDuration; // 0 から 1
    // 線形補間
    return Math.max(initialChunkSize, Math.floor(initialChunkSize + progress * (finalChunkSize - initialChunkSize)));
}

function generateKeywordsFromText(text, chunkSize = 5) {
    if (!text || text.trim() === "") return [];
    console.log(`Generating keywords for text: "${text}" with chunkSize: ${chunkSize}`);
    const cleanedText = text.replace(/\s+/g, ' '); // 連続する空白を一つに
    const words = [];
    // chunkSize がメッセージ長以上なら、メッセージ全体を一つの要素とする
    if (chunkSize >= cleanedText.length && cleanedText.length > 0) {
        return [cleanedText];
    }
    for (let i = 0; i < cleanedText.length; i += chunkSize) {
        words.push(cleanedText.substring(i, i + chunkSize));
    }
    return words.filter(word => word.trim() !== "");
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    // キーワードリストの動的更新
    frameCount++;
    if (frameCount % updateIntervalFrames === 0) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - animationStartTime;
        console.log(`Frame ${frameCount}: Updating keywords. Elapsed time: ${elapsedTime}ms`);
        const finalChunkSize = originalMessage.length > 0 ? originalMessage.length : 5; // メッセージがない場合はデフォルト5
        const currentChunkSize = calculateChunkSize(elapsedTime, animationDuration, 5, finalChunkSize);

        let newKeywords;
        if (currentChunkSize >= originalMessage.length && originalMessage.length > 0) {
             // 最終的にはメッセージ全体を一つのキーワードとして扱う
             newKeywords = [originalMessage];
        } else {
             // 現在のチャンクサイズで分割
             newKeywords = generateKeywordsFromText(originalMessage, currentChunkSize);
        }

        // 全てのストリームのキーワードリストを更新
        console.log(`New keywords generated (chunkSize ${currentChunkSize}):`, newKeywords);
        streams.forEach(stream => stream.currentKeywords = newKeywords);
    }

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
            // console.log(`Stream ${i}: Picking new keyword.`); // 頻繁すぎる可能性あり
            stream.keyword = stream.currentKeywords[Math.floor(Math.random() * stream.currentKeywords.length)];
            stream.keywordIndex = 0;
        }

        let charToDraw;
        let charColor = defaultCharColor;

        if (stream.keyword) {
            charToDraw = stream.keyword[stream.keywordIndex];
            // console.log(`Stream ${i}: Drawing keyword char "${charToDraw}" at index ${stream.keywordIndex}`); // 頻繁すぎる可能性あり
            charColor = keywordColor; // カスタムメッセージも白で表示
            stream.keywordIndex++;
            if (stream.keywordIndex >= stream.keyword.length) {
                stream.keyword = null;
                stream.keywordIndex = 0;
                stream.keywordDisplayCooldown = 100 + Math.floor(Math.random() * 200); // 表示後のクールダウンを少し長めに
            }
        } else {
            charToDraw = characters[Math.floor(Math.random() * characters.length)];
            // console.log(`Stream ${i}: Drawing random char "${charToDraw}"`); // 頻繁すぎる可能性あり
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
    console.log(`startMatrix called with showControls: ${showControls}`, 'Keywords:', customKeywords);
    inputSection.classList.add('hidden');
    canvas.classList.remove('hidden'); // Ensure canvas is visible
    if (backToHomeOverlayButtonContainer) backToHomeOverlayButtonContainer.classList.remove('hidden');

    if (showControls) {
        matrixSection.classList.remove('hidden');
    } else {
        matrixSection.classList.add('hidden');
    }
    initializeCanvas();
    initializeStreams(customKeywords);
    if (animationInterval) clearInterval(animationInterval);
    animationStartTime = Date.now(); // アニメーション開始時刻を記録
    console.log(`Animation started at ${animationStartTime}`);
    animationInterval = setInterval(draw, animationDelay);
    frameCount = 0; // フレームカウントをリセット
    // 共有リンクの設定
    const currentUrl = new URL(window.location.href); // ベースURLとして現在のURLを使用
    // 既存の 'd' パラメータを削除
    currentUrl.searchParams.delete('d');

    if (customKeywords.length > 0 && userMessageInput.value) {
        const dataToEncode = { message: userMessageInput.value };
        const jsonString = JSON.stringify(dataToEncode);
        // UTF-8 バイト列にエンコードしてから Base64 エンコード
        const encodedData = btoa(String.fromCharCode(...new TextEncoder().encode(jsonString)));
        currentUrl.searchParams.set('d', encodedData);
    } else {
        currentUrl.searchParams.delete('d'); // メッセージがない場合はパラメータを削除
    }
    shareLinkInput.value = currentUrl.toString();
    console.log(`Share link set to: ${shareLinkInput.value}`);
}

generateMatrixButton.addEventListener('click', () => {
    console.log("Generate button clicked.");
    const userText = userMessageInput.value;
    console.log(`User input text: "${userText}"`);
    if (userText.trim() === "") {
        // `alert` はCanvas環境では推奨されないため、statusMessageを使用
        statusMessage.textContent = "メッセージを入力してください。";
        setTimeout(() => statusMessage.textContent = '', 3000);
        return;
    }
    const newKeywords = generateKeywordsFromText(userText);
    originalMessage = userText; // 元のメッセージを保存
    
    startMatrix(newKeywords, true); // User generated, show controls
});

function resetToInputForm() {
    console.log("Reset button clicked.");
    matrixSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    canvas.classList.add('hidden');
    if (backToHomeOverlayButtonContainer) backToHomeOverlayButtonContainer.classList.add('hidden');
    if (animationInterval) clearInterval(animationInterval);

    userMessageInput.value = "";
    originalMessage = ""; // 元のメッセージもクリア
    shareLinkInput.value = ""; // 共有リンクもクリア

    // URLから 'd' パラメータを削除
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('d');
    history.pushState({}, '', currentUrl.toString());
}

resetButton.addEventListener('click', resetToInputForm);

if (backToHomeOverlayButton) {
    backToHomeOverlayButton.addEventListener('click', resetToInputForm);
}

copyLinkButton.addEventListener('click', () => {
    console.log("Copy link button clicked.");
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
    console.log("Window resized.");
    if (!canvas.classList.contains('hidden')) { // Check if canvas is visible
        initializeCanvas();
        // リサイズ時も経過時間を考慮してキーワードを再生成する必要がある
        const currentTime = Date.now();
        const elapsedTime = currentTime - animationStartTime;
        const finalChunkSize = originalMessage.length > 0 ? originalMessage.length : 5;
        const currentChunkSize = calculateChunkSize(elapsedTime, animationDuration, 5, finalChunkSize);
        const newKeywords = generateKeywordsFromText(originalMessage, currentChunkSize);
        initializeStreams(newKeywords); // リサイズ時は新しいキーワードリストでストリームを再初期化
    }
    // リサイズ時に inputSection が表示されている場合は、canvas は非表示のまま
    if (!inputSection.classList.contains('hidden')) canvas.classList.add('hidden');
});

function init() {
    console.log("init() called.");
    const urlParams = new URLSearchParams(window.location.search);
    const encodedDataParam = urlParams.get('d'); // 難読化されたパラメータ 'd' を取得
    console.log(`URL parameter 'd': ${encodedDataParam}`);

    if (encodedDataParam) {
        try {
            // Base64 デコードしてから UTF-8 バイト列を文字列にデコード
            const decodedBytes = Uint8Array.from(atob(encodedDataParam), c => c.charCodeAt(0));
            const data = JSON.parse(new TextDecoder().decode(decodedBytes));
            if (data && data.message) {
                const message = data.message;
                console.log(`Decoded message from URL: "${message}"`);
                userMessageInput.value = message;
                originalMessage = message; // 元のメッセージを保存
                const newKeywords = generateKeywordsFromText(message, 5); // 最初は5文字で分割
                startMatrix(newKeywords, false); // Loaded from URL, do not show controls
                console.log("Starting matrix from URL parameter.");
            }
        } catch (error) {
            console.error("Failed to decode or parse URL parameter:", error);
            // エラー発生時は通常通り入力画面を表示
            inputSection.classList.remove('hidden');
            matrixSection.classList.add('hidden');
            canvas.classList.add('hidden');
        }
    } else {
        inputSection.classList.remove('hidden');
        matrixSection.classList.add('hidden');
        canvas.classList.add('hidden');
        if (backToHomeOverlayButtonContainer) backToHomeOverlayButtonContainer.classList.add('hidden');
    }
}

init();
