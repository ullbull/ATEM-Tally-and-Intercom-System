import socketio
import time
import asyncio

sio = socketio.AsyncClient()

@sio.event
async def connect():
  print("I'm connected!")
  for x in range(5):
    await sio.emit('msg', f'{x} - hej!')
    await asyncio.sleep(1)
    await sio.emit('msg2', f'{x} - hej!')

@sio.event
async def disconnect():
  print("I'm disconnected!")
  
@sio.on('msg')
async def msg(data):
  print('received a msg:', data)

async def main():
  await sio.connect('http://localhost:5000')
  print('my sid is', sio.sid)

  await sio.wait()

loop = asyncio.get_event_loop()
# asyncio.ensure_future(main())
# loop.run_forever()
loop.run_until_complete(main())
loop.close()
