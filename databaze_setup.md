# Příprava Excel souborů v SharePointu

Před prvním spuštěním aplikace je potřeba připravit dva soubory ve složce
`Dalux onboarding` na SharePointu (BIM site).

---

## 1. Podklady.xlsx ✓ (již existuje)

Tento soubor aplikace čte jako zdroj dat pro formulář.
Musí obsahovat dva listy s přesnými názvy:

### List: `Seznam skupin`
- Sloupec A: název skupiny (bez záhlaví)
- Aplikace načte všechny neprázdné buňky v tomto sloupci

### List: `Databáze projektů`
- Sloupec A: kód projektu
- Sloupec B: název projektu
- Bez záhlaví, aplikace čte od řádku 1

Soubor je již nastaven správně – **není třeba upravovat**.

---

## 2. Databáze subbdodavatelů.xlsx ✓ (již existuje)

Tento soubor slouží jako databáze přijatých žádostí.

### Přejmenování listu

V souboru musí existovat list s názvem **přesně `Databáze`**:

1. Otevřete `Databáze subbdodavatelů.xlsx` na SharePointu
2. Klikněte pravým tlačítkem na záložku listu (dole) → **Přejmenovat**
3. Zadejte: `Databáze`
4. Uložte

### Inicializace záhlaví (automaticky)

Po prvním otevření aplikace jako admin (vojtech.polacek@esox.red)
se zobrazí tlačítko **„Inicializovat databázi"** – kliknutím se automaticky
vytvoří záhlaví sloupců v řádku 1.

### Struktura sloupců (pro referenci)

| Sloupec | Záhlaví |
|---|---|
| A | Datum zadání |
| B | Zadal (jméno) |
| C | Zadal (e-mail) |
| D | Jméno |
| E | Příjmení |
| F | E-mail |
| G | Telefon |
| H | Firma |
| I | IČO |
| J | Skupiny |
| K | Projekt |
| L | Čeká na vyřízení |
| M | E-mail odeslán |
| N | Pozván do systému |
| O | Pracovní balíček |
| P | Zápis do SD |

---

## Shrnutí kroků před spuštěním

1. ✅ `Podklady.xlsx` – existuje, listy `Seznam skupin` a `Databáze projektů` jsou v pořádku
2. ☐ `Databáze subbdodavatelů.xlsx` – přejmenovat výchozí list na `Databáze`
3. ☐ IT admin – dokončit Azure App Registration (viz `IT_admin_setup.md`)
4. ☐ Vyplnit `clientId`, `tenantId` a `redirectUri` v `config.js`
5. ☐ Nahrát `index.html` + `config.js` na GitHub a zapnout GitHub Pages
6. ☐ První spuštění jako admin → kliknout „Inicializovat databázi"
