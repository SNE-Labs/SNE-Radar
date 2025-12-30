"""
SNE Web Service - Flask API with WebSocket support
"""
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://localhost/sne')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CORS configuration for cross-origin requests from radar.snelabs.space
CORS(app, origins=["https://radar.snelabs.space", "https://www.radar.snelabs.space"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allowed_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins=["https://radar.snelabs.space", "https://www.radar.snelabs.space"],
                   async_mode='gevent')

# Register blueprints
from . import main, api, auth_siwe
app.register_blueprint(auth_siwe.auth_bp)



