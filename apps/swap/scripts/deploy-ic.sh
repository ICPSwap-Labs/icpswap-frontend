
identity=$1

./scripts/pre-deploy.sh

dfx identity use $identity
dfx deploy --network=ic --wallet=$(dfx identity --network=ic get-wallet)
