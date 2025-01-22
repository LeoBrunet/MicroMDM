#!/bin/sh
./micromdm serve \
  -server-url=https://stunning-space-tribble-7575v4rqq9j2xprj-8080.app.github.dev/ \
  -api-key MySecureAPIKey12345 \
  -filerepo . \
  -tls=false \
  -command-webhook-url=https://mdm-pradeo.onrender.com/webhook
