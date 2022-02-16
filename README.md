# @pnpm/merge-driver

> A merge driver for pnpm-lock.yaml

<!--@shields('npm', 'travis')-->
[![npm version](https://img.shields.io/npm/v/@pnpm/merge-driver.svg)](https://www.npmjs.com/package/@pnpm/merge-driver) [![Build Status](https://img.shields.io/travis/pnpm/merge-driver/master.svg)](https://travis-ci.org/pnpm/merge-driver)
<!--/@-->

## Installation

Globally ( recommended )

```sh
pnpm add -g @pnpm/merge-driver
```

Locally in a repository ( this will not help you if you need to do a rebase/merge right now ! )

```sh
pnpm add -D @pnpm/merge-driver
```

## Usage

To configure it on a repo, run:

```sh
pnpm add -g @pnpm/merge-driver
pnpx npm-merge-driver install --driver-name pnpm-merge-driver --driver "pnpm-merge-driver %A %O %B %P" --files pnpm-lock.yaml
```

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io/)
