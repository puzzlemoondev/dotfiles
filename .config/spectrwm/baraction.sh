#!/bin/sh

tiramisu -j | jq --unbuffered -r '"\(.app_name): \(.summary) - \(.body)"'
