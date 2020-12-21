import pygame as pg
import wave
import sys
import time

if len(sys.argv) < 2:
    print("Plays a wave file.\n\nUsage: %s filename.wav" % sys.argv[0])
    sys.exit(-1)

filename = sys.argv[1]

pg.mixer.pre_init()
pg.init()
sound = pg.mixer.Sound(filename)

print("playing back", filename)
sound.play()
time.sleep(2)
sound.stop()

