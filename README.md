<div align="center">
  <h1>
  Scilla JSON Utils
  </h1>
  <strong>
  Simplifies the way you construct the Scilla JSON data
  </strong>
</div>
<hr/>
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
  <a href="LICENSE" target="_blank">
  <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" />
  </a>
</div>

## Installation

```sh
npm i @zilliqa-js/scilla-json-utils
# or
yarn add @zilliqa-js/scilla-json-utils
```

## Usage

### I. `getJSONValue(type: string, value: any)`

#### Integers (`UintX` / `IntX`)

```js
getJSONValue("Uint256", "1");
// Output: "1"
```

```js
getJSONValue("Int256", "-1");
// Output: "-1"
```

```js
getJSONValue("Uint256", 1);
// Output: "1"
```

```js
getJSONValue("Int256", -1);
// Output: "-1"
```

#### Strings (`String`)

```js
getJSONValue("String", "Foo");
// Output: "Foo"
```

#### Byte Strings (`ByStrX`)

```js
getJSONValue("ByStr20", "0x85E0bef5F9a11821f9B2BA778a05963436B5e720");
// Output: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720"
// Note that the output is lowercased.
```

#### Block Numbers (`BNum`)

```js
getJSONValue("BNum", "1");
// Output: "1"
```

```js
getJSONValue("BNum", 1);
// Output: "1"
```

#### Boolean (`Bool`)

```js
getJSONValue("Bool", false);
```

Output:

```json
{
  "argtypes": [],
  "arguments": [],
  "constructor": "False"
}
```

#### Option (`Option`)

##### None

```js
getJSONValue("Option (ByStr20)", undefined);
```

Output:

```json
{
  "argtypes": ["ByStr20"],
  "arguments": [],
  "constructor": "None"
}
```

##### Some

```js
getJSONValue("Option (ByStr20)", "0x0000000000000000000000000000000000000000");
```

Output:

```json
{
  "argtypes": ["ByStr20"],
  "arguments": ["0x0000000000000000000000000000000000000000"],
  "constructor": "Some"
}
```

#### Pair (`Pair`)

```js
getJSONValue("Pair (ByStr20) (Uint256)", [
  "0x0000000000000000000000000000000000000000",
  1,
]);
```

Output:

```json
{
  "argtypes": ["ByStr20", "Uint256"],
  "arguments": ["0x0000000000000000000000000000000000000000", "1"],
  "constructor": "Pair"
}
```

#### List (`List`)

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

#### User-defined ADTs

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

### II. `getJSONParams({[vname: string]: [type: string, value: any]})`

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
  y: [
    "List (Pair (ByStr20) (String))",
    [
      ["0x85E0bef5F9a11821f9B2BA778a05963436B5e720", "Foo"],
      ["0x85E0bef5F9a11821f9B2BA778a05963436B5e720", "Bar"],
    ],
  ],
  z: ["Uint256", 1],
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
  },
  {
    "type": "List (Pair (ByStr20) (String))",
    "value": [
      {
        "argtypes": ["ByStr20", "String"],
        "arguments": ["0x85e0bef5f9a11821f9b2ba778a05963436b5e720", "Foo"],
        "constructor": "Pair"
      },
      {
        "argtypes": ["ByStr20", "String"],
        "arguments": ["0x85e0bef5f9a11821f9b2ba778a05963436b5e720", "Bar"],
        "constructor": "Pair"
      }
    ],
    "vname": "y"
  },
  {
    "type": "Uint256",
    "value": "1",
    "vname": "z"
  }
]
```

[More cases](src/index.test.ts)

## License

This project is open source software licensed as [GPL-3.0](./LICENSE).
