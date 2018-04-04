// import path = require('path')
// import findUp = require('find-up')
// import git = require('graceful-git')
// import normalize = require('normalize-path')

// const repoPath = path.dirname(findUp.sync('.git'))

// process.chdir(repoPath)

// const driver = `node ./${normalize(path.relative(repoPath, path.join(__dirname, 'lib', 'cli.js')))} %A %O %B`

// console.log(`...adding integity file merge driver to git config at ${path.join(repoPath, '.git', 'config')}`)

// git(['config', '--local', 'merge.pnpm-merge-driver.name', 'pnpm-merge-driver'])
//     .then(() => git(['config', '--local', 'merge.pnpm-merge-driver.driver', driver]))
//     .then(() => console.log('.git/config successfully updated'))
//     .catch(err => {
//         console.error(err)
//         process.exit(1)
//     })
