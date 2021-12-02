# syntax=docker/dockerfile:1
FROM docker.io/bitnami/symfony:5.3
#install python and youtube-dl
RUN apt update &&\
    apt install -y python3 &&\
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl &&\
    chmod a+rx /usr/local/bin/youtube-dl &&\
    apt-get clean
