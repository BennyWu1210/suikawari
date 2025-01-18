from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
import os
import sqlalchemy
from dotenv import load_dotenv
import pg8000
from sqlalchemy import create_engine, text
from sqlalchemy.engine.interfaces import DBAPIType

load_dotenv()
# Note: Saving credentials in environment variables is convenient, but not
# secure - consider a more secure solution such as
# Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
# keep secrets safe.

INSTANCE_CONNECTION_NAME = os.environ[
    "INSTANCE_CONNECTION_NAME"
]  # e.g. 'project:region:instance'
DB_USER = os.environ["DB_USER"]  # e.g. 'my-db-user'
DB_PASS = os.environ["DB_PASS"]  # e.g. 'my-db-password'
DB_NAME = os.environ["DB_NAME"]  # e.g. 'my-database'

from google.cloud.sql.connector import Connector
import sqlalchemy

# initialize Connector object
connector = Connector()

print(INSTANCE_CONNECTION_NAME, DB_USER, DB_PASS, DB_NAME)

# function to return the database connection object
def getconn():
    conn = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME
    )
    return conn

# create connection pool with 'creator' argument to our connection object function
pool = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=getconn,
)

# Create the Flask app
app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = pool.url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# # Define the database models
# class Camera(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     sid = db.Column(db.String(100), unique=True, nullable=False)
#
# class ProcessingServer(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     sid = db.Column(db.String(100), unique=True, nullable=False)

with pool.connect() as db_conn:

    db_conn.execute(sqlalchemy.text(
        "CREATE TABLE IF NOT EXISTS camera (id SERIAL PRIMARY KEY, sid VARCHAR(100) NOT NULL UNIQUE)"
    ))
    db_conn.execute(sqlalchemy.text(
        "CREATE TABLE IF NOT EXISTS processing_server (id SERIAL PRIMARY KEY, sid VARCHAR(100) NOT NULL UNIQUE)"
    ))

    # test the existence of the table
    db_conn.commit()
    print("excecuted")


# create ratings table in our sandwiches database
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/viewer')
def viewer():
    return render_template('viewer.html')

@app.route('/apex')
def apex():
    return render_template('apex.html')

@socketio.on('connect')
def handle_connect():
    # camera = Camera.query.first()
    # if camera:
    with pool.connect() as db_conn:
        camera = db_conn.execute(sqlalchemy.text("SELECT * FROM camera")).fetchone()
        db_conn.commit()

    if camera:
        emit("requestForOffer", request.sid, to=camera.sid)
        print("Requesting offer from camera", request.sid)

@socketio.on('iamcamera')
def handle_camera():
    print("Camera is ", request.sid)

@socketio.on('apexCamera')
def handle_apex_camera():
    # remove previous apex camera and replace it with the new one with our current sid
    with pool.connect() as db_conn:
        db_conn.execute(sqlalchemy.text("DELETE FROM camera"))
        db_conn.execute(sqlalchemy.text(f"INSERT INTO camera (sid) VALUES ('{request.sid}')"))
        db_conn.commit()
    print("Apex camera is ", request.sid)

@socketio.on('processingServer')
def handle_processing_server():
    # remove previous processing server and replace it with the new one with our current sid
    with pool.connect() as db_conn:
        db_conn.execute(sqlalchemy.text("DELETE FROM processing_server"))
        db_conn.execute(sqlalchemy.text(f"INSERT INTO processing_server (sid) VALUES ('{request.sid}')"))
        db_conn.commit()
    print("Processing server is ", request.sid)

@socketio.on('processResult')
def process_result(data):
    emit("processResult", to=data['camera'])
    print("Sending process result to camera", data['camera'])

@socketio.on('disconnect')
def handle_disconnect():
    with pool.connect() as db_conn:
        camera = db_conn.execute(sqlalchemy.text("SELECT * FROM camera")).fetchone()
        if camera and camera.sid == request.sid:
            db_conn.execute(sqlalchemy.text("DELETE FROM camera"))
            print("Camera disconnected")

        db_conn.commit()

@socketio.on('offer')
def handle_offer(data):
    with pool.connect() as db_conn:
        camera = db_conn.execute(sqlalchemy.text("SELECT * FROM camera")).fetchone()
        db_conn.commit()
    if camera:
        emit("requestForAnswerPlOffer", {"offer": data['offer'], "camera": camera.sid}, to=data['viewer'])
        print("Got offer. Requesting answer from viewer and sending offer, offer: ", data['offer'])

@socketio.on('answer')
def handle_answer(data):
    with pool.connect() as db_conn:
        camera = db_conn.execute(sqlalchemy.text("SELECT * FROM camera")).fetchone()
        db_conn.commit()
    if camera:
        emit("answerFromViewer", {"answer": data['answer'], "viewer": request.sid}, to=camera.sid)
        print("Got answer from viewer and sending it to camera. Answer:", data['answer'])

@socketio.on('ice-candidate')
def handle_ice_candidate(data):
    emit('ice-candidate', data, to=data['to'])

@socketio.on('image')
def handle_image(data):
    with pool.connect() as db_conn:
        server = db_conn.execute(sqlalchemy.text("SELECT * FROM processing_server")).fetchone()
        db_conn.commit()
    if server:
        print("Got image from camera, sending it to processing server")
        emit('image', {"image": data['image'], "viewer": request.sid}, to=server.sid)

@socketio.on('processResult')
def handle_process_result(data):
    print("Got processed result from processing server, sending it to viewer")
    emit('processResult', data['result'], to=data['viewer'])

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8000)