import pnpmExec from '@pnpm/exec'
import { readWantedLockfile, writeWantedLockfile } from '@pnpm/lockfile-file'
import mergeLockfile from '.'

export default async function (
  opts: {
    baseLockfileDir: string,
    oursLockfileDir: string,
    theirsLockfileDir: string,
    outputDir: string,
  }
) {
  const mergedLockfile = mergeLockfile({
    base: (await readWantedLockfile(opts.baseLockfileDir, { ignoreIncompatible: true }))!,
    ours: (await readWantedLockfile(opts.oursLockfileDir, { ignoreIncompatible: true }))!,
    theirs: (await readWantedLockfile(opts.theirsLockfileDir, { ignoreIncompatible: true }))!,
  })

  await writeWantedLockfile(opts.outputDir, mergedLockfile)
  await pnpmExec([
    'install',
    '--lockfile-only',
    '--no-frozen-lockfile',
    '--force', // this will force a full resolution
    '--ignore-scripts',
  ], {
      cwd: opts.outputDir,
  })
}
