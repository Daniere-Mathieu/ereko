# syntax=docker/dockerfile:1
FROM docker.io/bitnami/symfony:5.3
#install python and youtube-dl
RUN apt update &&\
    apt install -y python3 ffmpeg cron &&\
    ln /usr/bin/python3 /usr/bin/python &&\
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl &&\
    chmod a+rx /usr/local/bin/youtube-dl &&\
    apt-get clean

# configure the crontab for music downloader
ADD ./docker_files/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/symfony/run.sh" ]