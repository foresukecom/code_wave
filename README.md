# Code Wave - Hidden Message Generator

マトリックス風のコードレインエフェクトに、あなたのメッセージを隠して共有できるWebアプリケーションです。

## 🚀 デモ

**[🌊 Code Wave を体験する](https://wave.foresuke.com/)**

## ✨ 特徴

- **🔤 隠しメッセージ**: 入力したテキストがマトリックス風の文字列の中に徐々に現れる
- **⏰ プログレッシブ表示**: 30秒かけて5文字→単語→文章全体へと段階的に表示
- **🎨 カラーテーマ**: クラシック緑、ブルー、パープル、レッド、オレンジの5色対応
- **🌐 多言語対応**: 日本語・英語のSNSシェアテキスト切り替え
- **📱 レスポンシブ**: モバイル・デスクトップ両対応
- **🔗 URL共有**: メッセージをBase64エンコードして共有可能
- **🔒 プライバシー保護**: 完全クライアントサイド、サーバーにデータ送信なし
- **🖼️ OGP対応**: SNSでの美しいプレビュー表示

## 🎮 使い方

1. **メッセージ入力**: テキストエリアにメッセージを入力（最大100文字）
2. **カラー選択**: お好みのテーマカラーを選択
3. **生成**: 「コードウェーブを生成 / Generate Code Wave」ボタンをクリック
4. **体験**: マトリックス風アニメーションでメッセージが段階的に表示される
5. **言語選択**: 「日本語」「English」タブでシェアテキスト言語を切り替え
6. **共有**: 「SNS用テキストをコピー / Copy Share Text」で共有リンクをコピー
7. **投稿**: SNSに投稿して友達と共有！

## 🛠️ 技術仕様

- **フロントエンド**: HTML5 Canvas, Vanilla JavaScript (ES6+), CSS3
- **スタイリング**: Tailwind CSS (CDN)
- **アニメーション**: Canvas 2D API (20FPS, 自作実装)
- **共有機能**: Base64エンコード + URLパラメータ
- **国際化**: 動的言語切り替え (日本語/英語)
- **アナリティクス**: GoatCounter
- **完全クライアントサイド**: サーバー処理・データベース不要

## 📁 ファイル構成

```
digital_rain/
├── index.html          # メインHTML
├── script.js           # Code Wave エフェクトとアプリケーションロジック
├── style.css           # スタイルシート
└── README.md           # このファイル
```

## 🎯 主要機能の実装

### デジタルレインエフェクト
- Canvas API を使用したリアルタイム描画
- 日本語カタカナ、英数字、記号を使用した文字レイン
- ランダムな文字の落下とカスタムメッセージの表示

### メッセージ表示システム
- 時間経過とともにチャンクサイズが変化（5文字 → 行全体）
- 複数行テキストの適切な処理
- メッセージの段階的な可視化

### 共有機能
- URLパラメータにBase64エンコードでメッセージを埋め込み
- デコード時のエラーハンドリング
- OGP（Open Graph Protocol）対応

## 🚀 ローカル開発

```bash
# リポジトリをクローン
git clone [repository-url]
cd digital_rain

# ローカルサーバーで起動（例: Python）
python -m http.server 8000

# ブラウザでアクセス
open http://localhost:8000
```

## 🔧 カスタマイズ

### アニメーション設定
`script.js` の以下の定数で調整可能：

```javascript
const animationDuration = 30000;        // メッセージ表示完了までの時間
const keywordAppearanceProbability = 0.003; // キーワード出現頻度
const animationDelay = 50;              // フレーム間隔
```

### スタイル設定
`style.css` や直接 JavaScript 内の色設定で調整：

```javascript
const keywordColor = '#FFF';            // メッセージの色
const defaultCharColor = '#0F0';        // 通常文字の色
```

## 🎨 デザインコンセプト

Matrix映画にインスパイアされたサイバーパンクなデジタル世界をイメージしたデザインで、コードの波の中にユーザーのメッセージが徐々に浮かび上がる体験を提供します。

## 📱 対応ブラウザ

- Chrome (推奨)
- Firefox
- Safari
- Edge

---

## 🌍 English

### Overview
A web application that hides your messages in Matrix-style code rain effects and allows you to share them easily.

### ✨ Features
- **🔤 Hidden Messages**: Your text gradually appears within Matrix-style character streams
- **⏰ Progressive Display**: 30-second progression from 5 characters → words → full sentences
- **🎨 Color Themes**: 5 themes available (Classic Green, Blue, Purple, Red, Orange)
- **🌐 Multi-language**: Japanese/English SNS share text switching
- **📱 Responsive**: Mobile and desktop support
- **🔗 URL Sharing**: Messages encoded with Base64 for easy sharing
- **🔒 Privacy**: Fully client-side, no server data transmission
- **🖼️ OGP Support**: Beautiful preview images on social media

### 🎮 How to Use
1. **Input Message**: Enter your message (max 100 characters)
2. **Select Color**: Choose your preferred theme color
3. **Generate**: Click "コードウェーブを生成 / Generate Code Wave"
4. **Experience**: Watch your message appear gradually in Matrix-style animation
5. **Language**: Switch between "日本語" and "English" tabs for share text
6. **Share**: Copy with "SNS用テキストをコピー / Copy Share Text"
7. **Post**: Share on social media!

### 🛠️ Tech Stack
- **Frontend**: HTML5 Canvas, Vanilla JavaScript (ES6+), CSS3
- **Styling**: Tailwind CSS (CDN)
- **Animation**: Canvas 2D API (20FPS, custom implementation)
- **Sharing**: Base64 encoding + URL parameters
- **i18n**: Dynamic language switching (Japanese/English)
- **Analytics**: GoatCounter
- **Architecture**: Fully client-side, no server/database required

---

## 📄 ライセンス / License

MIT License
