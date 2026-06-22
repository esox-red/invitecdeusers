# ESOX CDE Onboarding

Webový nástroj BIM oddělení pro přidávání účastníků (subdodavatelů) do projektů v **Dalux CDE**. Stavbyvedoucí vyplní formulář, žádost spadne do sdílené Excel databáze na SharePointu a BIM manažer ji odbaví v administraci.

**Provozní URL:** https://red-cliff-04d71d103.7.azurestaticapps.net/
**Přihlášení:** firemní účet `@esox.red`
**Náklady:** €0/měsíc (Azure Static Web App, tarif Free)

> Tahle README popisuje, **jak nástroj funguje**. Návody na nasazení a přípravu dat jsou v [`README_nasazeni.md`](README_nasazeni.md), [`IT_admin_setup.md`](IT_admin_setup.md) a [`databaze_setup.md`](databaze_setup.md).

---

## Co to je

Jednosouborová statická aplikace (SPA) — celá appka je v `index.html` (HTML + CSS + JS pohromadě), konfigurace v `config.js`. **Žádný backend, žádná databáze, žádný build.** Veškerá logika běží v prohlížeči uživatele; data se čtou a zapisují přímo do **Excel souborů na SharePointu** přes Microsoft Graph.

Proč takhle: nástroj nepotřebuje vlastní server ani DB — data už „bydlí" v M365 (SharePoint), kam má BIM tým přístup. Statický web na Graphu je tak nejlevnější a nejjednodušší možné řešení (žádný provoz serveru, žádná správa DB, přístupová práva řeší přímo M365).

---

## Architektura

```
Prohlížeč uživatele (@esox.red)
        │
        │  1. Přihlášení  →  MSAL.js  →  Entra ID (single-tenant)
        │     App registration „ESOX CDE Onboarding"
        │     delegovaná oprávnění: User.Read, Files.ReadWrite.All, Mail.Send
        │
        ▼
   index.html (SPA)  ──  Microsoft Graph  ──►  SharePoint: sites/BIM
        │                  (jménem přihlášeného uživatele)
        │
        ├── čte   Podklady.xlsx                (seznam projektů a skupin)
        ├── R/W   Databáze subbdodavatelů.xlsx (žádosti)
        └── POST  /me/sendMail                 (pozvánkový e-mail)
```

Klíčové: appka jedná **delegovaně, jménem přihlášeného uživatele** (ne jako servisní účet). Co uvidí a zapíše, je dané právy toho člověka na SharePointu. E-maily proto odcházejí ze schránky toho admina, který klikne na „Odeslat e-mail" (`/me/sendMail`), a uloží se mu do Odeslaných.

### Komponenty

| Vrstva | Co | Kde |
|---|---|---|
| Frontend | `index.html` + `config.js` | repo `esox-red/invitecdeusers` |
| Hosting | Azure Static Web App `swa-cde-onboarding` (Free) | `rg-bim`, westeurope |
| CI/CD | GitHub Actions → push do `main` nasadí | `.github/workflows/deploy.yml` |
| Identita | Entra App registration „ESOX CDE Onboarding" (SPA) | clientId `288264b8-5a4e-4db2-af25-633e94f88373` |
| Data | Excel přes Graph workbook API | SharePoint `esoxbrnocz.sharepoint.com/sites/BIM` |

---

## Datový model (SharePoint)

Aplikace si oba soubory **najde podle názvu** (Graph search), nepotřebuje pevné cesty.

### `Podklady.xlsx` — zdroj pro formulář (jen čtení)

| List | Obsah |
|---|---|
| `Seznam skupin` | sloupec A = názvy pracovních skupin → nabídka skupin ve formuláři |
| `Databáze projektů` | A = kód projektu, B = název projektu → nabídka projektů |

Když soubor nebo list chybí, appka spadne na vestavěné fallback seznamy (aby formulář fungoval i bez SharePointu) — viz `GROUPS_FALLBACK` / `PROJECTS_FALLBACK` v `index.html`.

### `Databáze subbdodavatelů.xlsx` — databáze žádostí (čtení i zápis)

List **`Databáze`**, 16 sloupců A–P. Jeden řádek = jeden účastník.

| Sloupec | Pole | | Sloupec | Pole |
|---|---|---|---|---|
| A | Datum zadání | | I | IČO |
| B | Zadal (jméno) | | J | Skupiny |
| C | Zadal (e-mail) | | K | Projekt |
| D | Jméno | | **L** | ① Čeká na vyřízení |
| E | Příjmení | | **M** | ② E-mail odeslán |
| F | E-mail | | **N** | ③ Pozván do systému |
| G | Telefon | | **O** | ④ Pracovní balíček |
| H | Firma | | **P** | ⑤ Zápis do SD |

Sloupce L–P jsou stavové „checkboxy" — ukládají se jako `TRUE`/`FALSE`. Záhlaví v řádku 1 vytvoří admin jednorázově tlačítkem **Inicializovat databázi**.

---

## Jak to používá uživatel

### Stavbyvedoucí / zadavatel (kdokoli `@esox.red`)

Záložka **Žádost o přidání účastníků**:

1. Vybere projekt (z `Podklady.xlsx`).
2. Vyplní jednoho nebo víc účastníků — jméno, příjmení, e-mail, telefon, firma, IČO + zaškrtne pracovní skupiny.
3. **Odeslat žádost** → appka zjistí přes Graph poslední obsazený řádek v listu `Databáze` a doplní nové řádky pod něj (každý se stavy L–P = `FALSE`).

Zadavatel se podepíše automaticky (jméno + e-mail přihlášeného účtu jdou do sloupců B/C).

### BIM manažer / admin (účty v `config.adminEmails`)

Navíc vidí záložku **Správa žádostí** — tabulku všech žádostí z Excelu s filtry (projekt, firma, jméno, stav). Pro každý řádek:

- **5 stavových koleček (①–⑤)** — kliknutím přepne stav; zápis jde okamžitě do jediné buňky v Excelu (Graph PATCH na `L–P{řádek}`). Souhrnný odznak: *Čeká → Probíhá → Dokončeno*.
- **Odeslat e-mail** — pošle účastníkovi HTML pozvánku do CDE (`/me/sendMail`, kopie zadavateli) a automaticky zaškrtne stav ② *E-mail odeslán*. Po odeslání se tlačítko zamkne, aby nešlo poslat dvakrát.
- **Inicializovat databázi** — zapíše záhlaví A1:P1 (jen při prvním rozjezdu prázdného souboru).

Admin se přidává úpravou pole `adminEmails` v `config.js` a pushnutím do `main`.

### Pětikrokový proces odbavení

| # | Stav | Význam |
|---|---|---|
| ① | Čeká na vyřízení | Žádost přijata, nezpracována |
| ② | E-mail odeslán | Účastníkovi odešla informační pozvánka |
| ③ | Pozván do systému | Pozvánka v Dalux odeslána |
| ④ | Pracovní balíček | Zařazen do skupin a přiřazen k dokumentům |
| ⑤ | Zápis do SD | Záznam ve stavebním deníku |

---

## Konfigurace — `config.js`

```js
clientId:    '288264b8-...'                 // App registration „ESOX CDE Onboarding"
tenantId:    'e610f4b4-...'                  // tenant esox.red
redirectUri: 'https://red-cliff-...azurestaticapps.net/'  // = URL SWA, musí přesně sedět s SPA redirect v Entra
adminEmails: [ ... ]                         // kdo vidí Správu žádostí
sharePoint:  { host, siteName: 'BIM', databazeName, podkladyName, databazaSheet: 'Databáze' }
```

`redirectUri` se musí **přesně** shodovat s SPA redirect URI v App registration (včetně koncového `/`), jinak přihlášení skončí chybou `AADSTS50011`.

---

## Provoz a údržba

- **Nová verze:** uprav soubory → commit → push do `main`. GitHub Actions automaticky nasadí na SWA. Nic dalšího.
- **Změna adminů / projektů:** adminy v `config.js`; projekty a skupiny se mění přímo v `Podklady.xlsx` na SharePointu (bez nasazení).
- **Přidání oprávnění do Graphu** vyžaduje znovu **admin consent** (Global Admin `admin.lnenicka`).

### Předpoklady běhu (jednorázové)

1. App registration s SPA redirect = URL SWA a delegovanými právy `User.Read`, `Files.ReadWrite.All`, `Mail.Send` + **udělený admin consent**.
2. SharePoint: oba Excel soubory připravené, list databáze pojmenovaný `Databáze`, práva (všichni `@esox.red` čtení na site BIM; admin Contribute na složku).

Detaily v [`IT_admin_setup.md`](IT_admin_setup.md) a [`databaze_setup.md`](databaze_setup.md).

---

## Řešení potíží

| Příznak | Příčina / řešení |
|---|---|
| Klik na „Přihlásit přes Microsoft" nic neudělá | Nenačetla se MSAL knihovna (špatná CDN/SRI) → `index.html` ji načítá z `cdn.jsdelivr.net/npm/@azure/msal-browser`. Ověř v konzoli, že je `msal` definované. |
| `AADSTS50011: reply URL does not match` | `redirectUri` v `config.js` ≠ SPA redirect v Entra (pozor na koncové `/`). |
| `403 Forbidden` u souborů | Chybí admin consent na `Files.ReadWrite.All`, nebo uživatel nemá práva na SharePoint složku. |
| `Access denied` při e-mailu | Chybí admin consent na `Mail.Send`. |
| Prázdná stránka po přihlášení | Špatný `clientId`/`tenantId` v `config.js`. |
| Formulář ukazuje obecné skupiny/projekty | Nenašel se `Podklady.xlsx` → běží na fallback seznamech. Zkontroluj název souboru a názvy listů. |

---

**Kontakt:** Vojtěch Poláček — BIM oddělení, ESOX spol. s r.o. — vojtech.polacek@esox.red
