# syntax=docker/dockerfile:1
FROM docker.io/bitnami/symfony:5.3

# Install Python, youtube-dl dependencies, and wget
RUN install_packages python3 ffmpeg cron wget

RUN ln /usr/bin/python3 /usr/bin/python
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl &&
    chmod a+rx /usr/local/bin/youtube-dl
# Copy the entrypoint script
ADD ./docker_files/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Run composer install
WORKDIR /app
COPY composer.* ./
RUN composer install --no-scripts --no-autoloader

# Copy the rest of the application code
COPY . .

# Generate the autoloader
RUN composer dump-autoload --optimize

# Run database migrations
RUN php bin/console doctrine:migrations:migrate --no-interaction

# Set the entrypoint
ENTRYPOINT [ "bash", "/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/symfony/run.sh" ]
