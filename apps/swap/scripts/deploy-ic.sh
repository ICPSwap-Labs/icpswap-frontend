
identity=$1

function deploy() {
  ./scripts/pre-deploy.sh

  dfx identity use $identity
  result=`dfx deploy --network=ic --wallet=$(dfx identity --network=ic get-wallet)`

  echo $result

  err="failed"

  if [[ $result =~ $err ]]
  then
    deploy
  else
    echo "DEPLOY SUCEESS"
  fi
}

if [ ! "$identity" ]; then
  echo "NO IDENTITY"
else
  deploy
fi
