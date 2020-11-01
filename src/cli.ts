#!/usr/bin/env node
import readMergeWriteLockfile from './readMergeWriteLockfiles'
import path = require('path')

(async () => {
  try {
    await readMergeWriteLockfile({
      baseLockfileDir: path.dirname(process.argv[3]),
      oursLockfileDir: path.dirname(process.argv[2]),
      theirsLockfileDir: path.dirname(process.argv[4]),
      outputDir: process.cwd(),
    })
  } catch (err) {
    console.log('Automatic merge of lockfile failed')
    console.log(err)
    process.exit(1)
  }
})()