docker build -t eda-webportal-fe .
docker tag eda-webportal-fe:latest 891377012613.dkr.ecr.ap-southeast-1.amazonaws.com/eda-webportal:fe-20240926
docker push 891377012613.dkr.ecr.ap-southeast-1.amazonaws.com/eda-webportal:fe-20240926
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
