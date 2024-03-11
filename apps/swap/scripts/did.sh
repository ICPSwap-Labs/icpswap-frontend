#!/bin/bash
update_service=$1

rm ./.env

./scripts/env.sh local

cat "./.env" | while read line
do
  if [[ $line =~ "REACT_APP_SERVICES" ]]
  then
    string=${line//REACT_APP_SERVICES=/}
    string1=${string//\"/ }
    services=(${string1//,/ })

    for(( i=0;i<${#services[@]};i++)) 
    do
      service=${services[$i]}

      if [ "$update_service" = "all" ] || [ "$update_service" = "$service" ]
      then

        path="src/declaration/${service}/"

        rm -rf $path

        mkdir -p $path

        cp ../${service}/.dfx/local/canisters/**/*.did.js $path
        cp ../${service}/.dfx/local/canisters/**/*.ts $path

      fi
    done;
  fi

done
