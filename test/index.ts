import test = require('tape')
import mergeShrinkwraps from '@pnpm/merge-driver'

const simpleShr = {
  dependencies: {
    foo: '1.0.0',
  },
  packages: {
    '/foo/1.0.0': {
      resolution: {
        integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
      },
    },
  },
  registry: 'https://registry.npmjs.org/',
  specifiers: {
    foo: '1.0.0',
  },
  shrinkwrapVersion: 3,
}

test('fails when registry fields differ', t => {
  t.throws(() => {
    mergeShrinkwraps({
      base: simpleShr,
      ours: {...simpleShr, registry: 'https://registry.node-modules.io/'},
      theirs: {...simpleShr, registry: 'https://registry.yarnpkg.com/'},
    })
  }, /Cannot resolve 'registry'/, 'The registry field has been changed in both our/their')
  t.end()
})

test('fails when specifiers differ', t => {
  t.throws(() => {
    mergeShrinkwraps({
      base: simpleShr,
      ours: {...simpleShr, specifiers: {foo: '^1.0.0'}},
      theirs: {...simpleShr, specifiers: {foo: '^1.1.0'}},
    })
  }, /Cannot resolve 'specifiers.foo'/, 'Cannot merge specifiers field')
  t.end()
})

test('fails when dependencies differ', t => {
  t.throws(() => {
    mergeShrinkwraps({
      base: simpleShr,
      ours: {...simpleShr, dependencies: {foo: '1.2.0'}},
      theirs: {...simpleShr, dependencies: {foo: '1.1.0'}},
    })
  }, /Cannot resolve 'dependencies.foo'/, 'Cannot merge dependencies field')
  t.end()
})

test('prefers our shrinkwrap resolutions when it has less packages', t => {
  const mergedShrinkwrap = mergeShrinkwraps({
    base: simpleShr,
    ours: {
      ...simpleShr,
      packages: {
        '/foo/1.0.0': {
          dependencies: {
            bar: '1.0.0',
          },
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
        '/bar/1.0.0': {
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
      },
    },
    theirs: {
      ...simpleShr,
      packages: {
        '/foo/1.0.0': {
          dependencies: {
            bar: '1.1.0',
          },
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
        '/bar/1.1.0': {
          dependencies: {
            qar: '1.0.0',
          },
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
        '/qar/1.0.0': {
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
      },
    },
  })

  t.deepEqual(mergedShrinkwrap, {
    ...simpleShr,
    packages: {
      '/foo/1.0.0': {
        dev: false,
        dependencies: {
          bar: '1.0.0',
        },
        resolution: {
          integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
        },
      },
      '/bar/1.0.0': {
        dev: false,
        resolution: {
          integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
        },
      },
    },
  })

  t.end()
})

test('prefers our shrinkwrap resolutions when it has less packages', t => {
  const mergedShrinkwrap = mergeShrinkwraps({
    base: simpleShr,
    theirs: {
      ...simpleShr,
      packages: {
        '/foo/1.0.0': {
          dependencies: {
            bar: '1.0.0',
          },
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
        '/bar/1.0.0': {
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
      },
    },
    ours: {
      ...simpleShr,
      packages: {
        '/foo/1.0.0': {
          dependencies: {
            bar: '1.1.0',
          },
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
        '/bar/1.1.0': {
          dependencies: {
            qar: '1.0.0',
          },
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
        '/qar/1.0.0': {
          resolution: {
            integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
          },
        },
      },
    },
  })

  t.deepEqual(mergedShrinkwrap, {
    ...simpleShr,
    packages: {
      '/foo/1.0.0': {
        dev: false,
        dependencies: {
          bar: '1.0.0',
        },
        resolution: {
          integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
        },
      },
      '/bar/1.0.0': {
        dev: false,
        resolution: {
          integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
        },
      },
    },
  })

  t.end()
})
