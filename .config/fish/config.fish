#{{{ Environment Variables
fish_add_path $HOME/.local/bin /usr/local/bin /opt/rocm/bin /opt/rocm/opencl/bin

set -gx LANG en_US.UTF-8
set -gx LANGUAGE en_US.UTF-8
set -gx LC_ALL en_US.UTF-8
set -gx LC_CTYPE en_US.UTF-8

set -gx VISUAL (type -p nvim)
set -gx EDITOR $VISUAL
set -gx SYSTEMD_EDITOR $VISUAL

set -gx GPG_TTY (tty)

set -gx LESS '-i -J -M -R -W -x4 -z-4'
set -gx _JAVA_AWT_WM_NONREPARENTING 1

set -gx PHPSTORM_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx WEBIDE_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx PYCHARM_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx RUBYMINE_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx CL_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx DATAGRIP_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx GOLAND_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx STUDIO_JDK '/usr/lib/jvm/jre-jetbrains'
set -gx IDEA_JDK '/usr/lib/jvm/jre-jetbrains'
#}}}
#{{{ Fish
set -l bg0        323d43
set -l bg1        3c474d
set -l bg2        465258
set -l bg3        505a60
set -l bg4        576268
set -l bg_red     392f32
set -l bg_green   333b2f
set -l bg_blue    203a41
set -l grey       868d80
set -l fg         d8caac
set -l red        e68183
set -l orange     e39b7b
set -l yellow     d9bb80
set -l green      a7c080
set -l cyan       87c095
set -l blue       89beba
set -l purple     d3a0bc

set -g fish_color_normal  $fg
set -g fish_color_command  $red --italics
set -g fish_color_quote  $green
set -g fish_color_redirection  $green
set -g fish_color_end  $fg
set -g fish_color_error  $red
set -g fish_color_param  $blue
set -g fish_color_comment  $grey --italics
set -g fish_color_match  --background=$bg4
set -g fish_color_search_match  $bg0 --background=$fg
set -g fish_color_operator  $orange
set -g fish_color_escape  $yellow
set -g fish_color_autosuggestion  $grey --italics
set -g fish_color_valid_path  --underline
set -g fish_color_history_current  $green
set -g fish_color_selection  --background=$bg3
set -g fish_pager_color_completion  $purple
set -g fish_pager_color_prefix  $orange --bold
set -g fish_pager_color_description  $grey --italics
set -g fish_pager_color_progress  $blue --bold

set -g fish_key_bindings fish_vi_key_bindings
#}}}
#{{{ Plugins
set -g pipenv_fish_fancy yes
#}}}
#{{{ Hooks
if test (uname -s) = "Darwin"
    if test (uname -m) = "arm64"
        set homebrew /opt/homebrew/bin/brew
    else
        set homebrew /usr/local/bin/brew
    end

    if type -q $homebrew
        eval ($homebrew shellenv)
    end

    set ANDROID_HOME $HOME/Library/Android/sdk

    if test -d $ANDROID_HOME
        set -gx ANDROID_HOME $ANDROID_HOME
        fish_add_path $ANDROID_HOME/platform-tools $ANDROID_HOME/tools/bin
    end

    set asdf_plugin $HOMEBREW_PREFIX/opt/asdf/libexec/asdf.fish
    if test -f $asdf_plugin
        source $asdf_plugin
    end
else
    set ANDROID_HOME $HOME/Android/Sdk

    if test -d $ANDROID_HOME
        set -gx ANDROID_HOME $ANDROID_HOME
        fish_add_path $ANDROID_HOME/platform-tools $ANDROID_HOME/tools/bin
    end

    set asdf_plugin /opt/asdf-vm/asdf.fish
    if test -f $asdf_plugin
        source $asdf_plugin
    end
end

if type -q thefuck
    thefuck --alias | source
end

if type -q direnv
    direnv hook fish | source
end

if type -q starship
    starship init fish | source
end

if type -q aws
    complete --command aws --no-files --arguments '(begin; set --local --export COMP_SHELL fish; set --local --export COMP_LINE (commandline); aws_completer | sed \'s/ $//\'; end)'
end

if type -q asdf
    set asdf_java_home_plugin $HOME/.asdf/plugins/java/set-java-home.fish
    if test -f $asdf_java_home_plugin
        source $asdf_java_home_plugin
    end
end

if type -q direnv
    direnv hook fish | source
end
#}}}
#{{{ Aliases
# Default Arguments
alias su='su --shell=/usr/bin/fish'
alias diff='diff --color=auto'
alias grep='grep --color=auto'
alias ip='ip --color=auto'
alias df='df -h'
alias free='free -m'
alias mkdir='mkdir -pv'
alias tty-clock='tty-clock -s -c -D -C 6'
alias pygmentize='pygmentize -O style=forest'
alias paru='paru --skipreview --cleanafter --bottomup'
alias hblock='hblock -H none'

# Replacements
alias more='less'
alias vim='nvim'
alias ls='exa --group --header --git'
alias bat='bat --color=always --theme="Forest Night (Italic)" --italic-text=always'
alias python='python3'
alias baidupcs='baidupcs-go'
#}}}
#{{{ Abbreviations
if status --is-interactive
    # Coreutils
    abbr -ag la		'ls -a'
    abbr -ag ld	    	'ls -aD'
    abbr -ag lt	    	'ls -aT'
    abbr -ag l	    	'ls -l'
    abbr -ag lg	    	'ls -la --git'
    abbr -ag lla	'ls -la'
    abbr -ag lld	'ls -laD'
    abbr -ag llt	'ls -laT'

    abbr -ag dud	'du -d 1 -h'
    abbr -ag duf	'du -sh *'
    abbr -ag fdd	'fd -t d'
    abbr -ag fdf	'fd -t f'
    abbr -ag map	'xargs -n1'

    # Systemd
    abbr -ag sc		'sudo systemctl'
    abbr -ag scu	'systemctl --user'
    abbr -ag jor	'journalctl'
    abbr -ag jour	'journalctl --user'

    # Yadm
    abbr -ag y          'yadm'
    abbr -ag ya         'yadm add'
    abbr -ag yaa        'yadm add -u'
    abbr -ag yc         'yadm commit'
    abbr -ag yd         'yadm diff'
    abbr -ag ydc        'yadm decrypt'
    abbr -ag yec        'yadm encrypt'
    abbr -ag yp         'yadm push'
    abbr -ag yf         'yadm fetch'
    abbr -ag yl         'yadm pull'
    abbr -ag yrmc       'yadm rm --cached'
    abbr -ag yu         'yadm add -u; and yadm commit; and yadm push'
    abbr -ag uy         'yadm pull'

    # Arch
    abbr -ag p          'paru'
    abbr -ag pain       'paru -S'
    abbr -ag parin      'paru --redownload --rebuild -S'
    abbr -ag paupg      'paru -Syu'
    abbr -ag parem      'paru -Rns'
    abbr -ag parec      'paru -Sc'
    abbr -ag pareo      'paru --clean'

    # Package Manager
    if test (uname -s) = "Darwin"
        abbr -ag gimme      'brew install'
        abbr -ag yeet       'brew uninstall'
        abbr -ag relax      'brew upgrade; brew list --cask | xargs brew upgrade && brew cleanup'
    else
        abbr -ag gimme      'paru -S'
        abbr -ag yeet       'paru -Rns'
        abbr -ag relax      'paru -Syu'
    end

    # ADB
    abbr -ag asm        'adb-sync ~/Music/ /sdcard/Music/'
    abbr -ag asm2       'adb-sync -2 ~/Music/ /sdcard/Music/'
    abbr -ag asmd       'adb-sync -d ~/Music/ /sdcard/Music/'
    abbr -ag asmr       'adb-sync -R /sdcard/Music/ ~/Music/'
    abbr -ag asmrd      'adb-sync -R -d /sdcard/Music/ ~/Music/'
    abbr -ag ash        'adb root && adb remount && adb push /etc/hosts /system/etc/hosts && adb reboot'

    # Misc
    abbr -ag q          'exit'
    abbr -ag e          'vifm'
    abbr -ag v          'nvim'
    abbr -ag uv         "nvim '+PlugUpdate' '+PlugClean!' '+PlugUpdate' '+qall'"
    abbr -ag x          'extract'
    abbr -ag aw         'awman'
    abbr -ag k3         'kid3-qt'
    abbr -ag gmpv       'mpv --player-operation-mode=pseudo-gui'
    abbr -ag ping       'prettyping'
    abbr -ag p8         'prettyping 8.8.8.8'
    abbr -ag abcdef     'abcde -o flac:"--best"'
    abbr -ag abcdem     'abcde -o m4a:"-b 320"'
    abbr -ag ea         'for a in (abbr -l); abbr -e $a; end'
    abbr -ag ef         'exec fish'
    abbr -ag ur         'sudo reflector -p https -l 30 -n 20 --sort rate --save /etc/pacman.d/mirrorlist --verbose'
    abbr -ag bye        'poweroff'
    abbr -ag battery    'upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -E "state|to\ full|percentage"'
    abbr -ag fdir       'cd ~/.config/fish/'
    abbr -ag fconf      'vim ~/.config/fish/config.fish'
    abbr -ag sconf      'vim ~/.config/spectrwm/spectrwm.conf'
    abbr -ag wakeoffice 'ssh office_router ether-wake -i br0 04:D4:C4:8F:76:20'
end
#}}}
#{{{ Functions
function cd --wraps cd
    if count $argv > /dev/null
        builtin cd "$argv"; and ls
    else
        builtin cd ~; and ls
    end
end

function man --wraps man -d "Run man with added colors"
    set -l bold_ansi_code "\u001b[1m"
    set -l underline_ansi_code "\u001b[4m"
    set -l reversed_ansi_code "\u001b[7m"
    set -l reset_ansi_code "\u001b[0m"
    set -l teal_ansi_code "\u001b[38;5;109m"
    set -l green_ansi_code "\u001b[38;5;144m"
    set -l cyan_ansi_code "\u001b[38;5;180m"

    set -x LESS_TERMCAP_md (printf $bold_ansi_code$teal_ansi_code) # start bold
    set -x LESS_TERMCAP_me (printf $reset_ansi_code) # end bold
    set -x LESS_TERMCAP_us (printf $underline_ansi_code$green_ansi_code) # start underline
    set -x LESS_TERMCAP_ue (printf $reset_ansi_code) # end underline
    set -x LESS_TERMCAP_so (printf $reversed_ansi_code$cyan_ansi_code) # start standout
    set -x LESS_TERMCAP_se (printf $reset_ansi_code) # end standout
    command man $argv
end

function rgf --wraps rg
    rg $argv | cut  -d : -f 1 | sort | uniq
end

function mkc --wraps mkdir -d "Create a directory and set CWD"
    command mkdir $argv
    if test $status = 0
        switch $argv[(count $argv)]
            case '-*'

            case '*'
                cd $argv[(count $argv)]
                return
        end
    end
end

function extract -d 'Expand or extract bundled & compressed files'
    if test -f $argv
        switch $argv
            case \*.rar
                unrar x $argv
            case \*.zip
                unzip $argv
            case \*.tar.bz2
                tar xvjf $argv
            case \*.tar.gz
                tar xvzf $argv
            case \*.bz2
                bunzip2 $argv
            case \*.gz
                gunzip $argv
            case \*.tar
                tar xvf $argv
            case \*.tbz2
                tar xvjf $argv
            case \*.tgz
                tar xvzf $argv
            case \*.Z
                uncompress $argv
            case \*.7z
                7z x $argv
            case \*.xz
                unxz $argv
            case '*'
                echo "unknown extension"
        end
    else
        echo "Could not extract $argv"
    end
end

function up --description 'go up $argv directories (default 1)'
    set -l up_to ".." 
    if test (count $argv) -ne 1; or test $argv[1] -eq 1
        cd $up_to 
    else if echo $argv[1] | not grep -q '^-\?[0-9]\+$' 
        printf "Error: up should be called with the number of directories to go up. The default is 1." 
    else if test $argv[1] -eq 1 
        cd $up_to 
    else 
        for x in (seq $argv[1]) 
            set up_to "$up_to/.." 
        end 
        cd $up_to 
    end
end

function posix_source
    for line in (cat $argv) 
        # Skip comment lines 
        if test (string sub --length 1 $line) = "#"
            continue
        end

        # Skip empty lines
        if test (string length $line) -lt 2 
            continue 
        end

        set arr (echo $line |tr = \n)
        set -gx $arr[1] $arr[2] 
  end
end

function fish_greeting
    if type -q fish_logo
        fish_logo $red $orange $yellow
    end
end
#}}}
#{{{ Start Actions
# Start X at Login
if status is-login; and test -z "$DISPLAY" -a "$XDG_VTNR" = 1
    exec startx -- -keeptty &> /dev/null
end
#}}}
#{{{ Conda
#
if test (uname -s) = "Darwin"
    set conda $HOMEBREW_PREFIX/Caskroom/miniconda/base/bin/conda
else
    set conda /opt/miniconda3/bin/conda
end
if type -q $conda
    eval $conda "shell.fish" "hook" $argv | source
end
#}}}
