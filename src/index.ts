import {
  prune,
  ResolvedDependencies,
  Shrinkwrap,
} from 'pnpm-shrinkwrap'
import R = require('ramda')

export default function mergeShrinkwrap (
  opts: {
    base: Shrinkwrap,
    ours: Shrinkwrap,
    theirs: Shrinkwrap,
  },
) {
  const newShr = {
    specifiers: {},
  } as Shrinkwrap

  newShr.registry = takeChangedValue(opts.ours.registry, opts.base.registry, opts.theirs.registry, 'registry')

  for (const key of ['specifiers', 'dependencies', 'devDependencies', 'optionalDependencies']) {
    newShr[key] = mergeDict(opts.ours[key], opts.base[key], opts.theirs[key], key)
  }

  if (R.keys(opts.ours.packages).length >= R.keys(opts.theirs.packages).length) {
    newShr.packages = {
      ...opts.ours.packages,
      ...opts.theirs.packages,
    }
  } else {
    newShr.packages = {
      ...opts.theirs.packages,
      ...opts.ours.packages,
    }
  }

  return prune(newShr)
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
