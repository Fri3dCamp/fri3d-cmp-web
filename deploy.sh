#!/usr/bin/env bash

TEST_BUCKET=
PROD_BUCKET=

if git diff-index --quiet HEAD --; then
    echo "Workingcopy is clean"
else
    echo "Please commit your changes first!" && exit 1
fi

STAGE=$1
VERSIONSLUG=$(date +%Y%m%d-%H%M)

if [ "prod" = "$STAGE" ]; then
    BUCKET="$PROD_BUCKET"

    # and upload it to AWS
    export AWS_DEFAULT_PROFILE="fri3d"
else
    BUCKET="$TEST_BUCKET"

    # and upload it to AWS
    export AWS_DEFAULT_PROFILE="fri3d"
fi

echo $VERSIONSLUG > client.version

aws s3 sync . s3://${BUCKET}/

git tag -a "client-${STAGE}-${VERSIONSLUG}" -m "Deployment of client to ${STAGE}"
git push origin "client-${STAGE}-${VERSIONSLUG}"
