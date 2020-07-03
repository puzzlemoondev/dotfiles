if [[ ! $DISPLAY && $XDG_VTNR -eq 1 ]]; then
    [[ $(fgconsole 2>/dev/null) == 1 ]] &&
    exec ssh-agent startx --vt1 &> /dev/null
fi
