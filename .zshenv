typeset -U path
path=(~/.local/bin ~/.nix-profile/bin /root/.local/bin $path[@])

# conda
if [ -f "/opt/miniconda3/etc/profile.d/conda.sh" ]; then
    . "/opt/miniconda3/etc/profile.d/conda.sh"
else
    export PATH="/opt/miniconda3/bin:$PATH"
fi
