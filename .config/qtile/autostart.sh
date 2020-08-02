#!/bin/bash

redshift -l 25.04:121.53 -g 1.0:0.8:0.7 &
mpDris2 &
~/.fehbg &
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
gnome-keyring-daemon --start --components=pkcs11,secrets &
numlockx on &
fcitx &
pacwall -b "#323D43" -s "#D8CAAC22" -d "#E68183AA" -e "#89BEBAAA" -p "#A7C080AA" -f "#D3A0BCAA" -u "#D9BB80AA" -r 0.6 -o ${HOME}/Pictures/walls/pacwall.png &
