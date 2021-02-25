This is an intercom system combined with tally. Tally system is compatible with the Blackmagicdesign ATEM Live Production Switchers.

Instructions:

Download code and run npm install

To start the server run node server.js

To connect a client open a web browser and enter https://[ip address to the server]:5000

### Autostart server on boot
Place the file server.service in /lib/systemd/system/ and enter the following commands

```console
sudo systemctl daemon-reload
sudo systemctl enable sample.service
```
