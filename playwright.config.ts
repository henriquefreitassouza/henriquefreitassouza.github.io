import { defineConfig } from '@playwright/test'

// Tests run against the generated static site (`INCLUDE_DRAFTS=1 pnpm generate` first), served the
// way GitHub Pages serves it: plain files, <path>/index.html, /404.html for missing paths.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://127.0.0.1:4321', browserName: 'chromium' },
  webServer: {
    command: 'python3 -I tests/e2e/pages_server.py .output/public 4321',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
  },
})
