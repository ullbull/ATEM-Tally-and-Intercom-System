import sounddevice as sd

device_dict = sd.query_devices()
print('Devices: \n', device_dict)

SAMPLE_RATE = 44100
CHANNELS = 2
duration = 3  # seconds

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

print('Recording on device', input_device)
myrecording = sd.rec(
  int(duration * SAMPLE_RATE),
  samplerate=SAMPLE_RATE,
  channels=2,
  device=input_device
  )
sd.wait()

output_device = 'default'
print('Playing on device', output_device)
sd.play(myrecording, SAMPLE_RATE, device=output_device)
sd.wait()
