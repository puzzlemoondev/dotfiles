#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

if [ -f ~/.aliases ]; then                                                                                                                          
    . ~/.aliases                                                                                                                                    
fi

PS1='[\u@\h \W]\$ '
