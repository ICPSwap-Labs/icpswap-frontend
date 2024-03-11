#!/bin/bash

update_service=$1
update_network=$2

copy_canister_ids() {
  path="./src/canister-ids/$1"

  mkdir -p $path

  if [ -f "../$1/canister_ids.json" ]; then
    if [ "$update_network" = "ic" ] || [ "$update_network" = "all"  ]; then
      cp -R ../$1/canister_ids.json $path
    fi
  fi

  if [ -f "../$1/.dfx/local/canister_ids.json" ]; then
    if [ "$update_network" = "local" ] || [ "$update_network" = "all" ]; then
      cp ../$1/.dfx/local/canister_ids.json $path/canister_ids_local.json
    fi
  fi

  if [ -f "../$1/.dfx/test/canister_ids.json" ]; then
    if [ "$update_network" = "test" ] || [ "$update_network" = "all" ]; then
      cp ../$1/.dfx/test/canister_ids.json $path/canister_ids_test.json
    fi
  fi
}

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

        copy_canister_ids $service

      fi
    done;
  fi

done
