#!/bin/sh
killall tiramisu && \
tiramisu -j | jq --unbuffered -r '"\(.app_name): \(.summary) - \(.body)"'
