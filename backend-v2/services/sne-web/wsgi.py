"""
WSGI entry point for Gunicorn
"""
import eventlet
eventlet.monkey_patch()

from app import create_app

app = create_app()[0]  # create_app retorna (app, socketio)

if __name__ == "__main__":
    app.run()
