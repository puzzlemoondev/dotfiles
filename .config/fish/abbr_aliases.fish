# replacements
alias more='less'
alias vim='nvim'
alias ls='lsd --group-dirs first'

# default arguments
alias diff='diff --color=auto'
alias grep='grep --color=auto'
alias ip='ip --color=auto'
alias df='df -h'
alias free='free -m'
alias mkdir='mkdir -pv'
alias yay='yay --nocleanmenu --nodiffmenu --noeditmenu --removemake --cleanafter'
alias pacwall='pacwall -b "#323D43" -s "#D8CAAC22" -d "#E68183AA" -e "#89BEBAAA" -p "#A7C080AA" -f "#D3A0BCAA" -u "#D9BB80AA" -r 0.6 -o {$HOME}/Pictures/walls/pacwall.png'

# coreutils
alias cd='cd && ls'

abbr -ag c 'clear'

abbr -ag l 'ls -l'
abbr -ag la 'ls -a'
abbr -ag lla 'ls -la'
abbr -ag lr 'ls -R'
abbr -ag lt 'ls --tree'
abbr -ag lts 'l --total-size'

abbr -ag dud 'du -d 1 -h'
abbr -ag duf 'du -sh *'
abbr -ag fdd 'fd -t d'
abbr -ag fdf 'fd -t f'
abbr -ag map 'xargs -n1'

# yadm
abbr -ag ya 'yadm add'
abbr -ag yaa 'yadm add -u'
abbr -ag yc 'yadm commit'
abbr -ag yd 'yadm decrypt'
abbr -ag ye 'yadm encrypt'
abbr -ag yp 'yadm push'
abbr -ag yu 'yadm add -u && yadm commit && yadm push'
abbr -ag uy 'yadm fetch && yadm merge'

# arch
abbr -ag yaupg 'yay -Syu && pacwall'
abbr -ag yarem 'yay -Rns'
abbr -ag yareo 'yay --clean'

# vpn
abbr -ag vpn 'expressvpn'
abbr -ag vpna 'expressvpn activate'
abbr -ag vpnc 'expressvpn connect'
abbr -ag vpncs 'expressvpn connect smart'
abbr -ag vpnd 'expressvpn disconnect'
abbr -ag vpns 'expressvpn status'
abbr -ag vpnl 'expressvpn list'
abbr -ag vpnla 'expressvpn list all'
abbr -ag vpnr 'expressvpn refresh'
abbr -ag vpnp 'expressvpn preferences'
abbr -ag vpnh 'expressvpn help'
abbr -ag vpnlock 'expressvpn preferences set network_lock on'
abbr -ag vpnunlock 'expressvpn preferences set network_lock off'

# adb-sync
abbr -ag asm 'adb-sync ~/Music/ /sdcard/Music/'
abbr -ag asm2 'adb-sync -2 ~/Music/ /sdcard/Music/'
abbr -ag asmd 'adb-sync -d ~/Music/ /sdcard/Music/'
abbr -ag asmr 'adb-sync -R /sdcard/Music/ ~/Music/'
abbr -ag asmrd 'adb-sync -R -d /sdcard/Music/ ~/Music/'

# misc
abbr -ag x 'extract'
abbr -ag v 'vifm'
abbr -ag e 'nvim'
abbr -ag q 'exit'
abbr -ag aw 'awman'
abbr -ag ur 'sudo reflector -p http -p https -l 30 -n 20 --sort rate --save /etc/pacman.d/mirrorlist --verbose'
abbr -ag par 'prettyping archlinux.org'
abbr -ag bat 'upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -E "state|to\ full|percentage"'
abbr -ag clock 'tty-clock -s -c -D -C 6'
abbr -ag fconf 'vim ~/.config/fish/config.fish'
abbr -ag aconf 'vim ~/.config/fish/abbr_aliases.fish; and for a in (abbr -l); abbr -e $a; end; and source ~/.config/fish/abbr_aliases.fish'
