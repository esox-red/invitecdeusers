# ESOX CDE Onboarding – Nastavení Azure App Registration

Tento dokument popisuje kroky, které musí provést IT administrátor,
aby webová aplikace mohla přistupovat ke SharePointu a odesílat e-maily
přes účet `vojtech.polacek@esox.red`.

Odhadovaný čas: **10–15 minut**

---

## Krok 1 – Registrace aplikace v Azure AD

1. Přejděte na [https://portal.azure.com](https://portal.azure.com)
   a přihlaste se jako **Global Administrator** nebo **Application Administrator**.
2. Vyhledejte **Microsoft Entra ID** (dříve Azure Active Directory).
3. V levém menu klikněte na **App registrations → New registration**.
4. Vyplňte:
   - **Name:** `ESOX CDE Onboarding`
   - **Supported account types:** `Accounts in this organizational directory only (ESOX only – Single tenant)`
   - **Redirect URI:**
     - Platform: **Single-page application (SPA)**
     - URL: přesná adresa GitHub Pages (viz krok 4), např.
       `https://esox-bim.github.io/cde-onboarding/`
5. Klikněte **Register**.

---

## Krok 2 – Zaznamenat Client ID a Tenant ID

Po registraci uvidíte přehled aplikace. Poznamenejte si:

| Hodnota | Kde ji najdete | Příklad |
|---|---|---|
| **Application (client) ID** | Přímo na Overview stránce | `a1b2c3d4-...` |
| **Directory (tenant) ID** | Přímo na Overview stránce | `e5f6g7h8-...` |

Tyto dvě hodnoty předejte Vojtěchovi – vyplní je do souboru `config.js`.

---

## Krok 3 – Přidat API oprávnění

1. V levém menu klikněte na **API permissions → Add a permission**.
2. Přidejte tato **Microsoft Graph – Delegated permissions**:

| Oprávnění | Důvod |
|---|---|
| `User.Read` | Přihlášení uživatele, zjištění jména a e-mailu |
| `Files.ReadWrite.All` | Čtení a zápis do Excel souborů v SharePointu |
| `Mail.Send` | Odeslání e-mailu ze schránky Vojtěcha |

3. Po přidání všech tří klikněte na tlačítko **Grant admin consent for ESOX**
   a potvrďte. Sloupec „Status" musí zobrazovat zelené fajfky.

---

## Krok 4 – Nastavit Redirect URI (ověření)

1. V levém menu klikněte na **Authentication**.
2. Pod **Single-page application** zkontrolujte, že URL odpovídá přesné adrese
   GitHub Pages repozitáře Vojtěcha.
   - URL musí končit lomítkem `/`
   - Příklad: `https://esox-bim.github.io/cde-onboarding/`
3. Povolte: **Access tokens** ✓ a **ID tokens** ✓ (Implicit grant section).
4. Uložte (**Save**).

---

## Krok 5 – SharePoint oprávnění (pokud selže přístup k souborům)

Aplikace přistupuje k SharePoint site `BIM` pod přihlášeným uživatelem.
Ujistěte se, že:

- Všichni uživatelé s `@esox.red` mají alespoň **Read** přístup na site `BIM`
  (pro stavbyvedoucí – zadávání formuláře).
- Uživatel `vojtech.polacek@esox.red` má **Contribute** nebo vyšší přístup
  na složku `Dalux onboarding` (pro zápis do databáze a odesílání e-mailů).

Nastavení SharePoint oprávnění: SharePoint admin center → Sites → BIM → Permissions.

---

## Předání hodnot Vojtěchovi

Po dokončení kroků 1–4 předejte Vojtěchovi tyto hodnoty:

```
Application (client) ID: ________________________________
Directory (tenant) ID:   ________________________________
Redirect URI (GitHub):   ________________________________
```

Vojtěch je vyplní do souboru `config.js` a nahraje vše na GitHub.

---

## Časté problémy

| Chyba | Řešení |
|---|---|
| `AADSTS50011: The reply URL does not match` | Redirect URI v Azure musí přesně odpovídat URL v `config.js` (včetně `/` na konci) |
| `403 Forbidden` při přístupu k souborům | Ujistěte se, že byl udělen Admin consent pro `Files.ReadWrite.All` |
| `Access denied` při odesílání e-mailu | Admin consent pro `Mail.Send` nebyl udělen |
| Prázdná stránka po přihlášení | Zkontrolujte `tenantId` a `clientId` v `config.js` |
