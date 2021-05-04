#!/bin/bash

nitrogen --restore &
redshift -l 25.04:121.53 -g 1.0:0.8:0.7 &

numlockx on &
if [[ $USER != *"sean"* ]]; then
	xautolock -locker 'betterlockscreen -l dimblur' -time 5 &
fi

/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
gnome-keyring-daemon --start --components=pkcs11,secrets &

picom -b &
pulseeffects --gapplication-service &

start-barva &
fcitx &
