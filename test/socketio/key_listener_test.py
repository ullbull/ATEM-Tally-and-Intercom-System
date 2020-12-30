from pynput import keyboard

def on_press(key):
  try:
    # Char key is pressed
    if (key.char == 'a'):
      print('a')

  except AttributeError:
    # Special key is pressed
    if (key == keyboard.Key.ctrl_l):
      print('left ctrl')

    if (key == keyboard.Key.ctrl_r):
      print('right ctrl')
    
    if (key == keyboard.Key.esc):
      print('esc')
      key_listener.stop()
   
def on_release(key):
  try:
    # Char key is released      
    if(key.char == 'q'):
      key_listener.stop()

  except AttributeError:
    # Special key is released

key_listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)

key_listener.start()

key_listener.join()
