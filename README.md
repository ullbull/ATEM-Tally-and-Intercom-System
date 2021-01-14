This is an intercom system combined with tally. Tally system is compatible with the Blackmagicdesign ATEM Live Production Switchers.

Instructions:
To autostart server place the file rc.local in /etc/

Problems:
No sound in Chromium at first run. Run Chromium, then restart Chromium to get audio.

To achieve this over ssh, run this command:
DISPLAY=:0.0 chromium-browser
Wait for a while then hit ctrl+c and run the command again
