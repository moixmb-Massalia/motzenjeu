# 🚀 Guide Officiel de Publication Google Play Store — MotZen

Ce guide récapitule toutes les étapes pour publier **MotZen** sur le Google Play Store et activer vos publicités AdMob réelles.

---

## 1. 🎬 Remplacement des Clés AdMob (Production)

Pour l'instant, l'application utilise les identifiants officiels de test Google. Avant la publication sur le Play Store :

1. Rendez-vous sur [Google AdMob](https://admob.google.com).
2. Créez une application **Android** : `MotZen`.
3. Créez 2 blocs publicitaires :
   * **Vidéo Récompensée (Rewarded Video)** : Pour doubler les pièces et offrir des indices gratuits.
   * **Interstitiel (Interstitial)** : Pour les transitions entre les chapitres.
4. Mettez à jour :
   * **`android/app/src/main/AndroidManifest.xml`** :
     ```xml
     <meta-data
         android:name="com.google.android.gms.ads.APPLICATION_ID"
         android:value="VOTRE_ADMOB_APP_ID"/>
     ```
   * **`src/lib/ads.ts`** : remplacez les IDs de test par vos IDs de production.

---

## 2. 📱 Compilation du Fichier Android (AAB)

Google Play exige le format **Android App Bundle (.aab)**.

### Méthode A : Via Android Studio (Recommandé)
1. Ouvrez le projet dans Android Studio :
   ```bash
   npx cap open android
   ```
2. Dans Android Studio, allez dans le menu **Build** > **Generate Signed Bundle / APK**.
3. Choisissez **Android App Bundle**.
4. Créez ou sélectionnez votre clé de signature (Keystore).
5. Sélectionnez la variante **release**.
6. Votre fichier `.aab` sera généré dans `android/app/release/app-release.aab`.

### Méthode B : En ligne de commande
```bash
npm run mobile:build
cd android
./gradlew bundleRelease
```

---

## 3. 📝 Fiche Google Play Store (ASO Optimisé)

### Titre de l'application (30 car. max)
`MotZen : Mots Croisés & Voyage`

### Description courte (80 car. max)
`Reliez les lettres, découvrez les merveilles du monde et détendez votre esprit !`

### Description longue
```
Bienvenue dans MotZen, le jeu de réflexion et de vocabulaire le plus relaxant sur mobile !

Inspiré des plus grands classiques des jeux de lettres, MotZen vous invite à un voyage apaisant à travers les merveilles de notre planète.

🌟 POURQUOI VOUS ALLEZ AIMER MOTZEN :
• RELIEZ LES LETTRES : Glissez votre doigt sur la roue pour former des mots et remplir les grilles de mots croisés.
• VOYAGEZ À TRAVERS LE MONDE : Chaque niveau vous rapproche de la découverte d'un monument historique (Tour Eiffel, Colisée de Rome, Pyramides de Gizeh, Mont Fuji, Taj Mahal...).
• BOCAL DE MOTS BONUS : Trouvez des mots cachés non présents sur la grille pour remplir votre bocal et débloquer des trésors de pièces !
• DES INDICES QUAND VOUS HÉSITEZ : Débloquez des lettres grâce à vos pièces ou en profitant de vidéos gratuites.
• JOUEZ PARTOUT, TOUT LE TEMPS : 100% jouable hors-ligne sans connexion Internet.
• SAUVEGARDE CLOUD : Synchronisez votre partie en un clic sur tous vos appareils Android.

Prêt pour l'aventure ? Téléchargez MotZen dès maintenant et entraînez votre cerveau tout en voyageant !
```

---

## 4. 🖼️ Actifs Graphiques Nécessaires sur la Console Play

* **Icône de l'application :** 512 x 512 px (format PNG 32 bits avec alpha).
* **Graphique de fonctionnalité (Bannière) :** 1024 x 500 px (JPEG ou PNG 24 bits sans transparence).
* **Captures d'écran :** Au minimum 4 captures au format 16:9 ou 18:9 (ex: 1080 x 2400 px).
* **Politique de confidentialité (URL) :** Obligatoire pour toute application avec AdMob ou Firebase.
