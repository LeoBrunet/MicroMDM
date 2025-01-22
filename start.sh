#!/bin/sh
./micromdm serve \
  -server-url=https://intense-refuge-74060-8ff5aebfbe46.herokuapp.com/ \
  -api-key MySecureAPIKey12345 \
  -filerepo . \
  -tls=false \
  -command-webhook-url=https://mdm-pradeo.onrender.com/webhook
