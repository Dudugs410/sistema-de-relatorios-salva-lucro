import { TENANTS, getTenantFromURL } from './tenant'

const DEFAULT_TENANT_KEY = 'salvalucro3'

const absoluteUrl = (path) => new URL(path, window.location.origin).href

// Ícones por White Label ficam em public/icons/<tenant.path>/ (gerados a partir dos logos de cada marca).
const tenantIcon = (tenant, file) => absoluteUrl(`${process.env.PUBLIC_URL || ''}/icons/${tenant.path}/${file}`)

const setMeta = (name, content) => {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

const setLink = (rel, href, attrs = {}) => {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value))
  link.setAttribute('href', href)
}

export const getCurrentTenant = () => getTenantFromURL() || TENANTS[DEFAULT_TENANT_KEY]

const buildManifest = (tenant) => {
  const scope = absoluteUrl(`/${tenant.path}/`)
  return {
    id: `/${tenant.path}/`,
    name: `${tenant.nome} | Financeiro`,
    short_name: tenant.nome,
    description: `${tenant.nome} - Gestão financeira`,
    start_url: scope,
    scope,
    display: 'standalone',
    orientation: 'any',
    theme_color: tenant.themeColor || '#0a3d70',
    background_color: '#ffffff',
    icons: [
      { src: tenantIcon(tenant, 'icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: tenantIcon(tenant, 'icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: tenantIcon(tenant, 'maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

// Cada distribuição White Label é servida em um caminho próprio (/salvalucro3, /sifra_react, ...).
// Geramos o manifest por tenant para que cada uma seja instalável separadamente, com nome,
// escopo e ícone próprios. O mesmo ícone é usado na aba do navegador e no iOS.
export const applyTenantManifest = () => {
  try {
    const tenant = getCurrentTenant()
    const blob = new Blob([JSON.stringify(buildManifest(tenant))], { type: 'application/manifest+json' })
    setLink('manifest', URL.createObjectURL(blob))

    setLink('icon', tenantIcon(tenant, 'favicon-64.png'), { type: 'image/png', sizes: '64x64' })
    setLink('apple-touch-icon', tenantIcon(tenant, 'apple-touch-icon.png'))
    setMeta('apple-mobile-web-app-title', tenant.nome)
    setMeta('application-name', tenant.nome)
  } catch (error) {
    console.warn('Falha ao aplicar manifest do tenant:', error)
  }
}
