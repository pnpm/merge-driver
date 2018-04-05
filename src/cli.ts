#!/usr/bin/env node
import loadYamlFile = require('load-yaml-file')
import {writeWantedOnly} from 'pnpm-shrinkwrap'
import mergeShrinkwrap from '.'

const mergedShrinkwrap = mergeShrinkwrap({
  base: loadYamlFile.sync(process.argv[3]),
  ours: loadYamlFile.sync(process.argv[2]),
  theirs: loadYamlFile.sync(process.argv[4]),
})

writeWantedOnly(process.cwd(), mergedShrinkwrap)
  .catch((err: Error) => console.error(err))
