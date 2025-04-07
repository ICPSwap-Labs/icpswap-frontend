
network=$1

EXTEND_ESLINT="EXTEND_ESLINT=true"
GENERATE_SOURCEMAP="GENERATE_SOURCEMAP=true"
REACT_APP_SENTRY_ENABLED="REACT_APP_SENTRY_ENABLED=true"
REACT_APP_SENTRY_DSN='REACT_APP_SENTRY_DSN="https://dd2a03d2eadf66a1172ec824d3385e9c@o4505703382515712.ingest.sentry.io/4505703420854272"'

REACT_LOCAL_ENV='REACT_ENV="development"'
REACT_LOCAL_APP_ENV='REACT_APP_ENV="development"'
REACT_LOCAL_APP_NETWORK='REACT_APP_IC_NETWORK="local"'

REACT_TEST_ENV='REACT_ENV="development"'
REACT_TEST_APP_ENV='REACT_APP_ENV="development"'
REACT_TEST_APP_NETWORK='REACT_APP_IC_NETWORK="test"'

EXTEND_IC_ESLINT="EXTEND_ESLINT=true"
REACT_IC_ENV='REACT_ENV="production"'
REACT_IC_APP_ENV='REACT_APP_ENV="production"'
REACT_IC_APP_NETWORK='REACT_APP_IC_NETWORK="ic"'

local_env="${GENERATE_SOURCEMAP}\n${EXTEND_ESLINT}\n${REACT_LOCAL_ENV}\n${REACT_LOCAL_APP_ENV}\n${REACT_LOCAL_APP_NETWORK}\n"

test_env="${GENERATE_SOURCEMAP}\n${EXTEND_ESLINT}\n${REACT_TEST_ENV}\n${REACT_TEST_APP_ENV}\n${REACT_TEST_APP_NETWORK}\n"

ic_env="${GENERATE_SOURCEMAP}\n${EXTEND_IC_ESLINT}\n${REACT_IC_ENV}\n${REACT_IC_APP_ENV}\n${REACT_IC_APP_NETWORK}\n${REACT_APP_SENTRY_ENABLED}\n${REACT_APP_SENTRY_DSN}"

if [ $network = "test" ]
then
  printf $test_env > ./.env

elif [ $network = "ic" ]
then
  printf $ic_env > ./.env

else
  printf $local_env > ./.env
fi
