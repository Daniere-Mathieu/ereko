Ereko
=====

Ereko est une application de gestion de playlist, qui fonctionne en téléchargeant des musiques depuis Youtube.

À l'ouverture, l'utilisateur crée une playlist en choisissant une date de soirée. L'utilisateur arrive ensuite sur une page vierge, où il peut ajouter des pistes en cherchant parmi les vidéos de Youtube.

Les musiques sont ajoutées à la suite, et s'enchaînent. Il est impossible de supprimer ou déplacer une piste: en effet, l'objectif est de créer des playlistes pour une soirée, par de faire du mixage.

L'utilisateur peut régler le volume, mettre la musique sur pause, et avancer la musique en cliquant sur la barre de défilement.


Installation
------------


```
# Télécharger le code et se placer dans le dossier
git clone https://github.com/Daniere-Mathieu/ereko.git
cd ereko

# Lancer l'environnement
docker-compose up

# récupérer l'identifiant des conteneurs
docker ps

# Installer les dépendances
docker exec <container_id_ereko> composer install

# Créer la base de donnée
docker exec -it <container_id_ereko> bin/console doctrine:migrations:migrate
```

On peut ensuite se connecter au site à l'adresse 0.0.0.0:8000.

Mise en place de développement
------------------------------

Se placer dans le conteneur Docker Symfony.

```
# Mettre à jour les dépendances
composer update

# Remplir la BDD grace aux fixtures
bin/console doctrine:fixtures:load
```

Developpement : commandes utiles
--------------------------------

- `docker ps` pour voir les deux conteneurs docker actifs
- `docker exec <container_id> <command>` pour exécuter une commande dans un conteneur
- `docker exec -it <container_id> <command>` pour exectuer une commande interactive
- `docker exec -it <mariadb_container_id> mysql -u ereko -p` pour avoir un accès à mariadb. Le mot de passe est `mariadb_ereko`.
- `docker exec -it <container_id> bash` pour conserver un bash actif sur le conteneur (permet d'exécuter des commandes Symfony)
- taper `exit` pour sortir du conteneur docker.
