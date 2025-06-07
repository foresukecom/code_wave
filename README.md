# Matrix Digital Rain - Message Generator

Matrix風のデジタルレインエフェクトにカスタムメッセージを隠して共有できるWebアプリケーションです。

## 🚀 デモ

[Live Demo](https://zippy-faloodeh-d8a180.netlify.app/)

## ✨ 特徴

- **カスタムメッセージ**: 入力したメッセージがMatrix風デジタルレインの中に表示されます
- **複数行対応**: 改行を含む長いメッセージにも対応
- **段階的表示**: メッセージが時間とともに段階的に明確になる演出
- **SNS共有**: 生成したエフェクトをURLで簡単に共有
- **レスポンシブ対応**: スマートフォンからデスクトップまで対応
- **OGP対応**: SNSでのシェア時にプレビュー画像が表示

## 🎮 使い方

1. テキストエリアにメッセージを入力（最大100文字）
2. 「マトリックスを生成」ボタンをクリック
3. Matrix風エフェクトが開始され、メッセージが隠れて表示されます
4. 共有リンクをコピーして友人や SNS で共有

## 🛠️ 技術仕様

- **フロントエンド**: HTML5 Canvas, JavaScript (ES6+), CSS3
- **スタイリング**: Tailwind CSS
- **アニメーション**: Canvas 2D API
- **共有機能**: Base64エンコードによるURL埋め込み

## 📁 ファイル構成

```
digital_rain/
├── index.html          # メインHTML
├── script.js           # Matrix エフェクトとアプリケーションロジック
├── style.css           # スタイルシート
└── README.md           # このファイル
```

## 🎯 主要機能の実装

### Matrix エフェクト
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

Matrix映画にインスパイアされたデザインで、サイバーパンクな雰囲気を演出。ユーザーのメッセージが徐々に浮かび上がる体験を提供します。

## 📱 対応ブラウザ

- Chrome (推奨)
- Firefox
- Safari
- Edge

## 📄 ライセンス

MIT License
