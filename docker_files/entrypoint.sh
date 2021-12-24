#!/bin/bash


#### Ereko part (launch CRON tasks) ####
# see https://blog.knoldus.com/running-a-cron-job-in-docker-container/

echo "Docker container has been started"

declare -p | grep -Ev 'BASHOPTS|BASH_VERSINFO|EUID|PPID|SHELLOPTS|UID' > /container.env

# configure the CRON job.
# This tells to execute the downloader each minute :
# * * * * * bin/console yt-dl:download
echo "SHELL=/bin/bash
BASH_ENV=/container.env
* * * * * echo \$(date) >> /var/log/cron.log 2>&1
* * * * * cd /app ; bin/console yt-dl:download >> /var/log/cron.log 2>&1
# This extra line makes it a valid cron" > scheduler.txt

crontab scheduler.txt
rm scheduler.txt
cron # -f

#### End of Ereko part ####

#### Bitnami part ####
# shellcheck disable=SC1091

set -o errexit
set -o nounset
set -o pipefail
# set -o xtrace # Uncomment this line for debugging purpose

# Load libraries
. /opt/bitnami/scripts/libbitnami.sh
. /opt/bitnami/scripts/liblog.sh
. /opt/bitnami/scripts/libos.sh

# Load Symfony environment
. /opt/bitnami/scripts/symfony-env.sh

print_welcome_page

if [[ "$*" = *"/opt/bitnami/scripts/symfony/run.sh"* ]]; then
    info "** Running Symfony setup **"
    /opt/bitnami/scripts/php/setup.sh
    /opt/bitnami/scripts/mysql-client/setup.sh
    /opt/bitnami/scripts/symfony/setup.sh
    info "** Symfony setup finished! **"
fi

echo ""
exec "$@"

#### End of Bitnami part
