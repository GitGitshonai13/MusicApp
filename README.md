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
```
### 2.python環境の準備
requirements.txt を使って、必要なPythonパッケージをインストールします。

```
pip install -r requirements.txt
```
### 3.viteのインストール
フロントエンド部分でViteを使用しているため、Viteをインストールします。
```
npm install vite --save-dev
```

### 4.Flaskサーバーの起動
バックエンドのFlaskサーバーを起動します。flask ディレクトリに移動し、app.py を実行します。
```
cd flask
python app.py
```

### 5.Reactフロントエンドの起動
別のターミナルで、react ディレクトリに移動して、Reactの開発サーバーを起動します。
```
cd react
npm run dev
```

###6. アプリケーションの確認
ブラウザで http://localhost:5173 を開き、アプリケーションが正常に表示されるか確認します。
