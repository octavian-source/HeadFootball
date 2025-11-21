# Head Football

Un joc local inspirat din Soccer Head 2, dezvoltat pentru Windows 11.

## Caracteristici

- **Gameplay Smooth și Optimizat**: Folosește Phaser.js pentru performanță maximă
- **Joc Local**: Nu necesită conexiune la internet
- **Multiplayer Local**: 2 jucători pe același PC
- **Power-ups Aleatorii**:
  - **Speed** (Galben): Viteză crescută timp de 5 secunde
  - **Jump** (Verde): Sărituri mai înalte timp de 5 secunde
  - **Big** (Magenta): Jucătorul devine mai mare timp de 5 secunde
  - **Small** (Cyan): Adversarul devine mai mic timp de 5 secunde
  - **Freeze** (Alb): Înghețează adversarul timp de 3 secunde

## Controale

### Jucător 1 (Roșu)
- **W**: Sărit
- **A**: Mișcare stânga
- **D**: Mișcare dreapta

### Jucător 2 (Albastru)
- **↑ (Săgeată Sus)**: Sărit
- **← (Săgeată Stânga)**: Mișcare stânga
- **→ (Săgeată Dreapta)**: Mișcare dreapta

## Reguli

- Primul jucător care marchează 5 goluri câștigă
- Power-up-urile apar aleatoriu pe teren
- Lovește mingea în power-up pentru a-l activa
- Power-up-ul dispare după 10 secunde dacă nu este luat

## Instalare și Rulare

### Metoda 1: Rulare pentru Development

1. Asigură-te că ai Node.js instalat (descarcă de la https://nodejs.org/)

2. Deschide Command Prompt sau PowerShell în folderul jocului

3. Instalează dependențele:
```bash
npm install
```

4. Pornește jocul:
```bash
npm start
```

### Metoda 2: Build pentru Windows (Executabil)

1. Instalează dependențele (dacă nu ai făcut-o deja):
```bash
npm install
```

2. Creează build-ul:
```bash
npm run build
```

3. Găsește executabilul în folderul `dist/`

4. Dublu-click pe fișierul `.exe` pentru a porni jocul

## Cerințe de Sistem

- **OS**: Windows 11 (funcționează și pe Windows 10)
- **RAM**: Minim 2GB
- **Procesor**: Orice procesor modern
- **Spațiu**: ~200MB

## Optimizări Implementate

- Arcade Physics pentru fizică rapidă și fluidă
- Sprite pooling pentru power-ups
- Hardware acceleration prin Phaser WebGL
- Optimizare coliziuni cu spatial hashing
- Frame rate stabil la 60 FPS

## Tehnologii Folosite

- **Electron**: Pentru aplicație Windows nativă
- **Phaser 3**: Game engine optimizat
- **JavaScript**: Logica jocului
- **HTML5 Canvas**: Rendering grafică

## Probleme Cunoscute

Dacă jocul nu pornește:
1. Verifică că Node.js este instalat corect
2. Șterge folderul `node_modules` și rulează `npm install` din nou
3. Verifică că nu ai un antivirus care blochează Electron

## Licență

MIT License - Joc gratuit pentru uz personal și educațional.
