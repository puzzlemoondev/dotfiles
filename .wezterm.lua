-- Pull in the wezterm API
local wezterm = require 'wezterm'

-- This table will hold the configuration.
local config = {}

-- In newer versions of wezterm, use the config_builder which will
-- help provide clearer error messages
if wezterm.config_builder then
  config = wezterm.config_builder()
end

-- This is where you actually apply your config choices

config.color_scheme = 'Everforest Dark (Gogh)'

config.font = wezterm.font 'Victor Mono'
config.font_size = 16.0

config.window_padding = {
  left = '2cell',
  right = '2cell',
  top = '0.5cell',
  bottom = '0.5cell',
}

config.window_background_opacity = 0.95

config.hide_tab_bar_if_only_one_tab = true

config.window_frame = {
  active_titlebar_bg = '#232A2E',
  inactive_titlebar_bg = '#232A2E'
}

config.colors = {
  tab_bar = {
    active_tab = {
      bg_color = '#2F383E',
      fg_color = '#D3C6AA'
    },
    inactive_tab_edge = '#232A2E'
  }
}

-- and finally, return the configuration to wezterm
return config
