# Meteo

Projet Django pour une application meteo avec Inertia, React et Vite.

## Demarrage

1. Creer et activer un environnement virtuel :

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Installer les dependances :

   ```bash
   pip install -r requirements.txt
   ```

3. Installer les dependances frontend :

   ```bash
   pnpm install
   ```

4. Creer le fichier d'environnement :

   ```bash
   cp .env.example .env
   ```

5. Appliquer les migrations :

   ```bash
   python manage.py migrate
   ```

6. Lancer le serveur Vite :

   ```bash
   pnpm dev
   ```

7. Dans un autre terminal, lancer le serveur Django :

   ```bash
   python manage.py runserver
   ```

L'application sera disponible sur `http://127.0.0.1:8000/`.
Vite sera disponible sur `http://localhost:8001`.

## Build frontend

```bash
pnpm build
```
