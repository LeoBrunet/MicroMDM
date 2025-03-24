#!/bin/bash
set -e

echo "🚀 Starting MicroMDM setup..."

# Create necessary directories
mkdir -p ./mdm-certificates
mkdir -p ./mdm-files

echo "🔐 Config var"
echo "MDM_API_TOKEN: ${MDM_API_TOKEN}"
echo "MDM_SERVER_URL: ${MDM_SERVER_URL}"
echo "MDM_WEBHOOK_URL: ${MDM_WEBHOOK_URL}"
echo "MDM_CERT_PASSWORD: ${MDM_CERT_PASSWORD}"
echo "MDM_CERT_COUNTRY: ${MDM_CERT_COUNTRY}"
echo "MDM_CERT_EMAIL: ${MDM_CERT_EMAIL}"

# Configure MDM client
echo "🔐 Configuring MicroMDM client..."
./mdmctl config set -name production -api-token="${MDM_API_TOKEN}" -server-url="${MDM_SERVER_URL}" -skip-verify true
./mdmctl config switch -name production
./mdmctl config print

./micromdm serve \
  -server-url="${MDM_SERVER_URL}" \
  -api-key="${MDM_API_TOKEN}" \
  -filerepo ./mdm-files \
  -tls=false \
  -command-webhook-url="${MDM_WEBHOOK_URL}" &

echo "Waiting for MicroMDM server to be ready to receive certificates..."
sleep 5
until curl -s "${MDM_SERVER_URL}" > /dev/null 2>&1; do
  echo "Still waiting for MicroMDM server..."
  sleep 2
done

# Handle certificates
echo "📜 Checking certificates..."
ls -la ./mdm-certificates

# Check certificate validity
openssl x509 -in ./mdm-certificates/MDM_Cert.pem -noout -text | grep "Not After"

# Upload certificate to MicroMDM
echo "📥 Uploading certificate to MicroMDM..."
./mdmctl mdmcert upload \
  -cert ./mdm-certificates/MDM_Cert.pem \
  -private-key ./mdm-certificates/PushCertificatePrivateKey.key \
  -password="${MDM_CERT_PASSWORD}"

sleep 5

# Start MicroMDM server
echo "🚀 Starting MicroMDM server..."
./micromdm serve \
  -server-url="${MDM_SERVER_URL}" \
  -api-key="${MDM_API_TOKEN}" \
  -filerepo ./mdm-files \
  -tls-cert ./keys/mdm-certificates/tls.crt \
  -tls-key ./keys/mdm-certificates/tls.key \
  -command-webhook-url="${MDM_WEBHOOK_URL}" &

# Wait for MicroMDM to start
echo "Waiting for MicroMDM server to be ready..."
sleep 5
until curl -s "${MDM_SERVER_URL}" > /dev/null 2>&1; do
  echo "Still waiting for MicroMDM server..."
  sleep 2
done

echo "✅ MicroMDM setup complete!"

# Keep container running
tail -f /dev/null

# TODO: CREATE A NEW CERTIF FROM APPLE DEVELOPER PORTAL