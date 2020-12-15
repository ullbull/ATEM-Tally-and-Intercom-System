import socketio
from aiohttp import web

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "Hello, " + name
    return web.Response(text=text)

app = web.Application()
app.add_routes([web.get('/', handle),
                web.get('/{name}', handle)])

# create a Socket.IO server
sio = socketio.AsyncServer()

# # wrap with ASGI application
# app = socketio.ASGIApp(sio)

@sio.on('message')
def incoming_message(sid, data):
  print(f'Got a message from {sid}: {data}')

@sio.on('stream')
def incoming_stream(sid, data):
    print(f'{sid} is streaming: {data}')

    

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

sio.attach(app)

if __name__ == '__main__':
    web.run_app(app, port=5000)