
# FFMPEG example of Blocking Mode Audio I/O https://people.csail.mit.edu/hubert/pyaudio/docs/

"""PyAudio Example: Play a wave file."""

import pyaudio
import wave
import sys
import subprocess

CHUNK = 1024

if len(sys.argv) < 2:
    print("Plays an audio file.\n\nUsage: %s filename.wav" % sys.argv[0])
    sys.exit(-1)

song = subprocess.Popen(["ffmpeg.exe", "-i", sys.argv[1], "-loglevel", "panic", "-vn", "-f", "s16le", "pipe:1"],
                        stdout=subprocess.PIPE)

# instantiate PyAudio (1)
p = pyaudio.PyAudio()

# open stream (2)
stream = p.open(format=pyaudio.paInt16,
                channels=2,         # use ffprobe to get this from the file beforehand
                rate=44100,         # use ffprobe to get this from the file beforehand
                output=True)

# read data
data = song.stdout.read(CHUNK)

# play stream (3)
while len(data) > 0:
    stream.write(data)
    data = song.stdout.read(CHUNK)

# stop stream (4)
stream.stop_stream()
stream.close()

# close PyAudio (5)
p.terminate()