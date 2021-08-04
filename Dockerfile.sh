#!/bin/bash
echo "开始构建Docker镜像"
docker login --username=${DOCKER_USER_NAME} -p ${DOCKER_PASSWORD} ${DOCKER_ADDR}
dockerName=${DOCKER_REPOSITORY_NAME}:${DOCKER_TAG_NAME}
echo "dockerTagRule：$DOCKER_TAG_RULE"
if [ ${DOCKER_TAG_RULE} == 'date' ]; then
    dockerName="${dockerName}"."$(date +%Y%m%d)"
fi
echo "dockerName：$dockerName"
docker build -t $dockerName -f Dockerfile .
docker push $dockerName
docker rmi -f $dockerName
docker logout ${DOCKER_ADDR}
