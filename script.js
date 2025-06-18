const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

const inputSection = document.getElementById('inputSection');
const matrixSection = document.getElementById('matrixSection');
const userMessageInput = document.getElementById('userMessage');
const generateMatrixButton = document.getElementById('generateMatrixButton');
const statusMessage = document.getElementById('statusMessage');
const shareTextArea = document.getElementById('shareText');
const copyLinkButton = document.getElementById('copyLinkButton');
const openInNewTabButton = document.getElementById('openInNewTabButton');
const resetButton = document.getElementById('resetButton');
const backToHomeOverlayButtonContainer = document.getElementById('backToHomeOverlayButtonContainer');
const backToHomeOverlayButton = document.getElementById('backToHomeOverlayButton'); // オーバーレイボタンの要素を取得
const saveGifButton = document.getElementById('saveGifButton'); // GIF保存ボタンの要素を取得
const langTabJa = document.getElementById('langTabJa');
const langTabEn = document.getElementById('langTabEn');

let originalMessage = ""; // 元のメッセージを保持する変数
let currentLanguage = 'ja'; // 現在の言語設定

// SNSシェアテキストのテンプレート
const shareTextTemplates = {
    ja: (url) => `🌊 Code Wave でメッセージを作成しました！
コードの浪の中に隠されたメッセージを見つけてみてください✨
#コードウェーブ #CodeWave
${url}`,
    en: (url) => `🌊 Created a message with Code Wave!
Find the hidden message in the code wave✨
#コードウェーブ #CodeWave
${url}`
};

// UIテキストの翻訳
const uiTexts = {
    ja: {
        preview: 'プレビューを表示',
        backToHome: 'トップへ戻る',
        newMessage: '新しいメッセージを作成',
        copyButton: 'SNS用テキストをコピー',
        generateButton: 'コードウェーブを生成 / Generate Code Wave'
    },
    en: {
        preview: 'Show Preview',
        backToHome: 'Back to Home',
        newMessage: 'Create New Message',
        copyButton: 'Copy Share Text',
        generateButton: 'コードウェーブを生成 / Generate Code Wave'
    }
};

// SNSシェアテキストを生成する関数
function generateShareText(url) {
    const template = shareTextTemplates[currentLanguage];
    shareTextArea.value = template(url);
}

const globalKeywords = ["DIGITAL", "CODE", "CYBER", "REALITY", "VIRTUAL"]; // デフォルトキーワード
// 色テーマの定義
const colorThemes = {
    classic: { default: '#0F0', keyword: '#FFF', bg: 'rgba(0, 0, 0, 0.04)' },
    blue: { default: '#00BFFF', keyword: '#FFF', bg: 'rgba(0, 0, 20, 0.04)' },
    purple: { default: '#9932CC', keyword: '#FFF', bg: 'rgba(20, 0, 20, 0.04)' },
    red: { default: '#FF4500', keyword: '#FFF', bg: 'rgba(20, 0, 0, 0.04)' },
    orange: { default: '#FF8C00', keyword: '#FFF', bg: 'rgba(20, 10, 0, 0.04)' }
};

let currentTheme = 'classic';
let keywordColor = colorThemes[currentTheme].keyword;
let defaultCharColor = colorThemes[currentTheme].default;
let keywordAppearanceProbability = 0.005; // キーワードの出現頻度を少し下げる

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

// セキュリティ関数: HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// セキュリティ関数: 入力値のサニタイズ
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // HTMLタグとJavaScriptを削除
    let sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script タグを削除
        .replace(/<[^>]*>/g, '') // 全HTMLタグを削除
        .replace(/javascript:/gi, '') // javascript: プロトコルを削除
        .replace(/on\w+\s*=/gi, '') // イベントハンドラーを削除
        .trim();
    
    // 長さ制限（100文字）
    if (sanitized.length > 100) {
        sanitized = sanitized.substring(0, 100);
    }
    
    return sanitized;
}

// セキュリティ関数: 安全な文字のみを許可
function validateSafeChars(text) {
    // 日本語、英数字、基本的な記号のみ許可
    const allowedPattern = /^[あ-んア-ンー一-龯ａ-ｚＡ-Ｚa-zA-Z0-9０-９\s\n\r.,!?()（）「」『』【】\-ー・。、！？]*$/;
    return allowedPattern.test(text);
}

// UIテーマ更新関数
function updateUITheme(themeName) {
    const containers = [inputSection, matrixSection, backToHomeOverlayButtonContainer];
    const themeClasses = ['theme-classic', 'theme-blue', 'theme-purple', 'theme-red', 'theme-orange'];
    
    containers.forEach(container => {
        if (container) { // 要素が存在する場合のみ処理
            // 既存のテーマクラスを削除
            themeClasses.forEach(themeClass => {
                container.classList.remove(themeClass);
            });
            // 新しいテーマクラスを追加
            container.classList.add(`theme-${themeName}`);
        }
    });
}

// 色選択の変更を監視
document.addEventListener('change', (event) => {
    if (event.target.name === 'colorTheme') {
        const selectedTheme = event.target.value;
        updateUITheme(selectedTheme);
    }
});

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
    // 複数行に対応: テキストを行に分割し、各行をチャンクまたは完全な行として扱う
    if (!text || text.trim() === "") return [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== ""); // 行に分割、トリム、空行を除外
    const keywords = [];

    for (const line of lines) {
        if (chunkSize >= line.length) {
            // チャンクサイズが行の長さ以上なら、行全体をキーワードとして追加
            keywords.push(line);
        } else {
            // そうでなければ、行をチャンクサイズで分割して追加
            for (let i = 0; i < line.length; i += chunkSize) {
                keywords.push(line.substring(i, i + chunkSize));
            }
        }
    }
    return keywords; // 生成されたキーワードの配列を返す
}

function draw() {
    ctx.fillStyle = colorThemes[currentTheme].bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    // キーワードリストの動的更新
    frameCount++;
    const currentTime = Date.now();
    const elapsedTime = currentTime - animationStartTime;

    if (frameCount % updateIntervalFrames === 0 || elapsedTime >= animationDuration) {
        // 最終的なチャンクサイズを最長行の長さに設定
        const longestLineLength = originalMessage.split('\n').reduce((max, line) => Math.max(max, line.trim().length), 0);
        const finalChunkSize = longestLineLength > 0 ? longestLineLength : 5;
        const currentChunkSize = calculateChunkSize(elapsedTime, animationDuration, 5, finalChunkSize);

        const newKeywords = generateKeywordsFromText(originalMessage, currentChunkSize);

        // 全てのストリームのキーワードリストを更新
        streams.forEach(stream => stream.currentKeywords = newKeywords);
    }


    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        if (stream.keywordDisplayCooldown > 0) {
            stream.keywordDisplayCooldown--;
            ctx.fillStyle = colorThemes[currentTheme].default;
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
        let charColor = colorThemes[currentTheme].default;

        if (stream.keyword) {
            charToDraw = stream.keyword[stream.keywordIndex];
            charColor = colorThemes[currentTheme].keyword; // カスタムメッセージも白で表示
            stream.keywordIndex++;
            if (stream.keywordIndex >= stream.keyword.length) {
                stream.keyword = null;
                stream.keywordIndex = 0;
                stream.keywordDisplayCooldown = 100 + Math.floor(Math.random() * 200); // 表示後のクールダウンを少し長めに
            }
        } else {
            charToDraw = characters[Math.floor(Math.random() * characters.length)];
            charColor = colorThemes[currentTheme].default;
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
    if (backToHomeOverlayButtonContainer) backToHomeOverlayButtonContainer.classList.remove('hidden'); // オーバーレイボタンを表示

    if (showControls) {
        matrixSection.classList.remove('hidden');
    } else {
        matrixSection.classList.add('hidden');
    }
    initializeCanvas();
    initializeStreams(customKeywords); // 最初のキーワードリストでストリームを初期化
    if (animationInterval) clearInterval(animationInterval);
    animationStartTime = Date.now(); // アニメーション開始時刻を記録
    animationInterval = setInterval(draw, animationDelay);
    frameCount = 0; // フレームカウントをリセット

    // 共有リンクの設定
    const currentUrl = new URL(window.location.href); // ベースURLとして現在のURLを使用
    // 既存の 'd' パラメータを削除
    currentUrl.searchParams.delete('d');

    if (userMessageInput.value) { // userMessageInput.value が存在する場合のみパラメータを設定
        // エンコード前にもサニタイズを確認
        const messageToEncode = sanitizeInput(userMessageInput.value);
        const dataToEncode = { 
            message: messageToEncode,
            theme: currentTheme
        };
        const jsonString = JSON.stringify(dataToEncode);
        // UTF-8 バイト列にエンコードしてから Base64 エンコード
        const encodedData = btoa(String.fromCharCode(...new TextEncoder().encode(jsonString)));
        currentUrl.searchParams.set('d', encodedData);
    } else {
        currentUrl.searchParams.delete('d'); // メッセージがない場合はパラメータを削除
    }
    const urlString = currentUrl.toString();
    
    // SNS共有用テキストを生成
    generateShareText(urlString);
}

generateMatrixButton.addEventListener('click', () => {
    const userText = userMessageInput.value; // textareaの値を取得
    
    // 入力値のバリデーション
    if (userText.trim() === "") {
        statusMessage.textContent = "メッセージを入力してください。";
        setTimeout(() => statusMessage.textContent = '', 3000);
        return;
    }
    
    // 入力値をサニタイズ（危険な文字を無効化）
    const sanitizedText = sanitizeInput(userText);
    
    // サニタイズ結果をチェックして警告メッセージを表示
    if (sanitizedText !== userText) {
        const removedChars = userText.length - sanitizedText.length;
        if (removedChars > 0) {
            statusMessage.textContent = `⚠️ セキュリティのため、${removedChars}文字が削除されました。HTMLタグやスクリプトは安全に無効化されます。`;
        } else {
            statusMessage.textContent = "⚠️ セキュリティのため、一部の文字が無効化されました。";
        }
        statusMessage.style.color = '#ffa500'; // オレンジ色で警告
        userMessageInput.value = sanitizedText;
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.style.color = '';
        }, 4000);
    }
    
    // サニタイズ後の内容が空でないかチェック
    if (sanitizedText.trim() === "") {
        statusMessage.textContent = "有効な文字が含まれていません。日本語、英数字、基本的な記号を使用してください。";
        statusMessage.style.color = '#ff4444';
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.style.color = '';
        }, 4000);
        return;
    }
    
    // 選択された色テーマを取得
    const selectedTheme = document.querySelector('input[name="colorTheme"]:checked').value;
    currentTheme = selectedTheme;
    keywordColor = colorThemes[currentTheme].keyword;
    defaultCharColor = colorThemes[currentTheme].default;
    
    // UIテーマも更新
    updateUITheme(selectedTheme);
    
    originalMessage = sanitizedText; // サニタイズされたメッセージを保存
    const newKeywords = generateKeywordsFromText(sanitizedText, 5); // 最初は5文字で分割

    startMatrix(newKeywords, true); // User generated, show controls
});

function resetToInputForm() {
    matrixSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    canvas.classList.add('hidden'); // キャンバスも非表示にする
    if (backToHomeOverlayButtonContainer) backToHomeOverlayButtonContainer.classList.add('hidden'); // オーバーレイボタンを非表示
    if (animationInterval) clearInterval(animationInterval);

    userMessageInput.value = "";
    originalMessage = ""; // 元のメッセージもクリア
    shareTextArea.value = ""; // SNS用テキストもクリア
    
    // テーマをクラシックにリセット
    document.querySelector('input[name="colorTheme"][value="classic"]').checked = true;
    updateUITheme('classic');
    currentTheme = 'classic';
    
    // オーバーレイボタンも隠す際にテーマをリセット
    if (backToHomeOverlayButtonContainer) {
        const themeClasses = ['theme-classic', 'theme-blue', 'theme-purple', 'theme-red', 'theme-orange'];
        themeClasses.forEach(themeClass => {
            backToHomeOverlayButtonContainer.classList.remove(themeClass);
        });
        backToHomeOverlayButtonContainer.classList.add('theme-classic');
    }

    // URLから 'd' パラメータを削除
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('d');
    history.pushState({}, '', currentUrl.toString());
}

resetButton.addEventListener('click', resetToInputForm);

if (backToHomeOverlayButton) { // このボタンはオーバーレイ表示用
    backToHomeOverlayButton.addEventListener('click', resetToInputForm);
}

if (saveGifButton) {
    saveGifButton.addEventListener('click', () => {
        saveGifButton.disabled = true;
        resetButton.disabled = true;
        if (backToHomeOverlayButton) backToHomeOverlayButton.disabled = true;
        statusMessage.textContent = 'GIF生成中... (約3秒間録画)';

        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: './gif.worker.js', // ローカルパスに変更
            background: '#000000',
            width: canvas.width,
            height: canvas.height
        });

        const recordDuration = 3000; // 3秒間
        const framesToRecord = recordDuration / animationDelay;
        let framesRecorded = 0;
        const originalInterval = animationInterval;
        if (originalInterval) clearInterval(animationInterval); // 一時的にメインのアニメーションを停止

        function recordFrame() {
            if (framesRecorded < framesToRecord) {
                draw(); // 現在のフレームを描画
                gif.addFrame(canvas, { copy: true, delay: animationDelay });
                framesRecorded++;
                statusMessage.textContent = `GIF生成中... ${Math.round((framesRecorded / framesToRecord) * 100)}%`;
                requestAnimationFrame(recordFrame); // 次のフレームを要求
            } else {
                statusMessage.textContent = 'GIFエンコード中...';
                gif.render();
            }
        }

        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'code_wave_message_animation.gif';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            statusMessage.textContent = 'GIFが保存されました！';
            saveGifButton.disabled = false;
            resetButton.disabled = false;
            if (backToHomeOverlayButton) backToHomeOverlayButton.disabled = false;
            if (!matrixSection.classList.contains('hidden')) { // マトリックス表示中ならアニメーション再開
                animationInterval = setInterval(draw, animationDelay);
            }
            setTimeout(() => statusMessage.textContent = '', 3000);
        });
        gif.on('progress', function(p) {
             statusMessage.textContent = `GIFエンコード中... ${Math.round(p * 100)}%`;
        });
        recordFrame(); // 録画開始
    });
}


copyLinkButton.addEventListener('click', () => {
    shareTextArea.select();
    try {
        document.execCommand('copy');
        statusMessage.textContent = 'SNS用テキストがコピーされました！';
    } catch (err) {
        statusMessage.textContent = 'コピーに失敗しました。';
        console.error('Failed to copy: ', err);
    }
    setTimeout(() => statusMessage.textContent = '', 3000);
});

openInNewTabButton.addEventListener('click', () => {
    const shareText = shareTextArea.value;
    if (shareText) {
        // URLを抽出してタブで開く
        const urlMatch = shareText.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            window.open(urlMatch[0], '_blank');
        }
    }
});

// 言語切り替えタブのイベントリスナー
langTabJa.addEventListener('click', () => {
    if (currentLanguage !== 'ja') {
        currentLanguage = 'ja';
        updateLanguageTabs();
        updateUITexts();
        // 現在のURLでシェアテキストを再生成
        if (shareTextArea.value) {
            const urlMatch = shareTextArea.value.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
                generateShareText(urlMatch[0]);
            }
        }
    }
});

langTabEn.addEventListener('click', () => {
    if (currentLanguage !== 'en') {
        currentLanguage = 'en';
        updateLanguageTabs();
        updateUITexts();
        // 現在のURLでシェアテキストを再生成
        if (shareTextArea.value) {
            const urlMatch = shareTextArea.value.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
                generateShareText(urlMatch[0]);
            }
        }
    }
});

// 言語タブの表示状態を更新する関数
function updateLanguageTabs() {
    langTabJa.classList.toggle('active', currentLanguage === 'ja');
    langTabEn.classList.toggle('active', currentLanguage === 'en');
}

// UIテキストを更新する関数
function updateUITexts() {
    const texts = uiTexts[currentLanguage];
    
    // ボタンテキストを更新
    openInNewTabButton.textContent = texts.preview;
    backToHomeOverlayButton.textContent = texts.backToHome;
    resetButton.textContent = texts.newMessage;
    copyLinkButton.textContent = texts.copyButton;
    generateMatrixButton.textContent = texts.generateButton;
}

window.addEventListener('resize', () => {
    if (!canvas.classList.contains('hidden')) { // Check if canvas is visible
        initializeCanvas();
        // リサイズ時も経過時間を考慮してキーワードを再生成する必要がある
        const currentTime = Date.now();
        const elapsedTime = currentTime - animationStartTime;
        const longestLineLength = originalMessage.split('\n').reduce((max, line) => Math.max(max, line.trim().length), 0);
        const finalChunkSize = longestLineLength > 0 ? longestLineLength : 5;
        const currentChunkSize = calculateChunkSize(elapsedTime, animationDuration, 5, finalChunkSize);
        const newKeywords = generateKeywordsFromText(originalMessage, currentChunkSize);
        initializeStreams(newKeywords); // リサイズ時は新しいキーワードリストでストリームを再初期化
    }
    // リサイズ時に inputSection が表示されている場合は、canvas は非表示のまま
    if (!inputSection.classList.contains('hidden')) canvas.classList.add('hidden');
});

// OGP URLを動的に設定
function setDynamicOGP(sharedMessage = null) {
    // 現在のURL（パラメータ含む）を取得
    const currentUrl = window.location.href;
    const imageUrl = `${window.location.origin}/images/codewave-preview.png`;
    
    const ogUrl = document.getElementById('ogUrl');
    const ogImage = document.getElementById('ogImage');
    const twitterImage = document.getElementById('twitterImage');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogUrl) {
        ogUrl.setAttribute('content', currentUrl);
    }
    
    if (ogImage) {
        // プレビュー画像のURLも動的に設定
        ogImage.setAttribute('content', imageUrl);
    }
    
    if (twitterImage) {
        // Twitter Card用の画像も設定
        twitterImage.setAttribute('content', imageUrl);
    }
    
    // 共有されたメッセージがある場合、OGPタイトルと説明を動的に更新
    if (sharedMessage) {
        const truncatedMessage = sharedMessage.length > 30 ? 
            sharedMessage.substring(0, 30) + '...' : sharedMessage;
        
        if (ogTitle) {
            ogTitle.setAttribute('content', `Code Wave - "${truncatedMessage}"`);
        }
        
        if (ogDescription) {
            ogDescription.setAttribute('content', 
                `「${truncatedMessage}」がコードの浪に隠されています。サイバーなエフェクトをお楽しみください！`);
        }
    }
}

function init() {
    // OGP設定を最初に実行
    setDynamicOGP();
    
    // UIテキストを初期設定
    updateUITexts();
    
    const urlParams = new URLSearchParams(window.location.search);
    const encodedDataParam = urlParams.get('d'); // 難読化されたパラメータ 'd' を取得

    if (encodedDataParam) {
        try {
            // Base64 デコードしてから UTF-8 バイト列を文字列にデコード
            const decodedBytes = Uint8Array.from(atob(encodedDataParam), c => c.charCodeAt(0));
            const data = JSON.parse(new TextDecoder().decode(decodedBytes));
            if (data && data.message) {
                const rawMessage = data.message;
                const theme = data.theme || 'classic'; // テーマが指定されていない場合はクラシック
                
                // URLパラメータからの入力もサニタイズ
                if (!validateSafeChars(rawMessage)) {
                    console.error("Unsafe characters detected in URL parameter");
                    resetToInputForm();
                    return;
                }
                
                const sanitizedMessage = sanitizeInput(rawMessage);
                if (!sanitizedMessage || sanitizedMessage.trim() === '') {
                    console.error("Empty or invalid message in URL parameter");
                    resetToInputForm();
                    return;
                }
                
                userMessageInput.value = sanitizedMessage;
                originalMessage = sanitizedMessage; // サニタイズされたメッセージを保存
                
                // 共有されたメッセージでOGPを更新
                setDynamicOGP(sanitizedMessage);
                
                // テーマを適用
                currentTheme = theme;
                keywordColor = colorThemes[currentTheme].keyword;
                defaultCharColor = colorThemes[currentTheme].default;
                updateUITheme(theme);
                
                const newKeywords = generateKeywordsFromText(sanitizedMessage, 5); // 最初は5文字で分割
                startMatrix(newKeywords, false); // Loaded from URL, do not show controls
            } else {
                 // データ形式が不正な場合
                 console.error("Decoded data is missing 'message' property.");
                 resetToInputForm(); // 入力フォームに戻す
            }
        } catch (error) {
            console.error("Failed to decode or parse URL parameter:", error);
            // エラー発生時は通常通り入力画面を表示
            resetToInputForm(); // 入力フォームに戻す
        }
    } else {
        // パラメータがない場合は入力フォームを表示
        inputSection.classList.remove('hidden');
        matrixSection.classList.add('hidden');
        canvas.classList.add('hidden');
        if (backToHomeOverlayButtonContainer) backToHomeOverlayButtonContainer.classList.add('hidden');
    }
}

init();
