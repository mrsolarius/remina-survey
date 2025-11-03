# Remina Survey - Déploiement en production (Docker + systemd)

Ce guide explique comment construire l'image, lancer les containers (NestJS + Angular front embarqué, Postgres), et gérer le cycle de vie via systemd.

## Prérequis
- Serveur Linux avec Docker Engine et Docker Compose v2 (`docker compose`) installés
- Accès sudo
- Ports exposés: 3000 (app), 5432 (Postgres, si besoin externe)

## Structure des fichiers
- `Dockerfile` — multi-stage pour builder Angular et NestJS
- `docker-compose.prod.yml` — stack prod (app + postgres)
- `.dockerignore` — réduit le contexte de build
- `.env.example` — modèle; copie en `.env`
- `docker/init_db_sql.sql` — SQL d'initialisation (seed) exécuté à la première initialisation du volume
- `systemd/remina.service` — template du service systemd

## Configuration
1. Copier `.env.example` en `.env` à la racine et ajuster:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=remina
DB_PORT=5432
APP_PORT=3000
NODE_ENV=production
```

2. Vérifier `docker/init_db_sql.sql` (sera importé une seule fois, lors de la création du volume Postgres).

## Build et exécution locale (optionnel)
À la racine du projet:

```sh 
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
# Logs
docker compose -f docker-compose.prod.yml logs -f app postgres
```

Accéder à l'app: http://localhost:3000/

## Déploiement sur serveur avec systemd

1. Copier le dépôt dans `/opt/ReminaSurvey` (ou autre chemin, mais garder cohérent avec `WorkingDirectory`):

```sh
sudo mkdir -p /opt/remina-survey
sudo chown -R $USER:$USER /opt/remina-survey
rsync -av --delete ./ /opt/remina-survey/
```

2. Copier et adapter le fichier d'environnement:

```sh
cp /opt/remina-survey/.env.example /opt/remina-survey/.env
# Éditer /opt/remina-survey/.env avec vos valeurs
```

3. Installer le service systemd:

```sh
sudo cp /opt/remina-survey/systemd/remina.service /etc/systemd/system/remina.service
sudo systemctl daemon-reload
sudo systemctl enable --now remina
```

4. Vérifications:

```sh
systemctl status remina
# Santé app
curl -I http://localhost:3000/
# Tables en base
sudo docker exec -it remina-postgres psql -U ${DB_USER:-postgres} -d ${DB_NAME:-remina} -c "\\dt"
```

## Opérations courantes
- Démarrer: `sudo systemctl start remina`
- Arrêter: `sudo systemctl stop remina`
- Redémarrer (après mise à jour du code): `sudo systemctl restart remina`
- Recharger (après modif .env/compose): `sudo systemctl reload remina`
- Logs: `sudo docker compose -f /opt/remina/docker-compose.prod.yml logs -f app postgres`

## Notes importantes
- Le seed SQL ne s'exécute que lors de la première initialisation du volume `remina_pg_data`.
- Pour rejouer l'init: arrêter le stack, supprimer le volume (`docker volume rm remina_remina_pg_data` si le projet s'appelle `remina`), puis relancer.
- Sécurité: changez les mots de passe, n'exposez pas Postgres si inutile, placez un reverse proxy TLS (Nginx/Traefik) en production si possible.
- Sauvegardes: sauvegardez le volume `remina_pg_data`.
- Healthcheck: le container app vérifie `GET /`. Vous pouvez créer un endpoint `/api/health` et ajuster le `HEALTHCHECK`.

## Personnalisation
- Registry: pour publier l'image, remplacez la section `app.build` par `image: registry/remina-app:tag`, puis `docker build && docker push`.
- Reverse proxy: intégrer un Nginx ou Traefik devant l'app pour TLS/HTTP2/compression.
