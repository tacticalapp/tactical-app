set -e

# Build mainnet
TACT_ENV=mainnet VITE_MAINNET=true electron-forge make --platform=darwin --arch=universal

# Build testnet
TACT_ENV=testnet electron-forge make --platform=darwin --arch=universal