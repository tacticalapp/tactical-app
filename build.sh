set -e

# Build mainnet
TACT_ENV=mainnet VITE_MAINNET=true electron-forge make "$@"

# Build testnet
TACT_ENV=testnet electron-forge make "$@"