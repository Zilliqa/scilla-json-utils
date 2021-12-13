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

export const extractTypes = (type: string) => {
  let count = 0;
  let startIndex = -1;
  const result = [] as string[];

  for (let i = 0; i < type.length; i++) {
    const c = type[i] as string;

    if (c === "(") {
      count += 1;
      if (count === 1 && startIndex === -1) {
        startIndex = i + 1;
      }
    } else if (c === ")") {
      count -= 1;
      if (count === 0) {
        result.push(type.slice(startIndex, i));

        // reset
        startIndex = -1;
      }
    }
  }
  return result;
};

export const getJSONValue = (value: any, type?: string): any => {
  // User-defined ADT
  if (typeof type === "string" && type.startsWith("0x")) {
    const arr = type.split(".");
    const contractAddress = arr[0]?.toLowerCase();
    const contructorName = arr[2];

    const structIndex = arr.findIndex((x) => x === "of");
    let values = [] as any[];
    if (structIndex !== -1) {
      const structTypes = arr.slice(structIndex + 1);
      values = structTypes.map((t, i) => getJSONValue(value[i], t));
    }
    return {
      argtypes: [],
      arguments: values,
      constructor: `${contractAddress}.${contructorName}`,
    };
  }

  if (typeof type === "string" && type.startsWith("Uint")) {
    return value.toString();
  }

  if (typeof type === "string" && type.startsWith("Int")) {
    return value.toString();
  }

  if (type === "String") {
    return value;
  }

  if (
    typeof type === "string" &&
    type.startsWith("ByStr") &&
    typeof value === "string"
  ) {
    return value.toLowerCase();
  }

  if (type === "BNum") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return {
      argtypes: [],
      arguments: [],
      constructor: value ? "True" : "False",
    };
  }

  if (typeof type === "string" && type.startsWith("Option")) {
    const types = extractTypes(type);
    return {
      argtypes: types,
      arguments: value === undefined ? [] : [getJSONValue(value, types[0])],
      constructor: value === undefined ? "None" : "Some",
    };
  }

  if (
    typeof type === "string" &&
    type.startsWith("List") &&
    Array.isArray(value)
  ) {
    return value.map((x) => getJSONValue(x, extractTypes(type)[0]));
  }

  if (
    typeof type === "string" &&
    type.startsWith("Pair") &&
    Array.isArray(value)
  ) {
    const types = extractTypes(type);
    return {
      argtypes: types,
      arguments: value.map((x, i) => getJSONValue(x, types[i])),
      constructor: "Pair",
    };
  }

  return value;
};

export const getJSONParams = (obj: { [x: string]: any }) => {
  const result = Object.keys(obj).map((vname) => {
    const [type, value] = obj[vname];

    if (typeof type === "string" && type.startsWith("0x")) {
      const arr = type.split(".");
      const contractAddress = arr[0]?.toLowerCase();
      const typeName = arr[1];
      return {
        type: `${contractAddress}.${typeName}`,
        value: getJSONValue(value, type),
        vname,
      };
    }

    return {
      type,
      value: getJSONValue(value, type),
      vname,
    };
  });
  return result;
};
