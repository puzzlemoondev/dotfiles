#!/bin/sh
#

screenshot() {
	case $1 in
	full)
		scrot -m -e 'mv $f {home}/Pictures/' -q 90 '%Y-%m-%d-%H%M%S_$wx$h_screenshot.png'
		;;
	window)
		sleep 1
		scrot -s -e 'mv $f {home}/Pictures/' -q 90 '%Y-%m-%d-%H%M%S_$wx$h_screenshot.png' 
		;;
	*)
		;;
	esac;
}

screenshot $1
