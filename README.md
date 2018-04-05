# @pnpm/merge-driver

> A merge driver for shrinkwrap.yaml

<!--@shields('npm', 'travis')-->
[![npm version](https://img.shields.io/npm/v/@pnpm/merge-driver.svg)](https://www.npmjs.com/package/@pnpm/merge-driver) [![Build Status](https://img.shields.io/travis/pnpm/merge-driver/master.svg)](https://travis-ci.org/pnpm/merge-driver)
<!--/@-->

## Installation

```sh
npm i -S @pnpm/merge-driver
```

## Usage

To configure it on a repo, run:

```sh
pnpm i -g @pnpm/merge-driver
pnpx npm-merge-driver install --driver-name pnpm-merge-driver --driver "pnpm-merge-driver %A %O %B %P" --files shrinkwrap.yaml
```

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io/)
