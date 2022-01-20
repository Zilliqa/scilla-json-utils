/*
 * Copyright (C) 2021 Zilliqa
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { scillaJSONVal, scillaJSONParams, extractTypes } from ".";

describe("scillaJSONVal", () => {
  const testCases = [
    {
      type: "0x85E0bef5F9a11821f9B2BA778a05963436B5e720.Foo.Bar",
      value: [],
      want: {
        argtypes: [],
        arguments: [],
        constructor: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Bar",
      },
    },
    {
      type: "0x85E0bef5F9a11821f9B2BA778a05963436B5e720.Foo.Bar.of.ByStr20.BNum",
      value: ["0x0000000000000000000000000000000000000000", 1],
      want: {
        argtypes: [],
        arguments: ["0x0000000000000000000000000000000000000000", "1"],
        constructor: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Bar",
      },
    },
    {
      type: "0x85E0bef5F9a11821f9B2BA778a05963436B5e720.Foo.Foo.of.Uint32",
      value: [1],
      want: {
        argtypes: [],
        arguments: ["1"],
        constructor: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Foo",
      },
    },
    {
      type: "Uint256",
      value: "1",
      want: "1",
    },
    {
      type: "Int256",
      value: "-1",
      want: "-1",
    },
    {
      type: "Uint256",
      value: 1,
      want: "1",
    },
    {
      type: "Int256",
      value: -1,
      want: "-1",
    },
    {
      type: "String",
      value: "Test",
      want: "Test",
    },
    {
      type: "ByStr20",
      value: "0x0000000000000000000000000000000000000ABC",
      want: "0x0000000000000000000000000000000000000abc",
    },
    {
      type: "BNum",
      value: "1",
      want: "1",
    },
    {
      type: "BNum",
      value: 1,
      want: "1",
    },
    {
      type: "Bool",
      value: false,
      want: { argtypes: [], arguments: [], constructor: "False" },
    },
    {
      type: "Bool",
      value: true,
      want: { argtypes: [], arguments: [], constructor: "True" },
    },
    {
      type: "Option (ByStr20)",
      value: undefined,
      want: { argtypes: ["ByStr20"], arguments: [], constructor: "None" },
    },
    {
      type: "Option (ByStr20)",
      value: "0x0000000000000000000000000000000000000000",
      want: {
        argtypes: ["ByStr20"],
        arguments: ["0x0000000000000000000000000000000000000000"],
        constructor: "Some",
      },
    },
    {
      type: "List (ByStr20)",
      value: [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000001",
      ],
      want: [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000001",
      ],
    },
    {
      type: "List (Pair (ByStr20) (Uint256))",
      value: [
        ["0x0000000000000000000000000000000000000000", 1],
        ["0x0000000000000000000000000000000000000001", 2],
      ],
      want: [
        {
          argtypes: ["ByStr20", "Uint256"],
          arguments: ["0x0000000000000000000000000000000000000000", "1"],
          constructor: "Pair",
        },
        {
          argtypes: ["ByStr20", "Uint256"],
          arguments: ["0x0000000000000000000000000000000000000001", "2"],
          constructor: "Pair",
        },
      ],
    },
    {
      type: "Pair (ByStr20) (Uint256)",
      value: ["0x0000000000000000000000000000000000000000", 1],
      want: {
        argtypes: ["ByStr20", "Uint256"],
        arguments: ["0x0000000000000000000000000000000000000000", "1"],
        constructor: "Pair",
      },
    },
    {
      type: "Pair (List (ByStr20)) (Uint256)",
      value: [
        [
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000001",
        ],
        1,
      ],
      want: {
        argtypes: ["List (ByStr20)", "Uint256"],
        arguments: [
          [
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000001",
          ],
          "1",
        ],
        constructor: "Pair",
      },
    },
    {
      type: "undefined",
      value: undefined,
      want: undefined,
    },
  ];

  for (const testCase of testCases) {
    const { value, type, want } = testCase;
    it(type, () => {
      const res = scillaJSONVal(type, value);
      expect(JSON.stringify(res)).toBe(JSON.stringify(want));
    });
  }
});

describe("scillaJSONParams", () => {
  const testCases = [
    // 0xf59c79db958bafdf9d81df29d50edcc14911d40c.Foo.Bar.of.ByStr20.BNum
    {
      param: {
        x: [
          "0x85E0bef5F9a11821f9B2BA778a05963436B5e720.Foo.Bar.of.ByStr20.BNum",
          ["0x0000000000000000000000000000000000000000", 1],
        ],
      },
      want: [
        {
          type: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Foo",
          value: {
            argtypes: [],
            arguments: ["0x0000000000000000000000000000000000000000", "1"],
            constructor: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Bar",
          },
          vname: "x",
        },
      ],
    },
    {
      param: {},
      want: [],
    },
    {
      param: {
        x: ["ByStr20", "0x0000000000000000000000000000000000000000"],
        y: ["Uint256", 1],
      },
      want: [
        {
          type: "ByStr20",
          value: "0x0000000000000000000000000000000000000000",
          vname: "x",
        },
        {
          type: "Uint256",
          value: "1",
          vname: "y",
        },
      ],
    },
    {
      param: {
        to_token_uri_pair_list: [
          "List (Pair (ByStr20) (String))",
          [
            ["0x0000000000000000000000000000000000000000", ""],
            ["0x0000000000000000000000000000000000000000", ""],
          ],
        ],
      },
      want: [
        {
          type: "List (Pair (ByStr20) (String))",
          value: [
            {
              argtypes: ["ByStr20", "String"],
              arguments: ["0x0000000000000000000000000000000000000000", ""],
              constructor: "Pair",
            },
            {
              argtypes: ["ByStr20", "String"],
              arguments: ["0x0000000000000000000000000000000000000000", ""],
              constructor: "Pair",
            },
          ],
          vname: "to_token_uri_pair_list",
        },
      ],
    },
    {
      param: {
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
      },
      want: [
        {
          type: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Foo",
          value: {
            argtypes: [],
            arguments: ["0x0000000000000000000000000000000000000000", "1"],
            constructor: "0x85e0bef5f9a11821f9b2ba778a05963436b5e720.Bar",
          },
          vname: "x",
        },
        {
          type: "List (Pair (ByStr20) (String))",
          value: [
            {
              argtypes: ["ByStr20", "String"],
              arguments: ["0x85e0bef5f9a11821f9b2ba778a05963436b5e720", "Foo"],
              constructor: "Pair",
            },
            {
              argtypes: ["ByStr20", "String"],
              arguments: ["0x85e0bef5f9a11821f9b2ba778a05963436b5e720", "Bar"],
              constructor: "Pair",
            },
          ],
          vname: "y",
        },
        {
          type: "Uint256",
          value: "1",
          vname: "z",
        },
      ],
    },
  ];

  for (const testCase of testCases) {
    const { param, want } = testCase;
    it(JSON.stringify(param), () => {
      const res = scillaJSONParams(param);
      expect(JSON.stringify(res)).toBe(JSON.stringify(want));
    });
  }
});

describe("extractTypes", () => {
  const testCases = [
    {
      type: "Option (ByStr20)",
      want: ["ByStr20"],
    },
    {
      type: "Pair (ByStr20) (Uint256)",
      want: ["ByStr20", "Uint256"],
    },
    {
      type: "Pair (Pair (ByStr20) (Uint256)) (Pair (ByStr20) (String))",
      want: ["Pair (ByStr20) (Uint256)", "Pair (ByStr20) (String)"],
    },
    {
      type: "Pair (List (ByStr20)) (Uint256)",
      want: ["List (ByStr20)", "Uint256"],
    },
    {
      type: "List (Pair (ByStr20) (Uint256))",
      want: ["Pair (ByStr20) (Uint256)"],
    },
    {
      type: "List (List (Pair (ByStr20) (Uint256)))",
      want: ["List (Pair (ByStr20) (Uint256))"],
    },
  ];

  for (const testCase of testCases) {
    const { type, want } = testCase;
    it(type, () => {
      const res = extractTypes(type);
      expect(JSON.stringify(res)).toBe(JSON.stringify(want));
    });
  }
});
