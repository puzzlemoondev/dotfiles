#!/bin/bash

redshift -l 25.04:121.53 -g 1.0:0.8:0.7 &
mpDris2 &
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
gnome-keyring-daemon --start --components=pkcs11,secrets &
numlockx on &
fcitx &
nitrogen --restore &
pulseeffects --gapplication-service &
picom -b
