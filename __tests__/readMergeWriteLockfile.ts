import { readWantedLockfile } from '@pnpm/lockfile-file'
import readMergeWriteLockfiles from '../src/readMergeWriteLockfiles'
import path = require('path')
import tempy = require('tempy')
import writeJsonFile = require('write-json-file')

jest.setTimeout(20000)

test('merging dependencies that are resolving peers', async () => {
  const fixtureDir = path.join(__dirname, 'fixtures/peers')
  const outputDir = tempy.directory()
  await writeJsonFile(path.join(outputDir, 'package.json'), {
    dependencies: {
      jest: '26.6.0',
      'ts-jest': '^26.4.3',
      typescript: '4.0.3',
    },
  })
  await readMergeWriteLockfiles({
    baseLockfileDir: path.join(fixtureDir, 'base'),
    oursLockfileDir: path.join(fixtureDir, 'ours'),
    theirsLockfileDir: path.join(fixtureDir, 'theirs'),
    outputDir,
  })
  expect(await readWantedLockfile(outputDir, { ignoreIncompatible: false })).toMatchSnapshot()
})
