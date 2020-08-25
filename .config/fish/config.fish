# sources
source ~/.config/fish/functions.fish
source ~/.config/fish/abbr_aliases.fish

# keybinds
set -U fish_key_bindings fish_vi_key_bindings

# plugins
set -g pure_symbol_prompt "λ"
set -g pure_symbol_reverse_prompt "ƛ"

set -g async_prompt_functions 'fish_right_prompt'

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
eval /opt/miniconda3/bin/conda "shell.fish" "hook" $argv | source
# <<< conda initialize <<<

