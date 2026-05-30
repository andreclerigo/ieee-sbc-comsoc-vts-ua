# IEEE Student Branch Chapter ComSoc/VTS da Universidade de Aveiro

Website em React + Vite + Tailwind CSS para o novo IEEE Student Branch Chapter ComSoc/VTS da Universidade de Aveiro.

## Deployment

The production site is built as a static GitHub Pages artifact from the `main` branch by `.github/workflows/deploy-pages.yml`. The workflow also runs daily at 04:17 UTC to refresh the static vTools event snapshot.

The build runs `npm run build:vtools` before Vite so the public events area can use a generated static snapshot at `/data/vtools-snapshot.json`. This keeps the site compatible with GitHub Pages, which cannot run the former Nginx or serverless proxy routes used for live vTools API calls.

The custom domain is declared in `public/CNAME`:

```text
ieee-sbc-comsoc-vts.ua.andreclerigo.com
```

For GitHub Pages, set the repository Pages source to **GitHub Actions** and point the matching Cloudflare DNS record at `andreclerigo.github.io`.
