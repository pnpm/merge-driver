import test = require('tape')
import mergeLockfile from '@pnpm/merge-driver'

const simpleLockfile = {
  importers: {
    '.': {
      dependencies: {
        foo: '1.0.0',
      },
      specifiers: {
        foo: '1.0.0',
      },
    },
  },
  lockfileVersion: 5.2,
  packages: {
    '/foo/1.0.0': {
      resolution: {
        integrity: 'sha512-aBVzCAzfyApU0gg36QgCpJixGtYwuQ4djrn11J+DTB5vE4OmBPuZiulgTCA9ByULgVAyNV2CTpjjvZmxzukSLw==',
      },
    },
  },
}

test('fails when specifiers differ', t => {
  t.throws(() => {
    mergeLockfile({
      base: simpleLockfile,
      ours: {
        ...simpleLockfile,
        importers: {
          '.': {
            ...simpleLockfile.importers['.'],
            specifiers: { foo: '^1.0.0' },
          },
        },
      },
      theirs: {
        ...simpleLockfile,
        importers: {
          '.': {
            ...simpleLockfile.importers['.'],
            specifiers: { foo: '^1.1.0' },
          },
        },
      },
    })
  }, /Cannot resolve 'specifiers.foo'/, 'Cannot merge specifiers field')
  t.end()
})

test('fails when dependencies differ', t => {
  t.throws(() => {
    mergeLockfile({
      base: simpleLockfile,
      ours: {
        ...simpleLockfile,
        importers: {
          '.': {
            ...simpleLockfile.importers['.'],
            dependencies: { foo: '^1.0.0' },
          },
        },
      },
      theirs: {
        ...simpleLockfile,
        importers: {
          '.': {
            ...simpleLockfile.importers['.'],
            dependencies: { foo: '^1.1.0' },
          },
        },
      },
    })
  }, /Cannot resolve 'dependencies.foo'/, 'Cannot merge dependencies field')
  t.end()
})

test('prefers our shrinkwrap resolutions when it has less packages', t => {
  const mergedShrinkwrap = mergeLockfile({
    base: simpleLockfile,
    ours: {
      ...simpleLockfile,
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
      ...simpleLockfile,
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
    ...simpleLockfile,
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
  const mergedShrinkwrap = mergeLockfile({
    base: simpleLockfile,
    theirs: {
      ...simpleLockfile,
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
      ...simpleLockfile,
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
    ...simpleLockfile,
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
