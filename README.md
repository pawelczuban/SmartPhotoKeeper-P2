# SmartPhotoKeeper-P2

## Wymagania środowiskowe

1. **Backend**:
   - python 3.11
   - poetry

2. **Frontend**:
   - node
   - npm

3. **Dowolna przeglądarka**

## Procedura uruchomienia

Aplikacja uruchamiana lokalnie:
1. Utworzenie bucketu Google Cloud Storage oraz nadanie uprawnień do bucketu dla dewelopera (docelowo do service account serwera)
2. Konfiguracja Firebase Authentication i pobranie credentiali konfiguracyjnych dla frontendu
3. Instalacja zależności:
   - Backend: poetry install
   - Frontend: npm install
4. Uruchomienie Backendu:
   - python main.py (można rozważyć konfigurację fastapi dev main.py)
5. Uruchomienie frontendu:
   - npm start
