import readchar

def exit_on_user_input(exit_char):
  # c = ''
  print(f'Press {exit_char} to exit.')
  while True:
    c = readchar.readkey()

    # try:
    #   c = readchar.readchar().decode("utf-8")
    # except Exception:
    #   c = '0'
    
    if c == exit_char:
      print('yey')
      break


  # return c

exit_on_user_input('e')

# thread_exit_on_input = threading.Thread(
#   target=exit_on_user_input,
#   args=(EXIT_CHAR,),
#   daemon=True
#   )
  
# thread_exit_on_input.start()
# # thread_exit_on_input.join()