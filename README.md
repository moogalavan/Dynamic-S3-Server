# S3 PreSigned URL generator

## Why is this needed?
This service contacts the S3 bucket informing it that we want to upload a media file and when we do upload it, we want that file to be named as per the naming convention we send to this server. Once AWS S3 understands the instruction, it returns a URL for uploading that file and will have the signature of the AWS S3 bucket, after which you can upload that resource using that upload URL and access the file via the download URL after uploading said resource.

## On Local system with changes to this code
Once you have made the edit to the config file, we need to build the image. Recommended tag name would be {<project_name>+"v"+<version_number>}

```sudo docker build -t vassarlabs/s3-media-sync:{{tag-name}} .```

Once the build is successful, we need to push the build to dockerhub just like how we push our code to git.

```sudo docker push vassarlabs/s3-media-sync:{{tag-name}}```

## On Server

After Succesfully pushing the image on to dockerhub, you need to pull the image to the server. 

```sudo docker pull vassarlabs/s3-media-sync:{{tag-name}}```

After pulling the image from dockerhub, we need to run the container for the server to be functional. In the following command, Host_port refers to the port you want to open up on the server and Container_port refers to the port opened in the docker container as per the Dockerfile(in this case, it's 5000).

```sudo docker run --rm -it -d --name s3-media-sync -p {Host_Port}:{Container_port}/tcp vassarlabs/s3-media-sync:{{tag-name}}```
