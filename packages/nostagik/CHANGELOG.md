# Changelog

## [1.0.0](https://github.com/fillmember/nostagik/compare/core-v0.2.0...core-v1.0.0) (2024-06-14)


### ⚠ BREAKING CHANGES

* **core:** change nostagik config shape

### Features

* **core:** change nostagik config shape ([50f8268](https://github.com/fillmember/nostagik/commit/50f8268ce7a5fc886a830eb16485a77eb83779df))
* **core:** possible to set config props to null ([a48f06c](https://github.com/fillmember/nostagik/commit/a48f06cea0588e2a0676359be80b7795c0859793))
* improve styling ([f35587f](https://github.com/fillmember/nostagik/commit/f35587f59e97464938dfb6cd85648f042e24f86e))


### Bug Fixes

* **core:** only expose richTextToString from utils file ([b3c602a](https://github.com/fillmember/nostagik/commit/b3c602a327e7175da3f6c7bb241fadc05c9cd78b))

## [0.2.0](https://github.com/fillmember/nostagik/compare/core-v0.1.0...core-v0.2.0) (2024-06-13)


### Features

* add table of content block ([0ce70ba](https://github.com/fillmember/nostagik/commit/0ce70ba9f2c53f770e17cbe42ab91263afe31029))
* getAllPages only returns array of page objects ([31582a8](https://github.com/fillmember/nostagik/commit/31582a8c26f58a57de9a39ffca2c644da3ede0e7))
* pass custom renderers ([8dd407c](https://github.com/fillmember/nostagik/commit/8dd407c5b843f32a85aa416eb7f2b744650b53f5))
* responsive column_list ([c9e10f3](https://github.com/fillmember/nostagik/commit/c9e10f3f9e060f4cac7c2cdc48a06ae8402f52ca))

## [0.1.0](https://github.com/fillmember/nostagik/compare/core-v0.0.4...core-v0.1.0) (2024-06-12)


### Features

* add default page renderer ([0853d17](https://github.com/fillmember/nostagik/commit/0853d1733cbaeb3ddca280d8b2a370a761517ebb))
* improve code block style ([8315a94](https://github.com/fillmember/nostagik/commit/8315a9436b48adf5cb00dcec95726932cfba34c5))
* syntax highlighting via sugar-high ([8ed7d13](https://github.com/fillmember/nostagik/commit/8ed7d1303408967f6abb99c2a0f30fb1f5f83703))


### Bug Fixes

* **core:** correct dependencies and update tests ([05578d4](https://github.com/fillmember/nostagik/commit/05578d4913a728b6c4fc790045c24252a0879b67))
* **core:** hash url to ensure unique stored image filename ([3fab097](https://github.com/fillmember/nostagik/commit/3fab09758232d1eb3ad2c4d45f957cb38f35259a))

## [0.0.4](https://github.com/fillmember/nostagik/compare/core-v0.0.3...core-v0.0.4) (2024-06-12)


### Bug Fixes

* more robust getAllPages method ([#4](https://github.com/fillmember/nostagik/issues/4)) ([c31ca6d](https://github.com/fillmember/nostagik/commit/c31ca6d4e75670b2164e51dcd1e6f11aad2810bb))

## [0.0.3](https://github.com/fillmember/nostagik/compare/core-v0.0.3...core-v0.0.3) (2024-06-12)


### Bug Fixes

* more robust getAllPages method ([#4](https://github.com/fillmember/nostagik/issues/4)) ([c31ca6d](https://github.com/fillmember/nostagik/commit/c31ca6d4e75670b2164e51dcd1e6f11aad2810bb))

## [0.0.3](https://github.com/fillmember/nostagik/compare/core-v0.0.2...core-v0.0.3) (2024-06-11)


### Features

* **core:** add tailwind-preset.ts ([9727c54](https://github.com/fillmember/nostagik/commit/9727c54e33c35b7da1d306d39026a26a8d03b1bb))


### Bug Fixes

* **config:** minor style change to column block ([a38f539](https://github.com/fillmember/nostagik/commit/a38f539c1d692e9c288641eae155c4a01f745f47))
* **core:** limit child_page__icon size ([b78bda8](https://github.com/fillmember/nostagik/commit/b78bda8497be48a44f9fab9d91abac62d81df1e4))

## 0.0.2 (2024-06-11)


### Features

* (partial) implement render config ([a856dc0](https://github.com/fillmember/nostagik/commit/a856dc0f20f6e9262445fb407ed77cc54d9259ac))
* add id attribute to headings ([da761d8](https://github.com/fillmember/nostagik/commit/da761d857e68ce136a5d881937ef6f5a7ef72fdc))
* configurable getNotionPage and better bookmark block rendering ([ded9740](https://github.com/fillmember/nostagik/commit/ded9740c4888004cd12bfa18489f62e08cbd2b98))
* improve child_page block ([6b7e86d](https://github.com/fillmember/nostagik/commit/6b7e86df6b950bc55ef728fea8b6298453bf580e))
* improve default styles and createRenderConfig ([20b35fc](https://github.com/fillmember/nostagik/commit/20b35fcc716e763a34586f708a2798bc6c774b38))
* read classes from render config ([7d55132](https://github.com/fillmember/nostagik/commit/7d55132839485ce7e96c530926ffecc0271504c1))
* retouch to styling ([c308fdf](https://github.com/fillmember/nostagik/commit/c308fdf399833342379e62b6d3396f12095bdae7))
* separate packages into core and react ([b8902fe](https://github.com/fillmember/nostagik/commit/b8902fee1c1ed3c183e4f55c928e8d17f740d9b3))


### Bug Fixes

* **core:** bug in usage of merge() ([1355c90](https://github.com/fillmember/nostagik/commit/1355c90b26c81847364a46259852f02e561507f6))
* **core:** correct dist packageRoot ([aa7be14](https://github.com/fillmember/nostagik/commit/aa7be14a583fbf2933d1d5439232dd797999d309))
* **core:** default notionAnnotationsClasses config ([46d138e](https://github.com/fillmember/nostagik/commit/46d138e3337df7f0aef53b9557ac933fabcd0663))
* **core:** update config test ([b186a0b](https://github.com/fillmember/nostagik/commit/b186a0b0889a154e6653fd44004c04a4e60d5d92))
* correct dependencies of the packages ([78f41ce](https://github.com/fillmember/nostagik/commit/78f41ced4f6a6451a32e4b6eab216ec7266f648b))
* use option.paths.data in listStoredPages ([d20796b](https://github.com/fillmember/nostagik/commit/d20796b07ca1d2bf98d09debb08e3a9ec565cf0a))


### Reverts

* remove usage of server-only ([5ff8136](https://github.com/fillmember/nostagik/commit/5ff8136ba66ef4773402d0f4bc7c5dff3f640a4e))
