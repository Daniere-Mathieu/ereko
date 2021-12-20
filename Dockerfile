# syntax=docker/dockerfile:1
FROM docker.io/bitnami/symfony:5.3
#install python and youtube-dl
RUN apt update &&\
    apt install -y python3 ffmpeg cron &&\
    ln /usr/bin/python3 /usr/bin/python &&\
    # Next line is commented while new youtube-dl version is not published (current 2021.06.06)
    #curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl &&\
    #chmod a+rx /usr/local/bin/youtube-dl &&\
    apt-get clean

# We met downloading bugs due to youtube-dl.
# Bugs have been fixed but are not published for now.
# We have to install from repository.
RUN curl -L https://github.com/dirkf/youtube-dl/archive/refs/heads/df-youtube-unthrottle-patch.zip \
    -o /opt/youtube-dl.zip &&\
    unzip /opt/youtube-dl.zip -d /opt &&\
    rm /opt/youtube-dl.zip &&\
    mv /opt/youtube-dl-df-youtube-unthrottle-patch /opt/youtube-dl

# configure the crontab for music downloader
ADD ./docker_files/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "bash", "/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/symfony/run.sh" ]
