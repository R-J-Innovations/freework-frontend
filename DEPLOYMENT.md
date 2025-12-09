# Deployment to freework.co.za (GoDaddy hosting with Cloudflare SSL)

This repo includes a GitHub Actions workflow to build the Angular app and deploy the contents of `dist/angular-app` to your GoDaddy hosting. Cloudflare handles SSL for `freework.co.za`.

## Prerequisites

1. GoDaddy hosting (cPanel/Linux recommended). Note the deployment directory (usually `public_html/` or a subdirectory for the site).
2. Cloudflare enabled for `freework.co.za` with DNS pointing to your GoDaddy server IP.
3. Create GitHub repository secrets:
   - `SFTP_SERVER`: your server domain or IP (e.g., `freework.co.za` or host IP)
   - `SFTP_USERNAME`: SFTP username (often the cPanel username)
   - `SFTP_PASSWORD`: SFTP password
   - `REMOTE_PATH`: remote deploy path (e.g., `public_html/` or `public_html/freework.co.za/`)
   - Optional FTP fallback:
     - `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
     - Set Actions variable `DEPLOY_VIA_FTP` to `true` if your plan only supports FTP/FTPS
   - Cloudflare cache purge:
     - `CF_API_TOKEN`: token with Zone.Cache Purge permissions
     - `CF_ZONE_ID`: Zone ID for `freework.co.za` (found in Cloudflare dashboard)

## Workflow

- Triggers on pushes to `main` or manual run.
- Steps:
  - Checkout repo
  - Setup Node 18 and install dependencies (`npm ci`)
  - Build (`npm run build`) -> output in `dist/angular-app`
  - Deploy via SFTP to your `REMOTE_PATH` on GoDaddy
  - Optionally deploy via FTP if SFTP unsupported
  - Purge Cloudflare cache to reflect changes instantly

## Angular build notes

- Build output path is configured in `angular.json`: `dist/angular-app`.
- Ensure `src/index.html` has correct base href if your app is served from a subdirectory:
  - `<base href="/">` for root domain.

## GoDaddy / Cloudflare setup

- In Cloudflare DNS, point `A` record for `freework.co.za` and `www` to your GoDaddy hosting IP.
- Enable "Full" SSL/TLS in Cloudflare.
- If using cPanel, ensure the document root for the domain corresponds to your `REMOTE_PATH`.

## Manually triggering a deploy

- Go to GitHub -> Actions -> "Deploy to GoDaddy" -> Run workflow.

## Troubleshooting

- 404 or routing issues on Angular SPA: add a rewrite in GoDaddy Apache `.htaccess` within `REMOTE_PATH`:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

- Cloudflare cache: ensure the token has correct permissions and Zone ID is set.
- FTP vs SFTP: Prefer SFTP. If SFTP fails, set `DEPLOY_VIA_FTP` variable to `true` and populate FTP secrets.

