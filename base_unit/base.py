import asyncio
import pyaudio
import wave
import time
import sys
from pynput import keyboard
import socketio
from aiohttp import web
import threading

# create a Socket.IO server
sio = socketio.AsyncServer()

app = web.Application()
sio.attach(app)

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "Hello, " + name
    return web.Response(text=text)

app.add_routes([web.get('/', handle),
                web.get('/{name}', handle)])

def stream_audio():
    # if not stream.is_active():
    #     stream.start_stream()
    pass

def stop_stream_audio():
#   stream.stop_stream()
  pass

def on_press(key):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.run_until_complete(async_on_press(key))
    loop.close()

def on_release(key):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.run_until_complete(async_on_release(key))
    loop.close()

async def async_on_press(key):
  try:
    # Char key is pressed
    if (key.char == 'a'):
      print('a')

  except AttributeError:
    # Special key is pressed
    if (key == keyboard.Key.shift):   
      stream_audio()

    if (key == keyboard.Key.ctrl_r):
      print('right ctrl')
    
    if (key == keyboard.Key.esc):
      print('esc')


async def async_on_release(key):
  # print('key up:', key)
  try:
    # Char key is released      
    if(key.char == 'q'):
      print('q')

  except AttributeError:
    # Special key is released
    if (key == keyboard.Key.shift):
      stop_stream_audio()

    if (key == keyboard.Key.alt_l):
      await sio.emit('msg', 'Hej från server')

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

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
async def chat_message(sid, data):
    print("message ", data)
    await sio.emit('reply', room=sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

@sio.on('msg')
async def msg(sid, data):
    print(f'Got msg from {sid}: {data}')
    await sio.emit('msg', 'Hej från server')

@sio.on('stream')
async def incoming_stream(sid, data):
    stream.write(data)

if __name__ == '__main__':
    # Create keyboard listener thread
    key_listener = keyboard.Listener(
        on_press=on_press,
        on_release=on_release)

    key_listener.start()

    # print('Hold shift key to speak.')
    print('Press esc to exit.')

    web.run_app(app, port=5000)

    # Wait for key listener to stop
    key_listener.join()

stream.stop_stream()
stream.close()
p.terminate()
