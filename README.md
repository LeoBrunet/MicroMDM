# Documentation de l'Architecture MDM

## 1. Introduction

Cette application utilise MicroMDM pour gérer les appareils iOS et leurs applications. Elle permet de récupérer les informations sur les appareils, d'installer des applications, et de gérer des certificats nécessaires pour l'interaction avec les services Apple.

## 2. Architecture

### 2.1 Composants principaux

- **MicroMDM** : Un serveur MDM pour gérer les appareils iOS.
- **Webhook** : Un serveur qui gère les appels à l'API du MDM.
- **Base de données** : Une base de données SQLite pour stocker les informations sur les appareils et les applications installées.
- **MDMctl** : Un outil en ligne de commande pour configurer et gérer MicroMDM et les certificats.

### 2.2 Relations dans la base de données

L'application utilise une base de données avec deux tables principales, `devices` et `applications`. Une relation de type plusieurs-à-plusieurs est utilisée entre ces tables via une table d'association `device_application`. Cela permet de gérer les applications installées sur chaque appareil.

### 2.3 Flux de travail

1. **Configuration initiale** avec `mdmctl`.
2. **Création des certificats** pour l'authentification et l'intégration avec Apple.
3. **Lancement du serveur MicroMDM** pour gérer les demandes des appareils.
4. **Interaction avec la base de données** pour récupérer les applications installées sur un appareil spécifique via son UDID.

## 3. Configuration de MicroMDM

### 3.1 Configuration MDMctl

1. **Définir la configuration** :

   Cette commande configure les paramètres de connexion au serveur MDM, y compris le jeton d'API et l'URL du serveur.

   ```
   ./mdmctl config set -name production -api-token MySecureAPIKey12345 -server-url https://stunning-space-tribble-7575v4rqq9j2xprj-8080.app.github.dev/
   ```

2. **Changer de configuration** :

   Pour activer la configuration "production", utilisez la commande suivante :

   ```
   ./mdmctl config switch -name production
   ```

3. **Vérifier la configuration actuelle** :

   Pour afficher les paramètres de configuration actuels :

   ```
   ./mdmctl config print
   ```

### 3.2 Lancement du serveur MicroMDM

Pour démarrer le serveur MicroMDM avec la configuration appropriée et l'URL du webhook :

```
sudo ./micromdm serve -server-url=https://stunning-space-tribble-7575v4rqq9j2xprj-8080.app.github.dev/ -api-key MySecureAPIKey12345 -filerepo . -tls=false -command-webhook-url=https://stunning-space-tribble-7575v4rqq9j2xprj-10000.app.github.dev/webhook
```

### 3.3 Création des certificats

1. **Générer le CSR pour le certificat du fournisseur** :

   Créez une demande de certificat (CSR) pour le certificat du fournisseur.

   ```
   ./mdmctl mdmcert vendor -password=vlkasvkja1rd -country=FR -email=leo.brunet@pradeo.com
   ```

2. **Télécharger le certificat du fournisseur** depuis [Apple Developer](https://developer.apple.com/account/resources/certificates/add/download/7WGG8N2HK9).

3. **Générer le CSR pour le certificat Push** :

   Créez une demande de certificat pour la notification push.

   ```
   ./mdmctl mdmcert push -password=vlkasvkja1rd -country=FR -email=leo.brunet@pradeo.com
   ```

4. **Signer le CSR du Push avec le certificat du fournisseur** :

   Cette étape signe le fichier PushCertificateRequest avec le certificat du fournisseur.

   ```
   ./mdmctl mdmcert vendor -sign -cert=./mdm-certificates/MDM_Pradeo_Security_Systems_Certificate.cer -password=vlkasvkja1rd
   ```

5. **Télécharger le certificat APNS** en téléchargeant le fichier `PushCertificateRequest.plist` via [Apple Push Certificate Portal](https://identity.apple.com/pushcert/).

6. **Télécharger et télécharger le certificat sur MicroMDM** :

   ```
   ./mdmctl mdmcert upload -cert mdm-certificates/MDM_Pradeo_Security_Systems_Certificate.pem -private-key mdm-certificates/PushCertificatePrivateKey.key -password=vlkasvkja1rd
   ```

### 3.4 Définir les variables d'environnement

Avant d'exécuter `mdmctl` ou d'autres commandes, définissez les variables d'environnement :

```
export MICROMDM_ENV_PATH="$(pwd)/env"
```

### 3.5 Lancer le webhook

Le webhook permet d'interagir avec le serveur MDM et de traiter les requêtes en temps réel.

```
python webhook/run.py
```

## 4. Interaction avec la base de données

### 4.1 Accéder à la base de données SQLite

Utilisez SQLite3 pour interagir directement avec la base de données `app.db` :

```
sqlite3 webhook/instance/app.db
```

### 4.2 Requête SQL pour obtenir les applications installées sur un appareil

Voici la requête SQL pour obtenir les applications installées sur un appareil en utilisant son UDID :

```
SELECT a.id, a.name, a.bundle_id
FROM applications a
JOIN device_application da ON a.id = da.application_id
JOIN devices d ON da.device_id = d.id
WHERE d.udid = '00008101-0001214A1AB9001E';
```

## 5. Conclusion

Cette application MDM vous permet de gérer les appareils iOS et leurs applications via un serveur MicroMDM, tout en utilisant une base de données pour stocker les informations pertinentes sur les appareils et les applications installées. Grâce à `mdmctl` et aux certificats Apple, l'intégration avec Apple Push Notifications est également possible pour gérer les notifications et les configurations à distance.

---

**Note :** Assurez-vous de protéger les clés et certificats générés durant cette procédure et de suivre les meilleures pratiques de sécurité pour le stockage des informations sensibles.
