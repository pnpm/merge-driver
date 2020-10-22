import { pruneSharedLockfile, Lockfile } from '@pnpm/prune-lockfile'
import R = require('ramda')

export default function mergeLockfile (
  opts: {
    base: Lockfile
    ours: Lockfile
    theirs: Lockfile
  },
) {
  const newLockfile: Lockfile = {
    importers: {},
    lockfileVersion: Math.max(opts.base.lockfileVersion, opts.ours.lockfileVersion),
  }

  for (const importerId of Array.from(new Set([...Object.keys(opts.ours.importers), ...Object.keys(opts.theirs.importers)]))) {
    newLockfile.importers[importerId] = {
      specifiers: {},
    }
    for (const key of ['specifiers', 'dependencies', 'devDependencies', 'optionalDependencies']) {
      newLockfile.importers[importerId][key] = mergeDict(
        opts.ours.importers[importerId]?.[key] ?? {},
        opts.base.importers[importerId]?.[key] ?? {},
        opts.theirs.importers[importerId]?.[key] ?? {},
        key
      )
    }
  }

  if (R.keys(opts.ours.packages).length >= R.keys(opts.theirs.packages).length) {
    newLockfile.packages = {
      ...opts.ours.packages,
      ...opts.theirs.packages,
    }
  } else {
    newLockfile.packages = {
      ...opts.theirs.packages,
      ...opts.ours.packages,
    }
  }

  return pruneSharedLockfile(newLockfile)
}

interface Dict {[key: string]: string}

function mergeDict (ourDict: Dict, baseDict: Dict, theirDict: Dict, fieldName: string) {
  const newDict = {}
  for (const key of R.keys(ourDict).concat(R.keys(theirDict))) {
    const changedValue = takeChangedValue(
      ourDict[key],
      baseDict[key],
      theirDict[key],
      `${fieldName}.${key}`,
    )
    if (changedValue) {
      newDict[key] = changedValue
    }
  }
  return newDict
}

function takeChangedValue<T> (ourValue: T, baseValue: T, theirValue: T, fieldName: string): T {
  if (ourValue === theirValue) return ourValue
  if (baseValue === ourValue) return theirValue
  if (baseValue === theirValue) return ourValue
  throw new Error(`Cannot resolve '${fieldName}'. Base value: ${baseValue}. Our: ${ourValue}. Their: ${theirValue}`)
}
