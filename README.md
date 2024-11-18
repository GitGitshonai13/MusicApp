# 個人制作の音楽アプリ

作品名：Ciasum
## 使用技術
- **フロントエンド**: React, TailwindCSS, Vite, JavaScript
- **バックエンド**: Python, Flask, SQLAlchemy

## セットアップ手順

### 1. ローカルにリポジトリをクローン
まず、リポジトリをローカルにクローンします。
```
git clone https://github.com/GitGitshonai13/MusicApp.git
cd MusicApp
```
### 2.python環境の準備
requirements.txt を使って、必要なPythonパッケージをインストールします。
```
pip install -r requirements.txt
```

### 3.Flaskサーバーの起動
バックエンドのFlaskサーバーを起動します。flask ディレクトリに移動し、app.py を実行します。
```
cd flask
python app.py
```

### 4.Flaskサーバーの起動
ブラウザで http://127.0.0.1:5000 を開き、"接続完了"が表示されるか確認します。

### 5.viteのインストール（⚠️ 別のターミナルで行います）
別のターミナルで、react ディレクトリに移動します。
フロントエンド部分でViteを使用しているため、Viteをインストールします。
```
cd react
npm install vite --save-dev
```

### 6.Reactフロントエンドの起動
Reactの開発サーバーを起動します。
```
npm run dev
```

### 7.アプリケーションの確認
ブラウザで http://localhost:5173 を開き、アプリケーションが正常に表示されるか確認します。
