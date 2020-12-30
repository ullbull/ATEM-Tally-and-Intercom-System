import socketio
from aiohttp import web

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

@sio.on('msg2')
async def msg(sid, data):
    print(f'Got msg from {sid}: {data}')
    await sio.emit('msg2', 'Hej från server')

if __name__ == '__main__':
    web.run_app(app, port=5000)