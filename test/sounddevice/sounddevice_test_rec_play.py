import sounddevice as sd

device_dict = sd.query_devices()
print('Devices: \n', device_dict)

fs = 44100
duration = 3  # seconds

# Find input device
input_device = 0
for device in device_dict:
  if device['max_input_channels'] > 0:
    input_device = device['name']
    break

myrecording = sd.rec(
  int(duration * fs),
  samplerate=fs,
  channels=2,
  device=input_device
  )

print('Recording on device', input_device)
sd.wait()

print('Playing...')
sd.play(myrecording, fs)
sd.wait()