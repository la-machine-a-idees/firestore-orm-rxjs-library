# firestore-orm-rxjs-library

> Template to kickstart creating a Node.js module using TypeScript and VSCode

Inspired by [node-module-boilerplate](https://github.com/sindresorhus/node-module-boilerplate)

## Features

- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Issue Templates](https://github.com/ryansonshine/firestore-orm-rxjs-library/tree/main/.github/ISSUE_TEMPLATE)
- [GitHub Actions](https://github.com/ryansonshine/firestore-orm-rxjs-library/tree/main/.github/workflows)
- [Codecov](https://about.codecov.io/)
- [VSCode Launch Configurations](https://github.com/ryansonshine/firestore-orm-rxjs-library/blob/main/.vscode/launch.json)
- [TypeScript](https://www.typescriptlang.org/)
- [Husky](https://github.com/typicode/husky)
- [Lint Staged](https://github.com/okonet/lint-staged)
- [Commitizen](https://github.com/search?q=commitizen)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Getting started

### Set up your repository

**Click the "Use this template" button.**

Alternatively, create a new directory and then run:

```bash
curl -fsSL https://github.com/ryansonshine/firestore-orm-rxjs-library/archive/main.tar.gz | tar -xz --strip-components=1
```

Replace `FULL_NAME`, `GITHUB_USER`, and `REPO_NAME` in the script below with your own details to personalize your new package:

```bash
FULL_NAME="John Smith"
GITHUB_USER="johnsmith"
REPO_NAME="my-cool-package"
sed -i.mybak "s/\([\/\"]\)(ryansonshine)/$GITHUB_USER/g; s/firestore-orm-rxjs-library\|firestore-orm-rxjs-library/$REPO_NAME/g; s/La Machine à Idées/$FULL_NAME/g" package.json package-lock.json README.md
rm *.mybak
```

### Add NPM Token

Add your npm token to your GitHub repository secrets as `NPM_TOKEN`.

### Add Codecov integration

Enable the Codecov GitHub App [here](https://github.com/apps/codecov).

**Remove everything from here and above**

---

# firestore-orm-rxjs-library

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> My awesome module

## Install

```bash
npm install firestore-orm-rxjs-library
```

## Usage

```ts
import { myPackage } from 'firestore-orm-rxjs-library';

myPackage('hello');
//=> 'hello from my package'
```

## API

### myPackage(input, options?)

#### input

Type: `string`

Lorem ipsum.

#### options

Type: `object`

##### postfix

Type: `string`
Default: `rainbows`

Lorem ipsum.

[build-img]:https://github.com/ryansonshine/firestore-orm-rxjs-library/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/firestore-orm-rxjs-library/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/firestore-orm-rxjs-library
[downloads-url]:https://www.npmtrends.com/firestore-orm-rxjs-library
[npm-img]:https://img.shields.io/npm/v/firestore-orm-rxjs-library
[npm-url]:https://www.npmjs.com/package/firestore-orm-rxjs-library
[issues-img]:https://img.shields.io/github/issues/ryansonshine/firestore-orm-rxjs-library
[issues-url]:https://github.com/ryansonshine/firestore-orm-rxjs-library/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/firestore-orm-rxjs-library/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/firestore-orm-rxjs-library
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
