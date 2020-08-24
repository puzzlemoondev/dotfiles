set -U fish_key_bindings fish_vi_key_bindings

set -g pure_symbol_prompt "λ"
set -g pure_symbol_reverse_prompt "ƛ"

set -g async_prompt_functions 'fish_right_prompt'

eval (direnv hook fish)
