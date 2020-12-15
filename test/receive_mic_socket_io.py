"""PyAudio Example: Play a wave file (callback version)"""

import pyaudio
import wave
import time
import sys

CHUNK_SIZE = 64
WIDTH = 2
CHANNELS = 2
RATE = 44100

p = pyaudio.PyAudio()

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                output=True,
                start=False,)

stream.start_stream()

################################################

import socketio
from aiohttp import web

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "Hello, " + name
    return web.Response(text=text)

app = web.Application()
app.add_routes([web.get('/', handle),
                web.get('/{name}', handle)])

####################################################

# create a Socket.IO server
sio = socketio.AsyncServer()

@sio.on('message')
def incoming_message(sid, data):
  print(f'Got a message from {sid}: {data}')

@sio.on('stream')
def incoming_stream(sid, data):
    stream.write(data)

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

sio.attach(app)

if __name__ == '__main__':
    web.run_app(app, port=5000)

print('Shutting down...')

stream.stop_stream()
stream.close()
p.terminate()
