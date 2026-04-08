#!/bin/sh
envsubst '${API_URL}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js
exec nginx -g 'daemon off;'
