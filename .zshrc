# config
HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=500
setopt appendhistory autocd extendedglob histignorealldups nobeep nocaseglob nocheckjobs nomatch notify numericglobsort rcexpandparam COMPLETE_ALIASES

export LC_ALL=en_US.UTF-8
export VISUAL=nvim
export EDITOR="$VISUAL"
export SYSTEMD_EDITOR="$VISUAL"

# directory operation
zmodload zsh/files

# completion
autoload -Uz compinit
for dump in ~/.zcompdump(N.mh+24); do
    compinit
done
compinit -C

zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' menu select
zstyle ':completion::complete:*' gain-privileges 1
zstyle ':completion:*' rehash true
zstyle ':completion:*' completer _complete _match
zstyle ':completion:*:match:*' original only

# kitty completion
kitty + complete setup zsh | source /dev/stdin

# key bindings
bindkey -v

typeset -g -A key

key[Home]="${terminfo[khome]}"
key[End]="${terminfo[kend]}"
key[Insert]="${terminfo[kich1]}"
key[Backspace]="${terminfo[kbs]}"
key[Delete]="${terminfo[kdch1]}"
key[Up]="${terminfo[kcuu1]}"
key[Down]="${terminfo[kcud1]}"
key[Left]="${terminfo[kcub1]}"
key[Right]="${terminfo[kcuf1]}"
key[PageUp]="${terminfo[kpp]}"
key[PageDown]="${terminfo[knp]}"
key[ShiftTab]="${terminfo[kcbt]}"

[[ -n "${key[Home]}"      ]] && bindkey -- "${key[Home]}"      beginning-of-line
[[ -n "${key[End]}"       ]] && bindkey -- "${key[End]}"       end-of-line
[[ -n "${key[Insert]}"    ]] && bindkey -- "${key[Insert]}"    overwrite-mode
[[ -n "${key[Backspace]}" ]] && bindkey -- "${key[Backspace]}" backward-delete-char
[[ -n "${key[Delete]}"    ]] && bindkey -- "${key[Delete]}"    delete-char
[[ -n "${key[Left]}"      ]] && bindkey -- "${key[Left]}"      backward-char
[[ -n "${key[Right]}"     ]] && bindkey -- "${key[Right]}"     forward-char
[[ -n "${key[PageUp]}"    ]] && bindkey -- "${key[PageUp]}"    beginning-of-buffer-or-history
[[ -n "${key[PageDown]}"  ]] && bindkey -- "${key[PageDown]}"  end-of-buffer-or-history
[[ -n "${key[ShiftTab]}"  ]] && bindkey -- "${key[ShiftTab]}"  reverse-menu-complete

if (( ${+terminfo[smkx]} && ${+terminfo[rmkx]} )); then
    autoload -Uz add-zle-hook-widget
    function zle_application_mode_start {
	echoti smkx
    }
    function zle_application_mode_stop {
	echoti rmkx
    }
    add-zle-hook-widget -Uz zle-line-init zle_application_mode_start
    add-zle-hook-widget -Uz zle-line-finish zle_application_mode_stop
fi

# helper funcs
silent_background() {
    setopt local_options no_notify no_monitor
    "$@" &
}

# plugins
source ~/.zsh_plugins.sh

# aliases
if [ -f ~/.aliases ]; then
    . ~/.aliases
fi

# bind up and down arrow keys to history substring search
[[ -n "${key[Up]}"   ]] && bindkey -- "${key[Up]}"   history-substring-search-up
[[ -n "${key[Down]}" ]] && bindkey -- "${key[Down]}" history-substring-search-down

# easymotion
bindkey "^Xz" zce

# syntax highlight
ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern cursor root line)

# pure
export PURE_PROMPT_SYMBOL=λ
export PURE_PROMPT_VICMD_SYMBOL=ƛ

# enhancd
export ENHANCD_FILTER=fzf:fzy:peco
export ENHANCD_DISABLE_HOME=1
export ENHANCD_DOT_ARG='...'
export ENHANCD_HOOK_AFTER_CD='la'

# less
export LESS="-i -J -M -R -W -x4 -z-4"
export LESSOPEN="| /usr/bin/source-highlight-esc.sh %s"

man() {
    LESS_TERMCAP_md=$'\e'"[1;36m" \
    LESS_TERMCAP_me=$'\e'"[0m" \
    LESS_TERMCAP_se=$'\e'"[0m" \
    LESS_TERMCAP_so=$'\e'"[1;40;92m" \
    LESS_TERMCAP_ue=$'\e'"[0m" \
    LESS_TERMCAP_us=$'\e'"[1;32m" \
    command man "$@"
}

# correction
eval $(thefuck --alias)

# pacman
source /usr/share/doc/find-the-command/ftc.zsh quiet info

# lazygit
lg()
{
    export LAZYGIT_NEW_DIR_FILE=~/.lazygit/newdir

    lazygit "$@"

    if [ -f $LAZYGIT_NEW_DIR_FILE ]; then
	cd "$(cat $LAZYGIT_NEW_DIR_FILE)"
	rm -f $LAZYGIT_NEW_DIR_FILE > /dev/null
    fi
}

# java
export _JAVA_AWT_WM_NONREPARENTING=1

# virtualenv
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/workspace
source /usr/bin/virtualenvwrapper.sh

# conda
if [ -f "/opt/miniconda3/etc/profile.d/conda.sh" ]; then
    . "/opt/miniconda3/etc/profile.d/conda.sh"
else
    export PATH="/opt/miniconda3/bin:$PATH"
fi

# barva
if [ -f "/usr/bin/barva" ] && [[ -n "$DISPLAY" ]]; then
    export BARVA_SOURCE=$(/usr/share/barva/pa-get-default-monitor.sh)
    export BARVA_BG=#323D43
    export BARVA_TARGET=#1E292F
    silent_background barva
    trap "kill -9 $!" EXIT
fi
