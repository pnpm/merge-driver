#!/usr/bin/env node
import pnpmExec from '@pnpm/exec'
import { readWantedLockfile, writeWantedLockfile } from '@pnpm/lockfile-file'
import path = require('path')
import mergeLockfile from '.'

(async () => {
  const mergedLockfile = mergeLockfile({
    base: (await readWantedLockfile(path.dirname(process.argv[3]), { ignoreIncompatible: true }))!,
    ours: (await readWantedLockfile(path.dirname(process.argv[2]), { ignoreIncompatible: true }))!,
    theirs: (await readWantedLockfile(path.dirname(process.argv[4]), { ignoreIncompatible: true }))!,
  })

  await writeWantedLockfile(process.cwd(), mergedLockfile)
  await pnpmExec(['install', '--lockfile-only', '--config.depth=Infinity', '--ignore-scripts'])
})()
