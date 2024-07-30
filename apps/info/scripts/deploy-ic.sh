
identity=$1

echo '{}' > ./src/temp_canister_ids.json

dfx identity use $identity
dfx deploy --network=ic --wallet=$(dfx identity --network=ic get-wallet)
