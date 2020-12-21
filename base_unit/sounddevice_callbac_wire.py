import sounddevice as sd

device_dict = sd.query_devices()
print('Devices: \n', device_dict)

SAMPLE_RATE = 44100
CHANNELS = 2
duration = 5  # seconds

# Find input/output device
input_device = 0
output_device = 0
for device in device_dict:
  if device['max_input_channels'] > 0:
    input_device = device['name']
    break
for device in device_dict:
  if device['max_output_channels'] > 0:
    output_device = device['name']
    break

sd.default.samplerate = SAMPLE_RATE
sd.default.channels = CHANNELS

def callback(indata, outdata, frames, time, status):
    if status:
        print(status)
    outdata[:] = indata

output_device = 'default'
with sd.Stream( device=(input_device, output_device),
                samplerate=SAMPLE_RATE,
                latency=0.1,
                channels=2,
                callback=callback):
    sd.sleep(int(duration * 1000))





# print('Recording on device', input_device)
# myrecording = sd.rec(
#   int(duration * SAMPLE_RATE),
#   samplerate=SAMPLE_RATE,
#   channels=2,
#   device=input_device
#   )
# sd.wait()

# output_device = 'default'
# print('Playing on device', output_device)
# sd.play(myrecording, SAMPLE_RATE, device=output_device)
# sd.wait()
