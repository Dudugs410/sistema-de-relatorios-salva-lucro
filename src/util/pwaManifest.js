import { TENANTS, getTenantFromURL } from './tenant'

const DEFAULT_TENANT_KEY = 'salvalucro3'

// Manifests e ícones por White Label ficam em public/manifests/<tenant.path>.json
// e public/icons/<tenant.path>/. São arquivos estáticos (e não gerados via blob:)
// porque o CSP do servidor só permite manifest de 'self'.
const publicFile = (file) => `${process.env.PUBLIC_URL || ''}/${file}`

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

// Cada distribuição White Label é servida em um caminho próprio (/salvalucro3, /sifra_react, ...)
// e é instalável separadamente, com nome, escopo e ícone próprios.
export const applyTenantManifest = () => {
  try {
    const tenant = getCurrentTenant()
    setLink('manifest', publicFile(`manifests/${tenant.path}.json`))
    setLink('icon', publicFile(`icons/${tenant.path}/favicon-64.png`), { type: 'image/png', sizes: '64x64' })
    setLink('apple-touch-icon', publicFile(`icons/${tenant.path}/apple-touch-icon.png`))
    setMeta('apple-mobile-web-app-title', tenant.nome)
    setMeta('application-name', tenant.nome)
  } catch (error) {
    console.warn('Falha ao aplicar manifest do tenant:', error)
  }
}
