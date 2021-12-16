<div>
    <a href="https://www.npmjs.com/package/@zilliqa-js/scilla-json-utils" target="_blank">
    <img src="https://img.shields.io/npm/v/@zilliqa-js/scilla-json-utils" />
    </a>
    <a href="https://app.travis-ci.com/Zilliqa/scilla-json-utils" target="_blank">
    <img src="https://app.travis-ci.com/Zilliqa/scilla-json-utils.svg?token=6BrmjBEqdaGp73khUJCz&branch=main" />
    </a>
    <a href="https://codecov.io/gh/Zilliqa/scilla-json-utils" target="_blank">
    <img src="https://codecov.io/gh/Zilliqa/scilla-json-utils/branch/main/graph/badge.svg?token=YlzpRvkgub" />
    </a>
    <a href="https://github.com/zilliqa/dev-wallet/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" />
    </a>
</div>

# scilla-json-utils

This library simplifies the way you construct the [Scilla](https://scilla.readthedocs.io/en/latest) JSON data.

## Installation

```sh
npm i @zilliqa-js/scilla-json-utils
# or
yarn add @zilliqa-js/scilla-json-utils
```

## Usage

### I. `getJSONValue(type: string, value: any)`

#### Case 1

```js
getJSONValue("ByStr20", "0x85E0bef5F9a11821f9B2BA778a05963436B5e720");
```

Output: `"0x85e0bef5f9a11821f9b2ba778a05963436b5e720"`

#### Case 2

```js
getJSONValue("List (Pair (ByStr20) (Uint256))", [
  ["0x85E0bef5F9a11821f9B2BA778a05963436B5e720", 1],
  ["0x85E0bef5F9a11821f9B2BA778a05963436B5e720", 2],
]);
```

Output:

```json
[
  {
    "argtypes": ["ByStr20", "Uint256"],
    "arguments": ["0x85e0bef5f9a11821f9b2ba778a05963436b5e720", "1"],
    "constructor": "Pair"
  },
  {
    "argtypes": ["ByStr20", "Uint256"],
    "arguments": ["0x85e0bef5f9a11821f9b2ba778a05963436b5e720", "2"],
    "constructor": "Pair"
  }
]
```

#### Case 3

```ocaml
type Foo =
| Bar of ByStr20 BNum
| Baz of ByStr20
```

```js
getJSONValue(
  "0x85E0bef5F9a11821f9B2BA778a05963436B5e720.Foo.Bar.of.ByStr20.BNum",
  ["0x0000000000000000000000000000000000000000", 1]
);
```

Output:

```json
{
  "argtypes": [],
  "arguments": ["0x0000000000000000000000000000000000000000", "1"],
  "constructor": "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Bar"
}
```

[More cases](src/index.test.ts)

### II. `getJSONParams({[vname: string]: [type: string, value: any]})`

#### Case 1

```js
getJSONParams({
  x: ["ByStr20", "0x0000000000000000000000000000000000000000"],
  y: ["Uint256", 1],
});
```

Output:

```json
[
  {
    "type": "ByStr20",
    "value": "0x0000000000000000000000000000000000000000",
    "vname": "x"
  },
  {
    "type": "Uint256",
    "value": "1",
    "vname": "y"
  }
]
```

#### Case 2

```js
getJSONParams({
  to_token_uri_pair_list: [
    "List (Pair (ByStr20) (String))",
    [
      [
        "0x85E0bef5F9a11821f9B2BA778a05963436B5e720",
        "https://ipfs.zilliqa.com/ipfs/Zme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pY0000ZIL0",
      ],
      [
        "0x85E0bef5F9a11821f9B2BA778a05963436B5e720",
        "https://ipfs.zilliqa.com/ipfs/Zme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pY0000ZIL1",
      ],
    ],
  ],
});
```

Output:

```json
[
  {
    "type": "List (Pair (ByStr20) (String))",
    "value": [
      {
        "argtypes": ["ByStr20", "String"],
        "arguments": [
          "0x85e0bef5f9a11821f9b2ba778a05963436b5e720",
          "https://ipfs.zilliqa.com/ipfs/Zme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pY0000ZIL0"
        ],
        "constructor": "Pair"
      },
      {
        "argtypes": ["ByStr20", "String"],
        "arguments": [
          "0x85e0bef5f9a11821f9b2ba778a05963436b5e720",
          "https://ipfs.zilliqa.com/ipfs/Zme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pY0000ZIL1"
        ],
        "constructor": "Pair"
      }
    ],
    "vname": "to_token_uri_pair_list"
  }
]
```

#### Case 3.

```ocaml
type Foo =
| Bar of ByStr20 BNum
| Baz of ByStr20
```

```js
getJSONParams({
  x: [
    "0x85E0bef5F9a11821f9B2BA778a05963436B5e720.Foo.Bar.of.ByStr20.BNum",
    ["0x0000000000000000000000000000000000000000", 1],
  ],
});
```

Output:

```json
[
  {
    "type": "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Foo",
    "value": {
      "argtypes": [],
      "arguments": ["0x0000000000000000000000000000000000000000", "1"],
      "constructor": "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Bar"
    },
    "vname": "x"
  }
]
```

[More cases](src/index.test.ts)

## License

This project is open source software licensed as [GPL-3.0](./LICENSE).
