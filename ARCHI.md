# Explication de l'Architecture MDM

## 1. Introduction

Ce document offre un aperçu détaillé de l'architecture de l'application de gestion des appareils iOS via MicroMDM, en se basant sur les étapes décrites dans [la documentation précédente](./README.md). Cette architecture permet de gérer les appareils iOS, de récupérer des informations sur les applications installées, de configurer les certificats nécessaires, et de gérer les interactions avec le serveur MicroMDM.

## 2. Vue d'ensemble de l'Architecture

### 2.1 Composants principaux

L'architecture est composée de plusieurs composants clés, chacun jouant un rôle essentiel dans le processus global de gestion des appareils :

- **MicroMDM** : Il s'agit du serveur MDM (Mobile Device Management) qui gère les appareils iOS. Il s'occupe des demandes d'enrôlement, de l'installation d'applications, et de l'envoi de configurations aux appareils.
  
- **Webhook** : Un serveur qui traite les appels API et déclenche des actions en réponse aux événements MDM. Le webhook permet de gérer les requêtes en temps réel, notamment les applications installées ou les changements d'état des appareils.

- **Base de données SQLite** : Une base de données légère qui stocke les informations sur les appareils et les applications. Elle utilise une structure relationnelle avec des tables pour les appareils et les applications, et une table d'association pour gérer la relation plusieurs-à-plusieurs entre les appareils et les applications.

- **MDMctl** : Outil en ligne de commande utilisé pour configurer MicroMDM et gérer les certificats nécessaires pour l'intégration avec Apple Push Notification Service (APNS) et d'autres services Apple.

### 2.2 Architecture relationnelle de la base de données

L'architecture de la base de données repose sur une relation plusieurs-à-plusieurs entre les **appareils** et les **applications**. Les tables `devices`, `applications` et `device_application` interagissent de manière à permettre une gestion fluide des informations sur les appareils et les applications installées.

Pour plus de détails sur la structure de la base de données, consultez la section [Interaction avec la base de données](./README.md#interaction-avec-la-base-de-données).

## 3. Flux de travail et Processus

### 3.1 Configuration et gestion des certificats

L'un des aspects cruciaux de cette architecture est la gestion des certificats nécessaires à l'intégration avec Apple et à l'envoi de notifications push. Le processus implique plusieurs étapes, comme la création de certificats pour le fournisseur et pour les notifications push, leur signature et leur téléchargement sur MicroMDM.

Les étapes sont détaillées dans la section [Configuration de MicroMDM](./README.md#configuration-de-micromdm).

### 3.2 Lancement du serveur MicroMDM

Le serveur MicroMDM doit être lancé pour gérer les requêtes des appareils. Une fois configuré, le serveur est capable de recevoir des informations des appareils, d'envoyer des configurations et des certificats, et de gérer l'enrôlement des appareils.

Pour plus d'informations, consultez la section [Lancement du serveur MicroMDM](./README.md#lancement-du-serveur-micromdm).

### 3.3 Interaction avec la base de données

Lors de la gestion des appareils et des applications, des informations doivent être récupérées ou mises à jour dans la base de données. Par exemple, pour obtenir les applications installées sur un appareil spécifique, une requête SQL est utilisée pour récupérer ces informations.

Un exemple de requête SQL est fourni dans la section [Interaction avec la base de données](./README.md#interaction-avec-la-base-de-données).

## 4. Fonctionnement global

### 4.1 Demande d'informations sur les applications installées

Lorsque le serveur MicroMDM reçoit une demande pour obtenir la liste des applications installées sur un appareil, il interroge la base de données pour récupérer ces informations et les retourne via le webhook. La base de données contient une relation plusieurs-à-plusieurs entre les appareils et les applications, permettant de déterminer facilement quelles applications sont installées sur quel appareil.

### 4.2 Enrôlement d'un appareil

Lorsqu'un appareil est enrôlé dans le système, un processus automatique de configuration est lancé, y compris l'enregistrement des informations de l'appareil et des applications installées dans la base de données.

## 5. Conclusion

L'architecture de l'application repose sur un serveur MicroMDM pour la gestion des appareils iOS, avec une base de données relationnelle pour stocker les informations pertinentes. Les certificats sont utilisés pour sécuriser les communications avec les services Apple, et l'outil MDMctl facilite la gestion de la configuration et des certificats. Le webhook joue un rôle essentiel en traitant les requêtes en temps réel et en assurant l'interaction entre le serveur MDM et les appareils.

Pour une vue plus détaillée des commandes nécessaires et des étapes spécifiques, consultez [la documentation complète de l'architecture](./README.md).

---
