#!/usr/bin/env node
import { readWantedLockfile, writeWantedLockfile } from '@pnpm/lockfile-file'
import mergeLockfile from '.'

(async () => {
  const mergedLockfile = mergeLockfile({
    base: (await readWantedLockfile(process.argv[3], { ignoreIncompatible: true }))!,
    ours: (await readWantedLockfile(process.argv[2], { ignoreIncompatible: true }))!,
    theirs: (await readWantedLockfile(process.argv[4], { ignoreIncompatible: true }))!,
  })

  await writeWantedLockfile(process.cwd(), mergedLockfile)
})()
