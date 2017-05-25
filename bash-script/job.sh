#!/bin/bash

# set -eux

mkdir -p media
mkdir -p job

DOCKER_IMAGE=okadahiroshi/bot-playground
JOB_LIVE_FILE=job/run-$$
touch "$JOB_LIVE_FILE"

MAX_FSIZE=$(( 4096 * 1024))
MAX_DSIZE=$(( 2048 * 1024))
MAX_CPU="15"

while [ -e "$JOB_LIVE_FILE" ]
do
  date

  TASK=$(node pop_job.js)

  if [ -n "$TASK" ]; then
    echo -n "-----------------------------------------"
    echo -n "$TASK"

    FILE_NAME=$(echo -E "$TASK" | jq '.file_name' --join-output)
    SRC_CODE=$(echo -E "$TASK" | jq '.src_code' --join-output)
    STATUS_ID=$(echo -E "$TASK" | jq '.status_id' --join-output)
    CONTAINER_NAME=job-"$STATUS_ID"
    export IMAGE_FILE_NAME
    IMAGE_FILE_NAME=./media/out-"$STATUS_ID".png

    echo -E "$SRC_CODE" > "$STATUS_ID"."$FILE_NAME"

    docker run -d -it \
               --ulimit fsize="$MAX_FSIZE" \
               --ulimit data="$MAX_DSIZE" \
               --ulimit cpu="$MAX_CPU" \
               --name "$CONTAINER_NAME" \
               --network=none \
               "$DOCKER_IMAGE" tail -f

    docker cp "$STATUS_ID"."$FILE_NAME" "$CONTAINER_NAME":/home/bot/"$FILE_NAME"

    rm "$STATUS_ID"."$FILE_NAME"

    export OUTPUT
    OUTPUT=$(/usr/bin/timeout 32s docker exec "$CONTAINER_NAME"  timeout "$MAX_CPU"s /usr/local/bin/job.sh "$FILE_NAME" 2>&1 | head -2000)

    docker cp "$CONTAINER_NAME":/home/bot/out.png "$IMAGE_FILE_NAME" || true
    docker kill "$CONTAINER_NAME"
    docker rm "$CONTAINER_NAME"

    if [ -e "$IMAGE_FILE_NAME" ];
    then
      echo -E "$TASK" | jq '.output = env.OUTPUT | .attach = env.IMAGE_FILE_NAME ' | node push_output.js
    else
      echo -E "$TASK" | jq '.output = env.OUTPUT' | node push_output.js
    fi

  fi
done

echo "Bye"

