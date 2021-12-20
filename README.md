Ereko
=====

Ereko est une application de gestion de playlist, qui fonctionne en téléchargeant des musiques depuis Youtube.


Installation
------------


```
# Télécharger le code et se placer dans le dossier
git clone https://github.com/thomas-Ngr/ereko.git
cd ereko

# Lancer l'environnement
docker-compose up

# Installer les dépendances
docker exec <container_id> composer install
```

Mise en place
-------------

Se placer dans le conteneur Docker Symfony.

```
# Mettre à jour les dépendances
composer update

# Créer la base de donnée
bin/console doctrine:migrations:migrate

# Remplir la BDD grace aux fixtures
bin/console doctrine:fixtures:load
```

Developpement
-------------

- `docker ps` pour voir les deux conteneurs docker actifs
- `docker exec <container_id> <command>` pour exécuter une commande dans un conteneur
- `docker exec -it <container_id> <command>` pour exectuer une commande interactive
- `docker exec -it <mariadb_container_id> mysql -u ereko -p` pour avoir un accès à mariadb. Le mot de passe est `mariadb_ereko`.
- `docker exec -it <container_id> bash` pour conserver un bash actif sur le conteneur (permet d'exécuter des commandes Symfony)
- taper `exit` pour sortir du conteneur docker.

