#!/bin/bash

numlockx on &
xautolock -locker lock -time 10 &
nitrogen --restore &
redshift -l 25.04:121.53 -g 1.0:0.8:0.7 &
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
gnome-keyring-daemon --start --components=pkcs11,secrets &
picom -b &
pulseeffects --gapplication-service &
start-barva &
fcitx &
