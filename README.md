# BINARY_TRANSLATOR — Convertisseur Binaire ↔ Texte

Une application web interactive au style terminal permettant de convertir du texte en binaire (et vice-versa) en temps réel, avec une visualisation pédagogique de chaque octet.

---

## ✨ Fonctionnalités

- **Conversion bidirectionnelle** : Texte → Binaire et Binaire → Texte en temps réel
- **Visualisation par octets** : Chaque caractère est décomposé en registre d'octet (binaire, décimal, hexadécimal)
- **Éditeur d'octet interactif** : Modifiez les bits individuels d'un octet sélectionné et observez le résultat en direct
- **Statistiques binaires** : Compteur de bits, d'octets et de caractères mis à jour dynamiquement
- **Séparateurs configurables** : Espace, virgule, tiret ou aucun séparateur entre les octets
- **Presets d'exemples** : Chargez des textes prédéfinis pour explorer rapidement l'outil
- **Détection d'erreurs** : Signalement des séquences binaires invalides lors du décodage
- **Copie en un clic** : Copiez l'entrée ou la sortie dans le presse-papiers
- **Interface responsive** : Fonctionne sur mobile, tablette et desktop

---

## 🛠️ Stack technique

| Technologie | Rôle |
|---|---|
| **React 19** + **TypeScript** | Framework UI & typage |
| **Vite 6** | Bundler & serveur de développement |
| **Tailwind CSS v4** | Styling utilitaire |
| **Motion (Framer Motion)** | Animations & transitions |
| **Lucide React** | Icônes |
| **@google/genai** | SDK Gemini AI |
| **Express** | Serveur backend |

---

## 🚀 Installation & lancement local

**Prérequis :** Node.js (v18+)

1. **Cloner le dépôt et installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement :**
   Copiez `.env.example` en `.env.local` et renseignez vos valeurs :
   ```bash
   cp .env.example .env.local
   ```
   ```env
   GEMINI_API_KEY="votre_clé_api_gemini"
   APP_URL="http://localhost:3000"
   ```

3. **Lancer l'application :**
   ```bash
   npm run dev
   ```
   L'application est disponible sur [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
binary_to_text/
├── src/
│   ├── App.tsx                  # Composant principal & logique de conversion
│   ├── types.ts                 # Types TypeScript (ConversionMode, BinarySeparator, ...)
│   ├── index.css                # Styles globaux
│   ├── main.tsx                 # Point d'entrée React
│   ├── components/
│   │   ├── InteractiveByte.tsx  # Éditeur de bits interactif
│   │   ├── BinaryStats.tsx      # Tableau de statistiques binaires
│   │   └── TutorialCard.tsx     # Carte pédagogique (cheat sheet)
│   └── utils/
│       └── binaryConverter.ts   # Fonctions de conversion (texte ↔ octets ↔ binaire)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement (port 3000) |
| `npm run build` | Compile pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie les types TypeScript |
| `npm run clean` | Supprime les artefacts de build |

---

## 📖 Comment ça marche ?

Le texte est encodé en **UTF-8**, chaque caractère est représenté par un ou plusieurs octets de 8 bits. Par exemple :

```
"Hi" → [72, 105] → 01001000 01101001
```

L'encodage supporté est **UTF-8 / ASCII**.
