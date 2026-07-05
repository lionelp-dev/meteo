# Meteo

Projet Django pour une application meteo.

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

3. Creer le fichier d'environnement :

   ```bash
   cp .env.example .env
   ```

4. Appliquer les migrations :

   ```bash
   python manage.py migrate
   ```

5. Lancer le serveur de developpement :

   ```bash
   python manage.py runserver
   ```

L'application sera disponible sur `http://127.0.0.1:8000/`.
