# ESOX CDE Onboarding – Průvodce nasazením

**Aplikace:** Webový formulář pro přidávání účastníků do Dalux CDE  
**Hosting:** GitHub Pages (statický web, žádný backend)  
**Autentizace:** Microsoft Azure AD (MSAL.js)  
**Data:** SharePoint Online – Excel soubory na webu BIM

---

## Obsah balíčku

| Soubor | Popis |
|---|---|
| `index.html` | Hlavní aplikace (SPA) |
| `config.js` | Konfigurace – Azure ID, URL, SharePoint |
| `IT_admin_setup.md` | Podrobný návod pro IT admina (Azure + SharePoint) |
| `databaze_setup.md` | Návod na přípravu Excel souborů na SharePointu |

---

## Krok 1 – Azure App Registration (IT admin)

Viz soubor **`IT_admin_setup.md`** pro podrobné kroky. Stručně:

1. Přihlaste se na [portal.azure.com](https://portal.azure.com) → **Azure Active Directory** → **App registrations** → **New registration**
2. Název: `ESOX CDE Onboarding`  
   Typ účtu: `Accounts in this organizational directory only`  
   Redirect URI: `Single-page application (SPA)` → URL GitHub Pages (viz Krok 2)
3. Po registraci si zkopírujte:
   - **Application (client) ID** → do `config.js` jako `clientId`
   - **Directory (tenant) ID** → do `config.js` jako `tenantId`
4. **API permissions** – přidat a udělit admin consent:
   - `User.Read` (delegated)
   - `Files.ReadWrite.All` (delegated)
   - `Mail.Send` (delegated)

---

## Krok 2 – GitHub Pages

### 2a. Vytvořit repozitář

1. Přihlaste se na [github.com](https://github.com)
2. **New repository** → název např. `cde-onboarding` → Public → Create
3. Nahrajte soubory `index.html` a `config.js` do kořene repozitáře
4. **Settings** → **Pages** → Source: `Deploy from a branch` → Branch: `main` → `/root` → Save
5. Po chvíli bude web dostupný na: `https://GITHUB_USERNAME.github.io/cde-onboarding/`

### 2b. Vyplnit config.js

Otevřete `config.js` a doplňte hodnoty:

```js
clientId:    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  // Application (client) ID z Azure
tenantId:    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  // Directory (tenant) ID z Azure
redirectUri: 'https://VAS_GITHUB_USERNAME.github.io/cde-onboarding/',
```

Redirect URI musí přesně odpovídat tomu, co bylo zadáno v Azure App Registration (Krok 1.2).

### 2c. Přidat Redirect URI do Azure (pokud ještě neexistuje)

Azure portal → App registrations → ESOX CDE Onboarding → **Authentication** → přidat URL z bodu 2a jako SPA redirect URI → Save.

---

## Krok 3 – SharePoint příprava

Viz soubor **`databaze_setup.md`** pro podrobnosti. Stručně:

1. Na SharePoint webu `BIM` (esoxbrnocz.sharepoint.com/sites/BIM) vytvořte složku `Dalux onboarding`
2. Nahrajte nebo vytvořte soubor `Databáze subbdodavatelů.xlsx`:
   - List přejmenujte na `Databáze`
   - Záhlaví nastaví aplikace automaticky tlačítkem **Inicializovat databázi** (v admin panelu)
3. Nahrajte nebo vytvořte soubor `Podklady.xlsx`:
   - List `Databáze projektů` – sloupec A = kód projektu, B = název projektu
   - List `Seznam skupin` – sloupec A = název skupiny (bez záhlaví, nebo se záhlavím)
4. Oprávnění na složce `Dalux onboarding`:
   - Všichni @esox.red: čtení
   - `vojtech.polacek@esox.red`: Přispívatel (Contribute)

---

## Krok 4 – Ověření funkčnosti

1. Otevřete URL GitHub Pages v prohlížeči
2. Přihlaste se firemním účtem @esox.red
3. Formulář by měl načíst seznam projektů a skupin ze SharePointu
4. Přihlásit jako `vojtech.polacek@esox.red` → ověřit záložku **Správa žádostí**
5. Odeslat testovací žádost → ověřit zápis do Excel souboru na SharePointu

---

## Admin uživatelé (záložka Správa žádostí)

Záložku vidí pouze tito uživatelé (nastaveno v `config.js`):

- vojtech.polacek@esox.red
- andrzej.waclawik@esox.red
- jan.matousek@esox.red
- adam.lnenicka@esox.red

Přidání dalšího admina: upravit pole `adminEmails` v `config.js` a nahrát na GitHub.

---

## Správa žádostí – postup

Záložka **Správa žádostí** zobrazuje všechny záznamy z Excel databáze.

**5 kroků zpracování** (kliknutím zakliknete/odškrtnete, automaticky se uloží do Excel):

| # | Krok | Popis |
|---|---|---|
| ① | Čeká na vyřízení | Žádost přijata, zatím nezpracována |
| ② | E-mail odeslán | Odeslán informační e-mail účastníkovi (tlačítko v tabulce) |
| ③ | Pozván do systému | Pozvánka v Dalux odeslána |
| ④ | Pracovní balíček | Účastník zařazen do skupin a přiřazen k dokumentům |
| ⑤ | Zápis do SD | Záznam proveden v stavebním deníku |

---

## Kontakt

**Vojtěch Poláček** – BIM manažer, ESOX, spol. s r.o.  
vojtech.polacek@esox.red
