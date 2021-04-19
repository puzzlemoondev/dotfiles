" Vim configuration
set number
set relativenumber
set wrap
set linebreak
set textwidth=0
set wrapmargin=0
set showbreak=+++
set showmatch
set encoding=utf-8
set visualbell

set smartcase
set ignorecase
set incsearch

set autoindent
set shiftwidth=4
set smartindent
set smarttab
set softtabstop=4

set undofile
set undodir=~/.config/nvim/undodir
set undolevels=1000
set backspace=indent,eol,start
set foldmethod=marker

nnoremap <esc> :noh<return><esc>

" fuzzy finder
function! FzyCommand(choice_command, vim_command)
  try
    let output = system(a:choice_command . " | fzy ")
  catch /Vim:Interrupt/
    " Swallow errors from ^C, allow redraw! below
  endtry
  redraw!
  if v:shell_error == 0 && !empty(output)
    exec a:vim_command . ' ' . output
  endif
endfunction

nnoremap <leader>e :call FzyCommand("find . -type f", ":e")<cr>
nnoremap <leader>v :call FzyCommand("find . -type f", ":vs")<cr>
nnoremap <leader>s :call FzyCommand("find . -type f", ":sp")<cr>

" plug-in manager
" download vim-plug if missing
if empty(glob("~/.config/nvim/autoload/plug.vim"))
  silent! execute '!curl --create-dirs -fsSLo ~/.config/nvim/autoload/plug.vim https://raw.github.com/junegunn/vim-plug/master/plug.vim'
  autocmd VimEnter * silent! PlugInstall
endif

" declare plugins
silent! if plug#begin()
    Plug 'mhinz/vim-startify'
    Plug 'Raimondi/delimitMate'
    Plug 'airblade/vim-gitgutter'
    Plug 'vim-syntastic/syntastic'
    Plug 'tpope/vim-fugitive'
    Plug 'junegunn/goyo.vim'
    Plug 'junegunn/limelight.vim'
    Plug 'vim-airline/vim-airline'
    Plug 'ryanoasis/vim-devicons'
    Plug 'chrisbra/csv.vim'
    Plug 'sheerun/vim-polyglot'
    Plug 'sainnhe/everforest'
    call plug#end()
endif

" color scheme
set termguicolors
set background=dark
let g:everforest_transparent_background = 1
let g:everforest_enable_italic = 1
let g:everforest_better_performance = 1
colorscheme everforest

" plug-in - airline
let g:airline_theme='everforest'
let g:airline_powerline_fonts = 1

" plug-in - syntastic
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 0 
let g:syntastic_check_on_wq = 0
let g:syntastic_mode_map = { 'mode': 'passive', 'active_filetypes':   [],'passive_filetypes': [] }
let g:syntastic_quiet_messages={'level':'warnings'}
noremap <C-w>e :SyntasticCheck<CR>
noremap <C-w>f :SyntasticToggleMode<CR>

" plug-in - goyo x limelight
autocmd! User GoyoEnter Limelight
autocmd! User GoyoLeave Limelight!
