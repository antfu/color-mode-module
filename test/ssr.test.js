import { join } from 'path'
import { readFile } from 'fs-extra'
import { setupTest, get, getContext } from '@nuxt/test-utils'

describe('ssr: true, dev mode', () => {
  const rootDir = join(__dirname, '..', 'playground')

  setupTest({
    server: true,
    rootDir,
    config: {
      ssr: true,
      target: 'static'
    }
  })

  test('render', async () => {
    const { body } = await get('/')
    expect(body).toContain('nuxt-color-mode-script')
  })
})

describe('ssr: true, target: server, prod mode', () => {
  const rootDir = join(__dirname, '..', 'playground')

  setupTest({
    server: true,
    build: true,
    rootDir,
    config: {
      ssr: true,
      target: 'server'
    }
  })

  test('render', async () => {
    const { body, headers } = await get('/')
    expect(body).toContain('nuxt-color-mode-script')
    expect(headers['content-security-policy']).toBeUndefined()
  })
})

describe('ssr: true, target: static, generated files', () => {
  const rootDir = join(__dirname, '..', 'playground')

  setupTest({
    generate: true,
    rootDir,
    config: {
      ssr: true,
      target: 'static'
    }
  })

  test('generated file', async () => {
    const { nuxt } = getContext()
    const generateDir = nuxt.options.generate.dir
    const files = ['index.html', '200.html']
    for (const file of files) {
      const contents = await readFile(join(generateDir, file), 'utf-8')
      expect(contents).toMatch('nuxt-color-mode-script')
    }
  })
})

describe('ssr: true, csp hash on script', () => {
  const rootDir = join(__dirname, '..', 'playground')

  setupTest({
    server: true,
    build: true,
    rootDir,
    config: {
      ssr: true,
      render: {
        csp: true
      }
    }
  })

  test('csp hash on script', async () => {
    const { headers } = await get('/')
    expect(headers['content-security-policy']).toContain('sha256-')
  })
})
