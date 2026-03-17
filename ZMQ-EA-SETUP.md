# Guide d'Installation de l'Expert Advisor ZeroMQ (BleuApp)

Si vous souhaitez utiliser l'Expert Advisor MQL5 basé sur ZeroMQ pour répliquer vos trades sur les comptes de vos clients ou comme serveur de réception au lieu de META API, ce dossier contient tout le nécessaire.

## 1. Prérequis
- MetaTrader 5 installé sur un VPS Windows.
- Python 3.x installé sur le même VPS ou sur votre serveur backend (si le port ZMQ est ouvert au public, **attention** à la sécurité, il est fortement conseillé de l'exécuter en localhost VPN).

## 2. Installation de l'EA (MQL5)

1. Ouvrez MetaTrader 5.
2. Cliquez sur `Fichier` > `Ouvrir le dossier des données`.
3. Allez dans `MQL5/Experts`.
4. Copiez le contenu du dossier `mql-zmq-master` (fichiers `.mq5` et `.mqh` correspondants, y compris les Include ZMQ s'ils y sont) dans ce dossier MetaTrader.
5. Ouvrez `MetaEditor` (F4).
6. Compilez le fichier principal (ex: `zmq_server.mq5` ou le nom de l'EA maître que vous utilisez). Vous devriez voir "0 errors, 0 warnings".
7. Fermez MetaEditor et retournez sur MetaTrader 5.
8. Dans le Navigateur (Ctrl+N), trouvez votre nouvel Expert Advisor, glissez-le sur un graphique (ex: EURUSD H1).
9. Cochez **"Autoriser le trading algorithmique"** dans les paramètres de l'EA et globalement sur MT5.

## 3. Communication avec BleuApp

Si BleuApp agit comme webhook pour récupérer les signaux Telegram, la liaison s'effectue comme suit : 
1. Le Backend BleuApp (Vercel ou Render) parse le signal.
2. Il l'envoie via protocole HTTP à un **Bridge Python** tournant sur votre VPS.
3. Le Bridge Python prend le trade et l'envoie à MT5 via **ZeroMQ** en localhost.

> ⚠️ Note : **Dans cette version cloud V2**, nous recommandons l'usage exclusif de **MetaAPI** qui abstrait totalement ce besoin de serveur VPS localisé pour le CopyTrading et limite considérablement les crashs réseaux et la maintenance serveur. Le code de `mql-zmq-master` est fourni à titre de backup ou pour des architectures lourdes entièrement centralisées.
