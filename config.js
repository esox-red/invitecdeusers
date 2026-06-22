/**
 * ESOX CDE Onboarding – Konfigurační soubor
 *
 * clientId se doplní po dokončení Azure App Registration (viz IT_admin_setup.md).
 * tenantId a redirectUri jsou nastaveny pro nasazení na Azure Static Web App.
 */

const CONFIG = {

  // ── Azure AD ──────────────────────────────────────────────
  clientId: '288264b8-5a4e-4db2-af25-633e94f88373',   // Application (client) ID z App Registration "ESOX CDE Onboarding"
  tenantId: 'e610f4b4-710a-4f49-aa5b-c54764316d27',   // Directory (tenant) ID – esox.red

  // URL nasazení – musí přesně odpovídat SPA Redirect URI v App Registration
  redirectUri: 'https://red-cliff-04d71d103.7.azurestaticapps.net/',

  // ── Admin ─────────────────────────────────────────────────
  // Tito uživatelé uvidí záložku „Správa žádostí"
  adminEmails: [
    'vojtech.polacek@esox.red',
    'andrzej.waclawik@esox.red',
    'jan.matousek@esox.red',
    'adam.lnenicka@esox.red'
  ],

  // ── SharePoint ────────────────────────────────────────────
  sharePoint: {
    host:       'esoxbrnocz.sharepoint.com',   // Tenant hostname
    siteName:   'BIM',                          // Název SharePoint site

    // Soubory v SharePointu (aplikace je najde automaticky vyhledáváním)
    databazeName: 'Databáze subbdodavatelů.xlsx',
    podkladyName:  'Podklady.xlsx',

    // Název listu v databázovém Excel souboru
    databazaSheet: 'Databáze'
  }

};
