set -e
TACT_ENV=mainnet electron-forge make --platform=darwin --arch=universal
TACT_ENV=testnet electron-forge make --platform=darwin --arch=universal