from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS
import uuid
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 設定
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music.db'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# データベースの初期化
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Musicテーブル
class Music(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    music_name = db.Column(db.String(100), nullable=False)
    artist_name = db.Column(db.String(100), nullable=False)
    music_file_url = db.Column(db.String(150), nullable=False)
    image_file_url = db.Column(db.String(150), nullable=False)
    genre = db.Column(db.String(50), nullable=False)  # 新しいカラム: ジャンル
    play_count = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Music {self.music_name} by {self.artist_name}>'

    def increment_play_count(self):
        self.play_count += 1

# Playlistテーブル
class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    music_id = db.Column(db.Integer, db.ForeignKey('music.id'), nullable=False)
    music = db.relationship('Music', backref=db.backref('playlists', lazy=True))

    def __repr__(self):
        return f'<Playlist {self.music_id}>'

# Historyテーブル
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    music_name = db.Column(db.String, nullable=False)
    artist_name = db.Column(db.String, nullable=False)
    image_file_url = db.Column(db.String, nullable=False)
    music_file_url = db.Column(db.String, nullable=False)
    genre = db.Column(db.String, nullable=False)  # Optional, if you are saving genre
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<History {self.music_name}>'

# 再生履歴を追加する関数
def add_to_history(music_id):
    music = Music.query.get(music_id)
    if music:
        new_history = History(music_id=music_id)
        db.session.add(new_history)
        db.session.commit()


# データベースの初期化
with app.app_context():
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    db.create_all()

@app.route('/')
def index():
    return render_template('flask.html')

@app.route('/playlist-view')
def playlist_view():
    return render_template('playlist.html')

@app.route('/history-view')
def history_view():
    return render_template('history.html')

@app.route('/play/<int:id>', methods=['POST'])
def play_music(id):
    music = Music.query.get(id)
    if music:
        music.increment_play_count()
        add_to_history(id)  # 再生履歴を追加
        db.session.commit()
        return jsonify({'message': 'Play count updated and added to history!'})
    return jsonify({'error': 'Music not found'}), 404

@app.route('/upload', methods=['POST'])
def upload():
    music_name = request.form.get('music_name')
    artist_name = request.form.get('artist_name')
    genre = request.form.get('genre')  # ジャンルを受け取る
    music_file = request.files.get('music_file')
    image_file = request.files.get('image_file')

    if not (music_name and artist_name and genre and music_file and image_file):
        return jsonify({'error': 'Missing required data'}), 400

    # ファイル名を生成
    music_filename = str(uuid.uuid4()) + os.path.splitext(music_file.filename)[1]
    image_filename = str(uuid.uuid4()) + os.path.splitext(image_file.filename)[1]

    # ファイルを保存するパスを作成
    music_file_path = os.path.join(app.config['UPLOAD_FOLDER'], music_filename)
    image_file_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)

    # ファイルを保存
    try:
        music_file.save(music_file_path)
        image_file.save(image_file_path)
    except Exception as e:
        return jsonify({'error': f'Failed to save files: {str(e)}'}), 500

    # Musicデータをデータベースに追加
    new_music = Music(
        music_name=music_name,
        artist_name=artist_name,
        genre=genre,  # ジャンルをデータベースに保存
        music_file_url=music_filename,
        image_file_url=image_filename
    )
    db.session.add(new_music)
    db.session.commit()

    return jsonify({'message': 'Files uploaded successfully!', 'id': new_music.id})

@app.route('/music', methods=['GET'])
def get_music():
    genre = request.args.get('genre')  # クエリパラメータからジャンルを取得
    if genre:
        music_data = Music.query.filter_by(genre=genre).all()  # ジャンルでフィルタリング
    else:
        music_data = Music.query.all()  # ジャンルが指定されていない場合は全て取得
    
    music_list = [{
        'id': item.id,
        'music_name': item.music_name,
        'artist_name': item.artist_name,
        'genre': item.genre,  # ジャンルを追加
        'music_file_url': item.music_file_url,
        'image_file_url': item.image_file_url,
        'play_count': item.play_count
    } for item in music_data]
    
    return jsonify(music_list)


@app.route('/music/play_count/increment', methods=['POST'])
def increment_play_count():
        # リクエストから music_id を取得
        data = request.get_json()
        music_id = data.get('music_id')

        # データベースから該当する曲を取得
        music = Music.query.get(music_id)

        if not music:
            return jsonify({'message': '曲が見つかりません'}), 404

        # play_countを1増やす
        music.play_count += 1

        # 変更をデータベースにコミット
        db.session.commit()

        return jsonify({'message': '再生回数が増加しました', 'play_count': music.play_count}), 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    # uploadsフォルダから画像を提供する
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_music(id):
    music = Music.query.get(id)
    if music:
        db.session.delete(music)
        db.session.commit()
        return jsonify({'message': 'Music deleted successfully!'})
    return jsonify({'error': 'Music not found'}), 404

@app.route('/delete/all', methods=['DELETE'])
def delete_all_music():
    try:
        db.session.query(Music).delete()  # Musicテーブルのすべてのレコードを削除
        db.session.commit()
        return jsonify({'message': 'All music data has been deleted successfully.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/playlist', methods=['GET'])
def get_playlist():
    playlist_items = Playlist.query.all()
    playlist_data = [{
        'id': item.id,
        'music_name': item.music.music_name,
        'artist_name': item.music.artist_name,
        'genre': item.music.genre,  # ジャンルを追加
        'music_file_url': item.music.music_file_url,
        'image_file_url': item.music.image_file_url
    } for item in playlist_items]

    return jsonify(playlist_data)

@app.route('/playlist/add', methods=['POST'])
def add_to_playlist():
    music_id = request.json.get('music_id')
    
    # music_id がMusicテーブルに存在するか確認
    if Music.query.get(music_id):
        
        # プレイリストに同じmusic_idが存在する場合は削除
        existing_playlist_item = Playlist.query.filter_by(music_id=music_id).first()
        if existing_playlist_item:
            db.session.delete(existing_playlist_item)
            db.session.commit()
        
        # 新しいデータをプレイリストに追加
        new_playlist_item = Playlist(music_id=music_id)
        db.session.add(new_playlist_item)
        db.session.commit()
        
        return jsonify({'message': 'Added to playlist successfully!'})
    
    # music_id が存在しない場合のエラーレスポンス
    return jsonify({'error': 'Music not found'}), 404
    

@app.route('/playlist/delete_all', methods=['DELETE'])
def delete_all_playlists():
    try:
        Playlist.query.delete()  # すべてのプレイリストアイテムを削除
        db.session.commit()
        return jsonify({'message': 'All playlist items deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()  # エラーが発生した場合はロールバック
        return jsonify({'error': f'Failed to delete all playlist items: {str(e)}'}), 500

@app.route('/playlist/delete/<int:id>', methods=['DELETE'])
def delete_playlist_song(id):
    song = Playlist.query.get(id)
    if song:
        db.session.delete(song)
        db.session.commit()
        return jsonify({'message': 'Song deleted successfully from playlist!'})
    return jsonify({'error': 'Song not found in playlist'}), 404

@app.route('/api/music', methods=['GET'])
def get_music_ordered():
    music_list = Music.query.order_by(Music.play_count.desc()).all()
    response = [{'music_name': music.music_name, 'artist_name': music.artist_name, 'genre': music.genre, 'play_count': music.play_count} for music in music_list]  # ジャンルを追加
    return jsonify(response)

@app.route('/history', methods=['GET'])
def get_history():
    # 最新の再生履歴を取得（timestampの降順）
    history_data = History.query.order_by(History.timestamp.desc()).all()
    history_list = []

    for item in history_data:
        history_list.append({
            'id': item.id,
            'music_name': item.music_name,
            'artist_name': item.artist_name,
            'image_file_url': item.image_file_url,
            'music_file_url': item.music_file_url,
            'genre': item.genre,  # ジャンルを追加
            'timestamp': item.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })

    return jsonify(history_list)

# 曲を履歴に追加するエンドポイント
@app.route('/history', methods=['POST'])
def add_to_history(music_id):
    music = Music.query.get(music_id)
    if music:
        new_history = History(
            music_name=music.music_name,
            artist_name=music.artist_name,
            image_file_url=music.image_file_url,
            music_file_url=music.music_file_url,
            genre=music.genre
        )
        db.session.add(new_history)
        db.session.commit()

    return jsonify({'message': '曲が履歴に追加されました'}), 201

@app.route('/history/toggle', methods=['POST'])
def toggle_history():
    data = request.json
    music_name = data.get('music_name')
    artist_name = data.get('artist_name')
    image_file_url = data.get('image_file_url')
    music_file_url = data.get('music_file_url')
    genre = data.get('genre')

    # 必要な情報が提供されていない場合、エラーを返す
    if not all([music_name, artist_name, image_file_url, music_file_url, genre]):
        return jsonify({"error": "All fields (music_name, artist_name, image_file_url, music_file_url, genre) are required"}), 400

    # 同じ曲とアーティストが履歴に存在するか確認
    existing_entry = History.query.filter_by(music_name=music_name, artist_name=artist_name).first()

    # 履歴に存在する場合、新しい情報を追加
    if existing_entry:
        # 新しい履歴情報を追加
        new_history_entry = History(
            music_name=music_name,
            artist_name=artist_name,
            image_file_url=image_file_url,
            music_file_url=music_file_url,
            genre=genre
        )
        db.session.add(new_history_entry)
        db.session.commit()

        # 古い情報を削除
        db.session.delete(existing_entry)
        db.session.commit()

        return jsonify({"message": "New song added and old song removed from history"}), 200
    else:
        # 履歴に存在しない場合、新しく履歴に追加
        new_history_entry = History(
            music_name=music_name,
            artist_name=artist_name,
            image_file_url=image_file_url,
            music_file_url=music_file_url,
            genre=genre
        )
        db.session.add(new_history_entry)
        db.session.commit()
        return jsonify({"message": "Song added to history"}), 201

@app.route('/history/add', methods=['POST'])
def add_history():
    print(request.json)  # リクエスト内容をログに表示
    music_id = request.json.get('music_id')  # JSONリクエストからmusic_idを取得
    music = Music.query.get(music_id)  # music_idからMusicテーブルのデータを取得

    if music:
        # 同じアーティスト名と曲名の履歴データがあるかを確認
        existing_history = History.query.filter_by(music_name=music.music_name, artist_name=music.artist_name).first()

        # 既存の履歴データがあれば削除
        if existing_history:
            db.session.delete(existing_history)
            db.session.commit()

        # 履歴に曲を追加する既存の関数を呼び出し
        add_to_history(music_id)

        # 音楽データと一緒に表示用の情報を返す
        return jsonify({
            'message': f'History added for {music.music_name} by {music.artist_name}',
            'music_name': music.music_name,
            'artist_name': music.artist_name,
            'music_file_url': music.music_file_url,  # 音楽ファイルのURL
            'image_file_url': music.image_file_url  # 曲の画像ファイルURL
        }), 200

    return jsonify({'error': 'Music not found'}), 404


@app.route('/history/playlist_add', methods=['POST'])
def playlist_add_history():
    print(request.json)  # リクエスト内容をログに表示
    artist_name = request.json.get('artist_name')  # JSONリクエストからartist_nameを取得
    song_name = request.json.get('song_name')  # JSONリクエストからsong_nameを取得
    
    # artist_nameとsong_nameでMusicテーブルから該当データを取得
    music = Music.query.filter_by(artist_name=artist_name, music_name=song_name).first()

    if music:
        # 同じアーティスト名と曲名の履歴データがあるかを確認
        existing_history = History.query.filter_by(music_name=music.music_name, artist_name=music.artist_name).first()

        # 既存の履歴データがあれば削除
        if existing_history:
            db.session.delete(existing_history)
            db.session.commit()

        # 履歴に曲を追加する既存の関数を呼び出し
        add_to_history(music.id)  # `add_to_history`にはmusic_idを渡す想定

        return jsonify({
            'message': f'History added for {music.music_name} by {music.artist_name}',
            'music_file_url': music.music_file_url  # 音楽URLを追加
        }), 200

    return jsonify({'error': 'Music not found'}), 404


# エンドポイントの作成
@app.route('/history/add_playlist', methods=['POST'])
def add_to_playlist_history():
    data = request.json
    music_id = data.get('music_id')

    # music_idが無効な場合のエラーハンドリング
    if not music_id:
        return jsonify({'error': 'music_id is required'}), 400

    try:
        new_history_entry = History(music_id=music_id)
        db.session.add(new_history_entry)
        db.session.commit()
        return jsonify({'message': 'Song added to history successfully'}), 201
    except Exception as e:
        db.session.rollback()  # エラーが発生した場合はロールバック
        return jsonify({'error': str(e)}), 500
    

#削除
@app.route('/history/<int:history_id>', methods=['DELETE'])
def delete_history(history_id):
    history_entry = History.query.get(history_id)
    if history_entry:
        db.session.delete(history_entry)
        db.session.commit()
        return jsonify({'message': 'History entry deleted'}), 200
    return jsonify({'error': 'Entry not found'}), 404

#一番新しいデータを表示
@app.route('/history/latest', methods=['GET'])
def get_latest_history():
    latest_music = History.query.order_by(History.timestamp.desc()).first()  # 最新のデータを取得
    if latest_music:
        return jsonify({
            'music_name': latest_music.music_name,
            'artist_name': latest_music.artist_name,
            'music_file_url': latest_music.music_file_url,
            'image_file_url': latest_music.image_file_url

        }), 200
    else:
        return jsonify({'error': 'No history found'}), 404


# 履歴のIDをリセットするエンドポイント
@app.route('/reset_history_ids', methods=['POST'])
def reset_history_ids():
    # ここではIDを振りなおす処理を行います（実装はデータベースの仕様によります）
    # 一例として、全ての履歴を再取得し、IDを振りなおす処理を示します
    histories = History.query.order_by(History.timestamp).all()
    for index, history in enumerate(histories):
        history.id = index + 1  # IDを1から順に振りなおす
    db.session.commit()

    return jsonify({'message': '履歴のIDをリセットしました。'}), 200


if __name__ == '__main__':
    app.run(debug=True)
