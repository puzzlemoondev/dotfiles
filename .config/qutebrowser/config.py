import subprocess
from operator import mul
from functools import reduce

_pixels = reduce(mul, map(int, subprocess.check_output("xrandr -q | awk 'match($0, / connected .* ([0-9]+x[0-9]+)/, a) { print a[1] }'", shell=True).split(b'x')))
_is_nvidia = bool(subprocess.check_output("lspci | awk 'BEGIN{IGNORECASE=1} /vga/ && /nvidia/'", shell=True))
_stylesheet = '~/.config/qutebrowser/userscripts/forest-all-sites.css'

# system
if _is_nvidia:
    c.qt.force_software_rendering = 'chromium'

# editor
c.editor.command = ['nvim', '{file}', '-c', 'normal {line}G{column0}l']

# security
c.content.autoplay = False
c.content.canvas_reading = True
c.content.cookies.accept = 'no-unknown-3rdparty'
c.content.dns_prefetch = False
c.content.geolocation = False
c.content.headers.accept_language = 'en-US,en;q=0.5'
c.content.headers.referer = 'same-domain'
c.content.headers.do_not_track = True
c.content.javascript.enabled = True
c.content.webgl = False
c.content.webrtc_ip_handling_policy = 'disable-non-proxied-udp'
c.content.media_capture = False
c.content.mouse_lock = False

# content
c.content.notifications = False
c.content.user_stylesheets = _stylesheet
c.url.default_page = 'about:blank'
c.url.start_pages = 'about:blank'
c.url.searchengines = {'DEFAULT': 'https://duckduckgo.com/?q={}'}

# ui
c.confirm_quit = ['downloads']
c.colors.webpage.prefers_color_scheme_dark = True
c.downloads.position = 'bottom'
c.downloads.remove_finished = 5000
c.fonts.default_family = ['Victor Mono SemiBold', 'Noto Sans']
c.scrolling.bar = 'never'
c.statusbar.show = 'always'
c.tabs.last_close = 'startpage'
c.tabs.position = 'bottom'
c.tabs.show = 'multiple'
c.zoom.default = '125%' if _pixels > 2073600 else '100%'

# aliases
c.aliases['x'] = 'quit --save'
c.aliases['cs'] = 'config-source'
c.aliases['sanitize'] = 'spawn qute-sanitize'

# bindings
config.bind('!', 'set-cmd-text :open !')
config.bind('<Ctrl-1>', 'set-cmd-text :open -t -r !')
config.bind(',m', 'hint links spawn umpv {hint-url}')
config.bind(',M', 'spawn umpv {url}')
config.bind(';m', 'hint --rapid links spawn umpv {hint-url}')
config.bind('<F1>', 'config-cycle content.javascript.enabled')
config.bind('<F2>', f'config-cycle content.user_stylesheets {_stylesheet} ""')

# load theme last
config.source('forest-night-qutebrowser.py')
