#!/usr/bin/env python
""" pygame.examples.audiocapture
A pygame 2 experiment.
* record sound from a microphone
* play back the recorded sound
"""
import pygame as pg
import time
import wave


if pg.get_sdl_version()[0] < 2:
    raise SystemExit("This example requires pygame 2 and SDL2.")

from pygame._sdl2 import (
    get_audio_device_name,
    get_num_audio_devices,
    AudioDevice,
    AUDIO_F32,
    AUDIO_ALLOW_FORMAT_CHANGE,
)
from pygame._sdl2.mixer import set_post_mix

pg.mixer.pre_init(44100, 32, 2, 512)
pg.init()

# _0 = get_num_audio_devices(0)
# _1 = get_num_audio_devices(1)
# input_device = get_audio_device_name(0,0)
# for i in range(_0):
#     for j in range(_1):
#         print(get_audio_device_name(i, j))
#         a = input('use this input device? y/n:')
#         if a == 'y':
#             input_device = get_audio_device_name(i,j)



# print('input_device:', input_device)

# init_subsystem(INIT_AUDIO)
names = [get_audio_device_name(x, 1) for x in range(get_num_audio_devices(1))]
print('found audio devices:', names)

input_device = get_audio_device_name(0,0)
for x in range(get_num_audio_devices(1)):    
    print('input_device:', names[x])
    a = input('use this input device? y/n:')
    if a == 'y':
        input_device = names[x]

print('input_device:', input_device)


iscapture = 1
sounds = []
sound_chunks = []
is_playing = False

def callback(audiodevice, audiomemoryview):
    """ This is called in the sound thread.
    Note, that the frequency and such you request may not be what you get.
    """
    # print(type(audiomemoryview), len(audiomemoryview))
    # print(audiodevice)
    # sound_chunks.append(bytes(audiomemoryview))
    sound = pg.mixer.Sound(bytes(audiomemoryview))
    # sound = pg.mixer.Sound(buffer=b"".join(sound_chunks))
    global is_playing
    if not is_playing:
        is_playing = False
        sound.play()
    # time.sleep(5)


def postmix_callback(postmix, audiomemoryview):
    """ This is called in the sound thread.
    At the end of mixing we get this data.
    """
    # print(type(audiomemoryview), len(audiomemoryview))
    # print(postmix)

set_post_mix(postmix_callback)

CHUNK = 1024
FORMAT = AUDIO_F32
CHANNELS = 2
RATE = 44100
WAVE_OUTPUT_FILENAME = "output.wav"

audio = AudioDevice(
    devicename=input_device,
    iscapture=1,
    frequency=RATE,
    audioformat=FORMAT,
    numchannels=CHANNELS,
    chunksize=CHUNK,
    allowed_changes=AUDIO_ALLOW_FORMAT_CHANGE,
    callback=callback,
)

# start recording.
audio.pause(0)

print("recording with :%s:" % input_device)
time.sleep(5)


# print("Turning data into a pg.mixer.Sound")
# sound = pg.mixer.Sound(buffer=b"".join(sound_chunks))

# print("playing back recorded sound")
# sound.play()
# time.sleep(5)