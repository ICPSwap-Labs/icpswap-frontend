
identity=$1

dfx identity use $identity
dfx deploy --network=ic --wallet=$(dfx identity --network=ic get-wallet)
