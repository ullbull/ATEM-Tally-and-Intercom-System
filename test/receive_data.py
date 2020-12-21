"""
Server receiver of the file
"""
import socket
import tqdm
import os
import time
import sys
import pyaudio
import wave
import sys
import readchar
import threading

exit_char = 'e'
run = True
data = 'nothing yet'
def exit_on_user_input(exit_char):
    global run
    global data
    print(f'Press {exit_char} to exit.')
    while run:
        c = readchar.readkey()   
        if c == exit_char:
            print('yey')
            run = False

        if c == 's':
            print('data:', data)
        time.sleep(5)

def millis():
  return int(round(time.time() * 1000))

def receive_file(host, port):
    # receive 4096 bytes each time
    BUFFER_SIZE = 4096

    SEPARATOR = "<SEPARATOR>"

    # create the server socket
    # TCP socket
    s = socket.socket()

    # bind the socket to our local address
    s.bind((host, port))

    # enabling our server to accept connections
    # 5 here is the number of unaccepted connections that
    # the system will allow before refusing new connections
    s.listen(5)

    print(f"[*] Listening as {host}:{port}")

    # accept connection if there is any
    client_socket, address = s.accept() 

    # if below code is executed, that means the sender is connected
    print(f"[+] {address} is connected.")
    
    # receive the file infos
    # receive using client socket, not server socket
    received = client_socket.recv(BUFFER_SIZE).decode()
    filename, filesize = received.split(SEPARATOR)

    # remove absolute path if there is
    filename = os.path.basename(filename)

    # convert to integer
    filesize = int(filesize)

    # start receiving the file from the socket
    # and writing to the file stream
    #tqdm lib for progressbar
    progress = tqdm.tqdm(range(filesize), f"Receiving {filename}", unit="B", unit_scale=True, unit_divisor=1024)

    new_filename = str(millis()) + '_' + filename
    with open(new_filename, "wb") as f:

        for _ in progress:
            # read 1024 bytes from the socket (receive)
            bytes_read = client_socket.recv(BUFFER_SIZE)
            
            if not bytes_read:    
                print("H")
                # nothing is received
                # file transmitting is done
                break
            
            # write to the file the bytes we just received
            f.write(bytes_read)
            
            # update the progress bar
            progress.update(len(bytes_read))

    # close the client socket
    client_socket.close()

    # close the server socket
    s.close()

    return new_filename

def receive_chunks(host, port):
    chunk_size = 4096
    
    # create the server socket
    # TCP socket
    s = socket.socket()

    # bind the socket to our local address
    s.bind((host, port))

    # enabling our server to accept connections
    # 5 here is the number of unaccepted connections that
    # the system will allow before refusing new connections
    s.listen(5)

    print(f"[*] Listening as {host}:{port}")

    # accept connection if there is any
    client_socket, address = s.accept() 

    # if below code is executed, that means the sender is connected
    print(f"[+] {address} is connected.")
    
    # receive using client socket, not server socket
    received_bytes = []
    empty = sys.getsizeof(client_socket.recv(0))
    size = empty + 1
    while size > empty:
        bytes_read = client_socket.recv(chunk_size)
        size = sys.getsizeof(bytes_read)
        received_bytes.append(bytes_read)

    # # Print received data
    # print('received: ')
    # for bytes_read in received_bytes:
    #     print(bytes_read.decode(), end = '')

    # close the client socket
    client_socket.close()

    # close the server socket
    s.close()

    return received_bytes

def play_audio_stream(host, port):
    CHUNK_SIZE = 64
    WIDTH = 2
    CHANNELS = 2
    RATE = 44100
    global run
    
    p = pyaudio.PyAudio()
    stream = p.open(format=p.get_format_from_width(WIDTH),
                    channels=CHANNELS,
                    rate=RATE,
                    output=True)


    # create the server socket
    # TCP socket
    s = socket.socket()

    # bind the socket to our local address
    s.bind((host, port))

    # enabling our server to accept connections
    # 5 here is the number of unaccepted connections that
    # the system will allow before refusing new connections
    s.listen(5)

    print(f"[*] Listening as {host}:{port}")

    # accept connection if there is any
    client_socket, address = s.accept() 

    # if below code is executed, that means the sender is connected
    print(f"[+] {address} is connected.")
    
    # receive using client socket, not server socket
    empty = sys.getsizeof(client_socket.recv(0))
    size = empty + 1

    t_listen_key = threading.Thread(target=exit_on_user_input, args=(exit_char,))
    t_listen_key.start()
    # print('1')
    # while run:
    while size > empty:
        # Receive bytes
        bytes_read = client_socket.recv(CHUNK_SIZE)
        size = sys.getsizeof(bytes_read)

        # Play received bytes
        stream.write(bytes_read)
    # print('2')
    t_listen_key.join()    

    stream.stop_stream()
    stream.close()
    p.terminate()
    
    # close the client socket
    client_socket.close()

    # close the server socket
    s.close()

def play_audio_stream_2(host, port):
    CHUNK_SIZE = 64
    WIDTH = 2
    CHANNELS = 2
    RATE = 44100
    global run
    
    p = pyaudio.PyAudio()



    # create the server socket
    # TCP socket
    s = socket.socket()

    # bind the socket to our local address
    s.bind((host, port))

    # enabling our server to accept connections
    # 5 here is the number of unaccepted connections that
    # the system will allow before refusing new connections
    s.listen(5)

    print(f"[*] Listening as {host}:{port}")

    # accept connection if there is any
    client_socket, address = s.accept() 

    # if below code is executed, that means the sender is connected
    print(f"[+] {address} is connected.")

    
    p = pyaudio.PyAudio()

    stream = p.open(format=p.get_format_from_width(WIDTH),
                    channels=CHANNELS,
                    rate=RATE,
                    output=True)

    stream.start_stream()
    
    # receive using client socket, not server socket
    empty = sys.getsizeof(client_socket.recv(0))
    size = empty + 1
    bytes_read = client_socket.recv(CHUNK_SIZE)

    t_listen_key = threading.Thread(target=exit_on_user_input, args=(exit_char,))
    t_listen_key.start()
    # print('1')
    # while run:
    while size > empty:
        # Play back bytes
        stream.write(bytes_read)
        
        # Receive bytes
        bytes_read = client_socket.recv(CHUNK_SIZE)
        size = sys.getsizeof(bytes_read)

        # time.sleep(0.1)


    # print('2')
    t_listen_key.join()    

    stream.stop_stream()
    stream.close()
    
    # close the client socket
    client_socket.close()

    # close the server socket
    s.close()

    p.terminate()
