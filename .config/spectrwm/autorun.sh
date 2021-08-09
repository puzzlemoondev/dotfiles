#!/bin/bash

nitrogen --restore &
redshift -l 25.04:121.53 -g 1.0:0.8:0.7 &

numlockx on &
if [[ $USER != *"sean"* ]]; then
	xset 300
	xss-lock -l -- locker &
fi

/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
gnome-keyring-daemon --start --components=pkcs11,secrets &

picom -b &
easyeffects --gapplication-service &

start-barva &
fcitx &
