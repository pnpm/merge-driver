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

test('fails when specifiers differ', () => {
  expect(() => {
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
  }).toThrowError(/Cannot resolve 'specifiers.foo'/)
})

test('fails when dependencies differ', () => {
  expect(() => {
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
  }).toThrowError(/Cannot resolve 'dependencies.foo'/)
})

test('prefers our lockfile resolutions when it has less packages', () => {
  const mergedLockfile = mergeLockfile({
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

  expect(mergedLockfile).toStrictEqual({
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
})

test('prefers our lockfile resolutions when it has less packages', () => {
  const mergedLockfile = mergeLockfile({
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

  expect(mergedLockfile).toStrictEqual({
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
})
