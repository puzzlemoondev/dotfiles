import subprocess

from pathlib import Path
from itertools import chain
from functools import partial

from libqtile.config import EzKey as Key, EzDrag as Drag, EzClick as Click, Screen, Group, ScratchPad, DropDown
from libqtile.lazy import lazy
from libqtile import layout, hook

# USER VARIABLES
home = Path.home().as_posix()

group_names = "1234567890"
shell = "fish -c"
term = "kitty -1"
term_new = "kitty"
term_open = f"{term} {shell}"

border_config = dict(
    border_focus="#D8CAAC",
    border_normal="#323D43",
    border_width=2
)

monad_config = dict(
    new_at_current=True,
    change_size=100,
    **border_config
)

n_mon = int(subprocess.check_output("xrandr -q | grep ' connected' | wc -l", shell=True))

_layouts = ['monadtall', 'monadwide']

layout_states = {g: _layouts[0] for g in group_names}

# USER FUNCTIONS
def toggle_layout(name):
    return lambda qtile: qtile.current_group.cmd_setlayout(name if qtile.current_layout.name != name else layout_states[qtile.current_group.name])

def monad_flip(qtile):
    target_layout = (set(_layouts).difference({qtile.current_layout.name, layout_states[qtile.current_group.name]}) or {_layouts[0]}).pop()
    qtile.current_group.cmd_setlayout(target_layout)
    layout_states[qtile.current_group.name] = target_layout

def go_to_group(group):
    def f(qtile):
        if n_mon == 2:
            qtile.cmd_to_screen(0 if group in group_names[::2] else 1)
        elif n_mon == 3:
            qtile.cmd_to_screen(0 if group in group_names[:3] else 1 if group in group_names[3:7] else 2)
        qtile.groups_map[group].cmd_toscreen(toggle=False)
    return f

def float_to_front(qtile):
    for window in qtile.windows_map.values():
        if window.floating:
            window.cmd_togroup(qtile.current_group.name)
            window.cmd_bring_to_front()
            window.cmd_focus()

def window_to_next_group(qtile, switch_group=False):
    target_index = group_names.index(qtile.current_group.name) + 1
    qtile.current_window.cmd_togroup(group_names[target_index if target_index < len(group_names) else 0], switch_group=switch_group)

def window_to_prev_group(qtile, switch_group=False):
    target_index = group_names.index(qtile.current_group.name) - 1
    qtile.current_window.cmd_togroup(group_names[target_index], switch_group=switch_group)

# KEYS
keys = [
    # SUPER + KEYS
    Key("M-<Return>", lazy.spawn(term)),
    Key("M-<Escape>", lazy.spawn('xkill')),
    Key("M-<backslash>", lazy.spawn('dqtile-cmd')),

    Key("M-a", lazy.spawn('code')),
    Key("M-d", lazy.spawn('rofi -combi-modi window,drun -modi combi -show combi')),
    Key("M-e", lazy.spawn(f'{term_open} vifm')),
    Key("M-g", lazy.spawn(f'{term_open} ytop')),
    Key("M-i", lazy.spawn('idea')),
    Key("M-m", lazy.spawn('tutanota-desktop')),
    Key("M-n", lazy.spawn('networkmanager_dmenu')),
    Key("M-o", lazy.spawn(f'{term_open} tty-clock')),
    Key("M-p", lazy.spawn(f'{term_open} ncmpcpp')),
    Key("M-q", lazy.spawn(f'deluge-gtk')),
    Key("M-s", lazy.spawn('steam')),
    Key("M-u", lazy.spawn(f'{term_open} htop')),
    Key("M-v", lazy.spawn(f'{term_open} nvim')),
    Key("M-w", lazy.spawn('qutebrowser')),
    Key("M-y", lazy.spawn(f'{term_open} "yay -Syu && pacwall"')),
    Key("M-<comma>", lazy.spawn(f'{term_open} cava')),
    Key("M-<period>", lazy.spawn('cantata')),
    Key("M-<slash>", lazy.spawn(f'{term_open} pulsemixer')),
    Key("M-<equal>", lazy.spawn("rofi -modi calc -show calc -no-show-match -no-sort -calc-command \"echo -n '{{result}}' | xsel --input --primary && echo -n '{{result}}' | xsel --clipboard --input\"")),

    # LAYOUT KEYS
    Key("M-b", lazy.function(float_to_front)),
    Key("M-f", lazy.layout.maximize()),
    Key("M-r", lazy.layout.normalize()),
    Key("M-t", lazy.window.toggle_floating()),
    Key("M-x", lazy.function(monad_flip)),
    Key("M-z", lazy.layout.flip()),
    Key("M-<space>", lazy.function(toggle_layout('max'))),

    # GROUP KEYS
    Key("M-<bracketleft>", lazy.screen.prev_group()),
    Key("M-<bracketright>", lazy.screen.next_group()),
    Key("M-C-<bracketleft>", lazy.function(window_to_prev_group)),
    Key("M-C-<bracketright>", lazy.function(window_to_next_group)),
    Key("M-S-<bracketleft>", lazy.function(partial(window_to_prev_group, switch_group=True))),
    Key("M-S-<bracketright>", lazy.function(partial(window_to_next_group, switch_group=True))),
    Key("M-<grave>", lazy.screen.togglegroup()),

    # SUPER + SHIFT KEYS
    Key("M-S-q", lazy.window.kill()),
    Key("M-S-r", lazy.restart()),

    # SYSTEM KEYS
    Key("M-A-q", lazy.shutdown()),
    Key("M-A-p", lazy.spawn("systemctl poweroff")),
    Key("M-A-r", lazy.spawn("systemctl reboot")),
    Key("M-A-l", lazy.spawn("betterlockscreen -l dimblur")),

    # CHANGE FOCUS
    Key("M-k", lazy.layout.up()),
    Key("M-j", lazy.layout.down()),
    Key("M-h", lazy.layout.left()),
    Key("M-l", lazy.layout.right()),

    Key("M-<Up>", lazy.layout.up()),
    Key("M-<Down>", lazy.layout.down()),
    Key("M-<Left>", lazy.layout.left()),
    Key("M-<Right>", lazy.layout.right()),

    # RESIZE WINDOWS
    Key("M-C-k", lazy.layout.grow()),
    Key("M-C-j", lazy.layout.shrink()),
    Key("M-C-h", lazy.layout.shrink()),
    Key("M-C-l", lazy.layout.grow()),

    Key("M-C-<Up>", lazy.layout.grow()),
    Key("M-C-<Down>", lazy.layout.shrink()),
    Key("M-C-<Left>", lazy.layout.shrink()),
    Key("M-C-<Right>", lazy.layout.grow()),

    # MOVE WINDOWS
    Key("M-S-k", lazy.layout.shuffle_up()),
    Key("M-S-j", lazy.layout.shuffle_down()),
    Key("M-S-h", lazy.layout.swap_left()),
    Key("M-S-l", lazy.layout.swap_right()),

    Key("M-S-<Up>", lazy.layout.shuffle_up()),
    Key("M-S-<Down>", lazy.layout.shuffle_down()),
    Key("M-S-<Left>", lazy.layout.swap_left()),
    Key("M-S-<Right>", lazy.layout.swap_right()),

    # PRINT KEY
    Key("<Print>", lazy.spawn(f"scrot '%Y-%m-%d-%H%M%S_$wx$h_screenshot.png' -e 'mv $f {home}/Pictures/' -q 90")),
    Key("S-<Print>", lazy.spawn(f"scrot '%Y-%m-%d-%H%M%S_$wx$h_screenshot.png' -e 'mv $f {home}/Pictures/' -q 90 -d 3")),

    # MULTIMEDIA KEYS
    Key("<XF86MonBrightnessUp>", lazy.spawn("xbacklight -inc 5")),
    Key("<XF86MonBrightnessDown>", lazy.spawn("xbacklight -dec 5")),

    Key("<XF86AudioMute>", lazy.spawn("pactl set-sink-mute @DEFAULT_SINK@ toggle")),
    Key("<XF86AudioLowerVolume>", lazy.spawn("pactl set-sink-volume @DEFAULT_SINK@ -5000")),
    Key("<XF86AudioRaiseVolume>", lazy.spawn("pactl set-sink-volume @DEFAULT_SINK@ +5000")),

    Key("<XF86AudioPrev>", lazy.spawn("playerctl previous")),
    Key("<XF86AudioPlay>", lazy.spawn("playerctl play-pause")),
    Key("<XF86AudioNext>", lazy.spawn("playerctl next")),
    Key("<XF86AudioStop>", lazy.spawn("playerctl stop")),

    Key("M-<F9>", lazy.spawn("mpc prev")),
    Key("M-<F10>", lazy.spawn("mpc toggle")),
    Key("M-<F11>", lazy.spawn("mpc next")),
    Key("M-<F12>", lazy.spawn("mpc stop")),
]

# GROUPS
groups = [Group(i) for i in group_names]

keys.extend(chain.from_iterable((
    Key(f"M-{i.name}", lazy.function(go_to_group(i.name))),
    Key(f"M-C-{i.name}", lazy.window.togroup(i.name)),
    Key(f"M-S-{i.name}", lazy.window.togroup(i.name, switch_group=True))
) for i in groups))

# DROPDOWN
groups.append(ScratchPad("dropdown", [DropDown("term", term_new)]))

keys.append(Key("<F12>", lazy.group["dropdown"].dropdown_toggle("term")))

# LAYOUTS
layouts = [layout.MonadTall(**monad_config), layout.MonadWide(**monad_config), layout.Max()]

floating_layout = layout.Floating(float_rules=[
    {'wmclass': 'confirm'},
    {'wmclass': 'dialog'},
    {'wmclass': 'download'},
    {'wmclass': 'error'},
    {'wmclass': 'utility'},
    {'wmclass': 'file_progress'},
    {'wmclass': 'notification'},
    {'wmclass': 'splash'},
    {'wmclass': 'toolbar'},
    {'wmclass': 'confirmreset'},
    {'wmclass': 'makebranch'},
    {'wmclass': 'maketag'},
    {'wmclass': 'Arandr'},
    {'wmclass': 'Nitrogen'},
    {'wmclass': 'Galculator'},
    {'wmclass': 'Oblogout'},
    {'wmclass': 'Lxappearance'},
    {'wmclass': 'ssh-askpass'},
    {'wmclass': 'sun-awt-X11-XWindowPeer'},
    {'wmclass': 'gcr-prompt'},
    {'wname': 'branchdialog'},
    {'wname': 'Open File'},
    {'wname': 'pinentry'},
    ],
    fullscreen_border_width=0,
    **border_config
)

# SCREENS
screens = [Screen() for _ in range(n_mon)]

# MOUSE
mouse = [
    Drag("M-1", lazy.window.set_position_floating(), start=lazy.window.get_position()),
    Drag("M-3", lazy.window.set_size_floating(), start=lazy.window.get_size()),
    Click("M-4", lazy.screen.prev_group(), focus=None),
    Click("M-5", lazy.screen.next_group(), focus=None)
]

# HOOKS
@hook.subscribe.startup_once
def start_once():
    subprocess.call([f'{home}/.config/qtile/autostart.sh'])

@hook.subscribe.startup
def start_always():
    subprocess.Popen(['xsetroot', '-cursor_name', 'left_ptr'])

@hook.subscribe.client_new
def set_floating(window):
    if (window.window.get_wm_transient_for() or window.window.get_wm_type() in floating_layout.auto_float_types):
        window.floating = True

# SETTINGS
main = None

dgroups_key_binder = None
dgroups_app_rules = []
follow_mouse_focus = True
bring_front_click = False
cursor_warp = False
auto_fullscreen = True
focus_on_window_activation = "smart"

wmname = "LG3D"
