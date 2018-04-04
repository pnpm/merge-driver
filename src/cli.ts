#!/usr/bin/env node
// import mergeShrinkwrapFiles from '.'

// console.log('MERGING shrinkwrap.yaml')

// mergeShrinkwrapFiles({
//   oursFileName: process.argv[2],
//   baseFileName: process.argv[3],
//   theirsFileName: process.argv[4],
// })

// import loadYamlFile from 'load-yaml-file'
// import {Shrinkwrap} from 'pnpm-shrinkwrap'
// import R = require('ramda')

// export default (
//   opts: {
//     oursFileName: string,
//     baseFileName: string,
//     theirsFileName: string,
//   },
// ) => {
//   const oursShrinkwrap = loadYamlFile.sync(opts.oursFileName)
//   const theirsShrinkwrap = loadYamlFile.sync(opts.theirsFileName)
//   const newOursShrinkwrap = mergeShrinkwrap(oursShrinkwrap, theirsShrinkwrap)
//   writeYamlFile.sync(opts.oursFileName, newOursShrinkwrap)
// }
