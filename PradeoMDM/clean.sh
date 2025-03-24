docker stop $(docker ps -aq)

docker rm $(docker ps -aq)

docker rmi $(docker images -aq)

docker volume rm $(docker volume ls -q)

docker system prune -a --volumes

docker system df