var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except2, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except2)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/@whatwg-node/fetch/dist/global-ponyfill.js
var require_global_ponyfill = __commonJS({
  "node_modules/@whatwg-node/fetch/dist/global-ponyfill.js"(exports, module) {
    init_modules_watch_stub();
    module.exports.fetch = globalThis.fetch;
    module.exports.Headers = globalThis.Headers;
    module.exports.Request = globalThis.Request;
    module.exports.Response = globalThis.Response;
    module.exports.FormData = globalThis.FormData;
    module.exports.ReadableStream = globalThis.ReadableStream;
    module.exports.WritableStream = globalThis.WritableStream;
    module.exports.TransformStream = globalThis.TransformStream;
    module.exports.CompressionStream = globalThis.CompressionStream;
    module.exports.DecompressionStream = globalThis.DecompressionStream;
    module.exports.TextDecoderStream = globalThis.TextDecoderStream;
    module.exports.TextEncoderStream = globalThis.TextEncoderStream;
    module.exports.Blob = globalThis.Blob;
    module.exports.File = globalThis.File;
    module.exports.crypto = globalThis.crypto;
    module.exports.btoa = globalThis.btoa;
    module.exports.TextEncoder = globalThis.TextEncoder;
    module.exports.TextDecoder = globalThis.TextDecoder;
    module.exports.URLPattern = globalThis.URLPattern;
    module.exports.URL = globalThis.URL;
    module.exports.URLSearchParams = globalThis.URLSearchParams;
    module.exports.createFetch = () => globalThis;
  }
});

// .wrangler/tmp/bundle-Kj0xsW/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-Kj0xsW/middleware-insertion-facade.js
init_modules_watch_stub();

// worker.ts
init_modules_watch_stub();

// node_modules/@graphql-tools/schema/esm/assertResolversPresent.js
init_modules_watch_stub();

// node_modules/graphql/index.mjs
init_modules_watch_stub();

// node_modules/graphql/version.mjs
init_modules_watch_stub();
var versionInfo = Object.freeze({
  major: 16,
  minor: 11,
  patch: 0,
  preReleaseTag: null
});

// node_modules/graphql/jsutils/devAssert.mjs
init_modules_watch_stub();
function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message);
  }
}
__name(devAssert, "devAssert");

// node_modules/graphql/jsutils/isPromise.mjs
init_modules_watch_stub();
function isPromise(value) {
  return typeof (value === null || value === void 0 ? void 0 : value.then) === "function";
}
__name(isPromise, "isPromise");

// node_modules/graphql/language/parser.mjs
init_modules_watch_stub();

// node_modules/graphql/error/syntaxError.mjs
init_modules_watch_stub();

// node_modules/graphql/error/GraphQLError.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/isObjectLike.mjs
init_modules_watch_stub();
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}
__name(isObjectLike, "isObjectLike");

// node_modules/graphql/language/location.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/invariant.mjs
init_modules_watch_stub();
function invariant(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(
      message != null ? message : "Unexpected invariant triggered."
    );
  }
}
__name(invariant, "invariant");

// node_modules/graphql/language/location.mjs
var LineRegExp = /\r\n|[\n\r]/g;
function getLocation(source, position) {
  let lastLineStart = 0;
  let line = 1;
  for (const match of source.body.matchAll(LineRegExp)) {
    typeof match.index === "number" || invariant(false);
    if (match.index >= position) {
      break;
    }
    lastLineStart = match.index + match[0].length;
    line += 1;
  }
  return {
    line,
    column: position + 1 - lastLineStart
  };
}
__name(getLocation, "getLocation");

// node_modules/graphql/language/printLocation.mjs
init_modules_watch_stub();
function printLocation(location) {
  return printSourceLocation(
    location.source,
    getLocation(location.source, location.start)
  );
}
__name(printLocation, "printLocation");
function printSourceLocation(source, sourceLocation) {
  const firstLineColumnOffset = source.locationOffset.column - 1;
  const body = "".padStart(firstLineColumnOffset) + source.body;
  const lineIndex = sourceLocation.line - 1;
  const lineOffset = source.locationOffset.line - 1;
  const lineNum = sourceLocation.line + lineOffset;
  const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  const columnNum = sourceLocation.column + columnOffset;
  const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
  const lines = body.split(/\r\n|[\n\r]/g);
  const locationLine = lines[lineIndex];
  if (locationLine.length > 120) {
    const subLineIndex = Math.floor(columnNum / 80);
    const subLineColumnNum = columnNum % 80;
    const subLines = [];
    for (let i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }
    return locationStr + printPrefixedLines([
      [`${lineNum} |`, subLines[0]],
      ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
      ["|", "^".padStart(subLineColumnNum)],
      ["|", subLines[subLineIndex + 1]]
    ]);
  }
  return locationStr + printPrefixedLines([
    // Lines specified like this: ["prefix", "string"],
    [`${lineNum - 1} |`, lines[lineIndex - 1]],
    [`${lineNum} |`, locationLine],
    ["|", "^".padStart(columnNum)],
    [`${lineNum + 1} |`, lines[lineIndex + 1]]
  ]);
}
__name(printSourceLocation, "printSourceLocation");
function printPrefixedLines(lines) {
  const existingLines = lines.filter(([_, line]) => line !== void 0);
  const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
  return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
}
__name(printPrefixedLines, "printPrefixedLines");

// node_modules/graphql/error/GraphQLError.mjs
function toNormalizedOptions(args) {
  const firstArg = args[0];
  if (firstArg == null || "kind" in firstArg || "length" in firstArg) {
    return {
      nodes: firstArg,
      source: args[1],
      positions: args[2],
      path: args[3],
      originalError: args[4],
      extensions: args[5]
    };
  }
  return firstArg;
}
__name(toNormalizedOptions, "toNormalizedOptions");
var GraphQLError = class _GraphQLError extends Error {
  static {
    __name(this, "GraphQLError");
  }
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  /**
   * The original error thrown from a field resolver during execution.
   */
  /**
   * Extension fields to add to the formatted error.
   */
  /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */
  constructor(message, ...rawArgs) {
    var _this$nodes, _nodeLocations$, _ref;
    const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
    super(message);
    this.name = "GraphQLError";
    this.path = path !== null && path !== void 0 ? path : void 0;
    this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
    this.nodes = undefinedIfEmpty(
      Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0
    );
    const nodeLocations = undefinedIfEmpty(
      (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null)
    );
    this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
    this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
    this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
    const originalExtensions = isObjectLike(
      originalError === null || originalError === void 0 ? void 0 : originalError.extensions
    ) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
    this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : /* @__PURE__ */ Object.create(null);
    Object.defineProperties(this, {
      message: {
        writable: true,
        enumerable: true
      },
      name: {
        enumerable: false
      },
      nodes: {
        enumerable: false
      },
      source: {
        enumerable: false
      },
      positions: {
        enumerable: false
      },
      originalError: {
        enumerable: false
      }
    });
    if (originalError !== null && originalError !== void 0 && originalError.stack) {
      Object.defineProperty(this, "stack", {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _GraphQLError);
    } else {
      Object.defineProperty(this, "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let output = this.message;
    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.loc) {
          output += "\n\n" + printLocation(node.loc);
        }
      }
    } else if (this.source && this.locations) {
      for (const location of this.locations) {
        output += "\n\n" + printSourceLocation(this.source, location);
      }
    }
    return output;
  }
  toJSON() {
    const formattedError = {
      message: this.message
    };
    if (this.locations != null) {
      formattedError.locations = this.locations;
    }
    if (this.path != null) {
      formattedError.path = this.path;
    }
    if (this.extensions != null && Object.keys(this.extensions).length > 0) {
      formattedError.extensions = this.extensions;
    }
    return formattedError;
  }
};
function undefinedIfEmpty(array) {
  return array === void 0 || array.length === 0 ? void 0 : array;
}
__name(undefinedIfEmpty, "undefinedIfEmpty");

// node_modules/graphql/error/syntaxError.mjs
function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, {
    source,
    positions: [position]
  });
}
__name(syntaxError, "syntaxError");

// node_modules/graphql/language/ast.mjs
init_modules_watch_stub();
var Location = class {
  static {
    __name(this, "Location");
  }
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
};
var Token = class {
  static {
    __name(this, "Token");
  }
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(kind, start, end, line, column, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
};
var QueryDocumentKeys = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
var kindValues = new Set(Object.keys(QueryDocumentKeys));
function isNode(maybeNode) {
  const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === "string" && kindValues.has(maybeKind);
}
__name(isNode, "isNode");
var OperationTypeNode;
(function(OperationTypeNode2) {
  OperationTypeNode2["QUERY"] = "query";
  OperationTypeNode2["MUTATION"] = "mutation";
  OperationTypeNode2["SUBSCRIPTION"] = "subscription";
})(OperationTypeNode || (OperationTypeNode = {}));

// node_modules/graphql/language/directiveLocation.mjs
init_modules_watch_stub();
var DirectiveLocation;
(function(DirectiveLocation2) {
  DirectiveLocation2["QUERY"] = "QUERY";
  DirectiveLocation2["MUTATION"] = "MUTATION";
  DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
  DirectiveLocation2["FIELD"] = "FIELD";
  DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
  DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
  DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
  DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
  DirectiveLocation2["SCHEMA"] = "SCHEMA";
  DirectiveLocation2["SCALAR"] = "SCALAR";
  DirectiveLocation2["OBJECT"] = "OBJECT";
  DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
  DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
  DirectiveLocation2["INTERFACE"] = "INTERFACE";
  DirectiveLocation2["UNION"] = "UNION";
  DirectiveLocation2["ENUM"] = "ENUM";
  DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
  DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
  DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
})(DirectiveLocation || (DirectiveLocation = {}));

// node_modules/graphql/language/kinds.mjs
init_modules_watch_stub();
var Kind;
(function(Kind2) {
  Kind2["NAME"] = "Name";
  Kind2["DOCUMENT"] = "Document";
  Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
  Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
  Kind2["SELECTION_SET"] = "SelectionSet";
  Kind2["FIELD"] = "Field";
  Kind2["ARGUMENT"] = "Argument";
  Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
  Kind2["INLINE_FRAGMENT"] = "InlineFragment";
  Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
  Kind2["VARIABLE"] = "Variable";
  Kind2["INT"] = "IntValue";
  Kind2["FLOAT"] = "FloatValue";
  Kind2["STRING"] = "StringValue";
  Kind2["BOOLEAN"] = "BooleanValue";
  Kind2["NULL"] = "NullValue";
  Kind2["ENUM"] = "EnumValue";
  Kind2["LIST"] = "ListValue";
  Kind2["OBJECT"] = "ObjectValue";
  Kind2["OBJECT_FIELD"] = "ObjectField";
  Kind2["DIRECTIVE"] = "Directive";
  Kind2["NAMED_TYPE"] = "NamedType";
  Kind2["LIST_TYPE"] = "ListType";
  Kind2["NON_NULL_TYPE"] = "NonNullType";
  Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
  Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
  Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
  Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
  Kind2["FIELD_DEFINITION"] = "FieldDefinition";
  Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
  Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
  Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
  Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
  Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
  Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
  Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
  Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
  Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
  Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
  Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
  Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
  Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
  Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
})(Kind || (Kind = {}));

// node_modules/graphql/language/lexer.mjs
init_modules_watch_stub();

// node_modules/graphql/language/blockString.mjs
init_modules_watch_stub();

// node_modules/graphql/language/characterClasses.mjs
init_modules_watch_stub();
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
__name(isWhiteSpace, "isWhiteSpace");
function isDigit(code) {
  return code >= 48 && code <= 57;
}
__name(isDigit, "isDigit");
function isLetter(code) {
  return code >= 97 && code <= 122 || // A-Z
  code >= 65 && code <= 90;
}
__name(isLetter, "isLetter");
function isNameStart(code) {
  return isLetter(code) || code === 95;
}
__name(isNameStart, "isNameStart");
function isNameContinue(code) {
  return isLetter(code) || isDigit(code) || code === 95;
}
__name(isNameContinue, "isNameContinue");

// node_modules/graphql/language/blockString.mjs
function dedentBlockStringLines(lines) {
  var _firstNonEmptyLine2;
  let commonIndent = Number.MAX_SAFE_INTEGER;
  let firstNonEmptyLine = null;
  let lastNonEmptyLine = -1;
  for (let i = 0; i < lines.length; ++i) {
    var _firstNonEmptyLine;
    const line = lines[i];
    const indent3 = leadingWhitespace(line);
    if (indent3 === line.length) {
      continue;
    }
    firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i;
    lastNonEmptyLine = i;
    if (i !== 0 && indent3 < commonIndent) {
      commonIndent = indent3;
    }
  }
  return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(
    (_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0,
    lastNonEmptyLine + 1
  );
}
__name(dedentBlockStringLines, "dedentBlockStringLines");
function leadingWhitespace(str) {
  let i = 0;
  while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
    ++i;
  }
  return i;
}
__name(leadingWhitespace, "leadingWhitespace");
function printBlockString(value, options) {
  const escapedValue = value.replace(/"""/g, '\\"""');
  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1;
  const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith("\\");
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines = !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
  (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
  let result = "";
  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
  if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
    result += "\n";
  }
  result += escapedValue;
  if (printAsMultipleLines || forceTrailingNewline) {
    result += "\n";
  }
  return '"""' + result + '"""';
}
__name(printBlockString, "printBlockString");

// node_modules/graphql/language/tokenKind.mjs
init_modules_watch_stub();
var TokenKind;
(function(TokenKind2) {
  TokenKind2["SOF"] = "<SOF>";
  TokenKind2["EOF"] = "<EOF>";
  TokenKind2["BANG"] = "!";
  TokenKind2["DOLLAR"] = "$";
  TokenKind2["AMP"] = "&";
  TokenKind2["PAREN_L"] = "(";
  TokenKind2["PAREN_R"] = ")";
  TokenKind2["SPREAD"] = "...";
  TokenKind2["COLON"] = ":";
  TokenKind2["EQUALS"] = "=";
  TokenKind2["AT"] = "@";
  TokenKind2["BRACKET_L"] = "[";
  TokenKind2["BRACKET_R"] = "]";
  TokenKind2["BRACE_L"] = "{";
  TokenKind2["PIPE"] = "|";
  TokenKind2["BRACE_R"] = "}";
  TokenKind2["NAME"] = "Name";
  TokenKind2["INT"] = "Int";
  TokenKind2["FLOAT"] = "Float";
  TokenKind2["STRING"] = "String";
  TokenKind2["BLOCK_STRING"] = "BlockString";
  TokenKind2["COMMENT"] = "Comment";
})(TokenKind || (TokenKind = {}));

// node_modules/graphql/language/lexer.mjs
var Lexer = class {
  static {
    __name(this, "Lexer");
  }
  /**
   * The previously focused non-ignored token.
   */
  /**
   * The currently focused non-ignored token.
   */
  /**
   * The (1-indexed) line containing the current token.
   */
  /**
   * The character offset at which the current line begins.
   */
  constructor(source) {
    const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */
  advance() {
    this.lastToken = this.token;
    const token = this.token = this.lookahead();
    return token;
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  lookahead() {
    let token = this.token;
    if (token.kind !== TokenKind.EOF) {
      do {
        if (token.next) {
          token = token.next;
        } else {
          const nextToken = readNextToken(this, token.end);
          token.next = nextToken;
          nextToken.prev = token;
          token = nextToken;
        }
      } while (token.kind === TokenKind.COMMENT);
    }
    return token;
  }
};
function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}
__name(isPunctuatorTokenKind, "isPunctuatorTokenKind");
function isUnicodeScalarValue(code) {
  return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
}
__name(isUnicodeScalarValue, "isUnicodeScalarValue");
function isSupplementaryCodePoint(body, location) {
  return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
}
__name(isSupplementaryCodePoint, "isSupplementaryCodePoint");
function isLeadingSurrogate(code) {
  return code >= 55296 && code <= 56319;
}
__name(isLeadingSurrogate, "isLeadingSurrogate");
function isTrailingSurrogate(code) {
  return code >= 56320 && code <= 57343;
}
__name(isTrailingSurrogate, "isTrailingSurrogate");
function printCodePointAt(lexer, location) {
  const code = lexer.source.body.codePointAt(location);
  if (code === void 0) {
    return TokenKind.EOF;
  } else if (code >= 32 && code <= 126) {
    const char = String.fromCodePoint(code);
    return char === '"' ? `'"'` : `"${char}"`;
  }
  return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
}
__name(printCodePointAt, "printCodePointAt");
function createToken(lexer, kind, start, end, value) {
  const line = lexer.line;
  const col = 1 + start - lexer.lineStart;
  return new Token(kind, start, end, line, col, value);
}
__name(createToken, "createToken");
function readNextToken(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    switch (code) {
      // Ignored ::
      //   - UnicodeBOM
      //   - WhiteSpace
      //   - LineTerminator
      //   - Comment
      //   - Comma
      //
      // UnicodeBOM :: "Byte Order Mark (U+FEFF)"
      //
      // WhiteSpace ::
      //   - "Horizontal Tab (U+0009)"
      //   - "Space (U+0020)"
      //
      // Comma :: ,
      case 65279:
      // <BOM>
      case 9:
      // \t
      case 32:
      // <space>
      case 44:
        ++position;
        continue;
      // LineTerminator ::
      //   - "New Line (U+000A)"
      //   - "Carriage Return (U+000D)" [lookahead != "New Line (U+000A)"]
      //   - "Carriage Return (U+000D)" "New Line (U+000A)"
      case 10:
        ++position;
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      case 13:
        if (body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      // Comment
      case 35:
        return readComment(lexer, position);
      // Token ::
      //   - Punctuator
      //   - Name
      //   - IntValue
      //   - FloatValue
      //   - StringValue
      //
      // Punctuator :: one of ! $ & ( ) ... : = @ [ ] { | }
      case 33:
        return createToken(lexer, TokenKind.BANG, position, position + 1);
      case 36:
        return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
      case 38:
        return createToken(lexer, TokenKind.AMP, position, position + 1);
      case 40:
        return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
      case 41:
        return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
      case 46:
        if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
          return createToken(lexer, TokenKind.SPREAD, position, position + 3);
        }
        break;
      case 58:
        return createToken(lexer, TokenKind.COLON, position, position + 1);
      case 61:
        return createToken(lexer, TokenKind.EQUALS, position, position + 1);
      case 64:
        return createToken(lexer, TokenKind.AT, position, position + 1);
      case 91:
        return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
      case 93:
        return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
      case 123:
        return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
      case 124:
        return createToken(lexer, TokenKind.PIPE, position, position + 1);
      case 125:
        return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
      // StringValue
      case 34:
        if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          return readBlockString(lexer, position);
        }
        return readString(lexer, position);
    }
    if (isDigit(code) || code === 45) {
      return readNumber(lexer, position, code);
    }
    if (isNameStart(code)) {
      return readName(lexer, position);
    }
    throw syntaxError(
      lexer.source,
      position,
      code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`
    );
  }
  return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
}
__name(readNextToken, "readNextToken");
function readComment(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      break;
    }
  }
  return createToken(
    lexer,
    TokenKind.COMMENT,
    start,
    position,
    body.slice(start + 1, position)
  );
}
__name(readComment, "readComment");
function readNumber(lexer, start, firstCode) {
  const body = lexer.source.body;
  let position = start;
  let code = firstCode;
  let isFloat = false;
  if (code === 45) {
    code = body.charCodeAt(++position);
  }
  if (code === 48) {
    code = body.charCodeAt(++position);
    if (isDigit(code)) {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid number, unexpected digit after 0: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
  } else {
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = body.charCodeAt(++position);
    if (code === 43 || code === 45) {
      code = body.charCodeAt(++position);
    }
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46 || isNameStart(code)) {
    throw syntaxError(
      lexer.source,
      position,
      `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        position
      )}.`
    );
  }
  return createToken(
    lexer,
    isFloat ? TokenKind.FLOAT : TokenKind.INT,
    start,
    position,
    body.slice(start, position)
  );
}
__name(readNumber, "readNumber");
function readDigits(lexer, start, firstCode) {
  if (!isDigit(firstCode)) {
    throw syntaxError(
      lexer.source,
      start,
      `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        start
      )}.`
    );
  }
  const body = lexer.source.body;
  let position = start + 1;
  while (isDigit(body.charCodeAt(position))) {
    ++position;
  }
  return position;
}
__name(readDigits, "readDigits");
function readString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  let chunkStart = position;
  let value = "";
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return createToken(lexer, TokenKind.STRING, start, position + 1, value);
    }
    if (code === 92) {
      value += body.slice(chunkStart, position);
      const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
      value += escape.value;
      position += escape.size;
      chunkStart = position;
      continue;
    }
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid character within String: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
__name(readString, "readString");
function readEscapedUnicodeVariableWidth(lexer, position) {
  const body = lexer.source.body;
  let point = 0;
  let size = 3;
  while (size < 12) {
    const code = body.charCodeAt(position + size++);
    if (code === 125) {
      if (size < 5 || !isUnicodeScalarValue(point)) {
        break;
      }
      return {
        value: String.fromCodePoint(point),
        size
      };
    }
    point = point << 4 | readHexDigit(code);
    if (point < 0) {
      break;
    }
  }
  throw syntaxError(
    lexer.source,
    position,
    `Invalid Unicode escape sequence: "${body.slice(
      position,
      position + size
    )}".`
  );
}
__name(readEscapedUnicodeVariableWidth, "readEscapedUnicodeVariableWidth");
function readEscapedUnicodeFixedWidth(lexer, position) {
  const body = lexer.source.body;
  const code = read16BitHexCode(body, position + 2);
  if (isUnicodeScalarValue(code)) {
    return {
      value: String.fromCodePoint(code),
      size: 6
    };
  }
  if (isLeadingSurrogate(code)) {
    if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
      const trailingCode = read16BitHexCode(body, position + 8);
      if (isTrailingSurrogate(trailingCode)) {
        return {
          value: String.fromCodePoint(code, trailingCode),
          size: 12
        };
      }
    }
  }
  throw syntaxError(
    lexer.source,
    position,
    `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`
  );
}
__name(readEscapedUnicodeFixedWidth, "readEscapedUnicodeFixedWidth");
function read16BitHexCode(body, position) {
  return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
}
__name(read16BitHexCode, "read16BitHexCode");
function readHexDigit(code) {
  return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
}
__name(readHexDigit, "readHexDigit");
function readEscapedCharacter(lexer, position) {
  const body = lexer.source.body;
  const code = body.charCodeAt(position + 1);
  switch (code) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: "\n",
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw syntaxError(
    lexer.source,
    position,
    `Invalid character escape sequence: "${body.slice(
      position,
      position + 2
    )}".`
  );
}
__name(readEscapedCharacter, "readEscapedCharacter");
function readBlockString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let lineStart = lexer.lineStart;
  let position = start + 3;
  let chunkStart = position;
  let currentLine = "";
  const blockLines = [];
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      const token = createToken(
        lexer,
        TokenKind.BLOCK_STRING,
        start,
        position + 3,
        // Return a string of the lines joined with U+000A.
        dedentBlockStringLines(blockLines).join("\n")
      );
      lexer.line += blockLines.length - 1;
      lexer.lineStart = lineStart;
      return token;
    }
    if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      currentLine += body.slice(chunkStart, position);
      chunkStart = position + 1;
      position += 4;
      continue;
    }
    if (code === 10 || code === 13) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      if (code === 13 && body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      currentLine = "";
      chunkStart = position;
      lineStart = position;
      continue;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid character within String: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
__name(readBlockString, "readBlockString");
function readName(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (isNameContinue(code)) {
      ++position;
    } else {
      break;
    }
  }
  return createToken(
    lexer,
    TokenKind.NAME,
    start,
    position,
    body.slice(start, position)
  );
}
__name(readName, "readName");

// node_modules/graphql/language/source.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/inspect.mjs
init_modules_watch_stub();
var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
  return formatValue(value, []);
}
__name(inspect, "inspect");
function formatValue(value, seenValues) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "function":
      return value.name ? `[function ${value.name}]` : "[function]";
    case "object":
      return formatObjectValue(value, seenValues);
    default:
      return String(value);
  }
}
__name(formatValue, "formatValue");
function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return "null";
  }
  if (previouslySeenValues.includes(value)) {
    return "[Circular]";
  }
  const seenValues = [...previouslySeenValues, value];
  if (isJSONable(value)) {
    const jsonValue = value.toJSON();
    if (jsonValue !== value) {
      return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }
  return formatObject(value, seenValues);
}
__name(formatObjectValue, "formatObjectValue");
function isJSONable(value) {
  return typeof value.toJSON === "function";
}
__name(isJSONable, "isJSONable");
function formatObject(object, seenValues) {
  const entries = Object.entries(object);
  if (entries.length === 0) {
    return "{}";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[" + getObjectTag(object) + "]";
  }
  const properties = entries.map(
    ([key, value]) => key + ": " + formatValue(value, seenValues)
  );
  return "{ " + properties.join(", ") + " }";
}
__name(formatObject, "formatObject");
function formatArray(array, seenValues) {
  if (array.length === 0) {
    return "[]";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[Array]";
  }
  const len = Math.min(MAX_ARRAY_LENGTH, array.length);
  const remaining = array.length - len;
  const items = [];
  for (let i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }
  if (remaining === 1) {
    items.push("... 1 more item");
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }
  return "[" + items.join(", ") + "]";
}
__name(formatArray, "formatArray");
function getObjectTag(object) {
  const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
  if (tag === "Object" && typeof object.constructor === "function") {
    const name = object.constructor.name;
    if (typeof name === "string" && name !== "") {
      return name;
    }
  }
  return tag;
}
__name(getObjectTag, "getObjectTag");

// node_modules/graphql/jsutils/instanceOf.mjs
init_modules_watch_stub();
var isProduction = globalThis.process && // eslint-disable-next-line no-undef
false;
var instanceOf = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  isProduction ? /* @__PURE__ */ __name(function instanceOf2(value, constructor) {
    return value instanceof constructor;
  }, "instanceOf") : /* @__PURE__ */ __name(function instanceOf3(value, constructor) {
    if (value instanceof constructor) {
      return true;
    }
    if (typeof value === "object" && value !== null) {
      var _value$constructor;
      const className = constructor.prototype[Symbol.toStringTag];
      const valueClassName = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name
      );
      if (className === valueClassName) {
        const stringifiedValue = inspect(value);
        throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
      }
    }
    return false;
  }, "instanceOf")
);

// node_modules/graphql/language/source.mjs
var Source = class {
  static {
    __name(this, "Source");
  }
  constructor(body, name = "GraphQL request", locationOffset = {
    line: 1,
    column: 1
  }) {
    typeof body === "string" || devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert(
      false,
      "line in locationOffset is 1-indexed and must be positive."
    );
    this.locationOffset.column > 0 || devAssert(
      false,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
};
function isSource(source) {
  return instanceOf(source, Source);
}
__name(isSource, "isSource");

// node_modules/graphql/language/parser.mjs
function parse(source, options) {
  const parser = new Parser(source, options);
  const document = parser.parseDocument();
  Object.defineProperty(document, "tokenCount", {
    enumerable: false,
    value: parser.tokenCount
  });
  return document;
}
__name(parse, "parse");
var Parser = class {
  static {
    __name(this, "Parser");
  }
  constructor(source, options = {}) {
    const sourceObj = isSource(source) ? source : new Source(source);
    this._lexer = new Lexer(sourceObj);
    this._options = options;
    this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const token = this.expectToken(TokenKind.NAME);
    return this.node(token, {
      kind: Kind.NAME,
      value: token.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: Kind.DOCUMENT,
      definitions: this.many(
        TokenKind.SOF,
        this.parseDefinition,
        TokenKind.EOF
      )
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  parseDefinition() {
    if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    }
    const hasDescription = this.peekDescription();
    const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (hasDescription) {
        throw syntaxError(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      }
      switch (keywordToken.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  // Implements the parsing rules in the Operations section.
  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  parseOperationDefinition() {
    const start = this._lexer.token;
    if (this.peek(TokenKind.BRACE_L)) {
      return this.node(start, {
        kind: Kind.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    }
    const operation = this.parseOperationType();
    let name;
    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }
    return this.node(start, {
      kind: Kind.OPERATION_DEFINITION,
      operation,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const operationToken = this.expectToken(TokenKind.NAME);
    switch (operationToken.value) {
      case "query":
        return OperationTypeNode.QUERY;
      case "mutation":
        return OperationTypeNode.MUTATION;
      case "subscription":
        return OperationTypeNode.SUBSCRIPTION;
    }
    throw this.unexpected(operationToken);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      TokenKind.PAREN_L,
      this.parseVariableDefinition,
      TokenKind.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return this.node(start, {
      kind: Kind.VARIABLE,
      name: this.parseName()
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: Kind.SELECTION_SET,
      selections: this.many(
        TokenKind.BRACE_L,
        this.parseSelection,
        TokenKind.BRACE_R
      )
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const start = this._lexer.token;
    const nameOrAlias = this.parseName();
    let alias;
    let name;
    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return this.node(start, {
      kind: Kind.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(isConst) {
    const item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(isConst = false) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: Kind.ARGUMENT,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseConstArgument() {
    return this.parseArgument(true);
  }
  // Implements the parsing rules in the Fragments section.
  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  parseFragment() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    const hasTypeCondition = this.expectOptionalKeyword("on");
    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      return this.node(start, {
        kind: Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false)
      });
    }
    return this.node(start, {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  parseFragmentDefinition() {
    const start = this._lexer.token;
    this.expectKeyword("fragment");
    if (this._options.allowLegacyFragmentVariables === true) {
      return this.node(start, {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    return this.node(start, {
      kind: Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentName : Name but not `on`
   */
  parseFragmentName() {
    if (this._lexer.token.value === "on") {
      throw this.unexpected();
    }
    return this.parseName();
  }
  // Implements the parsing rules in the Values section.
  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseValueLiteral(isConst) {
    const token = this._lexer.token;
    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case TokenKind.INT:
        this.advanceLexer();
        return this.node(token, {
          kind: Kind.INT,
          value: token.value
        });
      case TokenKind.FLOAT:
        this.advanceLexer();
        return this.node(token, {
          kind: Kind.FLOAT,
          value: token.value
        });
      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case TokenKind.NAME:
        this.advanceLexer();
        switch (token.value) {
          case "true":
            return this.node(token, {
              kind: Kind.BOOLEAN,
              value: true
            });
          case "false":
            return this.node(token, {
              kind: Kind.BOOLEAN,
              value: false
            });
          case "null":
            return this.node(token, {
              kind: Kind.NULL
            });
          default:
            return this.node(token, {
              kind: Kind.ENUM,
              value: token.value
            });
        }
      case TokenKind.DOLLAR:
        if (isConst) {
          this.expectToken(TokenKind.DOLLAR);
          if (this._lexer.token.kind === TokenKind.NAME) {
            const varName = this._lexer.token.value;
            throw syntaxError(
              this._lexer.source,
              token.start,
              `Unexpected variable "$${varName}" in constant value.`
            );
          } else {
            throw this.unexpected(token);
          }
        }
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(true);
  }
  parseStringLiteral() {
    const token = this._lexer.token;
    this.advanceLexer();
    return this.node(token, {
      kind: Kind.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  parseList(isConst) {
    const item = /* @__PURE__ */ __name(() => this.parseValueLiteral(isConst), "item");
    return this.node(this._lexer.token, {
      kind: Kind.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */
  parseObject(isConst) {
    const item = /* @__PURE__ */ __name(() => this.parseObjectField(isConst), "item");
    return this.node(this._lexer.token, {
      kind: Kind.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(isConst) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: Kind.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(isConst) {
    const directives = [];
    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    return directives;
  }
  parseConstDirectives() {
    return this.parseDirectives(true);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */
  parseDirective(isConst) {
    const start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return this.node(start, {
      kind: Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst)
    });
  }
  // Implements the parsing rules in the Types section.
  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  parseTypeReference() {
    const start = this._lexer.token;
    let type;
    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      const innerType = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = this.node(start, {
        kind: Kind.LIST_TYPE,
        type: innerType
      });
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(TokenKind.BANG)) {
      return this.node(start, {
        kind: Kind.NON_NULL_TYPE,
        type
      });
    }
    return type;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: Kind.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */
  parseSchemaDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.many(
      TokenKind.BRACE_L,
      this.parseOperationTypeDefinition,
      TokenKind.BRACE_R
    );
    return this.node(start, {
      kind: Kind.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const start = this._lexer.token;
    const operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    const type = this.parseNamedType();
    return this.node(start, {
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation,
      type
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  parseObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      TokenKind.BRACE_L,
      this.parseFieldDefinition,
      TokenKind.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      TokenKind.PAREN_L,
      this.parseInputValueDef,
      TokenKind.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    let defaultValue;
    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseConstValueLiteral();
    }
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: Kind.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    return this.node(start, {
      kind: Kind.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    return this.node(start, {
      kind: Kind.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      TokenKind.BRACE_L,
      this.parseEnumValueDefinition,
      TokenKind.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseEnumValueName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
      throw syntaxError(
        this._lexer.source,
        this._lexer.token.start,
        `${getTokenDesc(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    }
    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  parseInputObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    return this.node(start, {
      kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      TokenKind.BRACE_L,
      this.parseInputValueDef,
      TokenKind.BRACE_R
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  parseTypeSystemExtension() {
    const keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */
  parseSchemaExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.optionalMany(
      TokenKind.BRACE_L,
      this.parseOperationTypeDefinition,
      TokenKind.BRACE_R
    );
    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.SCHEMA_EXTENSION,
      directives,
      operationTypes
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.SCALAR_TYPE_EXTENSION,
      name,
      directives
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  parseObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  parseInterfaceTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  parseUnionTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.UNION_TYPE_EXTENSION,
      name,
      directives,
      types
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  parseEnumTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  parseInputObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */
  parseDirectiveDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    const repeatable = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const locations = this.parseDirectiveLocations();
    return this.node(start, {
      kind: Kind.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      repeatable,
      locations
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  parseDirectiveLocation() {
    const start = this._lexer.token;
    const name = this.parseName();
    if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
      return name;
    }
    throw this.unexpected(start);
  }
  // Core parsing utility functions
  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */
  node(startToken, node) {
    if (this._options.noLocation !== true) {
      node.loc = new Location(
        startToken,
        this._lexer.lastToken,
        this._lexer.source
      );
    }
    return node;
  }
  /**
   * Determines if the next token is of a given kind
   */
  peek(kind) {
    return this._lexer.token.kind === kind;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return token;
    }
    throw syntaxError(
      this._lexer.source,
      token.start,
      `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
    } else {
      throw syntaxError(
        this._lexer.source,
        token.start,
        `Expected "${value}", found ${getTokenDesc(token)}.`
      );
    }
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(atToken) {
    const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError(
      this._lexer.source,
      token.start,
      `Unexpected ${getTokenDesc(token)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));
    return nodes;
  }
  advanceLexer() {
    const { maxTokens } = this._options;
    const token = this._lexer.advance();
    if (token.kind !== TokenKind.EOF) {
      ++this._tokenCounter;
      if (maxTokens !== void 0 && this._tokenCounter > maxTokens) {
        throw syntaxError(
          this._lexer.source,
          token.start,
          `Document contains more that ${maxTokens} tokens. Parsing aborted.`
        );
      }
    }
  }
};
function getTokenDesc(token) {
  const value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
}
__name(getTokenDesc, "getTokenDesc");
function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
}
__name(getTokenKindDesc, "getTokenKindDesc");

// node_modules/graphql/type/validate.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/typeComparators.mjs
init_modules_watch_stub();

// node_modules/graphql/type/definition.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/didYouMean.mjs
init_modules_watch_stub();
var MAX_SUGGESTIONS = 5;
function didYouMean(firstArg, secondArg) {
  const [subMessage, suggestionsArg] = secondArg ? [firstArg, secondArg] : [void 0, firstArg];
  let message = " Did you mean ";
  if (subMessage) {
    message += subMessage + " ";
  }
  const suggestions = suggestionsArg.map((x) => `"${x}"`);
  switch (suggestions.length) {
    case 0:
      return "";
    case 1:
      return message + suggestions[0] + "?";
    case 2:
      return message + suggestions[0] + " or " + suggestions[1] + "?";
  }
  const selected = suggestions.slice(0, MAX_SUGGESTIONS);
  const lastItem = selected.pop();
  return message + selected.join(", ") + ", or " + lastItem + "?";
}
__name(didYouMean, "didYouMean");

// node_modules/graphql/jsutils/identityFunc.mjs
init_modules_watch_stub();
function identityFunc(x) {
  return x;
}
__name(identityFunc, "identityFunc");

// node_modules/graphql/jsutils/keyMap.mjs
init_modules_watch_stub();
function keyMap(list2, keyFn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const item of list2) {
    result[keyFn(item)] = item;
  }
  return result;
}
__name(keyMap, "keyMap");

// node_modules/graphql/jsutils/keyValMap.mjs
init_modules_watch_stub();
function keyValMap(list2, keyFn, valFn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const item of list2) {
    result[keyFn(item)] = valFn(item);
  }
  return result;
}
__name(keyValMap, "keyValMap");

// node_modules/graphql/jsutils/mapValue.mjs
init_modules_watch_stub();
function mapValue(map, fn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(map)) {
    result[key] = fn(map[key], key);
  }
  return result;
}
__name(mapValue, "mapValue");

// node_modules/graphql/jsutils/suggestionList.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/naturalCompare.mjs
init_modules_watch_stub();
function naturalCompare(aStr, bStr) {
  let aIndex = 0;
  let bIndex = 0;
  while (aIndex < aStr.length && bIndex < bStr.length) {
    let aChar = aStr.charCodeAt(aIndex);
    let bChar = bStr.charCodeAt(bIndex);
    if (isDigit2(aChar) && isDigit2(bChar)) {
      let aNum = 0;
      do {
        ++aIndex;
        aNum = aNum * 10 + aChar - DIGIT_0;
        aChar = aStr.charCodeAt(aIndex);
      } while (isDigit2(aChar) && aNum > 0);
      let bNum = 0;
      do {
        ++bIndex;
        bNum = bNum * 10 + bChar - DIGIT_0;
        bChar = bStr.charCodeAt(bIndex);
      } while (isDigit2(bChar) && bNum > 0);
      if (aNum < bNum) {
        return -1;
      }
      if (aNum > bNum) {
        return 1;
      }
    } else {
      if (aChar < bChar) {
        return -1;
      }
      if (aChar > bChar) {
        return 1;
      }
      ++aIndex;
      ++bIndex;
    }
  }
  return aStr.length - bStr.length;
}
__name(naturalCompare, "naturalCompare");
var DIGIT_0 = 48;
var DIGIT_9 = 57;
function isDigit2(code) {
  return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
}
__name(isDigit2, "isDigit");

// node_modules/graphql/jsutils/suggestionList.mjs
function suggestionList(input, options) {
  const optionsByDistance = /* @__PURE__ */ Object.create(null);
  const lexicalDistance = new LexicalDistance(input);
  const threshold = Math.floor(input.length * 0.4) + 1;
  for (const option of options) {
    const distance = lexicalDistance.measure(option, threshold);
    if (distance !== void 0) {
      optionsByDistance[option] = distance;
    }
  }
  return Object.keys(optionsByDistance).sort((a, b) => {
    const distanceDiff = optionsByDistance[a] - optionsByDistance[b];
    return distanceDiff !== 0 ? distanceDiff : naturalCompare(a, b);
  });
}
__name(suggestionList, "suggestionList");
var LexicalDistance = class {
  static {
    __name(this, "LexicalDistance");
  }
  constructor(input) {
    this._input = input;
    this._inputLowerCase = input.toLowerCase();
    this._inputArray = stringToArray(this._inputLowerCase);
    this._rows = [
      new Array(input.length + 1).fill(0),
      new Array(input.length + 1).fill(0),
      new Array(input.length + 1).fill(0)
    ];
  }
  measure(option, threshold) {
    if (this._input === option) {
      return 0;
    }
    const optionLowerCase = option.toLowerCase();
    if (this._inputLowerCase === optionLowerCase) {
      return 1;
    }
    let a = stringToArray(optionLowerCase);
    let b = this._inputArray;
    if (a.length < b.length) {
      const tmp = a;
      a = b;
      b = tmp;
    }
    const aLength = a.length;
    const bLength = b.length;
    if (aLength - bLength > threshold) {
      return void 0;
    }
    const rows = this._rows;
    for (let j = 0; j <= bLength; j++) {
      rows[0][j] = j;
    }
    for (let i = 1; i <= aLength; i++) {
      const upRow = rows[(i - 1) % 3];
      const currentRow = rows[i % 3];
      let smallestCell = currentRow[0] = i;
      for (let j = 1; j <= bLength; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let currentCell = Math.min(
          upRow[j] + 1,
          // delete
          currentRow[j - 1] + 1,
          // insert
          upRow[j - 1] + cost
          // substitute
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          const doubleDiagonalCell = rows[(i - 2) % 3][j - 2];
          currentCell = Math.min(currentCell, doubleDiagonalCell + 1);
        }
        if (currentCell < smallestCell) {
          smallestCell = currentCell;
        }
        currentRow[j] = currentCell;
      }
      if (smallestCell > threshold) {
        return void 0;
      }
    }
    const distance = rows[aLength % 3][bLength];
    return distance <= threshold ? distance : void 0;
  }
};
function stringToArray(str) {
  const strLength = str.length;
  const array = new Array(strLength);
  for (let i = 0; i < strLength; ++i) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}
__name(stringToArray, "stringToArray");

// node_modules/graphql/jsutils/toObjMap.mjs
init_modules_watch_stub();
function toObjMap(obj) {
  if (obj == null) {
    return /* @__PURE__ */ Object.create(null);
  }
  if (Object.getPrototypeOf(obj) === null) {
    return obj;
  }
  const map = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of Object.entries(obj)) {
    map[key] = value;
  }
  return map;
}
__name(toObjMap, "toObjMap");

// node_modules/graphql/language/printer.mjs
init_modules_watch_stub();

// node_modules/graphql/language/printString.mjs
init_modules_watch_stub();
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
}
__name(printString, "printString");
var escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
}
__name(escapedReplacer, "escapedReplacer");
var escapeSequences = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
];

// node_modules/graphql/language/visitor.mjs
init_modules_watch_stub();
var BREAK = Object.freeze({});
function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
  const enterLeaveMap = /* @__PURE__ */ new Map();
  for (const kind of Object.values(Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  let stack = void 0;
  let inArray2 = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node = root;
  let key = void 0;
  let parent = void 0;
  const path = [];
  const ancestors = [];
  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? void 0 : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray2) {
          node = node.slice();
          let editOffset = 0;
          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;
            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = { ...node };
          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray2 = stack.inArray;
      stack = stack.prev;
    } else if (parent) {
      key = inArray2 ? index : keys[index];
      node = parent[key];
      if (node === null || node === void 0) {
        continue;
      }
      path.push(key);
    }
    let result;
    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;
      isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
      const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
      result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
      if (result === BREAK) {
        break;
      }
      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== void 0) {
        edits.push([key, result]);
        if (!isLeaving) {
          if (isNode(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }
    if (result === void 0 && isEdited) {
      edits.push([key, node]);
    }
    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;
      stack = {
        inArray: inArray2,
        index,
        keys,
        edits,
        prev: stack
      };
      inArray2 = Array.isArray(node);
      keys = inArray2 ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== void 0);
  if (edits.length !== 0) {
    return edits[edits.length - 1][1];
  }
  return root;
}
__name(visit, "visit");
function visitInParallel(visitors) {
  const skipping = new Array(visitors.length).fill(null);
  const mergedVisitor = /* @__PURE__ */ Object.create(null);
  for (const kind of Object.values(Kind)) {
    let hasVisitor = false;
    const enterList = new Array(visitors.length).fill(void 0);
    const leaveList = new Array(visitors.length).fill(void 0);
    for (let i = 0; i < visitors.length; ++i) {
      const { enter, leave } = getEnterLeaveForKind(visitors[i], kind);
      hasVisitor || (hasVisitor = enter != null || leave != null);
      enterList[i] = enter;
      leaveList[i] = leave;
    }
    if (!hasVisitor) {
      continue;
    }
    const mergedEnterLeave = {
      enter(...args) {
        const node = args[0];
        for (let i = 0; i < visitors.length; i++) {
          if (skipping[i] === null) {
            var _enterList$i;
            const result = (_enterList$i = enterList[i]) === null || _enterList$i === void 0 ? void 0 : _enterList$i.apply(visitors[i], args);
            if (result === false) {
              skipping[i] = node;
            } else if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== void 0) {
              return result;
            }
          }
        }
      },
      leave(...args) {
        const node = args[0];
        for (let i = 0; i < visitors.length; i++) {
          if (skipping[i] === null) {
            var _leaveList$i;
            const result = (_leaveList$i = leaveList[i]) === null || _leaveList$i === void 0 ? void 0 : _leaveList$i.apply(visitors[i], args);
            if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== void 0 && result !== false) {
              return result;
            }
          } else if (skipping[i] === node) {
            skipping[i] = null;
          }
        }
      }
    };
    mergedVisitor[kind] = mergedEnterLeave;
  }
  return mergedVisitor;
}
__name(visitInParallel, "visitInParallel");
function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];
  if (typeof kindVisitor === "object") {
    return kindVisitor;
  } else if (typeof kindVisitor === "function") {
    return {
      enter: kindVisitor,
      leave: void 0
    };
  }
  return {
    enter: visitor.enter,
    leave: visitor.leave
  };
}
__name(getEnterLeaveForKind, "getEnterLeaveForKind");

// node_modules/graphql/language/printer.mjs
function print(ast) {
  return visit(ast, printDocASTReducer);
}
__name(print, "print");
var MAX_LINE_LENGTH = 80;
var printDocASTReducer = {
  Name: {
    leave: /* @__PURE__ */ __name((node) => node.value, "leave")
  },
  Variable: {
    leave: /* @__PURE__ */ __name((node) => "$" + node.name, "leave")
  },
  // Document
  Document: {
    leave: /* @__PURE__ */ __name((node) => join(node.definitions, "\n\n"), "leave")
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
      const prefix = join(
        [
          node.operation,
          join([node.name, varDefs]),
          join(node.directives, " ")
        ],
        " "
      );
      return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
    }
  },
  VariableDefinition: {
    leave: /* @__PURE__ */ __name(({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " ")), "leave")
  },
  SelectionSet: {
    leave: /* @__PURE__ */ __name(({ selections }) => block(selections), "leave")
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap("", alias, ": ") + name;
      let argsLine = prefix + wrap("(", join(args, ", "), ")");
      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
      }
      return join([argsLine, join(directives, " "), selectionSet], " ");
    }
  },
  Argument: {
    leave: /* @__PURE__ */ __name(({ name, value }) => name + ": " + value, "leave")
  },
  // Fragments
  FragmentSpread: {
    leave: /* @__PURE__ */ __name(({ name, directives }) => "..." + name + wrap(" ", join(directives, " ")), "leave")
  },
  InlineFragment: {
    leave: /* @__PURE__ */ __name(({ typeCondition, directives, selectionSet }) => join(
      [
        "...",
        wrap("on ", typeCondition),
        join(directives, " "),
        selectionSet
      ],
      " "
    ), "leave")
  },
  FragmentDefinition: {
    leave: /* @__PURE__ */ __name(({ name, typeCondition, variableDefinitions, directives, selectionSet }) => (
      // or removed in the future.
      `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
    ), "leave")
  },
  // Value
  IntValue: {
    leave: /* @__PURE__ */ __name(({ value }) => value, "leave")
  },
  FloatValue: {
    leave: /* @__PURE__ */ __name(({ value }) => value, "leave")
  },
  StringValue: {
    leave: /* @__PURE__ */ __name(({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value), "leave")
  },
  BooleanValue: {
    leave: /* @__PURE__ */ __name(({ value }) => value ? "true" : "false", "leave")
  },
  NullValue: {
    leave: /* @__PURE__ */ __name(() => "null", "leave")
  },
  EnumValue: {
    leave: /* @__PURE__ */ __name(({ value }) => value, "leave")
  },
  ListValue: {
    leave: /* @__PURE__ */ __name(({ values }) => "[" + join(values, ", ") + "]", "leave")
  },
  ObjectValue: {
    leave: /* @__PURE__ */ __name(({ fields }) => "{" + join(fields, ", ") + "}", "leave")
  },
  ObjectField: {
    leave: /* @__PURE__ */ __name(({ name, value }) => name + ": " + value, "leave")
  },
  // Directive
  Directive: {
    leave: /* @__PURE__ */ __name(({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")"), "leave")
  },
  // Type
  NamedType: {
    leave: /* @__PURE__ */ __name(({ name }) => name, "leave")
  },
  ListType: {
    leave: /* @__PURE__ */ __name(({ type }) => "[" + type + "]", "leave")
  },
  NonNullType: {
    leave: /* @__PURE__ */ __name(({ type }) => type + "!", "leave")
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: /* @__PURE__ */ __name(({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " "), "leave")
  },
  OperationTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ operation, type }) => operation + ": " + type, "leave")
  },
  ScalarTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " "), "leave")
  },
  ObjectTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
      [
        "type",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    ), "leave")
  },
  FieldDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " ")), "leave")
  },
  InputValueDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join(
      [name + ": " + type, wrap("= ", defaultValue), join(directives, " ")],
      " "
    ), "leave")
  },
  InterfaceTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
      [
        "interface",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    ), "leave")
  },
  UnionTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, directives, types }) => wrap("", description, "\n") + join(
      ["union", name, join(directives, " "), wrap("= ", join(types, " | "))],
      " "
    ), "leave")
  },
  EnumTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " "), "leave")
  },
  EnumValueDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " "), "leave")
  },
  InputObjectTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " "), "leave")
  },
  DirectiveDefinition: {
    leave: /* @__PURE__ */ __name(({ description, name, arguments: args, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | "), "leave")
  },
  SchemaExtension: {
    leave: /* @__PURE__ */ __name(({ directives, operationTypes }) => join(
      ["extend schema", join(directives, " "), block(operationTypes)],
      " "
    ), "leave")
  },
  ScalarTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " "), "leave")
  },
  ObjectTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, interfaces, directives, fields }) => join(
      [
        "extend type",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    ), "leave")
  },
  InterfaceTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, interfaces, directives, fields }) => join(
      [
        "extend interface",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    ), "leave")
  },
  UnionTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives, types }) => join(
      [
        "extend union",
        name,
        join(directives, " "),
        wrap("= ", join(types, " | "))
      ],
      " "
    ), "leave")
  },
  EnumTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " "), "leave")
  },
  InputObjectTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " "), "leave")
  }
};
function join(maybeArray, separator = "") {
  var _maybeArray$filter$jo;
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
}
__name(join, "join");
function block(array) {
  return wrap("{\n", indent(join(array, "\n")), "\n}");
}
__name(block, "block");
function wrap(start, maybeString, end = "") {
  return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
}
__name(wrap, "wrap");
function indent(str) {
  return wrap("  ", str.replace(/\n/g, "\n  "));
}
__name(indent, "indent");
function hasMultilineItems(maybeArray) {
  var _maybeArray$some;
  return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
}
__name(hasMultilineItems, "hasMultilineItems");

// node_modules/graphql/utilities/valueFromASTUntyped.mjs
init_modules_watch_stub();
function valueFromASTUntyped(valueNode, variables) {
  switch (valueNode.kind) {
    case Kind.NULL:
      return null;
    case Kind.INT:
      return parseInt(valueNode.value, 10);
    case Kind.FLOAT:
      return parseFloat(valueNode.value);
    case Kind.STRING:
    case Kind.ENUM:
    case Kind.BOOLEAN:
      return valueNode.value;
    case Kind.LIST:
      return valueNode.values.map(
        (node) => valueFromASTUntyped(node, variables)
      );
    case Kind.OBJECT:
      return keyValMap(
        valueNode.fields,
        (field) => field.name.value,
        (field) => valueFromASTUntyped(field.value, variables)
      );
    case Kind.VARIABLE:
      return variables === null || variables === void 0 ? void 0 : variables[valueNode.name.value];
  }
}
__name(valueFromASTUntyped, "valueFromASTUntyped");

// node_modules/graphql/type/assertName.mjs
init_modules_watch_stub();
function assertName(name) {
  name != null || devAssert(false, "Must provide name.");
  typeof name === "string" || devAssert(false, "Expected name to be a string.");
  if (name.length === 0) {
    throw new GraphQLError("Expected name to be a non-empty string.");
  }
  for (let i = 1; i < name.length; ++i) {
    if (!isNameContinue(name.charCodeAt(i))) {
      throw new GraphQLError(
        `Names must only contain [_a-zA-Z0-9] but "${name}" does not.`
      );
    }
  }
  if (!isNameStart(name.charCodeAt(0))) {
    throw new GraphQLError(
      `Names must start with [_a-zA-Z] but "${name}" does not.`
    );
  }
  return name;
}
__name(assertName, "assertName");
function assertEnumValueName(name) {
  if (name === "true" || name === "false" || name === "null") {
    throw new GraphQLError(`Enum values cannot be named: ${name}`);
  }
  return assertName(name);
}
__name(assertEnumValueName, "assertEnumValueName");

// node_modules/graphql/type/definition.mjs
function isType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type) || isListType(type) || isNonNullType(type);
}
__name(isType, "isType");
function isScalarType(type) {
  return instanceOf(type, GraphQLScalarType);
}
__name(isScalarType, "isScalarType");
function isObjectType(type) {
  return instanceOf(type, GraphQLObjectType);
}
__name(isObjectType, "isObjectType");
function isInterfaceType(type) {
  return instanceOf(type, GraphQLInterfaceType);
}
__name(isInterfaceType, "isInterfaceType");
function isUnionType(type) {
  return instanceOf(type, GraphQLUnionType);
}
__name(isUnionType, "isUnionType");
function isEnumType(type) {
  return instanceOf(type, GraphQLEnumType);
}
__name(isEnumType, "isEnumType");
function isInputObjectType(type) {
  return instanceOf(type, GraphQLInputObjectType);
}
__name(isInputObjectType, "isInputObjectType");
function isListType(type) {
  return instanceOf(type, GraphQLList);
}
__name(isListType, "isListType");
function isNonNullType(type) {
  return instanceOf(type, GraphQLNonNull);
}
__name(isNonNullType, "isNonNullType");
function isInputType(type) {
  return isScalarType(type) || isEnumType(type) || isInputObjectType(type) || isWrappingType(type) && isInputType(type.ofType);
}
__name(isInputType, "isInputType");
function isOutputType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isWrappingType(type) && isOutputType(type.ofType);
}
__name(isOutputType, "isOutputType");
function isLeafType(type) {
  return isScalarType(type) || isEnumType(type);
}
__name(isLeafType, "isLeafType");
function isCompositeType(type) {
  return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}
__name(isCompositeType, "isCompositeType");
function isAbstractType(type) {
  return isInterfaceType(type) || isUnionType(type);
}
__name(isAbstractType, "isAbstractType");
var GraphQLList = class {
  static {
    __name(this, "GraphQLList");
  }
  constructor(ofType) {
    isType(ofType) || devAssert(false, `Expected ${inspect(ofType)} to be a GraphQL type.`);
    this.ofType = ofType;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLList";
  }
  toString() {
    return "[" + String(this.ofType) + "]";
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLNonNull = class {
  static {
    __name(this, "GraphQLNonNull");
  }
  constructor(ofType) {
    isNullableType(ofType) || devAssert(
      false,
      `Expected ${inspect(ofType)} to be a GraphQL nullable type.`
    );
    this.ofType = ofType;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLNonNull";
  }
  toString() {
    return String(this.ofType) + "!";
  }
  toJSON() {
    return this.toString();
  }
};
function isWrappingType(type) {
  return isListType(type) || isNonNullType(type);
}
__name(isWrappingType, "isWrappingType");
function isNullableType(type) {
  return isType(type) && !isNonNullType(type);
}
__name(isNullableType, "isNullableType");
function getNullableType(type) {
  if (type) {
    return isNonNullType(type) ? type.ofType : type;
  }
}
__name(getNullableType, "getNullableType");
function isNamedType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type);
}
__name(isNamedType, "isNamedType");
function getNamedType(type) {
  if (type) {
    let unwrappedType = type;
    while (isWrappingType(unwrappedType)) {
      unwrappedType = unwrappedType.ofType;
    }
    return unwrappedType;
  }
}
__name(getNamedType, "getNamedType");
function resolveReadonlyArrayThunk(thunk) {
  return typeof thunk === "function" ? thunk() : thunk;
}
__name(resolveReadonlyArrayThunk, "resolveReadonlyArrayThunk");
function resolveObjMapThunk(thunk) {
  return typeof thunk === "function" ? thunk() : thunk;
}
__name(resolveObjMapThunk, "resolveObjMapThunk");
var GraphQLScalarType = class {
  static {
    __name(this, "GraphQLScalarType");
  }
  constructor(config) {
    var _config$parseValue, _config$serialize, _config$parseLiteral, _config$extensionASTN;
    const parseValue2 = (_config$parseValue = config.parseValue) !== null && _config$parseValue !== void 0 ? _config$parseValue : identityFunc;
    this.name = assertName(config.name);
    this.description = config.description;
    this.specifiedByURL = config.specifiedByURL;
    this.serialize = (_config$serialize = config.serialize) !== null && _config$serialize !== void 0 ? _config$serialize : identityFunc;
    this.parseValue = parseValue2;
    this.parseLiteral = (_config$parseLiteral = config.parseLiteral) !== null && _config$parseLiteral !== void 0 ? _config$parseLiteral : (node, variables) => parseValue2(valueFromASTUntyped(node, variables));
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
    config.specifiedByURL == null || typeof config.specifiedByURL === "string" || devAssert(
      false,
      `${this.name} must provide "specifiedByURL" as a string, but got: ${inspect(config.specifiedByURL)}.`
    );
    config.serialize == null || typeof config.serialize === "function" || devAssert(
      false,
      `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
    );
    if (config.parseLiteral) {
      typeof config.parseValue === "function" && typeof config.parseLiteral === "function" || devAssert(
        false,
        `${this.name} must provide both "parseValue" and "parseLiteral" functions.`
      );
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLScalarType";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByURL: this.specifiedByURL,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLObjectType = class {
  static {
    __name(this, "GraphQLObjectType");
  }
  constructor(config) {
    var _config$extensionASTN2;
    this.name = assertName(config.name);
    this.description = config.description;
    this.isTypeOf = config.isTypeOf;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN2 = config.extensionASTNodes) !== null && _config$extensionASTN2 !== void 0 ? _config$extensionASTN2 : [];
    this._fields = () => defineFieldMap(config);
    this._interfaces = () => defineInterfaces(config);
    config.isTypeOf == null || typeof config.isTypeOf === "function" || devAssert(
      false,
      `${this.name} must provide "isTypeOf" as a function, but got: ${inspect(config.isTypeOf)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLObjectType";
  }
  getFields() {
    if (typeof this._fields === "function") {
      this._fields = this._fields();
    }
    return this._fields;
  }
  getInterfaces() {
    if (typeof this._interfaces === "function") {
      this._interfaces = this._interfaces();
    }
    return this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function defineInterfaces(config) {
  var _config$interfaces;
  const interfaces = resolveReadonlyArrayThunk(
    (_config$interfaces = config.interfaces) !== null && _config$interfaces !== void 0 ? _config$interfaces : []
  );
  Array.isArray(interfaces) || devAssert(
    false,
    `${config.name} interfaces must be an Array or a function which returns an Array.`
  );
  return interfaces;
}
__name(defineInterfaces, "defineInterfaces");
function defineFieldMap(config) {
  const fieldMap = resolveObjMapThunk(config.fields);
  isPlainObj(fieldMap) || devAssert(
    false,
    `${config.name} fields must be an object with field names as keys or a function which returns such an object.`
  );
  return mapValue(fieldMap, (fieldConfig, fieldName) => {
    var _fieldConfig$args;
    isPlainObj(fieldConfig) || devAssert(
      false,
      `${config.name}.${fieldName} field config must be an object.`
    );
    fieldConfig.resolve == null || typeof fieldConfig.resolve === "function" || devAssert(
      false,
      `${config.name}.${fieldName} field resolver must be a function if provided, but got: ${inspect(fieldConfig.resolve)}.`
    );
    const argsConfig = (_fieldConfig$args = fieldConfig.args) !== null && _fieldConfig$args !== void 0 ? _fieldConfig$args : {};
    isPlainObj(argsConfig) || devAssert(
      false,
      `${config.name}.${fieldName} args must be an object with argument names as keys.`
    );
    return {
      name: assertName(fieldName),
      description: fieldConfig.description,
      type: fieldConfig.type,
      args: defineArguments(argsConfig),
      resolve: fieldConfig.resolve,
      subscribe: fieldConfig.subscribe,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: toObjMap(fieldConfig.extensions),
      astNode: fieldConfig.astNode
    };
  });
}
__name(defineFieldMap, "defineFieldMap");
function defineArguments(config) {
  return Object.entries(config).map(([argName, argConfig]) => ({
    name: assertName(argName),
    description: argConfig.description,
    type: argConfig.type,
    defaultValue: argConfig.defaultValue,
    deprecationReason: argConfig.deprecationReason,
    extensions: toObjMap(argConfig.extensions),
    astNode: argConfig.astNode
  }));
}
__name(defineArguments, "defineArguments");
function isPlainObj(obj) {
  return isObjectLike(obj) && !Array.isArray(obj);
}
__name(isPlainObj, "isPlainObj");
function fieldsToFieldsConfig(fields) {
  return mapValue(fields, (field) => ({
    description: field.description,
    type: field.type,
    args: argsToArgsConfig(field.args),
    resolve: field.resolve,
    subscribe: field.subscribe,
    deprecationReason: field.deprecationReason,
    extensions: field.extensions,
    astNode: field.astNode
  }));
}
__name(fieldsToFieldsConfig, "fieldsToFieldsConfig");
function argsToArgsConfig(args) {
  return keyValMap(
    args,
    (arg) => arg.name,
    (arg) => ({
      description: arg.description,
      type: arg.type,
      defaultValue: arg.defaultValue,
      deprecationReason: arg.deprecationReason,
      extensions: arg.extensions,
      astNode: arg.astNode
    })
  );
}
__name(argsToArgsConfig, "argsToArgsConfig");
function isRequiredArgument(arg) {
  return isNonNullType(arg.type) && arg.defaultValue === void 0;
}
__name(isRequiredArgument, "isRequiredArgument");
var GraphQLInterfaceType = class {
  static {
    __name(this, "GraphQLInterfaceType");
  }
  constructor(config) {
    var _config$extensionASTN3;
    this.name = assertName(config.name);
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN3 = config.extensionASTNodes) !== null && _config$extensionASTN3 !== void 0 ? _config$extensionASTN3 : [];
    this._fields = defineFieldMap.bind(void 0, config);
    this._interfaces = defineInterfaces.bind(void 0, config);
    config.resolveType == null || typeof config.resolveType === "function" || devAssert(
      false,
      `${this.name} must provide "resolveType" as a function, but got: ${inspect(config.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInterfaceType";
  }
  getFields() {
    if (typeof this._fields === "function") {
      this._fields = this._fields();
    }
    return this._fields;
  }
  getInterfaces() {
    if (typeof this._interfaces === "function") {
      this._interfaces = this._interfaces();
    }
    return this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLUnionType = class {
  static {
    __name(this, "GraphQLUnionType");
  }
  constructor(config) {
    var _config$extensionASTN4;
    this.name = assertName(config.name);
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN4 = config.extensionASTNodes) !== null && _config$extensionASTN4 !== void 0 ? _config$extensionASTN4 : [];
    this._types = defineTypes.bind(void 0, config);
    config.resolveType == null || typeof config.resolveType === "function" || devAssert(
      false,
      `${this.name} must provide "resolveType" as a function, but got: ${inspect(config.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLUnionType";
  }
  getTypes() {
    if (typeof this._types === "function") {
      this._types = this._types();
    }
    return this._types;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function defineTypes(config) {
  const types = resolveReadonlyArrayThunk(config.types);
  Array.isArray(types) || devAssert(
    false,
    `Must provide Array of types or a function which returns such an array for Union ${config.name}.`
  );
  return types;
}
__name(defineTypes, "defineTypes");
var GraphQLEnumType = class {
  static {
    __name(this, "GraphQLEnumType");
  }
  /* <T> */
  constructor(config) {
    var _config$extensionASTN5;
    this.name = assertName(config.name);
    this.description = config.description;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN5 = config.extensionASTNodes) !== null && _config$extensionASTN5 !== void 0 ? _config$extensionASTN5 : [];
    this._values = typeof config.values === "function" ? config.values : defineEnumValues(this.name, config.values);
    this._valueLookup = null;
    this._nameLookup = null;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLEnumType";
  }
  getValues() {
    if (typeof this._values === "function") {
      this._values = defineEnumValues(this.name, this._values());
    }
    return this._values;
  }
  getValue(name) {
    if (this._nameLookup === null) {
      this._nameLookup = keyMap(this.getValues(), (value) => value.name);
    }
    return this._nameLookup[name];
  }
  serialize(outputValue) {
    if (this._valueLookup === null) {
      this._valueLookup = new Map(
        this.getValues().map((enumValue2) => [enumValue2.value, enumValue2])
      );
    }
    const enumValue = this._valueLookup.get(outputValue);
    if (enumValue === void 0) {
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent value: ${inspect(outputValue)}`
      );
    }
    return enumValue.name;
  }
  parseValue(inputValue) {
    if (typeof inputValue !== "string") {
      const valueStr = inspect(inputValue);
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent non-string value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr)
      );
    }
    const enumValue = this.getValue(inputValue);
    if (enumValue == null) {
      throw new GraphQLError(
        `Value "${inputValue}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, inputValue)
      );
    }
    return enumValue.value;
  }
  parseLiteral(valueNode, _variables) {
    if (valueNode.kind !== Kind.ENUM) {
      const valueStr = print(valueNode);
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr),
        {
          nodes: valueNode
        }
      );
    }
    const enumValue = this.getValue(valueNode.value);
    if (enumValue == null) {
      const valueStr = print(valueNode);
      throw new GraphQLError(
        `Value "${valueStr}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, valueStr),
        {
          nodes: valueNode
        }
      );
    }
    return enumValue.value;
  }
  toConfig() {
    const values = keyValMap(
      this.getValues(),
      (value) => value.name,
      (value) => ({
        description: value.description,
        value: value.value,
        deprecationReason: value.deprecationReason,
        extensions: value.extensions,
        astNode: value.astNode
      })
    );
    return {
      name: this.name,
      description: this.description,
      values,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function didYouMeanEnumValue(enumType, unknownValueStr) {
  const allNames = enumType.getValues().map((value) => value.name);
  const suggestedValues = suggestionList(unknownValueStr, allNames);
  return didYouMean("the enum value", suggestedValues);
}
__name(didYouMeanEnumValue, "didYouMeanEnumValue");
function defineEnumValues(typeName, valueMap) {
  isPlainObj(valueMap) || devAssert(
    false,
    `${typeName} values must be an object with value names as keys.`
  );
  return Object.entries(valueMap).map(([valueName, valueConfig]) => {
    isPlainObj(valueConfig) || devAssert(
      false,
      `${typeName}.${valueName} must refer to an object with a "value" key representing an internal value but got: ${inspect(valueConfig)}.`
    );
    return {
      name: assertEnumValueName(valueName),
      description: valueConfig.description,
      value: valueConfig.value !== void 0 ? valueConfig.value : valueName,
      deprecationReason: valueConfig.deprecationReason,
      extensions: toObjMap(valueConfig.extensions),
      astNode: valueConfig.astNode
    };
  });
}
__name(defineEnumValues, "defineEnumValues");
var GraphQLInputObjectType = class {
  static {
    __name(this, "GraphQLInputObjectType");
  }
  constructor(config) {
    var _config$extensionASTN6, _config$isOneOf;
    this.name = assertName(config.name);
    this.description = config.description;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN6 = config.extensionASTNodes) !== null && _config$extensionASTN6 !== void 0 ? _config$extensionASTN6 : [];
    this.isOneOf = (_config$isOneOf = config.isOneOf) !== null && _config$isOneOf !== void 0 ? _config$isOneOf : false;
    this._fields = defineInputFieldMap.bind(void 0, config);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInputObjectType";
  }
  getFields() {
    if (typeof this._fields === "function") {
      this._fields = this._fields();
    }
    return this._fields;
  }
  toConfig() {
    const fields = mapValue(this.getFields(), (field) => ({
      description: field.description,
      type: field.type,
      defaultValue: field.defaultValue,
      deprecationReason: field.deprecationReason,
      extensions: field.extensions,
      astNode: field.astNode
    }));
    return {
      name: this.name,
      description: this.description,
      fields,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      isOneOf: this.isOneOf
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function defineInputFieldMap(config) {
  const fieldMap = resolveObjMapThunk(config.fields);
  isPlainObj(fieldMap) || devAssert(
    false,
    `${config.name} fields must be an object with field names as keys or a function which returns such an object.`
  );
  return mapValue(fieldMap, (fieldConfig, fieldName) => {
    !("resolve" in fieldConfig) || devAssert(
      false,
      `${config.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`
    );
    return {
      name: assertName(fieldName),
      description: fieldConfig.description,
      type: fieldConfig.type,
      defaultValue: fieldConfig.defaultValue,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: toObjMap(fieldConfig.extensions),
      astNode: fieldConfig.astNode
    };
  });
}
__name(defineInputFieldMap, "defineInputFieldMap");
function isRequiredInputField(field) {
  return isNonNullType(field.type) && field.defaultValue === void 0;
}
__name(isRequiredInputField, "isRequiredInputField");

// node_modules/graphql/utilities/typeComparators.mjs
function isEqualType(typeA, typeB) {
  if (typeA === typeB) {
    return true;
  }
  if (isNonNullType(typeA) && isNonNullType(typeB)) {
    return isEqualType(typeA.ofType, typeB.ofType);
  }
  if (isListType(typeA) && isListType(typeB)) {
    return isEqualType(typeA.ofType, typeB.ofType);
  }
  return false;
}
__name(isEqualType, "isEqualType");
function isTypeSubTypeOf(schema2, maybeSubType, superType) {
  if (maybeSubType === superType) {
    return true;
  }
  if (isNonNullType(superType)) {
    if (isNonNullType(maybeSubType)) {
      return isTypeSubTypeOf(schema2, maybeSubType.ofType, superType.ofType);
    }
    return false;
  }
  if (isNonNullType(maybeSubType)) {
    return isTypeSubTypeOf(schema2, maybeSubType.ofType, superType);
  }
  if (isListType(superType)) {
    if (isListType(maybeSubType)) {
      return isTypeSubTypeOf(schema2, maybeSubType.ofType, superType.ofType);
    }
    return false;
  }
  if (isListType(maybeSubType)) {
    return false;
  }
  return isAbstractType(superType) && (isInterfaceType(maybeSubType) || isObjectType(maybeSubType)) && schema2.isSubType(superType, maybeSubType);
}
__name(isTypeSubTypeOf, "isTypeSubTypeOf");
function doTypesOverlap(schema2, typeA, typeB) {
  if (typeA === typeB) {
    return true;
  }
  if (isAbstractType(typeA)) {
    if (isAbstractType(typeB)) {
      return schema2.getPossibleTypes(typeA).some((type) => schema2.isSubType(typeB, type));
    }
    return schema2.isSubType(typeA, typeB);
  }
  if (isAbstractType(typeB)) {
    return schema2.isSubType(typeB, typeA);
  }
  return false;
}
__name(doTypesOverlap, "doTypesOverlap");

// node_modules/graphql/type/directives.mjs
init_modules_watch_stub();

// node_modules/graphql/type/scalars.mjs
init_modules_watch_stub();
var GRAPHQL_MAX_INT = 2147483647;
var GRAPHQL_MIN_INT = -2147483648;
var GraphQLInt = new GraphQLScalarType({
  name: "Int",
  description: "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "boolean") {
      return coercedValue ? 1 : 0;
    }
    let num = coercedValue;
    if (typeof coercedValue === "string" && coercedValue !== "") {
      num = Number(coercedValue);
    }
    if (typeof num !== "number" || !Number.isInteger(num)) {
      throw new GraphQLError(
        `Int cannot represent non-integer value: ${inspect(coercedValue)}`
      );
    }
    if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
      throw new GraphQLError(
        "Int cannot represent non 32-bit signed integer value: " + inspect(coercedValue)
      );
    }
    return num;
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "number" || !Number.isInteger(inputValue)) {
      throw new GraphQLError(
        `Int cannot represent non-integer value: ${inspect(inputValue)}`
      );
    }
    if (inputValue > GRAPHQL_MAX_INT || inputValue < GRAPHQL_MIN_INT) {
      throw new GraphQLError(
        `Int cannot represent non 32-bit signed integer value: ${inputValue}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        `Int cannot represent non-integer value: ${print(valueNode)}`,
        {
          nodes: valueNode
        }
      );
    }
    const num = parseInt(valueNode.value, 10);
    if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
      throw new GraphQLError(
        `Int cannot represent non 32-bit signed integer value: ${valueNode.value}`,
        {
          nodes: valueNode
        }
      );
    }
    return num;
  }
});
var GraphQLFloat = new GraphQLScalarType({
  name: "Float",
  description: "The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "boolean") {
      return coercedValue ? 1 : 0;
    }
    let num = coercedValue;
    if (typeof coercedValue === "string" && coercedValue !== "") {
      num = Number(coercedValue);
    }
    if (typeof num !== "number" || !Number.isFinite(num)) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${inspect(coercedValue)}`
      );
    }
    return num;
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "number" || !Number.isFinite(inputValue)) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${inspect(inputValue)}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.FLOAT && valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${print(valueNode)}`,
        valueNode
      );
    }
    return parseFloat(valueNode.value);
  }
});
var GraphQLString = new GraphQLScalarType({
  name: "String",
  description: "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "string") {
      return coercedValue;
    }
    if (typeof coercedValue === "boolean") {
      return coercedValue ? "true" : "false";
    }
    if (typeof coercedValue === "number" && Number.isFinite(coercedValue)) {
      return coercedValue.toString();
    }
    throw new GraphQLError(
      `String cannot represent value: ${inspect(outputValue)}`
    );
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "string") {
      throw new GraphQLError(
        `String cannot represent a non string value: ${inspect(inputValue)}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING) {
      throw new GraphQLError(
        `String cannot represent a non string value: ${print(valueNode)}`,
        {
          nodes: valueNode
        }
      );
    }
    return valueNode.value;
  }
});
var GraphQLBoolean = new GraphQLScalarType({
  name: "Boolean",
  description: "The `Boolean` scalar type represents `true` or `false`.",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "boolean") {
      return coercedValue;
    }
    if (Number.isFinite(coercedValue)) {
      return coercedValue !== 0;
    }
    throw new GraphQLError(
      `Boolean cannot represent a non boolean value: ${inspect(coercedValue)}`
    );
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "boolean") {
      throw new GraphQLError(
        `Boolean cannot represent a non boolean value: ${inspect(inputValue)}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.BOOLEAN) {
      throw new GraphQLError(
        `Boolean cannot represent a non boolean value: ${print(valueNode)}`,
        {
          nodes: valueNode
        }
      );
    }
    return valueNode.value;
  }
});
var GraphQLID = new GraphQLScalarType({
  name: "ID",
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "string") {
      return coercedValue;
    }
    if (Number.isInteger(coercedValue)) {
      return String(coercedValue);
    }
    throw new GraphQLError(
      `ID cannot represent value: ${inspect(outputValue)}`
    );
  },
  parseValue(inputValue) {
    if (typeof inputValue === "string") {
      return inputValue;
    }
    if (typeof inputValue === "number" && Number.isInteger(inputValue)) {
      return inputValue.toString();
    }
    throw new GraphQLError(`ID cannot represent value: ${inspect(inputValue)}`);
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING && valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        "ID cannot represent a non-string and non-integer value: " + print(valueNode),
        {
          nodes: valueNode
        }
      );
    }
    return valueNode.value;
  }
});
var specifiedScalarTypes = Object.freeze([
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID
]);
function isSpecifiedScalarType(type) {
  return specifiedScalarTypes.some(({ name }) => type.name === name);
}
__name(isSpecifiedScalarType, "isSpecifiedScalarType");
function serializeObject(outputValue) {
  if (isObjectLike(outputValue)) {
    if (typeof outputValue.valueOf === "function") {
      const valueOfResult = outputValue.valueOf();
      if (!isObjectLike(valueOfResult)) {
        return valueOfResult;
      }
    }
    if (typeof outputValue.toJSON === "function") {
      return outputValue.toJSON();
    }
  }
  return outputValue;
}
__name(serializeObject, "serializeObject");

// node_modules/graphql/type/directives.mjs
function isDirective(directive) {
  return instanceOf(directive, GraphQLDirective);
}
__name(isDirective, "isDirective");
var GraphQLDirective = class {
  static {
    __name(this, "GraphQLDirective");
  }
  constructor(config) {
    var _config$isRepeatable, _config$args;
    this.name = assertName(config.name);
    this.description = config.description;
    this.locations = config.locations;
    this.isRepeatable = (_config$isRepeatable = config.isRepeatable) !== null && _config$isRepeatable !== void 0 ? _config$isRepeatable : false;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    Array.isArray(config.locations) || devAssert(false, `@${config.name} locations must be an Array.`);
    const args = (_config$args = config.args) !== null && _config$args !== void 0 ? _config$args : {};
    isObjectLike(args) && !Array.isArray(args) || devAssert(
      false,
      `@${config.name} args must be an object with argument names as keys.`
    );
    this.args = defineArguments(args);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLDirective";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: argsToArgsConfig(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode
    };
  }
  toString() {
    return "@" + this.name;
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLIncludeDirective = new GraphQLDirective({
  name: "include",
  description: "Directs the executor to include this field or fragment only when the `if` argument is true.",
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Included when true."
    }
  }
});
var GraphQLSkipDirective = new GraphQLDirective({
  name: "skip",
  description: "Directs the executor to skip this field or fragment when the `if` argument is true.",
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Skipped when true."
    }
  }
});
var DEFAULT_DEPRECATION_REASON = "No longer supported";
var GraphQLDeprecatedDirective = new GraphQLDirective({
  name: "deprecated",
  description: "Marks an element of a GraphQL schema as no longer supported.",
  locations: [
    DirectiveLocation.FIELD_DEFINITION,
    DirectiveLocation.ARGUMENT_DEFINITION,
    DirectiveLocation.INPUT_FIELD_DEFINITION,
    DirectiveLocation.ENUM_VALUE
  ],
  args: {
    reason: {
      type: GraphQLString,
      description: "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
      defaultValue: DEFAULT_DEPRECATION_REASON
    }
  }
});
var GraphQLSpecifiedByDirective = new GraphQLDirective({
  name: "specifiedBy",
  description: "Exposes a URL that specifies the behavior of this scalar.",
  locations: [DirectiveLocation.SCALAR],
  args: {
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The URL that specifies the behavior of this scalar."
    }
  }
});
var GraphQLOneOfDirective = new GraphQLDirective({
  name: "oneOf",
  description: "Indicates exactly one field must be supplied and this field must not be `null`.",
  locations: [DirectiveLocation.INPUT_OBJECT],
  args: {}
});
var specifiedDirectives = Object.freeze([
  GraphQLIncludeDirective,
  GraphQLSkipDirective,
  GraphQLDeprecatedDirective,
  GraphQLSpecifiedByDirective,
  GraphQLOneOfDirective
]);
function isSpecifiedDirective(directive) {
  return specifiedDirectives.some(({ name }) => name === directive.name);
}
__name(isSpecifiedDirective, "isSpecifiedDirective");

// node_modules/graphql/type/introspection.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/astFromValue.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/isIterableObject.mjs
init_modules_watch_stub();
function isIterableObject(maybeIterable) {
  return typeof maybeIterable === "object" && typeof (maybeIterable === null || maybeIterable === void 0 ? void 0 : maybeIterable[Symbol.iterator]) === "function";
}
__name(isIterableObject, "isIterableObject");

// node_modules/graphql/utilities/astFromValue.mjs
function astFromValue(value, type) {
  if (isNonNullType(type)) {
    const astValue = astFromValue(value, type.ofType);
    if ((astValue === null || astValue === void 0 ? void 0 : astValue.kind) === Kind.NULL) {
      return null;
    }
    return astValue;
  }
  if (value === null) {
    return {
      kind: Kind.NULL
    };
  }
  if (value === void 0) {
    return null;
  }
  if (isListType(type)) {
    const itemType = type.ofType;
    if (isIterableObject(value)) {
      const valuesNodes = [];
      for (const item of value) {
        const itemNode = astFromValue(item, itemType);
        if (itemNode != null) {
          valuesNodes.push(itemNode);
        }
      }
      return {
        kind: Kind.LIST,
        values: valuesNodes
      };
    }
    return astFromValue(value, itemType);
  }
  if (isInputObjectType(type)) {
    if (!isObjectLike(value)) {
      return null;
    }
    const fieldNodes = [];
    for (const field of Object.values(type.getFields())) {
      const fieldValue = astFromValue(value[field.name], field.type);
      if (fieldValue) {
        fieldNodes.push({
          kind: Kind.OBJECT_FIELD,
          name: {
            kind: Kind.NAME,
            value: field.name
          },
          value: fieldValue
        });
      }
    }
    return {
      kind: Kind.OBJECT,
      fields: fieldNodes
    };
  }
  if (isLeafType(type)) {
    const serialized = type.serialize(value);
    if (serialized == null) {
      return null;
    }
    if (typeof serialized === "boolean") {
      return {
        kind: Kind.BOOLEAN,
        value: serialized
      };
    }
    if (typeof serialized === "number" && Number.isFinite(serialized)) {
      const stringNum = String(serialized);
      return integerStringRegExp.test(stringNum) ? {
        kind: Kind.INT,
        value: stringNum
      } : {
        kind: Kind.FLOAT,
        value: stringNum
      };
    }
    if (typeof serialized === "string") {
      if (isEnumType(type)) {
        return {
          kind: Kind.ENUM,
          value: serialized
        };
      }
      if (type === GraphQLID && integerStringRegExp.test(serialized)) {
        return {
          kind: Kind.INT,
          value: serialized
        };
      }
      return {
        kind: Kind.STRING,
        value: serialized
      };
    }
    throw new TypeError(`Cannot convert value to AST: ${inspect(serialized)}.`);
  }
  invariant(false, "Unexpected input type: " + inspect(type));
}
__name(astFromValue, "astFromValue");
var integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;

// node_modules/graphql/type/introspection.mjs
var __Schema = new GraphQLObjectType({
  name: "__Schema",
  description: "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
  fields: /* @__PURE__ */ __name(() => ({
    description: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((schema2) => schema2.description, "resolve")
    },
    types: {
      description: "A list of all types supported by this server.",
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(__Type))),
      resolve(schema2) {
        return Object.values(schema2.getTypeMap());
      }
    },
    queryType: {
      description: "The type that query operations will be rooted at.",
      type: new GraphQLNonNull(__Type),
      resolve: /* @__PURE__ */ __name((schema2) => schema2.getQueryType(), "resolve")
    },
    mutationType: {
      description: "If this server supports mutation, the type that mutation operations will be rooted at.",
      type: __Type,
      resolve: /* @__PURE__ */ __name((schema2) => schema2.getMutationType(), "resolve")
    },
    subscriptionType: {
      description: "If this server support subscription, the type that subscription operations will be rooted at.",
      type: __Type,
      resolve: /* @__PURE__ */ __name((schema2) => schema2.getSubscriptionType(), "resolve")
    },
    directives: {
      description: "A list of all directives supported by this server.",
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__Directive))
      ),
      resolve: /* @__PURE__ */ __name((schema2) => schema2.getDirectives(), "resolve")
    }
  }), "fields")
});
var __Directive = new GraphQLObjectType({
  name: "__Directive",
  description: "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
  fields: /* @__PURE__ */ __name(() => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: /* @__PURE__ */ __name((directive) => directive.name, "resolve")
    },
    description: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((directive) => directive.description, "resolve")
    },
    isRepeatable: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: /* @__PURE__ */ __name((directive) => directive.isRepeatable, "resolve")
    },
    locations: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__DirectiveLocation))
      ),
      resolve: /* @__PURE__ */ __name((directive) => directive.locations, "resolve")
    },
    args: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__InputValue))
      ),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(field, { includeDeprecated }) {
        return includeDeprecated ? field.args : field.args.filter((arg) => arg.deprecationReason == null);
      }
    }
  }), "fields")
});
var __DirectiveLocation = new GraphQLEnumType({
  name: "__DirectiveLocation",
  description: "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
  values: {
    QUERY: {
      value: DirectiveLocation.QUERY,
      description: "Location adjacent to a query operation."
    },
    MUTATION: {
      value: DirectiveLocation.MUTATION,
      description: "Location adjacent to a mutation operation."
    },
    SUBSCRIPTION: {
      value: DirectiveLocation.SUBSCRIPTION,
      description: "Location adjacent to a subscription operation."
    },
    FIELD: {
      value: DirectiveLocation.FIELD,
      description: "Location adjacent to a field."
    },
    FRAGMENT_DEFINITION: {
      value: DirectiveLocation.FRAGMENT_DEFINITION,
      description: "Location adjacent to a fragment definition."
    },
    FRAGMENT_SPREAD: {
      value: DirectiveLocation.FRAGMENT_SPREAD,
      description: "Location adjacent to a fragment spread."
    },
    INLINE_FRAGMENT: {
      value: DirectiveLocation.INLINE_FRAGMENT,
      description: "Location adjacent to an inline fragment."
    },
    VARIABLE_DEFINITION: {
      value: DirectiveLocation.VARIABLE_DEFINITION,
      description: "Location adjacent to a variable definition."
    },
    SCHEMA: {
      value: DirectiveLocation.SCHEMA,
      description: "Location adjacent to a schema definition."
    },
    SCALAR: {
      value: DirectiveLocation.SCALAR,
      description: "Location adjacent to a scalar definition."
    },
    OBJECT: {
      value: DirectiveLocation.OBJECT,
      description: "Location adjacent to an object type definition."
    },
    FIELD_DEFINITION: {
      value: DirectiveLocation.FIELD_DEFINITION,
      description: "Location adjacent to a field definition."
    },
    ARGUMENT_DEFINITION: {
      value: DirectiveLocation.ARGUMENT_DEFINITION,
      description: "Location adjacent to an argument definition."
    },
    INTERFACE: {
      value: DirectiveLocation.INTERFACE,
      description: "Location adjacent to an interface definition."
    },
    UNION: {
      value: DirectiveLocation.UNION,
      description: "Location adjacent to a union definition."
    },
    ENUM: {
      value: DirectiveLocation.ENUM,
      description: "Location adjacent to an enum definition."
    },
    ENUM_VALUE: {
      value: DirectiveLocation.ENUM_VALUE,
      description: "Location adjacent to an enum value definition."
    },
    INPUT_OBJECT: {
      value: DirectiveLocation.INPUT_OBJECT,
      description: "Location adjacent to an input object type definition."
    },
    INPUT_FIELD_DEFINITION: {
      value: DirectiveLocation.INPUT_FIELD_DEFINITION,
      description: "Location adjacent to an input object field definition."
    }
  }
});
var __Type = new GraphQLObjectType({
  name: "__Type",
  description: "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
  fields: /* @__PURE__ */ __name(() => ({
    kind: {
      type: new GraphQLNonNull(__TypeKind),
      resolve(type) {
        if (isScalarType(type)) {
          return TypeKind.SCALAR;
        }
        if (isObjectType(type)) {
          return TypeKind.OBJECT;
        }
        if (isInterfaceType(type)) {
          return TypeKind.INTERFACE;
        }
        if (isUnionType(type)) {
          return TypeKind.UNION;
        }
        if (isEnumType(type)) {
          return TypeKind.ENUM;
        }
        if (isInputObjectType(type)) {
          return TypeKind.INPUT_OBJECT;
        }
        if (isListType(type)) {
          return TypeKind.LIST;
        }
        if (isNonNullType(type)) {
          return TypeKind.NON_NULL;
        }
        invariant(false, `Unexpected type: "${inspect(type)}".`);
      }
    },
    name: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((type) => "name" in type ? type.name : void 0, "resolve")
    },
    description: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((type) => (
        /* c8 ignore next */
        "description" in type ? type.description : void 0
      ), "resolve")
    },
    specifiedByURL: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((obj) => "specifiedByURL" in obj ? obj.specifiedByURL : void 0, "resolve")
    },
    fields: {
      type: new GraphQLList(new GraphQLNonNull(__Field)),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(type, { includeDeprecated }) {
        if (isObjectType(type) || isInterfaceType(type)) {
          const fields = Object.values(type.getFields());
          return includeDeprecated ? fields : fields.filter((field) => field.deprecationReason == null);
        }
      }
    },
    interfaces: {
      type: new GraphQLList(new GraphQLNonNull(__Type)),
      resolve(type) {
        if (isObjectType(type) || isInterfaceType(type)) {
          return type.getInterfaces();
        }
      }
    },
    possibleTypes: {
      type: new GraphQLList(new GraphQLNonNull(__Type)),
      resolve(type, _args, _context, { schema: schema2 }) {
        if (isAbstractType(type)) {
          return schema2.getPossibleTypes(type);
        }
      }
    },
    enumValues: {
      type: new GraphQLList(new GraphQLNonNull(__EnumValue)),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(type, { includeDeprecated }) {
        if (isEnumType(type)) {
          const values = type.getValues();
          return includeDeprecated ? values : values.filter((field) => field.deprecationReason == null);
        }
      }
    },
    inputFields: {
      type: new GraphQLList(new GraphQLNonNull(__InputValue)),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(type, { includeDeprecated }) {
        if (isInputObjectType(type)) {
          const values = Object.values(type.getFields());
          return includeDeprecated ? values : values.filter((field) => field.deprecationReason == null);
        }
      }
    },
    ofType: {
      type: __Type,
      resolve: /* @__PURE__ */ __name((type) => "ofType" in type ? type.ofType : void 0, "resolve")
    },
    isOneOf: {
      type: GraphQLBoolean,
      resolve: /* @__PURE__ */ __name((type) => {
        if (isInputObjectType(type)) {
          return type.isOneOf;
        }
      }, "resolve")
    }
  }), "fields")
});
var __Field = new GraphQLObjectType({
  name: "__Field",
  description: "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
  fields: /* @__PURE__ */ __name(() => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: /* @__PURE__ */ __name((field) => field.name, "resolve")
    },
    description: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((field) => field.description, "resolve")
    },
    args: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__InputValue))
      ),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(field, { includeDeprecated }) {
        return includeDeprecated ? field.args : field.args.filter((arg) => arg.deprecationReason == null);
      }
    },
    type: {
      type: new GraphQLNonNull(__Type),
      resolve: /* @__PURE__ */ __name((field) => field.type, "resolve")
    },
    isDeprecated: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: /* @__PURE__ */ __name((field) => field.deprecationReason != null, "resolve")
    },
    deprecationReason: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((field) => field.deprecationReason, "resolve")
    }
  }), "fields")
});
var __InputValue = new GraphQLObjectType({
  name: "__InputValue",
  description: "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
  fields: /* @__PURE__ */ __name(() => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: /* @__PURE__ */ __name((inputValue) => inputValue.name, "resolve")
    },
    description: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((inputValue) => inputValue.description, "resolve")
    },
    type: {
      type: new GraphQLNonNull(__Type),
      resolve: /* @__PURE__ */ __name((inputValue) => inputValue.type, "resolve")
    },
    defaultValue: {
      type: GraphQLString,
      description: "A GraphQL-formatted string representing the default value for this input value.",
      resolve(inputValue) {
        const { type, defaultValue } = inputValue;
        const valueAST = astFromValue(defaultValue, type);
        return valueAST ? print(valueAST) : null;
      }
    },
    isDeprecated: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: /* @__PURE__ */ __name((field) => field.deprecationReason != null, "resolve")
    },
    deprecationReason: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((obj) => obj.deprecationReason, "resolve")
    }
  }), "fields")
});
var __EnumValue = new GraphQLObjectType({
  name: "__EnumValue",
  description: "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
  fields: /* @__PURE__ */ __name(() => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: /* @__PURE__ */ __name((enumValue) => enumValue.name, "resolve")
    },
    description: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((enumValue) => enumValue.description, "resolve")
    },
    isDeprecated: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: /* @__PURE__ */ __name((enumValue) => enumValue.deprecationReason != null, "resolve")
    },
    deprecationReason: {
      type: GraphQLString,
      resolve: /* @__PURE__ */ __name((enumValue) => enumValue.deprecationReason, "resolve")
    }
  }), "fields")
});
var TypeKind;
(function(TypeKind2) {
  TypeKind2["SCALAR"] = "SCALAR";
  TypeKind2["OBJECT"] = "OBJECT";
  TypeKind2["INTERFACE"] = "INTERFACE";
  TypeKind2["UNION"] = "UNION";
  TypeKind2["ENUM"] = "ENUM";
  TypeKind2["INPUT_OBJECT"] = "INPUT_OBJECT";
  TypeKind2["LIST"] = "LIST";
  TypeKind2["NON_NULL"] = "NON_NULL";
})(TypeKind || (TypeKind = {}));
var __TypeKind = new GraphQLEnumType({
  name: "__TypeKind",
  description: "An enum describing what kind of type a given `__Type` is.",
  values: {
    SCALAR: {
      value: TypeKind.SCALAR,
      description: "Indicates this type is a scalar."
    },
    OBJECT: {
      value: TypeKind.OBJECT,
      description: "Indicates this type is an object. `fields` and `interfaces` are valid fields."
    },
    INTERFACE: {
      value: TypeKind.INTERFACE,
      description: "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."
    },
    UNION: {
      value: TypeKind.UNION,
      description: "Indicates this type is a union. `possibleTypes` is a valid field."
    },
    ENUM: {
      value: TypeKind.ENUM,
      description: "Indicates this type is an enum. `enumValues` is a valid field."
    },
    INPUT_OBJECT: {
      value: TypeKind.INPUT_OBJECT,
      description: "Indicates this type is an input object. `inputFields` is a valid field."
    },
    LIST: {
      value: TypeKind.LIST,
      description: "Indicates this type is a list. `ofType` is a valid field."
    },
    NON_NULL: {
      value: TypeKind.NON_NULL,
      description: "Indicates this type is a non-null. `ofType` is a valid field."
    }
  }
});
var SchemaMetaFieldDef = {
  name: "__schema",
  type: new GraphQLNonNull(__Schema),
  description: "Access the current type schema of this server.",
  args: [],
  resolve: /* @__PURE__ */ __name((_source, _args, _context, { schema: schema2 }) => schema2, "resolve"),
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
};
var TypeMetaFieldDef = {
  name: "__type",
  type: __Type,
  description: "Request the type information of a single type.",
  args: [
    {
      name: "name",
      description: void 0,
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: void 0,
      deprecationReason: void 0,
      extensions: /* @__PURE__ */ Object.create(null),
      astNode: void 0
    }
  ],
  resolve: /* @__PURE__ */ __name((_source, { name }, _context, { schema: schema2 }) => schema2.getType(name), "resolve"),
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
};
var TypeNameMetaFieldDef = {
  name: "__typename",
  type: new GraphQLNonNull(GraphQLString),
  description: "The name of the current Object type at runtime.",
  args: [],
  resolve: /* @__PURE__ */ __name((_source, _args, _context, { parentType }) => parentType.name, "resolve"),
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
};
var introspectionTypes = Object.freeze([
  __Schema,
  __Directive,
  __DirectiveLocation,
  __Type,
  __Field,
  __InputValue,
  __EnumValue,
  __TypeKind
]);
function isIntrospectionType(type) {
  return introspectionTypes.some(({ name }) => type.name === name);
}
__name(isIntrospectionType, "isIntrospectionType");

// node_modules/graphql/type/schema.mjs
init_modules_watch_stub();
function isSchema(schema2) {
  return instanceOf(schema2, GraphQLSchema);
}
__name(isSchema, "isSchema");
function assertSchema(schema2) {
  if (!isSchema(schema2)) {
    throw new Error(`Expected ${inspect(schema2)} to be a GraphQL schema.`);
  }
  return schema2;
}
__name(assertSchema, "assertSchema");
var GraphQLSchema = class {
  static {
    __name(this, "GraphQLSchema");
  }
  // Used as a cache for validateSchema().
  constructor(config) {
    var _config$extensionASTN, _config$directives;
    this.__validationErrors = config.assumeValid === true ? [] : void 0;
    isObjectLike(config) || devAssert(false, "Must provide configuration object.");
    !config.types || Array.isArray(config.types) || devAssert(
      false,
      `"types" must be Array if provided but got: ${inspect(config.types)}.`
    );
    !config.directives || Array.isArray(config.directives) || devAssert(
      false,
      `"directives" must be Array if provided but got: ${inspect(config.directives)}.`
    );
    this.description = config.description;
    this.extensions = toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
    this._queryType = config.query;
    this._mutationType = config.mutation;
    this._subscriptionType = config.subscription;
    this._directives = (_config$directives = config.directives) !== null && _config$directives !== void 0 ? _config$directives : specifiedDirectives;
    const allReferencedTypes = new Set(config.types);
    if (config.types != null) {
      for (const type of config.types) {
        allReferencedTypes.delete(type);
        collectReferencedTypes(type, allReferencedTypes);
      }
    }
    if (this._queryType != null) {
      collectReferencedTypes(this._queryType, allReferencedTypes);
    }
    if (this._mutationType != null) {
      collectReferencedTypes(this._mutationType, allReferencedTypes);
    }
    if (this._subscriptionType != null) {
      collectReferencedTypes(this._subscriptionType, allReferencedTypes);
    }
    for (const directive of this._directives) {
      if (isDirective(directive)) {
        for (const arg of directive.args) {
          collectReferencedTypes(arg.type, allReferencedTypes);
        }
      }
    }
    collectReferencedTypes(__Schema, allReferencedTypes);
    this._typeMap = /* @__PURE__ */ Object.create(null);
    this._subTypeMap = /* @__PURE__ */ Object.create(null);
    this._implementationsMap = /* @__PURE__ */ Object.create(null);
    for (const namedType of allReferencedTypes) {
      if (namedType == null) {
        continue;
      }
      const typeName = namedType.name;
      typeName || devAssert(
        false,
        "One of the provided types for building the Schema is missing a name."
      );
      if (this._typeMap[typeName] !== void 0) {
        throw new Error(
          `Schema must contain uniquely named types but contains multiple types named "${typeName}".`
        );
      }
      this._typeMap[typeName] = namedType;
      if (isInterfaceType(namedType)) {
        for (const iface of namedType.getInterfaces()) {
          if (isInterfaceType(iface)) {
            let implementations = this._implementationsMap[iface.name];
            if (implementations === void 0) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: []
              };
            }
            implementations.interfaces.push(namedType);
          }
        }
      } else if (isObjectType(namedType)) {
        for (const iface of namedType.getInterfaces()) {
          if (isInterfaceType(iface)) {
            let implementations = this._implementationsMap[iface.name];
            if (implementations === void 0) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: []
              };
            }
            implementations.objects.push(namedType);
          }
        }
      }
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLSchema";
  }
  getQueryType() {
    return this._queryType;
  }
  getMutationType() {
    return this._mutationType;
  }
  getSubscriptionType() {
    return this._subscriptionType;
  }
  getRootType(operation) {
    switch (operation) {
      case OperationTypeNode.QUERY:
        return this.getQueryType();
      case OperationTypeNode.MUTATION:
        return this.getMutationType();
      case OperationTypeNode.SUBSCRIPTION:
        return this.getSubscriptionType();
    }
  }
  getTypeMap() {
    return this._typeMap;
  }
  getType(name) {
    return this.getTypeMap()[name];
  }
  getPossibleTypes(abstractType) {
    return isUnionType(abstractType) ? abstractType.getTypes() : this.getImplementations(abstractType).objects;
  }
  getImplementations(interfaceType) {
    const implementations = this._implementationsMap[interfaceType.name];
    return implementations !== null && implementations !== void 0 ? implementations : {
      objects: [],
      interfaces: []
    };
  }
  isSubType(abstractType, maybeSubType) {
    let map = this._subTypeMap[abstractType.name];
    if (map === void 0) {
      map = /* @__PURE__ */ Object.create(null);
      if (isUnionType(abstractType)) {
        for (const type of abstractType.getTypes()) {
          map[type.name] = true;
        }
      } else {
        const implementations = this.getImplementations(abstractType);
        for (const type of implementations.objects) {
          map[type.name] = true;
        }
        for (const type of implementations.interfaces) {
          map[type.name] = true;
        }
      }
      this._subTypeMap[abstractType.name] = map;
    }
    return map[maybeSubType.name] !== void 0;
  }
  getDirectives() {
    return this._directives;
  }
  getDirective(name) {
    return this.getDirectives().find((directive) => directive.name === name);
  }
  toConfig() {
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: Object.values(this.getTypeMap()),
      directives: this.getDirectives(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      assumeValid: this.__validationErrors !== void 0
    };
  }
};
function collectReferencedTypes(type, typeSet) {
  const namedType = getNamedType(type);
  if (!typeSet.has(namedType)) {
    typeSet.add(namedType);
    if (isUnionType(namedType)) {
      for (const memberType of namedType.getTypes()) {
        collectReferencedTypes(memberType, typeSet);
      }
    } else if (isObjectType(namedType) || isInterfaceType(namedType)) {
      for (const interfaceType of namedType.getInterfaces()) {
        collectReferencedTypes(interfaceType, typeSet);
      }
      for (const field of Object.values(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);
        for (const arg of field.args) {
          collectReferencedTypes(arg.type, typeSet);
        }
      }
    } else if (isInputObjectType(namedType)) {
      for (const field of Object.values(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);
      }
    }
  }
  return typeSet;
}
__name(collectReferencedTypes, "collectReferencedTypes");

// node_modules/graphql/type/validate.mjs
function validateSchema(schema2) {
  assertSchema(schema2);
  if (schema2.__validationErrors) {
    return schema2.__validationErrors;
  }
  const context = new SchemaValidationContext(schema2);
  validateRootTypes(context);
  validateDirectives(context);
  validateTypes(context);
  const errors = context.getErrors();
  schema2.__validationErrors = errors;
  return errors;
}
__name(validateSchema, "validateSchema");
function assertValidSchema(schema2) {
  const errors = validateSchema(schema2);
  if (errors.length !== 0) {
    throw new Error(errors.map((error) => error.message).join("\n\n"));
  }
}
__name(assertValidSchema, "assertValidSchema");
var SchemaValidationContext = class {
  static {
    __name(this, "SchemaValidationContext");
  }
  constructor(schema2) {
    this._errors = [];
    this.schema = schema2;
  }
  reportError(message, nodes) {
    const _nodes = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;
    this._errors.push(
      new GraphQLError(message, {
        nodes: _nodes
      })
    );
  }
  getErrors() {
    return this._errors;
  }
};
function validateRootTypes(context) {
  const schema2 = context.schema;
  const queryType = schema2.getQueryType();
  if (!queryType) {
    context.reportError("Query root type must be provided.", schema2.astNode);
  } else if (!isObjectType(queryType)) {
    var _getOperationTypeNode;
    context.reportError(
      `Query root type must be Object type, it cannot be ${inspect(
        queryType
      )}.`,
      (_getOperationTypeNode = getOperationTypeNode(
        schema2,
        OperationTypeNode.QUERY
      )) !== null && _getOperationTypeNode !== void 0 ? _getOperationTypeNode : queryType.astNode
    );
  }
  const mutationType = schema2.getMutationType();
  if (mutationType && !isObjectType(mutationType)) {
    var _getOperationTypeNode2;
    context.reportError(
      `Mutation root type must be Object type if provided, it cannot be ${inspect(mutationType)}.`,
      (_getOperationTypeNode2 = getOperationTypeNode(
        schema2,
        OperationTypeNode.MUTATION
      )) !== null && _getOperationTypeNode2 !== void 0 ? _getOperationTypeNode2 : mutationType.astNode
    );
  }
  const subscriptionType = schema2.getSubscriptionType();
  if (subscriptionType && !isObjectType(subscriptionType)) {
    var _getOperationTypeNode3;
    context.reportError(
      `Subscription root type must be Object type if provided, it cannot be ${inspect(subscriptionType)}.`,
      (_getOperationTypeNode3 = getOperationTypeNode(
        schema2,
        OperationTypeNode.SUBSCRIPTION
      )) !== null && _getOperationTypeNode3 !== void 0 ? _getOperationTypeNode3 : subscriptionType.astNode
    );
  }
}
__name(validateRootTypes, "validateRootTypes");
function getOperationTypeNode(schema2, operation) {
  var _flatMap$find;
  return (_flatMap$find = [schema2.astNode, ...schema2.extensionASTNodes].flatMap(
    // FIXME: https://github.com/graphql/graphql-js/issues/2203
    (schemaNode) => {
      var _schemaNode$operation;
      return (
        /* c8 ignore next */
        (_schemaNode$operation = schemaNode === null || schemaNode === void 0 ? void 0 : schemaNode.operationTypes) !== null && _schemaNode$operation !== void 0 ? _schemaNode$operation : []
      );
    }
  ).find((operationNode) => operationNode.operation === operation)) === null || _flatMap$find === void 0 ? void 0 : _flatMap$find.type;
}
__name(getOperationTypeNode, "getOperationTypeNode");
function validateDirectives(context) {
  for (const directive of context.schema.getDirectives()) {
    if (!isDirective(directive)) {
      context.reportError(
        `Expected directive but got: ${inspect(directive)}.`,
        directive === null || directive === void 0 ? void 0 : directive.astNode
      );
      continue;
    }
    validateName(context, directive);
    if (directive.locations.length === 0) {
      context.reportError(
        `Directive @${directive.name} must include 1 or more locations.`,
        directive.astNode
      );
    }
    for (const arg of directive.args) {
      validateName(context, arg);
      if (!isInputType(arg.type)) {
        context.reportError(
          `The type of @${directive.name}(${arg.name}:) must be Input Type but got: ${inspect(arg.type)}.`,
          arg.astNode
        );
      }
      if (isRequiredArgument(arg) && arg.deprecationReason != null) {
        var _arg$astNode;
        context.reportError(
          `Required argument @${directive.name}(${arg.name}:) cannot be deprecated.`,
          [
            getDeprecatedDirectiveNode(arg.astNode),
            (_arg$astNode = arg.astNode) === null || _arg$astNode === void 0 ? void 0 : _arg$astNode.type
          ]
        );
      }
    }
  }
}
__name(validateDirectives, "validateDirectives");
function validateName(context, node) {
  if (node.name.startsWith("__")) {
    context.reportError(
      `Name "${node.name}" must not begin with "__", which is reserved by GraphQL introspection.`,
      node.astNode
    );
  }
}
__name(validateName, "validateName");
function validateTypes(context) {
  const validateInputObjectCircularRefs = createInputObjectCircularRefsValidator(context);
  const typeMap = context.schema.getTypeMap();
  for (const type of Object.values(typeMap)) {
    if (!isNamedType(type)) {
      context.reportError(
        `Expected GraphQL named type but got: ${inspect(type)}.`,
        type.astNode
      );
      continue;
    }
    if (!isIntrospectionType(type)) {
      validateName(context, type);
    }
    if (isObjectType(type)) {
      validateFields(context, type);
      validateInterfaces(context, type);
    } else if (isInterfaceType(type)) {
      validateFields(context, type);
      validateInterfaces(context, type);
    } else if (isUnionType(type)) {
      validateUnionMembers(context, type);
    } else if (isEnumType(type)) {
      validateEnumValues(context, type);
    } else if (isInputObjectType(type)) {
      validateInputFields(context, type);
      validateInputObjectCircularRefs(type);
    }
  }
}
__name(validateTypes, "validateTypes");
function validateFields(context, type) {
  const fields = Object.values(type.getFields());
  if (fields.length === 0) {
    context.reportError(`Type ${type.name} must define one or more fields.`, [
      type.astNode,
      ...type.extensionASTNodes
    ]);
  }
  for (const field of fields) {
    validateName(context, field);
    if (!isOutputType(field.type)) {
      var _field$astNode;
      context.reportError(
        `The type of ${type.name}.${field.name} must be Output Type but got: ${inspect(field.type)}.`,
        (_field$astNode = field.astNode) === null || _field$astNode === void 0 ? void 0 : _field$astNode.type
      );
    }
    for (const arg of field.args) {
      const argName = arg.name;
      validateName(context, arg);
      if (!isInputType(arg.type)) {
        var _arg$astNode2;
        context.reportError(
          `The type of ${type.name}.${field.name}(${argName}:) must be Input Type but got: ${inspect(arg.type)}.`,
          (_arg$astNode2 = arg.astNode) === null || _arg$astNode2 === void 0 ? void 0 : _arg$astNode2.type
        );
      }
      if (isRequiredArgument(arg) && arg.deprecationReason != null) {
        var _arg$astNode3;
        context.reportError(
          `Required argument ${type.name}.${field.name}(${argName}:) cannot be deprecated.`,
          [
            getDeprecatedDirectiveNode(arg.astNode),
            (_arg$astNode3 = arg.astNode) === null || _arg$astNode3 === void 0 ? void 0 : _arg$astNode3.type
          ]
        );
      }
    }
  }
}
__name(validateFields, "validateFields");
function validateInterfaces(context, type) {
  const ifaceTypeNames = /* @__PURE__ */ Object.create(null);
  for (const iface of type.getInterfaces()) {
    if (!isInterfaceType(iface)) {
      context.reportError(
        `Type ${inspect(type)} must only implement Interface types, it cannot implement ${inspect(iface)}.`,
        getAllImplementsInterfaceNodes(type, iface)
      );
      continue;
    }
    if (type === iface) {
      context.reportError(
        `Type ${type.name} cannot implement itself because it would create a circular reference.`,
        getAllImplementsInterfaceNodes(type, iface)
      );
      continue;
    }
    if (ifaceTypeNames[iface.name]) {
      context.reportError(
        `Type ${type.name} can only implement ${iface.name} once.`,
        getAllImplementsInterfaceNodes(type, iface)
      );
      continue;
    }
    ifaceTypeNames[iface.name] = true;
    validateTypeImplementsAncestors(context, type, iface);
    validateTypeImplementsInterface(context, type, iface);
  }
}
__name(validateInterfaces, "validateInterfaces");
function validateTypeImplementsInterface(context, type, iface) {
  const typeFieldMap = type.getFields();
  for (const ifaceField of Object.values(iface.getFields())) {
    const fieldName = ifaceField.name;
    const typeField = typeFieldMap[fieldName];
    if (!typeField) {
      context.reportError(
        `Interface field ${iface.name}.${fieldName} expected but ${type.name} does not provide it.`,
        [ifaceField.astNode, type.astNode, ...type.extensionASTNodes]
      );
      continue;
    }
    if (!isTypeSubTypeOf(context.schema, typeField.type, ifaceField.type)) {
      var _ifaceField$astNode, _typeField$astNode;
      context.reportError(
        `Interface field ${iface.name}.${fieldName} expects type ${inspect(ifaceField.type)} but ${type.name}.${fieldName} is type ${inspect(typeField.type)}.`,
        [
          (_ifaceField$astNode = ifaceField.astNode) === null || _ifaceField$astNode === void 0 ? void 0 : _ifaceField$astNode.type,
          (_typeField$astNode = typeField.astNode) === null || _typeField$astNode === void 0 ? void 0 : _typeField$astNode.type
        ]
      );
    }
    for (const ifaceArg of ifaceField.args) {
      const argName = ifaceArg.name;
      const typeArg = typeField.args.find((arg) => arg.name === argName);
      if (!typeArg) {
        context.reportError(
          `Interface field argument ${iface.name}.${fieldName}(${argName}:) expected but ${type.name}.${fieldName} does not provide it.`,
          [ifaceArg.astNode, typeField.astNode]
        );
        continue;
      }
      if (!isEqualType(ifaceArg.type, typeArg.type)) {
        var _ifaceArg$astNode, _typeArg$astNode;
        context.reportError(
          `Interface field argument ${iface.name}.${fieldName}(${argName}:) expects type ${inspect(ifaceArg.type)} but ${type.name}.${fieldName}(${argName}:) is type ${inspect(typeArg.type)}.`,
          [
            (_ifaceArg$astNode = ifaceArg.astNode) === null || _ifaceArg$astNode === void 0 ? void 0 : _ifaceArg$astNode.type,
            (_typeArg$astNode = typeArg.astNode) === null || _typeArg$astNode === void 0 ? void 0 : _typeArg$astNode.type
          ]
        );
      }
    }
    for (const typeArg of typeField.args) {
      const argName = typeArg.name;
      const ifaceArg = ifaceField.args.find((arg) => arg.name === argName);
      if (!ifaceArg && isRequiredArgument(typeArg)) {
        context.reportError(
          `Object field ${type.name}.${fieldName} includes required argument ${argName} that is missing from the Interface field ${iface.name}.${fieldName}.`,
          [typeArg.astNode, ifaceField.astNode]
        );
      }
    }
  }
}
__name(validateTypeImplementsInterface, "validateTypeImplementsInterface");
function validateTypeImplementsAncestors(context, type, iface) {
  const ifaceInterfaces = type.getInterfaces();
  for (const transitive of iface.getInterfaces()) {
    if (!ifaceInterfaces.includes(transitive)) {
      context.reportError(
        transitive === type ? `Type ${type.name} cannot implement ${iface.name} because it would create a circular reference.` : `Type ${type.name} must implement ${transitive.name} because it is implemented by ${iface.name}.`,
        [
          ...getAllImplementsInterfaceNodes(iface, transitive),
          ...getAllImplementsInterfaceNodes(type, iface)
        ]
      );
    }
  }
}
__name(validateTypeImplementsAncestors, "validateTypeImplementsAncestors");
function validateUnionMembers(context, union2) {
  const memberTypes = union2.getTypes();
  if (memberTypes.length === 0) {
    context.reportError(
      `Union type ${union2.name} must define one or more member types.`,
      [union2.astNode, ...union2.extensionASTNodes]
    );
  }
  const includedTypeNames = /* @__PURE__ */ Object.create(null);
  for (const memberType of memberTypes) {
    if (includedTypeNames[memberType.name]) {
      context.reportError(
        `Union type ${union2.name} can only include type ${memberType.name} once.`,
        getUnionMemberTypeNodes(union2, memberType.name)
      );
      continue;
    }
    includedTypeNames[memberType.name] = true;
    if (!isObjectType(memberType)) {
      context.reportError(
        `Union type ${union2.name} can only include Object types, it cannot include ${inspect(memberType)}.`,
        getUnionMemberTypeNodes(union2, String(memberType))
      );
    }
  }
}
__name(validateUnionMembers, "validateUnionMembers");
function validateEnumValues(context, enumType) {
  const enumValues = enumType.getValues();
  if (enumValues.length === 0) {
    context.reportError(
      `Enum type ${enumType.name} must define one or more values.`,
      [enumType.astNode, ...enumType.extensionASTNodes]
    );
  }
  for (const enumValue of enumValues) {
    validateName(context, enumValue);
  }
}
__name(validateEnumValues, "validateEnumValues");
function validateInputFields(context, inputObj) {
  const fields = Object.values(inputObj.getFields());
  if (fields.length === 0) {
    context.reportError(
      `Input Object type ${inputObj.name} must define one or more fields.`,
      [inputObj.astNode, ...inputObj.extensionASTNodes]
    );
  }
  for (const field of fields) {
    validateName(context, field);
    if (!isInputType(field.type)) {
      var _field$astNode2;
      context.reportError(
        `The type of ${inputObj.name}.${field.name} must be Input Type but got: ${inspect(field.type)}.`,
        (_field$astNode2 = field.astNode) === null || _field$astNode2 === void 0 ? void 0 : _field$astNode2.type
      );
    }
    if (isRequiredInputField(field) && field.deprecationReason != null) {
      var _field$astNode3;
      context.reportError(
        `Required input field ${inputObj.name}.${field.name} cannot be deprecated.`,
        [
          getDeprecatedDirectiveNode(field.astNode),
          (_field$astNode3 = field.astNode) === null || _field$astNode3 === void 0 ? void 0 : _field$astNode3.type
        ]
      );
    }
    if (inputObj.isOneOf) {
      validateOneOfInputObjectField(inputObj, field, context);
    }
  }
}
__name(validateInputFields, "validateInputFields");
function validateOneOfInputObjectField(type, field, context) {
  if (isNonNullType(field.type)) {
    var _field$astNode4;
    context.reportError(
      `OneOf input field ${type.name}.${field.name} must be nullable.`,
      (_field$astNode4 = field.astNode) === null || _field$astNode4 === void 0 ? void 0 : _field$astNode4.type
    );
  }
  if (field.defaultValue !== void 0) {
    context.reportError(
      `OneOf input field ${type.name}.${field.name} cannot have a default value.`,
      field.astNode
    );
  }
}
__name(validateOneOfInputObjectField, "validateOneOfInputObjectField");
function createInputObjectCircularRefsValidator(context) {
  const visitedTypes = /* @__PURE__ */ Object.create(null);
  const fieldPath = [];
  const fieldPathIndexByTypeName = /* @__PURE__ */ Object.create(null);
  return detectCycleRecursive;
  function detectCycleRecursive(inputObj) {
    if (visitedTypes[inputObj.name]) {
      return;
    }
    visitedTypes[inputObj.name] = true;
    fieldPathIndexByTypeName[inputObj.name] = fieldPath.length;
    const fields = Object.values(inputObj.getFields());
    for (const field of fields) {
      if (isNonNullType(field.type) && isInputObjectType(field.type.ofType)) {
        const fieldType = field.type.ofType;
        const cycleIndex = fieldPathIndexByTypeName[fieldType.name];
        fieldPath.push(field);
        if (cycleIndex === void 0) {
          detectCycleRecursive(fieldType);
        } else {
          const cyclePath = fieldPath.slice(cycleIndex);
          const pathStr = cyclePath.map((fieldObj) => fieldObj.name).join(".");
          context.reportError(
            `Cannot reference Input Object "${fieldType.name}" within itself through a series of non-null fields: "${pathStr}".`,
            cyclePath.map((fieldObj) => fieldObj.astNode)
          );
        }
        fieldPath.pop();
      }
    }
    fieldPathIndexByTypeName[inputObj.name] = void 0;
  }
  __name(detectCycleRecursive, "detectCycleRecursive");
}
__name(createInputObjectCircularRefsValidator, "createInputObjectCircularRefsValidator");
function getAllImplementsInterfaceNodes(type, iface) {
  const { astNode, extensionASTNodes } = type;
  const nodes = astNode != null ? [astNode, ...extensionASTNodes] : extensionASTNodes;
  return nodes.flatMap((typeNode) => {
    var _typeNode$interfaces;
    return (
      /* c8 ignore next */
      (_typeNode$interfaces = typeNode.interfaces) !== null && _typeNode$interfaces !== void 0 ? _typeNode$interfaces : []
    );
  }).filter((ifaceNode) => ifaceNode.name.value === iface.name);
}
__name(getAllImplementsInterfaceNodes, "getAllImplementsInterfaceNodes");
function getUnionMemberTypeNodes(union2, typeName) {
  const { astNode, extensionASTNodes } = union2;
  const nodes = astNode != null ? [astNode, ...extensionASTNodes] : extensionASTNodes;
  return nodes.flatMap((unionNode) => {
    var _unionNode$types;
    return (
      /* c8 ignore next */
      (_unionNode$types = unionNode.types) !== null && _unionNode$types !== void 0 ? _unionNode$types : []
    );
  }).filter((typeNode) => typeNode.name.value === typeName);
}
__name(getUnionMemberTypeNodes, "getUnionMemberTypeNodes");
function getDeprecatedDirectiveNode(definitionNode) {
  var _definitionNode$direc;
  return definitionNode === null || definitionNode === void 0 ? void 0 : (_definitionNode$direc = definitionNode.directives) === null || _definitionNode$direc === void 0 ? void 0 : _definitionNode$direc.find(
    (node) => node.name.value === GraphQLDeprecatedDirective.name
  );
}
__name(getDeprecatedDirectiveNode, "getDeprecatedDirectiveNode");

// node_modules/graphql/validation/validate.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/TypeInfo.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/typeFromAST.mjs
init_modules_watch_stub();
function typeFromAST(schema2, typeNode) {
  switch (typeNode.kind) {
    case Kind.LIST_TYPE: {
      const innerType = typeFromAST(schema2, typeNode.type);
      return innerType && new GraphQLList(innerType);
    }
    case Kind.NON_NULL_TYPE: {
      const innerType = typeFromAST(schema2, typeNode.type);
      return innerType && new GraphQLNonNull(innerType);
    }
    case Kind.NAMED_TYPE:
      return schema2.getType(typeNode.name.value);
  }
}
__name(typeFromAST, "typeFromAST");

// node_modules/graphql/utilities/TypeInfo.mjs
var TypeInfo = class {
  static {
    __name(this, "TypeInfo");
  }
  constructor(schema2, initialType, getFieldDefFn) {
    this._schema = schema2;
    this._typeStack = [];
    this._parentTypeStack = [];
    this._inputTypeStack = [];
    this._fieldDefStack = [];
    this._defaultValueStack = [];
    this._directive = null;
    this._argument = null;
    this._enumValue = null;
    this._getFieldDef = getFieldDefFn !== null && getFieldDefFn !== void 0 ? getFieldDefFn : getFieldDef;
    if (initialType) {
      if (isInputType(initialType)) {
        this._inputTypeStack.push(initialType);
      }
      if (isCompositeType(initialType)) {
        this._parentTypeStack.push(initialType);
      }
      if (isOutputType(initialType)) {
        this._typeStack.push(initialType);
      }
    }
  }
  get [Symbol.toStringTag]() {
    return "TypeInfo";
  }
  getType() {
    if (this._typeStack.length > 0) {
      return this._typeStack[this._typeStack.length - 1];
    }
  }
  getParentType() {
    if (this._parentTypeStack.length > 0) {
      return this._parentTypeStack[this._parentTypeStack.length - 1];
    }
  }
  getInputType() {
    if (this._inputTypeStack.length > 0) {
      return this._inputTypeStack[this._inputTypeStack.length - 1];
    }
  }
  getParentInputType() {
    if (this._inputTypeStack.length > 1) {
      return this._inputTypeStack[this._inputTypeStack.length - 2];
    }
  }
  getFieldDef() {
    if (this._fieldDefStack.length > 0) {
      return this._fieldDefStack[this._fieldDefStack.length - 1];
    }
  }
  getDefaultValue() {
    if (this._defaultValueStack.length > 0) {
      return this._defaultValueStack[this._defaultValueStack.length - 1];
    }
  }
  getDirective() {
    return this._directive;
  }
  getArgument() {
    return this._argument;
  }
  getEnumValue() {
    return this._enumValue;
  }
  enter(node) {
    const schema2 = this._schema;
    switch (node.kind) {
      case Kind.SELECTION_SET: {
        const namedType = getNamedType(this.getType());
        this._parentTypeStack.push(
          isCompositeType(namedType) ? namedType : void 0
        );
        break;
      }
      case Kind.FIELD: {
        const parentType = this.getParentType();
        let fieldDef;
        let fieldType;
        if (parentType) {
          fieldDef = this._getFieldDef(schema2, parentType, node);
          if (fieldDef) {
            fieldType = fieldDef.type;
          }
        }
        this._fieldDefStack.push(fieldDef);
        this._typeStack.push(isOutputType(fieldType) ? fieldType : void 0);
        break;
      }
      case Kind.DIRECTIVE:
        this._directive = schema2.getDirective(node.name.value);
        break;
      case Kind.OPERATION_DEFINITION: {
        const rootType = schema2.getRootType(node.operation);
        this._typeStack.push(isObjectType(rootType) ? rootType : void 0);
        break;
      }
      case Kind.INLINE_FRAGMENT:
      case Kind.FRAGMENT_DEFINITION: {
        const typeConditionAST = node.typeCondition;
        const outputType = typeConditionAST ? typeFromAST(schema2, typeConditionAST) : getNamedType(this.getType());
        this._typeStack.push(isOutputType(outputType) ? outputType : void 0);
        break;
      }
      case Kind.VARIABLE_DEFINITION: {
        const inputType = typeFromAST(schema2, node.type);
        this._inputTypeStack.push(
          isInputType(inputType) ? inputType : void 0
        );
        break;
      }
      case Kind.ARGUMENT: {
        var _this$getDirective;
        let argDef;
        let argType;
        const fieldOrDirective = (_this$getDirective = this.getDirective()) !== null && _this$getDirective !== void 0 ? _this$getDirective : this.getFieldDef();
        if (fieldOrDirective) {
          argDef = fieldOrDirective.args.find(
            (arg) => arg.name === node.name.value
          );
          if (argDef) {
            argType = argDef.type;
          }
        }
        this._argument = argDef;
        this._defaultValueStack.push(argDef ? argDef.defaultValue : void 0);
        this._inputTypeStack.push(isInputType(argType) ? argType : void 0);
        break;
      }
      case Kind.LIST: {
        const listType = getNullableType(this.getInputType());
        const itemType = isListType(listType) ? listType.ofType : listType;
        this._defaultValueStack.push(void 0);
        this._inputTypeStack.push(isInputType(itemType) ? itemType : void 0);
        break;
      }
      case Kind.OBJECT_FIELD: {
        const objectType = getNamedType(this.getInputType());
        let inputFieldType;
        let inputField;
        if (isInputObjectType(objectType)) {
          inputField = objectType.getFields()[node.name.value];
          if (inputField) {
            inputFieldType = inputField.type;
          }
        }
        this._defaultValueStack.push(
          inputField ? inputField.defaultValue : void 0
        );
        this._inputTypeStack.push(
          isInputType(inputFieldType) ? inputFieldType : void 0
        );
        break;
      }
      case Kind.ENUM: {
        const enumType = getNamedType(this.getInputType());
        let enumValue;
        if (isEnumType(enumType)) {
          enumValue = enumType.getValue(node.value);
        }
        this._enumValue = enumValue;
        break;
      }
      default:
    }
  }
  leave(node) {
    switch (node.kind) {
      case Kind.SELECTION_SET:
        this._parentTypeStack.pop();
        break;
      case Kind.FIELD:
        this._fieldDefStack.pop();
        this._typeStack.pop();
        break;
      case Kind.DIRECTIVE:
        this._directive = null;
        break;
      case Kind.OPERATION_DEFINITION:
      case Kind.INLINE_FRAGMENT:
      case Kind.FRAGMENT_DEFINITION:
        this._typeStack.pop();
        break;
      case Kind.VARIABLE_DEFINITION:
        this._inputTypeStack.pop();
        break;
      case Kind.ARGUMENT:
        this._argument = null;
        this._defaultValueStack.pop();
        this._inputTypeStack.pop();
        break;
      case Kind.LIST:
      case Kind.OBJECT_FIELD:
        this._defaultValueStack.pop();
        this._inputTypeStack.pop();
        break;
      case Kind.ENUM:
        this._enumValue = null;
        break;
      default:
    }
  }
};
function getFieldDef(schema2, parentType, fieldNode) {
  const name = fieldNode.name.value;
  if (name === SchemaMetaFieldDef.name && schema2.getQueryType() === parentType) {
    return SchemaMetaFieldDef;
  }
  if (name === TypeMetaFieldDef.name && schema2.getQueryType() === parentType) {
    return TypeMetaFieldDef;
  }
  if (name === TypeNameMetaFieldDef.name && isCompositeType(parentType)) {
    return TypeNameMetaFieldDef;
  }
  if (isObjectType(parentType) || isInterfaceType(parentType)) {
    return parentType.getFields()[name];
  }
}
__name(getFieldDef, "getFieldDef");
function visitWithTypeInfo(typeInfo, visitor) {
  return {
    enter(...args) {
      const node = args[0];
      typeInfo.enter(node);
      const fn = getEnterLeaveForKind(visitor, node.kind).enter;
      if (fn) {
        const result = fn.apply(visitor, args);
        if (result !== void 0) {
          typeInfo.leave(node);
          if (isNode(result)) {
            typeInfo.enter(result);
          }
        }
        return result;
      }
    },
    leave(...args) {
      const node = args[0];
      const fn = getEnterLeaveForKind(visitor, node.kind).leave;
      let result;
      if (fn) {
        result = fn.apply(visitor, args);
      }
      typeInfo.leave(node);
      return result;
    }
  };
}
__name(visitWithTypeInfo, "visitWithTypeInfo");

// node_modules/graphql/validation/specifiedRules.mjs
init_modules_watch_stub();

// node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs
init_modules_watch_stub();

// node_modules/graphql/language/predicates.mjs
init_modules_watch_stub();
function isDefinitionNode(node) {
  return isExecutableDefinitionNode(node) || isTypeSystemDefinitionNode(node) || isTypeSystemExtensionNode(node);
}
__name(isDefinitionNode, "isDefinitionNode");
function isExecutableDefinitionNode(node) {
  return node.kind === Kind.OPERATION_DEFINITION || node.kind === Kind.FRAGMENT_DEFINITION;
}
__name(isExecutableDefinitionNode, "isExecutableDefinitionNode");
function isTypeSystemDefinitionNode(node) {
  return node.kind === Kind.SCHEMA_DEFINITION || isTypeDefinitionNode(node) || node.kind === Kind.DIRECTIVE_DEFINITION;
}
__name(isTypeSystemDefinitionNode, "isTypeSystemDefinitionNode");
function isTypeDefinitionNode(node) {
  return node.kind === Kind.SCALAR_TYPE_DEFINITION || node.kind === Kind.OBJECT_TYPE_DEFINITION || node.kind === Kind.INTERFACE_TYPE_DEFINITION || node.kind === Kind.UNION_TYPE_DEFINITION || node.kind === Kind.ENUM_TYPE_DEFINITION || node.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION;
}
__name(isTypeDefinitionNode, "isTypeDefinitionNode");
function isTypeSystemExtensionNode(node) {
  return node.kind === Kind.SCHEMA_EXTENSION || isTypeExtensionNode(node);
}
__name(isTypeSystemExtensionNode, "isTypeSystemExtensionNode");
function isTypeExtensionNode(node) {
  return node.kind === Kind.SCALAR_TYPE_EXTENSION || node.kind === Kind.OBJECT_TYPE_EXTENSION || node.kind === Kind.INTERFACE_TYPE_EXTENSION || node.kind === Kind.UNION_TYPE_EXTENSION || node.kind === Kind.ENUM_TYPE_EXTENSION || node.kind === Kind.INPUT_OBJECT_TYPE_EXTENSION;
}
__name(isTypeExtensionNode, "isTypeExtensionNode");

// node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs
function ExecutableDefinitionsRule(context) {
  return {
    Document(node) {
      for (const definition of node.definitions) {
        if (!isExecutableDefinitionNode(definition)) {
          const defName = definition.kind === Kind.SCHEMA_DEFINITION || definition.kind === Kind.SCHEMA_EXTENSION ? "schema" : '"' + definition.name.value + '"';
          context.reportError(
            new GraphQLError(`The ${defName} definition is not executable.`, {
              nodes: definition
            })
          );
        }
      }
      return false;
    }
  };
}
__name(ExecutableDefinitionsRule, "ExecutableDefinitionsRule");

// node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.mjs
init_modules_watch_stub();
function FieldsOnCorrectTypeRule(context) {
  return {
    Field(node) {
      const type = context.getParentType();
      if (type) {
        const fieldDef = context.getFieldDef();
        if (!fieldDef) {
          const schema2 = context.getSchema();
          const fieldName = node.name.value;
          let suggestion = didYouMean(
            "to use an inline fragment on",
            getSuggestedTypeNames(schema2, type, fieldName)
          );
          if (suggestion === "") {
            suggestion = didYouMean(getSuggestedFieldNames(type, fieldName));
          }
          context.reportError(
            new GraphQLError(
              `Cannot query field "${fieldName}" on type "${type.name}".` + suggestion,
              {
                nodes: node
              }
            )
          );
        }
      }
    }
  };
}
__name(FieldsOnCorrectTypeRule, "FieldsOnCorrectTypeRule");
function getSuggestedTypeNames(schema2, type, fieldName) {
  if (!isAbstractType(type)) {
    return [];
  }
  const suggestedTypes = /* @__PURE__ */ new Set();
  const usageCount = /* @__PURE__ */ Object.create(null);
  for (const possibleType of schema2.getPossibleTypes(type)) {
    if (!possibleType.getFields()[fieldName]) {
      continue;
    }
    suggestedTypes.add(possibleType);
    usageCount[possibleType.name] = 1;
    for (const possibleInterface of possibleType.getInterfaces()) {
      var _usageCount$possibleI;
      if (!possibleInterface.getFields()[fieldName]) {
        continue;
      }
      suggestedTypes.add(possibleInterface);
      usageCount[possibleInterface.name] = ((_usageCount$possibleI = usageCount[possibleInterface.name]) !== null && _usageCount$possibleI !== void 0 ? _usageCount$possibleI : 0) + 1;
    }
  }
  return [...suggestedTypes].sort((typeA, typeB) => {
    const usageCountDiff = usageCount[typeB.name] - usageCount[typeA.name];
    if (usageCountDiff !== 0) {
      return usageCountDiff;
    }
    if (isInterfaceType(typeA) && schema2.isSubType(typeA, typeB)) {
      return -1;
    }
    if (isInterfaceType(typeB) && schema2.isSubType(typeB, typeA)) {
      return 1;
    }
    return naturalCompare(typeA.name, typeB.name);
  }).map((x) => x.name);
}
__name(getSuggestedTypeNames, "getSuggestedTypeNames");
function getSuggestedFieldNames(type, fieldName) {
  if (isObjectType(type) || isInterfaceType(type)) {
    const possibleFieldNames = Object.keys(type.getFields());
    return suggestionList(fieldName, possibleFieldNames);
  }
  return [];
}
__name(getSuggestedFieldNames, "getSuggestedFieldNames");

// node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.mjs
init_modules_watch_stub();
function FragmentsOnCompositeTypesRule(context) {
  return {
    InlineFragment(node) {
      const typeCondition = node.typeCondition;
      if (typeCondition) {
        const type = typeFromAST(context.getSchema(), typeCondition);
        if (type && !isCompositeType(type)) {
          const typeStr = print(typeCondition);
          context.reportError(
            new GraphQLError(
              `Fragment cannot condition on non composite type "${typeStr}".`,
              {
                nodes: typeCondition
              }
            )
          );
        }
      }
    },
    FragmentDefinition(node) {
      const type = typeFromAST(context.getSchema(), node.typeCondition);
      if (type && !isCompositeType(type)) {
        const typeStr = print(node.typeCondition);
        context.reportError(
          new GraphQLError(
            `Fragment "${node.name.value}" cannot condition on non composite type "${typeStr}".`,
            {
              nodes: node.typeCondition
            }
          )
        );
      }
    }
  };
}
__name(FragmentsOnCompositeTypesRule, "FragmentsOnCompositeTypesRule");

// node_modules/graphql/validation/rules/KnownArgumentNamesRule.mjs
init_modules_watch_stub();
function KnownArgumentNamesRule(context) {
  return {
    // eslint-disable-next-line new-cap
    ...KnownArgumentNamesOnDirectivesRule(context),
    Argument(argNode) {
      const argDef = context.getArgument();
      const fieldDef = context.getFieldDef();
      const parentType = context.getParentType();
      if (!argDef && fieldDef && parentType) {
        const argName = argNode.name.value;
        const knownArgsNames = fieldDef.args.map((arg) => arg.name);
        const suggestions = suggestionList(argName, knownArgsNames);
        context.reportError(
          new GraphQLError(
            `Unknown argument "${argName}" on field "${parentType.name}.${fieldDef.name}".` + didYouMean(suggestions),
            {
              nodes: argNode
            }
          )
        );
      }
    }
  };
}
__name(KnownArgumentNamesRule, "KnownArgumentNamesRule");
function KnownArgumentNamesOnDirectivesRule(context) {
  const directiveArgs = /* @__PURE__ */ Object.create(null);
  const schema2 = context.getSchema();
  const definedDirectives = schema2 ? schema2.getDirectives() : specifiedDirectives;
  for (const directive of definedDirectives) {
    directiveArgs[directive.name] = directive.args.map((arg) => arg.name);
  }
  const astDefinitions = context.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;
      const argsNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
      directiveArgs[def.name.value] = argsNodes.map((arg) => arg.name.value);
    }
  }
  return {
    Directive(directiveNode) {
      const directiveName = directiveNode.name.value;
      const knownArgs = directiveArgs[directiveName];
      if (directiveNode.arguments && knownArgs) {
        for (const argNode of directiveNode.arguments) {
          const argName = argNode.name.value;
          if (!knownArgs.includes(argName)) {
            const suggestions = suggestionList(argName, knownArgs);
            context.reportError(
              new GraphQLError(
                `Unknown argument "${argName}" on directive "@${directiveName}".` + didYouMean(suggestions),
                {
                  nodes: argNode
                }
              )
            );
          }
        }
      }
      return false;
    }
  };
}
__name(KnownArgumentNamesOnDirectivesRule, "KnownArgumentNamesOnDirectivesRule");

// node_modules/graphql/validation/rules/KnownDirectivesRule.mjs
init_modules_watch_stub();
function KnownDirectivesRule(context) {
  const locationsMap = /* @__PURE__ */ Object.create(null);
  const schema2 = context.getSchema();
  const definedDirectives = schema2 ? schema2.getDirectives() : specifiedDirectives;
  for (const directive of definedDirectives) {
    locationsMap[directive.name] = directive.locations;
  }
  const astDefinitions = context.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      locationsMap[def.name.value] = def.locations.map((name) => name.value);
    }
  }
  return {
    Directive(node, _key, _parent, _path, ancestors) {
      const name = node.name.value;
      const locations = locationsMap[name];
      if (!locations) {
        context.reportError(
          new GraphQLError(`Unknown directive "@${name}".`, {
            nodes: node
          })
        );
        return;
      }
      const candidateLocation = getDirectiveLocationForASTPath(ancestors);
      if (candidateLocation && !locations.includes(candidateLocation)) {
        context.reportError(
          new GraphQLError(
            `Directive "@${name}" may not be used on ${candidateLocation}.`,
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
__name(KnownDirectivesRule, "KnownDirectivesRule");
function getDirectiveLocationForASTPath(ancestors) {
  const appliedTo = ancestors[ancestors.length - 1];
  "kind" in appliedTo || invariant(false);
  switch (appliedTo.kind) {
    case Kind.OPERATION_DEFINITION:
      return getDirectiveLocationForOperation(appliedTo.operation);
    case Kind.FIELD:
      return DirectiveLocation.FIELD;
    case Kind.FRAGMENT_SPREAD:
      return DirectiveLocation.FRAGMENT_SPREAD;
    case Kind.INLINE_FRAGMENT:
      return DirectiveLocation.INLINE_FRAGMENT;
    case Kind.FRAGMENT_DEFINITION:
      return DirectiveLocation.FRAGMENT_DEFINITION;
    case Kind.VARIABLE_DEFINITION:
      return DirectiveLocation.VARIABLE_DEFINITION;
    case Kind.SCHEMA_DEFINITION:
    case Kind.SCHEMA_EXTENSION:
      return DirectiveLocation.SCHEMA;
    case Kind.SCALAR_TYPE_DEFINITION:
    case Kind.SCALAR_TYPE_EXTENSION:
      return DirectiveLocation.SCALAR;
    case Kind.OBJECT_TYPE_DEFINITION:
    case Kind.OBJECT_TYPE_EXTENSION:
      return DirectiveLocation.OBJECT;
    case Kind.FIELD_DEFINITION:
      return DirectiveLocation.FIELD_DEFINITION;
    case Kind.INTERFACE_TYPE_DEFINITION:
    case Kind.INTERFACE_TYPE_EXTENSION:
      return DirectiveLocation.INTERFACE;
    case Kind.UNION_TYPE_DEFINITION:
    case Kind.UNION_TYPE_EXTENSION:
      return DirectiveLocation.UNION;
    case Kind.ENUM_TYPE_DEFINITION:
    case Kind.ENUM_TYPE_EXTENSION:
      return DirectiveLocation.ENUM;
    case Kind.ENUM_VALUE_DEFINITION:
      return DirectiveLocation.ENUM_VALUE;
    case Kind.INPUT_OBJECT_TYPE_DEFINITION:
    case Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return DirectiveLocation.INPUT_OBJECT;
    case Kind.INPUT_VALUE_DEFINITION: {
      const parentNode = ancestors[ancestors.length - 3];
      "kind" in parentNode || invariant(false);
      return parentNode.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION ? DirectiveLocation.INPUT_FIELD_DEFINITION : DirectiveLocation.ARGUMENT_DEFINITION;
    }
    // Not reachable, all possible types have been considered.
    /* c8 ignore next */
    default:
      invariant(false, "Unexpected kind: " + inspect(appliedTo.kind));
  }
}
__name(getDirectiveLocationForASTPath, "getDirectiveLocationForASTPath");
function getDirectiveLocationForOperation(operation) {
  switch (operation) {
    case OperationTypeNode.QUERY:
      return DirectiveLocation.QUERY;
    case OperationTypeNode.MUTATION:
      return DirectiveLocation.MUTATION;
    case OperationTypeNode.SUBSCRIPTION:
      return DirectiveLocation.SUBSCRIPTION;
  }
}
__name(getDirectiveLocationForOperation, "getDirectiveLocationForOperation");

// node_modules/graphql/validation/rules/KnownFragmentNamesRule.mjs
init_modules_watch_stub();
function KnownFragmentNamesRule(context) {
  return {
    FragmentSpread(node) {
      const fragmentName = node.name.value;
      const fragment = context.getFragment(fragmentName);
      if (!fragment) {
        context.reportError(
          new GraphQLError(`Unknown fragment "${fragmentName}".`, {
            nodes: node.name
          })
        );
      }
    }
  };
}
__name(KnownFragmentNamesRule, "KnownFragmentNamesRule");

// node_modules/graphql/validation/rules/KnownTypeNamesRule.mjs
init_modules_watch_stub();
function KnownTypeNamesRule(context) {
  const schema2 = context.getSchema();
  const existingTypesMap = schema2 ? schema2.getTypeMap() : /* @__PURE__ */ Object.create(null);
  const definedTypes = /* @__PURE__ */ Object.create(null);
  for (const def of context.getDocument().definitions) {
    if (isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = true;
    }
  }
  const typeNames = [
    ...Object.keys(existingTypesMap),
    ...Object.keys(definedTypes)
  ];
  return {
    NamedType(node, _1, parent, _2, ancestors) {
      const typeName = node.name.value;
      if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
        var _ancestors$;
        const definitionNode = (_ancestors$ = ancestors[2]) !== null && _ancestors$ !== void 0 ? _ancestors$ : parent;
        const isSDL = definitionNode != null && isSDLNode(definitionNode);
        if (isSDL && standardTypeNames.includes(typeName)) {
          return;
        }
        const suggestedTypes = suggestionList(
          typeName,
          isSDL ? standardTypeNames.concat(typeNames) : typeNames
        );
        context.reportError(
          new GraphQLError(
            `Unknown type "${typeName}".` + didYouMean(suggestedTypes),
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
__name(KnownTypeNamesRule, "KnownTypeNamesRule");
var standardTypeNames = [...specifiedScalarTypes, ...introspectionTypes].map(
  (type) => type.name
);
function isSDLNode(value) {
  return "kind" in value && (isTypeSystemDefinitionNode(value) || isTypeSystemExtensionNode(value));
}
__name(isSDLNode, "isSDLNode");

// node_modules/graphql/validation/rules/LoneAnonymousOperationRule.mjs
init_modules_watch_stub();
function LoneAnonymousOperationRule(context) {
  let operationCount = 0;
  return {
    Document(node) {
      operationCount = node.definitions.filter(
        (definition) => definition.kind === Kind.OPERATION_DEFINITION
      ).length;
    },
    OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(
          new GraphQLError(
            "This anonymous operation must be the only defined operation.",
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
__name(LoneAnonymousOperationRule, "LoneAnonymousOperationRule");

// node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.mjs
init_modules_watch_stub();
function LoneSchemaDefinitionRule(context) {
  var _ref, _ref2, _oldSchema$astNode;
  const oldSchema = context.getSchema();
  const alreadyDefined = (_ref = (_ref2 = (_oldSchema$astNode = oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.astNode) !== null && _oldSchema$astNode !== void 0 ? _oldSchema$astNode : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getQueryType()) !== null && _ref2 !== void 0 ? _ref2 : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getMutationType()) !== null && _ref !== void 0 ? _ref : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getSubscriptionType();
  let schemaDefinitionsCount = 0;
  return {
    SchemaDefinition(node) {
      if (alreadyDefined) {
        context.reportError(
          new GraphQLError(
            "Cannot define a new schema within a schema extension.",
            {
              nodes: node
            }
          )
        );
        return;
      }
      if (schemaDefinitionsCount > 0) {
        context.reportError(
          new GraphQLError("Must provide only one schema definition.", {
            nodes: node
          })
        );
      }
      ++schemaDefinitionsCount;
    }
  };
}
__name(LoneSchemaDefinitionRule, "LoneSchemaDefinitionRule");

// node_modules/graphql/validation/rules/MaxIntrospectionDepthRule.mjs
init_modules_watch_stub();
var MAX_LISTS_DEPTH = 3;
function MaxIntrospectionDepthRule(context) {
  function checkDepth(node, visitedFragments = /* @__PURE__ */ Object.create(null), depth = 0) {
    if (node.kind === Kind.FRAGMENT_SPREAD) {
      const fragmentName = node.name.value;
      if (visitedFragments[fragmentName] === true) {
        return false;
      }
      const fragment = context.getFragment(fragmentName);
      if (!fragment) {
        return false;
      }
      try {
        visitedFragments[fragmentName] = true;
        return checkDepth(fragment, visitedFragments, depth);
      } finally {
        visitedFragments[fragmentName] = void 0;
      }
    }
    if (node.kind === Kind.FIELD && // check all introspection lists
    (node.name.value === "fields" || node.name.value === "interfaces" || node.name.value === "possibleTypes" || node.name.value === "inputFields")) {
      depth++;
      if (depth >= MAX_LISTS_DEPTH) {
        return true;
      }
    }
    if ("selectionSet" in node && node.selectionSet) {
      for (const child of node.selectionSet.selections) {
        if (checkDepth(child, visitedFragments, depth)) {
          return true;
        }
      }
    }
    return false;
  }
  __name(checkDepth, "checkDepth");
  return {
    Field(node) {
      if (node.name.value === "__schema" || node.name.value === "__type") {
        if (checkDepth(node)) {
          context.reportError(
            new GraphQLError("Maximum introspection depth exceeded", {
              nodes: [node]
            })
          );
          return false;
        }
      }
    }
  };
}
__name(MaxIntrospectionDepthRule, "MaxIntrospectionDepthRule");

// node_modules/graphql/validation/rules/NoFragmentCyclesRule.mjs
init_modules_watch_stub();
function NoFragmentCyclesRule(context) {
  const visitedFrags = /* @__PURE__ */ Object.create(null);
  const spreadPath = [];
  const spreadPathIndexByName = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: /* @__PURE__ */ __name(() => false, "OperationDefinition"),
    FragmentDefinition(node) {
      detectCycleRecursive(node);
      return false;
    }
  };
  function detectCycleRecursive(fragment) {
    if (visitedFrags[fragment.name.value]) {
      return;
    }
    const fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;
    const spreadNodes = context.getFragmentSpreads(fragment.selectionSet);
    if (spreadNodes.length === 0) {
      return;
    }
    spreadPathIndexByName[fragmentName] = spreadPath.length;
    for (const spreadNode of spreadNodes) {
      const spreadName = spreadNode.name.value;
      const cycleIndex = spreadPathIndexByName[spreadName];
      spreadPath.push(spreadNode);
      if (cycleIndex === void 0) {
        const spreadFragment = context.getFragment(spreadName);
        if (spreadFragment) {
          detectCycleRecursive(spreadFragment);
        }
      } else {
        const cyclePath = spreadPath.slice(cycleIndex);
        const viaPath = cyclePath.slice(0, -1).map((s) => '"' + s.name.value + '"').join(", ");
        context.reportError(
          new GraphQLError(
            `Cannot spread fragment "${spreadName}" within itself` + (viaPath !== "" ? ` via ${viaPath}.` : "."),
            {
              nodes: cyclePath
            }
          )
        );
      }
      spreadPath.pop();
    }
    spreadPathIndexByName[fragmentName] = void 0;
  }
  __name(detectCycleRecursive, "detectCycleRecursive");
}
__name(NoFragmentCyclesRule, "NoFragmentCyclesRule");

// node_modules/graphql/validation/rules/NoUndefinedVariablesRule.mjs
init_modules_watch_stub();
function NoUndefinedVariablesRule(context) {
  let variableNameDefined = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        variableNameDefined = /* @__PURE__ */ Object.create(null);
      },
      leave(operation) {
        const usages = context.getRecursiveVariableUsages(operation);
        for (const { node } of usages) {
          const varName = node.name.value;
          if (variableNameDefined[varName] !== true) {
            context.reportError(
              new GraphQLError(
                operation.name ? `Variable "$${varName}" is not defined by operation "${operation.name.value}".` : `Variable "$${varName}" is not defined.`,
                {
                  nodes: [node, operation]
                }
              )
            );
          }
        }
      }
    },
    VariableDefinition(node) {
      variableNameDefined[node.variable.name.value] = true;
    }
  };
}
__name(NoUndefinedVariablesRule, "NoUndefinedVariablesRule");

// node_modules/graphql/validation/rules/NoUnusedFragmentsRule.mjs
init_modules_watch_stub();
function NoUnusedFragmentsRule(context) {
  const operationDefs = [];
  const fragmentDefs = [];
  return {
    OperationDefinition(node) {
      operationDefs.push(node);
      return false;
    },
    FragmentDefinition(node) {
      fragmentDefs.push(node);
      return false;
    },
    Document: {
      leave() {
        const fragmentNameUsed = /* @__PURE__ */ Object.create(null);
        for (const operation of operationDefs) {
          for (const fragment of context.getRecursivelyReferencedFragments(
            operation
          )) {
            fragmentNameUsed[fragment.name.value] = true;
          }
        }
        for (const fragmentDef of fragmentDefs) {
          const fragName = fragmentDef.name.value;
          if (fragmentNameUsed[fragName] !== true) {
            context.reportError(
              new GraphQLError(`Fragment "${fragName}" is never used.`, {
                nodes: fragmentDef
              })
            );
          }
        }
      }
    }
  };
}
__name(NoUnusedFragmentsRule, "NoUnusedFragmentsRule");

// node_modules/graphql/validation/rules/NoUnusedVariablesRule.mjs
init_modules_watch_stub();
function NoUnusedVariablesRule(context) {
  let variableDefs = [];
  return {
    OperationDefinition: {
      enter() {
        variableDefs = [];
      },
      leave(operation) {
        const variableNameUsed = /* @__PURE__ */ Object.create(null);
        const usages = context.getRecursiveVariableUsages(operation);
        for (const { node } of usages) {
          variableNameUsed[node.name.value] = true;
        }
        for (const variableDef of variableDefs) {
          const variableName = variableDef.variable.name.value;
          if (variableNameUsed[variableName] !== true) {
            context.reportError(
              new GraphQLError(
                operation.name ? `Variable "$${variableName}" is never used in operation "${operation.name.value}".` : `Variable "$${variableName}" is never used.`,
                {
                  nodes: variableDef
                }
              )
            );
          }
        }
      }
    },
    VariableDefinition(def) {
      variableDefs.push(def);
    }
  };
}
__name(NoUnusedVariablesRule, "NoUnusedVariablesRule");

// node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/sortValueNode.mjs
init_modules_watch_stub();
function sortValueNode(valueNode) {
  switch (valueNode.kind) {
    case Kind.OBJECT:
      return { ...valueNode, fields: sortFields(valueNode.fields) };
    case Kind.LIST:
      return { ...valueNode, values: valueNode.values.map(sortValueNode) };
    case Kind.INT:
    case Kind.FLOAT:
    case Kind.STRING:
    case Kind.BOOLEAN:
    case Kind.NULL:
    case Kind.ENUM:
    case Kind.VARIABLE:
      return valueNode;
  }
}
__name(sortValueNode, "sortValueNode");
function sortFields(fields) {
  return fields.map((fieldNode) => ({
    ...fieldNode,
    value: sortValueNode(fieldNode.value)
  })).sort(
    (fieldA, fieldB) => naturalCompare(fieldA.name.value, fieldB.name.value)
  );
}
__name(sortFields, "sortFields");

// node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs
function reasonMessage(reason) {
  if (Array.isArray(reason)) {
    return reason.map(
      ([responseName, subReason]) => `subfields "${responseName}" conflict because ` + reasonMessage(subReason)
    ).join(" and ");
  }
  return reason;
}
__name(reasonMessage, "reasonMessage");
function OverlappingFieldsCanBeMergedRule(context) {
  const comparedFieldsAndFragmentPairs = new OrderedPairSet();
  const comparedFragmentPairs = new PairSet();
  const cachedFieldsAndFragmentNames = /* @__PURE__ */ new Map();
  return {
    SelectionSet(selectionSet) {
      const conflicts = findConflictsWithinSelectionSet(
        context,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        context.getParentType(),
        selectionSet
      );
      for (const [[responseName, reason], fields1, fields2] of conflicts) {
        const reasonMsg = reasonMessage(reason);
        context.reportError(
          new GraphQLError(
            `Fields "${responseName}" conflict because ${reasonMsg}. Use different aliases on the fields to fetch both if this was intentional.`,
            {
              nodes: fields1.concat(fields2)
            }
          )
        );
      }
    }
  };
}
__name(OverlappingFieldsCanBeMergedRule, "OverlappingFieldsCanBeMergedRule");
function findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentType, selectionSet) {
  const conflicts = [];
  const [fieldMap, fragmentNames] = getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    parentType,
    selectionSet
  );
  collectConflictsWithin(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    fieldMap
  );
  if (fragmentNames.length !== 0) {
    for (let i = 0; i < fragmentNames.length; i++) {
      collectConflictsBetweenFieldsAndFragment(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        false,
        fieldMap,
        fragmentNames[i]
      );
      for (let j = i + 1; j < fragmentNames.length; j++) {
        collectConflictsBetweenFragments(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          false,
          fragmentNames[i],
          fragmentNames[j]
        );
      }
    }
  }
  return conflicts;
}
__name(findConflictsWithinSelectionSet, "findConflictsWithinSelectionSet");
function collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fragmentName) {
  if (comparedFieldsAndFragmentPairs.has(
    fieldMap,
    fragmentName,
    areMutuallyExclusive
  )) {
    return;
  }
  comparedFieldsAndFragmentPairs.add(
    fieldMap,
    fragmentName,
    areMutuallyExclusive
  );
  const fragment = context.getFragment(fragmentName);
  if (!fragment) {
    return;
  }
  const [fieldMap2, referencedFragmentNames] = getReferencedFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    fragment
  );
  if (fieldMap === fieldMap2) {
    return;
  }
  collectConflictsBetween(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap,
    fieldMap2
  );
  for (const referencedFragmentName of referencedFragmentNames) {
    collectConflictsBetweenFieldsAndFragment(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap,
      referencedFragmentName
    );
  }
}
__name(collectConflictsBetweenFieldsAndFragment, "collectConflictsBetweenFieldsAndFragment");
function collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentName2) {
  if (fragmentName1 === fragmentName2) {
    return;
  }
  if (comparedFragmentPairs.has(
    fragmentName1,
    fragmentName2,
    areMutuallyExclusive
  )) {
    return;
  }
  comparedFragmentPairs.add(fragmentName1, fragmentName2, areMutuallyExclusive);
  const fragment1 = context.getFragment(fragmentName1);
  const fragment2 = context.getFragment(fragmentName2);
  if (!fragment1 || !fragment2) {
    return;
  }
  const [fieldMap1, referencedFragmentNames1] = getReferencedFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    fragment1
  );
  const [fieldMap2, referencedFragmentNames2] = getReferencedFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    fragment2
  );
  collectConflictsBetween(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap1,
    fieldMap2
  );
  for (const referencedFragmentName2 of referencedFragmentNames2) {
    collectConflictsBetweenFragments(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fragmentName1,
      referencedFragmentName2
    );
  }
  for (const referencedFragmentName1 of referencedFragmentNames1) {
    collectConflictsBetweenFragments(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      referencedFragmentName1,
      fragmentName2
    );
  }
}
__name(collectConflictsBetweenFragments, "collectConflictsBetweenFragments");
function findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, parentType1, selectionSet1, parentType2, selectionSet2) {
  const conflicts = [];
  const [fieldMap1, fragmentNames1] = getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    parentType1,
    selectionSet1
  );
  const [fieldMap2, fragmentNames2] = getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    parentType2,
    selectionSet2
  );
  collectConflictsBetween(
    context,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap1,
    fieldMap2
  );
  for (const fragmentName2 of fragmentNames2) {
    collectConflictsBetweenFieldsAndFragment(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap1,
      fragmentName2
    );
  }
  for (const fragmentName1 of fragmentNames1) {
    collectConflictsBetweenFieldsAndFragment(
      context,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap2,
      fragmentName1
    );
  }
  for (const fragmentName1 of fragmentNames1) {
    for (const fragmentName2 of fragmentNames2) {
      collectConflictsBetweenFragments(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        areMutuallyExclusive,
        fragmentName1,
        fragmentName2
      );
    }
  }
  return conflicts;
}
__name(findConflictsBetweenSubSelectionSets, "findConflictsBetweenSubSelectionSets");
function collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, fieldMap) {
  for (const [responseName, fields] of Object.entries(fieldMap)) {
    if (fields.length > 1) {
      for (let i = 0; i < fields.length; i++) {
        for (let j = i + 1; j < fields.length; j++) {
          const conflict = findConflict(
            context,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            false,
            // within one collection is never mutually exclusive
            responseName,
            fields[i],
            fields[j]
          );
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
}
__name(collectConflictsWithin, "collectConflictsWithin");
function collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, fieldMap1, fieldMap2) {
  for (const [responseName, fields1] of Object.entries(fieldMap1)) {
    const fields2 = fieldMap2[responseName];
    if (fields2) {
      for (const field1 of fields1) {
        for (const field2 of fields2) {
          const conflict = findConflict(
            context,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            parentFieldsAreMutuallyExclusive,
            responseName,
            field1,
            field2
          );
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
}
__name(collectConflictsBetween, "collectConflictsBetween");
function findConflict(context, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, field1, field2) {
  const [parentType1, node1, def1] = field1;
  const [parentType2, node2, def2] = field2;
  const areMutuallyExclusive = parentFieldsAreMutuallyExclusive || parentType1 !== parentType2 && isObjectType(parentType1) && isObjectType(parentType2);
  if (!areMutuallyExclusive) {
    const name1 = node1.name.value;
    const name2 = node2.name.value;
    if (name1 !== name2) {
      return [
        [responseName, `"${name1}" and "${name2}" are different fields`],
        [node1],
        [node2]
      ];
    }
    if (!sameArguments(node1, node2)) {
      return [
        [responseName, "they have differing arguments"],
        [node1],
        [node2]
      ];
    }
  }
  const type1 = def1 === null || def1 === void 0 ? void 0 : def1.type;
  const type2 = def2 === null || def2 === void 0 ? void 0 : def2.type;
  if (type1 && type2 && doTypesConflict(type1, type2)) {
    return [
      [
        responseName,
        `they return conflicting types "${inspect(type1)}" and "${inspect(
          type2
        )}"`
      ],
      [node1],
      [node2]
    ];
  }
  const selectionSet1 = node1.selectionSet;
  const selectionSet2 = node2.selectionSet;
  if (selectionSet1 && selectionSet2) {
    const conflicts = findConflictsBetweenSubSelectionSets(
      context,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      getNamedType(type1),
      selectionSet1,
      getNamedType(type2),
      selectionSet2
    );
    return subfieldConflicts(conflicts, responseName, node1, node2);
  }
}
__name(findConflict, "findConflict");
function sameArguments(node1, node2) {
  const args1 = node1.arguments;
  const args2 = node2.arguments;
  if (args1 === void 0 || args1.length === 0) {
    return args2 === void 0 || args2.length === 0;
  }
  if (args2 === void 0 || args2.length === 0) {
    return false;
  }
  if (args1.length !== args2.length) {
    return false;
  }
  const values2 = new Map(args2.map(({ name, value }) => [name.value, value]));
  return args1.every((arg1) => {
    const value1 = arg1.value;
    const value2 = values2.get(arg1.name.value);
    if (value2 === void 0) {
      return false;
    }
    return stringifyValue(value1) === stringifyValue(value2);
  });
}
__name(sameArguments, "sameArguments");
function stringifyValue(value) {
  return print(sortValueNode(value));
}
__name(stringifyValue, "stringifyValue");
function doTypesConflict(type1, type2) {
  if (isListType(type1)) {
    return isListType(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (isListType(type2)) {
    return true;
  }
  if (isNonNullType(type1)) {
    return isNonNullType(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (isNonNullType(type2)) {
    return true;
  }
  if (isLeafType(type1) || isLeafType(type2)) {
    return type1 !== type2;
  }
  return false;
}
__name(doTypesConflict, "doTypesConflict");
function getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet) {
  const cached = cachedFieldsAndFragmentNames.get(selectionSet);
  if (cached) {
    return cached;
  }
  const nodeAndDefs = /* @__PURE__ */ Object.create(null);
  const fragmentNames = /* @__PURE__ */ Object.create(null);
  _collectFieldsAndFragmentNames(
    context,
    parentType,
    selectionSet,
    nodeAndDefs,
    fragmentNames
  );
  const result = [nodeAndDefs, Object.keys(fragmentNames)];
  cachedFieldsAndFragmentNames.set(selectionSet, result);
  return result;
}
__name(getFieldsAndFragmentNames, "getFieldsAndFragmentNames");
function getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment) {
  const cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);
  if (cached) {
    return cached;
  }
  const fragmentType = typeFromAST(context.getSchema(), fragment.typeCondition);
  return getFieldsAndFragmentNames(
    context,
    cachedFieldsAndFragmentNames,
    fragmentType,
    fragment.selectionSet
  );
}
__name(getReferencedFieldsAndFragmentNames, "getReferencedFieldsAndFragmentNames");
function _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        const fieldName = selection.name.value;
        let fieldDef;
        if (isObjectType(parentType) || isInterfaceType(parentType)) {
          fieldDef = parentType.getFields()[fieldName];
        }
        const responseName = selection.alias ? selection.alias.value : fieldName;
        if (!nodeAndDefs[responseName]) {
          nodeAndDefs[responseName] = [];
        }
        nodeAndDefs[responseName].push([parentType, selection, fieldDef]);
        break;
      }
      case Kind.FRAGMENT_SPREAD:
        fragmentNames[selection.name.value] = true;
        break;
      case Kind.INLINE_FRAGMENT: {
        const typeCondition = selection.typeCondition;
        const inlineFragmentType = typeCondition ? typeFromAST(context.getSchema(), typeCondition) : parentType;
        _collectFieldsAndFragmentNames(
          context,
          inlineFragmentType,
          selection.selectionSet,
          nodeAndDefs,
          fragmentNames
        );
        break;
      }
    }
  }
}
__name(_collectFieldsAndFragmentNames, "_collectFieldsAndFragmentNames");
function subfieldConflicts(conflicts, responseName, node1, node2) {
  if (conflicts.length > 0) {
    return [
      [responseName, conflicts.map(([reason]) => reason)],
      [node1, ...conflicts.map(([, fields1]) => fields1).flat()],
      [node2, ...conflicts.map(([, , fields2]) => fields2).flat()]
    ];
  }
}
__name(subfieldConflicts, "subfieldConflicts");
var OrderedPairSet = class {
  static {
    __name(this, "OrderedPairSet");
  }
  constructor() {
    this._data = /* @__PURE__ */ new Map();
  }
  has(a, b, weaklyPresent) {
    var _this$_data$get;
    const result = (_this$_data$get = this._data.get(a)) === null || _this$_data$get === void 0 ? void 0 : _this$_data$get.get(b);
    if (result === void 0) {
      return false;
    }
    return weaklyPresent ? true : weaklyPresent === result;
  }
  add(a, b, weaklyPresent) {
    const map = this._data.get(a);
    if (map === void 0) {
      this._data.set(a, /* @__PURE__ */ new Map([[b, weaklyPresent]]));
    } else {
      map.set(b, weaklyPresent);
    }
  }
};
var PairSet = class {
  static {
    __name(this, "PairSet");
  }
  constructor() {
    this._orderedPairSet = new OrderedPairSet();
  }
  has(a, b, weaklyPresent) {
    return a < b ? this._orderedPairSet.has(a, b, weaklyPresent) : this._orderedPairSet.has(b, a, weaklyPresent);
  }
  add(a, b, weaklyPresent) {
    if (a < b) {
      this._orderedPairSet.add(a, b, weaklyPresent);
    } else {
      this._orderedPairSet.add(b, a, weaklyPresent);
    }
  }
};

// node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.mjs
init_modules_watch_stub();
function PossibleFragmentSpreadsRule(context) {
  return {
    InlineFragment(node) {
      const fragType = context.getType();
      const parentType = context.getParentType();
      if (isCompositeType(fragType) && isCompositeType(parentType) && !doTypesOverlap(context.getSchema(), fragType, parentType)) {
        const parentTypeStr = inspect(parentType);
        const fragTypeStr = inspect(fragType);
        context.reportError(
          new GraphQLError(
            `Fragment cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
            {
              nodes: node
            }
          )
        );
      }
    },
    FragmentSpread(node) {
      const fragName = node.name.value;
      const fragType = getFragmentType(context, fragName);
      const parentType = context.getParentType();
      if (fragType && parentType && !doTypesOverlap(context.getSchema(), fragType, parentType)) {
        const parentTypeStr = inspect(parentType);
        const fragTypeStr = inspect(fragType);
        context.reportError(
          new GraphQLError(
            `Fragment "${fragName}" cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
__name(PossibleFragmentSpreadsRule, "PossibleFragmentSpreadsRule");
function getFragmentType(context, name) {
  const frag = context.getFragment(name);
  if (frag) {
    const type = typeFromAST(context.getSchema(), frag.typeCondition);
    if (isCompositeType(type)) {
      return type;
    }
  }
}
__name(getFragmentType, "getFragmentType");

// node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.mjs
init_modules_watch_stub();
function PossibleTypeExtensionsRule(context) {
  const schema2 = context.getSchema();
  const definedTypes = /* @__PURE__ */ Object.create(null);
  for (const def of context.getDocument().definitions) {
    if (isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = def;
    }
  }
  return {
    ScalarTypeExtension: checkExtension,
    ObjectTypeExtension: checkExtension,
    InterfaceTypeExtension: checkExtension,
    UnionTypeExtension: checkExtension,
    EnumTypeExtension: checkExtension,
    InputObjectTypeExtension: checkExtension
  };
  function checkExtension(node) {
    const typeName = node.name.value;
    const defNode = definedTypes[typeName];
    const existingType = schema2 === null || schema2 === void 0 ? void 0 : schema2.getType(typeName);
    let expectedKind;
    if (defNode) {
      expectedKind = defKindToExtKind[defNode.kind];
    } else if (existingType) {
      expectedKind = typeToExtKind(existingType);
    }
    if (expectedKind) {
      if (expectedKind !== node.kind) {
        const kindStr = extensionKindToTypeName(node.kind);
        context.reportError(
          new GraphQLError(`Cannot extend non-${kindStr} type "${typeName}".`, {
            nodes: defNode ? [defNode, node] : node
          })
        );
      }
    } else {
      const allTypeNames = Object.keys({
        ...definedTypes,
        ...schema2 === null || schema2 === void 0 ? void 0 : schema2.getTypeMap()
      });
      const suggestedTypes = suggestionList(typeName, allTypeNames);
      context.reportError(
        new GraphQLError(
          `Cannot extend type "${typeName}" because it is not defined.` + didYouMean(suggestedTypes),
          {
            nodes: node.name
          }
        )
      );
    }
  }
  __name(checkExtension, "checkExtension");
}
__name(PossibleTypeExtensionsRule, "PossibleTypeExtensionsRule");
var defKindToExtKind = {
  [Kind.SCALAR_TYPE_DEFINITION]: Kind.SCALAR_TYPE_EXTENSION,
  [Kind.OBJECT_TYPE_DEFINITION]: Kind.OBJECT_TYPE_EXTENSION,
  [Kind.INTERFACE_TYPE_DEFINITION]: Kind.INTERFACE_TYPE_EXTENSION,
  [Kind.UNION_TYPE_DEFINITION]: Kind.UNION_TYPE_EXTENSION,
  [Kind.ENUM_TYPE_DEFINITION]: Kind.ENUM_TYPE_EXTENSION,
  [Kind.INPUT_OBJECT_TYPE_DEFINITION]: Kind.INPUT_OBJECT_TYPE_EXTENSION
};
function typeToExtKind(type) {
  if (isScalarType(type)) {
    return Kind.SCALAR_TYPE_EXTENSION;
  }
  if (isObjectType(type)) {
    return Kind.OBJECT_TYPE_EXTENSION;
  }
  if (isInterfaceType(type)) {
    return Kind.INTERFACE_TYPE_EXTENSION;
  }
  if (isUnionType(type)) {
    return Kind.UNION_TYPE_EXTENSION;
  }
  if (isEnumType(type)) {
    return Kind.ENUM_TYPE_EXTENSION;
  }
  if (isInputObjectType(type)) {
    return Kind.INPUT_OBJECT_TYPE_EXTENSION;
  }
  invariant(false, "Unexpected type: " + inspect(type));
}
__name(typeToExtKind, "typeToExtKind");
function extensionKindToTypeName(kind) {
  switch (kind) {
    case Kind.SCALAR_TYPE_EXTENSION:
      return "scalar";
    case Kind.OBJECT_TYPE_EXTENSION:
      return "object";
    case Kind.INTERFACE_TYPE_EXTENSION:
      return "interface";
    case Kind.UNION_TYPE_EXTENSION:
      return "union";
    case Kind.ENUM_TYPE_EXTENSION:
      return "enum";
    case Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return "input object";
    // Not reachable. All possible types have been considered
    /* c8 ignore next */
    default:
      invariant(false, "Unexpected kind: " + inspect(kind));
  }
}
__name(extensionKindToTypeName, "extensionKindToTypeName");

// node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.mjs
init_modules_watch_stub();
function ProvidedRequiredArgumentsRule(context) {
  return {
    // eslint-disable-next-line new-cap
    ...ProvidedRequiredArgumentsOnDirectivesRule(context),
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(fieldNode) {
        var _fieldNode$arguments;
        const fieldDef = context.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        const providedArgs = new Set(
          // FIXME: https://github.com/graphql/graphql-js/issues/2203
          /* c8 ignore next */
          (_fieldNode$arguments = fieldNode.arguments) === null || _fieldNode$arguments === void 0 ? void 0 : _fieldNode$arguments.map((arg) => arg.name.value)
        );
        for (const argDef of fieldDef.args) {
          if (!providedArgs.has(argDef.name) && isRequiredArgument(argDef)) {
            const argTypeStr = inspect(argDef.type);
            context.reportError(
              new GraphQLError(
                `Field "${fieldDef.name}" argument "${argDef.name}" of type "${argTypeStr}" is required, but it was not provided.`,
                {
                  nodes: fieldNode
                }
              )
            );
          }
        }
      }
    }
  };
}
__name(ProvidedRequiredArgumentsRule, "ProvidedRequiredArgumentsRule");
function ProvidedRequiredArgumentsOnDirectivesRule(context) {
  var _schema$getDirectives;
  const requiredArgsMap = /* @__PURE__ */ Object.create(null);
  const schema2 = context.getSchema();
  const definedDirectives = (_schema$getDirectives = schema2 === null || schema2 === void 0 ? void 0 : schema2.getDirectives()) !== null && _schema$getDirectives !== void 0 ? _schema$getDirectives : specifiedDirectives;
  for (const directive of definedDirectives) {
    requiredArgsMap[directive.name] = keyMap(
      directive.args.filter(isRequiredArgument),
      (arg) => arg.name
    );
  }
  const astDefinitions = context.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;
      const argNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
      requiredArgsMap[def.name.value] = keyMap(
        argNodes.filter(isRequiredArgumentNode),
        (arg) => arg.name.value
      );
    }
  }
  return {
    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(directiveNode) {
        const directiveName = directiveNode.name.value;
        const requiredArgs = requiredArgsMap[directiveName];
        if (requiredArgs) {
          var _directiveNode$argume;
          const argNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
          const argNodeMap = new Set(argNodes.map((arg) => arg.name.value));
          for (const [argName, argDef] of Object.entries(requiredArgs)) {
            if (!argNodeMap.has(argName)) {
              const argType = isType(argDef.type) ? inspect(argDef.type) : print(argDef.type);
              context.reportError(
                new GraphQLError(
                  `Directive "@${directiveName}" argument "${argName}" of type "${argType}" is required, but it was not provided.`,
                  {
                    nodes: directiveNode
                  }
                )
              );
            }
          }
        }
      }
    }
  };
}
__name(ProvidedRequiredArgumentsOnDirectivesRule, "ProvidedRequiredArgumentsOnDirectivesRule");
function isRequiredArgumentNode(arg) {
  return arg.type.kind === Kind.NON_NULL_TYPE && arg.defaultValue == null;
}
__name(isRequiredArgumentNode, "isRequiredArgumentNode");

// node_modules/graphql/validation/rules/ScalarLeafsRule.mjs
init_modules_watch_stub();
function ScalarLeafsRule(context) {
  return {
    Field(node) {
      const type = context.getType();
      const selectionSet = node.selectionSet;
      if (type) {
        if (isLeafType(getNamedType(type))) {
          if (selectionSet) {
            const fieldName = node.name.value;
            const typeStr = inspect(type);
            context.reportError(
              new GraphQLError(
                `Field "${fieldName}" must not have a selection since type "${typeStr}" has no subfields.`,
                {
                  nodes: selectionSet
                }
              )
            );
          }
        } else if (!selectionSet) {
          const fieldName = node.name.value;
          const typeStr = inspect(type);
          context.reportError(
            new GraphQLError(
              `Field "${fieldName}" of type "${typeStr}" must have a selection of subfields. Did you mean "${fieldName} { ... }"?`,
              {
                nodes: node
              }
            )
          );
        } else if (selectionSet.selections.length === 0) {
          const fieldName = node.name.value;
          const typeStr = inspect(type);
          context.reportError(
            new GraphQLError(
              `Field "${fieldName}" of type "${typeStr}" must have at least one field selected.`,
              {
                nodes: node
              }
            )
          );
        }
      }
    }
  };
}
__name(ScalarLeafsRule, "ScalarLeafsRule");

// node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs
init_modules_watch_stub();

// node_modules/graphql/execution/collectFields.mjs
init_modules_watch_stub();

// node_modules/graphql/execution/values.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/printPathArray.mjs
init_modules_watch_stub();
function printPathArray(path) {
  return path.map(
    (key) => typeof key === "number" ? "[" + key.toString() + "]" : "." + key
  ).join("");
}
__name(printPathArray, "printPathArray");

// node_modules/graphql/utilities/coerceInputValue.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/Path.mjs
init_modules_watch_stub();
function addPath(prev, key, typename) {
  return {
    prev,
    key,
    typename
  };
}
__name(addPath, "addPath");
function pathToArray(path) {
  const flattened = [];
  let curr = path;
  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }
  return flattened.reverse();
}
__name(pathToArray, "pathToArray");

// node_modules/graphql/utilities/coerceInputValue.mjs
function coerceInputValue(inputValue, type, onError = defaultOnError) {
  return coerceInputValueImpl(inputValue, type, onError, void 0);
}
__name(coerceInputValue, "coerceInputValue");
function defaultOnError(path, invalidValue, error) {
  let errorPrefix2 = "Invalid value " + inspect(invalidValue);
  if (path.length > 0) {
    errorPrefix2 += ` at "value${printPathArray(path)}"`;
  }
  error.message = errorPrefix2 + ": " + error.message;
  throw error;
}
__name(defaultOnError, "defaultOnError");
function coerceInputValueImpl(inputValue, type, onError, path) {
  if (isNonNullType(type)) {
    if (inputValue != null) {
      return coerceInputValueImpl(inputValue, type.ofType, onError, path);
    }
    onError(
      pathToArray(path),
      inputValue,
      new GraphQLError(
        `Expected non-nullable type "${inspect(type)}" not to be null.`
      )
    );
    return;
  }
  if (inputValue == null) {
    return null;
  }
  if (isListType(type)) {
    const itemType = type.ofType;
    if (isIterableObject(inputValue)) {
      return Array.from(inputValue, (itemValue, index) => {
        const itemPath = addPath(path, index, void 0);
        return coerceInputValueImpl(itemValue, itemType, onError, itemPath);
      });
    }
    return [coerceInputValueImpl(inputValue, itemType, onError, path)];
  }
  if (isInputObjectType(type)) {
    if (!isObjectLike(inputValue) || Array.isArray(inputValue)) {
      onError(
        pathToArray(path),
        inputValue,
        new GraphQLError(`Expected type "${type.name}" to be an object.`)
      );
      return;
    }
    const coercedValue = {};
    const fieldDefs = type.getFields();
    for (const field of Object.values(fieldDefs)) {
      const fieldValue = inputValue[field.name];
      if (fieldValue === void 0) {
        if (field.defaultValue !== void 0) {
          coercedValue[field.name] = field.defaultValue;
        } else if (isNonNullType(field.type)) {
          const typeStr = inspect(field.type);
          onError(
            pathToArray(path),
            inputValue,
            new GraphQLError(
              `Field "${field.name}" of required type "${typeStr}" was not provided.`
            )
          );
        }
        continue;
      }
      coercedValue[field.name] = coerceInputValueImpl(
        fieldValue,
        field.type,
        onError,
        addPath(path, field.name, type.name)
      );
    }
    for (const fieldName of Object.keys(inputValue)) {
      if (!fieldDefs[fieldName]) {
        const suggestions = suggestionList(
          fieldName,
          Object.keys(type.getFields())
        );
        onError(
          pathToArray(path),
          inputValue,
          new GraphQLError(
            `Field "${fieldName}" is not defined by type "${type.name}".` + didYouMean(suggestions)
          )
        );
      }
    }
    if (type.isOneOf) {
      const keys = Object.keys(coercedValue);
      if (keys.length !== 1) {
        onError(
          pathToArray(path),
          inputValue,
          new GraphQLError(
            `Exactly one key must be specified for OneOf type "${type.name}".`
          )
        );
      }
      const key = keys[0];
      const value = coercedValue[key];
      if (value === null) {
        onError(
          pathToArray(path).concat(key),
          value,
          new GraphQLError(`Field "${key}" must be non-null.`)
        );
      }
    }
    return coercedValue;
  }
  if (isLeafType(type)) {
    let parseResult;
    try {
      parseResult = type.parseValue(inputValue);
    } catch (error) {
      if (error instanceof GraphQLError) {
        onError(pathToArray(path), inputValue, error);
      } else {
        onError(
          pathToArray(path),
          inputValue,
          new GraphQLError(`Expected type "${type.name}". ` + error.message, {
            originalError: error
          })
        );
      }
      return;
    }
    if (parseResult === void 0) {
      onError(
        pathToArray(path),
        inputValue,
        new GraphQLError(`Expected type "${type.name}".`)
      );
    }
    return parseResult;
  }
  invariant(false, "Unexpected input type: " + inspect(type));
}
__name(coerceInputValueImpl, "coerceInputValueImpl");

// node_modules/graphql/utilities/valueFromAST.mjs
init_modules_watch_stub();
function valueFromAST(valueNode, type, variables) {
  if (!valueNode) {
    return;
  }
  if (valueNode.kind === Kind.VARIABLE) {
    const variableName = valueNode.name.value;
    if (variables == null || variables[variableName] === void 0) {
      return;
    }
    const variableValue = variables[variableName];
    if (variableValue === null && isNonNullType(type)) {
      return;
    }
    return variableValue;
  }
  if (isNonNullType(type)) {
    if (valueNode.kind === Kind.NULL) {
      return;
    }
    return valueFromAST(valueNode, type.ofType, variables);
  }
  if (valueNode.kind === Kind.NULL) {
    return null;
  }
  if (isListType(type)) {
    const itemType = type.ofType;
    if (valueNode.kind === Kind.LIST) {
      const coercedValues = [];
      for (const itemNode of valueNode.values) {
        if (isMissingVariable(itemNode, variables)) {
          if (isNonNullType(itemType)) {
            return;
          }
          coercedValues.push(null);
        } else {
          const itemValue = valueFromAST(itemNode, itemType, variables);
          if (itemValue === void 0) {
            return;
          }
          coercedValues.push(itemValue);
        }
      }
      return coercedValues;
    }
    const coercedValue = valueFromAST(valueNode, itemType, variables);
    if (coercedValue === void 0) {
      return;
    }
    return [coercedValue];
  }
  if (isInputObjectType(type)) {
    if (valueNode.kind !== Kind.OBJECT) {
      return;
    }
    const coercedObj = /* @__PURE__ */ Object.create(null);
    const fieldNodes = keyMap(valueNode.fields, (field) => field.name.value);
    for (const field of Object.values(type.getFields())) {
      const fieldNode = fieldNodes[field.name];
      if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
        if (field.defaultValue !== void 0) {
          coercedObj[field.name] = field.defaultValue;
        } else if (isNonNullType(field.type)) {
          return;
        }
        continue;
      }
      const fieldValue = valueFromAST(fieldNode.value, field.type, variables);
      if (fieldValue === void 0) {
        return;
      }
      coercedObj[field.name] = fieldValue;
    }
    if (type.isOneOf) {
      const keys = Object.keys(coercedObj);
      if (keys.length !== 1) {
        return;
      }
      if (coercedObj[keys[0]] === null) {
        return;
      }
    }
    return coercedObj;
  }
  if (isLeafType(type)) {
    let result;
    try {
      result = type.parseLiteral(valueNode, variables);
    } catch (_error) {
      return;
    }
    if (result === void 0) {
      return;
    }
    return result;
  }
  invariant(false, "Unexpected input type: " + inspect(type));
}
__name(valueFromAST, "valueFromAST");
function isMissingVariable(valueNode, variables) {
  return valueNode.kind === Kind.VARIABLE && (variables == null || variables[valueNode.name.value] === void 0);
}
__name(isMissingVariable, "isMissingVariable");

// node_modules/graphql/execution/values.mjs
function getVariableValues(schema2, varDefNodes, inputs, options) {
  const errors = [];
  const maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors;
  try {
    const coerced = coerceVariableValues(
      schema2,
      varDefNodes,
      inputs,
      (error) => {
        if (maxErrors != null && errors.length >= maxErrors) {
          throw new GraphQLError(
            "Too many errors processing variables, error limit reached. Execution aborted."
          );
        }
        errors.push(error);
      }
    );
    if (errors.length === 0) {
      return {
        coerced
      };
    }
  } catch (error) {
    errors.push(error);
  }
  return {
    errors
  };
}
__name(getVariableValues, "getVariableValues");
function coerceVariableValues(schema2, varDefNodes, inputs, onError) {
  const coercedValues = {};
  for (const varDefNode of varDefNodes) {
    const varName = varDefNode.variable.name.value;
    const varType = typeFromAST(schema2, varDefNode.type);
    if (!isInputType(varType)) {
      const varTypeStr = print(varDefNode.type);
      onError(
        new GraphQLError(
          `Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`,
          {
            nodes: varDefNode.type
          }
        )
      );
      continue;
    }
    if (!hasOwnProperty(inputs, varName)) {
      if (varDefNode.defaultValue) {
        coercedValues[varName] = valueFromAST(varDefNode.defaultValue, varType);
      } else if (isNonNullType(varType)) {
        const varTypeStr = inspect(varType);
        onError(
          new GraphQLError(
            `Variable "$${varName}" of required type "${varTypeStr}" was not provided.`,
            {
              nodes: varDefNode
            }
          )
        );
      }
      continue;
    }
    const value = inputs[varName];
    if (value === null && isNonNullType(varType)) {
      const varTypeStr = inspect(varType);
      onError(
        new GraphQLError(
          `Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`,
          {
            nodes: varDefNode
          }
        )
      );
      continue;
    }
    coercedValues[varName] = coerceInputValue(
      value,
      varType,
      (path, invalidValue, error) => {
        let prefix = `Variable "$${varName}" got invalid value ` + inspect(invalidValue);
        if (path.length > 0) {
          prefix += ` at "${varName}${printPathArray(path)}"`;
        }
        onError(
          new GraphQLError(prefix + "; " + error.message, {
            nodes: varDefNode,
            originalError: error
          })
        );
      }
    );
  }
  return coercedValues;
}
__name(coerceVariableValues, "coerceVariableValues");
function getArgumentValues(def, node, variableValues) {
  var _node$arguments;
  const coercedValues = {};
  const argumentNodes = (_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : [];
  const argNodeMap = keyMap(argumentNodes, (arg) => arg.name.value);
  for (const argDef of def.args) {
    const name = argDef.name;
    const argType = argDef.type;
    const argumentNode = argNodeMap[name];
    if (!argumentNode) {
      if (argDef.defaultValue !== void 0) {
        coercedValues[name] = argDef.defaultValue;
      } else if (isNonNullType(argType)) {
        throw new GraphQLError(
          `Argument "${name}" of required type "${inspect(argType)}" was not provided.`,
          {
            nodes: node
          }
        );
      }
      continue;
    }
    const valueNode = argumentNode.value;
    let isNull2 = valueNode.kind === Kind.NULL;
    if (valueNode.kind === Kind.VARIABLE) {
      const variableName = valueNode.name.value;
      if (variableValues == null || !hasOwnProperty(variableValues, variableName)) {
        if (argDef.defaultValue !== void 0) {
          coercedValues[name] = argDef.defaultValue;
        } else if (isNonNullType(argType)) {
          throw new GraphQLError(
            `Argument "${name}" of required type "${inspect(argType)}" was provided the variable "$${variableName}" which was not provided a runtime value.`,
            {
              nodes: valueNode
            }
          );
        }
        continue;
      }
      isNull2 = variableValues[variableName] == null;
    }
    if (isNull2 && isNonNullType(argType)) {
      throw new GraphQLError(
        `Argument "${name}" of non-null type "${inspect(argType)}" must not be null.`,
        {
          nodes: valueNode
        }
      );
    }
    const coercedValue = valueFromAST(valueNode, argType, variableValues);
    if (coercedValue === void 0) {
      throw new GraphQLError(
        `Argument "${name}" has invalid value ${print(valueNode)}.`,
        {
          nodes: valueNode
        }
      );
    }
    coercedValues[name] = coercedValue;
  }
  return coercedValues;
}
__name(getArgumentValues, "getArgumentValues");
function getDirectiveValues(directiveDef, node, variableValues) {
  var _node$directives;
  const directiveNode = (_node$directives = node.directives) === null || _node$directives === void 0 ? void 0 : _node$directives.find(
    (directive) => directive.name.value === directiveDef.name
  );
  if (directiveNode) {
    return getArgumentValues(directiveDef, directiveNode, variableValues);
  }
}
__name(getDirectiveValues, "getDirectiveValues");
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
__name(hasOwnProperty, "hasOwnProperty");

// node_modules/graphql/execution/collectFields.mjs
function collectFields(schema2, fragments, variableValues, runtimeType, selectionSet) {
  const fields = /* @__PURE__ */ new Map();
  collectFieldsImpl(
    schema2,
    fragments,
    variableValues,
    runtimeType,
    selectionSet,
    fields,
    /* @__PURE__ */ new Set()
  );
  return fields;
}
__name(collectFields, "collectFields");
function collectSubfields(schema2, fragments, variableValues, returnType, fieldNodes) {
  const subFieldNodes = /* @__PURE__ */ new Map();
  const visitedFragmentNames = /* @__PURE__ */ new Set();
  for (const node of fieldNodes) {
    if (node.selectionSet) {
      collectFieldsImpl(
        schema2,
        fragments,
        variableValues,
        returnType,
        node.selectionSet,
        subFieldNodes,
        visitedFragmentNames
      );
    }
  }
  return subFieldNodes;
}
__name(collectSubfields, "collectSubfields");
function collectFieldsImpl(schema2, fragments, variableValues, runtimeType, selectionSet, fields, visitedFragmentNames) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        if (!shouldIncludeNode(variableValues, selection)) {
          continue;
        }
        const name = getFieldEntryKey(selection);
        const fieldList = fields.get(name);
        if (fieldList !== void 0) {
          fieldList.push(selection);
        } else {
          fields.set(name, [selection]);
        }
        break;
      }
      case Kind.INLINE_FRAGMENT: {
        if (!shouldIncludeNode(variableValues, selection) || !doesFragmentConditionMatch(schema2, selection, runtimeType)) {
          continue;
        }
        collectFieldsImpl(
          schema2,
          fragments,
          variableValues,
          runtimeType,
          selection.selectionSet,
          fields,
          visitedFragmentNames
        );
        break;
      }
      case Kind.FRAGMENT_SPREAD: {
        const fragName = selection.name.value;
        if (visitedFragmentNames.has(fragName) || !shouldIncludeNode(variableValues, selection)) {
          continue;
        }
        visitedFragmentNames.add(fragName);
        const fragment = fragments[fragName];
        if (!fragment || !doesFragmentConditionMatch(schema2, fragment, runtimeType)) {
          continue;
        }
        collectFieldsImpl(
          schema2,
          fragments,
          variableValues,
          runtimeType,
          fragment.selectionSet,
          fields,
          visitedFragmentNames
        );
        break;
      }
    }
  }
}
__name(collectFieldsImpl, "collectFieldsImpl");
function shouldIncludeNode(variableValues, node) {
  const skip = getDirectiveValues(GraphQLSkipDirective, node, variableValues);
  if ((skip === null || skip === void 0 ? void 0 : skip.if) === true) {
    return false;
  }
  const include = getDirectiveValues(
    GraphQLIncludeDirective,
    node,
    variableValues
  );
  if ((include === null || include === void 0 ? void 0 : include.if) === false) {
    return false;
  }
  return true;
}
__name(shouldIncludeNode, "shouldIncludeNode");
function doesFragmentConditionMatch(schema2, fragment, type) {
  const typeConditionNode = fragment.typeCondition;
  if (!typeConditionNode) {
    return true;
  }
  const conditionalType = typeFromAST(schema2, typeConditionNode);
  if (conditionalType === type) {
    return true;
  }
  if (isAbstractType(conditionalType)) {
    return schema2.isSubType(conditionalType, type);
  }
  return false;
}
__name(doesFragmentConditionMatch, "doesFragmentConditionMatch");
function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}
__name(getFieldEntryKey, "getFieldEntryKey");

// node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs
function SingleFieldSubscriptionsRule(context) {
  return {
    OperationDefinition(node) {
      if (node.operation === "subscription") {
        const schema2 = context.getSchema();
        const subscriptionType = schema2.getSubscriptionType();
        if (subscriptionType) {
          const operationName = node.name ? node.name.value : null;
          const variableValues = /* @__PURE__ */ Object.create(null);
          const document = context.getDocument();
          const fragments = /* @__PURE__ */ Object.create(null);
          for (const definition of document.definitions) {
            if (definition.kind === Kind.FRAGMENT_DEFINITION) {
              fragments[definition.name.value] = definition;
            }
          }
          const fields = collectFields(
            schema2,
            fragments,
            variableValues,
            subscriptionType,
            node.selectionSet
          );
          if (fields.size > 1) {
            const fieldSelectionLists = [...fields.values()];
            const extraFieldSelectionLists = fieldSelectionLists.slice(1);
            const extraFieldSelections = extraFieldSelectionLists.flat();
            context.reportError(
              new GraphQLError(
                operationName != null ? `Subscription "${operationName}" must select only one top level field.` : "Anonymous Subscription must select only one top level field.",
                {
                  nodes: extraFieldSelections
                }
              )
            );
          }
          for (const fieldNodes of fields.values()) {
            const field = fieldNodes[0];
            const fieldName = field.name.value;
            if (fieldName.startsWith("__")) {
              context.reportError(
                new GraphQLError(
                  operationName != null ? `Subscription "${operationName}" must not select an introspection top level field.` : "Anonymous Subscription must not select an introspection top level field.",
                  {
                    nodes: fieldNodes
                  }
                )
              );
            }
          }
        }
      }
    }
  };
}
__name(SingleFieldSubscriptionsRule, "SingleFieldSubscriptionsRule");

// node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/groupBy.mjs
init_modules_watch_stub();
function groupBy(list2, keyFn) {
  const result = /* @__PURE__ */ new Map();
  for (const item of list2) {
    const key = keyFn(item);
    const group2 = result.get(key);
    if (group2 === void 0) {
      result.set(key, [item]);
    } else {
      group2.push(item);
    }
  }
  return result;
}
__name(groupBy, "groupBy");

// node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.mjs
function UniqueArgumentDefinitionNamesRule(context) {
  return {
    DirectiveDefinition(directiveNode) {
      var _directiveNode$argume;
      const argumentNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
      return checkArgUniqueness(`@${directiveNode.name.value}`, argumentNodes);
    },
    InterfaceTypeDefinition: checkArgUniquenessPerField,
    InterfaceTypeExtension: checkArgUniquenessPerField,
    ObjectTypeDefinition: checkArgUniquenessPerField,
    ObjectTypeExtension: checkArgUniquenessPerField
  };
  function checkArgUniquenessPerField(typeNode) {
    var _typeNode$fields;
    const typeName = typeNode.name.value;
    const fieldNodes = (_typeNode$fields = typeNode.fields) !== null && _typeNode$fields !== void 0 ? _typeNode$fields : [];
    for (const fieldDef of fieldNodes) {
      var _fieldDef$arguments;
      const fieldName = fieldDef.name.value;
      const argumentNodes = (_fieldDef$arguments = fieldDef.arguments) !== null && _fieldDef$arguments !== void 0 ? _fieldDef$arguments : [];
      checkArgUniqueness(`${typeName}.${fieldName}`, argumentNodes);
    }
    return false;
  }
  __name(checkArgUniquenessPerField, "checkArgUniquenessPerField");
  function checkArgUniqueness(parentName, argumentNodes) {
    const seenArgs = groupBy(argumentNodes, (arg) => arg.name.value);
    for (const [argName, argNodes] of seenArgs) {
      if (argNodes.length > 1) {
        context.reportError(
          new GraphQLError(
            `Argument "${parentName}(${argName}:)" can only be defined once.`,
            {
              nodes: argNodes.map((node) => node.name)
            }
          )
        );
      }
    }
    return false;
  }
  __name(checkArgUniqueness, "checkArgUniqueness");
}
__name(UniqueArgumentDefinitionNamesRule, "UniqueArgumentDefinitionNamesRule");

// node_modules/graphql/validation/rules/UniqueArgumentNamesRule.mjs
init_modules_watch_stub();
function UniqueArgumentNamesRule(context) {
  return {
    Field: checkArgUniqueness,
    Directive: checkArgUniqueness
  };
  function checkArgUniqueness(parentNode) {
    var _parentNode$arguments;
    const argumentNodes = (_parentNode$arguments = parentNode.arguments) !== null && _parentNode$arguments !== void 0 ? _parentNode$arguments : [];
    const seenArgs = groupBy(argumentNodes, (arg) => arg.name.value);
    for (const [argName, argNodes] of seenArgs) {
      if (argNodes.length > 1) {
        context.reportError(
          new GraphQLError(
            `There can be only one argument named "${argName}".`,
            {
              nodes: argNodes.map((node) => node.name)
            }
          )
        );
      }
    }
  }
  __name(checkArgUniqueness, "checkArgUniqueness");
}
__name(UniqueArgumentNamesRule, "UniqueArgumentNamesRule");

// node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.mjs
init_modules_watch_stub();
function UniqueDirectiveNamesRule(context) {
  const knownDirectiveNames = /* @__PURE__ */ Object.create(null);
  const schema2 = context.getSchema();
  return {
    DirectiveDefinition(node) {
      const directiveName = node.name.value;
      if (schema2 !== null && schema2 !== void 0 && schema2.getDirective(directiveName)) {
        context.reportError(
          new GraphQLError(
            `Directive "@${directiveName}" already exists in the schema. It cannot be redefined.`,
            {
              nodes: node.name
            }
          )
        );
        return;
      }
      if (knownDirectiveNames[directiveName]) {
        context.reportError(
          new GraphQLError(
            `There can be only one directive named "@${directiveName}".`,
            {
              nodes: [knownDirectiveNames[directiveName], node.name]
            }
          )
        );
      } else {
        knownDirectiveNames[directiveName] = node.name;
      }
      return false;
    }
  };
}
__name(UniqueDirectiveNamesRule, "UniqueDirectiveNamesRule");

// node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.mjs
init_modules_watch_stub();
function UniqueDirectivesPerLocationRule(context) {
  const uniqueDirectiveMap = /* @__PURE__ */ Object.create(null);
  const schema2 = context.getSchema();
  const definedDirectives = schema2 ? schema2.getDirectives() : specifiedDirectives;
  for (const directive of definedDirectives) {
    uniqueDirectiveMap[directive.name] = !directive.isRepeatable;
  }
  const astDefinitions = context.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      uniqueDirectiveMap[def.name.value] = !def.repeatable;
    }
  }
  const schemaDirectives = /* @__PURE__ */ Object.create(null);
  const typeDirectivesMap = /* @__PURE__ */ Object.create(null);
  return {
    // Many different AST nodes may contain directives. Rather than listing
    // them all, just listen for entering any node, and check to see if it
    // defines any directives.
    enter(node) {
      if (!("directives" in node) || !node.directives) {
        return;
      }
      let seenDirectives;
      if (node.kind === Kind.SCHEMA_DEFINITION || node.kind === Kind.SCHEMA_EXTENSION) {
        seenDirectives = schemaDirectives;
      } else if (isTypeDefinitionNode(node) || isTypeExtensionNode(node)) {
        const typeName = node.name.value;
        seenDirectives = typeDirectivesMap[typeName];
        if (seenDirectives === void 0) {
          typeDirectivesMap[typeName] = seenDirectives = /* @__PURE__ */ Object.create(null);
        }
      } else {
        seenDirectives = /* @__PURE__ */ Object.create(null);
      }
      for (const directive of node.directives) {
        const directiveName = directive.name.value;
        if (uniqueDirectiveMap[directiveName]) {
          if (seenDirectives[directiveName]) {
            context.reportError(
              new GraphQLError(
                `The directive "@${directiveName}" can only be used once at this location.`,
                {
                  nodes: [seenDirectives[directiveName], directive]
                }
              )
            );
          } else {
            seenDirectives[directiveName] = directive;
          }
        }
      }
    }
  };
}
__name(UniqueDirectivesPerLocationRule, "UniqueDirectivesPerLocationRule");

// node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.mjs
init_modules_watch_stub();
function UniqueEnumValueNamesRule(context) {
  const schema2 = context.getSchema();
  const existingTypeMap = schema2 ? schema2.getTypeMap() : /* @__PURE__ */ Object.create(null);
  const knownValueNames = /* @__PURE__ */ Object.create(null);
  return {
    EnumTypeDefinition: checkValueUniqueness,
    EnumTypeExtension: checkValueUniqueness
  };
  function checkValueUniqueness(node) {
    var _node$values;
    const typeName = node.name.value;
    if (!knownValueNames[typeName]) {
      knownValueNames[typeName] = /* @__PURE__ */ Object.create(null);
    }
    const valueNodes = (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
    const valueNames = knownValueNames[typeName];
    for (const valueDef of valueNodes) {
      const valueName = valueDef.name.value;
      const existingType = existingTypeMap[typeName];
      if (isEnumType(existingType) && existingType.getValue(valueName)) {
        context.reportError(
          new GraphQLError(
            `Enum value "${typeName}.${valueName}" already exists in the schema. It cannot also be defined in this type extension.`,
            {
              nodes: valueDef.name
            }
          )
        );
      } else if (valueNames[valueName]) {
        context.reportError(
          new GraphQLError(
            `Enum value "${typeName}.${valueName}" can only be defined once.`,
            {
              nodes: [valueNames[valueName], valueDef.name]
            }
          )
        );
      } else {
        valueNames[valueName] = valueDef.name;
      }
    }
    return false;
  }
  __name(checkValueUniqueness, "checkValueUniqueness");
}
__name(UniqueEnumValueNamesRule, "UniqueEnumValueNamesRule");

// node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.mjs
init_modules_watch_stub();
function UniqueFieldDefinitionNamesRule(context) {
  const schema2 = context.getSchema();
  const existingTypeMap = schema2 ? schema2.getTypeMap() : /* @__PURE__ */ Object.create(null);
  const knownFieldNames = /* @__PURE__ */ Object.create(null);
  return {
    InputObjectTypeDefinition: checkFieldUniqueness,
    InputObjectTypeExtension: checkFieldUniqueness,
    InterfaceTypeDefinition: checkFieldUniqueness,
    InterfaceTypeExtension: checkFieldUniqueness,
    ObjectTypeDefinition: checkFieldUniqueness,
    ObjectTypeExtension: checkFieldUniqueness
  };
  function checkFieldUniqueness(node) {
    var _node$fields;
    const typeName = node.name.value;
    if (!knownFieldNames[typeName]) {
      knownFieldNames[typeName] = /* @__PURE__ */ Object.create(null);
    }
    const fieldNodes = (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
    const fieldNames = knownFieldNames[typeName];
    for (const fieldDef of fieldNodes) {
      const fieldName = fieldDef.name.value;
      if (hasField(existingTypeMap[typeName], fieldName)) {
        context.reportError(
          new GraphQLError(
            `Field "${typeName}.${fieldName}" already exists in the schema. It cannot also be defined in this type extension.`,
            {
              nodes: fieldDef.name
            }
          )
        );
      } else if (fieldNames[fieldName]) {
        context.reportError(
          new GraphQLError(
            `Field "${typeName}.${fieldName}" can only be defined once.`,
            {
              nodes: [fieldNames[fieldName], fieldDef.name]
            }
          )
        );
      } else {
        fieldNames[fieldName] = fieldDef.name;
      }
    }
    return false;
  }
  __name(checkFieldUniqueness, "checkFieldUniqueness");
}
__name(UniqueFieldDefinitionNamesRule, "UniqueFieldDefinitionNamesRule");
function hasField(type, fieldName) {
  if (isObjectType(type) || isInterfaceType(type) || isInputObjectType(type)) {
    return type.getFields()[fieldName] != null;
  }
  return false;
}
__name(hasField, "hasField");

// node_modules/graphql/validation/rules/UniqueFragmentNamesRule.mjs
init_modules_watch_stub();
function UniqueFragmentNamesRule(context) {
  const knownFragmentNames = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: /* @__PURE__ */ __name(() => false, "OperationDefinition"),
    FragmentDefinition(node) {
      const fragmentName = node.name.value;
      if (knownFragmentNames[fragmentName]) {
        context.reportError(
          new GraphQLError(
            `There can be only one fragment named "${fragmentName}".`,
            {
              nodes: [knownFragmentNames[fragmentName], node.name]
            }
          )
        );
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }
      return false;
    }
  };
}
__name(UniqueFragmentNamesRule, "UniqueFragmentNamesRule");

// node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.mjs
init_modules_watch_stub();
function UniqueInputFieldNamesRule(context) {
  const knownNameStack = [];
  let knownNames = /* @__PURE__ */ Object.create(null);
  return {
    ObjectValue: {
      enter() {
        knownNameStack.push(knownNames);
        knownNames = /* @__PURE__ */ Object.create(null);
      },
      leave() {
        const prevKnownNames = knownNameStack.pop();
        prevKnownNames || invariant(false);
        knownNames = prevKnownNames;
      }
    },
    ObjectField(node) {
      const fieldName = node.name.value;
      if (knownNames[fieldName]) {
        context.reportError(
          new GraphQLError(
            `There can be only one input field named "${fieldName}".`,
            {
              nodes: [knownNames[fieldName], node.name]
            }
          )
        );
      } else {
        knownNames[fieldName] = node.name;
      }
    }
  };
}
__name(UniqueInputFieldNamesRule, "UniqueInputFieldNamesRule");

// node_modules/graphql/validation/rules/UniqueOperationNamesRule.mjs
init_modules_watch_stub();
function UniqueOperationNamesRule(context) {
  const knownOperationNames = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition(node) {
      const operationName = node.name;
      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(
            new GraphQLError(
              `There can be only one operation named "${operationName.value}".`,
              {
                nodes: [
                  knownOperationNames[operationName.value],
                  operationName
                ]
              }
            )
          );
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }
      return false;
    },
    FragmentDefinition: /* @__PURE__ */ __name(() => false, "FragmentDefinition")
  };
}
__name(UniqueOperationNamesRule, "UniqueOperationNamesRule");

// node_modules/graphql/validation/rules/UniqueOperationTypesRule.mjs
init_modules_watch_stub();
function UniqueOperationTypesRule(context) {
  const schema2 = context.getSchema();
  const definedOperationTypes = /* @__PURE__ */ Object.create(null);
  const existingOperationTypes = schema2 ? {
    query: schema2.getQueryType(),
    mutation: schema2.getMutationType(),
    subscription: schema2.getSubscriptionType()
  } : {};
  return {
    SchemaDefinition: checkOperationTypes,
    SchemaExtension: checkOperationTypes
  };
  function checkOperationTypes(node) {
    var _node$operationTypes;
    const operationTypesNodes = (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
    for (const operationType of operationTypesNodes) {
      const operation = operationType.operation;
      const alreadyDefinedOperationType = definedOperationTypes[operation];
      if (existingOperationTypes[operation]) {
        context.reportError(
          new GraphQLError(
            `Type for ${operation} already defined in the schema. It cannot be redefined.`,
            {
              nodes: operationType
            }
          )
        );
      } else if (alreadyDefinedOperationType) {
        context.reportError(
          new GraphQLError(
            `There can be only one ${operation} type in schema.`,
            {
              nodes: [alreadyDefinedOperationType, operationType]
            }
          )
        );
      } else {
        definedOperationTypes[operation] = operationType;
      }
    }
    return false;
  }
  __name(checkOperationTypes, "checkOperationTypes");
}
__name(UniqueOperationTypesRule, "UniqueOperationTypesRule");

// node_modules/graphql/validation/rules/UniqueTypeNamesRule.mjs
init_modules_watch_stub();
function UniqueTypeNamesRule(context) {
  const knownTypeNames = /* @__PURE__ */ Object.create(null);
  const schema2 = context.getSchema();
  return {
    ScalarTypeDefinition: checkTypeName,
    ObjectTypeDefinition: checkTypeName,
    InterfaceTypeDefinition: checkTypeName,
    UnionTypeDefinition: checkTypeName,
    EnumTypeDefinition: checkTypeName,
    InputObjectTypeDefinition: checkTypeName
  };
  function checkTypeName(node) {
    const typeName = node.name.value;
    if (schema2 !== null && schema2 !== void 0 && schema2.getType(typeName)) {
      context.reportError(
        new GraphQLError(
          `Type "${typeName}" already exists in the schema. It cannot also be defined in this type definition.`,
          {
            nodes: node.name
          }
        )
      );
      return;
    }
    if (knownTypeNames[typeName]) {
      context.reportError(
        new GraphQLError(`There can be only one type named "${typeName}".`, {
          nodes: [knownTypeNames[typeName], node.name]
        })
      );
    } else {
      knownTypeNames[typeName] = node.name;
    }
    return false;
  }
  __name(checkTypeName, "checkTypeName");
}
__name(UniqueTypeNamesRule, "UniqueTypeNamesRule");

// node_modules/graphql/validation/rules/UniqueVariableNamesRule.mjs
init_modules_watch_stub();
function UniqueVariableNamesRule(context) {
  return {
    OperationDefinition(operationNode) {
      var _operationNode$variab;
      const variableDefinitions = (_operationNode$variab = operationNode.variableDefinitions) !== null && _operationNode$variab !== void 0 ? _operationNode$variab : [];
      const seenVariableDefinitions = groupBy(
        variableDefinitions,
        (node) => node.variable.name.value
      );
      for (const [variableName, variableNodes] of seenVariableDefinitions) {
        if (variableNodes.length > 1) {
          context.reportError(
            new GraphQLError(
              `There can be only one variable named "$${variableName}".`,
              {
                nodes: variableNodes.map((node) => node.variable.name)
              }
            )
          );
        }
      }
    }
  };
}
__name(UniqueVariableNamesRule, "UniqueVariableNamesRule");

// node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.mjs
init_modules_watch_stub();
function ValuesOfCorrectTypeRule(context) {
  let variableDefinitions = {};
  return {
    OperationDefinition: {
      enter() {
        variableDefinitions = {};
      }
    },
    VariableDefinition(definition) {
      variableDefinitions[definition.variable.name.value] = definition;
    },
    ListValue(node) {
      const type = getNullableType(context.getParentInputType());
      if (!isListType(type)) {
        isValidValueNode(context, node);
        return false;
      }
    },
    ObjectValue(node) {
      const type = getNamedType(context.getInputType());
      if (!isInputObjectType(type)) {
        isValidValueNode(context, node);
        return false;
      }
      const fieldNodeMap = keyMap(node.fields, (field) => field.name.value);
      for (const fieldDef of Object.values(type.getFields())) {
        const fieldNode = fieldNodeMap[fieldDef.name];
        if (!fieldNode && isRequiredInputField(fieldDef)) {
          const typeStr = inspect(fieldDef.type);
          context.reportError(
            new GraphQLError(
              `Field "${type.name}.${fieldDef.name}" of required type "${typeStr}" was not provided.`,
              {
                nodes: node
              }
            )
          );
        }
      }
      if (type.isOneOf) {
        validateOneOfInputObject(
          context,
          node,
          type,
          fieldNodeMap,
          variableDefinitions
        );
      }
    },
    ObjectField(node) {
      const parentType = getNamedType(context.getParentInputType());
      const fieldType = context.getInputType();
      if (!fieldType && isInputObjectType(parentType)) {
        const suggestions = suggestionList(
          node.name.value,
          Object.keys(parentType.getFields())
        );
        context.reportError(
          new GraphQLError(
            `Field "${node.name.value}" is not defined by type "${parentType.name}".` + didYouMean(suggestions),
            {
              nodes: node
            }
          )
        );
      }
    },
    NullValue(node) {
      const type = context.getInputType();
      if (isNonNullType(type)) {
        context.reportError(
          new GraphQLError(
            `Expected value of type "${inspect(type)}", found ${print(node)}.`,
            {
              nodes: node
            }
          )
        );
      }
    },
    EnumValue: /* @__PURE__ */ __name((node) => isValidValueNode(context, node), "EnumValue"),
    IntValue: /* @__PURE__ */ __name((node) => isValidValueNode(context, node), "IntValue"),
    FloatValue: /* @__PURE__ */ __name((node) => isValidValueNode(context, node), "FloatValue"),
    StringValue: /* @__PURE__ */ __name((node) => isValidValueNode(context, node), "StringValue"),
    BooleanValue: /* @__PURE__ */ __name((node) => isValidValueNode(context, node), "BooleanValue")
  };
}
__name(ValuesOfCorrectTypeRule, "ValuesOfCorrectTypeRule");
function isValidValueNode(context, node) {
  const locationType = context.getInputType();
  if (!locationType) {
    return;
  }
  const type = getNamedType(locationType);
  if (!isLeafType(type)) {
    const typeStr = inspect(locationType);
    context.reportError(
      new GraphQLError(
        `Expected value of type "${typeStr}", found ${print(node)}.`,
        {
          nodes: node
        }
      )
    );
    return;
  }
  try {
    const parseResult = type.parseLiteral(
      node,
      void 0
      /* variables */
    );
    if (parseResult === void 0) {
      const typeStr = inspect(locationType);
      context.reportError(
        new GraphQLError(
          `Expected value of type "${typeStr}", found ${print(node)}.`,
          {
            nodes: node
          }
        )
      );
    }
  } catch (error) {
    const typeStr = inspect(locationType);
    if (error instanceof GraphQLError) {
      context.reportError(error);
    } else {
      context.reportError(
        new GraphQLError(
          `Expected value of type "${typeStr}", found ${print(node)}; ` + error.message,
          {
            nodes: node,
            originalError: error
          }
        )
      );
    }
  }
}
__name(isValidValueNode, "isValidValueNode");
function validateOneOfInputObject(context, node, type, fieldNodeMap, variableDefinitions) {
  var _fieldNodeMap$keys$;
  const keys = Object.keys(fieldNodeMap);
  const isNotExactlyOneField = keys.length !== 1;
  if (isNotExactlyOneField) {
    context.reportError(
      new GraphQLError(
        `OneOf Input Object "${type.name}" must specify exactly one key.`,
        {
          nodes: [node]
        }
      )
    );
    return;
  }
  const value = (_fieldNodeMap$keys$ = fieldNodeMap[keys[0]]) === null || _fieldNodeMap$keys$ === void 0 ? void 0 : _fieldNodeMap$keys$.value;
  const isNullLiteral = !value || value.kind === Kind.NULL;
  const isVariable = (value === null || value === void 0 ? void 0 : value.kind) === Kind.VARIABLE;
  if (isNullLiteral) {
    context.reportError(
      new GraphQLError(`Field "${type.name}.${keys[0]}" must be non-null.`, {
        nodes: [node]
      })
    );
    return;
  }
  if (isVariable) {
    const variableName = value.name.value;
    const definition = variableDefinitions[variableName];
    const isNullableVariable = definition.type.kind !== Kind.NON_NULL_TYPE;
    if (isNullableVariable) {
      context.reportError(
        new GraphQLError(
          `Variable "${variableName}" must be non-nullable to be used for OneOf Input Object "${type.name}".`,
          {
            nodes: [node]
          }
        )
      );
    }
  }
}
__name(validateOneOfInputObject, "validateOneOfInputObject");

// node_modules/graphql/validation/rules/VariablesAreInputTypesRule.mjs
init_modules_watch_stub();
function VariablesAreInputTypesRule(context) {
  return {
    VariableDefinition(node) {
      const type = typeFromAST(context.getSchema(), node.type);
      if (type !== void 0 && !isInputType(type)) {
        const variableName = node.variable.name.value;
        const typeName = print(node.type);
        context.reportError(
          new GraphQLError(
            `Variable "$${variableName}" cannot be non-input type "${typeName}".`,
            {
              nodes: node.type
            }
          )
        );
      }
    }
  };
}
__name(VariablesAreInputTypesRule, "VariablesAreInputTypesRule");

// node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.mjs
init_modules_watch_stub();
function VariablesInAllowedPositionRule(context) {
  let varDefMap = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        varDefMap = /* @__PURE__ */ Object.create(null);
      },
      leave(operation) {
        const usages = context.getRecursiveVariableUsages(operation);
        for (const { node, type, defaultValue, parentType } of usages) {
          const varName = node.name.value;
          const varDef = varDefMap[varName];
          if (varDef && type) {
            const schema2 = context.getSchema();
            const varType = typeFromAST(schema2, varDef.type);
            if (varType && !allowedVariableUsage(
              schema2,
              varType,
              varDef.defaultValue,
              type,
              defaultValue
            )) {
              const varTypeStr = inspect(varType);
              const typeStr = inspect(type);
              context.reportError(
                new GraphQLError(
                  `Variable "$${varName}" of type "${varTypeStr}" used in position expecting type "${typeStr}".`,
                  {
                    nodes: [varDef, node]
                  }
                )
              );
            }
            if (isInputObjectType(parentType) && parentType.isOneOf && isNullableType(varType)) {
              context.reportError(
                new GraphQLError(
                  `Variable "$${varName}" is of type "${varType}" but must be non-nullable to be used for OneOf Input Object "${parentType}".`,
                  {
                    nodes: [varDef, node]
                  }
                )
              );
            }
          }
        }
      }
    },
    VariableDefinition(node) {
      varDefMap[node.variable.name.value] = node;
    }
  };
}
__name(VariablesInAllowedPositionRule, "VariablesInAllowedPositionRule");
function allowedVariableUsage(schema2, varType, varDefaultValue, locationType, locationDefaultValue) {
  if (isNonNullType(locationType) && !isNonNullType(varType)) {
    const hasNonNullVariableDefaultValue = varDefaultValue != null && varDefaultValue.kind !== Kind.NULL;
    const hasLocationDefaultValue = locationDefaultValue !== void 0;
    if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
      return false;
    }
    const nullableLocationType = locationType.ofType;
    return isTypeSubTypeOf(schema2, varType, nullableLocationType);
  }
  return isTypeSubTypeOf(schema2, varType, locationType);
}
__name(allowedVariableUsage, "allowedVariableUsage");

// node_modules/graphql/validation/specifiedRules.mjs
var recommendedRules = Object.freeze([MaxIntrospectionDepthRule]);
var specifiedRules = Object.freeze([
  ExecutableDefinitionsRule,
  UniqueOperationNamesRule,
  LoneAnonymousOperationRule,
  SingleFieldSubscriptionsRule,
  KnownTypeNamesRule,
  FragmentsOnCompositeTypesRule,
  VariablesAreInputTypesRule,
  ScalarLeafsRule,
  FieldsOnCorrectTypeRule,
  UniqueFragmentNamesRule,
  KnownFragmentNamesRule,
  NoUnusedFragmentsRule,
  PossibleFragmentSpreadsRule,
  NoFragmentCyclesRule,
  UniqueVariableNamesRule,
  NoUndefinedVariablesRule,
  NoUnusedVariablesRule,
  KnownDirectivesRule,
  UniqueDirectivesPerLocationRule,
  KnownArgumentNamesRule,
  UniqueArgumentNamesRule,
  ValuesOfCorrectTypeRule,
  ProvidedRequiredArgumentsRule,
  VariablesInAllowedPositionRule,
  OverlappingFieldsCanBeMergedRule,
  UniqueInputFieldNamesRule,
  ...recommendedRules
]);
var specifiedSDLRules = Object.freeze([
  LoneSchemaDefinitionRule,
  UniqueOperationTypesRule,
  UniqueTypeNamesRule,
  UniqueEnumValueNamesRule,
  UniqueFieldDefinitionNamesRule,
  UniqueArgumentDefinitionNamesRule,
  UniqueDirectiveNamesRule,
  KnownTypeNamesRule,
  KnownDirectivesRule,
  UniqueDirectivesPerLocationRule,
  PossibleTypeExtensionsRule,
  KnownArgumentNamesOnDirectivesRule,
  UniqueArgumentNamesRule,
  UniqueInputFieldNamesRule,
  ProvidedRequiredArgumentsOnDirectivesRule
]);

// node_modules/graphql/validation/ValidationContext.mjs
init_modules_watch_stub();
var ASTValidationContext = class {
  static {
    __name(this, "ASTValidationContext");
  }
  constructor(ast, onError) {
    this._ast = ast;
    this._fragments = void 0;
    this._fragmentSpreads = /* @__PURE__ */ new Map();
    this._recursivelyReferencedFragments = /* @__PURE__ */ new Map();
    this._onError = onError;
  }
  get [Symbol.toStringTag]() {
    return "ASTValidationContext";
  }
  reportError(error) {
    this._onError(error);
  }
  getDocument() {
    return this._ast;
  }
  getFragment(name) {
    let fragments;
    if (this._fragments) {
      fragments = this._fragments;
    } else {
      fragments = /* @__PURE__ */ Object.create(null);
      for (const defNode of this.getDocument().definitions) {
        if (defNode.kind === Kind.FRAGMENT_DEFINITION) {
          fragments[defNode.name.value] = defNode;
        }
      }
      this._fragments = fragments;
    }
    return fragments[name];
  }
  getFragmentSpreads(node) {
    let spreads = this._fragmentSpreads.get(node);
    if (!spreads) {
      spreads = [];
      const setsToVisit = [node];
      let set;
      while (set = setsToVisit.pop()) {
        for (const selection of set.selections) {
          if (selection.kind === Kind.FRAGMENT_SPREAD) {
            spreads.push(selection);
          } else if (selection.selectionSet) {
            setsToVisit.push(selection.selectionSet);
          }
        }
      }
      this._fragmentSpreads.set(node, spreads);
    }
    return spreads;
  }
  getRecursivelyReferencedFragments(operation) {
    let fragments = this._recursivelyReferencedFragments.get(operation);
    if (!fragments) {
      fragments = [];
      const collectedNames = /* @__PURE__ */ Object.create(null);
      const nodesToVisit = [operation.selectionSet];
      let node;
      while (node = nodesToVisit.pop()) {
        for (const spread of this.getFragmentSpreads(node)) {
          const fragName = spread.name.value;
          if (collectedNames[fragName] !== true) {
            collectedNames[fragName] = true;
            const fragment = this.getFragment(fragName);
            if (fragment) {
              fragments.push(fragment);
              nodesToVisit.push(fragment.selectionSet);
            }
          }
        }
      }
      this._recursivelyReferencedFragments.set(operation, fragments);
    }
    return fragments;
  }
};
var SDLValidationContext = class extends ASTValidationContext {
  static {
    __name(this, "SDLValidationContext");
  }
  constructor(ast, schema2, onError) {
    super(ast, onError);
    this._schema = schema2;
  }
  get [Symbol.toStringTag]() {
    return "SDLValidationContext";
  }
  getSchema() {
    return this._schema;
  }
};
var ValidationContext = class extends ASTValidationContext {
  static {
    __name(this, "ValidationContext");
  }
  constructor(schema2, ast, typeInfo, onError) {
    super(ast, onError);
    this._schema = schema2;
    this._typeInfo = typeInfo;
    this._variableUsages = /* @__PURE__ */ new Map();
    this._recursiveVariableUsages = /* @__PURE__ */ new Map();
  }
  get [Symbol.toStringTag]() {
    return "ValidationContext";
  }
  getSchema() {
    return this._schema;
  }
  getVariableUsages(node) {
    let usages = this._variableUsages.get(node);
    if (!usages) {
      const newUsages = [];
      const typeInfo = new TypeInfo(this._schema);
      visit(
        node,
        visitWithTypeInfo(typeInfo, {
          VariableDefinition: /* @__PURE__ */ __name(() => false, "VariableDefinition"),
          Variable(variable) {
            newUsages.push({
              node: variable,
              type: typeInfo.getInputType(),
              defaultValue: typeInfo.getDefaultValue(),
              parentType: typeInfo.getParentInputType()
            });
          }
        })
      );
      usages = newUsages;
      this._variableUsages.set(node, usages);
    }
    return usages;
  }
  getRecursiveVariableUsages(operation) {
    let usages = this._recursiveVariableUsages.get(operation);
    if (!usages) {
      usages = this.getVariableUsages(operation);
      for (const frag of this.getRecursivelyReferencedFragments(operation)) {
        usages = usages.concat(this.getVariableUsages(frag));
      }
      this._recursiveVariableUsages.set(operation, usages);
    }
    return usages;
  }
  getType() {
    return this._typeInfo.getType();
  }
  getParentType() {
    return this._typeInfo.getParentType();
  }
  getInputType() {
    return this._typeInfo.getInputType();
  }
  getParentInputType() {
    return this._typeInfo.getParentInputType();
  }
  getFieldDef() {
    return this._typeInfo.getFieldDef();
  }
  getDirective() {
    return this._typeInfo.getDirective();
  }
  getArgument() {
    return this._typeInfo.getArgument();
  }
  getEnumValue() {
    return this._typeInfo.getEnumValue();
  }
};

// node_modules/graphql/validation/validate.mjs
function validate(schema2, documentAST, rules = specifiedRules, options, typeInfo = new TypeInfo(schema2)) {
  var _options$maxErrors;
  const maxErrors = (_options$maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors) !== null && _options$maxErrors !== void 0 ? _options$maxErrors : 100;
  documentAST || devAssert(false, "Must provide document.");
  assertValidSchema(schema2);
  const abortObj = Object.freeze({});
  const errors = [];
  const context = new ValidationContext(
    schema2,
    documentAST,
    typeInfo,
    (error) => {
      if (errors.length >= maxErrors) {
        errors.push(
          new GraphQLError(
            "Too many validation errors, error limit reached. Validation aborted."
          )
        );
        throw abortObj;
      }
      errors.push(error);
    }
  );
  const visitor = visitInParallel(rules.map((rule) => rule(context)));
  try {
    visit(documentAST, visitWithTypeInfo(typeInfo, visitor));
  } catch (e) {
    if (e !== abortObj) {
      throw e;
    }
  }
  return errors;
}
__name(validate, "validate");
function validateSDL(documentAST, schemaToExtend, rules = specifiedSDLRules) {
  const errors = [];
  const context = new SDLValidationContext(
    documentAST,
    schemaToExtend,
    (error) => {
      errors.push(error);
    }
  );
  const visitors = rules.map((rule) => rule(context));
  visit(documentAST, visitInParallel(visitors));
  return errors;
}
__name(validateSDL, "validateSDL");
function assertValidSDL(documentAST) {
  const errors = validateSDL(documentAST);
  if (errors.length !== 0) {
    throw new Error(errors.map((error) => error.message).join("\n\n"));
  }
}
__name(assertValidSDL, "assertValidSDL");

// node_modules/graphql/execution/execute.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/memoize3.mjs
init_modules_watch_stub();
function memoize3(fn) {
  let cache0;
  return /* @__PURE__ */ __name(function memoized(a1, a2, a3) {
    if (cache0 === void 0) {
      cache0 = /* @__PURE__ */ new WeakMap();
    }
    let cache1 = cache0.get(a1);
    if (cache1 === void 0) {
      cache1 = /* @__PURE__ */ new WeakMap();
      cache0.set(a1, cache1);
    }
    let cache2 = cache1.get(a2);
    if (cache2 === void 0) {
      cache2 = /* @__PURE__ */ new WeakMap();
      cache1.set(a2, cache2);
    }
    let fnResult = cache2.get(a3);
    if (fnResult === void 0) {
      fnResult = fn(a1, a2, a3);
      cache2.set(a3, fnResult);
    }
    return fnResult;
  }, "memoized");
}
__name(memoize3, "memoize3");

// node_modules/graphql/jsutils/promiseForObject.mjs
init_modules_watch_stub();
function promiseForObject(object) {
  return Promise.all(Object.values(object)).then((resolvedValues) => {
    const resolvedObject = /* @__PURE__ */ Object.create(null);
    for (const [i, key] of Object.keys(object).entries()) {
      resolvedObject[key] = resolvedValues[i];
    }
    return resolvedObject;
  });
}
__name(promiseForObject, "promiseForObject");

// node_modules/graphql/jsutils/promiseReduce.mjs
init_modules_watch_stub();
function promiseReduce(values, callbackFn, initialValue) {
  let accumulator = initialValue;
  for (const value of values) {
    accumulator = isPromise(accumulator) ? accumulator.then((resolved) => callbackFn(resolved, value)) : callbackFn(accumulator, value);
  }
  return accumulator;
}
__name(promiseReduce, "promiseReduce");

// node_modules/graphql/error/locatedError.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/toError.mjs
init_modules_watch_stub();
function toError(thrownValue) {
  return thrownValue instanceof Error ? thrownValue : new NonErrorThrown(thrownValue);
}
__name(toError, "toError");
var NonErrorThrown = class extends Error {
  static {
    __name(this, "NonErrorThrown");
  }
  constructor(thrownValue) {
    super("Unexpected error value: " + inspect(thrownValue));
    this.name = "NonErrorThrown";
    this.thrownValue = thrownValue;
  }
};

// node_modules/graphql/error/locatedError.mjs
function locatedError(rawOriginalError, nodes, path) {
  var _nodes;
  const originalError = toError(rawOriginalError);
  if (isLocatedGraphQLError(originalError)) {
    return originalError;
  }
  return new GraphQLError(originalError.message, {
    nodes: (_nodes = originalError.nodes) !== null && _nodes !== void 0 ? _nodes : nodes,
    source: originalError.source,
    positions: originalError.positions,
    path,
    originalError
  });
}
__name(locatedError, "locatedError");
function isLocatedGraphQLError(error) {
  return Array.isArray(error.path);
}
__name(isLocatedGraphQLError, "isLocatedGraphQLError");

// node_modules/graphql/execution/execute.mjs
var collectSubfields2 = memoize3(
  (exeContext, returnType, fieldNodes) => collectSubfields(
    exeContext.schema,
    exeContext.fragments,
    exeContext.variableValues,
    returnType,
    fieldNodes
  )
);
function execute(args) {
  arguments.length < 2 || devAssert(
    false,
    "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
  );
  const { schema: schema2, document, variableValues, rootValue } = args;
  assertValidExecutionArguments(schema2, document, variableValues);
  const exeContext = buildExecutionContext(args);
  if (!("schema" in exeContext)) {
    return {
      errors: exeContext
    };
  }
  try {
    const { operation } = exeContext;
    const result = executeOperation(exeContext, operation, rootValue);
    if (isPromise(result)) {
      return result.then(
        (data) => buildResponse(data, exeContext.errors),
        (error) => {
          exeContext.errors.push(error);
          return buildResponse(null, exeContext.errors);
        }
      );
    }
    return buildResponse(result, exeContext.errors);
  } catch (error) {
    exeContext.errors.push(error);
    return buildResponse(null, exeContext.errors);
  }
}
__name(execute, "execute");
function buildResponse(data, errors) {
  return errors.length === 0 ? {
    data
  } : {
    errors,
    data
  };
}
__name(buildResponse, "buildResponse");
function assertValidExecutionArguments(schema2, document, rawVariableValues) {
  document || devAssert(false, "Must provide document.");
  assertValidSchema(schema2);
  rawVariableValues == null || isObjectLike(rawVariableValues) || devAssert(
    false,
    "Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided."
  );
}
__name(assertValidExecutionArguments, "assertValidExecutionArguments");
function buildExecutionContext(args) {
  var _definition$name, _operation$variableDe, _options$maxCoercionE;
  const {
    schema: schema2,
    document,
    rootValue,
    contextValue,
    variableValues: rawVariableValues,
    operationName,
    fieldResolver,
    typeResolver,
    subscribeFieldResolver,
    options
  } = args;
  let operation;
  const fragments = /* @__PURE__ */ Object.create(null);
  for (const definition of document.definitions) {
    switch (definition.kind) {
      case Kind.OPERATION_DEFINITION:
        if (operationName == null) {
          if (operation !== void 0) {
            return [
              new GraphQLError(
                "Must provide operation name if query contains multiple operations."
              )
            ];
          }
          operation = definition;
        } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
          operation = definition;
        }
        break;
      case Kind.FRAGMENT_DEFINITION:
        fragments[definition.name.value] = definition;
        break;
      default:
    }
  }
  if (!operation) {
    if (operationName != null) {
      return [new GraphQLError(`Unknown operation named "${operationName}".`)];
    }
    return [new GraphQLError("Must provide an operation.")];
  }
  const variableDefinitions = (_operation$variableDe = operation.variableDefinitions) !== null && _operation$variableDe !== void 0 ? _operation$variableDe : [];
  const coercedVariableValues = getVariableValues(
    schema2,
    variableDefinitions,
    rawVariableValues !== null && rawVariableValues !== void 0 ? rawVariableValues : {},
    {
      maxErrors: (_options$maxCoercionE = options === null || options === void 0 ? void 0 : options.maxCoercionErrors) !== null && _options$maxCoercionE !== void 0 ? _options$maxCoercionE : 50
    }
  );
  if (coercedVariableValues.errors) {
    return coercedVariableValues.errors;
  }
  return {
    schema: schema2,
    fragments,
    rootValue,
    contextValue,
    operation,
    variableValues: coercedVariableValues.coerced,
    fieldResolver: fieldResolver !== null && fieldResolver !== void 0 ? fieldResolver : defaultFieldResolver,
    typeResolver: typeResolver !== null && typeResolver !== void 0 ? typeResolver : defaultTypeResolver,
    subscribeFieldResolver: subscribeFieldResolver !== null && subscribeFieldResolver !== void 0 ? subscribeFieldResolver : defaultFieldResolver,
    errors: []
  };
}
__name(buildExecutionContext, "buildExecutionContext");
function executeOperation(exeContext, operation, rootValue) {
  const rootType = exeContext.schema.getRootType(operation.operation);
  if (rootType == null) {
    throw new GraphQLError(
      `Schema is not configured to execute ${operation.operation} operation.`,
      {
        nodes: operation
      }
    );
  }
  const rootFields = collectFields(
    exeContext.schema,
    exeContext.fragments,
    exeContext.variableValues,
    rootType,
    operation.selectionSet
  );
  const path = void 0;
  switch (operation.operation) {
    case OperationTypeNode.QUERY:
      return executeFields(exeContext, rootType, rootValue, path, rootFields);
    case OperationTypeNode.MUTATION:
      return executeFieldsSerially(
        exeContext,
        rootType,
        rootValue,
        path,
        rootFields
      );
    case OperationTypeNode.SUBSCRIPTION:
      return executeFields(exeContext, rootType, rootValue, path, rootFields);
  }
}
__name(executeOperation, "executeOperation");
function executeFieldsSerially(exeContext, parentType, sourceValue, path, fields) {
  return promiseReduce(
    fields.entries(),
    (results, [responseName, fieldNodes]) => {
      const fieldPath = addPath(path, responseName, parentType.name);
      const result = executeField(
        exeContext,
        parentType,
        sourceValue,
        fieldNodes,
        fieldPath
      );
      if (result === void 0) {
        return results;
      }
      if (isPromise(result)) {
        return result.then((resolvedResult) => {
          results[responseName] = resolvedResult;
          return results;
        });
      }
      results[responseName] = result;
      return results;
    },
    /* @__PURE__ */ Object.create(null)
  );
}
__name(executeFieldsSerially, "executeFieldsSerially");
function executeFields(exeContext, parentType, sourceValue, path, fields) {
  const results = /* @__PURE__ */ Object.create(null);
  let containsPromise = false;
  try {
    for (const [responseName, fieldNodes] of fields.entries()) {
      const fieldPath = addPath(path, responseName, parentType.name);
      const result = executeField(
        exeContext,
        parentType,
        sourceValue,
        fieldNodes,
        fieldPath
      );
      if (result !== void 0) {
        results[responseName] = result;
        if (isPromise(result)) {
          containsPromise = true;
        }
      }
    }
  } catch (error) {
    if (containsPromise) {
      return promiseForObject(results).finally(() => {
        throw error;
      });
    }
    throw error;
  }
  if (!containsPromise) {
    return results;
  }
  return promiseForObject(results);
}
__name(executeFields, "executeFields");
function executeField(exeContext, parentType, source, fieldNodes, path) {
  var _fieldDef$resolve;
  const fieldDef = getFieldDef2(exeContext.schema, parentType, fieldNodes[0]);
  if (!fieldDef) {
    return;
  }
  const returnType = fieldDef.type;
  const resolveFn = (_fieldDef$resolve = fieldDef.resolve) !== null && _fieldDef$resolve !== void 0 ? _fieldDef$resolve : exeContext.fieldResolver;
  const info = buildResolveInfo(
    exeContext,
    fieldDef,
    fieldNodes,
    parentType,
    path
  );
  try {
    const args = getArgumentValues(
      fieldDef,
      fieldNodes[0],
      exeContext.variableValues
    );
    const contextValue = exeContext.contextValue;
    const result = resolveFn(source, args, contextValue, info);
    let completed;
    if (isPromise(result)) {
      completed = result.then(
        (resolved) => completeValue(exeContext, returnType, fieldNodes, info, path, resolved)
      );
    } else {
      completed = completeValue(
        exeContext,
        returnType,
        fieldNodes,
        info,
        path,
        result
      );
    }
    if (isPromise(completed)) {
      return completed.then(void 0, (rawError) => {
        const error = locatedError(rawError, fieldNodes, pathToArray(path));
        return handleFieldError(error, returnType, exeContext);
      });
    }
    return completed;
  } catch (rawError) {
    const error = locatedError(rawError, fieldNodes, pathToArray(path));
    return handleFieldError(error, returnType, exeContext);
  }
}
__name(executeField, "executeField");
function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path) {
  return {
    fieldName: fieldDef.name,
    fieldNodes,
    returnType: fieldDef.type,
    parentType,
    path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
  };
}
__name(buildResolveInfo, "buildResolveInfo");
function handleFieldError(error, returnType, exeContext) {
  if (isNonNullType(returnType)) {
    throw error;
  }
  exeContext.errors.push(error);
  return null;
}
__name(handleFieldError, "handleFieldError");
function completeValue(exeContext, returnType, fieldNodes, info, path, result) {
  if (result instanceof Error) {
    throw result;
  }
  if (isNonNullType(returnType)) {
    const completed = completeValue(
      exeContext,
      returnType.ofType,
      fieldNodes,
      info,
      path,
      result
    );
    if (completed === null) {
      throw new Error(
        `Cannot return null for non-nullable field ${info.parentType.name}.${info.fieldName}.`
      );
    }
    return completed;
  }
  if (result == null) {
    return null;
  }
  if (isListType(returnType)) {
    return completeListValue(
      exeContext,
      returnType,
      fieldNodes,
      info,
      path,
      result
    );
  }
  if (isLeafType(returnType)) {
    return completeLeafValue(returnType, result);
  }
  if (isAbstractType(returnType)) {
    return completeAbstractValue(
      exeContext,
      returnType,
      fieldNodes,
      info,
      path,
      result
    );
  }
  if (isObjectType(returnType)) {
    return completeObjectValue(
      exeContext,
      returnType,
      fieldNodes,
      info,
      path,
      result
    );
  }
  invariant(
    false,
    "Cannot complete value of unexpected output type: " + inspect(returnType)
  );
}
__name(completeValue, "completeValue");
function completeListValue(exeContext, returnType, fieldNodes, info, path, result) {
  if (!isIterableObject(result)) {
    throw new GraphQLError(
      `Expected Iterable, but did not find one for field "${info.parentType.name}.${info.fieldName}".`
    );
  }
  const itemType = returnType.ofType;
  let containsPromise = false;
  const completedResults = Array.from(result, (item, index) => {
    const itemPath = addPath(path, index, void 0);
    try {
      let completedItem;
      if (isPromise(item)) {
        completedItem = item.then(
          (resolved) => completeValue(
            exeContext,
            itemType,
            fieldNodes,
            info,
            itemPath,
            resolved
          )
        );
      } else {
        completedItem = completeValue(
          exeContext,
          itemType,
          fieldNodes,
          info,
          itemPath,
          item
        );
      }
      if (isPromise(completedItem)) {
        containsPromise = true;
        return completedItem.then(void 0, (rawError) => {
          const error = locatedError(
            rawError,
            fieldNodes,
            pathToArray(itemPath)
          );
          return handleFieldError(error, itemType, exeContext);
        });
      }
      return completedItem;
    } catch (rawError) {
      const error = locatedError(rawError, fieldNodes, pathToArray(itemPath));
      return handleFieldError(error, itemType, exeContext);
    }
  });
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
__name(completeListValue, "completeListValue");
function completeLeafValue(returnType, result) {
  const serializedResult = returnType.serialize(result);
  if (serializedResult == null) {
    throw new Error(
      `Expected \`${inspect(returnType)}.serialize(${inspect(result)})\` to return non-nullable value, returned: ${inspect(serializedResult)}`
    );
  }
  return serializedResult;
}
__name(completeLeafValue, "completeLeafValue");
function completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result) {
  var _returnType$resolveTy;
  const resolveTypeFn = (_returnType$resolveTy = returnType.resolveType) !== null && _returnType$resolveTy !== void 0 ? _returnType$resolveTy : exeContext.typeResolver;
  const contextValue = exeContext.contextValue;
  const runtimeType = resolveTypeFn(result, contextValue, info, returnType);
  if (isPromise(runtimeType)) {
    return runtimeType.then(
      (resolvedRuntimeType) => completeObjectValue(
        exeContext,
        ensureValidRuntimeType(
          resolvedRuntimeType,
          exeContext,
          returnType,
          fieldNodes,
          info,
          result
        ),
        fieldNodes,
        info,
        path,
        result
      )
    );
  }
  return completeObjectValue(
    exeContext,
    ensureValidRuntimeType(
      runtimeType,
      exeContext,
      returnType,
      fieldNodes,
      info,
      result
    ),
    fieldNodes,
    info,
    path,
    result
  );
}
__name(completeAbstractValue, "completeAbstractValue");
function ensureValidRuntimeType(runtimeTypeName, exeContext, returnType, fieldNodes, info, result) {
  if (runtimeTypeName == null) {
    throw new GraphQLError(
      `Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}". Either the "${returnType.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`,
      fieldNodes
    );
  }
  if (isObjectType(runtimeTypeName)) {
    throw new GraphQLError(
      "Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead."
    );
  }
  if (typeof runtimeTypeName !== "string") {
    throw new GraphQLError(
      `Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}" with value ${inspect(result)}, received "${inspect(runtimeTypeName)}".`
    );
  }
  const runtimeType = exeContext.schema.getType(runtimeTypeName);
  if (runtimeType == null) {
    throw new GraphQLError(
      `Abstract type "${returnType.name}" was resolved to a type "${runtimeTypeName}" that does not exist inside the schema.`,
      {
        nodes: fieldNodes
      }
    );
  }
  if (!isObjectType(runtimeType)) {
    throw new GraphQLError(
      `Abstract type "${returnType.name}" was resolved to a non-object type "${runtimeTypeName}".`,
      {
        nodes: fieldNodes
      }
    );
  }
  if (!exeContext.schema.isSubType(returnType, runtimeType)) {
    throw new GraphQLError(
      `Runtime Object type "${runtimeType.name}" is not a possible type for "${returnType.name}".`,
      {
        nodes: fieldNodes
      }
    );
  }
  return runtimeType;
}
__name(ensureValidRuntimeType, "ensureValidRuntimeType");
function completeObjectValue(exeContext, returnType, fieldNodes, info, path, result) {
  const subFieldNodes = collectSubfields2(exeContext, returnType, fieldNodes);
  if (returnType.isTypeOf) {
    const isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);
    if (isPromise(isTypeOf)) {
      return isTypeOf.then((resolvedIsTypeOf) => {
        if (!resolvedIsTypeOf) {
          throw invalidReturnTypeError(returnType, result, fieldNodes);
        }
        return executeFields(
          exeContext,
          returnType,
          result,
          path,
          subFieldNodes
        );
      });
    }
    if (!isTypeOf) {
      throw invalidReturnTypeError(returnType, result, fieldNodes);
    }
  }
  return executeFields(exeContext, returnType, result, path, subFieldNodes);
}
__name(completeObjectValue, "completeObjectValue");
function invalidReturnTypeError(returnType, result, fieldNodes) {
  return new GraphQLError(
    `Expected value of type "${returnType.name}" but got: ${inspect(result)}.`,
    {
      nodes: fieldNodes
    }
  );
}
__name(invalidReturnTypeError, "invalidReturnTypeError");
var defaultTypeResolver = /* @__PURE__ */ __name(function(value, contextValue, info, abstractType) {
  if (isObjectLike(value) && typeof value.__typename === "string") {
    return value.__typename;
  }
  const possibleTypes = info.schema.getPossibleTypes(abstractType);
  const promisedIsTypeOfResults = [];
  for (let i = 0; i < possibleTypes.length; i++) {
    const type = possibleTypes[i];
    if (type.isTypeOf) {
      const isTypeOfResult = type.isTypeOf(value, contextValue, info);
      if (isPromise(isTypeOfResult)) {
        promisedIsTypeOfResults[i] = isTypeOfResult;
      } else if (isTypeOfResult) {
        return type.name;
      }
    }
  }
  if (promisedIsTypeOfResults.length) {
    return Promise.all(promisedIsTypeOfResults).then((isTypeOfResults) => {
      for (let i = 0; i < isTypeOfResults.length; i++) {
        if (isTypeOfResults[i]) {
          return possibleTypes[i].name;
        }
      }
    });
  }
}, "defaultTypeResolver");
var defaultFieldResolver = /* @__PURE__ */ __name(function(source, args, contextValue, info) {
  if (isObjectLike(source) || typeof source === "function") {
    const property = source[info.fieldName];
    if (typeof property === "function") {
      return source[info.fieldName](args, contextValue, info);
    }
    return property;
  }
}, "defaultFieldResolver");
function getFieldDef2(schema2, parentType, fieldNode) {
  const fieldName = fieldNode.name.value;
  if (fieldName === SchemaMetaFieldDef.name && schema2.getQueryType() === parentType) {
    return SchemaMetaFieldDef;
  } else if (fieldName === TypeMetaFieldDef.name && schema2.getQueryType() === parentType) {
    return TypeMetaFieldDef;
  } else if (fieldName === TypeNameMetaFieldDef.name) {
    return TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}
__name(getFieldDef2, "getFieldDef");

// node_modules/graphql/type/index.mjs
init_modules_watch_stub();

// node_modules/graphql/language/index.mjs
init_modules_watch_stub();

// node_modules/graphql/execution/index.mjs
init_modules_watch_stub();

// node_modules/graphql/execution/subscribe.mjs
init_modules_watch_stub();

// node_modules/graphql/jsutils/isAsyncIterable.mjs
init_modules_watch_stub();
function isAsyncIterable(maybeAsyncIterable) {
  return typeof (maybeAsyncIterable === null || maybeAsyncIterable === void 0 ? void 0 : maybeAsyncIterable[Symbol.asyncIterator]) === "function";
}
__name(isAsyncIterable, "isAsyncIterable");

// node_modules/graphql/execution/mapAsyncIterator.mjs
init_modules_watch_stub();
function mapAsyncIterator(iterable, callback) {
  const iterator = iterable[Symbol.asyncIterator]();
  async function mapResult(result) {
    if (result.done) {
      return result;
    }
    try {
      return {
        value: await callback(result.value),
        done: false
      };
    } catch (error) {
      if (typeof iterator.return === "function") {
        try {
          await iterator.return();
        } catch (_e) {
        }
      }
      throw error;
    }
  }
  __name(mapResult, "mapResult");
  return {
    async next() {
      return mapResult(await iterator.next());
    },
    async return() {
      return typeof iterator.return === "function" ? mapResult(await iterator.return()) : {
        value: void 0,
        done: true
      };
    },
    async throw(error) {
      if (typeof iterator.throw === "function") {
        return mapResult(await iterator.throw(error));
      }
      throw error;
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
__name(mapAsyncIterator, "mapAsyncIterator");

// node_modules/graphql/execution/subscribe.mjs
async function subscribe(args) {
  arguments.length < 2 || devAssert(
    false,
    "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
  );
  const resultOrStream = await createSourceEventStream(args);
  if (!isAsyncIterable(resultOrStream)) {
    return resultOrStream;
  }
  const mapSourceToResponse2 = /* @__PURE__ */ __name((payload) => execute({ ...args, rootValue: payload }), "mapSourceToResponse");
  return mapAsyncIterator(resultOrStream, mapSourceToResponse2);
}
__name(subscribe, "subscribe");
function toNormalizedArgs(args) {
  const firstArg = args[0];
  if (firstArg && "document" in firstArg) {
    return firstArg;
  }
  return {
    schema: firstArg,
    // FIXME: when underlying TS bug fixed, see https://github.com/microsoft/TypeScript/issues/31613
    document: args[1],
    rootValue: args[2],
    contextValue: args[3],
    variableValues: args[4],
    operationName: args[5],
    subscribeFieldResolver: args[6]
  };
}
__name(toNormalizedArgs, "toNormalizedArgs");
async function createSourceEventStream(...rawArgs) {
  const args = toNormalizedArgs(rawArgs);
  const { schema: schema2, document, variableValues } = args;
  assertValidExecutionArguments(schema2, document, variableValues);
  const exeContext = buildExecutionContext(args);
  if (!("schema" in exeContext)) {
    return {
      errors: exeContext
    };
  }
  try {
    const eventStream = await executeSubscription(exeContext);
    if (!isAsyncIterable(eventStream)) {
      throw new Error(
        `Subscription field must return Async Iterable. Received: ${inspect(eventStream)}.`
      );
    }
    return eventStream;
  } catch (error) {
    if (error instanceof GraphQLError) {
      return {
        errors: [error]
      };
    }
    throw error;
  }
}
__name(createSourceEventStream, "createSourceEventStream");
async function executeSubscription(exeContext) {
  const { schema: schema2, fragments, operation, variableValues, rootValue } = exeContext;
  const rootType = schema2.getSubscriptionType();
  if (rootType == null) {
    throw new GraphQLError(
      "Schema is not configured to execute subscription operation.",
      {
        nodes: operation
      }
    );
  }
  const rootFields = collectFields(
    schema2,
    fragments,
    variableValues,
    rootType,
    operation.selectionSet
  );
  const [responseName, fieldNodes] = [...rootFields.entries()][0];
  const fieldDef = getFieldDef2(schema2, rootType, fieldNodes[0]);
  if (!fieldDef) {
    const fieldName = fieldNodes[0].name.value;
    throw new GraphQLError(
      `The subscription field "${fieldName}" is not defined.`,
      {
        nodes: fieldNodes
      }
    );
  }
  const path = addPath(void 0, responseName, rootType.name);
  const info = buildResolveInfo(
    exeContext,
    fieldDef,
    fieldNodes,
    rootType,
    path
  );
  try {
    var _fieldDef$subscribe;
    const args = getArgumentValues(fieldDef, fieldNodes[0], variableValues);
    const contextValue = exeContext.contextValue;
    const resolveFn = (_fieldDef$subscribe = fieldDef.subscribe) !== null && _fieldDef$subscribe !== void 0 ? _fieldDef$subscribe : exeContext.subscribeFieldResolver;
    const eventStream = await resolveFn(rootValue, args, contextValue, info);
    if (eventStream instanceof Error) {
      throw eventStream;
    }
    return eventStream;
  } catch (error) {
    throw locatedError(error, fieldNodes, pathToArray(path));
  }
}
__name(executeSubscription, "executeSubscription");

// node_modules/graphql/validation/index.mjs
init_modules_watch_stub();

// node_modules/graphql/error/index.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/index.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/getOperationAST.mjs
init_modules_watch_stub();
function getOperationAST(documentAST, operationName) {
  let operation = null;
  for (const definition of documentAST.definitions) {
    if (definition.kind === Kind.OPERATION_DEFINITION) {
      var _definition$name;
      if (operationName == null) {
        if (operation) {
          return null;
        }
        operation = definition;
      } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
        return definition;
      }
    }
  }
  return operation;
}
__name(getOperationAST, "getOperationAST");

// node_modules/graphql/utilities/buildASTSchema.mjs
init_modules_watch_stub();

// node_modules/graphql/utilities/extendSchema.mjs
init_modules_watch_stub();
function extendSchemaImpl(schemaConfig, documentAST, options) {
  var _schemaDef, _schemaDef$descriptio, _schemaDef2, _options$assumeValid;
  const typeDefs2 = [];
  const typeExtensionsMap = /* @__PURE__ */ Object.create(null);
  const directiveDefs = [];
  let schemaDef;
  const schemaExtensions = [];
  for (const def of documentAST.definitions) {
    if (def.kind === Kind.SCHEMA_DEFINITION) {
      schemaDef = def;
    } else if (def.kind === Kind.SCHEMA_EXTENSION) {
      schemaExtensions.push(def);
    } else if (isTypeDefinitionNode(def)) {
      typeDefs2.push(def);
    } else if (isTypeExtensionNode(def)) {
      const extendedTypeName = def.name.value;
      const existingTypeExtensions = typeExtensionsMap[extendedTypeName];
      typeExtensionsMap[extendedTypeName] = existingTypeExtensions ? existingTypeExtensions.concat([def]) : [def];
    } else if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      directiveDefs.push(def);
    }
  }
  if (Object.keys(typeExtensionsMap).length === 0 && typeDefs2.length === 0 && directiveDefs.length === 0 && schemaExtensions.length === 0 && schemaDef == null) {
    return schemaConfig;
  }
  const typeMap = /* @__PURE__ */ Object.create(null);
  for (const existingType of schemaConfig.types) {
    typeMap[existingType.name] = extendNamedType(existingType);
  }
  for (const typeNode of typeDefs2) {
    var _stdTypeMap$name;
    const name = typeNode.name.value;
    typeMap[name] = (_stdTypeMap$name = stdTypeMap[name]) !== null && _stdTypeMap$name !== void 0 ? _stdTypeMap$name : buildType(typeNode);
  }
  const operationTypes = {
    // Get the extended root operation types.
    query: schemaConfig.query && replaceNamedType(schemaConfig.query),
    mutation: schemaConfig.mutation && replaceNamedType(schemaConfig.mutation),
    subscription: schemaConfig.subscription && replaceNamedType(schemaConfig.subscription),
    // Then, incorporate schema definition and all schema extensions.
    ...schemaDef && getOperationTypes([schemaDef]),
    ...getOperationTypes(schemaExtensions)
  };
  return {
    description: (_schemaDef = schemaDef) === null || _schemaDef === void 0 ? void 0 : (_schemaDef$descriptio = _schemaDef.description) === null || _schemaDef$descriptio === void 0 ? void 0 : _schemaDef$descriptio.value,
    ...operationTypes,
    types: Object.values(typeMap),
    directives: [
      ...schemaConfig.directives.map(replaceDirective),
      ...directiveDefs.map(buildDirective)
    ],
    extensions: /* @__PURE__ */ Object.create(null),
    astNode: (_schemaDef2 = schemaDef) !== null && _schemaDef2 !== void 0 ? _schemaDef2 : schemaConfig.astNode,
    extensionASTNodes: schemaConfig.extensionASTNodes.concat(schemaExtensions),
    assumeValid: (_options$assumeValid = options === null || options === void 0 ? void 0 : options.assumeValid) !== null && _options$assumeValid !== void 0 ? _options$assumeValid : false
  };
  function replaceType(type) {
    if (isListType(type)) {
      return new GraphQLList(replaceType(type.ofType));
    }
    if (isNonNullType(type)) {
      return new GraphQLNonNull(replaceType(type.ofType));
    }
    return replaceNamedType(type);
  }
  __name(replaceType, "replaceType");
  function replaceNamedType(type) {
    return typeMap[type.name];
  }
  __name(replaceNamedType, "replaceNamedType");
  function replaceDirective(directive) {
    const config = directive.toConfig();
    return new GraphQLDirective({
      ...config,
      args: mapValue(config.args, extendArg)
    });
  }
  __name(replaceDirective, "replaceDirective");
  function extendNamedType(type) {
    if (isIntrospectionType(type) || isSpecifiedScalarType(type)) {
      return type;
    }
    if (isScalarType(type)) {
      return extendScalarType(type);
    }
    if (isObjectType(type)) {
      return extendObjectType(type);
    }
    if (isInterfaceType(type)) {
      return extendInterfaceType(type);
    }
    if (isUnionType(type)) {
      return extendUnionType(type);
    }
    if (isEnumType(type)) {
      return extendEnumType(type);
    }
    if (isInputObjectType(type)) {
      return extendInputObjectType(type);
    }
    invariant(false, "Unexpected type: " + inspect(type));
  }
  __name(extendNamedType, "extendNamedType");
  function extendInputObjectType(type) {
    var _typeExtensionsMap$co;
    const config = type.toConfig();
    const extensions = (_typeExtensionsMap$co = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co !== void 0 ? _typeExtensionsMap$co : [];
    return new GraphQLInputObjectType({
      ...config,
      fields: /* @__PURE__ */ __name(() => ({
        ...mapValue(config.fields, (field) => ({
          ...field,
          type: replaceType(field.type)
        })),
        ...buildInputFieldMap(extensions)
      }), "fields"),
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    });
  }
  __name(extendInputObjectType, "extendInputObjectType");
  function extendEnumType(type) {
    var _typeExtensionsMap$ty;
    const config = type.toConfig();
    const extensions = (_typeExtensionsMap$ty = typeExtensionsMap[type.name]) !== null && _typeExtensionsMap$ty !== void 0 ? _typeExtensionsMap$ty : [];
    return new GraphQLEnumType({
      ...config,
      values: { ...config.values, ...buildEnumValueMap(extensions) },
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    });
  }
  __name(extendEnumType, "extendEnumType");
  function extendScalarType(type) {
    var _typeExtensionsMap$co2;
    const config = type.toConfig();
    const extensions = (_typeExtensionsMap$co2 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co2 !== void 0 ? _typeExtensionsMap$co2 : [];
    let specifiedByURL = config.specifiedByURL;
    for (const extensionNode of extensions) {
      var _getSpecifiedByURL;
      specifiedByURL = (_getSpecifiedByURL = getSpecifiedByURL(extensionNode)) !== null && _getSpecifiedByURL !== void 0 ? _getSpecifiedByURL : specifiedByURL;
    }
    return new GraphQLScalarType({
      ...config,
      specifiedByURL,
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    });
  }
  __name(extendScalarType, "extendScalarType");
  function extendObjectType(type) {
    var _typeExtensionsMap$co3;
    const config = type.toConfig();
    const extensions = (_typeExtensionsMap$co3 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co3 !== void 0 ? _typeExtensionsMap$co3 : [];
    return new GraphQLObjectType({
      ...config,
      interfaces: /* @__PURE__ */ __name(() => [
        ...type.getInterfaces().map(replaceNamedType),
        ...buildInterfaces(extensions)
      ], "interfaces"),
      fields: /* @__PURE__ */ __name(() => ({
        ...mapValue(config.fields, extendField),
        ...buildFieldMap(extensions)
      }), "fields"),
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    });
  }
  __name(extendObjectType, "extendObjectType");
  function extendInterfaceType(type) {
    var _typeExtensionsMap$co4;
    const config = type.toConfig();
    const extensions = (_typeExtensionsMap$co4 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co4 !== void 0 ? _typeExtensionsMap$co4 : [];
    return new GraphQLInterfaceType({
      ...config,
      interfaces: /* @__PURE__ */ __name(() => [
        ...type.getInterfaces().map(replaceNamedType),
        ...buildInterfaces(extensions)
      ], "interfaces"),
      fields: /* @__PURE__ */ __name(() => ({
        ...mapValue(config.fields, extendField),
        ...buildFieldMap(extensions)
      }), "fields"),
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    });
  }
  __name(extendInterfaceType, "extendInterfaceType");
  function extendUnionType(type) {
    var _typeExtensionsMap$co5;
    const config = type.toConfig();
    const extensions = (_typeExtensionsMap$co5 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co5 !== void 0 ? _typeExtensionsMap$co5 : [];
    return new GraphQLUnionType({
      ...config,
      types: /* @__PURE__ */ __name(() => [
        ...type.getTypes().map(replaceNamedType),
        ...buildUnionTypes(extensions)
      ], "types"),
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    });
  }
  __name(extendUnionType, "extendUnionType");
  function extendField(field) {
    return {
      ...field,
      type: replaceType(field.type),
      args: field.args && mapValue(field.args, extendArg)
    };
  }
  __name(extendField, "extendField");
  function extendArg(arg) {
    return { ...arg, type: replaceType(arg.type) };
  }
  __name(extendArg, "extendArg");
  function getOperationTypes(nodes) {
    const opTypes = {};
    for (const node of nodes) {
      var _node$operationTypes;
      const operationTypesNodes = (
        /* c8 ignore next */
        (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : []
      );
      for (const operationType of operationTypesNodes) {
        opTypes[operationType.operation] = getNamedType2(operationType.type);
      }
    }
    return opTypes;
  }
  __name(getOperationTypes, "getOperationTypes");
  function getNamedType2(node) {
    var _stdTypeMap$name2;
    const name = node.name.value;
    const type = (_stdTypeMap$name2 = stdTypeMap[name]) !== null && _stdTypeMap$name2 !== void 0 ? _stdTypeMap$name2 : typeMap[name];
    if (type === void 0) {
      throw new Error(`Unknown type: "${name}".`);
    }
    return type;
  }
  __name(getNamedType2, "getNamedType");
  function getWrappedType(node) {
    if (node.kind === Kind.LIST_TYPE) {
      return new GraphQLList(getWrappedType(node.type));
    }
    if (node.kind === Kind.NON_NULL_TYPE) {
      return new GraphQLNonNull(getWrappedType(node.type));
    }
    return getNamedType2(node);
  }
  __name(getWrappedType, "getWrappedType");
  function buildDirective(node) {
    var _node$description;
    return new GraphQLDirective({
      name: node.name.value,
      description: (_node$description = node.description) === null || _node$description === void 0 ? void 0 : _node$description.value,
      // @ts-expect-error
      locations: node.locations.map(({ value }) => value),
      isRepeatable: node.repeatable,
      args: buildArgumentMap(node.arguments),
      astNode: node
    });
  }
  __name(buildDirective, "buildDirective");
  function buildFieldMap(nodes) {
    const fieldConfigMap = /* @__PURE__ */ Object.create(null);
    for (const node of nodes) {
      var _node$fields;
      const nodeFields = (
        /* c8 ignore next */
        (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : []
      );
      for (const field of nodeFields) {
        var _field$description;
        fieldConfigMap[field.name.value] = {
          // Note: While this could make assertions to get the correctly typed
          // value, that would throw immediately while type system validation
          // with validateSchema() will produce more actionable results.
          type: getWrappedType(field.type),
          description: (_field$description = field.description) === null || _field$description === void 0 ? void 0 : _field$description.value,
          args: buildArgumentMap(field.arguments),
          deprecationReason: getDeprecationReason(field),
          astNode: field
        };
      }
    }
    return fieldConfigMap;
  }
  __name(buildFieldMap, "buildFieldMap");
  function buildArgumentMap(args) {
    const argsNodes = (
      /* c8 ignore next */
      args !== null && args !== void 0 ? args : []
    );
    const argConfigMap = /* @__PURE__ */ Object.create(null);
    for (const arg of argsNodes) {
      var _arg$description;
      const type = getWrappedType(arg.type);
      argConfigMap[arg.name.value] = {
        type,
        description: (_arg$description = arg.description) === null || _arg$description === void 0 ? void 0 : _arg$description.value,
        defaultValue: valueFromAST(arg.defaultValue, type),
        deprecationReason: getDeprecationReason(arg),
        astNode: arg
      };
    }
    return argConfigMap;
  }
  __name(buildArgumentMap, "buildArgumentMap");
  function buildInputFieldMap(nodes) {
    const inputFieldMap = /* @__PURE__ */ Object.create(null);
    for (const node of nodes) {
      var _node$fields2;
      const fieldsNodes = (
        /* c8 ignore next */
        (_node$fields2 = node.fields) !== null && _node$fields2 !== void 0 ? _node$fields2 : []
      );
      for (const field of fieldsNodes) {
        var _field$description2;
        const type = getWrappedType(field.type);
        inputFieldMap[field.name.value] = {
          type,
          description: (_field$description2 = field.description) === null || _field$description2 === void 0 ? void 0 : _field$description2.value,
          defaultValue: valueFromAST(field.defaultValue, type),
          deprecationReason: getDeprecationReason(field),
          astNode: field
        };
      }
    }
    return inputFieldMap;
  }
  __name(buildInputFieldMap, "buildInputFieldMap");
  function buildEnumValueMap(nodes) {
    const enumValueMap = /* @__PURE__ */ Object.create(null);
    for (const node of nodes) {
      var _node$values;
      const valuesNodes = (
        /* c8 ignore next */
        (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : []
      );
      for (const value of valuesNodes) {
        var _value$description;
        enumValueMap[value.name.value] = {
          description: (_value$description = value.description) === null || _value$description === void 0 ? void 0 : _value$description.value,
          deprecationReason: getDeprecationReason(value),
          astNode: value
        };
      }
    }
    return enumValueMap;
  }
  __name(buildEnumValueMap, "buildEnumValueMap");
  function buildInterfaces(nodes) {
    return nodes.flatMap(
      // FIXME: https://github.com/graphql/graphql-js/issues/2203
      (node) => {
        var _node$interfaces$map, _node$interfaces;
        return (
          /* c8 ignore next */
          (_node$interfaces$map = (_node$interfaces = node.interfaces) === null || _node$interfaces === void 0 ? void 0 : _node$interfaces.map(getNamedType2)) !== null && _node$interfaces$map !== void 0 ? _node$interfaces$map : []
        );
      }
    );
  }
  __name(buildInterfaces, "buildInterfaces");
  function buildUnionTypes(nodes) {
    return nodes.flatMap(
      // FIXME: https://github.com/graphql/graphql-js/issues/2203
      (node) => {
        var _node$types$map, _node$types;
        return (
          /* c8 ignore next */
          (_node$types$map = (_node$types = node.types) === null || _node$types === void 0 ? void 0 : _node$types.map(getNamedType2)) !== null && _node$types$map !== void 0 ? _node$types$map : []
        );
      }
    );
  }
  __name(buildUnionTypes, "buildUnionTypes");
  function buildType(astNode) {
    var _typeExtensionsMap$na;
    const name = astNode.name.value;
    const extensionASTNodes = (_typeExtensionsMap$na = typeExtensionsMap[name]) !== null && _typeExtensionsMap$na !== void 0 ? _typeExtensionsMap$na : [];
    switch (astNode.kind) {
      case Kind.OBJECT_TYPE_DEFINITION: {
        var _astNode$description;
        const allNodes = [astNode, ...extensionASTNodes];
        return new GraphQLObjectType({
          name,
          description: (_astNode$description = astNode.description) === null || _astNode$description === void 0 ? void 0 : _astNode$description.value,
          interfaces: /* @__PURE__ */ __name(() => buildInterfaces(allNodes), "interfaces"),
          fields: /* @__PURE__ */ __name(() => buildFieldMap(allNodes), "fields"),
          astNode,
          extensionASTNodes
        });
      }
      case Kind.INTERFACE_TYPE_DEFINITION: {
        var _astNode$description2;
        const allNodes = [astNode, ...extensionASTNodes];
        return new GraphQLInterfaceType({
          name,
          description: (_astNode$description2 = astNode.description) === null || _astNode$description2 === void 0 ? void 0 : _astNode$description2.value,
          interfaces: /* @__PURE__ */ __name(() => buildInterfaces(allNodes), "interfaces"),
          fields: /* @__PURE__ */ __name(() => buildFieldMap(allNodes), "fields"),
          astNode,
          extensionASTNodes
        });
      }
      case Kind.ENUM_TYPE_DEFINITION: {
        var _astNode$description3;
        const allNodes = [astNode, ...extensionASTNodes];
        return new GraphQLEnumType({
          name,
          description: (_astNode$description3 = astNode.description) === null || _astNode$description3 === void 0 ? void 0 : _astNode$description3.value,
          values: buildEnumValueMap(allNodes),
          astNode,
          extensionASTNodes
        });
      }
      case Kind.UNION_TYPE_DEFINITION: {
        var _astNode$description4;
        const allNodes = [astNode, ...extensionASTNodes];
        return new GraphQLUnionType({
          name,
          description: (_astNode$description4 = astNode.description) === null || _astNode$description4 === void 0 ? void 0 : _astNode$description4.value,
          types: /* @__PURE__ */ __name(() => buildUnionTypes(allNodes), "types"),
          astNode,
          extensionASTNodes
        });
      }
      case Kind.SCALAR_TYPE_DEFINITION: {
        var _astNode$description5;
        return new GraphQLScalarType({
          name,
          description: (_astNode$description5 = astNode.description) === null || _astNode$description5 === void 0 ? void 0 : _astNode$description5.value,
          specifiedByURL: getSpecifiedByURL(astNode),
          astNode,
          extensionASTNodes
        });
      }
      case Kind.INPUT_OBJECT_TYPE_DEFINITION: {
        var _astNode$description6;
        const allNodes = [astNode, ...extensionASTNodes];
        return new GraphQLInputObjectType({
          name,
          description: (_astNode$description6 = astNode.description) === null || _astNode$description6 === void 0 ? void 0 : _astNode$description6.value,
          fields: /* @__PURE__ */ __name(() => buildInputFieldMap(allNodes), "fields"),
          astNode,
          extensionASTNodes,
          isOneOf: isOneOf(astNode)
        });
      }
    }
  }
  __name(buildType, "buildType");
}
__name(extendSchemaImpl, "extendSchemaImpl");
var stdTypeMap = keyMap(
  [...specifiedScalarTypes, ...introspectionTypes],
  (type) => type.name
);
function getDeprecationReason(node) {
  const deprecated = getDirectiveValues(GraphQLDeprecatedDirective, node);
  return deprecated === null || deprecated === void 0 ? void 0 : deprecated.reason;
}
__name(getDeprecationReason, "getDeprecationReason");
function getSpecifiedByURL(node) {
  const specifiedBy = getDirectiveValues(GraphQLSpecifiedByDirective, node);
  return specifiedBy === null || specifiedBy === void 0 ? void 0 : specifiedBy.url;
}
__name(getSpecifiedByURL, "getSpecifiedByURL");
function isOneOf(node) {
  return Boolean(getDirectiveValues(GraphQLOneOfDirective, node));
}
__name(isOneOf, "isOneOf");

// node_modules/graphql/utilities/buildASTSchema.mjs
function buildASTSchema(documentAST, options) {
  documentAST != null && documentAST.kind === Kind.DOCUMENT || devAssert(false, "Must provide valid Document AST.");
  if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
    assertValidSDL(documentAST);
  }
  const emptySchemaConfig = {
    description: void 0,
    types: [],
    directives: [],
    extensions: /* @__PURE__ */ Object.create(null),
    extensionASTNodes: [],
    assumeValid: false
  };
  const config = extendSchemaImpl(emptySchemaConfig, documentAST, options);
  if (config.astNode == null) {
    for (const type of config.types) {
      switch (type.name) {
        // Note: While this could make early assertions to get the correctly
        // typed values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        case "Query":
          config.query = type;
          break;
        case "Mutation":
          config.mutation = type;
          break;
        case "Subscription":
          config.subscription = type;
          break;
      }
    }
  }
  const directives = [
    ...config.directives,
    // If specified directives were not explicitly declared, add them.
    ...specifiedDirectives.filter(
      (stdDirective) => config.directives.every(
        (directive) => directive.name !== stdDirective.name
      )
    )
  ];
  return new GraphQLSchema({ ...config, directives });
}
__name(buildASTSchema, "buildASTSchema");
function buildSchema(source, options) {
  const document = parse(source, {
    noLocation: options === null || options === void 0 ? void 0 : options.noLocation,
    allowLegacyFragmentVariables: options === null || options === void 0 ? void 0 : options.allowLegacyFragmentVariables
  });
  return buildASTSchema(document, {
    assumeValidSDL: options === null || options === void 0 ? void 0 : options.assumeValidSDL,
    assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
  });
}
__name(buildSchema, "buildSchema");

// node_modules/@graphql-tools/utils/esm/index.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/helpers.js
init_modules_watch_stub();
var asArray = /* @__PURE__ */ __name((fns) => Array.isArray(fns) ? fns : fns ? [fns] : [], "asArray");
function compareStrings(a, b) {
  if (String(a) < String(b)) {
    return -1;
  }
  if (String(a) > String(b)) {
    return 1;
  }
  return 0;
}
__name(compareStrings, "compareStrings");
function nodeToString(a) {
  let name;
  if ("alias" in a) {
    name = a.alias?.value;
  }
  if (name == null && "name" in a) {
    name = a.name?.value;
  }
  if (name == null) {
    name = a.kind;
  }
  return name;
}
__name(nodeToString, "nodeToString");
function compareNodes(a, b, customFn) {
  const aStr = nodeToString(a);
  const bStr = nodeToString(b);
  if (typeof customFn === "function") {
    return customFn(aStr, bStr);
  }
  return compareStrings(aStr, bStr);
}
__name(compareNodes, "compareNodes");
function isSome(input) {
  return input != null;
}
__name(isSome, "isSome");

// node_modules/@graphql-tools/utils/esm/get-directives.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/getDirectiveExtensions.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/getArgumentValues.js
init_modules_watch_stub();

// node_modules/cross-inspect/esm/index.js
init_modules_watch_stub();
var MAX_RECURSIVE_DEPTH2 = 3;
function inspect2(value) {
  return formatValue2(value, []);
}
__name(inspect2, "inspect");
function formatValue2(value, seenValues) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "function":
      return value.name ? `[function ${value.name}]` : "[function]";
    case "object":
      return formatObjectValue2(value, seenValues);
    default:
      return String(value);
  }
}
__name(formatValue2, "formatValue");
function formatError2(value) {
  if (value.name = "GraphQLError") {
    return value.toString();
  }
  return `${value.name}: ${value.message};
 ${value.stack}`;
}
__name(formatError2, "formatError");
function formatObjectValue2(value, previouslySeenValues) {
  if (value === null) {
    return "null";
  }
  if (value instanceof Error) {
    if (value.name === "AggregateError") {
      return formatError2(value) + "\n" + formatArray2(value.errors, previouslySeenValues);
    }
    return formatError2(value);
  }
  if (previouslySeenValues.includes(value)) {
    return "[Circular]";
  }
  const seenValues = [...previouslySeenValues, value];
  if (isJSONable2(value)) {
    const jsonValue = value.toJSON();
    if (jsonValue !== value) {
      return typeof jsonValue === "string" ? jsonValue : formatValue2(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray2(value, seenValues);
  }
  return formatObject2(value, seenValues);
}
__name(formatObjectValue2, "formatObjectValue");
function isJSONable2(value) {
  return typeof value.toJSON === "function";
}
__name(isJSONable2, "isJSONable");
function formatObject2(object, seenValues) {
  const entries = Object.entries(object);
  if (entries.length === 0) {
    return "{}";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH2) {
    return "[" + getObjectTag2(object) + "]";
  }
  const properties = entries.map(([key, value]) => key + ": " + formatValue2(value, seenValues));
  return "{ " + properties.join(", ") + " }";
}
__name(formatObject2, "formatObject");
function formatArray2(array, seenValues) {
  if (array.length === 0) {
    return "[]";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH2) {
    return "[Array]";
  }
  const len = array.length;
  const items = [];
  for (let i = 0; i < len; ++i) {
    items.push(formatValue2(array[i], seenValues));
  }
  return "[" + items.join(", ") + "]";
}
__name(formatArray2, "formatArray");
function getObjectTag2(object) {
  const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
  if (tag === "Object" && typeof object.constructor === "function") {
    const name = object.constructor.name;
    if (typeof name === "string" && name !== "") {
      return name;
    }
  }
  return tag;
}
__name(getObjectTag2, "getObjectTag");

// node_modules/@graphql-tools/utils/esm/errors.js
init_modules_watch_stub();
var possibleGraphQLErrorProperties = [
  "message",
  "locations",
  "path",
  "nodes",
  "source",
  "positions",
  "originalError",
  "name",
  "stack",
  "extensions"
];
function isGraphQLErrorLike(error) {
  return error != null && typeof error === "object" && Object.keys(error).every((key) => possibleGraphQLErrorProperties.includes(key));
}
__name(isGraphQLErrorLike, "isGraphQLErrorLike");
function createGraphQLError(message, options) {
  if (options?.originalError && !(options.originalError instanceof Error) && isGraphQLErrorLike(options.originalError)) {
    options.originalError = createGraphQLError(options.originalError.message, options.originalError);
  }
  if (versionInfo.major >= 17) {
    return new GraphQLError(message, options);
  }
  return new GraphQLError(message, options?.nodes, options?.source, options?.positions, options?.path, options?.originalError, options?.extensions);
}
__name(createGraphQLError, "createGraphQLError");

// node_modules/@graphql-tools/utils/esm/jsutils.js
init_modules_watch_stub();

// node_modules/@whatwg-node/promise-helpers/esm/index.js
init_modules_watch_stub();
var kFakePromise = Symbol.for("@whatwg-node/promise-helpers/FakePromise");
function isPromise2(value) {
  return value?.then != null;
}
__name(isPromise2, "isPromise");
function isActualPromise(value) {
  const maybePromise = value;
  return maybePromise && maybePromise.then && maybePromise.catch && maybePromise.finally;
}
__name(isActualPromise, "isActualPromise");
function handleMaybePromise(inputFactory, outputSuccessFactory, outputErrorFactory, finallyFactory) {
  let result$ = fakePromise().then(inputFactory).then(outputSuccessFactory, outputErrorFactory);
  if (finallyFactory) {
    result$ = result$.finally(finallyFactory);
  }
  return unfakePromise(result$);
}
__name(handleMaybePromise, "handleMaybePromise");
function fakePromise(value) {
  if (value && isActualPromise(value)) {
    return value;
  }
  if (isPromise2(value)) {
    return {
      then: /* @__PURE__ */ __name((resolve, reject) => fakePromise(value.then(resolve, reject)), "then"),
      catch: /* @__PURE__ */ __name((reject) => fakePromise(value.then((res) => res, reject)), "catch"),
      finally: /* @__PURE__ */ __name((cb) => fakePromise(cb ? promiseLikeFinally(value, cb) : value), "finally"),
      [Symbol.toStringTag]: "Promise"
    };
  }
  return {
    then(resolve) {
      if (resolve) {
        try {
          return fakePromise(resolve(value));
        } catch (err) {
          return fakeRejectPromise(err);
        }
      }
      return this;
    },
    catch() {
      return this;
    },
    finally(cb) {
      if (cb) {
        try {
          return fakePromise(cb()).then(() => value, () => value);
        } catch (err) {
          return fakeRejectPromise(err);
        }
      }
      return this;
    },
    [Symbol.toStringTag]: "Promise",
    __fakePromiseValue: value,
    [kFakePromise]: "resolved"
  };
}
__name(fakePromise, "fakePromise");
function createDeferredPromise() {
  if (Promise.withResolvers) {
    return Promise.withResolvers();
  }
  let resolveFn;
  let rejectFn;
  const promise = new Promise(/* @__PURE__ */ __name(function deferredPromiseExecutor(resolve, reject) {
    resolveFn = resolve;
    rejectFn = reject;
  }, "deferredPromiseExecutor"));
  return {
    promise,
    get resolve() {
      return resolveFn;
    },
    get reject() {
      return rejectFn;
    }
  };
}
__name(createDeferredPromise, "createDeferredPromise");
function iterateAsync(iterable, callback, results) {
  if (iterable?.length === 0) {
    return;
  }
  const iterator = iterable[Symbol.iterator]();
  let index = 0;
  function iterate2() {
    const { done: endOfIterator, value } = iterator.next();
    if (endOfIterator) {
      return;
    }
    let endedEarly = false;
    function endEarly() {
      endedEarly = true;
    }
    __name(endEarly, "endEarly");
    return handleMaybePromise(/* @__PURE__ */ __name(function handleCallback() {
      return callback(value, endEarly, index++);
    }, "handleCallback"), /* @__PURE__ */ __name(function handleCallbackResult(result) {
      if (result) {
        results?.push(result);
      }
      if (endedEarly) {
        return;
      }
      return iterate2();
    }, "handleCallbackResult"));
  }
  __name(iterate2, "iterate");
  return iterate2();
}
__name(iterateAsync, "iterateAsync");
function fakeRejectPromise(error) {
  return {
    then(_resolve, reject) {
      if (reject) {
        try {
          return fakePromise(reject(error));
        } catch (err) {
          return fakeRejectPromise(err);
        }
      }
      return this;
    },
    catch(reject) {
      if (reject) {
        try {
          return fakePromise(reject(error));
        } catch (err) {
          return fakeRejectPromise(err);
        }
      }
      return this;
    },
    finally(cb) {
      if (cb) {
        try {
          cb();
        } catch (err) {
          return fakeRejectPromise(err);
        }
      }
      return this;
    },
    __fakeRejectError: error,
    [Symbol.toStringTag]: "Promise",
    [kFakePromise]: "rejected"
  };
}
__name(fakeRejectPromise, "fakeRejectPromise");
function mapAsyncIterator2(iterator, onNext, onError, onEnd) {
  if (Symbol.asyncIterator in iterator) {
    iterator = iterator[Symbol.asyncIterator]();
  }
  let $return;
  let abruptClose;
  let onEndWithValue;
  if (onEnd) {
    let onEndWithValueResult;
    onEndWithValue = /* @__PURE__ */ __name((value) => {
      onEndWithValueResult ||= handleMaybePromise(onEnd, () => value, () => value);
      return onEndWithValueResult;
    }, "onEndWithValue");
  }
  if (typeof iterator.return === "function") {
    $return = iterator.return;
    abruptClose = /* @__PURE__ */ __name((error) => {
      const rethrow = /* @__PURE__ */ __name(() => {
        throw error;
      }, "rethrow");
      return $return.call(iterator).then(rethrow, rethrow);
    }, "abruptClose");
  }
  function mapResult(result) {
    if (result.done) {
      return onEndWithValue ? onEndWithValue(result) : result;
    }
    return handleMaybePromise(() => result.value, (value) => handleMaybePromise(() => onNext(value), iteratorResult, abruptClose));
  }
  __name(mapResult, "mapResult");
  let mapReject;
  if (onError) {
    let onErrorResult;
    const reject = onError;
    mapReject = /* @__PURE__ */ __name((error) => {
      onErrorResult ||= handleMaybePromise(() => error, (error2) => handleMaybePromise(() => reject(error2), iteratorResult, abruptClose));
      return onErrorResult;
    }, "mapReject");
  }
  return {
    next() {
      return iterator.next().then(mapResult, mapReject);
    },
    return() {
      const res$ = $return ? $return.call(iterator).then(mapResult, mapReject) : fakePromise({ value: void 0, done: true });
      return onEndWithValue ? res$.then(onEndWithValue) : res$;
    },
    throw(error) {
      if (typeof iterator.throw === "function") {
        return iterator.throw(error).then(mapResult, mapReject);
      }
      if (abruptClose) {
        return abruptClose(error);
      }
      return fakeRejectPromise(error);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
__name(mapAsyncIterator2, "mapAsyncIterator");
function iteratorResult(value) {
  return { value, done: false };
}
__name(iteratorResult, "iteratorResult");
function isFakePromise(value) {
  return value?.[kFakePromise] === "resolved";
}
__name(isFakePromise, "isFakePromise");
function isFakeRejectPromise(value) {
  return value?.[kFakePromise] === "rejected";
}
__name(isFakeRejectPromise, "isFakeRejectPromise");
function promiseLikeFinally(value, onFinally) {
  if ("finally" in value) {
    return value.finally(onFinally);
  }
  return value.then((res) => {
    const finallyRes = onFinally();
    return isPromise2(finallyRes) ? finallyRes.then(() => res) : res;
  }, (err) => {
    const finallyRes = onFinally();
    if (isPromise2(finallyRes)) {
      return finallyRes.then(() => {
        throw err;
      });
    } else {
      throw err;
    }
  });
}
__name(promiseLikeFinally, "promiseLikeFinally");
function unfakePromise(promise) {
  if (isFakePromise(promise)) {
    return promise.__fakePromiseValue;
  }
  if (isFakeRejectPromise(promise)) {
    throw promise.__fakeRejectError;
  }
  return promise;
}
__name(unfakePromise, "unfakePromise");

// node_modules/@graphql-tools/utils/esm/jsutils.js
function isIterableObject2(value) {
  return value != null && typeof value === "object" && Symbol.iterator in value;
}
__name(isIterableObject2, "isIterableObject");
function isObjectLike2(value) {
  return typeof value === "object" && value !== null;
}
__name(isObjectLike2, "isObjectLike");
function promiseReduce2(values, callbackFn, initialValue) {
  let accumulator = initialValue;
  for (const value of values) {
    accumulator = handleMaybePromise(() => accumulator, (resolved) => callbackFn(resolved, value));
  }
  return accumulator;
}
__name(promiseReduce2, "promiseReduce");
function hasOwnProperty2(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
__name(hasOwnProperty2, "hasOwnProperty");

// node_modules/@graphql-tools/utils/esm/getArgumentValues.js
function getArgumentValues2(def, node, variableValues = {}) {
  const coercedValues = {};
  const argumentNodes = node.arguments ?? [];
  const argNodeMap = argumentNodes.reduce((prev, arg) => ({
    ...prev,
    [arg.name.value]: arg
  }), {});
  for (const { name, type: argType, defaultValue } of def.args) {
    const argumentNode = argNodeMap[name];
    if (!argumentNode) {
      if (defaultValue !== void 0) {
        coercedValues[name] = defaultValue;
      } else if (isNonNullType(argType)) {
        throw createGraphQLError(`Argument "${name}" of required type "${inspect2(argType)}" was not provided.`, {
          nodes: [node]
        });
      }
      continue;
    }
    const valueNode = argumentNode.value;
    let isNull2 = valueNode.kind === Kind.NULL;
    if (valueNode.kind === Kind.VARIABLE) {
      const variableName = valueNode.name.value;
      if (variableValues == null || !hasOwnProperty2(variableValues, variableName)) {
        if (defaultValue !== void 0) {
          coercedValues[name] = defaultValue;
        } else if (isNonNullType(argType)) {
          throw createGraphQLError(`Argument "${name}" of required type "${inspect2(argType)}" was provided the variable "$${variableName}" which was not provided a runtime value.`, {
            nodes: [valueNode]
          });
        }
        continue;
      }
      isNull2 = variableValues[variableName] == null;
    }
    if (isNull2 && isNonNullType(argType)) {
      throw createGraphQLError(`Argument "${name}" of non-null type "${inspect2(argType)}" must not be null.`, {
        nodes: [valueNode]
      });
    }
    const coercedValue = valueFromAST(valueNode, argType, variableValues);
    if (coercedValue === void 0) {
      throw createGraphQLError(`Argument "${name}" has invalid value ${print(valueNode)}.`, {
        nodes: [valueNode]
      });
    }
    coercedValues[name] = coercedValue;
  }
  return coercedValues;
}
__name(getArgumentValues2, "getArgumentValues");

// node_modules/@graphql-tools/utils/esm/memoize.js
init_modules_watch_stub();
function memoize1(fn) {
  const memoize1cache = /* @__PURE__ */ new WeakMap();
  return /* @__PURE__ */ __name(function memoized(a1) {
    const cachedValue = memoize1cache.get(a1);
    if (cachedValue === void 0) {
      const newValue = fn(a1);
      memoize1cache.set(a1, newValue);
      return newValue;
    }
    return cachedValue;
  }, "memoized");
}
__name(memoize1, "memoize1");
function memoize32(fn) {
  const memoize3Cache = /* @__PURE__ */ new WeakMap();
  return /* @__PURE__ */ __name(function memoized(a1, a2, a3) {
    let cache2 = memoize3Cache.get(a1);
    if (!cache2) {
      cache2 = /* @__PURE__ */ new WeakMap();
      memoize3Cache.set(a1, cache2);
      const cache32 = /* @__PURE__ */ new WeakMap();
      cache2.set(a2, cache32);
      const newValue = fn(a1, a2, a3);
      cache32.set(a3, newValue);
      return newValue;
    }
    let cache3 = cache2.get(a2);
    if (!cache3) {
      cache3 = /* @__PURE__ */ new WeakMap();
      cache2.set(a2, cache3);
      const newValue = fn(a1, a2, a3);
      cache3.set(a3, newValue);
      return newValue;
    }
    const cachedValue = cache3.get(a3);
    if (cachedValue === void 0) {
      const newValue = fn(a1, a2, a3);
      cache3.set(a3, newValue);
      return newValue;
    }
    return cachedValue;
  }, "memoized");
}
__name(memoize32, "memoize3");
function memoize5(fn) {
  const memoize5Cache = /* @__PURE__ */ new WeakMap();
  return /* @__PURE__ */ __name(function memoized(a1, a2, a3, a4, a5) {
    let cache2 = memoize5Cache.get(a1);
    if (!cache2) {
      cache2 = /* @__PURE__ */ new WeakMap();
      memoize5Cache.set(a1, cache2);
      const cache32 = /* @__PURE__ */ new WeakMap();
      cache2.set(a2, cache32);
      const cache42 = /* @__PURE__ */ new WeakMap();
      cache32.set(a3, cache42);
      const cache52 = /* @__PURE__ */ new WeakMap();
      cache42.set(a4, cache52);
      const newValue = fn(a1, a2, a3, a4, a5);
      cache52.set(a5, newValue);
      return newValue;
    }
    let cache3 = cache2.get(a2);
    if (!cache3) {
      cache3 = /* @__PURE__ */ new WeakMap();
      cache2.set(a2, cache3);
      const cache42 = /* @__PURE__ */ new WeakMap();
      cache3.set(a3, cache42);
      const cache52 = /* @__PURE__ */ new WeakMap();
      cache42.set(a4, cache52);
      const newValue = fn(a1, a2, a3, a4, a5);
      cache52.set(a5, newValue);
      return newValue;
    }
    let cache4 = cache3.get(a3);
    if (!cache4) {
      cache4 = /* @__PURE__ */ new WeakMap();
      cache3.set(a3, cache4);
      const cache52 = /* @__PURE__ */ new WeakMap();
      cache4.set(a4, cache52);
      const newValue = fn(a1, a2, a3, a4, a5);
      cache52.set(a5, newValue);
      return newValue;
    }
    let cache5 = cache4.get(a4);
    if (!cache5) {
      cache5 = /* @__PURE__ */ new WeakMap();
      cache4.set(a4, cache5);
      const newValue = fn(a1, a2, a3, a4, a5);
      cache5.set(a5, newValue);
      return newValue;
    }
    const cachedValue = cache5.get(a5);
    if (cachedValue === void 0) {
      const newValue = fn(a1, a2, a3, a4, a5);
      cache5.set(a5, newValue);
      return newValue;
    }
    return cachedValue;
  }, "memoized");
}
__name(memoize5, "memoize5");

// node_modules/@graphql-tools/utils/esm/getDirectiveExtensions.js
function getDirectiveExtensions(directableObj, schema2, pathToDirectivesInExtensions = ["directives"]) {
  const directiveExtensions = {};
  if (directableObj.extensions) {
    let directivesInExtensions = directableObj.extensions;
    for (const pathSegment of pathToDirectivesInExtensions) {
      directivesInExtensions = directivesInExtensions?.[pathSegment];
    }
    if (directivesInExtensions != null) {
      for (const directiveNameProp in directivesInExtensions) {
        const directiveObjs = directivesInExtensions[directiveNameProp];
        const directiveName = directiveNameProp;
        if (Array.isArray(directiveObjs)) {
          for (const directiveObj of directiveObjs) {
            let existingDirectiveExtensions = directiveExtensions[directiveName];
            if (!existingDirectiveExtensions) {
              existingDirectiveExtensions = [];
              directiveExtensions[directiveName] = existingDirectiveExtensions;
            }
            existingDirectiveExtensions.push(directiveObj);
          }
        } else {
          let existingDirectiveExtensions = directiveExtensions[directiveName];
          if (!existingDirectiveExtensions) {
            existingDirectiveExtensions = [];
            directiveExtensions[directiveName] = existingDirectiveExtensions;
          }
          existingDirectiveExtensions.push(directiveObjs);
        }
      }
    }
  }
  const memoizedStringify = memoize1((obj) => JSON.stringify(obj));
  const astNodes = [];
  if (directableObj.astNode) {
    astNodes.push(directableObj.astNode);
  }
  if (directableObj.extensionASTNodes) {
    astNodes.push(...directableObj.extensionASTNodes);
  }
  for (const astNode of astNodes) {
    if (astNode.directives?.length) {
      for (const directive of astNode.directives) {
        const directiveName = directive.name.value;
        let existingDirectiveExtensions = directiveExtensions[directiveName];
        if (!existingDirectiveExtensions) {
          existingDirectiveExtensions = [];
          directiveExtensions[directiveName] = existingDirectiveExtensions;
        }
        const directiveInSchema = schema2?.getDirective(directiveName);
        let value = {};
        if (directiveInSchema) {
          value = getArgumentValues2(directiveInSchema, directive);
        }
        if (directive.arguments) {
          for (const argNode of directive.arguments) {
            const argName = argNode.name.value;
            if (value[argName] == null) {
              const argInDirective = directiveInSchema?.args.find((arg) => arg.name === argName);
              if (argInDirective) {
                value[argName] = valueFromAST(argNode.value, argInDirective.type);
              }
            }
            if (value[argName] == null) {
              value[argName] = valueFromASTUntyped(argNode.value);
            }
          }
        }
        if (astNodes.length > 0 && existingDirectiveExtensions.length > 0) {
          const valStr = memoizedStringify(value);
          if (existingDirectiveExtensions.some((val) => memoizedStringify(val) === valStr)) {
            continue;
          }
        }
        existingDirectiveExtensions.push(value);
      }
    }
  }
  return directiveExtensions;
}
__name(getDirectiveExtensions, "getDirectiveExtensions");

// node_modules/@graphql-tools/utils/esm/get-directives.js
function getDirectivesInExtensions(node, pathToDirectivesInExtensions = ["directives"]) {
  const directiveExtensions = getDirectiveExtensions(node, void 0, pathToDirectivesInExtensions);
  return Object.entries(directiveExtensions).map(([directiveName, directiveArgsArr]) => directiveArgsArr?.map((directiveArgs) => ({
    name: directiveName,
    args: directiveArgs
  }))).flat(Infinity).filter(Boolean);
}
__name(getDirectivesInExtensions, "getDirectivesInExtensions");

// node_modules/@graphql-tools/utils/esm/print-schema-with-directives.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/astFromType.js
init_modules_watch_stub();
function astFromType(type) {
  if (isNonNullType(type)) {
    const innerType = astFromType(type.ofType);
    if (innerType.kind === Kind.NON_NULL_TYPE) {
      throw new Error(`Invalid type node ${inspect2(type)}. Inner type of non-null type cannot be a non-null type.`);
    }
    return {
      kind: Kind.NON_NULL_TYPE,
      type: innerType
    };
  } else if (isListType(type)) {
    return {
      kind: Kind.LIST_TYPE,
      type: astFromType(type.ofType)
    };
  }
  return {
    kind: Kind.NAMED_TYPE,
    name: {
      kind: Kind.NAME,
      value: type.name
    }
  };
}
__name(astFromType, "astFromType");

// node_modules/@graphql-tools/utils/esm/astFromValue.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/astFromValueUntyped.js
init_modules_watch_stub();
function astFromValueUntyped(value) {
  if (value === null) {
    return { kind: Kind.NULL };
  }
  if (value === void 0) {
    return null;
  }
  if (Array.isArray(value)) {
    const valuesNodes = [];
    for (const item of value) {
      const itemNode = astFromValueUntyped(item);
      if (itemNode != null) {
        valuesNodes.push(itemNode);
      }
    }
    return { kind: Kind.LIST, values: valuesNodes };
  }
  if (typeof value === "object") {
    if (value?.toJSON) {
      return astFromValueUntyped(value.toJSON());
    }
    const fieldNodes = [];
    for (const fieldName in value) {
      const fieldValue = value[fieldName];
      const ast = astFromValueUntyped(fieldValue);
      if (ast) {
        fieldNodes.push({
          kind: Kind.OBJECT_FIELD,
          name: { kind: Kind.NAME, value: fieldName },
          value: ast
        });
      }
    }
    return { kind: Kind.OBJECT, fields: fieldNodes };
  }
  if (typeof value === "boolean") {
    return { kind: Kind.BOOLEAN, value };
  }
  if (typeof value === "bigint") {
    return { kind: Kind.INT, value: String(value) };
  }
  if (typeof value === "number" && isFinite(value)) {
    const stringNum = String(value);
    return integerStringRegExp2.test(stringNum) ? { kind: Kind.INT, value: stringNum } : { kind: Kind.FLOAT, value: stringNum };
  }
  if (typeof value === "string") {
    return { kind: Kind.STRING, value };
  }
  throw new TypeError(`Cannot convert value to AST: ${value}.`);
}
__name(astFromValueUntyped, "astFromValueUntyped");
var integerStringRegExp2 = /^-?(?:0|[1-9][0-9]*)$/;

// node_modules/@graphql-tools/utils/esm/astFromValue.js
function astFromValue2(value, type) {
  if (isNonNullType(type)) {
    const astValue = astFromValue2(value, type.ofType);
    if (astValue?.kind === Kind.NULL) {
      return null;
    }
    return astValue;
  }
  if (value === null) {
    return { kind: Kind.NULL };
  }
  if (value === void 0) {
    return null;
  }
  if (isListType(type)) {
    const itemType = type.ofType;
    if (isIterableObject2(value)) {
      const valuesNodes = [];
      for (const item of value) {
        const itemNode = astFromValue2(item, itemType);
        if (itemNode != null) {
          valuesNodes.push(itemNode);
        }
      }
      return { kind: Kind.LIST, values: valuesNodes };
    }
    return astFromValue2(value, itemType);
  }
  if (isInputObjectType(type)) {
    if (!isObjectLike2(value)) {
      return null;
    }
    const fieldNodes = [];
    for (const field of Object.values(type.getFields())) {
      const fieldValue = astFromValue2(value[field.name], field.type);
      if (fieldValue) {
        fieldNodes.push({
          kind: Kind.OBJECT_FIELD,
          name: { kind: Kind.NAME, value: field.name },
          value: fieldValue
        });
      }
    }
    return { kind: Kind.OBJECT, fields: fieldNodes };
  }
  if (isLeafType(type)) {
    const serialized = type.serialize(value);
    if (serialized == null) {
      return null;
    }
    if (isEnumType(type)) {
      return { kind: Kind.ENUM, value: serialized };
    }
    if (type.name === "ID" && typeof serialized === "string" && integerStringRegExp3.test(serialized)) {
      return { kind: Kind.INT, value: serialized };
    }
    return astFromValueUntyped(serialized);
  }
  console.assert(false, "Unexpected input type: " + inspect2(type));
}
__name(astFromValue2, "astFromValue");
var integerStringRegExp3 = /^-?(?:0|[1-9][0-9]*)$/;

// node_modules/@graphql-tools/utils/esm/descriptionFromObject.js
init_modules_watch_stub();
function getDescriptionNode(obj) {
  if (obj.astNode?.description) {
    return {
      ...obj.astNode.description,
      block: true
    };
  }
  if (obj.description) {
    return {
      kind: Kind.STRING,
      value: obj.description,
      block: true
    };
  }
}
__name(getDescriptionNode, "getDescriptionNode");

// node_modules/@graphql-tools/utils/esm/rootTypes.js
init_modules_watch_stub();
function getDefinedRootType(schema2, operation, nodes) {
  const rootTypeMap = getRootTypeMap(schema2);
  const rootType = rootTypeMap.get(operation);
  if (rootType == null) {
    throw createGraphQLError(`Schema is not configured to execute ${operation} operation.`, {
      nodes
    });
  }
  return rootType;
}
__name(getDefinedRootType, "getDefinedRootType");
var getRootTypeNames = memoize1(/* @__PURE__ */ __name(function getRootTypeNames2(schema2) {
  const rootTypes = getRootTypes(schema2);
  return new Set([...rootTypes].map((type) => type.name));
}, "getRootTypeNames"));
var getRootTypes = memoize1(/* @__PURE__ */ __name(function getRootTypes2(schema2) {
  const rootTypeMap = getRootTypeMap(schema2);
  return new Set(rootTypeMap.values());
}, "getRootTypes"));
var getRootTypeMap = memoize1(/* @__PURE__ */ __name(function getRootTypeMap2(schema2) {
  const rootTypeMap = /* @__PURE__ */ new Map();
  const queryType = schema2.getQueryType();
  if (queryType) {
    rootTypeMap.set("query", queryType);
  }
  const mutationType = schema2.getMutationType();
  if (mutationType) {
    rootTypeMap.set("mutation", mutationType);
  }
  const subscriptionType = schema2.getSubscriptionType();
  if (subscriptionType) {
    rootTypeMap.set("subscription", subscriptionType);
  }
  return rootTypeMap;
}, "getRootTypeMap"));

// node_modules/@graphql-tools/utils/esm/print-schema-with-directives.js
function getDocumentNodeFromSchema(schema2, options = {}) {
  const pathToDirectivesInExtensions = options.pathToDirectivesInExtensions;
  const typesMap = schema2.getTypeMap();
  const schemaNode = astFromSchema(schema2, pathToDirectivesInExtensions);
  const definitions = schemaNode != null ? [schemaNode] : [];
  const directives = schema2.getDirectives();
  for (const directive of directives) {
    if (isSpecifiedDirective(directive)) {
      continue;
    }
    definitions.push(astFromDirective(directive, schema2, pathToDirectivesInExtensions));
  }
  for (const typeName in typesMap) {
    const type = typesMap[typeName];
    const isPredefinedScalar = isSpecifiedScalarType(type);
    const isIntrospection = isIntrospectionType(type);
    if (isPredefinedScalar || isIntrospection) {
      continue;
    }
    if (isObjectType(type)) {
      definitions.push(astFromObjectType(type, schema2, pathToDirectivesInExtensions));
    } else if (isInterfaceType(type)) {
      definitions.push(astFromInterfaceType(type, schema2, pathToDirectivesInExtensions));
    } else if (isUnionType(type)) {
      definitions.push(astFromUnionType(type, schema2, pathToDirectivesInExtensions));
    } else if (isInputObjectType(type)) {
      definitions.push(astFromInputObjectType(type, schema2, pathToDirectivesInExtensions));
    } else if (isEnumType(type)) {
      definitions.push(astFromEnumType(type, schema2, pathToDirectivesInExtensions));
    } else if (isScalarType(type)) {
      definitions.push(astFromScalarType(type, schema2, pathToDirectivesInExtensions));
    } else {
      throw new Error(`Unknown type ${type}.`);
    }
  }
  return {
    kind: Kind.DOCUMENT,
    definitions
  };
}
__name(getDocumentNodeFromSchema, "getDocumentNodeFromSchema");
function astFromSchema(schema2, pathToDirectivesInExtensions) {
  const operationTypeMap = /* @__PURE__ */ new Map([
    ["query", void 0],
    ["mutation", void 0],
    ["subscription", void 0]
  ]);
  const nodes = [];
  if (schema2.astNode != null) {
    nodes.push(schema2.astNode);
  }
  if (schema2.extensionASTNodes != null) {
    for (const extensionASTNode of schema2.extensionASTNodes) {
      nodes.push(extensionASTNode);
    }
  }
  for (const node of nodes) {
    if (node.operationTypes) {
      for (const operationTypeDefinitionNode of node.operationTypes) {
        operationTypeMap.set(operationTypeDefinitionNode.operation, operationTypeDefinitionNode);
      }
    }
  }
  const rootTypeMap = getRootTypeMap(schema2);
  for (const [operationTypeNode, operationTypeDefinitionNode] of operationTypeMap) {
    const rootType = rootTypeMap.get(operationTypeNode);
    if (rootType != null) {
      const rootTypeAST = astFromType(rootType);
      if (operationTypeDefinitionNode != null) {
        operationTypeDefinitionNode.type = rootTypeAST;
      } else {
        operationTypeMap.set(operationTypeNode, {
          kind: Kind.OPERATION_TYPE_DEFINITION,
          operation: operationTypeNode,
          type: rootTypeAST
        });
      }
    }
  }
  const operationTypes = [...operationTypeMap.values()].filter(isSome);
  const directives = getDirectiveNodes(schema2, schema2, pathToDirectivesInExtensions);
  if (!operationTypes.length && !directives.length) {
    return null;
  }
  const schemaNode = {
    kind: operationTypes != null ? Kind.SCHEMA_DEFINITION : Kind.SCHEMA_EXTENSION,
    operationTypes,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives
  };
  const descriptionNode = getDescriptionNode(schema2);
  if (descriptionNode) {
    schemaNode.description = descriptionNode;
  }
  return schemaNode;
}
__name(astFromSchema, "astFromSchema");
function astFromDirective(directive, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.DIRECTIVE_DEFINITION,
    description: getDescriptionNode(directive),
    name: {
      kind: Kind.NAME,
      value: directive.name
    },
    arguments: directive.args?.map((arg) => astFromArg(arg, schema2, pathToDirectivesInExtensions)),
    repeatable: directive.isRepeatable,
    locations: directive.locations?.map((location) => ({
      kind: Kind.NAME,
      value: location
    })) || []
  };
}
__name(astFromDirective, "astFromDirective");
function getDirectiveNodes(entity, schema2, pathToDirectivesInExtensions) {
  let directiveNodesBesidesNativeDirectives = [];
  const directivesInExtensions = getDirectivesInExtensions(entity, pathToDirectivesInExtensions);
  let directives;
  if (directivesInExtensions != null) {
    directives = makeDirectiveNodes(schema2, directivesInExtensions);
  }
  let deprecatedDirectiveNode = null;
  let specifiedByDirectiveNode = null;
  let oneOfDirectiveNode = null;
  if (directives != null) {
    directiveNodesBesidesNativeDirectives = directives.filter((directive) => specifiedDirectives.every((specifiedDirective) => specifiedDirective.name !== directive.name.value));
    deprecatedDirectiveNode = directives.find((directive) => directive.name.value === "deprecated");
    specifiedByDirectiveNode = directives.find((directive) => directive.name.value === "specifiedBy");
    oneOfDirectiveNode = directives.find((directive) => directive.name.value === "oneOf");
  }
  if (entity.deprecationReason != null && deprecatedDirectiveNode == null) {
    deprecatedDirectiveNode = makeDeprecatedDirective(entity.deprecationReason);
  }
  if (entity.specifiedByUrl != null || entity.specifiedByURL != null && specifiedByDirectiveNode == null) {
    const specifiedByValue = entity.specifiedByUrl || entity.specifiedByURL;
    const specifiedByArgs = {
      url: specifiedByValue
    };
    specifiedByDirectiveNode = makeDirectiveNode("specifiedBy", specifiedByArgs);
  }
  if (entity.isOneOf && oneOfDirectiveNode == null) {
    oneOfDirectiveNode = makeDirectiveNode("oneOf");
  }
  if (deprecatedDirectiveNode != null) {
    directiveNodesBesidesNativeDirectives.push(deprecatedDirectiveNode);
  }
  if (specifiedByDirectiveNode != null) {
    directiveNodesBesidesNativeDirectives.push(specifiedByDirectiveNode);
  }
  if (oneOfDirectiveNode != null) {
    directiveNodesBesidesNativeDirectives.push(oneOfDirectiveNode);
  }
  return directiveNodesBesidesNativeDirectives;
}
__name(getDirectiveNodes, "getDirectiveNodes");
function astFromArg(arg, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.INPUT_VALUE_DEFINITION,
    description: getDescriptionNode(arg),
    name: {
      kind: Kind.NAME,
      value: arg.name
    },
    type: astFromType(arg.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    defaultValue: arg.defaultValue !== void 0 ? astFromValue2(arg.defaultValue, arg.type) ?? void 0 : void 0,
    directives: getDirectiveNodes(arg, schema2, pathToDirectivesInExtensions)
  };
}
__name(astFromArg, "astFromArg");
function astFromObjectType(type, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.OBJECT_TYPE_DEFINITION,
    description: getDescriptionNode(type),
    name: {
      kind: Kind.NAME,
      value: type.name
    },
    fields: Object.values(type.getFields()).map((field) => astFromField(field, schema2, pathToDirectivesInExtensions)),
    interfaces: Object.values(type.getInterfaces()).map((iFace) => astFromType(iFace)),
    directives: getDirectiveNodes(type, schema2, pathToDirectivesInExtensions)
  };
}
__name(astFromObjectType, "astFromObjectType");
function astFromInterfaceType(type, schema2, pathToDirectivesInExtensions) {
  const node = {
    kind: Kind.INTERFACE_TYPE_DEFINITION,
    description: getDescriptionNode(type),
    name: {
      kind: Kind.NAME,
      value: type.name
    },
    fields: Object.values(type.getFields()).map((field) => astFromField(field, schema2, pathToDirectivesInExtensions)),
    directives: getDirectiveNodes(type, schema2, pathToDirectivesInExtensions)
  };
  if ("getInterfaces" in type) {
    node.interfaces = Object.values(type.getInterfaces()).map((iFace) => astFromType(iFace));
  }
  return node;
}
__name(astFromInterfaceType, "astFromInterfaceType");
function astFromUnionType(type, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.UNION_TYPE_DEFINITION,
    description: getDescriptionNode(type),
    name: {
      kind: Kind.NAME,
      value: type.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: getDirectiveNodes(type, schema2, pathToDirectivesInExtensions),
    types: type.getTypes().map((type2) => astFromType(type2))
  };
}
__name(astFromUnionType, "astFromUnionType");
function astFromInputObjectType(type, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
    description: getDescriptionNode(type),
    name: {
      kind: Kind.NAME,
      value: type.name
    },
    fields: Object.values(type.getFields()).map((field) => astFromInputField(field, schema2, pathToDirectivesInExtensions)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: getDirectiveNodes(type, schema2, pathToDirectivesInExtensions)
  };
}
__name(astFromInputObjectType, "astFromInputObjectType");
function astFromEnumType(type, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.ENUM_TYPE_DEFINITION,
    description: getDescriptionNode(type),
    name: {
      kind: Kind.NAME,
      value: type.name
    },
    values: Object.values(type.getValues()).map((value) => astFromEnumValue(value, schema2, pathToDirectivesInExtensions)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: getDirectiveNodes(type, schema2, pathToDirectivesInExtensions)
  };
}
__name(astFromEnumType, "astFromEnumType");
function astFromScalarType(type, schema2, pathToDirectivesInExtensions) {
  const directivesInExtensions = getDirectivesInExtensions(type, pathToDirectivesInExtensions);
  const directives = makeDirectiveNodes(schema2, directivesInExtensions);
  const specifiedByValue = type["specifiedByUrl"] || type["specifiedByURL"];
  if (specifiedByValue && !directives.some((directiveNode) => directiveNode.name.value === "specifiedBy")) {
    const specifiedByArgs = {
      url: specifiedByValue
    };
    directives.push(makeDirectiveNode("specifiedBy", specifiedByArgs));
  }
  return {
    kind: Kind.SCALAR_TYPE_DEFINITION,
    description: getDescriptionNode(type),
    name: {
      kind: Kind.NAME,
      value: type.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives
  };
}
__name(astFromScalarType, "astFromScalarType");
function astFromField(field, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.FIELD_DEFINITION,
    description: getDescriptionNode(field),
    name: {
      kind: Kind.NAME,
      value: field.name
    },
    arguments: field.args.map((arg) => astFromArg(arg, schema2, pathToDirectivesInExtensions)),
    type: astFromType(field.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: getDirectiveNodes(field, schema2, pathToDirectivesInExtensions)
  };
}
__name(astFromField, "astFromField");
function astFromInputField(field, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.INPUT_VALUE_DEFINITION,
    description: getDescriptionNode(field),
    name: {
      kind: Kind.NAME,
      value: field.name
    },
    type: astFromType(field.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: getDirectiveNodes(field, schema2, pathToDirectivesInExtensions),
    defaultValue: astFromValue2(field.defaultValue, field.type) ?? void 0
  };
}
__name(astFromInputField, "astFromInputField");
function astFromEnumValue(value, schema2, pathToDirectivesInExtensions) {
  return {
    kind: Kind.ENUM_VALUE_DEFINITION,
    description: getDescriptionNode(value),
    name: {
      kind: Kind.NAME,
      value: value.name
    },
    directives: getDirectiveNodes(value, schema2, pathToDirectivesInExtensions)
  };
}
__name(astFromEnumValue, "astFromEnumValue");
function makeDeprecatedDirective(deprecationReason) {
  return makeDirectiveNode("deprecated", { reason: deprecationReason }, GraphQLDeprecatedDirective);
}
__name(makeDeprecatedDirective, "makeDeprecatedDirective");
function makeDirectiveNode(name, args, directive) {
  const directiveArguments = [];
  for (const argName in args) {
    const argValue = args[argName];
    let value;
    if (directive != null) {
      const arg = directive.args.find((arg2) => arg2.name === argName);
      if (arg) {
        value = astFromValue2(argValue, arg.type);
      }
    }
    if (value == null) {
      value = astFromValueUntyped(argValue);
    }
    if (value != null) {
      directiveArguments.push({
        kind: Kind.ARGUMENT,
        name: {
          kind: Kind.NAME,
          value: argName
        },
        value
      });
    }
  }
  return {
    kind: Kind.DIRECTIVE,
    name: {
      kind: Kind.NAME,
      value: name
    },
    arguments: directiveArguments
  };
}
__name(makeDirectiveNode, "makeDirectiveNode");
function makeDirectiveNodes(schema2, directiveValues) {
  const directiveNodes = [];
  for (const { name, args } of directiveValues) {
    const directive = schema2?.getDirective(name);
    directiveNodes.push(makeDirectiveNode(name, args, directive));
  }
  return directiveNodes;
}
__name(makeDirectiveNodes, "makeDirectiveNodes");

// node_modules/@graphql-tools/utils/esm/comments.js
init_modules_watch_stub();
var MAX_LINE_LENGTH2 = 80;
var commentsRegistry = {};
function resetComments() {
  commentsRegistry = {};
}
__name(resetComments, "resetComments");
function collectComment(node) {
  const entityName = node.name?.value;
  if (entityName == null) {
    return;
  }
  pushComment(node, entityName);
  switch (node.kind) {
    case "EnumTypeDefinition":
      if (node.values) {
        for (const value of node.values) {
          pushComment(value, entityName, value.name.value);
        }
      }
      break;
    case "ObjectTypeDefinition":
    case "InputObjectTypeDefinition":
    case "InterfaceTypeDefinition":
      if (node.fields) {
        for (const field of node.fields) {
          pushComment(field, entityName, field.name.value);
          if (isFieldDefinitionNode(field) && field.arguments) {
            for (const arg of field.arguments) {
              pushComment(arg, entityName, field.name.value, arg.name.value);
            }
          }
        }
      }
      break;
  }
}
__name(collectComment, "collectComment");
function pushComment(node, entity, field, argument) {
  const comment = getComment(node);
  if (typeof comment !== "string" || comment.length === 0) {
    return;
  }
  const keys = [entity];
  if (field) {
    keys.push(field);
    if (argument) {
      keys.push(argument);
    }
  }
  const path = keys.join(".");
  if (!commentsRegistry[path]) {
    commentsRegistry[path] = [];
  }
  commentsRegistry[path].push(comment);
}
__name(pushComment, "pushComment");
function printComment(comment) {
  return "\n# " + comment.replace(/\n/g, "\n# ");
}
__name(printComment, "printComment");
function join2(maybeArray, separator) {
  return maybeArray ? maybeArray.filter((x) => x).join(separator || "") : "";
}
__name(join2, "join");
function hasMultilineItems2(maybeArray) {
  return maybeArray?.some((str) => str.includes("\n")) ?? false;
}
__name(hasMultilineItems2, "hasMultilineItems");
function addDescription(cb) {
  return (node, _key, _parent, path, ancestors) => {
    const keys = [];
    const parent = path.reduce((prev, key2) => {
      if (["fields", "arguments", "values"].includes(key2) && prev.name) {
        keys.push(prev.name.value);
      }
      return prev[key2];
    }, ancestors[0]);
    const key = [...keys, parent?.name?.value].filter(Boolean).join(".");
    const items = [];
    if (node.kind.includes("Definition") && commentsRegistry[key]) {
      items.push(...commentsRegistry[key]);
    }
    return join2([...items.map(printComment), node.description, cb(node, _key, _parent, path, ancestors)], "\n");
  };
}
__name(addDescription, "addDescription");
function indent2(maybeString) {
  return maybeString && `  ${maybeString.replace(/\n/g, "\n  ")}`;
}
__name(indent2, "indent");
function block2(array) {
  return array && array.length !== 0 ? `{
${indent2(join2(array, "\n"))}
}` : "";
}
__name(block2, "block");
function wrap2(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || "") : "";
}
__name(wrap2, "wrap");
function printBlockString2(value, isDescription = false) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"""/g, '\\"""');
  return (value[0] === " " || value[0] === "	") && value.indexOf("\n") === -1 ? `"""${escaped.replace(/"$/, '"\n')}"""` : `"""
${isDescription ? escaped : indent2(escaped)}
"""`;
}
__name(printBlockString2, "printBlockString");
var printDocASTReducer2 = {
  Name: { leave: /* @__PURE__ */ __name((node) => node.value, "leave") },
  Variable: { leave: /* @__PURE__ */ __name((node) => "$" + node.name, "leave") },
  // Document
  Document: {
    leave: /* @__PURE__ */ __name((node) => join2(node.definitions, "\n\n"), "leave")
  },
  OperationDefinition: {
    leave: /* @__PURE__ */ __name((node) => {
      const varDefs = wrap2("(", join2(node.variableDefinitions, ", "), ")");
      const prefix = join2([node.operation, join2([node.name, varDefs]), join2(node.directives, " ")], " ");
      return prefix + " " + node.selectionSet;
    }, "leave")
  },
  VariableDefinition: {
    leave: /* @__PURE__ */ __name(({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap2(" = ", defaultValue) + wrap2(" ", join2(directives, " ")), "leave")
  },
  SelectionSet: { leave: /* @__PURE__ */ __name(({ selections }) => block2(selections), "leave") },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap2("", alias, ": ") + name;
      let argsLine = prefix + wrap2("(", join2(args, ", "), ")");
      if (argsLine.length > MAX_LINE_LENGTH2) {
        argsLine = prefix + wrap2("(\n", indent2(join2(args, "\n")), "\n)");
      }
      return join2([argsLine, join2(directives, " "), selectionSet], " ");
    }
  },
  Argument: { leave: /* @__PURE__ */ __name(({ name, value }) => name + ": " + value, "leave") },
  // Fragments
  FragmentSpread: {
    leave: /* @__PURE__ */ __name(({ name, directives }) => "..." + name + wrap2(" ", join2(directives, " ")), "leave")
  },
  InlineFragment: {
    leave: /* @__PURE__ */ __name(({ typeCondition, directives, selectionSet }) => join2(["...", wrap2("on ", typeCondition), join2(directives, " "), selectionSet], " "), "leave")
  },
  FragmentDefinition: {
    leave: /* @__PURE__ */ __name(({ name, typeCondition, variableDefinitions, directives, selectionSet }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${name}${wrap2("(", join2(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap2("", join2(directives, " "), " ")}` + selectionSet
    ), "leave")
  },
  // Value
  IntValue: { leave: /* @__PURE__ */ __name(({ value }) => value, "leave") },
  FloatValue: { leave: /* @__PURE__ */ __name(({ value }) => value, "leave") },
  StringValue: {
    leave: /* @__PURE__ */ __name(({ value, block: isBlockString }) => {
      if (isBlockString) {
        return printBlockString2(value);
      }
      return JSON.stringify(value);
    }, "leave")
  },
  BooleanValue: { leave: /* @__PURE__ */ __name(({ value }) => value ? "true" : "false", "leave") },
  NullValue: { leave: /* @__PURE__ */ __name(() => "null", "leave") },
  EnumValue: { leave: /* @__PURE__ */ __name(({ value }) => value, "leave") },
  ListValue: { leave: /* @__PURE__ */ __name(({ values }) => "[" + join2(values, ", ") + "]", "leave") },
  ObjectValue: { leave: /* @__PURE__ */ __name(({ fields }) => "{" + join2(fields, ", ") + "}", "leave") },
  ObjectField: { leave: /* @__PURE__ */ __name(({ name, value }) => name + ": " + value, "leave") },
  // Directive
  Directive: {
    leave: /* @__PURE__ */ __name(({ name, arguments: args }) => "@" + name + wrap2("(", join2(args, ", "), ")"), "leave")
  },
  // Type
  NamedType: { leave: /* @__PURE__ */ __name(({ name }) => name, "leave") },
  ListType: { leave: /* @__PURE__ */ __name(({ type }) => "[" + type + "]", "leave") },
  NonNullType: { leave: /* @__PURE__ */ __name(({ type }) => type + "!", "leave") },
  // Type System Definitions
  SchemaDefinition: {
    leave: /* @__PURE__ */ __name(({ directives, operationTypes }) => join2(["schema", join2(directives, " "), block2(operationTypes)], " "), "leave")
  },
  OperationTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ operation, type }) => operation + ": " + type, "leave")
  },
  ScalarTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ name, directives }) => join2(["scalar", name, join2(directives, " ")], " "), "leave")
  },
  ObjectTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ name, interfaces, directives, fields }) => join2([
      "type",
      name,
      wrap2("implements ", join2(interfaces, " & ")),
      join2(directives, " "),
      block2(fields)
    ], " "), "leave")
  },
  FieldDefinition: {
    leave: /* @__PURE__ */ __name(({ name, arguments: args, type, directives }) => name + (hasMultilineItems2(args) ? wrap2("(\n", indent2(join2(args, "\n")), "\n)") : wrap2("(", join2(args, ", "), ")")) + ": " + type + wrap2(" ", join2(directives, " ")), "leave")
  },
  InputValueDefinition: {
    leave: /* @__PURE__ */ __name(({ name, type, defaultValue, directives }) => join2([name + ": " + type, wrap2("= ", defaultValue), join2(directives, " ")], " "), "leave")
  },
  InterfaceTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ name, interfaces, directives, fields }) => join2([
      "interface",
      name,
      wrap2("implements ", join2(interfaces, " & ")),
      join2(directives, " "),
      block2(fields)
    ], " "), "leave")
  },
  UnionTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ name, directives, types }) => join2(["union", name, join2(directives, " "), wrap2("= ", join2(types, " | "))], " "), "leave")
  },
  EnumTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ name, directives, values }) => join2(["enum", name, join2(directives, " "), block2(values)], " "), "leave")
  },
  EnumValueDefinition: {
    leave: /* @__PURE__ */ __name(({ name, directives }) => join2([name, join2(directives, " ")], " "), "leave")
  },
  InputObjectTypeDefinition: {
    leave: /* @__PURE__ */ __name(({ name, directives, fields }) => join2(["input", name, join2(directives, " "), block2(fields)], " "), "leave")
  },
  DirectiveDefinition: {
    leave: /* @__PURE__ */ __name(({ name, arguments: args, repeatable, locations }) => "directive @" + name + (hasMultilineItems2(args) ? wrap2("(\n", indent2(join2(args, "\n")), "\n)") : wrap2("(", join2(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join2(locations, " | "), "leave")
  },
  SchemaExtension: {
    leave: /* @__PURE__ */ __name(({ directives, operationTypes }) => join2(["extend schema", join2(directives, " "), block2(operationTypes)], " "), "leave")
  },
  ScalarTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives }) => join2(["extend scalar", name, join2(directives, " ")], " "), "leave")
  },
  ObjectTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, interfaces, directives, fields }) => join2([
      "extend type",
      name,
      wrap2("implements ", join2(interfaces, " & ")),
      join2(directives, " "),
      block2(fields)
    ], " "), "leave")
  },
  InterfaceTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, interfaces, directives, fields }) => join2([
      "extend interface",
      name,
      wrap2("implements ", join2(interfaces, " & ")),
      join2(directives, " "),
      block2(fields)
    ], " "), "leave")
  },
  UnionTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives, types }) => join2(["extend union", name, join2(directives, " "), wrap2("= ", join2(types, " | "))], " "), "leave")
  },
  EnumTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives, values }) => join2(["extend enum", name, join2(directives, " "), block2(values)], " "), "leave")
  },
  InputObjectTypeExtension: {
    leave: /* @__PURE__ */ __name(({ name, directives, fields }) => join2(["extend input", name, join2(directives, " "), block2(fields)], " "), "leave")
  }
};
var printDocASTReducerWithComments = Object.keys(printDocASTReducer2).reduce((prev, key) => ({
  ...prev,
  [key]: {
    leave: addDescription(printDocASTReducer2[key].leave)
  }
}), {});
function printWithComments(ast) {
  return visit(ast, printDocASTReducerWithComments);
}
__name(printWithComments, "printWithComments");
function isFieldDefinitionNode(node) {
  return node.kind === "FieldDefinition";
}
__name(isFieldDefinitionNode, "isFieldDefinitionNode");
function getComment(node) {
  const rawValue = getLeadingCommentBlock(node);
  if (rawValue !== void 0) {
    return dedentBlockStringValue(`
${rawValue}`);
  }
}
__name(getComment, "getComment");
function getLeadingCommentBlock(node) {
  const loc = node.loc;
  if (!loc) {
    return;
  }
  const comments = [];
  let token = loc.startToken.prev;
  while (token != null && token.kind === TokenKind.COMMENT && token.next != null && token.prev != null && token.line + 1 === token.next.line && token.line !== token.prev.line) {
    const value = String(token.value);
    comments.push(value);
    token = token.prev;
  }
  return comments.length > 0 ? comments.reverse().join("\n") : void 0;
}
__name(getLeadingCommentBlock, "getLeadingCommentBlock");
function dedentBlockStringValue(rawString) {
  const lines = rawString.split(/\r\n|[\n\r]/g);
  const commonIndent = getBlockStringIndentation(lines);
  if (commonIndent !== 0) {
    for (let i = 1; i < lines.length; i++) {
      lines[i] = lines[i].slice(commonIndent);
    }
  }
  while (lines.length > 0 && isBlank(lines[0])) {
    lines.shift();
  }
  while (lines.length > 0 && isBlank(lines[lines.length - 1])) {
    lines.pop();
  }
  return lines.join("\n");
}
__name(dedentBlockStringValue, "dedentBlockStringValue");
function getBlockStringIndentation(lines) {
  let commonIndent = null;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const indent3 = leadingWhitespace2(line);
    if (indent3 === line.length) {
      continue;
    }
    if (commonIndent === null || indent3 < commonIndent) {
      commonIndent = indent3;
      if (commonIndent === 0) {
        break;
      }
    }
  }
  return commonIndent === null ? 0 : commonIndent;
}
__name(getBlockStringIndentation, "getBlockStringIndentation");
function leadingWhitespace2(str) {
  let i = 0;
  while (i < str.length && (str[i] === " " || str[i] === "	")) {
    i++;
  }
  return i;
}
__name(leadingWhitespace2, "leadingWhitespace");
function isBlank(str) {
  return leadingWhitespace2(str) === str.length;
}
__name(isBlank, "isBlank");

// node_modules/@graphql-tools/utils/esm/Interfaces.js
init_modules_watch_stub();
var MapperKind;
(function(MapperKind2) {
  MapperKind2["TYPE"] = "MapperKind.TYPE";
  MapperKind2["SCALAR_TYPE"] = "MapperKind.SCALAR_TYPE";
  MapperKind2["ENUM_TYPE"] = "MapperKind.ENUM_TYPE";
  MapperKind2["COMPOSITE_TYPE"] = "MapperKind.COMPOSITE_TYPE";
  MapperKind2["OBJECT_TYPE"] = "MapperKind.OBJECT_TYPE";
  MapperKind2["INPUT_OBJECT_TYPE"] = "MapperKind.INPUT_OBJECT_TYPE";
  MapperKind2["ABSTRACT_TYPE"] = "MapperKind.ABSTRACT_TYPE";
  MapperKind2["UNION_TYPE"] = "MapperKind.UNION_TYPE";
  MapperKind2["INTERFACE_TYPE"] = "MapperKind.INTERFACE_TYPE";
  MapperKind2["ROOT_OBJECT"] = "MapperKind.ROOT_OBJECT";
  MapperKind2["QUERY"] = "MapperKind.QUERY";
  MapperKind2["MUTATION"] = "MapperKind.MUTATION";
  MapperKind2["SUBSCRIPTION"] = "MapperKind.SUBSCRIPTION";
  MapperKind2["DIRECTIVE"] = "MapperKind.DIRECTIVE";
  MapperKind2["FIELD"] = "MapperKind.FIELD";
  MapperKind2["COMPOSITE_FIELD"] = "MapperKind.COMPOSITE_FIELD";
  MapperKind2["OBJECT_FIELD"] = "MapperKind.OBJECT_FIELD";
  MapperKind2["ROOT_FIELD"] = "MapperKind.ROOT_FIELD";
  MapperKind2["QUERY_ROOT_FIELD"] = "MapperKind.QUERY_ROOT_FIELD";
  MapperKind2["MUTATION_ROOT_FIELD"] = "MapperKind.MUTATION_ROOT_FIELD";
  MapperKind2["SUBSCRIPTION_ROOT_FIELD"] = "MapperKind.SUBSCRIPTION_ROOT_FIELD";
  MapperKind2["INTERFACE_FIELD"] = "MapperKind.INTERFACE_FIELD";
  MapperKind2["INPUT_OBJECT_FIELD"] = "MapperKind.INPUT_OBJECT_FIELD";
  MapperKind2["ARGUMENT"] = "MapperKind.ARGUMENT";
  MapperKind2["ENUM_VALUE"] = "MapperKind.ENUM_VALUE";
})(MapperKind || (MapperKind = {}));

// node_modules/@graphql-tools/utils/esm/mapSchema.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/getObjectTypeFromTypeMap.js
init_modules_watch_stub();
function getObjectTypeFromTypeMap(typeMap, type) {
  if (type) {
    const maybeObjectType = typeMap[type.name];
    if (isObjectType(maybeObjectType)) {
      return maybeObjectType;
    }
  }
}
__name(getObjectTypeFromTypeMap, "getObjectTypeFromTypeMap");

// node_modules/@graphql-tools/utils/esm/rewire.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/stub.js
init_modules_watch_stub();
function isNamedStub(type) {
  if ("getFields" in type) {
    const fields = type.getFields();
    for (const fieldName in fields) {
      const field = fields[fieldName];
      return field.name === "_fake";
    }
  }
  return false;
}
__name(isNamedStub, "isNamedStub");
function getBuiltInForStub(type) {
  switch (type.name) {
    case GraphQLInt.name:
      return GraphQLInt;
    case GraphQLFloat.name:
      return GraphQLFloat;
    case GraphQLString.name:
      return GraphQLString;
    case GraphQLBoolean.name:
      return GraphQLBoolean;
    case GraphQLID.name:
      return GraphQLID;
    default:
      return type;
  }
}
__name(getBuiltInForStub, "getBuiltInForStub");

// node_modules/@graphql-tools/utils/esm/rewire.js
function rewireTypes(originalTypeMap, directives) {
  const referenceTypeMap = /* @__PURE__ */ Object.create(null);
  for (const typeName in originalTypeMap) {
    referenceTypeMap[typeName] = originalTypeMap[typeName];
  }
  const newTypeMap = /* @__PURE__ */ Object.create(null);
  for (const typeName in referenceTypeMap) {
    const namedType = referenceTypeMap[typeName];
    if (namedType == null || typeName.startsWith("__")) {
      continue;
    }
    const newName = namedType.name;
    if (newName.startsWith("__")) {
      continue;
    }
    if (newTypeMap[newName] != null) {
      console.warn(`Duplicate schema type name ${newName} found; keeping the existing one found in the schema`);
      continue;
    }
    newTypeMap[newName] = namedType;
  }
  for (const typeName in newTypeMap) {
    newTypeMap[typeName] = rewireNamedType(newTypeMap[typeName]);
  }
  const newDirectives = directives.map((directive) => rewireDirective(directive));
  return {
    typeMap: newTypeMap,
    directives: newDirectives
  };
  function rewireDirective(directive) {
    if (isSpecifiedDirective(directive)) {
      return directive;
    }
    const directiveConfig = directive.toConfig();
    directiveConfig.args = rewireArgs(directiveConfig.args);
    return new GraphQLDirective(directiveConfig);
  }
  __name(rewireDirective, "rewireDirective");
  function rewireArgs(args) {
    const rewiredArgs = {};
    for (const argName in args) {
      const arg = args[argName];
      const rewiredArgType = rewireType(arg.type);
      if (rewiredArgType != null) {
        arg.type = rewiredArgType;
        rewiredArgs[argName] = arg;
      }
    }
    return rewiredArgs;
  }
  __name(rewireArgs, "rewireArgs");
  function rewireNamedType(type) {
    if (isObjectType(type)) {
      const config = type.toConfig();
      const newConfig = {
        ...config,
        fields: /* @__PURE__ */ __name(() => rewireFields(config.fields), "fields"),
        interfaces: /* @__PURE__ */ __name(() => rewireNamedTypes(config.interfaces), "interfaces")
      };
      return new GraphQLObjectType(newConfig);
    } else if (isInterfaceType(type)) {
      const config = type.toConfig();
      const newConfig = {
        ...config,
        fields: /* @__PURE__ */ __name(() => rewireFields(config.fields), "fields")
      };
      if ("interfaces" in newConfig) {
        newConfig.interfaces = () => rewireNamedTypes(config.interfaces);
      }
      return new GraphQLInterfaceType(newConfig);
    } else if (isUnionType(type)) {
      const config = type.toConfig();
      const newConfig = {
        ...config,
        types: /* @__PURE__ */ __name(() => rewireNamedTypes(config.types), "types")
      };
      return new GraphQLUnionType(newConfig);
    } else if (isInputObjectType(type)) {
      const config = type.toConfig();
      const newConfig = {
        ...config,
        fields: /* @__PURE__ */ __name(() => rewireInputFields(config.fields), "fields")
      };
      return new GraphQLInputObjectType(newConfig);
    } else if (isEnumType(type)) {
      const enumConfig = type.toConfig();
      return new GraphQLEnumType(enumConfig);
    } else if (isScalarType(type)) {
      if (isSpecifiedScalarType(type)) {
        return type;
      }
      const scalarConfig = type.toConfig();
      return new GraphQLScalarType(scalarConfig);
    }
    throw new Error(`Unexpected schema type: ${type}`);
  }
  __name(rewireNamedType, "rewireNamedType");
  function rewireFields(fields) {
    const rewiredFields = {};
    for (const fieldName in fields) {
      const field = fields[fieldName];
      const rewiredFieldType = rewireType(field.type);
      if (rewiredFieldType != null && field.args) {
        field.type = rewiredFieldType;
        field.args = rewireArgs(field.args);
        rewiredFields[fieldName] = field;
      }
    }
    return rewiredFields;
  }
  __name(rewireFields, "rewireFields");
  function rewireInputFields(fields) {
    const rewiredFields = {};
    for (const fieldName in fields) {
      const field = fields[fieldName];
      const rewiredFieldType = rewireType(field.type);
      if (rewiredFieldType != null) {
        field.type = rewiredFieldType;
        rewiredFields[fieldName] = field;
      }
    }
    return rewiredFields;
  }
  __name(rewireInputFields, "rewireInputFields");
  function rewireNamedTypes(namedTypes) {
    const rewiredTypes = [];
    for (const namedType of namedTypes) {
      const rewiredType = rewireType(namedType);
      if (rewiredType != null) {
        rewiredTypes.push(rewiredType);
      }
    }
    return rewiredTypes;
  }
  __name(rewireNamedTypes, "rewireNamedTypes");
  function rewireType(type) {
    if (isListType(type)) {
      const rewiredType = rewireType(type.ofType);
      return rewiredType != null ? new GraphQLList(rewiredType) : null;
    } else if (isNonNullType(type)) {
      const rewiredType = rewireType(type.ofType);
      return rewiredType != null ? new GraphQLNonNull(rewiredType) : null;
    } else if (isNamedType(type)) {
      let rewiredType = referenceTypeMap[type.name];
      if (rewiredType === void 0) {
        rewiredType = isNamedStub(type) ? getBuiltInForStub(type) : rewireNamedType(type);
        newTypeMap[rewiredType.name] = referenceTypeMap[type.name] = rewiredType;
      }
      return rewiredType != null ? newTypeMap[rewiredType.name] : null;
    }
    return null;
  }
  __name(rewireType, "rewireType");
}
__name(rewireTypes, "rewireTypes");

// node_modules/@graphql-tools/utils/esm/transformInputValue.js
init_modules_watch_stub();
function transformInputValue(type, value, inputLeafValueTransformer = null, inputObjectValueTransformer = null) {
  if (value == null) {
    return value;
  }
  const nullableType = getNullableType(type);
  if (isLeafType(nullableType)) {
    return inputLeafValueTransformer != null ? inputLeafValueTransformer(nullableType, value) : value;
  } else if (isListType(nullableType)) {
    return asArray(value).map((listMember) => transformInputValue(nullableType.ofType, listMember, inputLeafValueTransformer, inputObjectValueTransformer));
  } else if (isInputObjectType(nullableType)) {
    const fields = nullableType.getFields();
    const newValue = {};
    for (const key in value) {
      const field = fields[key];
      if (field != null) {
        newValue[key] = transformInputValue(field.type, value[key], inputLeafValueTransformer, inputObjectValueTransformer);
      }
    }
    return inputObjectValueTransformer != null ? inputObjectValueTransformer(nullableType, newValue) : newValue;
  }
}
__name(transformInputValue, "transformInputValue");
function serializeInputValue(type, value) {
  return transformInputValue(type, value, (t, v) => {
    try {
      return t.serialize(v);
    } catch {
      return v;
    }
  });
}
__name(serializeInputValue, "serializeInputValue");
function parseInputValue(type, value) {
  return transformInputValue(type, value, (t, v) => {
    try {
      return t.parseValue(v);
    } catch {
      return v;
    }
  });
}
__name(parseInputValue, "parseInputValue");

// node_modules/@graphql-tools/utils/esm/mapSchema.js
function mapSchema(schema2, schemaMapper = {}) {
  const newTypeMap = mapArguments(mapFields(mapTypes(mapDefaultValues(mapEnumValues(mapTypes(mapDefaultValues(schema2.getTypeMap(), schema2, serializeInputValue), schema2, schemaMapper, (type) => isLeafType(type)), schema2, schemaMapper), schema2, parseInputValue), schema2, schemaMapper, (type) => !isLeafType(type)), schema2, schemaMapper), schema2, schemaMapper);
  const originalDirectives = schema2.getDirectives();
  const newDirectives = mapDirectives(originalDirectives, schema2, schemaMapper);
  const { typeMap, directives } = rewireTypes(newTypeMap, newDirectives);
  return new GraphQLSchema({
    ...schema2.toConfig(),
    query: getObjectTypeFromTypeMap(typeMap, getObjectTypeFromTypeMap(newTypeMap, schema2.getQueryType())),
    mutation: getObjectTypeFromTypeMap(typeMap, getObjectTypeFromTypeMap(newTypeMap, schema2.getMutationType())),
    subscription: getObjectTypeFromTypeMap(typeMap, getObjectTypeFromTypeMap(newTypeMap, schema2.getSubscriptionType())),
    types: Object.values(typeMap),
    directives
  });
}
__name(mapSchema, "mapSchema");
function mapTypes(originalTypeMap, schema2, schemaMapper, testFn = () => true) {
  const newTypeMap = {};
  for (const typeName in originalTypeMap) {
    if (!typeName.startsWith("__")) {
      const originalType = originalTypeMap[typeName];
      if (originalType == null || !testFn(originalType)) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      const typeMapper = getTypeMapper(schema2, schemaMapper, typeName);
      if (typeMapper == null) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      const maybeNewType = typeMapper(originalType, schema2);
      if (maybeNewType === void 0) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      newTypeMap[typeName] = maybeNewType;
    }
  }
  return newTypeMap;
}
__name(mapTypes, "mapTypes");
function mapEnumValues(originalTypeMap, schema2, schemaMapper) {
  const enumValueMapper = getEnumValueMapper(schemaMapper);
  if (!enumValueMapper) {
    return originalTypeMap;
  }
  return mapTypes(originalTypeMap, schema2, {
    [MapperKind.ENUM_TYPE]: (type) => {
      const config = type.toConfig();
      const originalEnumValueConfigMap = config.values;
      const newEnumValueConfigMap = {};
      for (const externalValue in originalEnumValueConfigMap) {
        const originalEnumValueConfig = originalEnumValueConfigMap[externalValue];
        const mappedEnumValue = enumValueMapper(originalEnumValueConfig, type.name, schema2, externalValue);
        if (mappedEnumValue === void 0) {
          newEnumValueConfigMap[externalValue] = originalEnumValueConfig;
        } else if (Array.isArray(mappedEnumValue)) {
          const [newExternalValue, newEnumValueConfig] = mappedEnumValue;
          newEnumValueConfigMap[newExternalValue] = newEnumValueConfig === void 0 ? originalEnumValueConfig : newEnumValueConfig;
        } else if (mappedEnumValue !== null) {
          newEnumValueConfigMap[externalValue] = mappedEnumValue;
        }
      }
      return correctASTNodes(new GraphQLEnumType({
        ...config,
        values: newEnumValueConfigMap
      }));
    }
  }, (type) => isEnumType(type));
}
__name(mapEnumValues, "mapEnumValues");
function mapDefaultValues(originalTypeMap, schema2, fn) {
  const newTypeMap = mapArguments(originalTypeMap, schema2, {
    [MapperKind.ARGUMENT]: (argumentConfig) => {
      if (argumentConfig.defaultValue === void 0) {
        return argumentConfig;
      }
      const maybeNewType = getNewType(originalTypeMap, argumentConfig.type);
      if (maybeNewType != null) {
        return {
          ...argumentConfig,
          defaultValue: fn(maybeNewType, argumentConfig.defaultValue)
        };
      }
    }
  });
  return mapFields(newTypeMap, schema2, {
    [MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig) => {
      if (inputFieldConfig.defaultValue === void 0) {
        return inputFieldConfig;
      }
      const maybeNewType = getNewType(newTypeMap, inputFieldConfig.type);
      if (maybeNewType != null) {
        return {
          ...inputFieldConfig,
          defaultValue: fn(maybeNewType, inputFieldConfig.defaultValue)
        };
      }
    }
  });
}
__name(mapDefaultValues, "mapDefaultValues");
function getNewType(newTypeMap, type) {
  if (isListType(type)) {
    const newType = getNewType(newTypeMap, type.ofType);
    return newType != null ? new GraphQLList(newType) : null;
  } else if (isNonNullType(type)) {
    const newType = getNewType(newTypeMap, type.ofType);
    return newType != null ? new GraphQLNonNull(newType) : null;
  } else if (isNamedType(type)) {
    const newType = newTypeMap[type.name];
    return newType != null ? newType : null;
  }
  return null;
}
__name(getNewType, "getNewType");
function mapFields(originalTypeMap, schema2, schemaMapper) {
  const newTypeMap = {};
  for (const typeName in originalTypeMap) {
    if (!typeName.startsWith("__")) {
      const originalType = originalTypeMap[typeName];
      if (!isObjectType(originalType) && !isInterfaceType(originalType) && !isInputObjectType(originalType)) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      const fieldMapper = getFieldMapper(schema2, schemaMapper, typeName);
      if (fieldMapper == null) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      const config = originalType.toConfig();
      const originalFieldConfigMap = config.fields;
      const newFieldConfigMap = {};
      for (const fieldName in originalFieldConfigMap) {
        const originalFieldConfig = originalFieldConfigMap[fieldName];
        const mappedField = fieldMapper(originalFieldConfig, fieldName, typeName, schema2);
        if (mappedField === void 0) {
          newFieldConfigMap[fieldName] = originalFieldConfig;
        } else if (Array.isArray(mappedField)) {
          const [newFieldName, newFieldConfig] = mappedField;
          if (newFieldConfig.astNode != null) {
            newFieldConfig.astNode = {
              ...newFieldConfig.astNode,
              name: {
                ...newFieldConfig.astNode.name,
                value: newFieldName
              }
            };
          }
          newFieldConfigMap[newFieldName] = newFieldConfig === void 0 ? originalFieldConfig : newFieldConfig;
        } else if (mappedField !== null) {
          newFieldConfigMap[fieldName] = mappedField;
        }
      }
      if (isObjectType(originalType)) {
        newTypeMap[typeName] = correctASTNodes(new GraphQLObjectType({
          ...config,
          fields: newFieldConfigMap
        }));
      } else if (isInterfaceType(originalType)) {
        newTypeMap[typeName] = correctASTNodes(new GraphQLInterfaceType({
          ...config,
          fields: newFieldConfigMap
        }));
      } else {
        newTypeMap[typeName] = correctASTNodes(new GraphQLInputObjectType({
          ...config,
          fields: newFieldConfigMap
        }));
      }
    }
  }
  return newTypeMap;
}
__name(mapFields, "mapFields");
function mapArguments(originalTypeMap, schema2, schemaMapper) {
  const newTypeMap = {};
  for (const typeName in originalTypeMap) {
    if (!typeName.startsWith("__")) {
      const originalType = originalTypeMap[typeName];
      if (!isObjectType(originalType) && !isInterfaceType(originalType)) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      const argumentMapper = getArgumentMapper(schemaMapper);
      if (argumentMapper == null) {
        newTypeMap[typeName] = originalType;
        continue;
      }
      const config = originalType.toConfig();
      const originalFieldConfigMap = config.fields;
      const newFieldConfigMap = {};
      for (const fieldName in originalFieldConfigMap) {
        const originalFieldConfig = originalFieldConfigMap[fieldName];
        const originalArgumentConfigMap = originalFieldConfig.args;
        if (originalArgumentConfigMap == null) {
          newFieldConfigMap[fieldName] = originalFieldConfig;
          continue;
        }
        const argumentNames = Object.keys(originalArgumentConfigMap);
        if (!argumentNames.length) {
          newFieldConfigMap[fieldName] = originalFieldConfig;
          continue;
        }
        const newArgumentConfigMap = {};
        for (const argumentName of argumentNames) {
          const originalArgumentConfig = originalArgumentConfigMap[argumentName];
          const mappedArgument = argumentMapper(originalArgumentConfig, fieldName, typeName, schema2);
          if (mappedArgument === void 0) {
            newArgumentConfigMap[argumentName] = originalArgumentConfig;
          } else if (Array.isArray(mappedArgument)) {
            const [newArgumentName, newArgumentConfig] = mappedArgument;
            newArgumentConfigMap[newArgumentName] = newArgumentConfig;
          } else if (mappedArgument !== null) {
            newArgumentConfigMap[argumentName] = mappedArgument;
          }
        }
        newFieldConfigMap[fieldName] = {
          ...originalFieldConfig,
          args: newArgumentConfigMap
        };
      }
      if (isObjectType(originalType)) {
        newTypeMap[typeName] = new GraphQLObjectType({
          ...config,
          fields: newFieldConfigMap
        });
      } else if (isInterfaceType(originalType)) {
        newTypeMap[typeName] = new GraphQLInterfaceType({
          ...config,
          fields: newFieldConfigMap
        });
      } else {
        newTypeMap[typeName] = new GraphQLInputObjectType({
          ...config,
          fields: newFieldConfigMap
        });
      }
    }
  }
  return newTypeMap;
}
__name(mapArguments, "mapArguments");
function mapDirectives(originalDirectives, schema2, schemaMapper) {
  const directiveMapper = getDirectiveMapper(schemaMapper);
  if (directiveMapper == null) {
    return originalDirectives.slice();
  }
  const newDirectives = [];
  for (const directive of originalDirectives) {
    const mappedDirective = directiveMapper(directive, schema2);
    if (mappedDirective === void 0) {
      newDirectives.push(directive);
    } else if (mappedDirective !== null) {
      newDirectives.push(mappedDirective);
    }
  }
  return newDirectives;
}
__name(mapDirectives, "mapDirectives");
function getTypeSpecifiers(schema2, typeName) {
  const type = schema2.getType(typeName);
  const specifiers = [MapperKind.TYPE];
  if (isObjectType(type)) {
    specifiers.push(MapperKind.COMPOSITE_TYPE, MapperKind.OBJECT_TYPE);
    if (typeName === schema2.getQueryType()?.name) {
      specifiers.push(MapperKind.ROOT_OBJECT, MapperKind.QUERY);
    } else if (typeName === schema2.getMutationType()?.name) {
      specifiers.push(MapperKind.ROOT_OBJECT, MapperKind.MUTATION);
    } else if (typeName === schema2.getSubscriptionType()?.name) {
      specifiers.push(MapperKind.ROOT_OBJECT, MapperKind.SUBSCRIPTION);
    }
  } else if (isInputObjectType(type)) {
    specifiers.push(MapperKind.INPUT_OBJECT_TYPE);
  } else if (isInterfaceType(type)) {
    specifiers.push(MapperKind.COMPOSITE_TYPE, MapperKind.ABSTRACT_TYPE, MapperKind.INTERFACE_TYPE);
  } else if (isUnionType(type)) {
    specifiers.push(MapperKind.COMPOSITE_TYPE, MapperKind.ABSTRACT_TYPE, MapperKind.UNION_TYPE);
  } else if (isEnumType(type)) {
    specifiers.push(MapperKind.ENUM_TYPE);
  } else if (isScalarType(type)) {
    specifiers.push(MapperKind.SCALAR_TYPE);
  }
  return specifiers;
}
__name(getTypeSpecifiers, "getTypeSpecifiers");
function getTypeMapper(schema2, schemaMapper, typeName) {
  const specifiers = getTypeSpecifiers(schema2, typeName);
  let typeMapper;
  const stack = [...specifiers];
  while (!typeMapper && stack.length > 0) {
    const next = stack.pop();
    typeMapper = schemaMapper[next];
  }
  return typeMapper != null ? typeMapper : null;
}
__name(getTypeMapper, "getTypeMapper");
function getFieldSpecifiers(schema2, typeName) {
  const type = schema2.getType(typeName);
  const specifiers = [MapperKind.FIELD];
  if (isObjectType(type)) {
    specifiers.push(MapperKind.COMPOSITE_FIELD, MapperKind.OBJECT_FIELD);
    if (typeName === schema2.getQueryType()?.name) {
      specifiers.push(MapperKind.ROOT_FIELD, MapperKind.QUERY_ROOT_FIELD);
    } else if (typeName === schema2.getMutationType()?.name) {
      specifiers.push(MapperKind.ROOT_FIELD, MapperKind.MUTATION_ROOT_FIELD);
    } else if (typeName === schema2.getSubscriptionType()?.name) {
      specifiers.push(MapperKind.ROOT_FIELD, MapperKind.SUBSCRIPTION_ROOT_FIELD);
    }
  } else if (isInterfaceType(type)) {
    specifiers.push(MapperKind.COMPOSITE_FIELD, MapperKind.INTERFACE_FIELD);
  } else if (isInputObjectType(type)) {
    specifiers.push(MapperKind.INPUT_OBJECT_FIELD);
  }
  return specifiers;
}
__name(getFieldSpecifiers, "getFieldSpecifiers");
function getFieldMapper(schema2, schemaMapper, typeName) {
  const specifiers = getFieldSpecifiers(schema2, typeName);
  let fieldMapper;
  const stack = [...specifiers];
  while (!fieldMapper && stack.length > 0) {
    const next = stack.pop();
    fieldMapper = schemaMapper[next];
  }
  return fieldMapper ?? null;
}
__name(getFieldMapper, "getFieldMapper");
function getArgumentMapper(schemaMapper) {
  const argumentMapper = schemaMapper[MapperKind.ARGUMENT];
  return argumentMapper != null ? argumentMapper : null;
}
__name(getArgumentMapper, "getArgumentMapper");
function getDirectiveMapper(schemaMapper) {
  const directiveMapper = schemaMapper[MapperKind.DIRECTIVE];
  return directiveMapper != null ? directiveMapper : null;
}
__name(getDirectiveMapper, "getDirectiveMapper");
function getEnumValueMapper(schemaMapper) {
  const enumValueMapper = schemaMapper[MapperKind.ENUM_VALUE];
  return enumValueMapper != null ? enumValueMapper : null;
}
__name(getEnumValueMapper, "getEnumValueMapper");
function correctASTNodes(type) {
  if (isObjectType(type)) {
    const config = type.toConfig();
    if (config.astNode != null) {
      const fields = [];
      for (const fieldName in config.fields) {
        const fieldConfig = config.fields[fieldName];
        if (fieldConfig.astNode != null) {
          fields.push(fieldConfig.astNode);
        }
      }
      config.astNode = {
        ...config.astNode,
        kind: Kind.OBJECT_TYPE_DEFINITION,
        fields
      };
    }
    if (config.extensionASTNodes != null) {
      config.extensionASTNodes = config.extensionASTNodes.map((node) => ({
        ...node,
        kind: Kind.OBJECT_TYPE_EXTENSION,
        fields: void 0
      }));
    }
    return new GraphQLObjectType(config);
  } else if (isInterfaceType(type)) {
    const config = type.toConfig();
    if (config.astNode != null) {
      const fields = [];
      for (const fieldName in config.fields) {
        const fieldConfig = config.fields[fieldName];
        if (fieldConfig.astNode != null) {
          fields.push(fieldConfig.astNode);
        }
      }
      config.astNode = {
        ...config.astNode,
        kind: Kind.INTERFACE_TYPE_DEFINITION,
        fields
      };
    }
    if (config.extensionASTNodes != null) {
      config.extensionASTNodes = config.extensionASTNodes.map((node) => ({
        ...node,
        kind: Kind.INTERFACE_TYPE_EXTENSION,
        fields: void 0
      }));
    }
    return new GraphQLInterfaceType(config);
  } else if (isInputObjectType(type)) {
    const config = type.toConfig();
    if (config.astNode != null) {
      const fields = [];
      for (const fieldName in config.fields) {
        const fieldConfig = config.fields[fieldName];
        if (fieldConfig.astNode != null) {
          fields.push(fieldConfig.astNode);
        }
      }
      config.astNode = {
        ...config.astNode,
        kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
        fields
      };
    }
    if (config.extensionASTNodes != null) {
      config.extensionASTNodes = config.extensionASTNodes.map((node) => ({
        ...node,
        kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
        fields: void 0
      }));
    }
    return new GraphQLInputObjectType(config);
  } else if (isEnumType(type)) {
    const config = type.toConfig();
    if (config.astNode != null) {
      const values = [];
      for (const enumKey in config.values) {
        const enumValueConfig = config.values[enumKey];
        if (enumValueConfig.astNode != null) {
          values.push(enumValueConfig.astNode);
        }
      }
      config.astNode = {
        ...config.astNode,
        values
      };
    }
    if (config.extensionASTNodes != null) {
      config.extensionASTNodes = config.extensionASTNodes.map((node) => ({
        ...node,
        values: void 0
      }));
    }
    return new GraphQLEnumType(config);
  } else {
    return type;
  }
}
__name(correctASTNodes, "correctASTNodes");

// node_modules/@graphql-tools/utils/esm/heal.js
init_modules_watch_stub();
function healSchema(schema2) {
  healTypes(schema2.getTypeMap(), schema2.getDirectives());
  return schema2;
}
__name(healSchema, "healSchema");
function healTypes(originalTypeMap, directives) {
  const actualNamedTypeMap = /* @__PURE__ */ Object.create(null);
  for (const typeName in originalTypeMap) {
    const namedType = originalTypeMap[typeName];
    if (namedType == null || typeName.startsWith("__")) {
      continue;
    }
    const actualName = namedType.name;
    if (actualName.startsWith("__")) {
      continue;
    }
    if (actualNamedTypeMap[actualName] != null) {
      console.warn(`Duplicate schema type name ${actualName} found; keeping the existing one found in the schema`);
      continue;
    }
    actualNamedTypeMap[actualName] = namedType;
  }
  for (const typeName in actualNamedTypeMap) {
    const namedType = actualNamedTypeMap[typeName];
    originalTypeMap[typeName] = namedType;
  }
  for (const decl of directives) {
    decl.args = decl.args.filter((arg) => {
      arg.type = healType(arg.type);
      return arg.type !== null;
    });
  }
  for (const typeName in originalTypeMap) {
    const namedType = originalTypeMap[typeName];
    if (!typeName.startsWith("__") && typeName in actualNamedTypeMap) {
      if (namedType != null) {
        healNamedType(namedType);
      }
    }
  }
  for (const typeName in originalTypeMap) {
    if (!typeName.startsWith("__") && !(typeName in actualNamedTypeMap)) {
      delete originalTypeMap[typeName];
    }
  }
  function healNamedType(type) {
    if (isObjectType(type)) {
      healFields(type);
      healInterfaces(type);
      return;
    } else if (isInterfaceType(type)) {
      healFields(type);
      if ("getInterfaces" in type) {
        healInterfaces(type);
      }
      return;
    } else if (isUnionType(type)) {
      healUnderlyingTypes(type);
      return;
    } else if (isInputObjectType(type)) {
      healInputFields(type);
      return;
    } else if (isLeafType(type)) {
      return;
    }
    throw new Error(`Unexpected schema type: ${type}`);
  }
  __name(healNamedType, "healNamedType");
  function healFields(type) {
    const fieldMap = type.getFields();
    for (const [key, field] of Object.entries(fieldMap)) {
      field.args.map((arg) => {
        arg.type = healType(arg.type);
        return arg.type === null ? null : arg;
      }).filter(Boolean);
      field.type = healType(field.type);
      if (field.type === null) {
        delete fieldMap[key];
      }
    }
  }
  __name(healFields, "healFields");
  function healInterfaces(type) {
    if ("getInterfaces" in type) {
      const interfaces = type.getInterfaces();
      interfaces.push(...interfaces.splice(0).map((iface) => healType(iface)).filter(Boolean));
    }
  }
  __name(healInterfaces, "healInterfaces");
  function healInputFields(type) {
    const fieldMap = type.getFields();
    for (const [key, field] of Object.entries(fieldMap)) {
      field.type = healType(field.type);
      if (field.type === null) {
        delete fieldMap[key];
      }
    }
  }
  __name(healInputFields, "healInputFields");
  function healUnderlyingTypes(type) {
    const types = type.getTypes();
    types.push(...types.splice(0).map((t) => healType(t)).filter(Boolean));
  }
  __name(healUnderlyingTypes, "healUnderlyingTypes");
  function healType(type) {
    if (isListType(type)) {
      const healedType = healType(type.ofType);
      return healedType != null ? new GraphQLList(healedType) : null;
    } else if (isNonNullType(type)) {
      const healedType = healType(type.ofType);
      return healedType != null ? new GraphQLNonNull(healedType) : null;
    } else if (isNamedType(type)) {
      const officialType = originalTypeMap[type.name];
      if (officialType && type !== officialType) {
        return officialType;
      }
    }
    return type;
  }
  __name(healType, "healType");
}
__name(healTypes, "healTypes");

// node_modules/@graphql-tools/utils/esm/forEachField.js
init_modules_watch_stub();
function forEachField(schema2, fn) {
  const typeMap = schema2.getTypeMap();
  for (const typeName in typeMap) {
    const type = typeMap[typeName];
    if (!getNamedType(type).name.startsWith("__") && isObjectType(type)) {
      const fields = type.getFields();
      for (const fieldName in fields) {
        const field = fields[fieldName];
        fn(field, typeName, fieldName);
      }
    }
  }
}
__name(forEachField, "forEachField");

// node_modules/@graphql-tools/utils/esm/forEachDefaultValue.js
init_modules_watch_stub();
function forEachDefaultValue(schema2, fn) {
  const typeMap = schema2.getTypeMap();
  for (const typeName in typeMap) {
    const type = typeMap[typeName];
    if (!getNamedType(type).name.startsWith("__")) {
      if (isObjectType(type)) {
        const fields = type.getFields();
        for (const fieldName in fields) {
          const field = fields[fieldName];
          for (const arg of field.args) {
            arg.defaultValue = fn(arg.type, arg.defaultValue);
          }
        }
      } else if (isInputObjectType(type)) {
        const fields = type.getFields();
        for (const fieldName in fields) {
          const field = fields[fieldName];
          field.defaultValue = fn(field.type, field.defaultValue);
        }
      }
    }
  }
}
__name(forEachDefaultValue, "forEachDefaultValue");

// node_modules/@graphql-tools/utils/esm/mergeDeep.js
init_modules_watch_stub();
function mergeDeep(sources, respectPrototype = false, respectArrays = false, respectArrayLength = false) {
  let expectedLength;
  let allArrays = true;
  const areArraysInTheSameLength = sources.every((source) => {
    if (Array.isArray(source)) {
      if (expectedLength === void 0) {
        expectedLength = source.length;
        return true;
      } else if (expectedLength === source.length) {
        return true;
      }
    } else {
      allArrays = false;
    }
    return false;
  });
  if (respectArrayLength && areArraysInTheSameLength) {
    return new Array(expectedLength).fill(null).map((_, index) => mergeDeep(sources.map((source) => source[index]), respectPrototype, respectArrays, respectArrayLength));
  }
  if (allArrays) {
    return sources.flat(1);
  }
  let output;
  let firstObjectSource;
  if (respectPrototype) {
    firstObjectSource = sources.find((source) => isObject(source));
    if (output == null) {
      output = {};
    }
    if (firstObjectSource) {
      Object.setPrototypeOf(output, Object.create(Object.getPrototypeOf(firstObjectSource)));
    }
  }
  for (const source of sources) {
    if (isObject(source)) {
      if (firstObjectSource) {
        const outputPrototype = Object.getPrototypeOf(output);
        const sourcePrototype = Object.getPrototypeOf(source);
        if (sourcePrototype) {
          for (const key of Object.getOwnPropertyNames(sourcePrototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(sourcePrototype, key);
            if (isSome(descriptor)) {
              Object.defineProperty(outputPrototype, key, descriptor);
            }
          }
        }
      }
      for (const key in source) {
        if (output == null) {
          output = {};
        }
        if (key in output) {
          output[key] = mergeDeep([output[key], source[key]], respectPrototype, respectArrays, respectArrayLength);
        } else {
          output[key] = source[key];
        }
      }
    } else if (Array.isArray(source)) {
      if (!Array.isArray(output)) {
        output = source;
      } else {
        output = mergeDeep([output, source], respectPrototype, respectArrays, respectArrayLength);
      }
    } else {
      output = source;
    }
  }
  return output;
}
__name(mergeDeep, "mergeDeep");
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
__name(isObject, "isObject");

// node_modules/@graphql-tools/utils/esm/collectFields.js
init_modules_watch_stub();

// node_modules/@graphql-tools/utils/esm/AccumulatorMap.js
init_modules_watch_stub();
var AccumulatorMap = class extends Map {
  static {
    __name(this, "AccumulatorMap");
  }
  get [Symbol.toStringTag]() {
    return "AccumulatorMap";
  }
  add(key, item) {
    const group2 = this.get(key);
    if (group2 === void 0) {
      this.set(key, [item]);
    } else {
      group2.push(item);
    }
  }
};

// node_modules/@graphql-tools/utils/esm/directives.js
init_modules_watch_stub();
var GraphQLDeferDirective = new GraphQLDirective({
  name: "defer",
  description: "Directs the executor to defer this fragment when the `if` argument is true or undefined.",
  locations: [DirectiveLocation.FRAGMENT_SPREAD, DirectiveLocation.INLINE_FRAGMENT],
  args: {
    if: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Deferred when true or undefined.",
      defaultValue: true
    },
    label: {
      type: GraphQLString,
      description: "Unique name"
    }
  }
});
var GraphQLStreamDirective = new GraphQLDirective({
  name: "stream",
  description: "Directs the executor to stream plural fields when the `if` argument is true or undefined.",
  locations: [DirectiveLocation.FIELD],
  args: {
    if: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Stream when true or undefined.",
      defaultValue: true
    },
    label: {
      type: GraphQLString,
      description: "Unique name"
    },
    initialCount: {
      defaultValue: 0,
      type: GraphQLInt,
      description: "Number of items to return immediately"
    }
  }
});

// node_modules/@graphql-tools/utils/esm/collectFields.js
function collectFieldsImpl2(schema2, fragments, variableValues, runtimeType, selectionSet, fields, patches, visitedFragmentNames) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        if (!shouldIncludeNode2(variableValues, selection)) {
          continue;
        }
        fields.add(getFieldEntryKey2(selection), selection);
        break;
      }
      case Kind.INLINE_FRAGMENT: {
        if (!shouldIncludeNode2(variableValues, selection) || !doesFragmentConditionMatch2(schema2, selection, runtimeType)) {
          continue;
        }
        const defer = getDeferValues(variableValues, selection);
        if (defer) {
          const patchFields = new AccumulatorMap();
          collectFieldsImpl2(schema2, fragments, variableValues, runtimeType, selection.selectionSet, patchFields, patches, visitedFragmentNames);
          patches.push({
            label: defer.label,
            fields: patchFields
          });
        } else {
          collectFieldsImpl2(schema2, fragments, variableValues, runtimeType, selection.selectionSet, fields, patches, visitedFragmentNames);
        }
        break;
      }
      case Kind.FRAGMENT_SPREAD: {
        const fragName = selection.name.value;
        if (!shouldIncludeNode2(variableValues, selection)) {
          continue;
        }
        const defer = getDeferValues(variableValues, selection);
        if (visitedFragmentNames.has(fragName) && !defer) {
          continue;
        }
        const fragment = fragments[fragName];
        if (!fragment || !doesFragmentConditionMatch2(schema2, fragment, runtimeType)) {
          continue;
        }
        if (!defer) {
          visitedFragmentNames.add(fragName);
        }
        if (defer) {
          const patchFields = new AccumulatorMap();
          collectFieldsImpl2(schema2, fragments, variableValues, runtimeType, fragment.selectionSet, patchFields, patches, visitedFragmentNames);
          patches.push({
            label: defer.label,
            fields: patchFields
          });
        } else {
          collectFieldsImpl2(schema2, fragments, variableValues, runtimeType, fragment.selectionSet, fields, patches, visitedFragmentNames);
        }
        break;
      }
    }
  }
}
__name(collectFieldsImpl2, "collectFieldsImpl");
function collectFields2(schema2, fragments, variableValues, runtimeType, selectionSet) {
  const fields = new AccumulatorMap();
  const patches = [];
  collectFieldsImpl2(schema2, fragments, variableValues, runtimeType, selectionSet, fields, patches, /* @__PURE__ */ new Set());
  return { fields, patches };
}
__name(collectFields2, "collectFields");
function shouldIncludeNode2(variableValues, node) {
  const skip = getDirectiveValues(GraphQLSkipDirective, node, variableValues);
  if (skip?.["if"] === true) {
    return false;
  }
  const include = getDirectiveValues(GraphQLIncludeDirective, node, variableValues);
  if (include?.["if"] === false) {
    return false;
  }
  return true;
}
__name(shouldIncludeNode2, "shouldIncludeNode");
function doesFragmentConditionMatch2(schema2, fragment, type) {
  const typeConditionNode = fragment.typeCondition;
  if (!typeConditionNode) {
    return true;
  }
  const conditionalType = typeFromAST(schema2, typeConditionNode);
  if (conditionalType === type) {
    return true;
  }
  if (isAbstractType(conditionalType)) {
    const possibleTypes = schema2.getPossibleTypes(conditionalType);
    return possibleTypes.includes(type);
  }
  return false;
}
__name(doesFragmentConditionMatch2, "doesFragmentConditionMatch");
function getFieldEntryKey2(node) {
  return node.alias ? node.alias.value : node.name.value;
}
__name(getFieldEntryKey2, "getFieldEntryKey");
function getDeferValues(variableValues, node) {
  const defer = getDirectiveValues(GraphQLDeferDirective, node, variableValues);
  if (!defer) {
    return;
  }
  if (defer["if"] === false) {
    return;
  }
  return {
    label: typeof defer["label"] === "string" ? defer["label"] : void 0
  };
}
__name(getDeferValues, "getDeferValues");
var collectSubFields = memoize5(/* @__PURE__ */ __name(function collectSubfields3(schema2, fragments, variableValues, returnType, fieldNodes) {
  const subFieldNodes = new AccumulatorMap();
  const visitedFragmentNames = /* @__PURE__ */ new Set();
  const subPatches = [];
  const subFieldsAndPatches = {
    fields: subFieldNodes,
    patches: subPatches
  };
  for (const node of fieldNodes) {
    if (node.selectionSet) {
      collectFieldsImpl2(schema2, fragments, variableValues, returnType, node.selectionSet, subFieldNodes, subPatches, visitedFragmentNames);
    }
  }
  return subFieldsAndPatches;
}, "collectSubfields"));

// node_modules/@graphql-tools/utils/esm/isAsyncIterable.js
init_modules_watch_stub();
function isAsyncIterable2(value) {
  return value?.[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable2, "isAsyncIterable");

// node_modules/@graphql-tools/utils/esm/isDocumentNode.js
init_modules_watch_stub();
function isDocumentNode(object) {
  return object && typeof object === "object" && "kind" in object && object.kind === Kind.DOCUMENT;
}
__name(isDocumentNode, "isDocumentNode");

// node_modules/@graphql-tools/utils/esm/Path.js
init_modules_watch_stub();
function addPath2(prev, key, typename) {
  return { prev, key, typename };
}
__name(addPath2, "addPath");
function pathToArray2(path) {
  const flattened = [];
  let curr = path;
  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }
  return flattened.reverse();
}
__name(pathToArray2, "pathToArray");
function printPathArray2(path) {
  return path.map((key) => typeof key === "number" ? "[" + key.toString() + "]" : "." + key).join("");
}
__name(printPathArray2, "printPathArray");

// node_modules/@graphql-tools/schema/esm/assertResolversPresent.js
function assertResolversPresent(schema2, resolverValidationOptions = {}) {
  const { requireResolversForArgs, requireResolversForNonScalar, requireResolversForAllFields } = resolverValidationOptions;
  if (requireResolversForAllFields && (requireResolversForArgs || requireResolversForNonScalar)) {
    throw new TypeError("requireResolversForAllFields takes precedence over the more specific assertions. Please configure either requireResolversForAllFields or requireResolversForArgs / requireResolversForNonScalar, but not a combination of them.");
  }
  forEachField(schema2, (field, typeName, fieldName) => {
    if (requireResolversForAllFields) {
      expectResolver("requireResolversForAllFields", requireResolversForAllFields, field, typeName, fieldName);
    }
    if (requireResolversForArgs && field.args.length > 0) {
      expectResolver("requireResolversForArgs", requireResolversForArgs, field, typeName, fieldName);
    }
    if (requireResolversForNonScalar !== "ignore" && !isScalarType(getNamedType(field.type))) {
      expectResolver("requireResolversForNonScalar", requireResolversForNonScalar, field, typeName, fieldName);
    }
  });
}
__name(assertResolversPresent, "assertResolversPresent");
function expectResolver(validator, behavior, field, typeName, fieldName) {
  if (!field.resolve) {
    const message = `Resolver missing for "${typeName}.${fieldName}".
To disable this validator, use:
  resolverValidationOptions: {
    ${validator}: 'ignore'
  }`;
    if (behavior === "error") {
      throw new Error(message);
    }
    if (behavior === "warn") {
      console.warn(message);
    }
    return;
  }
  if (typeof field.resolve !== "function") {
    throw new Error(`Resolver "${typeName}.${fieldName}" must be a function`);
  }
}
__name(expectResolver, "expectResolver");

// node_modules/@graphql-tools/schema/esm/addResolversToSchema.js
init_modules_watch_stub();

// node_modules/@graphql-tools/schema/esm/checkForResolveTypeResolver.js
init_modules_watch_stub();
function checkForResolveTypeResolver(schema2, requireResolversForResolveType) {
  mapSchema(schema2, {
    [MapperKind.ABSTRACT_TYPE]: (type) => {
      if (!type.resolveType) {
        const message = `Type "${type.name}" is missing a "__resolveType" resolver. Pass 'ignore' into "resolverValidationOptions.requireResolversForResolveType" to disable this error.`;
        if (requireResolversForResolveType === "error") {
          throw new Error(message);
        }
        if (requireResolversForResolveType === "warn") {
          console.warn(message);
        }
      }
      return void 0;
    }
  });
}
__name(checkForResolveTypeResolver, "checkForResolveTypeResolver");

// node_modules/@graphql-tools/schema/esm/extendResolversFromInterfaces.js
init_modules_watch_stub();
function extendResolversFromInterfaces(schema2, resolvers2) {
  const extendedResolvers = {};
  const typeMap = schema2.getTypeMap();
  for (const typeName in typeMap) {
    const type = typeMap[typeName];
    if ("getInterfaces" in type) {
      extendedResolvers[typeName] = {};
      for (const iFace of type.getInterfaces()) {
        if (resolvers2[iFace.name]) {
          for (const fieldName in resolvers2[iFace.name]) {
            if (fieldName === "__isTypeOf" || !fieldName.startsWith("__")) {
              extendedResolvers[typeName][fieldName] = resolvers2[iFace.name][fieldName];
            }
          }
        }
      }
      const typeResolvers = resolvers2[typeName];
      extendedResolvers[typeName] = {
        ...extendedResolvers[typeName],
        ...typeResolvers
      };
    } else {
      const typeResolvers = resolvers2[typeName];
      if (typeResolvers != null) {
        extendedResolvers[typeName] = typeResolvers;
      }
    }
  }
  return extendedResolvers;
}
__name(extendResolversFromInterfaces, "extendResolversFromInterfaces");

// node_modules/@graphql-tools/schema/esm/addResolversToSchema.js
function addResolversToSchema({ schema: schema2, resolvers: inputResolvers, defaultFieldResolver: defaultFieldResolver3, resolverValidationOptions = {}, inheritResolversFromInterfaces = false, updateResolversInPlace = false }) {
  const { requireResolversToMatchSchema = "error", requireResolversForResolveType } = resolverValidationOptions;
  const resolvers2 = inheritResolversFromInterfaces ? extendResolversFromInterfaces(schema2, inputResolvers) : inputResolvers;
  for (const typeName in resolvers2) {
    const resolverValue = resolvers2[typeName];
    const resolverType = typeof resolverValue;
    if (resolverType !== "object") {
      throw new Error(`"${typeName}" defined in resolvers, but has invalid value "${resolverValue}". The resolver's value must be of type object.`);
    }
    const type = schema2.getType(typeName);
    if (type == null) {
      const msg = `"${typeName}" defined in resolvers, but not in schema`;
      if (requireResolversToMatchSchema && requireResolversToMatchSchema !== "error") {
        if (requireResolversToMatchSchema === "warn") {
          console.warn(msg);
        }
        continue;
      }
      throw new Error(msg);
    } else if (isSpecifiedScalarType(type)) {
      for (const fieldName in resolverValue) {
        if (fieldName.startsWith("__")) {
          type[fieldName.substring(2)] = resolverValue[fieldName];
        } else {
          type[fieldName] = resolverValue[fieldName];
        }
      }
    } else if (isEnumType(type)) {
      const values = type.getValues();
      for (const fieldName in resolverValue) {
        if (!fieldName.startsWith("__") && !values.some((value) => value.name === fieldName) && requireResolversToMatchSchema && requireResolversToMatchSchema !== "ignore") {
          const msg = `${type.name}.${fieldName} was defined in resolvers, but not present within ${type.name}`;
          if (requireResolversToMatchSchema === "error") {
            throw new Error(msg);
          } else {
            console.warn(msg);
          }
        }
      }
    } else if (isUnionType(type)) {
      for (const fieldName in resolverValue) {
        if (!fieldName.startsWith("__") && requireResolversToMatchSchema && requireResolversToMatchSchema !== "ignore") {
          const msg = `${type.name}.${fieldName} was defined in resolvers, but ${type.name} is not an object or interface type`;
          if (requireResolversToMatchSchema === "error") {
            throw new Error(msg);
          } else {
            console.warn(msg);
          }
        }
      }
    } else if (isObjectType(type) || isInterfaceType(type)) {
      for (const fieldName in resolverValue) {
        if (!fieldName.startsWith("__")) {
          const fields = type.getFields();
          const field = fields[fieldName];
          if (field == null) {
            if (requireResolversToMatchSchema && requireResolversToMatchSchema !== "ignore") {
              const msg = `${typeName}.${fieldName} defined in resolvers, but not in schema`;
              if (requireResolversToMatchSchema === "error") {
                throw new Error(msg);
              } else {
                console.error(msg);
              }
            }
          } else {
            const fieldResolve = resolverValue[fieldName];
            if (typeof fieldResolve !== "function" && typeof fieldResolve !== "object") {
              throw new Error(`Resolver ${typeName}.${fieldName} must be object or function`);
            }
          }
        }
      }
    }
  }
  schema2 = updateResolversInPlace ? addResolversToExistingSchema(schema2, resolvers2, defaultFieldResolver3) : createNewSchemaWithResolvers(schema2, resolvers2, defaultFieldResolver3);
  if (requireResolversForResolveType && requireResolversForResolveType !== "ignore") {
    checkForResolveTypeResolver(schema2, requireResolversForResolveType);
  }
  return schema2;
}
__name(addResolversToSchema, "addResolversToSchema");
function addResolversToExistingSchema(schema2, resolvers2, defaultFieldResolver3) {
  const typeMap = schema2.getTypeMap();
  for (const typeName in resolvers2) {
    const type = schema2.getType(typeName);
    const resolverValue = resolvers2[typeName];
    if (isScalarType(type)) {
      for (const fieldName in resolverValue) {
        if (fieldName.startsWith("__")) {
          type[fieldName.substring(2)] = resolverValue[fieldName];
        } else if (fieldName === "astNode" && type.astNode != null) {
          type.astNode = {
            ...type.astNode,
            description: resolverValue?.astNode?.description ?? type.astNode.description,
            directives: (type.astNode.directives ?? []).concat(resolverValue?.astNode?.directives ?? [])
          };
        } else if (fieldName === "extensionASTNodes" && type.extensionASTNodes != null) {
          type.extensionASTNodes = type.extensionASTNodes.concat(resolverValue?.extensionASTNodes ?? []);
        } else if (fieldName === "extensions" && type.extensions != null && resolverValue.extensions != null) {
          type.extensions = Object.assign(/* @__PURE__ */ Object.create(null), type.extensions, resolverValue.extensions);
        } else {
          type[fieldName] = resolverValue[fieldName];
        }
      }
    } else if (isEnumType(type)) {
      const config = type.toConfig();
      const enumValueConfigMap = config.values;
      for (const fieldName in resolverValue) {
        if (fieldName.startsWith("__")) {
          config[fieldName.substring(2)] = resolverValue[fieldName];
        } else if (fieldName === "astNode" && config.astNode != null) {
          config.astNode = {
            ...config.astNode,
            description: resolverValue?.astNode?.description ?? config.astNode.description,
            directives: (config.astNode.directives ?? []).concat(resolverValue?.astNode?.directives ?? [])
          };
        } else if (fieldName === "extensionASTNodes" && config.extensionASTNodes != null) {
          config.extensionASTNodes = config.extensionASTNodes.concat(resolverValue?.extensionASTNodes ?? []);
        } else if (fieldName === "extensions" && type.extensions != null && resolverValue.extensions != null) {
          type.extensions = Object.assign(/* @__PURE__ */ Object.create(null), type.extensions, resolverValue.extensions);
        } else if (enumValueConfigMap[fieldName]) {
          enumValueConfigMap[fieldName].value = resolverValue[fieldName];
        }
      }
      typeMap[typeName] = new GraphQLEnumType(config);
    } else if (isUnionType(type)) {
      for (const fieldName in resolverValue) {
        if (fieldName.startsWith("__")) {
          type[fieldName.substring(2)] = resolverValue[fieldName];
        }
      }
    } else if (isObjectType(type) || isInterfaceType(type)) {
      for (const fieldName in resolverValue) {
        if (fieldName.startsWith("__")) {
          type[fieldName.substring(2)] = resolverValue[fieldName];
          continue;
        }
        const fields = type.getFields();
        const field = fields[fieldName];
        if (field != null) {
          const fieldResolve = resolverValue[fieldName];
          if (typeof fieldResolve === "function") {
            field.resolve = fieldResolve.bind(resolverValue);
          } else {
            setFieldProperties(field, fieldResolve);
          }
        }
      }
    }
  }
  forEachDefaultValue(schema2, serializeInputValue);
  healSchema(schema2);
  forEachDefaultValue(schema2, parseInputValue);
  if (defaultFieldResolver3 != null) {
    forEachField(schema2, (field) => {
      if (!field.resolve) {
        field.resolve = defaultFieldResolver3;
      }
    });
  }
  return schema2;
}
__name(addResolversToExistingSchema, "addResolversToExistingSchema");
function createNewSchemaWithResolvers(schema2, resolvers2, defaultFieldResolver3) {
  schema2 = mapSchema(schema2, {
    [MapperKind.SCALAR_TYPE]: (type) => {
      const config = type.toConfig();
      const resolverValue = resolvers2[type.name];
      if (!isSpecifiedScalarType(type) && resolverValue != null) {
        for (const fieldName in resolverValue) {
          if (fieldName.startsWith("__")) {
            config[fieldName.substring(2)] = resolverValue[fieldName];
          } else if (fieldName === "astNode" && config.astNode != null) {
            config.astNode = {
              ...config.astNode,
              description: resolverValue?.astNode?.description ?? config.astNode.description,
              directives: (config.astNode.directives ?? []).concat(resolverValue?.astNode?.directives ?? [])
            };
          } else if (fieldName === "extensionASTNodes" && config.extensionASTNodes != null) {
            config.extensionASTNodes = config.extensionASTNodes.concat(resolverValue?.extensionASTNodes ?? []);
          } else if (fieldName === "extensions" && config.extensions != null && resolverValue.extensions != null) {
            config.extensions = Object.assign(/* @__PURE__ */ Object.create(null), type.extensions, resolverValue.extensions);
          } else {
            config[fieldName] = resolverValue[fieldName];
          }
        }
        return new GraphQLScalarType(config);
      }
    },
    [MapperKind.ENUM_TYPE]: (type) => {
      const resolverValue = resolvers2[type.name];
      const config = type.toConfig();
      const enumValueConfigMap = config.values;
      if (resolverValue != null) {
        for (const fieldName in resolverValue) {
          if (fieldName.startsWith("__")) {
            config[fieldName.substring(2)] = resolverValue[fieldName];
          } else if (fieldName === "astNode" && config.astNode != null) {
            config.astNode = {
              ...config.astNode,
              description: resolverValue?.astNode?.description ?? config.astNode.description,
              directives: (config.astNode.directives ?? []).concat(resolverValue?.astNode?.directives ?? [])
            };
          } else if (fieldName === "extensionASTNodes" && config.extensionASTNodes != null) {
            config.extensionASTNodes = config.extensionASTNodes.concat(resolverValue?.extensionASTNodes ?? []);
          } else if (fieldName === "extensions" && config.extensions != null && resolverValue.extensions != null) {
            config.extensions = Object.assign(/* @__PURE__ */ Object.create(null), type.extensions, resolverValue.extensions);
          } else if (enumValueConfigMap[fieldName]) {
            enumValueConfigMap[fieldName].value = resolverValue[fieldName];
          }
        }
        return new GraphQLEnumType(config);
      }
    },
    [MapperKind.UNION_TYPE]: (type) => {
      const resolverValue = resolvers2[type.name];
      if (resolverValue != null) {
        const config = type.toConfig();
        if (resolverValue["__resolveType"]) {
          config.resolveType = resolverValue["__resolveType"];
        }
        return new GraphQLUnionType(config);
      }
    },
    [MapperKind.OBJECT_TYPE]: (type) => {
      const resolverValue = resolvers2[type.name];
      if (resolverValue != null) {
        const config = type.toConfig();
        if (resolverValue["__isTypeOf"]) {
          config.isTypeOf = resolverValue["__isTypeOf"];
        }
        return new GraphQLObjectType(config);
      }
    },
    [MapperKind.INTERFACE_TYPE]: (type) => {
      const resolverValue = resolvers2[type.name];
      if (resolverValue != null) {
        const config = type.toConfig();
        if (resolverValue["__resolveType"]) {
          config.resolveType = resolverValue["__resolveType"];
        }
        return new GraphQLInterfaceType(config);
      }
    },
    [MapperKind.COMPOSITE_FIELD]: (fieldConfig, fieldName, typeName) => {
      const resolverValue = resolvers2[typeName];
      if (resolverValue != null) {
        const fieldResolve = resolverValue[fieldName];
        if (fieldResolve != null) {
          const newFieldConfig = { ...fieldConfig };
          if (typeof fieldResolve === "function") {
            newFieldConfig.resolve = fieldResolve.bind(resolverValue);
          } else {
            setFieldProperties(newFieldConfig, fieldResolve);
          }
          return newFieldConfig;
        }
      }
    }
  });
  if (defaultFieldResolver3 != null) {
    schema2 = mapSchema(schema2, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => ({
        ...fieldConfig,
        resolve: fieldConfig.resolve != null ? fieldConfig.resolve : defaultFieldResolver3
      })
    });
  }
  return schema2;
}
__name(createNewSchemaWithResolvers, "createNewSchemaWithResolvers");
function setFieldProperties(field, propertiesObj) {
  for (const propertyName in propertiesObj) {
    field[propertyName] = propertiesObj[propertyName];
  }
}
__name(setFieldProperties, "setFieldProperties");

// node_modules/@graphql-tools/schema/esm/makeExecutableSchema.js
init_modules_watch_stub();

// node_modules/@graphql-tools/merge/esm/merge-resolvers.js
init_modules_watch_stub();
function mergeResolvers(resolversDefinitions, options) {
  if (!resolversDefinitions || Array.isArray(resolversDefinitions) && resolversDefinitions.length === 0) {
    return {};
  }
  if (!Array.isArray(resolversDefinitions)) {
    return resolversDefinitions;
  }
  if (resolversDefinitions.length === 1) {
    return resolversDefinitions[0] || {};
  }
  const resolvers2 = new Array();
  for (let resolversDefinition of resolversDefinitions) {
    if (Array.isArray(resolversDefinition)) {
      resolversDefinition = mergeResolvers(resolversDefinition);
    }
    if (typeof resolversDefinition === "object" && resolversDefinition) {
      resolvers2.push(resolversDefinition);
    }
  }
  const result = mergeDeep(resolvers2, true);
  if (options?.exclusions) {
    for (const exclusion of options.exclusions) {
      const [typeName, fieldName] = exclusion.split(".");
      if (["__proto__", "constructor", "prototype"].includes(typeName) || ["__proto__", "constructor", "prototype"].includes(fieldName)) {
        continue;
      }
      if (!fieldName || fieldName === "*") {
        delete result[typeName];
      } else if (result[typeName]) {
        delete result[typeName][fieldName];
      }
    }
  }
  return result;
}
__name(mergeResolvers, "mergeResolvers");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/arguments.js
init_modules_watch_stub();
function mergeArguments(args1, args2, config) {
  const result = deduplicateArguments([...args2, ...args1].filter(isSome), config);
  if (config && config.sort) {
    result.sort(compareNodes);
  }
  return result;
}
__name(mergeArguments, "mergeArguments");
function deduplicateArguments(args, config) {
  return args.reduce((acc, current) => {
    const dupIndex = acc.findIndex((arg) => arg.name.value === current.name.value);
    if (dupIndex === -1) {
      return acc.concat([current]);
    } else if (!config?.reverseArguments) {
      acc[dupIndex] = current;
    }
    return acc;
  }, []);
}
__name(deduplicateArguments, "deduplicateArguments");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js
init_modules_watch_stub();
function isRepeatableDirective(directive, directives, repeatableLinkImports) {
  return !!(directives?.[directive.name.value]?.repeatable ?? repeatableLinkImports?.has(directive.name.value));
}
__name(isRepeatableDirective, "isRepeatableDirective");
function nameAlreadyExists(name, namesArr) {
  return namesArr.some(({ value }) => value === name.value);
}
__name(nameAlreadyExists, "nameAlreadyExists");
function mergeArguments2(a1, a2) {
  const result = [];
  for (const argument of [...a2, ...a1]) {
    const existingIndex = result.findIndex((a) => a.name.value === argument.name.value);
    if (existingIndex === -1) {
      result.push(argument);
    } else {
      const existingArg = result[existingIndex];
      if (existingArg.value.kind === "ListValue") {
        const source = existingArg.value.values;
        const target = argument.value.values;
        existingArg.value = {
          ...existingArg.value,
          values: deduplicateLists(source, target, (targetVal, source2) => {
            const value = targetVal.value;
            return !value || !source2.some((sourceVal) => sourceVal.value === value);
          })
        };
      } else {
        existingArg.value = argument.value;
      }
    }
  }
  return result;
}
__name(mergeArguments2, "mergeArguments");
var matchValues = /* @__PURE__ */ __name((a, b) => {
  if (a.kind === b.kind) {
    switch (a.kind) {
      case Kind.LIST:
        return a.values.length === b.values.length && a.values.every((aVal) => b.values.find((bVal) => matchValues(aVal, bVal)));
      case Kind.VARIABLE:
      case Kind.NULL:
        return true;
      case Kind.OBJECT:
        return a.fields.length === b.fields.length && a.fields.every((aField) => b.fields.find((bField) => aField.name.value === bField.name.value && matchValues(aField.value, bField.value)));
      default:
        return a.value === b.value;
    }
  }
  return false;
}, "matchValues");
var matchArguments = /* @__PURE__ */ __name((a, b) => a.name.value === b.name.value && a.value.kind === b.value.kind && matchValues(a.value, b.value), "matchArguments");
var matchDirectives = /* @__PURE__ */ __name((a, b) => {
  const matched = a.name.value === b.name.value && (a.arguments === b.arguments || a.arguments?.length === b.arguments?.length && a.arguments?.every((argA) => b.arguments?.find((argB) => matchArguments(argA, argB))));
  return !!matched;
}, "matchDirectives");
function mergeDirectives(d1 = [], d2 = [], config, directives) {
  const reverseOrder = config && config.reverseDirectives;
  const asNext = reverseOrder ? d1 : d2;
  const asFirst = reverseOrder ? d2 : d1;
  const result = [];
  for (const directive of [...asNext, ...asFirst]) {
    if (isRepeatableDirective(directive, directives, config?.repeatableLinkImports)) {
      const exactDuplicate = result.find((d) => matchDirectives(directive, d));
      if (!exactDuplicate) {
        result.push(directive);
      }
    } else {
      const firstAt = result.findIndex((d) => d.name.value === directive.name.value);
      if (firstAt === -1) {
        result.push(directive);
      } else {
        const mergedArguments = mergeArguments2(directive.arguments ?? [], result[firstAt].arguments ?? []);
        result[firstAt] = {
          ...result[firstAt],
          arguments: mergedArguments.length === 0 ? void 0 : mergedArguments
        };
      }
    }
  }
  return result;
}
__name(mergeDirectives, "mergeDirectives");
function mergeDirective(node, existingNode) {
  if (existingNode) {
    return {
      ...node,
      arguments: deduplicateLists(existingNode.arguments || [], node.arguments || [], (arg, existingArgs) => !nameAlreadyExists(arg.name, existingArgs.map((a) => a.name))),
      locations: [
        ...existingNode.locations,
        ...node.locations.filter((name) => !nameAlreadyExists(name, existingNode.locations))
      ]
    };
  }
  return node;
}
__name(mergeDirective, "mergeDirective");
function deduplicateLists(source, target, filterFn) {
  return source.concat(target.filter((val) => filterFn(val, source)));
}
__name(deduplicateLists, "deduplicateLists");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum-values.js
init_modules_watch_stub();
function mergeEnumValues(first2, second, config, directives) {
  if (config?.consistentEnumMerge) {
    const reversed = [];
    if (first2) {
      reversed.push(...first2);
    }
    first2 = second;
    second = reversed;
  }
  const enumValueMap = /* @__PURE__ */ new Map();
  if (first2) {
    for (const firstValue of first2) {
      enumValueMap.set(firstValue.name.value, firstValue);
    }
  }
  if (second) {
    for (const secondValue of second) {
      const enumValue = secondValue.name.value;
      if (enumValueMap.has(enumValue)) {
        const firstValue = enumValueMap.get(enumValue);
        firstValue.description = secondValue.description || firstValue.description;
        firstValue.directives = mergeDirectives(secondValue.directives, firstValue.directives, directives);
      } else {
        enumValueMap.set(enumValue, secondValue);
      }
    }
  }
  const result = [...enumValueMap.values()];
  if (config && config.sort) {
    result.sort(compareNodes);
  }
  return result;
}
__name(mergeEnumValues, "mergeEnumValues");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum.js
init_modules_watch_stub();
function mergeEnum(e1, e2, config, directives) {
  if (e2) {
    return {
      name: e1.name,
      description: e1["description"] || e2["description"],
      kind: config?.convertExtensions || e1.kind === "EnumTypeDefinition" || e2.kind === "EnumTypeDefinition" ? "EnumTypeDefinition" : "EnumTypeExtension",
      loc: e1.loc,
      directives: mergeDirectives(e1.directives, e2.directives, config, directives),
      values: mergeEnumValues(e1.values, e2.values, config)
    };
  }
  return config?.convertExtensions ? {
    ...e1,
    kind: Kind.ENUM_TYPE_DEFINITION
  } : e1;
}
__name(mergeEnum, "mergeEnum");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js
init_modules_watch_stub();

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/utils.js
init_modules_watch_stub();
function isStringTypes(types) {
  return typeof types === "string";
}
__name(isStringTypes, "isStringTypes");
function isSourceTypes(types) {
  return types instanceof Source;
}
__name(isSourceTypes, "isSourceTypes");
function extractType(type) {
  let visitedType = type;
  while (visitedType.kind === Kind.LIST_TYPE || visitedType.kind === "NonNullType") {
    visitedType = visitedType.type;
  }
  return visitedType;
}
__name(extractType, "extractType");
function isWrappingTypeNode(type) {
  return type.kind !== Kind.NAMED_TYPE;
}
__name(isWrappingTypeNode, "isWrappingTypeNode");
function isListTypeNode(type) {
  return type.kind === Kind.LIST_TYPE;
}
__name(isListTypeNode, "isListTypeNode");
function isNonNullTypeNode(type) {
  return type.kind === Kind.NON_NULL_TYPE;
}
__name(isNonNullTypeNode, "isNonNullTypeNode");
function printTypeNode(type) {
  if (isListTypeNode(type)) {
    return `[${printTypeNode(type.type)}]`;
  }
  if (isNonNullTypeNode(type)) {
    return `${printTypeNode(type.type)}!`;
  }
  return type.name.value;
}
__name(printTypeNode, "printTypeNode");
var CompareVal;
(function(CompareVal2) {
  CompareVal2[CompareVal2["A_SMALLER_THAN_B"] = -1] = "A_SMALLER_THAN_B";
  CompareVal2[CompareVal2["A_EQUALS_B"] = 0] = "A_EQUALS_B";
  CompareVal2[CompareVal2["A_GREATER_THAN_B"] = 1] = "A_GREATER_THAN_B";
})(CompareVal || (CompareVal = {}));
function defaultStringComparator(a, b) {
  if (a == null && b == null) {
    return CompareVal.A_EQUALS_B;
  }
  if (a == null) {
    return CompareVal.A_SMALLER_THAN_B;
  }
  if (b == null) {
    return CompareVal.A_GREATER_THAN_B;
  }
  if (a < b)
    return CompareVal.A_SMALLER_THAN_B;
  if (a > b)
    return CompareVal.A_GREATER_THAN_B;
  return CompareVal.A_EQUALS_B;
}
__name(defaultStringComparator, "defaultStringComparator");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js
function fieldAlreadyExists(fieldsArr, otherField) {
  const resultIndex = fieldsArr.findIndex((field) => field.name.value === otherField.name.value);
  return [resultIndex > -1 ? fieldsArr[resultIndex] : null, resultIndex];
}
__name(fieldAlreadyExists, "fieldAlreadyExists");
function mergeFields(type, f1, f2, config, directives) {
  const result = [];
  if (f2 != null) {
    result.push(...f2);
  }
  if (f1 != null) {
    for (const field of f1) {
      const [existing, existingIndex] = fieldAlreadyExists(result, field);
      if (existing && !config?.ignoreFieldConflicts) {
        const newField = config?.onFieldTypeConflict && config.onFieldTypeConflict(existing, field, type, config?.throwOnConflict) || preventConflicts(type, existing, field, config?.throwOnConflict);
        newField.arguments = mergeArguments(field["arguments"] || [], existing["arguments"] || [], config);
        newField.directives = mergeDirectives(field.directives, existing.directives, config, directives);
        newField.description = field.description || existing.description;
        result[existingIndex] = newField;
      } else {
        result.push(field);
      }
    }
  }
  if (config && config.sort) {
    result.sort(compareNodes);
  }
  if (config && config.exclusions) {
    const exclusions = config.exclusions;
    return result.filter((field) => !exclusions.includes(`${type.name.value}.${field.name.value}`));
  }
  return result;
}
__name(mergeFields, "mergeFields");
function preventConflicts(type, a, b, ignoreNullability = false) {
  const aType = printTypeNode(a.type);
  const bType = printTypeNode(b.type);
  if (aType !== bType) {
    const t1 = extractType(a.type);
    const t2 = extractType(b.type);
    if (t1.name.value !== t2.name.value) {
      throw new Error(`Field "${b.name.value}" already defined with a different type. Declared as "${t1.name.value}", but you tried to override with "${t2.name.value}"`);
    }
    if (!safeChangeForFieldType(a.type, b.type, !ignoreNullability)) {
      throw new Error(`Field '${type.name.value}.${a.name.value}' changed type from '${aType}' to '${bType}'`);
    }
  }
  if (isNonNullTypeNode(b.type) && !isNonNullTypeNode(a.type)) {
    a.type = b.type;
  }
  return a;
}
__name(preventConflicts, "preventConflicts");
function safeChangeForFieldType(oldType, newType, ignoreNullability = false) {
  if (!isWrappingTypeNode(oldType) && !isWrappingTypeNode(newType)) {
    return oldType.toString() === newType.toString();
  }
  if (isNonNullTypeNode(newType)) {
    const ofType = isNonNullTypeNode(oldType) ? oldType.type : oldType;
    return safeChangeForFieldType(ofType, newType.type);
  }
  if (isNonNullTypeNode(oldType)) {
    return safeChangeForFieldType(newType, oldType, ignoreNullability);
  }
  if (isListTypeNode(oldType)) {
    return isListTypeNode(newType) && safeChangeForFieldType(oldType.type, newType.type) || isNonNullTypeNode(newType) && safeChangeForFieldType(oldType, newType["type"]);
  }
  return false;
}
__name(safeChangeForFieldType, "safeChangeForFieldType");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/input-type.js
init_modules_watch_stub();
function mergeInputType(node, existingNode, config, directives) {
  if (existingNode) {
    try {
      return {
        name: node.name,
        description: node["description"] || existingNode["description"],
        kind: config?.convertExtensions || node.kind === "InputObjectTypeDefinition" || existingNode.kind === "InputObjectTypeDefinition" ? "InputObjectTypeDefinition" : "InputObjectTypeExtension",
        loc: node.loc,
        fields: mergeFields(node, node.fields, existingNode.fields, config),
        directives: mergeDirectives(node.directives, existingNode.directives, config, directives)
      };
    } catch (e) {
      throw new Error(`Unable to merge GraphQL input type "${node.name.value}": ${e.message}`);
    }
  }
  return config?.convertExtensions ? {
    ...node,
    kind: Kind.INPUT_OBJECT_TYPE_DEFINITION
  } : node;
}
__name(mergeInputType, "mergeInputType");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/interface.js
init_modules_watch_stub();

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-named-type-array.js
init_modules_watch_stub();
function alreadyExists(arr, other) {
  return !!arr.find((i) => i.name.value === other.name.value);
}
__name(alreadyExists, "alreadyExists");
function mergeNamedTypeArray(first2 = [], second = [], config = {}) {
  const result = [...second, ...first2.filter((d) => !alreadyExists(second, d))];
  if (config && config.sort) {
    result.sort(compareNodes);
  }
  return result;
}
__name(mergeNamedTypeArray, "mergeNamedTypeArray");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/interface.js
function mergeInterface(node, existingNode, config, directives) {
  if (existingNode) {
    try {
      return {
        name: node.name,
        description: node["description"] || existingNode["description"],
        kind: config?.convertExtensions || node.kind === "InterfaceTypeDefinition" || existingNode.kind === "InterfaceTypeDefinition" ? "InterfaceTypeDefinition" : "InterfaceTypeExtension",
        loc: node.loc,
        fields: mergeFields(node, node.fields, existingNode.fields, config, directives),
        directives: mergeDirectives(node.directives, existingNode.directives, config, directives),
        interfaces: node["interfaces"] ? mergeNamedTypeArray(node["interfaces"], existingNode["interfaces"], config) : void 0
      };
    } catch (e) {
      throw new Error(`Unable to merge GraphQL interface "${node.name.value}": ${e.message}`);
    }
  }
  return config?.convertExtensions ? {
    ...node,
    kind: Kind.INTERFACE_TYPE_DEFINITION
  } : node;
}
__name(mergeInterface, "mergeInterface");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-nodes.js
init_modules_watch_stub();

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/scalar.js
init_modules_watch_stub();
function mergeScalar(node, existingNode, config, directives) {
  if (existingNode) {
    return {
      name: node.name,
      description: node["description"] || existingNode["description"],
      kind: config?.convertExtensions || node.kind === "ScalarTypeDefinition" || existingNode.kind === "ScalarTypeDefinition" ? "ScalarTypeDefinition" : "ScalarTypeExtension",
      loc: node.loc,
      directives: mergeDirectives(node.directives, existingNode.directives, config, directives)
    };
  }
  return config?.convertExtensions ? {
    ...node,
    kind: Kind.SCALAR_TYPE_DEFINITION
  } : node;
}
__name(mergeScalar, "mergeScalar");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/schema-def.js
init_modules_watch_stub();
var DEFAULT_OPERATION_TYPE_NAME_MAP = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
function mergeOperationTypes(opNodeList = [], existingOpNodeList = []) {
  const finalOpNodeList = [];
  for (const opNodeType in DEFAULT_OPERATION_TYPE_NAME_MAP) {
    const opNode = opNodeList.find((n) => n.operation === opNodeType) || existingOpNodeList.find((n) => n.operation === opNodeType);
    if (opNode) {
      finalOpNodeList.push(opNode);
    }
  }
  return finalOpNodeList;
}
__name(mergeOperationTypes, "mergeOperationTypes");
function mergeSchemaDefs(node, existingNode, config, directives) {
  if (existingNode) {
    return {
      kind: node.kind === Kind.SCHEMA_DEFINITION || existingNode.kind === Kind.SCHEMA_DEFINITION ? Kind.SCHEMA_DEFINITION : Kind.SCHEMA_EXTENSION,
      description: node["description"] || existingNode["description"],
      directives: mergeDirectives(node.directives, existingNode.directives, config, directives),
      operationTypes: mergeOperationTypes(node.operationTypes, existingNode.operationTypes)
    };
  }
  return config?.convertExtensions ? {
    ...node,
    kind: Kind.SCHEMA_DEFINITION
  } : node;
}
__name(mergeSchemaDefs, "mergeSchemaDefs");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/type.js
init_modules_watch_stub();
function mergeType(node, existingNode, config, directives) {
  if (existingNode) {
    try {
      return {
        name: node.name,
        description: node["description"] || existingNode["description"],
        kind: config?.convertExtensions || node.kind === "ObjectTypeDefinition" || existingNode.kind === "ObjectTypeDefinition" ? "ObjectTypeDefinition" : "ObjectTypeExtension",
        loc: node.loc,
        fields: mergeFields(node, node.fields, existingNode.fields, config, directives),
        directives: mergeDirectives(node.directives, existingNode.directives, config, directives),
        interfaces: mergeNamedTypeArray(node.interfaces, existingNode.interfaces, config)
      };
    } catch (e) {
      throw new Error(`Unable to merge GraphQL type "${node.name.value}": ${e.message}`);
    }
  }
  return config?.convertExtensions ? {
    ...node,
    kind: Kind.OBJECT_TYPE_DEFINITION
  } : node;
}
__name(mergeType, "mergeType");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/union.js
init_modules_watch_stub();
function mergeUnion(first2, second, config, directives) {
  if (second) {
    return {
      name: first2.name,
      description: first2["description"] || second["description"],
      // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
      directives: mergeDirectives(first2.directives, second.directives, config, directives),
      kind: config?.convertExtensions || first2.kind === "UnionTypeDefinition" || second.kind === "UnionTypeDefinition" ? Kind.UNION_TYPE_DEFINITION : Kind.UNION_TYPE_EXTENSION,
      loc: first2.loc,
      types: mergeNamedTypeArray(first2.types, second.types, config)
    };
  }
  return config?.convertExtensions ? {
    ...first2,
    kind: Kind.UNION_TYPE_DEFINITION
  } : first2;
}
__name(mergeUnion, "mergeUnion");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-nodes.js
var schemaDefSymbol = "SCHEMA_DEF_SYMBOL";
function isNamedDefinitionNode(definitionNode) {
  return "name" in definitionNode;
}
__name(isNamedDefinitionNode, "isNamedDefinitionNode");
function mergeGraphQLNodes(nodes, config, directives = {}) {
  const mergedResultMap = directives;
  for (const nodeDefinition of nodes) {
    if (isNamedDefinitionNode(nodeDefinition)) {
      const name = nodeDefinition.name?.value;
      if (config?.commentDescriptions) {
        collectComment(nodeDefinition);
      }
      if (name == null) {
        continue;
      }
      if (config?.exclusions?.includes(name + ".*") || config?.exclusions?.includes(name)) {
        delete mergedResultMap[name];
      } else {
        switch (nodeDefinition.kind) {
          case Kind.OBJECT_TYPE_DEFINITION:
          case Kind.OBJECT_TYPE_EXTENSION:
            mergedResultMap[name] = mergeType(nodeDefinition, mergedResultMap[name], config, directives);
            break;
          case Kind.ENUM_TYPE_DEFINITION:
          case Kind.ENUM_TYPE_EXTENSION:
            mergedResultMap[name] = mergeEnum(nodeDefinition, mergedResultMap[name], config, directives);
            break;
          case Kind.UNION_TYPE_DEFINITION:
          case Kind.UNION_TYPE_EXTENSION:
            mergedResultMap[name] = mergeUnion(nodeDefinition, mergedResultMap[name], config, directives);
            break;
          case Kind.SCALAR_TYPE_DEFINITION:
          case Kind.SCALAR_TYPE_EXTENSION:
            mergedResultMap[name] = mergeScalar(nodeDefinition, mergedResultMap[name], config, directives);
            break;
          case Kind.INPUT_OBJECT_TYPE_DEFINITION:
          case Kind.INPUT_OBJECT_TYPE_EXTENSION:
            mergedResultMap[name] = mergeInputType(nodeDefinition, mergedResultMap[name], config, directives);
            break;
          case Kind.INTERFACE_TYPE_DEFINITION:
          case Kind.INTERFACE_TYPE_EXTENSION:
            mergedResultMap[name] = mergeInterface(nodeDefinition, mergedResultMap[name], config, directives);
            break;
          case Kind.DIRECTIVE_DEFINITION:
            if (mergedResultMap[name]) {
              const isInheritedFromPrototype = name in {};
              if (isInheritedFromPrototype) {
                if (!isASTNode(mergedResultMap[name])) {
                  mergedResultMap[name] = void 0;
                }
              }
            }
            mergedResultMap[name] = mergeDirective(nodeDefinition, mergedResultMap[name]);
            break;
        }
      }
    } else if (nodeDefinition.kind === Kind.SCHEMA_DEFINITION || nodeDefinition.kind === Kind.SCHEMA_EXTENSION) {
      mergedResultMap[schemaDefSymbol] = mergeSchemaDefs(nodeDefinition, mergedResultMap[schemaDefSymbol], config);
    }
  }
  return mergedResultMap;
}
__name(mergeGraphQLNodes, "mergeGraphQLNodes");
function isASTNode(node) {
  return node != null && typeof node === "object" && "kind" in node && typeof node.kind === "string";
}
__name(isASTNode, "isASTNode");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-typedefs.js
init_modules_watch_stub();

// node_modules/@graphql-tools/merge/esm/links.js
init_modules_watch_stub();
function namespace(link) {
  return link.as ?? link.url.name;
}
__name(namespace, "namespace");
function defaultImport(link) {
  const name = namespace(link);
  return name && `@${name}`;
}
__name(defaultImport, "defaultImport");
function resolveImportName(link, elementName) {
  if (link.url.name && elementName === `@${link.url.name}`) {
    return defaultImport(link).substring(1);
  }
  const imported = link.imports.find((i) => i.name === elementName);
  const resolvedName = imported?.as ?? imported?.name ?? namespaced(namespace(link), elementName);
  return resolvedName.startsWith("@") ? resolvedName.substring(1) : resolvedName;
}
__name(resolveImportName, "resolveImportName");
function namespaced(namespace2, name) {
  if (namespace2?.length) {
    if (name.startsWith("@")) {
      return `@${namespace2}__${name.substring(1)}`;
    }
    return `${namespace2}__${name}`;
  }
  return name;
}
__name(namespaced, "namespaced");
function extractLinks(typeDefs2) {
  let links = [];
  for (const definition of typeDefs2.definitions) {
    if (definition.kind === Kind.SCHEMA_EXTENSION || definition.kind === Kind.SCHEMA_DEFINITION) {
      const defLinks = definition.directives?.filter((directive) => directive.name.value === "link");
      const parsedLinks = defLinks?.map((l) => linkFromArgs(l.arguments ?? [])).filter((l) => l !== void 0) ?? [];
      links = links.concat(parsedLinks);
      const defCores = definition.directives?.filter(({ name }) => name.value === "core");
      const coreLinks = defCores?.map((c) => linkFromCoreArgs(c.arguments ?? [])).filter((l) => l !== void 0);
      if (coreLinks) {
        links = links.concat(...coreLinks);
      }
    }
  }
  return links;
}
__name(extractLinks, "extractLinks");
function linkFromArgs(args) {
  let url;
  let imports = [];
  let as;
  for (const arg of args) {
    switch (arg.name.value) {
      case "url": {
        if (arg.value.kind === Kind.STRING) {
          url = parseFederationLinkUrl(arg.value.value);
        }
        break;
      }
      case "import": {
        imports = parseImportNode(arg.value);
        break;
      }
      case "as": {
        if (arg.value.kind === Kind.STRING) {
          as = arg.value.value ?? void 0;
        }
        break;
      }
      default: {
      }
    }
  }
  if (url !== void 0) {
    return {
      url,
      as,
      imports
    };
  }
}
__name(linkFromArgs, "linkFromArgs");
function linkFromCoreArgs(args) {
  const feature = args.find(({ name, value }) => name.value === "feature" && value.kind === Kind.STRING);
  if (feature) {
    const url = parseFederationLinkUrl(feature.value.value);
    return {
      url,
      imports: []
    };
  }
}
__name(linkFromCoreArgs, "linkFromCoreArgs");
function parseImportNode(node) {
  if (node.kind === Kind.LIST) {
    const imports = node.values.map((v) => {
      let namedImport;
      if (v.kind === Kind.STRING) {
        namedImport = { name: v.value };
      } else if (v.kind === Kind.OBJECT) {
        let name = "";
        let as;
        for (const f of v.fields) {
          if (f.name.value === "name") {
            if (f.value.kind === Kind.STRING) {
              name = f.value.value;
            }
          } else if (f.name.value === "as") {
            if (f.value.kind === Kind.STRING) {
              as = f.value.value;
            }
          }
        }
        namedImport = { name, as };
      }
      return namedImport;
    });
    return imports.filter((i) => i !== void 0);
  }
  return [];
}
__name(parseImportNode, "parseImportNode");
var VERSION_MATCH = /v(\d{1,3})\.(\d{1,4})/i;
function parseFederationLinkUrl(urlSource) {
  const url = new URL(urlSource);
  const parts = url.pathname.split("/").filter(Boolean);
  const versionOrName = parts[parts.length - 1];
  if (versionOrName) {
    if (VERSION_MATCH.test(versionOrName)) {
      const maybeName = parts[parts.length - 2];
      return {
        identity: url.origin + (maybeName ? `/${parts.slice(0, parts.length - 1).join("/")}` : ""),
        name: maybeName ?? null,
        version: versionOrName
      };
    }
    return {
      identity: `${url.origin}/${parts.join("/")}`,
      name: versionOrName,
      version: null
    };
  }
  return {
    identity: url.origin,
    name: null,
    version: null
  };
}
__name(parseFederationLinkUrl, "parseFederationLinkUrl");

// node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-typedefs.js
function mergeTypeDefs(typeSource, config) {
  resetComments();
  const doc = {
    kind: Kind.DOCUMENT,
    definitions: mergeGraphQLTypes(typeSource, {
      useSchemaDefinition: true,
      forceSchemaDefinition: false,
      throwOnConflict: false,
      commentDescriptions: false,
      ...config
    })
  };
  let result;
  if (config?.commentDescriptions) {
    result = printWithComments(doc);
  } else {
    result = doc;
  }
  resetComments();
  return result;
}
__name(mergeTypeDefs, "mergeTypeDefs");
function visitTypeSources(typeSource, options, allDirectives = [], allNodes = [], visitedTypeSources = /* @__PURE__ */ new Set(), repeatableLinkImports = /* @__PURE__ */ new Set()) {
  const addRepeatable = /* @__PURE__ */ __name((name) => {
    repeatableLinkImports.add(name);
  }, "addRepeatable");
  if (typeSource && !visitedTypeSources.has(typeSource)) {
    visitedTypeSources.add(typeSource);
    if (typeof typeSource === "function") {
      visitTypeSources(typeSource(), options, allDirectives, allNodes, visitedTypeSources, repeatableLinkImports);
    } else if (Array.isArray(typeSource)) {
      for (const type of typeSource) {
        visitTypeSources(type, options, allDirectives, allNodes, visitedTypeSources, repeatableLinkImports);
      }
    } else if (isSchema(typeSource)) {
      const documentNode = getDocumentNodeFromSchema(typeSource, options);
      visitTypeSources(documentNode.definitions, options, allDirectives, allNodes, visitedTypeSources, repeatableLinkImports);
    } else if (isStringTypes(typeSource) || isSourceTypes(typeSource)) {
      const documentNode = parse(typeSource, options);
      visitTypeSources(documentNode.definitions, options, allDirectives, allNodes, visitedTypeSources, repeatableLinkImports);
    } else if (typeof typeSource === "object" && isDefinitionNode(typeSource)) {
      const links = extractLinks({
        definitions: [typeSource],
        kind: Kind.DOCUMENT
      });
      const federationUrl = "https://specs.apollo.dev/federation";
      const linkUrl = "https://specs.apollo.dev/link";
      const federationLink = links.find((l) => l.url.identity === federationUrl);
      if (federationLink) {
        addRepeatable(resolveImportName(federationLink, "@composeDirective"));
        addRepeatable(resolveImportName(federationLink, "@key"));
      }
      const linkLink = links.find((l) => l.url.identity === linkUrl);
      if (linkLink) {
        addRepeatable(resolveImportName(linkLink, "@link"));
      }
      if (typeSource.kind === Kind.DIRECTIVE_DEFINITION) {
        allDirectives.push(typeSource);
      } else {
        allNodes.push(typeSource);
      }
    } else if (isDocumentNode(typeSource)) {
      visitTypeSources(typeSource.definitions, options, allDirectives, allNodes, visitedTypeSources, repeatableLinkImports);
    } else {
      throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof typeSource}`);
    }
  }
  return { allDirectives, allNodes, repeatableLinkImports };
}
__name(visitTypeSources, "visitTypeSources");
function mergeGraphQLTypes(typeSource, config) {
  resetComments();
  const { allDirectives, allNodes, repeatableLinkImports } = visitTypeSources(typeSource, config);
  const mergedDirectives = mergeGraphQLNodes(allDirectives, config);
  config.repeatableLinkImports = repeatableLinkImports;
  const mergedNodes = mergeGraphQLNodes(allNodes, config, mergedDirectives);
  if (config?.useSchemaDefinition) {
    const schemaDef = mergedNodes[schemaDefSymbol] || {
      kind: Kind.SCHEMA_DEFINITION,
      operationTypes: []
    };
    const operationTypes = schemaDef.operationTypes;
    for (const opTypeDefNodeType in DEFAULT_OPERATION_TYPE_NAME_MAP) {
      const opTypeDefNode = operationTypes.find((operationType) => operationType.operation === opTypeDefNodeType);
      if (!opTypeDefNode) {
        const possibleRootTypeName = DEFAULT_OPERATION_TYPE_NAME_MAP[opTypeDefNodeType];
        const existingPossibleRootType = mergedNodes[possibleRootTypeName];
        if (existingPossibleRootType != null && existingPossibleRootType.name != null) {
          operationTypes.push({
            kind: Kind.OPERATION_TYPE_DEFINITION,
            type: {
              kind: Kind.NAMED_TYPE,
              name: existingPossibleRootType.name
            },
            operation: opTypeDefNodeType
          });
        }
      }
    }
    if (schemaDef?.operationTypes?.length != null && schemaDef.operationTypes.length > 0) {
      mergedNodes[schemaDefSymbol] = schemaDef;
    }
  }
  if (config?.forceSchemaDefinition && !mergedNodes[schemaDefSymbol]?.operationTypes?.length) {
    mergedNodes[schemaDefSymbol] = {
      kind: Kind.SCHEMA_DEFINITION,
      operationTypes: [
        {
          kind: Kind.OPERATION_TYPE_DEFINITION,
          operation: "query",
          type: {
            kind: Kind.NAMED_TYPE,
            name: {
              kind: Kind.NAME,
              value: "Query"
            }
          }
        }
      ]
    };
  }
  const mergedNodeDefinitions = Object.values(mergedNodes);
  if (config?.sort) {
    const sortFn = typeof config.sort === "function" ? config.sort : defaultStringComparator;
    mergedNodeDefinitions.sort((a, b) => sortFn(a.name?.value, b.name?.value));
  }
  return mergedNodeDefinitions;
}
__name(mergeGraphQLTypes, "mergeGraphQLTypes");

// node_modules/@graphql-tools/merge/esm/extensions.js
init_modules_watch_stub();
function applyExtensionObject(obj, extensions) {
  if (!obj || !extensions || extensions === obj.extensions) {
    return;
  }
  if (!obj.extensions) {
    obj.extensions = extensions;
    return;
  }
  obj.extensions = mergeDeep([obj.extensions, extensions], false, true);
}
__name(applyExtensionObject, "applyExtensionObject");
function applyExtensions(schema2, extensions) {
  applyExtensionObject(schema2, extensions.schemaExtensions);
  for (const [typeName, data] of Object.entries(extensions.types || {})) {
    const type = schema2.getType(typeName);
    if (type) {
      applyExtensionObject(type, data.extensions);
      if (data.type === "object" || data.type === "interface") {
        for (const [fieldName, fieldData] of Object.entries(data.fields)) {
          const field = type.getFields()[fieldName];
          if (field) {
            applyExtensionObject(field, fieldData.extensions);
            for (const [arg, argData] of Object.entries(fieldData.arguments)) {
              applyExtensionObject(field.args.find((a) => a.name === arg), argData);
            }
          }
        }
      } else if (data.type === "input") {
        for (const [fieldName, fieldData] of Object.entries(data.fields)) {
          const field = type.getFields()[fieldName];
          applyExtensionObject(field, fieldData.extensions);
        }
      } else if (data.type === "enum") {
        for (const [valueName, valueData] of Object.entries(data.values)) {
          const value = type.getValue(valueName);
          applyExtensionObject(value, valueData);
        }
      }
    }
  }
  return schema2;
}
__name(applyExtensions, "applyExtensions");

// node_modules/@graphql-tools/schema/esm/makeExecutableSchema.js
function makeExecutableSchema({ typeDefs: typeDefs2, resolvers: resolvers2 = {}, resolverValidationOptions = {}, inheritResolversFromInterfaces = false, updateResolversInPlace = false, schemaExtensions, defaultFieldResolver: defaultFieldResolver3, ...otherOptions }) {
  if (typeof resolverValidationOptions !== "object") {
    throw new Error("Expected `resolverValidationOptions` to be an object");
  }
  if (!typeDefs2) {
    throw new Error("Must provide typeDefs");
  }
  let schema2;
  if (isSchema(typeDefs2)) {
    schema2 = typeDefs2;
  } else if (otherOptions?.commentDescriptions) {
    const mergedTypeDefs = mergeTypeDefs(typeDefs2, {
      ...otherOptions,
      commentDescriptions: true
    });
    schema2 = buildSchema(mergedTypeDefs, otherOptions);
  } else {
    const mergedTypeDefs = mergeTypeDefs(typeDefs2, otherOptions);
    schema2 = buildASTSchema(mergedTypeDefs, otherOptions);
  }
  schema2 = addResolversToSchema({
    schema: schema2,
    resolvers: mergeResolvers(resolvers2),
    resolverValidationOptions,
    inheritResolversFromInterfaces,
    updateResolversInPlace,
    defaultFieldResolver: defaultFieldResolver3
  });
  if (Object.keys(resolverValidationOptions).length > 0) {
    assertResolversPresent(schema2, resolverValidationOptions);
  }
  if (schemaExtensions) {
    for (const schemaExtension of asArray(schemaExtensions)) {
      applyExtensions(schema2, schemaExtension);
    }
  }
  return schema2;
}
__name(makeExecutableSchema, "makeExecutableSchema");

// node_modules/graphql-workers-subscriptions/dist/index.js
init_modules_watch_stub();

// node_modules/graphql-ws/lib/common.mjs
init_modules_watch_stub();

// node_modules/graphql-ws/lib/utils.mjs
init_modules_watch_stub();
function extendedTypeof(val) {
  if (val === null) {
    return "null";
  }
  if (Array.isArray(val)) {
    return "array";
  }
  return typeof val;
}
__name(extendedTypeof, "extendedTypeof");
function isObject2(val) {
  return extendedTypeof(val) === "object";
}
__name(isObject2, "isObject");
function isAsyncIterable3(val) {
  return typeof Object(val)[Symbol.asyncIterator] === "function";
}
__name(isAsyncIterable3, "isAsyncIterable");
function isAsyncGenerator(val) {
  return isObject2(val) && typeof Object(val)[Symbol.asyncIterator] === "function" && typeof val.return === "function";
}
__name(isAsyncGenerator, "isAsyncGenerator");
function areGraphQLErrors(obj) {
  return Array.isArray(obj) && // must be at least one error
  obj.length > 0 && // error has at least a message
  obj.every((ob) => "message" in ob);
}
__name(areGraphQLErrors, "areGraphQLErrors");

// node_modules/graphql-ws/lib/common.mjs
var GRAPHQL_TRANSPORT_WS_PROTOCOL = "graphql-transport-ws";
var CloseCode;
(function(CloseCode2) {
  CloseCode2[CloseCode2["InternalServerError"] = 4500] = "InternalServerError";
  CloseCode2[CloseCode2["InternalClientError"] = 4005] = "InternalClientError";
  CloseCode2[CloseCode2["BadRequest"] = 4400] = "BadRequest";
  CloseCode2[CloseCode2["BadResponse"] = 4004] = "BadResponse";
  CloseCode2[CloseCode2["Unauthorized"] = 4401] = "Unauthorized";
  CloseCode2[CloseCode2["Forbidden"] = 4403] = "Forbidden";
  CloseCode2[CloseCode2["SubprotocolNotAcceptable"] = 4406] = "SubprotocolNotAcceptable";
  CloseCode2[CloseCode2["ConnectionInitialisationTimeout"] = 4408] = "ConnectionInitialisationTimeout";
  CloseCode2[CloseCode2["ConnectionAcknowledgementTimeout"] = 4504] = "ConnectionAcknowledgementTimeout";
  CloseCode2[CloseCode2["SubscriberAlreadyExists"] = 4409] = "SubscriberAlreadyExists";
  CloseCode2[CloseCode2["TooManyInitialisationRequests"] = 4429] = "TooManyInitialisationRequests";
})(CloseCode || (CloseCode = {}));
var MessageType;
(function(MessageType2) {
  MessageType2["ConnectionInit"] = "connection_init";
  MessageType2["ConnectionAck"] = "connection_ack";
  MessageType2["Ping"] = "ping";
  MessageType2["Pong"] = "pong";
  MessageType2["Subscribe"] = "subscribe";
  MessageType2["Next"] = "next";
  MessageType2["Error"] = "error";
  MessageType2["Complete"] = "complete";
})(MessageType || (MessageType = {}));
function validateMessage(val) {
  if (!isObject2(val)) {
    throw new Error(`Message is expected to be an object, but got ${extendedTypeof(val)}`);
  }
  if (!val.type) {
    throw new Error(`Message is missing the 'type' property`);
  }
  if (typeof val.type !== "string") {
    throw new Error(`Message is expects the 'type' property to be a string, but got ${extendedTypeof(val.type)}`);
  }
  switch (val.type) {
    case MessageType.ConnectionInit:
    case MessageType.ConnectionAck:
    case MessageType.Ping:
    case MessageType.Pong: {
      if (val.payload != null && !isObject2(val.payload)) {
        throw new Error(`"${val.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${val.payload}"`);
      }
      break;
    }
    case MessageType.Subscribe: {
      if (typeof val.id !== "string") {
        throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
      }
      if (!val.id) {
        throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
      }
      if (!isObject2(val.payload)) {
        throw new Error(`"${val.type}" message expects the 'payload' property to be an object, but got ${extendedTypeof(val.payload)}`);
      }
      if (typeof val.payload.query !== "string") {
        throw new Error(`"${val.type}" message payload expects the 'query' property to be a string, but got ${extendedTypeof(val.payload.query)}`);
      }
      if (val.payload.variables != null && !isObject2(val.payload.variables)) {
        throw new Error(`"${val.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${extendedTypeof(val.payload.variables)}`);
      }
      if (val.payload.operationName != null && extendedTypeof(val.payload.operationName) !== "string") {
        throw new Error(`"${val.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${extendedTypeof(val.payload.operationName)}`);
      }
      if (val.payload.extensions != null && !isObject2(val.payload.extensions)) {
        throw new Error(`"${val.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${extendedTypeof(val.payload.extensions)}`);
      }
      break;
    }
    case MessageType.Next: {
      if (typeof val.id !== "string") {
        throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
      }
      if (!val.id) {
        throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
      }
      if (!isObject2(val.payload)) {
        throw new Error(`"${val.type}" message expects the 'payload' property to be an object, but got ${extendedTypeof(val.payload)}`);
      }
      break;
    }
    case MessageType.Error: {
      if (typeof val.id !== "string") {
        throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
      }
      if (!val.id) {
        throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
      }
      if (!areGraphQLErrors(val.payload)) {
        throw new Error(`"${val.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(val.payload)}`);
      }
      break;
    }
    case MessageType.Complete: {
      if (typeof val.id !== "string") {
        throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
      }
      if (!val.id) {
        throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
      }
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${val.type}"`);
  }
  return val;
}
__name(validateMessage, "validateMessage");
function parseMessage(data, reviver) {
  return validateMessage(typeof data === "string" ? JSON.parse(data, reviver) : data);
}
__name(parseMessage, "parseMessage");
function stringifyMessage(msg, replacer) {
  validateMessage(msg);
  return JSON.stringify(msg, replacer);
}
__name(stringifyMessage, "stringifyMessage");

// node_modules/graphql-ws/lib/server.mjs
init_modules_watch_stub();
var __asyncValues = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  __name(verb, "verb");
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
  __name(settle, "settle");
};
function makeServer(options) {
  const {
    schema: schema2,
    context,
    roots,
    validate: validate2,
    execute: execute3,
    subscribe: subscribe3,
    connectionInitWaitTimeout = 3e3,
    // 3 seconds
    onConnect,
    onDisconnect,
    onClose,
    onSubscribe,
    onOperation,
    onNext,
    onError,
    onComplete,
    jsonMessageReviver: reviver,
    jsonMessageReplacer: replacer
  } = options;
  return {
    opened(socket, extra) {
      const ctx = {
        connectionInitReceived: false,
        acknowledged: false,
        subscriptions: {},
        extra
      };
      if (socket.protocol !== GRAPHQL_TRANSPORT_WS_PROTOCOL) {
        socket.close(CloseCode.SubprotocolNotAcceptable, "Subprotocol not acceptable");
        return async (code, reason) => {
          await (onClose === null || onClose === void 0 ? void 0 : onClose(ctx, code, reason));
        };
      }
      const connectionInitWait = connectionInitWaitTimeout > 0 && isFinite(connectionInitWaitTimeout) ? setTimeout(() => {
        if (!ctx.connectionInitReceived)
          socket.close(CloseCode.ConnectionInitialisationTimeout, "Connection initialisation timeout");
      }, connectionInitWaitTimeout) : null;
      socket.onMessage(/* @__PURE__ */ __name(async function onMessage(data) {
        var _a, e_1, _b, _c;
        var _d;
        let message;
        try {
          message = parseMessage(data, reviver);
        } catch (err) {
          return socket.close(CloseCode.BadRequest, "Invalid message received");
        }
        switch (message.type) {
          case MessageType.ConnectionInit: {
            if (ctx.connectionInitReceived)
              return socket.close(CloseCode.TooManyInitialisationRequests, "Too many initialisation requests");
            ctx.connectionInitReceived = true;
            if (isObject2(message.payload))
              ctx.connectionParams = message.payload;
            const permittedOrPayload = await (onConnect === null || onConnect === void 0 ? void 0 : onConnect(ctx));
            if (permittedOrPayload === false)
              return socket.close(CloseCode.Forbidden, "Forbidden");
            ctx.acknowledged = true;
            await socket.send(stringifyMessage(isObject2(permittedOrPayload) ? {
              type: MessageType.ConnectionAck,
              payload: permittedOrPayload
            } : {
              type: MessageType.ConnectionAck
              // payload is completely absent if not provided
            }, replacer));
            return;
          }
          case MessageType.Ping: {
            if (socket.onPing)
              return await socket.onPing(message.payload);
            await socket.send(stringifyMessage(message.payload ? { type: MessageType.Pong, payload: message.payload } : {
              type: MessageType.Pong
              // payload is completely absent if not provided
            }));
            return;
          }
          case MessageType.Pong:
            return await ((_d = socket.onPong) === null || _d === void 0 ? void 0 : _d.call(socket, message.payload));
          case MessageType.Subscribe: {
            if (!ctx.acknowledged)
              return socket.close(CloseCode.Unauthorized, "Unauthorized");
            const { id, payload } = message;
            if (id in ctx.subscriptions)
              return socket.close(CloseCode.SubscriberAlreadyExists, `Subscriber for ${id} already exists`);
            ctx.subscriptions[id] = null;
            const emit = {
              next: /* @__PURE__ */ __name(async (result, args) => {
                let nextMessage = {
                  id,
                  type: MessageType.Next,
                  payload: result
                };
                const maybeResult = await (onNext === null || onNext === void 0 ? void 0 : onNext(ctx, nextMessage, args, result));
                if (maybeResult)
                  nextMessage = Object.assign(Object.assign({}, nextMessage), { payload: maybeResult });
                await socket.send(stringifyMessage(nextMessage, replacer));
              }, "next"),
              error: /* @__PURE__ */ __name(async (errors) => {
                let errorMessage = {
                  id,
                  type: MessageType.Error,
                  payload: errors
                };
                const maybeErrors = await (onError === null || onError === void 0 ? void 0 : onError(ctx, errorMessage, errors));
                if (maybeErrors)
                  errorMessage = Object.assign(Object.assign({}, errorMessage), { payload: maybeErrors });
                await socket.send(stringifyMessage(errorMessage, replacer));
              }, "error"),
              complete: /* @__PURE__ */ __name(async (notifyClient) => {
                const completeMessage = {
                  id,
                  type: MessageType.Complete
                };
                await (onComplete === null || onComplete === void 0 ? void 0 : onComplete(ctx, completeMessage));
                if (notifyClient)
                  await socket.send(stringifyMessage(completeMessage, replacer));
              }, "complete")
            };
            try {
              let execArgs;
              const maybeExecArgsOrErrors = await (onSubscribe === null || onSubscribe === void 0 ? void 0 : onSubscribe(ctx, message));
              if (maybeExecArgsOrErrors) {
                if (areGraphQLErrors(maybeExecArgsOrErrors))
                  return id in ctx.subscriptions ? await emit.error(maybeExecArgsOrErrors) : void 0;
                else if (Array.isArray(maybeExecArgsOrErrors))
                  throw new Error("Invalid return value from onSubscribe hook, expected an array of GraphQLError objects");
                execArgs = maybeExecArgsOrErrors;
              } else {
                if (!schema2)
                  throw new Error("The GraphQL schema is not provided");
                const args = {
                  operationName: payload.operationName,
                  document: parse(payload.query),
                  variableValues: payload.variables
                };
                execArgs = Object.assign(Object.assign({}, args), { schema: typeof schema2 === "function" ? await schema2(ctx, message, args) : schema2 });
                const validationErrors = (validate2 !== null && validate2 !== void 0 ? validate2 : validate)(execArgs.schema, execArgs.document);
                if (validationErrors.length > 0)
                  return id in ctx.subscriptions ? await emit.error(validationErrors) : void 0;
              }
              const operationAST = getOperationAST(execArgs.document, execArgs.operationName);
              if (!operationAST)
                return id in ctx.subscriptions ? await emit.error([
                  new GraphQLError("Unable to identify operation")
                ]) : void 0;
              if (!("rootValue" in execArgs))
                execArgs.rootValue = roots === null || roots === void 0 ? void 0 : roots[operationAST.operation];
              if (!("contextValue" in execArgs))
                execArgs.contextValue = typeof context === "function" ? await context(ctx, message, execArgs) : context;
              let operationResult;
              if (operationAST.operation === "subscription")
                operationResult = await (subscribe3 !== null && subscribe3 !== void 0 ? subscribe3 : subscribe)(execArgs);
              else
                operationResult = await (execute3 !== null && execute3 !== void 0 ? execute3 : execute)(execArgs);
              const maybeResult = await (onOperation === null || onOperation === void 0 ? void 0 : onOperation(ctx, message, execArgs, operationResult));
              if (maybeResult)
                operationResult = maybeResult;
              if (isAsyncIterable3(operationResult)) {
                if (!(id in ctx.subscriptions)) {
                  if (isAsyncGenerator(operationResult))
                    operationResult.return(void 0);
                } else {
                  ctx.subscriptions[id] = operationResult;
                  try {
                    for (var _e = true, operationResult_1 = __asyncValues(operationResult), operationResult_1_1; operationResult_1_1 = await operationResult_1.next(), _a = operationResult_1_1.done, !_a; _e = true) {
                      _c = operationResult_1_1.value;
                      _e = false;
                      const result = _c;
                      await emit.next(result, execArgs);
                    }
                  } catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                  } finally {
                    try {
                      if (!_e && !_a && (_b = operationResult_1.return)) await _b.call(operationResult_1);
                    } finally {
                      if (e_1) throw e_1.error;
                    }
                  }
                }
              } else {
                if (id in ctx.subscriptions)
                  await emit.next(operationResult, execArgs);
              }
              await emit.complete(id in ctx.subscriptions);
            } finally {
              delete ctx.subscriptions[id];
            }
            return;
          }
          case MessageType.Complete: {
            const subscription = ctx.subscriptions[message.id];
            delete ctx.subscriptions[message.id];
            if (isAsyncGenerator(subscription))
              await subscription.return(void 0);
            return;
          }
          default:
            throw new Error(`Unexpected message of type ${message.type} received`);
        }
      }, "onMessage"));
      return async (code, reason) => {
        if (connectionInitWait)
          clearTimeout(connectionInitWait);
        const subs = Object.assign({}, ctx.subscriptions);
        ctx.subscriptions = {};
        await Promise.all(Object.values(subs).filter(isAsyncGenerator).map((sub) => sub.return(void 0)));
        if (ctx.acknowledged)
          await (onDisconnect === null || onDisconnect === void 0 ? void 0 : onDisconnect(ctx, code, reason));
        await (onClose === null || onClose === void 0 ? void 0 : onClose(ctx, code, reason));
      };
    }
  };
}
__name(makeServer, "makeServer");
function handleProtocols(protocols) {
  switch (true) {
    case (protocols instanceof Set && protocols.has(GRAPHQL_TRANSPORT_WS_PROTOCOL)):
    case (Array.isArray(protocols) && protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL)):
    case (typeof protocols === "string" && protocols.split(",").map((p) => p.trim()).includes(GRAPHQL_TRANSPORT_WS_PROTOCOL)):
      return GRAPHQL_TRANSPORT_WS_PROTOCOL;
    default:
      return false;
  }
}
__name(handleProtocols, "handleProtocols");

// node_modules/radash/dist/esm/index.mjs
init_modules_watch_stub();

// node_modules/radash/dist/esm/array.mjs
init_modules_watch_stub();
var group = /* @__PURE__ */ __name((array, getGroupId) => {
  return array.reduce((acc, item) => {
    const groupId = getGroupId(item);
    if (!acc[groupId])
      acc[groupId] = [];
    acc[groupId].push(item);
    return acc;
  }, {});
}, "group");

// node_modules/uuid/dist/esm-browser/index.js
init_modules_watch_stub();

// node_modules/uuid/dist/esm-browser/rng.js
init_modules_watch_stub();
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// node_modules/uuid/dist/esm-browser/stringify.js
init_modules_watch_stub();
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");

// node_modules/uuid/dist/esm-browser/v4.js
init_modules_watch_stub();

// node_modules/uuid/dist/esm-browser/native.js
init_modules_watch_stub();
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// node_modules/graphql-workers-subscriptions/dist/index.js
var log = typeof DEBUG !== "undefined" && DEBUG ? console.log.bind(console, "[Subscriptions]") : () => void 0;
var tableName = "Subscriptions";
var insertSubscription = /* @__PURE__ */ __name(async (subscriptionsDb, subscription) => {
  await subscriptionsDb.prepare(
    `INSERT INTO ${tableName}(id,connectionId,connectionPoolId,subscription,topic,filter) VALUES(?,?,?,?,?,?)`
  ).bind(
    subscription.id,
    subscription.connectionId,
    subscription.connectionPoolId,
    JSON.stringify(subscription.subscription),
    subscription.topic,
    subscription.filter === null || subscription.filter === void 0 ? null : JSON.stringify(subscription.filter)
  ).run();
}, "insertSubscription");
var deleteConnectionSubscriptions = /* @__PURE__ */ __name(async (subscriptionsDb, connectionId) => {
  log("Deleting connection subscriptions from db", connectionId);
  await subscriptionsDb.prepare(`DELETE FROM ${tableName} WHERE connectionId = ?`).bind(connectionId).run();
}, "deleteConnectionSubscriptions");
var deleteSubscription = /* @__PURE__ */ __name(async (subscriptionsDb, id) => {
  log("Deleting subscription from db", id);
  await subscriptionsDb.prepare(`DELETE FROM ${tableName} WHERE id = ?`).bind(id).run();
}, "deleteSubscription");
var querySubscriptions = /* @__PURE__ */ __name(async (subscriptionsDb, topic, filter) => {
  log("Querying db", topic, filter);
  const sql2 = `SELECT * FROM ${tableName} WHERE topic = ?1 AND (filter is null OR json_patch(?2, filter) = ?2)`;
  const binds = [topic, JSON.stringify(filter)];
  const { results } = await subscriptionsDb.prepare(sql2).bind(...binds).all();
  const subscriptions2 = results?.map((res) => ({
    ...res,
    filter: typeof res.filter === "string" ? JSON.parse(res.filter) : void 0,
    subscription: typeof res.subscription === "string" ? JSON.parse(res.subscription) : void 0
  }));
  return subscriptions2;
}, "querySubscriptions");
var createPublishFn = /* @__PURE__ */ __name((WS_CONNECTION_POOL, SUBSCRIPTIONS_DB, schema2, graphqlContext) => async (event) => {
  const subscriptions2 = await querySubscriptions(
    SUBSCRIPTIONS_DB,
    event.topic,
    event.payload
  );
  await publishToConnections(
    subscriptions2,
    WS_CONNECTION_POOL,
    schema2,
    event.payload,
    graphqlContext
  );
}, "createPublishFn");
async function publishToConnections(subscriptions2, WS_CONNECTION_POOL, schema2, eventPayload, graphqlContext) {
  log("Publishing to", subscriptions2.length, "subscriptions");
  const connectionPoolSubscriptionsMap = group(
    subscriptions2,
    (sub) => sub.connectionPoolId
  );
  log(
    "Grouped into",
    Object.keys(connectionPoolSubscriptionsMap).length,
    "pools"
  );
  const promises = Object.entries(connectionPoolSubscriptionsMap).map(
    async ([connectionPoolId, subscriptions22]) => {
      const messagesAndConnectionIds = await Promise.all(
        subscriptions22.map(async (sub) => {
          const payload = await execute({
            schema: schema2,
            document: parse(sub.subscription.query),
            rootValue: eventPayload,
            contextValue: graphqlContext,
            variableValues: sub.subscription.variables,
            operationName: sub.subscription.operationName
          });
          const message = {
            id: sub.id,
            type: MessageType.Next,
            payload
          };
          return { message, connectionId: sub.connectionId };
        })
      );
      const stubId = WS_CONNECTION_POOL.idFromString(connectionPoolId);
      const stub = WS_CONNECTION_POOL.get(stubId);
      await stub.fetch(
        `https://ws-connection-durable-object.internal/publish`,
        {
          method: "POST",
          body: JSON.stringify(messagesAndConnectionIds),
          headers: { "content-type": "application/json" }
        }
      );
    }
  );
  return await Promise.all(promises);
}
__name(publishToConnections, "publishToConnections");
function createDefaultPublishableContext({
  env,
  executionCtx,
  schema: schema2,
  wsConnectionPool,
  subscriptionsDb
}) {
  const publishableCtx = {
    env,
    executionCtx,
    publish: /* @__PURE__ */ __name((topic, payload) => {
      const publishFn = createPublishFn(
        wsConnectionPool(env),
        subscriptionsDb(env),
        schema2,
        publishableCtx
      );
      const promise = publishFn({ topic, payload });
      if (!executionCtx)
        return promise;
      executionCtx?.waitUntil(promise);
    }, "publish")
  };
  return publishableCtx;
}
__name(createDefaultPublishableContext, "createDefaultPublishableContext");
function handleSubscriptions({
  fetch: fetch2,
  schema: schema2,
  wsConnectionPool,
  subscriptionsDb,
  isPublishAuthorized,
  isConnectAuthorized,
  context: createContext = /* @__PURE__ */ __name((request, env, executionCtx, requestBody) => createDefaultPublishableContext({
    env,
    executionCtx,
    schema: schema2,
    wsConnectionPool,
    subscriptionsDb
  }), "createContext"),
  pooling = "continent",
  publishPathName = /* @__PURE__ */ __name(() => "/publish", "publishPathName"),
  wsConnectPathName = /* @__PURE__ */ __name(() => "/graphql", "wsConnectPathName")
}) {
  const wrappedFetch = /* @__PURE__ */ __name(async (request, env, executionCtx) => {
    const WS_CONNECTION_POOL = wsConnectionPool(env);
    const SUBSCRIPTIONS_DB = subscriptionsDb(env);
    const upgradeHeader = request.headers.get("Upgrade");
    const path = new URL(request.url).pathname;
    if (path === publishPathName(request, env, executionCtx) && request.method === "POST") {
      const authorized = typeof isPublishAuthorized === "function" ? await isPublishAuthorized(request.clone(), env, executionCtx) : true;
      if (!authorized)
        return new Response("unauthorized", { status: 400 });
      log("Received publish request");
      const reqBody = await request.json();
      if (!reqBody.topic)
        return new Response("missing_topic_from_request", { status: 400 });
      const publish = createPublishFn(
        WS_CONNECTION_POOL,
        SUBSCRIPTIONS_DB,
        schema2,
        createContext(request, env, executionCtx, reqBody)
      );
      executionCtx.waitUntil(publish(reqBody));
      return new Response("ok");
    } else if (path === wsConnectPathName(request, env, executionCtx) && upgradeHeader === "websocket") {
      log("Received new websocket connection");
      const authorized = typeof isConnectAuthorized === "function" ? await isConnectAuthorized(request.clone(), env, executionCtx) : true;
      if (!authorized)
        return new Response("unauthorized", { status: 400 });
      const poolingStrategyFn = typeof pooling === "function" ? pooling : poolingStrategies[pooling];
      const stubName = await poolingStrategyFn(request, env);
      log("Using pool", stubName);
      const stubId = WS_CONNECTION_POOL.idFromName(stubName);
      const stub = WS_CONNECTION_POOL.get(stubId);
      const connectionId = v4_default();
      return stub.fetch(
        `https://ws-connection-durable-object.internal/connect/${connectionId}`,
        request
      );
    }
    if (typeof fetch2 === "function") {
      return await fetch2(request, env, executionCtx);
    }
    return new Response("not_found", { status: 404 });
  }, "wrappedFetch");
  return wrappedFetch;
}
__name(handleSubscriptions, "handleSubscriptions");
var poolingStrategies = {
  none: /* @__PURE__ */ __name(() => v4_default(), "none"),
  colo: /* @__PURE__ */ __name((req) => {
    const cf = req.cf;
    return cf && "colo" in cf && cf.colo ? cf.colo : "global";
  }, "colo"),
  continent: /* @__PURE__ */ __name((req) => {
    const cf = req.cf;
    return cf && "continent" in cf && cf.continent ? cf.continent : "global";
  }, "continent"),
  global: /* @__PURE__ */ __name(() => "global", "global")
};
var getResolverAndArgs = /* @__PURE__ */ __name(({
  execContext
}) => {
  const { schema: schema2, fragments, operation, variableValues, contextValue } = execContext;
  const rootType = schema2.getSubscriptionType();
  if (rootType == null) {
    throw new GraphQLError(
      "Schema is not configured to execute subscription operation.",
      operation
    );
  }
  const rootFields = collectFields(
    schema2,
    fragments,
    variableValues,
    rootType,
    operation.selectionSet
  );
  const [responseName, fieldNodes] = [...rootFields.entries()][0];
  const fieldDef = getFieldDef2(schema2, rootType, fieldNodes[0]);
  if (!fieldDef) {
    const fieldName = fieldNodes[0].name.value;
    throw new GraphQLError(
      `The subscription field "${fieldName}" is not defined.`,
      fieldNodes
    );
  }
  const path = addPath(void 0, responseName, rootType.name);
  const info = buildResolveInfo(
    execContext,
    fieldDef,
    fieldNodes,
    rootType,
    path
  );
  const args = getArgumentValues(fieldDef, fieldNodes[0], variableValues);
  return {
    field: fieldDef,
    root: null,
    args,
    context: contextValue,
    info
  };
}, "getResolverAndArgs");
var resolveSubscription = /* @__PURE__ */ __name(async (message, schema2, connectionId, connectionPoolId) => {
  const execContext = buildExecutionContext({
    schema: schema2,
    document: parse(message.payload.query),
    variableValues: message.payload.variables,
    operationName: message.payload.operationName
  });
  if (isErrorArray(execContext)) {
    console.error(execContext.map((e) => e.message));
    throw new Error("GraphQL buildExecutionContext error", { cause: execContext[0] });
  }
  const { field, root, args, context, info } = getResolverAndArgs({
    execContext
  });
  if (!field) {
    throw new Error("No field");
  }
  const { topic, filter: filterFn } = field.subscribe;
  if (!topic) {
    throw new Error("No topic found on subscribe field. Make sure to use subscribe correctly.");
  }
  const filter = typeof filterFn === "function" ? filterFn(root, args, context, info) : filterFn;
  const subscription = {
    id: message.id,
    connectionPoolId,
    connectionId,
    subscription: message.payload,
    topic,
    filter
  };
  return subscription;
}, "resolveSubscription");
var isErrorArray = /* @__PURE__ */ __name((e) => Array.isArray(e), "isErrorArray");
async function useWebsocket(socket, request, protocol, env, serverOptions, createSubscription, deleteConnectionSubscriptions2, deleteSubscription2) {
  const server = makeServer(serverOptions);
  socket.accept();
  let pinger, pongWait;
  function ping() {
    if (socket.readyState === 1) {
      socket.send(stringifyMessage({ type: MessageType.Ping }));
      pongWait = setTimeout(() => {
        clearInterval(pinger);
        socket.close();
      }, 6e3);
    }
  }
  __name(ping, "ping");
  pinger = setInterval(() => ping(), 12e3);
  if (!protocol) {
    throw new Error("invalid_ws_protocol");
  }
  const callOnClosed = server.opened(
    {
      protocol,
      send: /* @__PURE__ */ __name((data) => {
        log("Sending to connection", data);
        socket.send(data);
      }, "send"),
      close: /* @__PURE__ */ __name((code, reason) => {
        log("Closing connection", code);
        if (code >= 4e3 && code < 5e3)
          console.error(reason);
        socket.close(code, reason);
      }, "close"),
      onMessage: /* @__PURE__ */ __name((cb) => socket.addEventListener("message", async (event) => {
        try {
          const data = JSON.parse(event.data.valueOf());
          if (data.type === "subscribe") {
            await createSubscription(data);
          } else if (data.type === "complete") {
            await deleteSubscription2(data.id);
          } else {
            cb(JSON.stringify(data));
          }
        } catch (err) {
          console.error(err);
          socket.close(1011, err.message);
        }
      }), "onMessage"),
      onPong: /* @__PURE__ */ __name(() => clearTimeout(pongWait), "onPong")
    },
    { socket, request, env }
  );
  socket.addEventListener("close", async (code, reason) => {
    clearTimeout(pongWait);
    clearInterval(pinger);
    await deleteConnectionSubscriptions2();
    callOnClosed(code, reason);
  });
}
__name(useWebsocket, "useWebsocket");
function createWsConnectionPoolClass({
  schema: schema2,
  subscriptionsDb,
  wsConnectionPool,
  context: createContext = /* @__PURE__ */ __name((req, env) => createDefaultPublishableContext({
    env,
    executionCtx: void 0,
    subscriptionsDb,
    wsConnectionPool,
    schema: schema2
  }), "createContext"),
  ...otherServerOptions
}) {
  return class WsConnectionPool {
    static {
      __name(this, "WsConnectionPool");
    }
    constructor(state, env) {
      this.state = state;
      this.env = env;
      this.subscriptionsDb = subscriptionsDb(this.env);
    }
    connections = /* @__PURE__ */ new Map();
    subscriptionsDb;
    async fetch(request) {
      const path = new URL(request.url).pathname.slice(1);
      const pathParts = path.split("/");
      const [action] = pathParts;
      const connectionPoolId = this.state.id.toString();
      switch (action) {
        case "connect": {
          const connectionId = pathParts[1];
          const [client, connection] = Object.values(
            new WebSocketPair()
          );
          this.connections.set(connectionId, connection);
          const protocol = handleProtocols(
            request.headers.get("Sec-WebSocket-Protocol")
          );
          const context = await createContext(request, this.env, void 0);
          const serverOptions = {
            ...otherServerOptions,
            schema: schema2,
            context
          };
          await useWebsocket(
            connection,
            request,
            protocol,
            this.env,
            serverOptions,
            async (message) => {
              const subscription = await resolveSubscription(
                message,
                schema2,
                connectionId,
                connectionPoolId
              );
              await insertSubscription(this.subscriptionsDb, subscription);
            },
            () => deleteConnectionSubscriptions(
              this.subscriptionsDb,
              connectionId
            ),
            (id) => deleteSubscription(this.subscriptionsDb, id)
          );
          return new Response(null, {
            status: 101,
            webSocket: client,
            headers: protocol ? {
              "Sec-WebSocket-Protocol": protocol
            } : {}
          });
        }
        case "close": {
          const connectionId = pathParts[1];
          const connection = this.connections.get(connectionId);
          if (!connection) {
            await deleteConnectionSubscriptions(
              this.subscriptionsDb,
              connectionId
            );
            return new Response("ok");
          }
          connection.close();
          return new Response("ok");
        }
        case "publish": {
          const messagesAndConnectionIds = await request.json();
          for (const { message, connectionId } of messagesAndConnectionIds) {
            const connection = this.connections.get(connectionId);
            if (!connection || connection.readyState === connection.CLOSED) {
              await deleteConnectionSubscriptions(
                this.subscriptionsDb,
                connectionId
              );
              continue;
            }
            connection.send(JSON.stringify(message));
          }
          return new Response("ok");
        }
        default:
          throw new Error("bad_request");
      }
    }
  };
}
__name(createWsConnectionPoolClass, "createWsConnectionPoolClass");
var createSubscriptionHandler = /* @__PURE__ */ __name((topic, options = {}) => {
  const { filter } = options;
  const handler = createHandler();
  handler.topic = topic;
  handler.filter = filter;
  return handler;
}, "createSubscriptionHandler");
var createHandler = /* @__PURE__ */ __name(() => {
  const handler = /* @__PURE__ */ __name(async function* () {
    throw new Error("Subscription handler should not have been called");
  }, "handler");
  return handler;
}, "createHandler");

// node_modules/@graphql-yoga/logger/esm/index.js
init_modules_watch_stub();
var ansiCodes = {
  red: "\x1B[31m",
  yellow: "\x1B[33m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  reset: "\x1B[0m"
};
var warnPrefix = ansiCodes.yellow + "WARN" + ansiCodes.reset;
var infoPrefix = ansiCodes.cyan + "INFO" + ansiCodes.reset;
var errorPrefix = ansiCodes.red + "ERR" + ansiCodes.reset;
var debugPrefix = ansiCodes.magenta + "DEBUG" + ansiCodes.reset;
var logLevelScores = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};
var noop = /* @__PURE__ */ __name(() => {
}, "noop");
var consoleLog = /* @__PURE__ */ __name((prefix) => (...args) => console.log(prefix, ...args), "consoleLog");
var debugLog = console.debug ? (...args) => console.debug(debugPrefix, ...args) : consoleLog(debugPrefix);
var infoLog = console.info ? (...args) => console.info(infoPrefix, ...args) : consoleLog(infoPrefix);
var warnLog = console.warn ? (...args) => console.warn(warnPrefix, ...args) : consoleLog(warnPrefix);
var errorLog = console.error ? (...args) => console.error(errorPrefix, ...args) : consoleLog(errorPrefix);
var createLogger = /* @__PURE__ */ __name((logLevel = globalThis.process?.env["DEBUG"] === "1" ? "debug" : "info") => {
  const score = logLevelScores[logLevel];
  return {
    debug: score > logLevelScores.debug ? noop : debugLog,
    info: score > logLevelScores.info ? noop : infoLog,
    warn: score > logLevelScores.warn ? noop : warnLog,
    error: score > logLevelScores.error ? noop : errorLog
  };
}, "createLogger");

// node_modules/graphql-yoga/esm/plugins/use-graphiql.js
init_modules_watch_stub();

// node_modules/graphql-yoga/esm/graphiql-html.js
init_modules_watch_stub();
var graphiql_html_default = '<!doctype html><html lang=en><head><meta charset=utf-8><title>__TITLE__</title><link rel=icon href=https://raw.githubusercontent.com/graphql-hive/graphql-yoga/refs/heads/main/website/src/app/favicon.ico><link crossorigin rel=stylesheet href=https://unpkg.com/@graphql-yoga/graphiql@4.4.1/dist/graphiql.css></head><body id=body class=no-focus-outline><noscript>You need to enable JavaScript to run this app.</noscript><div id=root>Loading __TITLE__...</div><script>function prepareBlob(r){const o=new Blob([r],{type:"application/javascript"});return URL.createObjectURL(o)}const workers={},workerUrls={editorWorkerService:"https://unpkg.com/@graphql-yoga/graphiql@4.4.1/dist/monacoeditorwork/editor.worker.bundle.js",json:"https://unpkg.com/@graphql-yoga/graphiql@4.4.1/dist/monacoeditorwork/json.worker.bundle.js",graphql:"https://unpkg.com/@graphql-yoga/graphiql@4.4.1/dist/monacoeditorwork/graphql.worker..bundle.js"};function prepareWorkers(){return Promise.all(Object.entries(workerUrls).map(async([r,o])=>{const e=await fetch(o),t=await e.text();workers[r]=prepareBlob(t)}))}self.MonacoEnvironment={globalAPI:!1,getWorkerUrl:function(r,o){return workers[o]}}<\/script><script src=https://unpkg.com/@graphql-yoga/graphiql@4.4.1/dist/yoga-graphiql.umd.js><\/script><script>prepareWorkers().finally(()=>{YogaGraphiQL.renderYogaGraphiQL(root,__OPTS__)})<\/script></body></html>';

// node_modules/graphql-yoga/esm/plugins/use-graphiql.js
function shouldRenderGraphiQL({ headers, method }) {
  return method === "GET" && !!headers?.get("accept")?.includes("text/html");
}
__name(shouldRenderGraphiQL, "shouldRenderGraphiQL");
var renderGraphiQL = /* @__PURE__ */ __name((opts) => graphiql_html_default.replace("__TITLE__", opts?.title || "Yoga GraphiQL").replace("__OPTS__", JSON.stringify(opts ?? {})), "renderGraphiQL");
function useGraphiQL(config) {
  const logger = config.logger ?? console;
  let graphiqlOptionsFactory;
  if (typeof config?.options === "function") {
    graphiqlOptionsFactory = config?.options;
  } else if (typeof config?.options === "object") {
    graphiqlOptionsFactory = /* @__PURE__ */ __name(() => config?.options, "graphiqlOptionsFactory");
  } else if (config?.options === false) {
    graphiqlOptionsFactory = /* @__PURE__ */ __name(() => false, "graphiqlOptionsFactory");
  } else {
    graphiqlOptionsFactory = /* @__PURE__ */ __name(() => ({}), "graphiqlOptionsFactory");
  }
  const renderer = config?.render ?? renderGraphiQL;
  let urlPattern;
  const getUrlPattern = /* @__PURE__ */ __name(({ URLPattern }) => {
    urlPattern ||= new URLPattern({
      pathname: config.graphqlEndpoint
    });
    return urlPattern;
  }, "getUrlPattern");
  return {
    onRequest({ request, serverContext, fetchAPI, endResponse: endResponse2, url }) {
      if (shouldRenderGraphiQL(request) && (request.url.endsWith(config.graphqlEndpoint) || request.url.endsWith(`${config.graphqlEndpoint}/`) || url.pathname === config.graphqlEndpoint || url.pathname === `${config.graphqlEndpoint}/` || getUrlPattern(fetchAPI).test(url))) {
        logger.debug(`Rendering GraphiQL`);
        return handleMaybePromise(() => graphiqlOptionsFactory(request, serverContext), (graphiqlOptions) => {
          if (graphiqlOptions) {
            return handleMaybePromise(() => renderer({
              ...graphiqlOptions === true ? {} : graphiqlOptions
            }), (graphiqlBody) => {
              const response = new fetchAPI.Response(graphiqlBody, {
                headers: {
                  "Content-Type": "text/html"
                },
                status: 200
              });
              endResponse2(response);
            });
          }
        });
      }
    }
  };
}
__name(useGraphiQL, "useGraphiQL");

// node_modules/graphql-yoga/esm/plugins/use-schema.js
init_modules_watch_stub();
var useSchema = /* @__PURE__ */ __name((schemaDef) => {
  if (schemaDef == null) {
    return {};
  }
  if (isSchema(schemaDef)) {
    return {
      onPluginInit({ setSchema }) {
        setSchema(schemaDef);
      }
    };
  }
  if ("then" in schemaDef) {
    let schema2;
    return {
      onRequestParse() {
        return {
          onRequestParseDone() {
            if (!schema2) {
              return handleMaybePromise(() => schemaDef, (schemaDef2) => {
                schema2 = schemaDef2;
              });
            }
          }
        };
      },
      onEnveloped({ setSchema }) {
        if (!schema2) {
          throw new Error(`You provide a promise of a schema but it hasn't been resolved yet. Make sure you use this plugin with GraphQL Yoga.`);
        }
        setSchema(schema2);
      }
    };
  }
  const schemaByRequest = /* @__PURE__ */ new WeakMap();
  return {
    onRequestParse({ request, serverContext }) {
      return {
        onRequestParseDone() {
          return handleMaybePromise(() => schemaDef({
            ...serverContext,
            request
          }), (schemaDef2) => {
            schemaByRequest.set(request, schemaDef2);
          });
        }
      };
    },
    onEnveloped({ setSchema, context }) {
      if (context?.request == null) {
        throw new Error("Request object is not available in the context. Make sure you use this plugin with GraphQL Yoga.");
      }
      const schema2 = schemaByRequest.get(context.request);
      if (schema2 == null) {
        throw new Error(`No schema found for this request. Make sure you use this plugin with GraphQL Yoga.`);
      }
      setSchema(schema2);
    }
  };
}, "useSchema");

// node_modules/graphql-yoga/esm/server.js
init_modules_watch_stub();

// node_modules/@envelop/instrumentation/esm/instrumentation.js
init_modules_watch_stub();
function chain(first2, next) {
  const merged = { ...next, ...first2 };
  for (const key of Object.keys(merged)) {
    if (key in first2 && key in next) {
      merged[key] = (payload, wrapped) => first2[key](payload, () => next[key](payload, wrapped));
    }
  }
  return merged;
}
__name(chain, "chain");
var getInstrumented = /* @__PURE__ */ __name((payload) => ({
  /**
   * Wraps the `wrapped` function with the given `instrument` wrapper.
   * @returns The wrapped function, or `undefined` if the instrument is `undefined`.
   */
  fn(instrument, wrapped) {
    if (!instrument) {
      return wrapped;
    }
    return (...args) => {
      let result;
      instrument(payload, () => {
        result = wrapped(...args);
      });
      return result;
    };
  },
  /**
   * Wraps the `wrapped` function with the given `instrument` wrapper.
   * @returns The wrapped function, or `undefined` if the instrument is `undefined`.
   */
  asyncFn(instrument, wrapped) {
    if (!instrument) {
      return wrapped;
    }
    return (...args) => {
      let result;
      return handleMaybePromise(() => instrument(payload, () => {
        result = wrapped(...args);
        return isPromise2(result) ? result.then(() => void 0) : void 0;
      }), () => {
        return result;
      });
    };
  }
}), "getInstrumented");

// node_modules/@envelop/core/esm/create.js
init_modules_watch_stub();

// node_modules/@envelop/core/esm/orchestrator.js
init_modules_watch_stub();

// node_modules/@envelop/core/esm/document-string-map.js
init_modules_watch_stub();
var documentStringMap = /* @__PURE__ */ new WeakMap();

// node_modules/@envelop/core/esm/utils.js
init_modules_watch_stub();
var envelopIsIntrospectionSymbol = Symbol("ENVELOP_IS_INTROSPECTION");
function getSubscribeArgs(args) {
  return args.length === 1 ? args[0] : {
    schema: args[0],
    document: args[1],
    rootValue: args[2],
    contextValue: args[3],
    variableValues: args[4],
    operationName: args[5],
    fieldResolver: args[6],
    subscribeFieldResolver: args[7]
  };
}
__name(getSubscribeArgs, "getSubscribeArgs");
var makeSubscribe = /* @__PURE__ */ __name((subscribeFn) => (...polyArgs) => subscribeFn(getSubscribeArgs(polyArgs)), "makeSubscribe");
function getExecuteArgs(args) {
  return args.length === 1 ? args[0] : {
    schema: args[0],
    document: args[1],
    rootValue: args[2],
    contextValue: args[3],
    variableValues: args[4],
    operationName: args[5],
    fieldResolver: args[6],
    typeResolver: args[7]
  };
}
__name(getExecuteArgs, "getExecuteArgs");
var makeExecute = /* @__PURE__ */ __name((executeFn) => (...polyArgs) => executeFn(getExecuteArgs(polyArgs)), "makeExecute");
function isAsyncIterable4(maybeAsyncIterable) {
  return typeof maybeAsyncIterable === "object" && maybeAsyncIterable != null && typeof maybeAsyncIterable[Symbol.asyncIterator] === "function";
}
__name(isAsyncIterable4, "isAsyncIterable");
function handleStreamOrSingleExecutionResult(payload, fn) {
  if (isAsyncIterable4(payload.result)) {
    return { onNext: fn };
  }
  fn({
    args: payload.args,
    result: payload.result,
    setResult: payload.setResult
  });
  return void 0;
}
__name(handleStreamOrSingleExecutionResult, "handleStreamOrSingleExecutionResult");
function finalAsyncIterator(source, onFinal) {
  let iterator;
  function ensureIterator() {
    if (!iterator) {
      iterator = source[Symbol.asyncIterator]();
    }
    return iterator;
  }
  __name(ensureIterator, "ensureIterator");
  let isDone = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      return ensureIterator().next().then((result) => {
        if (result.done && isDone === false) {
          isDone = true;
          onFinal();
        }
        return result;
      });
    },
    return() {
      const promise = ensureIterator().return?.();
      if (isDone === false) {
        isDone = true;
        onFinal();
      }
      return promise || fakePromise({ done: true, value: void 0 });
    },
    throw(error) {
      const promise = ensureIterator().throw?.();
      if (promise) {
        return promise;
      }
      throw error;
    },
    [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
      return fakePromise();
    }
  };
}
__name(finalAsyncIterator, "finalAsyncIterator");
function errorAsyncIterator(source, onError) {
  let iterator;
  function ensureIterator() {
    if (!iterator) {
      iterator = source[Symbol.asyncIterator]();
    }
    return iterator;
  }
  __name(ensureIterator, "ensureIterator");
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      return ensureIterator().next().catch((error) => {
        onError(error);
        return { done: true, value: void 0 };
      });
    },
    return() {
      const promise = ensureIterator().return?.();
      return promise || fakePromise({ done: true, value: void 0 });
    },
    throw(error) {
      const promise = ensureIterator().throw?.();
      if (promise) {
        return promise;
      }
      throw error;
    },
    [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
      return fakePromise();
    }
  };
}
__name(errorAsyncIterator, "errorAsyncIterator");

// node_modules/@envelop/core/esm/orchestrator.js
function throwEngineFunctionError(name) {
  throw Error(`No \`${name}\` function found! Register it using "useEngine" plugin.`);
}
__name(throwEngineFunctionError, "throwEngineFunctionError");
function createEnvelopOrchestrator({ plugins }) {
  let schema2 = null;
  let initDone = false;
  const parse2 = /* @__PURE__ */ __name(() => throwEngineFunctionError("parse"), "parse");
  const validate2 = /* @__PURE__ */ __name(() => throwEngineFunctionError("validate"), "validate");
  const execute3 = /* @__PURE__ */ __name(() => throwEngineFunctionError("execute"), "execute");
  const subscribe3 = /* @__PURE__ */ __name(() => throwEngineFunctionError("subscribe"), "subscribe");
  let instrumentation;
  const replaceSchema = /* @__PURE__ */ __name((newSchema, ignorePluginIndex = -1) => {
    if (schema2 === newSchema) {
      return;
    }
    schema2 = newSchema;
    if (initDone) {
      for (const [i, plugin] of plugins.entries()) {
        if (i !== ignorePluginIndex) {
          plugin.onSchemaChange && plugin.onSchemaChange({
            schema: schema2,
            replaceSchema: /* @__PURE__ */ __name((schemaToSet) => {
              replaceSchema(schemaToSet, i);
            }, "replaceSchema")
          });
        }
      }
    }
  }, "replaceSchema");
  const contextErrorHandlers = [];
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const pluginsToAdd = [];
    plugin.onPluginInit?.({
      plugins,
      addPlugin: /* @__PURE__ */ __name((newPlugin) => {
        pluginsToAdd.push(newPlugin);
      }, "addPlugin"),
      setSchema: /* @__PURE__ */ __name((modifiedSchema) => replaceSchema(modifiedSchema, i), "setSchema"),
      registerContextErrorHandler: /* @__PURE__ */ __name((handler) => contextErrorHandlers.push(handler), "registerContextErrorHandler")
    });
    pluginsToAdd.length && plugins.splice(i + 1, 0, ...pluginsToAdd);
  }
  const beforeCallbacks = {
    init: [],
    parse: [],
    validate: [],
    subscribe: [],
    execute: [],
    context: []
  };
  for (const { onContextBuilding, onExecute, onParse, onSubscribe, onValidate, onEnveloped, instrumentation: pluginInstrumentation } of plugins) {
    onEnveloped && beforeCallbacks.init.push(onEnveloped);
    onContextBuilding && beforeCallbacks.context.push(onContextBuilding);
    onExecute && beforeCallbacks.execute.push(onExecute);
    onParse && beforeCallbacks.parse.push(onParse);
    onSubscribe && beforeCallbacks.subscribe.push(onSubscribe);
    onValidate && beforeCallbacks.validate.push(onValidate);
    if (pluginInstrumentation) {
      instrumentation = instrumentation ? chain(instrumentation, pluginInstrumentation) : pluginInstrumentation;
    }
  }
  const init = /* @__PURE__ */ __name((initialContext) => {
    for (const [i, onEnveloped] of beforeCallbacks.init.entries()) {
      onEnveloped({
        context: initialContext,
        extendContext: /* @__PURE__ */ __name((extension) => {
          if (!initialContext) {
            return;
          }
          Object.assign(initialContext, extension);
        }, "extendContext"),
        setSchema: /* @__PURE__ */ __name((modifiedSchema) => replaceSchema(modifiedSchema, i), "setSchema")
      });
    }
  }, "init");
  const customParse = beforeCallbacks.parse.length ? (initialContext) => (source, parseOptions) => {
    let result = null;
    let parseFn = parse2;
    const context = initialContext;
    const afterCalls = [];
    for (const onParse of beforeCallbacks.parse) {
      const afterFn = onParse({
        context,
        extendContext: /* @__PURE__ */ __name((extension) => {
          Object.assign(context, extension);
        }, "extendContext"),
        params: { source, options: parseOptions },
        parseFn,
        setParseFn: /* @__PURE__ */ __name((newFn) => {
          parseFn = newFn;
        }, "setParseFn"),
        setParsedDocument: /* @__PURE__ */ __name((newDoc) => {
          result = newDoc;
        }, "setParsedDocument")
      });
      if (afterFn) {
        afterCalls.push(afterFn);
      }
    }
    if (result === null) {
      try {
        result = parseFn(source, parseOptions);
      } catch (e) {
        result = e;
      }
    }
    for (const afterCb of afterCalls) {
      afterCb({
        context,
        extendContext: /* @__PURE__ */ __name((extension) => {
          Object.assign(context, extension);
        }, "extendContext"),
        replaceParseResult: /* @__PURE__ */ __name((newResult) => {
          result = newResult;
        }, "replaceParseResult"),
        result
      });
    }
    if (result === null) {
      throw new Error(`Failed to parse document.`);
    }
    if (result instanceof Error) {
      throw result;
    }
    documentStringMap.set(result, source.toString());
    return result;
  } : () => parse2;
  const customValidate = beforeCallbacks.validate.length ? (initialContext) => (schema3, documentAST, rules, typeInfo, validationOptions) => {
    let actualRules = rules ? [...rules] : void 0;
    let validateFn = validate2;
    let result = null;
    const context = initialContext;
    const afterCalls = [];
    for (const onValidate of beforeCallbacks.validate) {
      const afterFn = onValidate({
        context,
        extendContext: /* @__PURE__ */ __name((extension) => {
          Object.assign(context, extension);
        }, "extendContext"),
        params: {
          schema: schema3,
          documentAST,
          rules: actualRules,
          typeInfo,
          options: validationOptions
        },
        validateFn,
        addValidationRule: /* @__PURE__ */ __name((rule) => {
          if (!actualRules) {
            actualRules = [];
          }
          actualRules.push(rule);
        }, "addValidationRule"),
        setValidationFn: /* @__PURE__ */ __name((newFn) => {
          validateFn = newFn;
        }, "setValidationFn"),
        setResult: /* @__PURE__ */ __name((newResults) => {
          result = newResults;
        }, "setResult")
      });
      afterFn && afterCalls.push(afterFn);
    }
    if (!result) {
      result = validateFn(schema3, documentAST, actualRules, typeInfo, validationOptions);
    }
    if (!result) {
      return;
    }
    const valid = result.length === 0;
    for (const afterCb of afterCalls) {
      afterCb({
        valid,
        result,
        context,
        extendContext: /* @__PURE__ */ __name((extension) => {
          Object.assign(context, extension);
        }, "extendContext"),
        setResult: /* @__PURE__ */ __name((newResult) => {
          result = newResult;
        }, "setResult")
      });
    }
    return result;
  } : () => validate2;
  const customContextFactory = beforeCallbacks.context.length ? (initialContext) => (orchestratorCtx) => {
    const afterCalls = [];
    const context = initialContext;
    if (orchestratorCtx) {
      Object.assign(context, orchestratorCtx);
    }
    let isBreakingContextBuilding = false;
    return handleMaybePromise(() => iterateAsync(beforeCallbacks.context, (onContext, stopEarly) => onContext({
      context,
      extendContext: /* @__PURE__ */ __name((extension) => {
        Object.assign(context, extension);
      }, "extendContext"),
      breakContextBuilding: /* @__PURE__ */ __name(() => {
        isBreakingContextBuilding = true;
        stopEarly();
      }, "breakContextBuilding")
    }), afterCalls), () => {
      if (!isBreakingContextBuilding) {
        return handleMaybePromise(() => iterateAsync(afterCalls, (afterCb) => afterCb({
          context,
          extendContext(extension) {
            Object.assign(context, extension);
          }
        })), () => context);
      }
      return context;
    }, (err) => {
      let error = err;
      for (const errorCb of contextErrorHandlers) {
        errorCb({
          context,
          error,
          setError: /* @__PURE__ */ __name((err2) => {
            error = err2;
          }, "setError")
        });
      }
      throw error;
    });
  } : (initialContext) => (orchestratorCtx) => {
    if (orchestratorCtx) {
      Object.assign(initialContext, orchestratorCtx);
    }
    return initialContext;
  };
  const useCustomSubscribe = beforeCallbacks.subscribe.length;
  const customSubscribe = useCustomSubscribe ? makeSubscribe((args) => {
    let subscribeFn = subscribe3;
    const afterCallbacks = [];
    const context = args.contextValue || {};
    let result;
    return handleMaybePromise(() => iterateAsync(beforeCallbacks.subscribe, (onSubscribe, endEarly) => onSubscribe({
      subscribeFn,
      setSubscribeFn: /* @__PURE__ */ __name((newSubscribeFn) => {
        subscribeFn = newSubscribeFn;
      }, "setSubscribeFn"),
      context,
      extendContext: /* @__PURE__ */ __name((extension) => {
        Object.assign(context, extension);
      }, "extendContext"),
      args,
      setResultAndStopExecution: /* @__PURE__ */ __name((stopResult) => {
        result = stopResult;
        endEarly();
      }, "setResultAndStopExecution")
    }), afterCallbacks), () => {
      const afterCalls = [];
      const subscribeErrorHandlers = [];
      for (const { onSubscribeResult, onSubscribeError } of afterCallbacks) {
        if (onSubscribeResult) {
          afterCalls.push(onSubscribeResult);
        }
        if (onSubscribeError) {
          subscribeErrorHandlers.push(onSubscribeError);
        }
      }
      return handleMaybePromise(() => result || subscribeFn(args), (result2) => {
        const onNextHandler = [];
        const onEndHandler = [];
        for (const afterCb of afterCalls) {
          const hookResult = afterCb({
            args,
            result: result2,
            setResult: /* @__PURE__ */ __name((newResult) => {
              result2 = newResult;
            }, "setResult")
          });
          if (hookResult) {
            if (hookResult.onNext) {
              onNextHandler.push(hookResult.onNext);
            }
            if (hookResult.onEnd) {
              onEndHandler.push(hookResult.onEnd);
            }
          }
        }
        if (onNextHandler.length && isAsyncIterable4(result2)) {
          result2 = mapAsyncIterator2(result2, (result3) => handleMaybePromise(() => iterateAsync(onNextHandler, (onNext) => onNext({
            args,
            result: result3,
            setResult: /* @__PURE__ */ __name((newResult) => result3 = newResult, "setResult")
          })), () => result3));
        }
        if (onEndHandler.length && isAsyncIterable4(result2)) {
          result2 = finalAsyncIterator(result2, () => {
            for (const onEnd of onEndHandler) {
              onEnd();
            }
          });
        }
        if (subscribeErrorHandlers.length && isAsyncIterable4(result2)) {
          result2 = errorAsyncIterator(result2, (err) => {
            let error = err;
            for (const handler of subscribeErrorHandlers) {
              handler({
                error,
                setError: /* @__PURE__ */ __name((err2) => {
                  error = err2;
                }, "setError")
              });
            }
            throw error;
          });
        }
        return result2;
      });
    });
  }) : makeSubscribe(subscribe3);
  const useCustomExecute = beforeCallbacks.execute.length;
  const customExecute = useCustomExecute ? makeExecute((args) => {
    let executeFn = execute3;
    let result;
    const afterCalls = [];
    const afterDoneCalls = [];
    const context = args.contextValue || {};
    return handleMaybePromise(() => iterateAsync(beforeCallbacks.execute, (onExecute, endEarly) => onExecute({
      executeFn,
      setExecuteFn: /* @__PURE__ */ __name((newExecuteFn) => {
        executeFn = newExecuteFn;
      }, "setExecuteFn"),
      setResultAndStopExecution: /* @__PURE__ */ __name((stopResult) => {
        result = stopResult;
        endEarly();
      }, "setResultAndStopExecution"),
      context,
      extendContext: /* @__PURE__ */ __name((extension) => {
        if (typeof extension === "object") {
          Object.assign(context, extension);
        } else {
          throw new Error(`Invalid context extension provided! Expected "object", got: "${JSON.stringify(extension)}" (${typeof extension})`);
        }
      }, "extendContext"),
      args
    }), afterCalls), () => handleMaybePromise(() => result || executeFn({
      ...args,
      contextValue: context
    }), (result2) => handleMaybePromise(() => iterateAsync(afterCalls, (afterCb) => afterCb.onExecuteDone?.({
      args,
      result: result2,
      setResult: /* @__PURE__ */ __name((newResult) => {
        result2 = newResult;
      }, "setResult")
    }), afterDoneCalls), () => {
      const onNextHandler = [];
      const onEndHandler = [];
      for (const { onNext, onEnd } of afterDoneCalls) {
        if (onNext) {
          onNextHandler.push(onNext);
        }
        if (onEnd) {
          onEndHandler.push(onEnd);
        }
      }
      if (onNextHandler.length && isAsyncIterable4(result2)) {
        result2 = mapAsyncIterator2(result2, (result3) => handleMaybePromise(() => iterateAsync(onNextHandler, (onNext) => onNext({
          args,
          result: result3,
          setResult: /* @__PURE__ */ __name((newResult) => {
            result3 = newResult;
          }, "setResult")
        })), () => result3));
      }
      if (onEndHandler.length && isAsyncIterable4(result2)) {
        result2 = finalAsyncIterator(result2, () => {
          for (const onEnd of onEndHandler) {
            onEnd();
          }
        });
      }
      return result2;
    })));
  }) : makeExecute(execute3);
  initDone = true;
  if (schema2) {
    for (const [i, plugin] of plugins.entries()) {
      plugin.onSchemaChange?.({
        schema: schema2,
        replaceSchema: /* @__PURE__ */ __name((modifiedSchema) => replaceSchema(modifiedSchema, i), "replaceSchema")
      });
    }
  }
  return {
    getCurrentSchema() {
      return schema2;
    },
    init,
    parse: customParse,
    validate: customValidate,
    execute: customExecute,
    subscribe: customSubscribe,
    contextFactory: customContextFactory,
    instrumentation
  };
}
__name(createEnvelopOrchestrator, "createEnvelopOrchestrator");

// node_modules/@envelop/core/esm/create.js
function notEmpty(value) {
  return value != null;
}
__name(notEmpty, "notEmpty");
function envelop(options) {
  const plugins = options.plugins.filter(notEmpty);
  const orchestrator = createEnvelopOrchestrator({
    plugins
  });
  const instrumentation = orchestrator.instrumentation;
  const getEnveloped = /* @__PURE__ */ __name((context = {}) => {
    const instrumented = getInstrumented({ context });
    const typedOrchestrator = orchestrator;
    instrumented.fn(instrumentation?.init, orchestrator.init)(context);
    return {
      parse: instrumented.fn(instrumentation?.parse, typedOrchestrator.parse(context)),
      validate: instrumented.fn(instrumentation?.validate, typedOrchestrator.validate(context)),
      contextFactory: instrumented.fn(instrumentation?.context, typedOrchestrator.contextFactory(context)),
      execute: instrumented.asyncFn(instrumentation?.execute, typedOrchestrator.execute),
      subscribe: instrumented.asyncFn(instrumentation?.subscribe, typedOrchestrator.subscribe),
      schema: typedOrchestrator.getCurrentSchema()
    };
  }, "getEnveloped");
  getEnveloped._plugins = plugins;
  return getEnveloped;
}
__name(envelop, "envelop");

// node_modules/@envelop/core/esm/plugins/use-masked-errors.js
init_modules_watch_stub();
var DEFAULT_ERROR_MESSAGE = "Unexpected error.";
function isGraphQLError(error) {
  return error instanceof Error && error.name === "GraphQLError";
}
__name(isGraphQLError, "isGraphQLError");
function isOriginalGraphQLError(error) {
  if (isGraphQLError(error)) {
    if (error.originalError != null) {
      return isOriginalGraphQLError(error.originalError);
    }
    return true;
  }
  return false;
}
__name(isOriginalGraphQLError, "isOriginalGraphQLError");
function createSerializableGraphQLError(message, originalError, isDev2) {
  const error = new Error(message);
  error.name = "GraphQLError";
  if (isDev2) {
    const extensions = originalError instanceof Error ? { message: originalError.message, stack: originalError.stack } : { message: String(originalError) };
    Object.defineProperty(error, "extensions", {
      get() {
        return extensions;
      }
    });
  }
  Object.defineProperty(error, "toJSON", {
    value() {
      return {
        message: error.message,
        extensions: error.extensions
      };
    }
  });
  return error;
}
__name(createSerializableGraphQLError, "createSerializableGraphQLError");
var createDefaultMaskError = /* @__PURE__ */ __name((isDev2) => (error, message) => {
  if (isOriginalGraphQLError(error)) {
    return error;
  }
  return createSerializableGraphQLError(message, error, isDev2);
}, "createDefaultMaskError");
var isDev = true;
var defaultMaskError = createDefaultMaskError(isDev);
var makeHandleResult = /* @__PURE__ */ __name((maskError2, message) => ({ result, setResult }) => {
  if (result.errors != null) {
    setResult({ ...result, errors: result.errors.map((error) => maskError2(error, message)) });
  }
}, "makeHandleResult");
function useMaskedErrors(opts) {
  const maskError2 = opts?.maskError ?? defaultMaskError;
  const message = opts?.errorMessage || DEFAULT_ERROR_MESSAGE;
  const handleResult = makeHandleResult(maskError2, message);
  return {
    onPluginInit(context) {
      context.registerContextErrorHandler(({ error, setError }) => {
        setError(maskError2(error, message));
      });
    },
    onExecute() {
      return {
        onExecuteDone(payload) {
          return handleStreamOrSingleExecutionResult(payload, handleResult);
        }
      };
    },
    onSubscribe() {
      return {
        onSubscribeResult(payload) {
          return handleStreamOrSingleExecutionResult(payload, handleResult);
        },
        onSubscribeError({ error, setError }) {
          setError(maskError2(error, message));
        }
      };
    }
  };
}
__name(useMaskedErrors, "useMaskedErrors");

// node_modules/@envelop/core/esm/plugins/use-extend-context.js
init_modules_watch_stub();
var useExtendContext = /* @__PURE__ */ __name((contextFactory) => ({
  onContextBuilding({ context, extendContext }) {
    return handleMaybePromise(() => contextFactory(context), (result) => extendContext(result));
  }
}), "useExtendContext");

// node_modules/@envelop/core/esm/plugins/use-engine.js
init_modules_watch_stub();
var useEngine = /* @__PURE__ */ __name((engine) => {
  return {
    onExecute: /* @__PURE__ */ __name(({ setExecuteFn }) => {
      if (engine.execute) {
        setExecuteFn(engine.execute);
      }
    }, "onExecute"),
    onParse: /* @__PURE__ */ __name(({ setParseFn }) => {
      if (engine.parse) {
        setParseFn(engine.parse);
      }
    }, "onParse"),
    onValidate: /* @__PURE__ */ __name(({ setValidationFn, addValidationRule }) => {
      if (engine.validate) {
        setValidationFn(engine.validate);
      }
      engine.specifiedRules?.map(addValidationRule);
    }, "onValidate"),
    onSubscribe: /* @__PURE__ */ __name(({ setSubscribeFn }) => {
      if (engine.subscribe) {
        setSubscribeFn(engine.subscribe);
      }
    }, "onSubscribe")
  };
}, "useEngine");

// node_modules/@graphql-tools/executor/esm/execution/execute.js
init_modules_watch_stub();

// node_modules/@whatwg-node/disposablestack/esm/index.js
init_modules_watch_stub();

// node_modules/@whatwg-node/disposablestack/esm/AsyncDisposableStack.js
init_modules_watch_stub();

// node_modules/@whatwg-node/disposablestack/esm/SupressedError.js
init_modules_watch_stub();
var PonyfillSuppressedError = class extends Error {
  static {
    __name(this, "PonyfillSuppressedError");
  }
  error;
  suppressed;
  // eslint-disable-next-line n/handle-callback-err
  constructor(error, suppressed, message) {
    super(message);
    this.error = error;
    this.suppressed = suppressed;
    this.name = "SuppressedError";
    Error.captureStackTrace(this, this.constructor);
  }
};

// node_modules/@whatwg-node/disposablestack/esm/symbols.js
init_modules_watch_stub();
var DisposableSymbols = {
  get dispose() {
    return Symbol.dispose || Symbol.for("dispose");
  },
  get asyncDispose() {
    return Symbol.asyncDispose || Symbol.for("asyncDispose");
  }
};

// node_modules/@whatwg-node/disposablestack/esm/utils.js
init_modules_watch_stub();
function isSyncDisposable(obj) {
  return obj?.[DisposableSymbols.dispose] != null;
}
__name(isSyncDisposable, "isSyncDisposable");
function isAsyncDisposable(obj) {
  return obj?.[DisposableSymbols.asyncDispose] != null;
}
__name(isAsyncDisposable, "isAsyncDisposable");

// node_modules/@whatwg-node/disposablestack/esm/AsyncDisposableStack.js
var SuppressedError2 = globalThis.SuppressedError || PonyfillSuppressedError;
var PonyfillAsyncDisposableStack = class _PonyfillAsyncDisposableStack {
  static {
    __name(this, "PonyfillAsyncDisposableStack");
  }
  callbacks = [];
  get disposed() {
    return this.callbacks.length === 0;
  }
  use(value) {
    if (isAsyncDisposable(value)) {
      this.callbacks.push(() => value[DisposableSymbols.asyncDispose]());
    } else if (isSyncDisposable(value)) {
      this.callbacks.push(() => value[DisposableSymbols.dispose]());
    }
    return value;
  }
  adopt(value, onDisposeAsync) {
    if (onDisposeAsync) {
      this.callbacks.push(() => onDisposeAsync(value));
    }
    return value;
  }
  defer(onDisposeAsync) {
    if (onDisposeAsync) {
      this.callbacks.push(onDisposeAsync);
    }
  }
  move() {
    const stack = new _PonyfillAsyncDisposableStack();
    stack.callbacks = this.callbacks;
    this.callbacks = [];
    return stack;
  }
  disposeAsync() {
    return this[DisposableSymbols.asyncDispose]();
  }
  _error;
  _iterateCallbacks() {
    const cb = this.callbacks.pop();
    if (cb) {
      return handleMaybePromise(cb, () => this._iterateCallbacks(), (error) => {
        this._error = this._error ? new SuppressedError2(error, this._error) : error;
        return this._iterateCallbacks();
      });
    }
  }
  [DisposableSymbols.asyncDispose]() {
    const res$ = this._iterateCallbacks();
    if (res$?.then) {
      return res$.then(() => {
        if (this._error) {
          const error = this._error;
          this._error = void 0;
          throw error;
        }
      });
    }
    if (this._error) {
      const error = this._error;
      this._error = void 0;
      throw error;
    }
    return void 0;
  }
  [Symbol.toStringTag] = "AsyncDisposableStack";
};

// node_modules/@whatwg-node/disposablestack/esm/DisposableStack.js
init_modules_watch_stub();
var SuppressedError3 = globalThis.SuppressedError || PonyfillSuppressedError;
var PonyfillDisposableStack = class _PonyfillDisposableStack {
  static {
    __name(this, "PonyfillDisposableStack");
  }
  callbacks = [];
  get disposed() {
    return this.callbacks.length === 0;
  }
  use(value) {
    if (isSyncDisposable(value)) {
      this.callbacks.push(() => value[DisposableSymbols.dispose]());
    }
    return value;
  }
  adopt(value, onDispose) {
    if (onDispose) {
      this.callbacks.push(() => onDispose(value));
    }
    return value;
  }
  defer(onDispose) {
    if (onDispose) {
      this.callbacks.push(onDispose);
    }
  }
  move() {
    const stack = new _PonyfillDisposableStack();
    stack.callbacks = this.callbacks;
    this.callbacks = [];
    return stack;
  }
  dispose() {
    return this[DisposableSymbols.dispose]();
  }
  _error;
  _iterateCallbacks() {
    const cb = this.callbacks.pop();
    if (cb) {
      try {
        cb();
      } catch (error) {
        this._error = this._error ? new SuppressedError3(error, this._error) : error;
      }
      return this._iterateCallbacks();
    }
  }
  [DisposableSymbols.dispose]() {
    this._iterateCallbacks();
    if (this._error) {
      const error = this._error;
      this._error = void 0;
      throw error;
    }
  }
  [Symbol.toStringTag] = "DisposableStack";
};

// node_modules/@whatwg-node/disposablestack/esm/index.js
var DisposableStack = globalThis.DisposableStack || PonyfillDisposableStack;
var AsyncDisposableStack = globalThis.AsyncDisposableStack || PonyfillAsyncDisposableStack;
var SuppressedError4 = globalThis.SuppressedError || PonyfillSuppressedError;

// node_modules/@graphql-tools/executor/esm/execution/coerceError.js
init_modules_watch_stub();
function coerceError(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error != null) {
    if ("message" in error && typeof error.message === "string") {
      let errorOptions;
      if ("cause" in error) {
        errorOptions = { cause: error.cause };
      }
      const coercedError = new Error(error.message, errorOptions);
      if ("stack" in error && typeof error.stack === "string") {
        coercedError.stack = error.stack;
      }
      if ("name" in error && typeof error.name === "string") {
        coercedError.name = error.name;
      }
      return coercedError;
    }
  }
  return new Error(String(error));
}
__name(coerceError, "coerceError");

// node_modules/@graphql-tools/executor/esm/execution/flattenAsyncIterable.js
init_modules_watch_stub();
function flattenAsyncIterable(iterable) {
  const topIterator = iterable[Symbol.asyncIterator]();
  let currentNestedIterator;
  let waitForCurrentNestedIterator;
  let done = false;
  async function next() {
    if (done) {
      return { value: void 0, done: true };
    }
    try {
      if (!currentNestedIterator) {
        if (waitForCurrentNestedIterator) {
          await waitForCurrentNestedIterator;
          return await next();
        }
        let resolve;
        waitForCurrentNestedIterator = new Promise((r) => {
          resolve = r;
        });
        const topIteratorResult = await topIterator.next();
        if (topIteratorResult.done) {
          done = true;
          return await next();
        }
        currentNestedIterator = topIteratorResult.value[Symbol.asyncIterator]();
        waitForCurrentNestedIterator = void 0;
        resolve();
        return await next();
      }
      const rememberCurrentNestedIterator = currentNestedIterator;
      const nestedIteratorResult = await currentNestedIterator.next();
      if (!nestedIteratorResult.done) {
        return nestedIteratorResult;
      }
      if (currentNestedIterator === rememberCurrentNestedIterator) {
        currentNestedIterator = void 0;
      }
      return await next();
    } catch (err) {
      done = true;
      throw err;
    }
  }
  __name(next, "next");
  return {
    next,
    async return() {
      done = true;
      await Promise.all([currentNestedIterator?.return?.(), topIterator.return?.()]);
      return { value: void 0, done: true };
    },
    async throw(error) {
      done = true;
      await Promise.all([currentNestedIterator?.throw?.(error), topIterator.throw?.(error)]);
      throw error;
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    async [DisposableSymbols.asyncDispose]() {
      done = true;
      await Promise.all([
        currentNestedIterator?.[DisposableSymbols.asyncDispose]?.(),
        topIterator?.[DisposableSymbols.asyncDispose]?.()
      ]);
    }
  };
}
__name(flattenAsyncIterable, "flattenAsyncIterable");

// node_modules/@graphql-tools/executor/esm/execution/invariant.js
init_modules_watch_stub();
function invariant2(condition, message) {
  if (!condition) {
    throw new Error(message != null ? message : "Unexpected invariant triggered.");
  }
}
__name(invariant2, "invariant");

// node_modules/@graphql-tools/executor/esm/execution/promiseForObject.js
init_modules_watch_stub();
function promiseForObject2(object, signal, signalPromise) {
  signal?.throwIfAborted();
  const resolvedObject = /* @__PURE__ */ Object.create(null);
  const promises = [];
  for (const key in object) {
    const valueSet$ = handleMaybePromise(() => object[key], (resolvedValue) => {
      resolvedObject[key] = resolvedValue;
    });
    if (isPromise2(valueSet$)) {
      promises.push(valueSet$);
    }
  }
  if (!promises.length) {
    return resolvedObject;
  }
  const promiseAll = promises.length === 1 ? promises[0] : Promise.all(promises);
  if (signalPromise) {
    return Promise.race([signalPromise, promiseAll]).then(() => resolvedObject);
  }
  return promiseAll.then(() => resolvedObject);
}
__name(promiseForObject2, "promiseForObject");

// node_modules/@graphql-tools/executor/esm/execution/values.js
init_modules_watch_stub();
function getVariableValues2(schema2, varDefNodes, inputs, options) {
  const errors = [];
  const maxErrors = options?.maxErrors;
  try {
    const coerced = coerceVariableValues2(schema2, varDefNodes, inputs, (error) => {
      if (maxErrors != null && errors.length >= maxErrors) {
        throw createGraphQLError("Too many errors processing variables, error limit reached. Execution aborted.");
      }
      errors.push(error);
    });
    if (errors.length === 0) {
      return { coerced };
    }
  } catch (error) {
    errors.push(error);
  }
  return { errors };
}
__name(getVariableValues2, "getVariableValues");
function coerceVariableValues2(schema2, varDefNodes, inputs, onError) {
  const coercedValues = {};
  for (const varDefNode of varDefNodes) {
    const varName = varDefNode.variable.name.value;
    const varType = typeFromAST(schema2, varDefNode.type);
    if (!isInputType(varType)) {
      const varTypeStr = print(varDefNode.type);
      onError(createGraphQLError(`Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`, { nodes: varDefNode.type }));
      continue;
    }
    if (!hasOwnProperty2(inputs, varName)) {
      if (varDefNode.defaultValue) {
        coercedValues[varName] = valueFromAST(varDefNode.defaultValue, varType);
      } else if (isNonNullType(varType)) {
        const varTypeStr = inspect2(varType);
        onError(createGraphQLError(`Variable "$${varName}" of required type "${varTypeStr}" was not provided.`, {
          nodes: varDefNode
        }));
      }
      continue;
    }
    const value = inputs[varName];
    if (value === null && isNonNullType(varType)) {
      const varTypeStr = inspect2(varType);
      onError(createGraphQLError(`Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`, {
        nodes: varDefNode
      }));
      continue;
    }
    coercedValues[varName] = coerceInputValue(value, varType, (path, invalidValue, error) => {
      let prefix = `Variable "$${varName}" got invalid value ` + inspect2(invalidValue);
      if (path.length > 0) {
        prefix += ` at "${varName}${printPathArray2(path)}"`;
      }
      onError(createGraphQLError(prefix + "; " + error.message, {
        nodes: varDefNode,
        originalError: error
      }));
    });
  }
  return coercedValues;
}
__name(coerceVariableValues2, "coerceVariableValues");

// node_modules/@graphql-tools/executor/esm/execution/execute.js
var collectSubfields4 = memoize32((exeContext, returnType, fieldNodes) => collectSubFields(exeContext.schema, exeContext.fragments, exeContext.variableValues, returnType, fieldNodes));
function execute2(args) {
  const exeContext = buildExecutionContext2(args);
  if (!("schema" in exeContext)) {
    return {
      errors: exeContext.map((e) => {
        Object.defineProperty(e, "extensions", {
          value: {
            ...e.extensions,
            http: {
              ...e.extensions?.["http"] || {},
              status: 400
            }
          }
        });
        return e;
      })
    };
  }
  return executeImpl(exeContext);
}
__name(execute2, "execute");
function executeImpl(exeContext) {
  exeContext.signal?.throwIfAborted();
  return handleMaybePromise(() => executeOperation2(exeContext), (data) => {
    const initialResult = buildResponse2(data, exeContext.errors);
    if (exeContext.subsequentPayloads.size > 0) {
      return {
        initialResult: {
          ...initialResult,
          hasNext: true
        },
        subsequentResults: yieldSubsequentPayloads(exeContext)
      };
    }
    return initialResult;
  }, (error) => {
    exeContext.signal?.throwIfAborted();
    if (error.errors) {
      exeContext.errors.push(...error.errors);
    } else {
      exeContext.errors.push(error);
    }
    return buildResponse2(null, exeContext.errors);
  });
}
__name(executeImpl, "executeImpl");
function buildResponse2(data, errors) {
  return errors.length === 0 ? { data } : { errors, data };
}
__name(buildResponse2, "buildResponse");
var getFragmentsFromDocument = memoize1(/* @__PURE__ */ __name(function getFragmentsFromDocument2(document) {
  const fragments = /* @__PURE__ */ Object.create(null);
  for (const definition of document.definitions) {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      fragments[definition.name.value] = definition;
    }
  }
  return fragments;
}, "getFragmentsFromDocument"));
function buildExecutionContext2(args) {
  const { schema: schema2, document, rootValue, contextValue, variableValues: rawVariableValues, operationName, fieldResolver, typeResolver, subscribeFieldResolver, signal } = args;
  signal?.throwIfAborted();
  assertValidSchema(schema2);
  const fragments = getFragmentsFromDocument(document);
  let operation;
  for (const definition of document.definitions) {
    switch (definition.kind) {
      case Kind.OPERATION_DEFINITION:
        if (operationName == null) {
          if (operation !== void 0) {
            return [
              createGraphQLError("Must provide operation name if query contains multiple operations.", {
                extensions: {
                  code: "OPERATION_RESOLUTION_FAILURE"
                }
              })
            ];
          }
          operation = definition;
        } else if (definition.name?.value === operationName) {
          operation = definition;
        }
        break;
      default:
    }
  }
  if (operation == null) {
    if (operationName != null) {
      return [
        createGraphQLError(`Unknown operation named "${operationName}".`, {
          extensions: {
            code: "OPERATION_RESOLUTION_FAILURE"
          }
        })
      ];
    }
    return [
      createGraphQLError("Must provide an operation.", {
        extensions: {
          code: "OPERATION_RESOLUTION_FAILURE"
        }
      })
    ];
  }
  const variableDefinitions = operation.variableDefinitions ?? [];
  const coercedVariableValues = getVariableValues2(schema2, variableDefinitions, rawVariableValues ?? {}, {
    maxErrors: 50
  });
  if (coercedVariableValues.errors) {
    return coercedVariableValues.errors;
  }
  signal?.throwIfAborted();
  let onSignalAbort;
  let signalPromise;
  if (signal) {
    const listeners = /* @__PURE__ */ new Set();
    const signalDeferred = createDeferredPromise();
    signalPromise = signalDeferred.promise;
    const sharedListener = /* @__PURE__ */ __name(() => {
      signalDeferred.reject(signal.reason);
      signal.removeEventListener("abort", sharedListener);
    }, "sharedListener");
    signal.addEventListener("abort", sharedListener, { once: true });
    signalPromise.catch(() => {
      for (const listener of listeners) {
        listener();
      }
      listeners.clear();
    });
    onSignalAbort = /* @__PURE__ */ __name((handler) => {
      listeners.add(handler);
    }, "onSignalAbort");
  }
  return {
    schema: schema2,
    fragments,
    rootValue,
    contextValue,
    operation,
    variableValues: coercedVariableValues.coerced,
    fieldResolver: fieldResolver ?? defaultFieldResolver2,
    typeResolver: typeResolver ?? defaultTypeResolver2,
    subscribeFieldResolver: subscribeFieldResolver ?? defaultFieldResolver2,
    subsequentPayloads: /* @__PURE__ */ new Set(),
    errors: [],
    signal,
    onSignalAbort,
    signalPromise
  };
}
__name(buildExecutionContext2, "buildExecutionContext");
function buildPerEventExecutionContext(exeContext, payload) {
  return {
    ...exeContext,
    rootValue: payload,
    subsequentPayloads: /* @__PURE__ */ new Set(),
    errors: []
  };
}
__name(buildPerEventExecutionContext, "buildPerEventExecutionContext");
function executeOperation2(exeContext) {
  const { operation, schema: schema2, fragments, variableValues, rootValue } = exeContext;
  const rootType = getDefinedRootType(schema2, operation.operation, [operation]);
  if (rootType == null) {
    createGraphQLError(`Schema is not configured to execute ${operation.operation} operation.`, {
      nodes: operation
    });
  }
  const { fields: rootFields, patches } = collectFields2(schema2, fragments, variableValues, rootType, operation.selectionSet);
  const path = void 0;
  let result;
  if (operation.operation === "mutation") {
    result = executeFieldsSerially2(exeContext, rootType, rootValue, path, rootFields);
  } else {
    result = executeFields2(exeContext, rootType, rootValue, path, rootFields);
  }
  for (const patch of patches) {
    const { label, fields: patchFields } = patch;
    executeDeferredFragment(exeContext, rootType, rootValue, patchFields, label, path);
  }
  return result;
}
__name(executeOperation2, "executeOperation");
function executeFieldsSerially2(exeContext, parentType, sourceValue, path, fields) {
  return promiseReduce2(fields, (results, [responseName, fieldNodes]) => {
    const fieldPath = addPath2(path, responseName, parentType.name);
    exeContext.signal?.throwIfAborted();
    return handleMaybePromise(() => executeField2(exeContext, parentType, sourceValue, fieldNodes, fieldPath), (result) => {
      if (result === void 0) {
        return results;
      }
      results[responseName] = result;
      return results;
    });
  }, /* @__PURE__ */ Object.create(null));
}
__name(executeFieldsSerially2, "executeFieldsSerially");
function executeFields2(exeContext, parentType, sourceValue, path, fields, asyncPayloadRecord) {
  const results = /* @__PURE__ */ Object.create(null);
  let containsPromise = false;
  try {
    for (const [responseName, fieldNodes] of fields) {
      exeContext.signal?.throwIfAborted();
      const fieldPath = addPath2(path, responseName, parentType.name);
      const result = executeField2(exeContext, parentType, sourceValue, fieldNodes, fieldPath, asyncPayloadRecord);
      if (result !== void 0) {
        results[responseName] = result;
        if (isPromise2(result)) {
          containsPromise = true;
        }
      }
    }
  } catch (error) {
    if (error !== exeContext.signal?.reason && containsPromise) {
      return handleMaybePromise(() => promiseForObject2(results, exeContext.signal), () => {
        throw error;
      }, () => {
        throw error;
      });
    }
    throw error;
  }
  if (!containsPromise) {
    return results;
  }
  return promiseForObject2(results, exeContext.signal, exeContext.signalPromise);
}
__name(executeFields2, "executeFields");
function executeField2(exeContext, parentType, source, fieldNodes, path, asyncPayloadRecord) {
  const errors = asyncPayloadRecord?.errors ?? exeContext.errors;
  const fieldDef = getFieldDef3(exeContext.schema, parentType, fieldNodes[0]);
  if (!fieldDef) {
    return;
  }
  const returnType = fieldDef.type;
  const resolveFn = fieldDef.resolve ?? exeContext.fieldResolver;
  const info = buildResolveInfo2(exeContext, fieldDef, fieldNodes, parentType, path);
  try {
    exeContext.signal?.throwIfAborted();
    const args = getArgumentValues2(fieldDef, fieldNodes[0], exeContext.variableValues);
    const contextValue = exeContext.contextValue;
    const result = resolveFn(source, args, contextValue, info);
    let completed;
    if (isPromise2(result)) {
      completed = result.then((resolved) => completeValue2(exeContext, returnType, fieldNodes, info, path, resolved, asyncPayloadRecord));
    } else {
      completed = completeValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
    }
    if (isPromise2(completed)) {
      return completed.then(void 0, (rawError) => {
        if (rawError instanceof AggregateError) {
          let result2;
          for (let rawErrorItem of rawError.errors) {
            rawErrorItem = coerceError(rawErrorItem);
            const error2 = locatedError(rawErrorItem, fieldNodes, pathToArray2(path));
            result2 = handleFieldError2(error2, returnType, errors);
            filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
          }
          return result2;
        }
        rawError = coerceError(rawError);
        const error = locatedError(rawError, fieldNodes, pathToArray2(path));
        const handledError = handleFieldError2(error, returnType, errors);
        filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
        return handledError;
      });
    }
    return completed;
  } catch (rawError) {
    if (rawError instanceof AggregateError) {
      let result;
      for (let rawErrorItem of rawError.errors) {
        rawErrorItem = coerceError(rawErrorItem);
        const error2 = locatedError(rawErrorItem, fieldNodes, pathToArray2(path));
        result = handleFieldError2(error2, returnType, errors);
        filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
      }
      return result;
    }
    const coercedError = coerceError(rawError);
    const error = locatedError(coercedError, fieldNodes, pathToArray2(path));
    const handledError = handleFieldError2(error, returnType, errors);
    filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
    return handledError;
  }
}
__name(executeField2, "executeField");
function buildResolveInfo2(exeContext, fieldDef, fieldNodes, parentType, path) {
  return {
    fieldName: fieldDef.name,
    fieldNodes,
    returnType: fieldDef.type,
    parentType,
    path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues,
    signal: exeContext.signal
  };
}
__name(buildResolveInfo2, "buildResolveInfo");
var CRITICAL_ERROR = "CRITICAL_ERROR";
function handleFieldError2(error, returnType, errors) {
  if (isNonNullType(returnType)) {
    throw error;
  }
  if (error.extensions?.[CRITICAL_ERROR]) {
    throw error;
  }
  errors.push(error);
  return null;
}
__name(handleFieldError2, "handleFieldError");
function completeValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  if (result instanceof Error) {
    throw result;
  }
  if (isNonNullType(returnType)) {
    const completed = completeValue2(exeContext, returnType.ofType, fieldNodes, info, path, result, asyncPayloadRecord);
    if (completed === null) {
      throw new Error(`Cannot return null for non-nullable field ${info.parentType.name}.${info.fieldName}.`);
    }
    return completed;
  }
  if (result == null) {
    return null;
  }
  if (isListType(returnType)) {
    return completeListValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
  }
  if (isLeafType(returnType)) {
    return completeLeafValue2(returnType, result);
  }
  if (isAbstractType(returnType)) {
    return completeAbstractValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
  }
  if (isObjectType(returnType)) {
    return completeObjectValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
  }
  console.assert(false, "Cannot complete value of unexpected output type: " + inspect2(returnType));
}
__name(completeValue2, "completeValue");
function getStreamValues(exeContext, fieldNodes, path) {
  if (typeof path.key === "number") {
    return;
  }
  const stream = getDirectiveValues(GraphQLStreamDirective, fieldNodes[0], exeContext.variableValues);
  if (!stream) {
    return;
  }
  if (stream.if === false) {
    return;
  }
  invariant2(typeof stream["initialCount"] === "number", "initialCount must be a number");
  invariant2(stream["initialCount"] >= 0, "initialCount must be a positive integer");
  return {
    initialCount: stream["initialCount"],
    label: typeof stream["label"] === "string" ? stream["label"] : void 0
  };
}
__name(getStreamValues, "getStreamValues");
async function completeAsyncIteratorValue(exeContext, itemType, fieldNodes, info, path, iterator, asyncPayloadRecord) {
  exeContext.signal?.throwIfAborted();
  if (iterator.return) {
    exeContext.onSignalAbort?.(() => {
      iterator.return?.();
    });
  }
  const errors = asyncPayloadRecord?.errors ?? exeContext.errors;
  const stream = getStreamValues(exeContext, fieldNodes, path);
  let containsPromise = false;
  const completedResults = [];
  let index = 0;
  while (true) {
    if (stream && typeof stream.initialCount === "number" && index >= stream.initialCount) {
      executeStreamIterator(index, iterator, exeContext, fieldNodes, info, itemType, path, stream.label, asyncPayloadRecord);
      break;
    }
    const itemPath = addPath2(path, index, void 0);
    let iteration;
    try {
      iteration = await iterator.next();
      if (iteration.done) {
        break;
      }
    } catch (rawError) {
      const coercedError = coerceError(rawError);
      const error = locatedError(coercedError, fieldNodes, pathToArray2(itemPath));
      completedResults.push(handleFieldError2(error, itemType, errors));
      break;
    }
    if (completeListItemValue(iteration.value, completedResults, errors, exeContext, itemType, fieldNodes, info, itemPath, asyncPayloadRecord)) {
      containsPromise = true;
    }
    index += 1;
  }
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
__name(completeAsyncIteratorValue, "completeAsyncIteratorValue");
function completeListValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  const itemType = returnType.ofType;
  const errors = asyncPayloadRecord?.errors ?? exeContext.errors;
  if (isAsyncIterable2(result)) {
    const iterator = result[Symbol.asyncIterator]();
    return completeAsyncIteratorValue(exeContext, itemType, fieldNodes, info, path, iterator, asyncPayloadRecord);
  }
  if (!isIterableObject2(result)) {
    throw createGraphQLError(`Expected Iterable, but did not find one for field "${info.parentType.name}.${info.fieldName}".`);
  }
  const stream = getStreamValues(exeContext, fieldNodes, path);
  let containsPromise = false;
  let previousAsyncPayloadRecord = asyncPayloadRecord;
  const completedResults = [];
  let index = 0;
  for (const item of result) {
    const itemPath = addPath2(path, index, void 0);
    if (stream && typeof stream.initialCount === "number" && index >= stream.initialCount) {
      previousAsyncPayloadRecord = executeStreamField(path, itemPath, item, exeContext, fieldNodes, info, itemType, stream.label, previousAsyncPayloadRecord);
      index++;
      continue;
    }
    if (completeListItemValue(item, completedResults, errors, exeContext, itemType, fieldNodes, info, itemPath, asyncPayloadRecord)) {
      containsPromise = true;
    }
    index++;
  }
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
__name(completeListValue2, "completeListValue");
function completeListItemValue(item, completedResults, errors, exeContext, itemType, fieldNodes, info, itemPath, asyncPayloadRecord) {
  try {
    let completedItem;
    if (isPromise2(item)) {
      completedItem = item.then((resolved) => completeValue2(exeContext, itemType, fieldNodes, info, itemPath, resolved, asyncPayloadRecord));
    } else {
      completedItem = completeValue2(exeContext, itemType, fieldNodes, info, itemPath, item, asyncPayloadRecord);
    }
    if (isPromise2(completedItem)) {
      completedResults.push(completedItem.then(void 0, (rawError) => {
        rawError = coerceError(rawError);
        const error = locatedError(rawError, fieldNodes, pathToArray2(itemPath));
        const handledError = handleFieldError2(error, itemType, errors);
        filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
        return handledError;
      }));
      return true;
    }
    completedResults.push(completedItem);
  } catch (rawError) {
    const coercedError = coerceError(rawError);
    const error = locatedError(coercedError, fieldNodes, pathToArray2(itemPath));
    const handledError = handleFieldError2(error, itemType, errors);
    filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
    completedResults.push(handledError);
  }
  return false;
}
__name(completeListItemValue, "completeListItemValue");
function completeLeafValue2(returnType, result) {
  let serializedResult;
  try {
    serializedResult = returnType.serialize(result);
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw new Error(err.message);
    }
    throw err;
  }
  if (serializedResult == null) {
    throw new Error(`Expected \`${inspect2(returnType)}.serialize(${inspect2(result)})\` to return non-nullable value, returned: ${inspect2(serializedResult)}`);
  }
  return serializedResult;
}
__name(completeLeafValue2, "completeLeafValue");
function completeAbstractValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  const resolveTypeFn = returnType.resolveType ?? exeContext.typeResolver;
  const contextValue = exeContext.contextValue;
  const runtimeType = resolveTypeFn(result, contextValue, info, returnType);
  if (isPromise2(runtimeType)) {
    return runtimeType.then((resolvedRuntimeType) => completeObjectValue2(exeContext, ensureValidRuntimeType2(resolvedRuntimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result, asyncPayloadRecord));
  }
  return completeObjectValue2(exeContext, ensureValidRuntimeType2(runtimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result, asyncPayloadRecord);
}
__name(completeAbstractValue2, "completeAbstractValue");
function ensureValidRuntimeType2(runtimeTypeName, exeContext, returnType, fieldNodes, info, result) {
  if (runtimeTypeName == null) {
    throw createGraphQLError(`Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}". Either the "${returnType.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`, { nodes: fieldNodes });
  }
  if (isObjectType(runtimeTypeName)) {
    if (versionInfo.major >= 16) {
      throw createGraphQLError("Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead.");
    }
    runtimeTypeName = runtimeTypeName.name;
  }
  if (typeof runtimeTypeName !== "string") {
    throw createGraphQLError(`Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}" with value ${inspect2(result)}, received "${inspect2(runtimeTypeName)}".`);
  }
  const runtimeType = exeContext.schema.getType(runtimeTypeName);
  if (runtimeType == null) {
    throw createGraphQLError(`Abstract type "${returnType.name}" was resolved to a type "${runtimeTypeName}" that does not exist inside the schema.`, { nodes: fieldNodes });
  }
  if (!isObjectType(runtimeType)) {
    throw createGraphQLError(`Abstract type "${returnType.name}" was resolved to a non-object type "${runtimeTypeName}".`, { nodes: fieldNodes });
  }
  if (!exeContext.schema.isSubType(returnType, runtimeType)) {
    throw createGraphQLError(`Runtime Object type "${runtimeType.name}" is not a possible type for "${returnType.name}".`, { nodes: fieldNodes });
  }
  return runtimeType;
}
__name(ensureValidRuntimeType2, "ensureValidRuntimeType");
function completeObjectValue2(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  if (returnType.isTypeOf) {
    const isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);
    if (isPromise2(isTypeOf)) {
      return isTypeOf.then((resolvedIsTypeOf) => {
        if (!resolvedIsTypeOf) {
          throw invalidReturnTypeError2(returnType, result, fieldNodes);
        }
        return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result, asyncPayloadRecord);
      });
    }
    if (!isTypeOf) {
      throw invalidReturnTypeError2(returnType, result, fieldNodes);
    }
  }
  return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result, asyncPayloadRecord);
}
__name(completeObjectValue2, "completeObjectValue");
function invalidReturnTypeError2(returnType, result, fieldNodes) {
  return createGraphQLError(`Expected value of type "${returnType.name}" but got: ${inspect2(result)}.`, {
    nodes: fieldNodes
  });
}
__name(invalidReturnTypeError2, "invalidReturnTypeError");
function collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result, asyncPayloadRecord) {
  const { fields: subFieldNodes, patches: subPatches } = collectSubfields4(exeContext, returnType, fieldNodes);
  const subFields = executeFields2(exeContext, returnType, result, path, subFieldNodes, asyncPayloadRecord);
  for (const subPatch of subPatches) {
    const { label, fields: subPatchFieldNodes } = subPatch;
    executeDeferredFragment(exeContext, returnType, result, subPatchFieldNodes, label, path, asyncPayloadRecord);
  }
  return subFields;
}
__name(collectAndExecuteSubfields, "collectAndExecuteSubfields");
var defaultTypeResolver2 = /* @__PURE__ */ __name(function(value, contextValue, info, abstractType) {
  if (isObjectLike2(value) && typeof value["__typename"] === "string") {
    return value["__typename"];
  }
  const possibleTypes = info.schema.getPossibleTypes(abstractType);
  const promisedIsTypeOfResults = [];
  for (let i = 0; i < possibleTypes.length; i++) {
    const type = possibleTypes[i];
    if (type.isTypeOf) {
      const isTypeOfResult = type.isTypeOf(value, contextValue, info);
      if (isPromise2(isTypeOfResult)) {
        promisedIsTypeOfResults[i] = isTypeOfResult;
      } else if (isTypeOfResult) {
        return type.name;
      }
    }
  }
  if (promisedIsTypeOfResults.length) {
    return Promise.all(promisedIsTypeOfResults).then((isTypeOfResults) => {
      for (let i = 0; i < isTypeOfResults.length; i++) {
        if (isTypeOfResults[i]) {
          return possibleTypes[i].name;
        }
      }
    });
  }
}, "defaultTypeResolver");
var defaultFieldResolver2 = /* @__PURE__ */ __name(function(source, args, contextValue, info) {
  if (isObjectLike2(source) || typeof source === "function") {
    const property = source[info.fieldName];
    if (typeof property === "function") {
      return source[info.fieldName](args, contextValue, info);
    }
    return property;
  }
}, "defaultFieldResolver");
function subscribe2(args) {
  const exeContext = buildExecutionContext2(args);
  if (!("schema" in exeContext)) {
    for (const error of exeContext) {
      const extensions = error.extensions ||= {};
      const httpExtensions = extensions["http"] ||= {};
      httpExtensions.status = 400;
      error.extensions["code"] = "BAD_USER_INPUT";
    }
    return {
      errors: exeContext
    };
  }
  const resultOrStream = createSourceEventStreamImpl(exeContext);
  if (isPromise2(resultOrStream)) {
    return resultOrStream.then((resolvedResultOrStream) => mapSourceToResponse(exeContext, resolvedResultOrStream));
  }
  return mapSourceToResponse(exeContext, resultOrStream);
}
__name(subscribe2, "subscribe");
function isIncrementalResults(results) {
  return results?.initialResult;
}
__name(isIncrementalResults, "isIncrementalResults");
function flattenIncrementalResults(incrementalResults) {
  const subsequentIterator = incrementalResults.subsequentResults;
  let initialResultSent = false;
  let done = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      if (done) {
        return fakePromise({ value: void 0, done });
      }
      if (initialResultSent) {
        return subsequentIterator.next();
      }
      initialResultSent = true;
      return fakePromise({
        value: incrementalResults.initialResult,
        done
      });
    },
    return() {
      done = true;
      return subsequentIterator.return();
    },
    throw(error) {
      done = true;
      return subsequentIterator.throw(error);
    },
    [DisposableSymbols.asyncDispose]() {
      done = true;
      return subsequentIterator?.[DisposableSymbols.asyncDispose]?.();
    }
  };
}
__name(flattenIncrementalResults, "flattenIncrementalResults");
async function* ensureAsyncIterable(someExecutionResult) {
  if ("initialResult" in someExecutionResult) {
    yield* flattenIncrementalResults(someExecutionResult);
  } else {
    yield someExecutionResult;
  }
}
__name(ensureAsyncIterable, "ensureAsyncIterable");
function mapSourceToResponse(exeContext, resultOrStream) {
  if (!isAsyncIterable2(resultOrStream)) {
    return resultOrStream;
  }
  return flattenAsyncIterable(mapAsyncIterator2(resultOrStream, (payload) => handleMaybePromise(() => executeImpl(buildPerEventExecutionContext(exeContext, payload)), ensureAsyncIterable), (error) => {
    if (error instanceof AggregateError) {
      throw new AggregateError(error.errors.map((e) => wrapError(e, exeContext.operation)), error.message);
    }
    throw wrapError(error, exeContext.operation);
  }));
}
__name(mapSourceToResponse, "mapSourceToResponse");
function wrapError(error, operation) {
  return createGraphQLError(error.message, {
    originalError: error,
    nodes: [operation]
  });
}
__name(wrapError, "wrapError");
function createSourceEventStreamImpl(exeContext) {
  try {
    const eventStream = executeSubscription2(exeContext);
    if (isPromise2(eventStream)) {
      return eventStream.then(void 0, (error) => ({ errors: [error] }));
    }
    return eventStream;
  } catch (error) {
    return { errors: [error] };
  }
}
__name(createSourceEventStreamImpl, "createSourceEventStreamImpl");
function executeSubscription2(exeContext) {
  const { schema: schema2, fragments, operation, variableValues, rootValue } = exeContext;
  const rootType = schema2.getSubscriptionType();
  if (rootType == null) {
    throw createGraphQLError("Schema is not configured to execute subscription operation.", {
      nodes: operation
    });
  }
  const { fields: rootFields } = collectFields2(schema2, fragments, variableValues, rootType, operation.selectionSet);
  const [responseName, fieldNodes] = [...rootFields.entries()][0];
  const fieldName = fieldNodes[0].name.value;
  const fieldDef = getFieldDef3(schema2, rootType, fieldNodes[0]);
  if (!fieldDef) {
    throw createGraphQLError(`The subscription field "${fieldName}" is not defined.`, {
      nodes: fieldNodes
    });
  }
  const path = addPath2(void 0, responseName, rootType.name);
  const info = buildResolveInfo2(exeContext, fieldDef, fieldNodes, rootType, path);
  try {
    const args = getArgumentValues2(fieldDef, fieldNodes[0], variableValues);
    const contextValue = exeContext.contextValue;
    const resolveFn = fieldDef.subscribe ?? exeContext.subscribeFieldResolver;
    const result = resolveFn(rootValue, args, contextValue, info);
    if (isPromise2(result)) {
      return result.then((result2) => assertEventStream(result2, exeContext.signal, exeContext.onSignalAbort)).then(void 0, (error) => {
        throw locatedError(error, fieldNodes, pathToArray2(path));
      });
    }
    return assertEventStream(result, exeContext.signal, exeContext.onSignalAbort);
  } catch (error) {
    throw locatedError(error, fieldNodes, pathToArray2(path));
  }
}
__name(executeSubscription2, "executeSubscription");
function assertEventStream(result, signal, onSignalAbort) {
  signal?.throwIfAborted();
  if (result instanceof Error) {
    throw result;
  }
  if (!isAsyncIterable2(result)) {
    throw createGraphQLError(`Subscription field must return Async Iterable. Received: ${inspect2(result)}.`);
  }
  if (onSignalAbort) {
    return {
      [Symbol.asyncIterator]() {
        const asyncIterator = result[Symbol.asyncIterator]();
        if (asyncIterator.return) {
          onSignalAbort?.(() => {
            asyncIterator.return?.();
          });
        }
        return asyncIterator;
      }
    };
  }
  return result;
}
__name(assertEventStream, "assertEventStream");
function executeDeferredFragment(exeContext, parentType, sourceValue, fields, label, path, parentContext) {
  const asyncPayloadRecord = new DeferredFragmentRecord({
    label,
    path,
    parentContext,
    exeContext
  });
  let promiseOrData;
  try {
    promiseOrData = executeFields2(exeContext, parentType, sourceValue, path, fields, asyncPayloadRecord);
    if (isPromise2(promiseOrData)) {
      promiseOrData = promiseOrData.then(null, (e) => {
        asyncPayloadRecord.errors.push(e);
        return null;
      });
    }
  } catch (e) {
    asyncPayloadRecord.errors.push(e);
    promiseOrData = null;
  }
  asyncPayloadRecord.addData(promiseOrData);
}
__name(executeDeferredFragment, "executeDeferredFragment");
function executeStreamField(path, itemPath, item, exeContext, fieldNodes, info, itemType, label, parentContext) {
  const asyncPayloadRecord = new StreamRecord({
    label,
    path: itemPath,
    parentContext,
    exeContext
  });
  let completedItem;
  try {
    try {
      if (isPromise2(item)) {
        completedItem = item.then((resolved) => completeValue2(exeContext, itemType, fieldNodes, info, itemPath, resolved, asyncPayloadRecord));
      } else {
        completedItem = completeValue2(exeContext, itemType, fieldNodes, info, itemPath, item, asyncPayloadRecord);
      }
      if (isPromise2(completedItem)) {
        completedItem = completedItem.then(void 0, (rawError) => {
          rawError = coerceError(rawError);
          const error = locatedError(rawError, fieldNodes, pathToArray2(itemPath));
          const handledError = handleFieldError2(error, itemType, asyncPayloadRecord.errors);
          filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
          return handledError;
        });
      }
    } catch (rawError) {
      const coercedError = coerceError(rawError);
      const error = locatedError(coercedError, fieldNodes, pathToArray2(itemPath));
      completedItem = handleFieldError2(error, itemType, asyncPayloadRecord.errors);
      filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
    }
  } catch (error) {
    asyncPayloadRecord.errors.push(error);
    filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
    asyncPayloadRecord.addItems(null);
    return asyncPayloadRecord;
  }
  let completedItems;
  if (isPromise2(completedItem)) {
    completedItems = completedItem.then((value) => [value], (error) => {
      asyncPayloadRecord.errors.push(error);
      filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
      return null;
    });
  } else {
    completedItems = [completedItem];
  }
  asyncPayloadRecord.addItems(completedItems);
  return asyncPayloadRecord;
}
__name(executeStreamField, "executeStreamField");
async function executeStreamIteratorItem(iterator, exeContext, fieldNodes, info, itemType, asyncPayloadRecord, itemPath) {
  let item;
  try {
    const { value, done } = await iterator.next();
    if (done) {
      asyncPayloadRecord.setIsCompletedIterator();
      return { done, value: void 0 };
    }
    item = value;
  } catch (rawError) {
    const coercedError = coerceError(rawError);
    const error = locatedError(coercedError, fieldNodes, pathToArray2(itemPath));
    const value = handleFieldError2(error, itemType, asyncPayloadRecord.errors);
    return { done: true, value };
  }
  let completedItem;
  try {
    completedItem = completeValue2(exeContext, itemType, fieldNodes, info, itemPath, item, asyncPayloadRecord);
    if (isPromise2(completedItem)) {
      completedItem = completedItem.then(void 0, (rawError) => {
        const error = locatedError(rawError, fieldNodes, pathToArray2(itemPath));
        const handledError = handleFieldError2(error, itemType, asyncPayloadRecord.errors);
        filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
        return handledError;
      });
    }
    return { done: false, value: completedItem };
  } catch (rawError) {
    const error = locatedError(rawError, fieldNodes, pathToArray2(itemPath));
    const value = handleFieldError2(error, itemType, asyncPayloadRecord.errors);
    filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
    return { done: false, value };
  }
}
__name(executeStreamIteratorItem, "executeStreamIteratorItem");
async function executeStreamIterator(initialIndex, iterator, exeContext, fieldNodes, info, itemType, path, label, parentContext) {
  let index = initialIndex;
  let previousAsyncPayloadRecord = parentContext ?? void 0;
  while (true) {
    const itemPath = addPath2(path, index, void 0);
    const asyncPayloadRecord = new StreamRecord({
      label,
      path: itemPath,
      parentContext: previousAsyncPayloadRecord,
      iterator,
      exeContext
    });
    let iteration;
    try {
      iteration = await executeStreamIteratorItem(iterator, exeContext, fieldNodes, info, itemType, asyncPayloadRecord, itemPath);
    } catch (error) {
      asyncPayloadRecord.errors.push(error);
      filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
      asyncPayloadRecord.addItems(null);
      if (iterator?.return) {
        iterator.return().catch(() => {
        });
      }
      return;
    }
    const { done, value: completedItem } = iteration;
    let completedItems;
    if (isPromise2(completedItem)) {
      completedItems = completedItem.then((value) => [value], (error) => {
        asyncPayloadRecord.errors.push(error);
        filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
        return null;
      });
    } else {
      completedItems = [completedItem];
    }
    asyncPayloadRecord.addItems(completedItems);
    if (done) {
      break;
    }
    previousAsyncPayloadRecord = asyncPayloadRecord;
    index++;
  }
}
__name(executeStreamIterator, "executeStreamIterator");
function filterSubsequentPayloads(exeContext, nullPath, currentAsyncRecord) {
  const nullPathArray = pathToArray2(nullPath);
  exeContext.subsequentPayloads.forEach((asyncRecord) => {
    if (asyncRecord === currentAsyncRecord) {
      return;
    }
    for (let i = 0; i < nullPathArray.length; i++) {
      if (asyncRecord.path[i] !== nullPathArray[i]) {
        return;
      }
    }
    if (isStreamPayload(asyncRecord) && asyncRecord.iterator?.return) {
      asyncRecord.iterator.return().catch(() => {
      });
    }
    exeContext.subsequentPayloads.delete(asyncRecord);
  });
}
__name(filterSubsequentPayloads, "filterSubsequentPayloads");
function getCompletedIncrementalResults(exeContext) {
  const incrementalResults = [];
  for (const asyncPayloadRecord of exeContext.subsequentPayloads) {
    const incrementalResult = {};
    if (!asyncPayloadRecord.isCompleted) {
      continue;
    }
    exeContext.subsequentPayloads.delete(asyncPayloadRecord);
    if (isStreamPayload(asyncPayloadRecord)) {
      const items = asyncPayloadRecord.items;
      if (asyncPayloadRecord.isCompletedIterator) {
        continue;
      }
      incrementalResult.items = items;
    } else {
      const data = asyncPayloadRecord.data;
      incrementalResult.data = data ?? null;
    }
    incrementalResult.path = asyncPayloadRecord.path;
    if (asyncPayloadRecord.label) {
      incrementalResult.label = asyncPayloadRecord.label;
    }
    if (asyncPayloadRecord.errors.length > 0) {
      incrementalResult.errors = asyncPayloadRecord.errors;
    }
    incrementalResults.push(incrementalResult);
  }
  return incrementalResults;
}
__name(getCompletedIncrementalResults, "getCompletedIncrementalResults");
function yieldSubsequentPayloads(exeContext) {
  let isDone = false;
  async function next() {
    if (isDone) {
      return { value: void 0, done: true };
    }
    const subSequentPayloadPromises = Array.from(exeContext.subsequentPayloads).map((record) => record.promise);
    if (exeContext.signalPromise) {
      await Promise.race([exeContext.signalPromise, ...subSequentPayloadPromises]);
    } else {
      await Promise.race(subSequentPayloadPromises);
    }
    if (isDone) {
      return { value: void 0, done: true };
    }
    const incremental = getCompletedIncrementalResults(exeContext);
    const hasNext = exeContext.subsequentPayloads.size > 0;
    if (!incremental.length && hasNext) {
      return next();
    }
    if (!hasNext) {
      isDone = true;
    }
    return {
      value: incremental.length ? { incremental, hasNext } : { hasNext },
      done: false
    };
  }
  __name(next, "next");
  function returnStreamIterators() {
    const promises = [];
    exeContext.subsequentPayloads.forEach((asyncPayloadRecord) => {
      if (isStreamPayload(asyncPayloadRecord) && asyncPayloadRecord.iterator?.return) {
        promises.push(asyncPayloadRecord.iterator.return());
      }
    });
    return Promise.all(promises);
  }
  __name(returnStreamIterators, "returnStreamIterators");
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next,
    async return() {
      await returnStreamIterators();
      isDone = true;
      return { value: void 0, done: true };
    },
    async throw(error) {
      await returnStreamIterators();
      isDone = true;
      throw error;
    },
    async [DisposableSymbols.asyncDispose]() {
      await returnStreamIterators();
      isDone = true;
    }
  };
}
__name(yieldSubsequentPayloads, "yieldSubsequentPayloads");
var DeferredFragmentRecord = class {
  static {
    __name(this, "DeferredFragmentRecord");
  }
  type;
  errors;
  label;
  path;
  promise;
  data;
  parentContext;
  isCompleted;
  _exeContext;
  _resolve;
  constructor(opts) {
    this.type = "defer";
    this.label = opts.label;
    this.path = pathToArray2(opts.path);
    this.parentContext = opts.parentContext;
    this.errors = [];
    this._exeContext = opts.exeContext;
    this._exeContext.subsequentPayloads.add(this);
    this.isCompleted = false;
    this.data = null;
    this.promise = new Promise((resolve) => {
      this._resolve = (MaybePromise) => {
        resolve(MaybePromise);
      };
    }).then((data) => {
      this.data = data;
      this.isCompleted = true;
    });
  }
  addData(data) {
    const parentData = this.parentContext?.promise;
    if (parentData) {
      this._resolve?.(parentData.then(() => data));
      return;
    }
    this._resolve?.(data);
  }
};
var StreamRecord = class {
  static {
    __name(this, "StreamRecord");
  }
  type;
  errors;
  label;
  path;
  items;
  promise;
  parentContext;
  iterator;
  isCompletedIterator;
  isCompleted;
  _exeContext;
  _resolve;
  constructor(opts) {
    this.type = "stream";
    this.items = null;
    this.label = opts.label;
    this.path = pathToArray2(opts.path);
    this.parentContext = opts.parentContext;
    this.iterator = opts.iterator;
    this.errors = [];
    this._exeContext = opts.exeContext;
    this._exeContext.subsequentPayloads.add(this);
    this.isCompleted = false;
    this.items = null;
    this.promise = new Promise((resolve) => {
      this._resolve = (MaybePromise) => {
        resolve(MaybePromise);
      };
    }).then((items) => {
      this.items = items;
      this.isCompleted = true;
    });
  }
  addItems(items) {
    const parentData = this.parentContext?.promise;
    if (parentData) {
      this._resolve?.(parentData.then(() => items));
      return;
    }
    this._resolve?.(items);
  }
  setIsCompletedIterator() {
    this.isCompletedIterator = true;
  }
};
function isStreamPayload(asyncPayload) {
  return asyncPayload.type === "stream";
}
__name(isStreamPayload, "isStreamPayload");
function getFieldDef3(schema2, parentType, fieldNode) {
  const fieldName = fieldNode.name.value;
  if (fieldName === SchemaMetaFieldDef.name && schema2.getQueryType() === parentType) {
    return SchemaMetaFieldDef;
  } else if (fieldName === TypeMetaFieldDef.name && schema2.getQueryType() === parentType) {
    return TypeMetaFieldDef;
  } else if (fieldName === TypeNameMetaFieldDef.name) {
    return TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}
__name(getFieldDef3, "getFieldDef");

// node_modules/@graphql-tools/executor/esm/execution/normalizedExecutor.js
init_modules_watch_stub();
function normalizedExecutor(args) {
  const operationAST = getOperationAST(args.document, args.operationName);
  if (operationAST == null) {
    throw new Error("Must provide an operation.");
  }
  if (operationAST.operation === "subscription") {
    return subscribe2(args);
  }
  return handleMaybePromise(() => execute2(args), (result) => {
    if (isIncrementalResults(result)) {
      return flattenIncrementalResults(result);
    }
    return result;
  });
}
__name(normalizedExecutor, "normalizedExecutor");
var executorFromSchema = memoize1(/* @__PURE__ */ __name(function executorFromSchema2(schema2) {
  return /* @__PURE__ */ __name(function schemaExecutor(request) {
    return normalizedExecutor({
      schema: schema2,
      document: request.document,
      variableValues: request.variables,
      operationName: request.operationName,
      rootValue: request.rootValue,
      contextValue: request.context,
      signal: request.signal || request.info?.signal
    });
  }, "schemaExecutor");
}, "executorFromSchema"));

// node_modules/graphql-yoga/esm/server.js
var defaultFetchAPI = __toESM(require_global_ponyfill(), 1);

// node_modules/@whatwg-node/server/esm/createServerAdapter.js
init_modules_watch_stub();
var DefaultFetchAPI = __toESM(require_global_ponyfill(), 1);

// node_modules/@whatwg-node/server/esm/utils.js
init_modules_watch_stub();
function isAsyncIterable5(body) {
  return body != null && typeof body === "object" && typeof body[Symbol.asyncIterator] === "function";
}
__name(isAsyncIterable5, "isAsyncIterable");
function getPort(nodeRequest) {
  if (nodeRequest.socket?.localPort) {
    return nodeRequest.socket?.localPort;
  }
  const hostInHeader = nodeRequest.headers?.[":authority"] || nodeRequest.headers?.host;
  const portInHeader = hostInHeader?.split(":")?.[1];
  if (portInHeader) {
    return portInHeader;
  }
  return 80;
}
__name(getPort, "getPort");
function getHostnameWithPort(nodeRequest) {
  if (nodeRequest.headers?.[":authority"]) {
    return nodeRequest.headers?.[":authority"];
  }
  if (nodeRequest.headers?.host) {
    return nodeRequest.headers?.host;
  }
  const port = getPort(nodeRequest);
  if (nodeRequest.hostname) {
    return nodeRequest.hostname + ":" + port;
  }
  const localIp = nodeRequest.socket?.localAddress;
  if (localIp && !localIp?.includes("::") && !localIp?.includes("ffff")) {
    return `${localIp}:${port}`;
  }
  return "localhost";
}
__name(getHostnameWithPort, "getHostnameWithPort");
function buildFullUrl(nodeRequest) {
  const hostnameWithPort = getHostnameWithPort(nodeRequest);
  const protocol = nodeRequest.protocol || (nodeRequest.socket?.encrypted ? "https" : "http");
  const endpoint = nodeRequest.originalUrl || nodeRequest.url || "/graphql";
  return `${protocol}://${hostnameWithPort}${endpoint}`;
}
__name(buildFullUrl, "buildFullUrl");
function isRequestBody(body) {
  const stringTag = body[Symbol.toStringTag];
  if (typeof body === "string" || stringTag === "Uint8Array" || stringTag === "Blob" || stringTag === "FormData" || stringTag === "URLSearchParams" || isAsyncIterable5(body)) {
    return true;
  }
  return false;
}
__name(isRequestBody, "isRequestBody");
function normalizeNodeRequest(nodeRequest, fetchAPI, nodeResponse, __useCustomAbortCtrl) {
  const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
  let fullUrl = buildFullUrl(rawRequest);
  if (nodeRequest.query) {
    const url = new fetchAPI.URL(fullUrl);
    for (const key in nodeRequest.query) {
      url.searchParams.set(key, nodeRequest.query[key]);
    }
    fullUrl = url.toString();
  }
  let normalizedHeaders = nodeRequest.headers;
  if (nodeRequest.headers?.[":method"]) {
    normalizedHeaders = {};
    for (const key in nodeRequest.headers) {
      if (!key.startsWith(":")) {
        normalizedHeaders[key] = nodeRequest.headers[key];
      }
    }
  }
  const controller = __useCustomAbortCtrl ? createCustomAbortControllerSignal() : new AbortController();
  if (nodeResponse?.once) {
    const closeEventListener = /* @__PURE__ */ __name(() => {
      if (!controller.signal.aborted) {
        Object.defineProperty(rawRequest, "aborted", { value: true });
        controller.abort(nodeResponse.errored ?? void 0);
      }
    }, "closeEventListener");
    nodeResponse.once("error", closeEventListener);
    nodeResponse.once("close", closeEventListener);
    nodeResponse.once("finish", () => {
      nodeResponse.removeListener("close", closeEventListener);
    });
  }
  if (nodeRequest.method === "GET" || nodeRequest.method === "HEAD") {
    return new fetchAPI.Request(fullUrl, {
      method: nodeRequest.method,
      headers: normalizedHeaders,
      signal: controller.signal
    });
  }
  const maybeParsedBody = nodeRequest.body;
  if (maybeParsedBody != null && Object.keys(maybeParsedBody).length > 0) {
    if (isRequestBody(maybeParsedBody)) {
      return new fetchAPI.Request(fullUrl, {
        method: nodeRequest.method || "GET",
        headers: normalizedHeaders,
        body: maybeParsedBody,
        signal: controller.signal
      });
    }
    const request = new fetchAPI.Request(fullUrl, {
      method: nodeRequest.method || "GET",
      headers: normalizedHeaders,
      signal: controller.signal
    });
    if (!request.headers.get("content-type")?.includes("json")) {
      request.headers.set("content-type", "application/json; charset=utf-8");
    }
    return new Proxy(request, {
      get: /* @__PURE__ */ __name((target, prop, receiver) => {
        switch (prop) {
          case "json":
            return () => fakePromise(maybeParsedBody);
          case "text":
            return () => fakePromise(JSON.stringify(maybeParsedBody));
          default:
            if (globalThis.Bun) {
              return Reflect.get(target, prop);
            }
            return Reflect.get(target, prop, receiver);
        }
      }, "get")
    });
  }
  return new fetchAPI.Request(fullUrl, {
    method: nodeRequest.method,
    headers: normalizedHeaders,
    signal: controller.signal,
    // @ts-expect-error - AsyncIterable is supported as body
    body: rawRequest,
    duplex: "half"
  });
}
__name(normalizeNodeRequest, "normalizeNodeRequest");
function isReadable(stream) {
  return stream.read != null;
}
__name(isReadable, "isReadable");
function isNodeRequest(request) {
  return isReadable(request);
}
__name(isNodeRequest, "isNodeRequest");
function isServerResponse(stream) {
  return stream != null && stream.setHeader != null && stream.end != null && stream.once != null && stream.write != null;
}
__name(isServerResponse, "isServerResponse");
function isReadableStream(stream) {
  return stream != null && stream.getReader != null;
}
__name(isReadableStream, "isReadableStream");
function isFetchEvent(event) {
  return event != null && event.request != null && event.respondWith != null;
}
__name(isFetchEvent, "isFetchEvent");
function configureSocket(rawRequest) {
  rawRequest?.socket?.setTimeout?.(0);
  rawRequest?.socket?.setNoDelay?.(true);
  rawRequest?.socket?.setKeepAlive?.(true);
}
__name(configureSocket, "configureSocket");
function endResponse(serverResponse) {
  serverResponse.end(null, null, null);
}
__name(endResponse, "endResponse");
function sendAsyncIterable(serverResponse, asyncIterable) {
  let closed = false;
  const closeEventListener = /* @__PURE__ */ __name(() => {
    closed = true;
  }, "closeEventListener");
  serverResponse.once("error", closeEventListener);
  serverResponse.once("close", closeEventListener);
  serverResponse.once("finish", () => {
    serverResponse.removeListener("close", closeEventListener);
    serverResponse.removeListener("error", closeEventListener);
  });
  const iterator = asyncIterable[Symbol.asyncIterator]();
  const pump = /* @__PURE__ */ __name(() => iterator.next().then(({ done, value }) => {
    if (closed || done) {
      return;
    }
    return handleMaybePromise(() => safeWrite(value, serverResponse), () => closed ? endResponse(serverResponse) : pump());
  }), "pump");
  return pump();
}
__name(sendAsyncIterable, "sendAsyncIterable");
function safeWrite(chunk, serverResponse) {
  const result = serverResponse.write(chunk);
  if (!result) {
    return new Promise((resolve) => serverResponse.once("drain", resolve));
  }
}
__name(safeWrite, "safeWrite");
var isNode1x = globalThis.process?.versions?.node?.startsWith("1");
function sendNodeResponse(fetchResponse, serverResponse, nodeRequest, __useSingleWriteHead) {
  if (serverResponse.closed || serverResponse.destroyed || serverResponse.writableEnded) {
    return;
  }
  if (!fetchResponse) {
    serverResponse.statusCode = 404;
    endResponse(serverResponse);
    return;
  }
  if (__useSingleWriteHead && // @ts-expect-error - headersInit is a private property
  fetchResponse.headers?.headersInit && // @ts-expect-error - headersInit is a private property
  !Array.isArray(fetchResponse.headers.headersInit) && // @ts-expect-error - headersInit is a private property
  !fetchResponse.headers.headersInit.get && // @ts-expect-error - map is a private property
  !fetchResponse.headers._map && // @ts-expect-error - _setCookies is a private property
  !fetchResponse.headers._setCookies?.length) {
    serverResponse.writeHead(
      fetchResponse.status,
      fetchResponse.statusText,
      // @ts-expect-error - headersInit is a private property
      fetchResponse.headers.headersInit
    );
  } else {
    if (serverResponse.setHeaders && !isNode1x) {
      serverResponse.setHeaders(fetchResponse.headers);
    } else {
      let setCookiesSet = false;
      fetchResponse.headers.forEach((value, key) => {
        if (key === "set-cookie") {
          if (setCookiesSet) {
            return;
          }
          setCookiesSet = true;
          const setCookies = fetchResponse.headers.getSetCookie?.();
          if (setCookies) {
            serverResponse.setHeader("set-cookie", setCookies);
            return;
          }
        }
        serverResponse.setHeader(key, value);
      });
    }
    serverResponse.writeHead(fetchResponse.status, fetchResponse.statusText);
  }
  if (fetchResponse["bodyType"] === "String") {
    return handleMaybePromise(
      // @ts-expect-error - bodyInit is a private property
      () => safeWrite(fetchResponse.bodyInit, serverResponse),
      () => endResponse(serverResponse)
    );
  }
  const bufOfRes = (
    // @ts-expect-error - _buffer is a private property
    fetchResponse._buffer
  );
  if (bufOfRes) {
    return handleMaybePromise(() => safeWrite(bufOfRes, serverResponse), () => endResponse(serverResponse));
  }
  const fetchBody = fetchResponse.body;
  if (fetchBody == null) {
    endResponse(serverResponse);
    return;
  }
  if (
    // @ts-expect-error - Uint8Array is a valid body type
    fetchBody[Symbol.toStringTag] === "Uint8Array"
  ) {
    return handleMaybePromise(() => safeWrite(fetchBody, serverResponse), () => endResponse(serverResponse));
  }
  configureSocket(nodeRequest);
  if (isReadable(fetchBody)) {
    serverResponse.once("close", () => {
      fetchBody.destroy();
    });
    fetchBody.pipe(serverResponse, {
      end: true
    });
    return;
  }
  if (isReadableStream(fetchBody)) {
    return sendReadableStream(nodeRequest, serverResponse, fetchBody);
  }
  if (isAsyncIterable5(fetchBody)) {
    return sendAsyncIterable(serverResponse, fetchBody);
  }
}
__name(sendNodeResponse, "sendNodeResponse");
function sendReadableStream(nodeRequest, serverResponse, readableStream) {
  const reader = readableStream.getReader();
  nodeRequest?.once?.("error", (err) => {
    reader.cancel(err);
  });
  function pump() {
    return reader.read().then(({ done, value }) => done ? endResponse(serverResponse) : handleMaybePromise(() => safeWrite(value, serverResponse), pump));
  }
  __name(pump, "pump");
  return pump();
}
__name(sendReadableStream, "sendReadableStream");
function isRequestInit(val) {
  return val != null && typeof val === "object" && ("body" in val || "cache" in val || "credentials" in val || "headers" in val || "integrity" in val || "keepalive" in val || "method" in val || "mode" in val || "redirect" in val || "referrer" in val || "referrerPolicy" in val || "signal" in val || "window" in val);
}
__name(isRequestInit, "isRequestInit");
function completeAssign(...args) {
  const [target, ...sources] = args.filter((arg) => arg != null && typeof arg === "object");
  sources.forEach((source) => {
    const descriptors = Object.getOwnPropertyNames(source).reduce((descriptors2, key) => {
      const descriptor = Object.getOwnPropertyDescriptor(source, key);
      if (descriptor) {
        descriptors2[key] = Object.getOwnPropertyDescriptor(source, key);
      }
      return descriptors2;
    }, {});
    Object.getOwnPropertySymbols(source).forEach((sym) => {
      const descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor?.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}
__name(completeAssign, "completeAssign");
function handleErrorFromRequestHandler(error, ResponseCtor) {
  return new ResponseCtor(error.stack || error.message || error.toString(), {
    status: error.status || 500
  });
}
__name(handleErrorFromRequestHandler, "handleErrorFromRequestHandler");
function isolateObject(originalCtx, waitUntilFn) {
  if (originalCtx == null) {
    if (waitUntilFn == null) {
      return {};
    }
    return {
      waitUntil: waitUntilFn
    };
  }
  return completeAssign(Object.create(originalCtx), {
    waitUntil: waitUntilFn
  }, originalCtx);
}
__name(isolateObject, "isolateObject");
function handleAbortSignalAndPromiseResponse(response$, abortSignal) {
  if (abortSignal?.aborted) {
    throw abortSignal.reason;
  }
  if (isPromise2(response$) && abortSignal) {
    let abortSignalFetchErrorHandler = function() {
      deferred$.reject(abortSignal.reason);
    };
    __name(abortSignalFetchErrorHandler, "abortSignalFetchErrorHandler");
    const deferred$ = createDeferredPromise();
    abortSignal.addEventListener("abort", abortSignalFetchErrorHandler, { once: true });
    response$.then(/* @__PURE__ */ __name(function fetchSuccessHandler(res) {
      deferred$.resolve(res);
    }, "fetchSuccessHandler")).catch(/* @__PURE__ */ __name(function fetchErrorHandler(err) {
      deferred$.reject(err);
    }, "fetchErrorHandler")).finally(() => {
      abortSignal.removeEventListener("abort", abortSignalFetchErrorHandler);
    });
    return deferred$.promise;
  }
  return response$;
}
__name(handleAbortSignalAndPromiseResponse, "handleAbortSignalAndPromiseResponse");
var terminateEvents = ["SIGINT", "exit", "SIGTERM"];
var disposableStacks = /* @__PURE__ */ new Set();
var eventListenerRegistered = false;
function ensureEventListenerForDisposableStacks() {
  if (eventListenerRegistered) {
    return;
  }
  eventListenerRegistered = true;
  for (const event of terminateEvents) {
    globalThis.process.once(event, /* @__PURE__ */ __name(function terminateHandler() {
      return Promise.allSettled([...disposableStacks].map((stack) => !stack.disposed && stack.disposeAsync()));
    }, "terminateHandler"));
  }
}
__name(ensureEventListenerForDisposableStacks, "ensureEventListenerForDisposableStacks");
function ensureDisposableStackRegisteredForTerminateEvents(disposableStack) {
  if (globalThis.process) {
    ensureEventListenerForDisposableStacks();
    if (!disposableStacks.has(disposableStack)) {
      disposableStacks.add(disposableStack);
      disposableStack.defer(() => {
        disposableStacks.delete(disposableStack);
      });
    }
  }
}
__name(ensureDisposableStackRegisteredForTerminateEvents, "ensureDisposableStackRegisteredForTerminateEvents");
var CustomAbortControllerSignal = class extends EventTarget {
  static {
    __name(this, "CustomAbortControllerSignal");
  }
  aborted = false;
  _onabort = null;
  _reason;
  constructor() {
    super();
    const nodeEvents = globalThis.process?.getBuiltinModule?.("node:events");
    if (nodeEvents?.kMaxEventTargetListeners) {
      this[nodeEvents.kMaxEventTargetListeners] = 0;
    }
  }
  throwIfAborted() {
    if (this._nativeCtrl?.signal?.throwIfAborted) {
      return this._nativeCtrl.signal.throwIfAborted();
    }
    if (this.aborted) {
      throw this._reason;
    }
  }
  _nativeCtrl;
  ensureNativeCtrl() {
    if (!this._nativeCtrl) {
      const isAborted = this.aborted;
      this._nativeCtrl = new AbortController();
      if (isAborted) {
        this._nativeCtrl.abort(this._reason);
      }
    }
    return this._nativeCtrl;
  }
  abort(reason) {
    if (this._nativeCtrl?.abort) {
      return this._nativeCtrl?.abort(reason);
    }
    this._reason = reason || new DOMException("This operation was aborted", "AbortError");
    this.aborted = true;
    this.dispatchEvent(new Event("abort"));
  }
  get signal() {
    if (this._nativeCtrl?.signal) {
      return this._nativeCtrl.signal;
    }
    return this;
  }
  get reason() {
    if (this._nativeCtrl?.signal) {
      return this._nativeCtrl.signal.reason;
    }
    return this._reason;
  }
  get onabort() {
    if (this._onabort) {
      return this._onabort;
    }
    return this._onabort;
  }
  set onabort(value) {
    if (this._nativeCtrl?.signal) {
      this._nativeCtrl.signal.onabort = value;
      return;
    }
    if (this._onabort) {
      this.removeEventListener("abort", this._onabort);
    }
    this._onabort = value;
    if (value) {
      this.addEventListener("abort", value);
    }
  }
};
function createCustomAbortControllerSignal() {
  if (globalThis.Bun || globalThis.Deno) {
    return new AbortController();
  }
  return new Proxy(new CustomAbortControllerSignal(), {
    get(target, prop, receiver) {
      if (prop.toString().includes("kDependantSignals")) {
        const nativeCtrl = target.ensureNativeCtrl();
        return Reflect.get(nativeCtrl.signal, prop, nativeCtrl.signal);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (prop.toString().includes("kDependantSignals")) {
        const nativeCtrl = target.ensureNativeCtrl();
        return Reflect.set(nativeCtrl.signal, prop, value, nativeCtrl.signal);
      }
      return Reflect.set(target, prop, value, receiver);
    },
    getPrototypeOf() {
      return AbortSignal.prototype;
    }
  });
}
__name(createCustomAbortControllerSignal, "createCustomAbortControllerSignal");

// node_modules/@whatwg-node/server/esm/uwebsockets.js
init_modules_watch_stub();
function isUWSResponse(res) {
  return !!res.onData;
}
__name(isUWSResponse, "isUWSResponse");
function getRequestFromUWSRequest({ req, res, fetchAPI, controller }) {
  const method = req.getMethod();
  let duplex;
  const chunks = [];
  const pushFns = [
    (chunk) => {
      chunks.push(chunk);
    }
  ];
  const push = /* @__PURE__ */ __name((chunk) => {
    for (const pushFn of pushFns) {
      pushFn(chunk);
    }
  }, "push");
  let stopped = false;
  const stopFns = [
    () => {
      stopped = true;
    }
  ];
  const stop = /* @__PURE__ */ __name(() => {
    for (const stopFn of stopFns) {
      stopFn();
    }
  }, "stop");
  res.onData(function(ab, isLast) {
    push(Buffer.from(Buffer.from(ab, 0, ab.byteLength)));
    if (isLast) {
      stop();
    }
  });
  let getReadableStream;
  if (method !== "get" && method !== "head") {
    duplex = "half";
    controller.signal.addEventListener("abort", () => {
      stop();
    }, { once: true });
    let readableStream;
    getReadableStream = /* @__PURE__ */ __name(() => {
      if (!readableStream) {
        readableStream = new fetchAPI.ReadableStream({
          start(streamCtrl) {
            for (const chunk of chunks) {
              streamCtrl.enqueue(chunk);
            }
            if (stopped) {
              streamCtrl.close();
              return;
            }
            pushFns.push((chunk) => {
              streamCtrl.enqueue(chunk);
            });
            stopFns.push(() => {
              if (controller.signal.reason) {
                streamCtrl.error(controller.signal.reason);
                return;
              }
              if (streamCtrl.desiredSize) {
                streamCtrl.close();
              }
            });
          }
        });
      }
      return readableStream;
    }, "getReadableStream");
  }
  const headers = new fetchAPI.Headers();
  req.forEach((key, value) => {
    headers.append(key, value);
  });
  let url = `http://localhost${req.getUrl()}`;
  const query = req.getQuery();
  if (query) {
    url += `?${query}`;
  }
  let buffer;
  function getBody() {
    if (!getReadableStream) {
      return null;
    }
    if (stopped) {
      return getBufferFromChunks();
    }
    return getReadableStream();
  }
  __name(getBody, "getBody");
  const request = new fetchAPI.Request(url, {
    method,
    headers,
    get body() {
      return getBody();
    },
    signal: controller.signal,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - not in the TS types yet
    duplex
  });
  function getBufferFromChunks() {
    if (!buffer) {
      buffer = chunks.length === 1 ? chunks[0] : Buffer.concat(chunks);
    }
    return buffer;
  }
  __name(getBufferFromChunks, "getBufferFromChunks");
  function collectBuffer() {
    if (stopped) {
      return fakePromise(getBufferFromChunks());
    }
    return new Promise((resolve, reject) => {
      try {
        stopFns.push(() => {
          resolve(getBufferFromChunks());
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  __name(collectBuffer, "collectBuffer");
  Object.defineProperties(request, {
    body: {
      get() {
        return getBody();
      },
      configurable: true,
      enumerable: true
    },
    json: {
      value() {
        return collectBuffer().then((b) => b.toString("utf8")).then((t) => JSON.parse(t));
      },
      configurable: true,
      enumerable: true
    },
    text: {
      value() {
        return collectBuffer().then((b) => b.toString("utf8"));
      },
      configurable: true,
      enumerable: true
    },
    arrayBuffer: {
      value() {
        return collectBuffer();
      },
      configurable: true,
      enumerable: true
    }
  });
  return request;
}
__name(getRequestFromUWSRequest, "getRequestFromUWSRequest");
function createWritableFromUWS(uwsResponse, fetchAPI) {
  return new fetchAPI.WritableStream({
    write(chunk) {
      uwsResponse.cork(() => {
        uwsResponse.write(chunk);
      });
    },
    close() {
      uwsResponse.cork(() => {
        uwsResponse.end();
      });
    }
  });
}
__name(createWritableFromUWS, "createWritableFromUWS");
function sendResponseToUwsOpts(uwsResponse, fetchResponse, controller, fetchAPI) {
  if (!fetchResponse) {
    uwsResponse.writeStatus("404 Not Found");
    uwsResponse.end();
    return;
  }
  const bufferOfRes = fetchResponse._buffer;
  const strBody = fetchResponse["bodyType"] === "String" ? fetchResponse.bodyInit : void 0;
  if (controller.signal.aborted) {
    return;
  }
  uwsResponse.cork(() => {
    uwsResponse.writeStatus(`${fetchResponse.status} ${fetchResponse.statusText}`);
    let isSetCookieHandled = false;
    for (const [key, value] of fetchResponse.headers) {
      if (key !== "content-length") {
        if (key === "set-cookie") {
          if (isSetCookieHandled) {
            continue;
          }
          isSetCookieHandled = true;
          const setCookies = fetchResponse.headers.getSetCookie?.();
          if (setCookies) {
            for (const setCookie of setCookies) {
              uwsResponse.writeHeader(key, setCookie);
            }
            continue;
          }
        }
        uwsResponse.writeHeader(key, value);
      }
    }
    if (strBody) {
      uwsResponse.end(strBody);
    } else if (bufferOfRes) {
      uwsResponse.end(bufferOfRes);
    } else if (!fetchResponse.body) {
      uwsResponse.end();
    }
  });
  if (strBody || bufferOfRes || !fetchResponse.body) {
    return;
  }
  controller.signal.addEventListener("abort", () => {
    if (!fetchResponse.body?.locked) {
      fetchResponse.body?.cancel(controller.signal.reason);
    }
  }, { once: true });
  return fetchResponse.body.pipeTo(createWritableFromUWS(uwsResponse, fetchAPI), {
    signal: controller.signal
  }).catch((err) => {
    if (controller.signal.aborted) {
      return;
    }
    throw err;
  });
}
__name(sendResponseToUwsOpts, "sendResponseToUwsOpts");

// node_modules/@whatwg-node/server/esm/createServerAdapter.js
function isRequestAccessible(serverContext) {
  try {
    return !!serverContext?.request;
  } catch {
    return false;
  }
}
__name(isRequestAccessible, "isRequestAccessible");
var EMPTY_OBJECT = {};
function createServerAdapter(serverAdapterBaseObject, options) {
  const useSingleWriteHead = options?.__useSingleWriteHead == null ? true : options.__useSingleWriteHead;
  const fetchAPI = {
    ...DefaultFetchAPI,
    ...options?.fetchAPI
  };
  const useCustomAbortCtrl = options?.__useCustomAbortCtrl == null ? fetchAPI.Request !== globalThis.Request : options.__useCustomAbortCtrl;
  const givenHandleRequest = typeof serverAdapterBaseObject === "function" ? serverAdapterBaseObject : serverAdapterBaseObject.handle;
  const onRequestHooks = [];
  const onResponseHooks = [];
  let instrumentation;
  const waitUntilPromises = /* @__PURE__ */ new Set();
  let _disposableStack;
  function ensureDisposableStack() {
    if (!_disposableStack) {
      _disposableStack = new AsyncDisposableStack();
      if (options?.disposeOnProcessTerminate) {
        ensureDisposableStackRegisteredForTerminateEvents(_disposableStack);
      }
      _disposableStack.defer(() => {
        if (waitUntilPromises.size > 0) {
          return Promise.allSettled(waitUntilPromises).then(() => {
            waitUntilPromises.clear();
          }, () => {
            waitUntilPromises.clear();
          });
        }
      });
    }
    return _disposableStack;
  }
  __name(ensureDisposableStack, "ensureDisposableStack");
  function waitUntil(maybePromise) {
    if (isPromise2(maybePromise)) {
      ensureDisposableStack();
      waitUntilPromises.add(maybePromise);
      maybePromise.then(() => {
        waitUntilPromises.delete(maybePromise);
      }, (err) => {
        console.error(`Unexpected error while waiting: ${err.message || err}`);
        waitUntilPromises.delete(maybePromise);
      });
    }
  }
  __name(waitUntil, "waitUntil");
  if (options?.plugins != null) {
    for (const plugin of options.plugins) {
      if (plugin.instrumentation) {
        instrumentation = instrumentation ? chain(instrumentation, plugin.instrumentation) : plugin.instrumentation;
      }
      if (plugin.onRequest) {
        onRequestHooks.push(plugin.onRequest);
      }
      if (plugin.onResponse) {
        onResponseHooks.push(plugin.onResponse);
      }
      const disposeFn = plugin[DisposableSymbols.dispose];
      if (disposeFn) {
        ensureDisposableStack().defer(disposeFn);
      }
      const asyncDisposeFn = plugin[DisposableSymbols.asyncDispose];
      if (asyncDisposeFn) {
        ensureDisposableStack().defer(asyncDisposeFn);
      }
      if (plugin.onDispose) {
        ensureDisposableStack().defer(plugin.onDispose);
      }
    }
  }
  let handleRequest = onRequestHooks.length > 0 || onResponseHooks.length > 0 ? /* @__PURE__ */ __name(function handleRequest2(request, serverContext) {
    let requestHandler = givenHandleRequest;
    let response;
    if (onRequestHooks.length === 0) {
      return handleEarlyResponse();
    }
    let url = request["parsedUrl"] || new Proxy(EMPTY_OBJECT, {
      get(_target, prop, _receiver) {
        url = new fetchAPI.URL(request.url, "http://localhost");
        return Reflect.get(url, prop, url);
      }
    });
    function handleResponse(response2) {
      if (onResponseHooks.length === 0) {
        return response2;
      }
      return handleMaybePromise(() => iterateAsync(onResponseHooks, (onResponseHook) => onResponseHook({
        request,
        response: response2,
        serverContext,
        setResponse(newResponse) {
          response2 = newResponse;
        },
        fetchAPI
      })), () => response2);
    }
    __name(handleResponse, "handleResponse");
    function handleEarlyResponse() {
      if (!response) {
        return handleMaybePromise(() => requestHandler(request, serverContext), handleResponse);
      }
      return handleResponse(response);
    }
    __name(handleEarlyResponse, "handleEarlyResponse");
    return handleMaybePromise(() => iterateAsync(onRequestHooks, (onRequestHook, stopEarly) => onRequestHook({
      request,
      setRequest(newRequest) {
        request = newRequest;
      },
      serverContext,
      fetchAPI,
      url,
      requestHandler,
      setRequestHandler(newRequestHandler) {
        requestHandler = newRequestHandler;
      },
      endResponse(newResponse) {
        response = newResponse;
        if (newResponse) {
          stopEarly();
        }
      }
    })), handleEarlyResponse);
  }, "handleRequest") : givenHandleRequest;
  if (instrumentation?.request) {
    const originalRequestHandler = handleRequest;
    handleRequest = /* @__PURE__ */ __name((request, initialContext) => {
      return getInstrumented({ request }).asyncFn(instrumentation.request, originalRequestHandler)(request, initialContext);
    }, "handleRequest");
  }
  function handleNodeRequest(nodeRequest, ...ctx) {
    const serverContext = ctx.length > 1 ? completeAssign(...ctx) : ctx[0] || {};
    if (!serverContext.waitUntil) {
      serverContext.waitUntil = waitUntil;
    }
    const request = normalizeNodeRequest(nodeRequest, fetchAPI, void 0, useCustomAbortCtrl);
    return handleRequest(request, serverContext);
  }
  __name(handleNodeRequest, "handleNodeRequest");
  function handleNodeRequestAndResponse(nodeRequest, nodeResponseOrContainer, ...ctx) {
    const nodeResponse = nodeResponseOrContainer.raw || nodeResponseOrContainer;
    const serverContext = ctx.length > 1 ? completeAssign(...ctx) : ctx[0] || {};
    if (!serverContext.waitUntil) {
      serverContext.waitUntil = waitUntil;
    }
    const request = normalizeNodeRequest(nodeRequest, fetchAPI, nodeResponse, useCustomAbortCtrl);
    return handleRequest(request, serverContext);
  }
  __name(handleNodeRequestAndResponse, "handleNodeRequestAndResponse");
  function requestListener(nodeRequest, nodeResponse, ...ctx) {
    const defaultServerContext = {
      req: nodeRequest,
      res: nodeResponse,
      waitUntil
    };
    return unfakePromise(fakePromise().then(() => handleNodeRequestAndResponse(nodeRequest, nodeResponse, defaultServerContext, ...ctx)).catch((err) => handleErrorFromRequestHandler(err, fetchAPI.Response)).then((response) => sendNodeResponse(response, nodeResponse, nodeRequest, useSingleWriteHead)).catch((err) => console.error(`Unexpected error while handling request: ${err.message || err}`)));
  }
  __name(requestListener, "requestListener");
  function handleUWS(res, req, ...ctx) {
    const defaultServerContext = {
      res,
      req,
      waitUntil
    };
    const filteredCtxParts = ctx.filter((partCtx) => partCtx != null);
    const serverContext = filteredCtxParts.length > 0 ? completeAssign(defaultServerContext, ...ctx) : defaultServerContext;
    const controller = useCustomAbortCtrl ? createCustomAbortControllerSignal() : new AbortController();
    const originalResEnd = res.end.bind(res);
    let resEnded = false;
    res.end = function(data) {
      resEnded = true;
      return originalResEnd(data);
    };
    const originalOnAborted = res.onAborted.bind(res);
    originalOnAborted(function() {
      controller.abort();
    });
    res.onAborted = function(cb) {
      controller.signal.addEventListener("abort", cb, { once: true });
    };
    const request = getRequestFromUWSRequest({
      req,
      res,
      fetchAPI,
      controller
    });
    return handleMaybePromise(() => handleMaybePromise(() => handleRequest(request, serverContext), (response) => response, (err) => handleErrorFromRequestHandler(err, fetchAPI.Response)), (response) => {
      if (!controller.signal.aborted && !resEnded) {
        return handleMaybePromise(() => sendResponseToUwsOpts(res, response, controller, fetchAPI), (r) => r, (err) => {
          console.error(`Unexpected error while handling request: ${err.message || err}`);
        });
      }
    });
  }
  __name(handleUWS, "handleUWS");
  function handleEvent(event, ...ctx) {
    if (!event.respondWith || !event.request) {
      throw new TypeError(`Expected FetchEvent, got ${event}`);
    }
    const filteredCtxParts = ctx.filter((partCtx) => partCtx != null);
    const serverContext = filteredCtxParts.length > 0 ? completeAssign({}, event, ...filteredCtxParts) : isolateObject(event);
    const response$ = handleRequest(event.request, serverContext);
    event.respondWith(response$);
  }
  __name(handleEvent, "handleEvent");
  function handleRequestWithWaitUntil(request, ...ctx) {
    const filteredCtxParts = ctx.filter((partCtx) => partCtx != null);
    const serverContext = filteredCtxParts.length > 1 ? completeAssign({}, ...filteredCtxParts) : isolateObject(filteredCtxParts[0], filteredCtxParts[0] == null || filteredCtxParts[0].waitUntil == null ? waitUntil : void 0);
    return handleRequest(request, serverContext);
  }
  __name(handleRequestWithWaitUntil, "handleRequestWithWaitUntil");
  const fetchFn = /* @__PURE__ */ __name((input, ...maybeCtx) => {
    if (typeof input === "string" || "href" in input) {
      const [initOrCtx, ...restOfCtx] = maybeCtx;
      if (isRequestInit(initOrCtx)) {
        const request2 = new fetchAPI.Request(input, initOrCtx);
        const res$2 = handleRequestWithWaitUntil(request2, ...restOfCtx);
        const signal = initOrCtx.signal;
        if (signal) {
          return handleAbortSignalAndPromiseResponse(res$2, signal);
        }
        return res$2;
      }
      const request = new fetchAPI.Request(input);
      return handleRequestWithWaitUntil(request, ...maybeCtx);
    }
    const res$ = handleRequestWithWaitUntil(input, ...maybeCtx);
    return handleAbortSignalAndPromiseResponse(res$, input.signal);
  }, "fetchFn");
  const genericRequestHandler = /* @__PURE__ */ __name((input, ...maybeCtx) => {
    const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
    if (isNodeRequest(input)) {
      if (!isServerResponse(initOrCtxOrRes)) {
        throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
      }
      return requestListener(input, initOrCtxOrRes, ...restOfCtx);
    }
    if (isUWSResponse(input)) {
      return handleUWS(input, initOrCtxOrRes, ...restOfCtx);
    }
    if (isServerResponse(initOrCtxOrRes)) {
      throw new TypeError("Got Node response without Node request");
    }
    if (isRequestAccessible(input)) {
      if (isFetchEvent(input)) {
        return handleEvent(input, ...maybeCtx);
      }
      return handleRequestWithWaitUntil(input.request, input, ...maybeCtx);
    }
    return fetchFn(input, ...maybeCtx);
  }, "genericRequestHandler");
  const adapterObj = {
    handleRequest: handleRequestWithWaitUntil,
    fetch: fetchFn,
    handleNodeRequest,
    handleNodeRequestAndResponse,
    requestListener,
    handleEvent,
    handleUWS,
    handle: genericRequestHandler,
    get disposableStack() {
      return ensureDisposableStack();
    },
    [DisposableSymbols.asyncDispose]() {
      if (_disposableStack && !_disposableStack.disposed) {
        return _disposableStack.disposeAsync();
      }
      return fakePromise();
    },
    dispose() {
      if (_disposableStack && !_disposableStack.disposed) {
        return _disposableStack.disposeAsync();
      }
      return fakePromise();
    },
    waitUntil
  };
  const serverAdapter = new Proxy(genericRequestHandler, {
    // It should have all the attributes of the handler function and the server instance
    has: /* @__PURE__ */ __name((_, prop) => {
      return prop in adapterObj || prop in genericRequestHandler || serverAdapterBaseObject && prop in serverAdapterBaseObject;
    }, "has"),
    get: /* @__PURE__ */ __name((_, prop) => {
      if (globalThis.Deno || prop === Symbol.asyncDispose || prop === Symbol.dispose) {
        const adapterProp2 = Reflect.get(adapterObj, prop, adapterObj);
        if (adapterProp2) {
          return adapterProp2;
        }
      }
      const adapterProp = adapterObj[prop];
      if (adapterProp) {
        if (adapterProp.bind) {
          return adapterProp.bind(adapterObj);
        }
        return adapterProp;
      }
      const handleProp = genericRequestHandler[prop];
      if (handleProp) {
        if (handleProp.bind) {
          return handleProp.bind(genericRequestHandler);
        }
        return handleProp;
      }
      if (serverAdapterBaseObject) {
        const serverAdapterBaseObjectProp = serverAdapterBaseObject[prop];
        if (serverAdapterBaseObjectProp) {
          if (serverAdapterBaseObjectProp.bind) {
            return function(...args) {
              const returnedVal = serverAdapterBaseObject[prop](...args);
              if (returnedVal === serverAdapterBaseObject) {
                return serverAdapter;
              }
              return returnedVal;
            };
          }
          return serverAdapterBaseObjectProp;
        }
      }
    }, "get"),
    apply(_, __, args) {
      return genericRequestHandler(...args);
    }
  });
  return serverAdapter;
}
__name(createServerAdapter, "createServerAdapter");

// node_modules/@whatwg-node/server/esm/plugins/useCors.js
init_modules_watch_stub();
function getCORSHeadersByRequestAndOptions(request, corsOptions) {
  const currentOrigin = request.headers.get("origin");
  if (corsOptions === false || currentOrigin == null) {
    return null;
  }
  const headers = {};
  if (corsOptions.origin == null || corsOptions.origin.length === 0 || corsOptions.origin.includes("*")) {
    headers["Access-Control-Allow-Origin"] = currentOrigin;
    headers["Vary"] = "Origin";
  } else if (typeof corsOptions.origin === "string") {
    headers["Access-Control-Allow-Origin"] = corsOptions.origin;
  } else if (Array.isArray(corsOptions.origin)) {
    if (corsOptions.origin.length === 1) {
      headers["Access-Control-Allow-Origin"] = corsOptions.origin[0];
    } else if (corsOptions.origin.includes(currentOrigin)) {
      headers["Access-Control-Allow-Origin"] = currentOrigin;
      headers["Vary"] = "Origin";
    } else {
      headers["Access-Control-Allow-Origin"] = "null";
    }
  }
  if (corsOptions.methods?.length) {
    headers["Access-Control-Allow-Methods"] = corsOptions.methods.join(", ");
  } else {
    const requestMethod = request.headers.get("access-control-request-method");
    if (requestMethod) {
      headers["Access-Control-Allow-Methods"] = requestMethod;
    }
  }
  if (corsOptions.allowedHeaders?.length) {
    headers["Access-Control-Allow-Headers"] = corsOptions.allowedHeaders.join(", ");
  } else {
    const requestHeaders = request.headers.get("access-control-request-headers");
    if (requestHeaders) {
      headers["Access-Control-Allow-Headers"] = requestHeaders;
      if (headers["Vary"]) {
        headers["Vary"] += ", Access-Control-Request-Headers";
      } else {
        headers["Vary"] = "Access-Control-Request-Headers";
      }
    }
  }
  if (corsOptions.credentials != null) {
    if (corsOptions.credentials === true) {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
  } else if (headers["Access-Control-Allow-Origin"] !== "*") {
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  if (corsOptions.exposedHeaders) {
    headers["Access-Control-Expose-Headers"] = corsOptions.exposedHeaders.join(", ");
  }
  if (corsOptions.maxAge) {
    headers["Access-Control-Max-Age"] = corsOptions.maxAge.toString();
  }
  return headers;
}
__name(getCORSHeadersByRequestAndOptions, "getCORSHeadersByRequestAndOptions");
function getCORSResponseHeaders(request, corsOptionsFactory, serverContext) {
  return handleMaybePromise(() => corsOptionsFactory(request, serverContext), (corsOptions) => getCORSHeadersByRequestAndOptions(request, corsOptions));
}
__name(getCORSResponseHeaders, "getCORSResponseHeaders");
function useCORS(options) {
  let corsOptionsFactory = /* @__PURE__ */ __name(() => ({}), "corsOptionsFactory");
  if (options != null) {
    if (typeof options === "function") {
      corsOptionsFactory = options;
    } else if (typeof options === "object") {
      const corsOptions = {
        ...options
      };
      corsOptionsFactory = /* @__PURE__ */ __name(() => corsOptions, "corsOptionsFactory");
    } else if (options === false) {
      corsOptionsFactory = /* @__PURE__ */ __name(() => false, "corsOptionsFactory");
    }
  }
  return {
    onRequest({ request, fetchAPI, endResponse: endResponse2 }) {
      if (request.method.toUpperCase() === "OPTIONS") {
        const response = new fetchAPI.Response(null, {
          status: 204,
          // Safari (and potentially other browsers) need content-length 0,
          // for 204 or they just hang waiting for a body
          // see: https://github.com/expressjs/cors/blob/master/lib/index.js#L176
          headers: {
            "Content-Length": "0"
          }
        });
        endResponse2(response);
      }
    },
    onResponse({ request, serverContext, response }) {
      return handleMaybePromise(() => getCORSResponseHeaders(request, corsOptionsFactory, serverContext), (headers) => {
        if (headers != null) {
          for (const headerName in headers) {
            response.headers.set(headerName, headers[headerName]);
          }
        }
      });
    }
  };
}
__name(useCORS, "useCORS");

// node_modules/graphql-yoga/esm/error.js
init_modules_watch_stub();
function isAggregateError(obj) {
  return obj != null && typeof obj === "object" && "errors" in obj;
}
__name(isAggregateError, "isAggregateError");
function hasToString(obj) {
  return obj != null && typeof obj.toString === "function";
}
__name(hasToString, "hasToString");
function isGraphQLError2(val) {
  return val instanceof GraphQLError;
}
__name(isGraphQLError2, "isGraphQLError");
function isOriginalGraphQLError2(val) {
  if (val instanceof GraphQLError) {
    if (val.originalError != null) {
      return isOriginalGraphQLError2(val.originalError);
    }
    return true;
  }
  return false;
}
__name(isOriginalGraphQLError2, "isOriginalGraphQLError");
function isAbortError(error) {
  return typeof error === "object" && error?.constructor?.name === "DOMException" && (error.name === "AbortError" || error.name === "TimeoutError");
}
__name(isAbortError, "isAbortError");
function handleError(error, maskedErrorsOpts, logger) {
  const errors = /* @__PURE__ */ new Set();
  if (isAggregateError(error)) {
    for (const singleError of error.errors) {
      const handledErrors = handleError(singleError, maskedErrorsOpts, logger);
      for (const handledError of handledErrors) {
        errors.add(handledError);
      }
    }
  } else if (isAbortError(error)) {
    logger.debug("Request aborted");
  } else if (maskedErrorsOpts) {
    const maskedError = maskedErrorsOpts.maskError(error, maskedErrorsOpts.errorMessage, maskedErrorsOpts.isDev);
    if (maskedError !== error) {
      logger.error(error);
    }
    errors.add(isGraphQLError2(maskedError) ? maskedError : createGraphQLError(maskedError.message, {
      originalError: maskedError
    }));
  } else if (isGraphQLError2(error)) {
    errors.add(error);
  } else if (error instanceof Error) {
    errors.add(createGraphQLError(error.message, {
      originalError: error
    }));
  } else if (typeof error === "string") {
    errors.add(createGraphQLError(error, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        unexpected: true
      }
    }));
  } else if (hasToString(error)) {
    errors.add(createGraphQLError(error.toString(), {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        unexpected: true
      }
    }));
  } else {
    logger.error(error);
    errors.add(createGraphQLError("Unexpected error.", {
      extensions: {
        http: {
          unexpected: true
        }
      }
    }));
  }
  return Array.from(errors);
}
__name(handleError, "handleError");
function getResponseInitByRespectingErrors(result, headers = {}, isApplicationJson = false) {
  let status;
  let unexpectedErrorExists = false;
  if ("extensions" in result && result.extensions?.http) {
    if (result.extensions.http.headers) {
      Object.assign(headers, result.extensions.http.headers);
    }
    if (result.extensions.http.status) {
      status = result.extensions.http.status;
    }
  }
  if ("errors" in result && result.errors?.length) {
    for (const error of result.errors) {
      if (error.extensions?.["http"]) {
        if (error.extensions["http"].headers) {
          Object.assign(headers, error.extensions["http"].headers);
        }
        if (isApplicationJson && error.extensions["http"].spec) {
          continue;
        }
        if (error.extensions["http"].status && (!status || error.extensions["http"].status > status)) {
          status = error.extensions["http"].status;
        }
      } else if (!isOriginalGraphQLError2(error) || error.extensions?.["unexpected"]) {
        unexpectedErrorExists = true;
      }
    }
  } else {
    status ||= 200;
  }
  if (!status) {
    if (unexpectedErrorExists && !("data" in result)) {
      status = 500;
    } else {
      status = 200;
    }
  }
  return {
    status,
    headers
  };
}
__name(getResponseInitByRespectingErrors, "getResponseInitByRespectingErrors");
function areGraphQLErrors2(obj) {
  return Array.isArray(obj) && obj.length > 0 && // if one item in the array is a GraphQLError, we're good
  obj.some(isGraphQLError2);
}
__name(areGraphQLErrors2, "areGraphQLErrors");

// node_modules/graphql-yoga/esm/plugins/allowed-headers.js
init_modules_watch_stub();
function useAllowedResponseHeaders(allowedHeaders) {
  return {
    onResponse({ response }) {
      removeDisallowedHeaders(response.headers, allowedHeaders);
    }
  };
}
__name(useAllowedResponseHeaders, "useAllowedResponseHeaders");
function useAllowedRequestHeaders(allowedHeaders) {
  return {
    onRequest({ request }) {
      removeDisallowedHeaders(request.headers, allowedHeaders);
    }
  };
}
__name(useAllowedRequestHeaders, "useAllowedRequestHeaders");
function removeDisallowedHeaders(headers, allowedHeaders) {
  for (const headerName of headers.keys()) {
    if (!allowedHeaders.includes(headerName)) {
      headers.delete(headerName);
    }
  }
}
__name(removeDisallowedHeaders, "removeDisallowedHeaders");

// node_modules/graphql-yoga/esm/plugins/request-parser/get.js
init_modules_watch_stub();
var import_fetch2 = __toESM(require_global_ponyfill(), 1);

// node_modules/graphql-yoga/esm/plugins/request-parser/utils.js
init_modules_watch_stub();
var import_fetch = __toESM(require_global_ponyfill(), 1);
function handleURLSearchParams(searchParams) {
  const operationName = searchParams.get("operationName") || void 0;
  const query = searchParams.get("query") || void 0;
  const variablesStr = searchParams.get("variables") || void 0;
  const extensionsStr = searchParams.get("extensions") || void 0;
  return {
    operationName,
    query,
    variables: variablesStr ? JSON.parse(variablesStr) : void 0,
    extensions: extensionsStr ? JSON.parse(extensionsStr) : void 0
  };
}
__name(handleURLSearchParams, "handleURLSearchParams");
function parseURLSearchParams(requestBody) {
  const searchParams = new import_fetch.URLSearchParams(requestBody);
  return handleURLSearchParams(searchParams);
}
__name(parseURLSearchParams, "parseURLSearchParams");
function isContentTypeMatch(request, expectedContentType) {
  let contentType = request.headers.get("content-type");
  contentType = contentType?.split(",")[0] || null;
  return contentType === expectedContentType || !!contentType?.startsWith(`${expectedContentType};`);
}
__name(isContentTypeMatch, "isContentTypeMatch");

// node_modules/graphql-yoga/esm/plugins/request-parser/get.js
function isGETRequest(request) {
  return request.method === "GET";
}
__name(isGETRequest, "isGETRequest");
function parseGETRequest(request) {
  const queryString = request.url.substring(request.url.indexOf("?") + 1);
  const searchParams = new import_fetch2.URLSearchParams(queryString);
  return handleURLSearchParams(searchParams);
}
__name(parseGETRequest, "parseGETRequest");

// node_modules/graphql-yoga/esm/plugins/request-parser/post-form-url-encoded.js
init_modules_watch_stub();
function isPOSTFormUrlEncodedRequest(request) {
  return request.method === "POST" && isContentTypeMatch(request, "application/x-www-form-urlencoded");
}
__name(isPOSTFormUrlEncodedRequest, "isPOSTFormUrlEncodedRequest");
function parsePOSTFormUrlEncodedRequest(request) {
  return request.text().then(parseURLSearchParams);
}
__name(parsePOSTFormUrlEncodedRequest, "parsePOSTFormUrlEncodedRequest");

// node_modules/graphql-yoga/esm/plugins/request-parser/post-graphql-string.js
init_modules_watch_stub();
function isPOSTGraphQLStringRequest(request) {
  return request.method === "POST" && isContentTypeMatch(request, "application/graphql");
}
__name(isPOSTGraphQLStringRequest, "isPOSTGraphQLStringRequest");
function parsePOSTGraphQLStringRequest(request) {
  return request.text().then((query) => ({ query }));
}
__name(parsePOSTGraphQLStringRequest, "parsePOSTGraphQLStringRequest");

// node_modules/graphql-yoga/esm/plugins/request-parser/post-json.js
init_modules_watch_stub();
function isPOSTJsonRequest(request) {
  return request.method === "POST" && (isContentTypeMatch(request, "application/json") || isContentTypeMatch(request, "application/graphql+json"));
}
__name(isPOSTJsonRequest, "isPOSTJsonRequest");
function parsePOSTJsonRequest(request) {
  return handleMaybePromise(() => request.json(), (requestBody) => {
    if (requestBody == null) {
      throw createGraphQLError(`POST body is expected to be object but received ${requestBody}`, {
        extensions: {
          http: {
            status: 400
          },
          code: "BAD_REQUEST"
        }
      });
    }
    const requestBodyTypeof = typeof requestBody;
    if (requestBodyTypeof !== "object") {
      throw createGraphQLError(`POST body is expected to be object but received ${requestBodyTypeof}`, {
        extensions: {
          http: {
            status: 400
          },
          code: "BAD_REQUEST"
        }
      });
    }
    return requestBody;
  }, (err) => {
    if (err instanceof GraphQLError) {
      throw err;
    }
    const extensions = {
      http: {
        spec: true,
        status: 400
      },
      code: "BAD_REQUEST"
    };
    if (err instanceof Error) {
      extensions["originalError"] = {
        name: err.name,
        message: err.message
      };
    }
    throw createGraphQLError("POST body sent invalid JSON.", {
      extensions
    });
  });
}
__name(parsePOSTJsonRequest, "parsePOSTJsonRequest");

// node_modules/graphql-yoga/esm/plugins/request-parser/post-multipart.js
init_modules_watch_stub();

// node_modules/dset/dist/index.mjs
init_modules_watch_stub();
function dset(obj, keys, val) {
  keys.split && (keys = keys.split("."));
  var i = 0, l = keys.length, t = obj, x, k;
  while (i < l) {
    k = "" + keys[i++];
    if (k === "__proto__" || k === "constructor" || k === "prototype") break;
    t = t[k] = i === l ? val : typeof (x = t[k]) === typeof keys ? x : keys[i] * 0 !== 0 || !!~("" + keys[i]).indexOf(".") ? {} : [];
  }
}
__name(dset, "dset");

// node_modules/graphql-yoga/esm/plugins/request-parser/post-multipart.js
function isPOSTMultipartRequest(request) {
  return request.method === "POST" && isContentTypeMatch(request, "multipart/form-data");
}
__name(isPOSTMultipartRequest, "isPOSTMultipartRequest");
function parsePOSTMultipartRequest(request) {
  return handleMaybePromise(() => request.formData(), (requestBody) => {
    const operationsStr = requestBody.get("operations");
    if (!operationsStr) {
      throw createGraphQLError('Missing multipart form field "operations"');
    }
    if (typeof operationsStr !== "string") {
      throw createGraphQLError('Multipart form field "operations" must be a string');
    }
    let operations;
    try {
      operations = JSON.parse(operationsStr);
    } catch {
      throw createGraphQLError('Multipart form field "operations" must be a valid JSON string');
    }
    const mapStr = requestBody.get("map");
    if (mapStr != null) {
      if (typeof mapStr !== "string") {
        throw createGraphQLError('Multipart form field "map" must be a string');
      }
      let map;
      try {
        map = JSON.parse(mapStr);
      } catch {
        throw createGraphQLError('Multipart form field "map" must be a valid JSON string');
      }
      for (const fileIndex in map) {
        const file = requestBody.get(fileIndex);
        const keys = map[fileIndex];
        for (const key of keys) {
          dset(operations, key, file);
        }
      }
    }
    return operations;
  }, (e) => {
    if (e instanceof Error && e.message.startsWith("File size limit exceeded: ")) {
      throw createGraphQLError(e.message, {
        extensions: {
          http: {
            status: 413
          }
        }
      });
    }
    throw e;
  });
}
__name(parsePOSTMultipartRequest, "parsePOSTMultipartRequest");

// node_modules/graphql-yoga/esm/plugins/request-validation/use-check-graphql-query-params.js
init_modules_watch_stub();
var expectedParameters = /* @__PURE__ */ new Set(["query", "variables", "operationName", "extensions"]);
function assertInvalidParams(params, extraParamNames) {
  if (params == null || typeof params !== "object") {
    throw createGraphQLError('Invalid "params" in the request body', {
      extensions: {
        http: {
          spec: true,
          status: 400
        },
        code: "BAD_REQUEST"
      }
    });
  }
  for (const paramKey in params) {
    if (params[paramKey] == null) {
      continue;
    }
    if (!expectedParameters.has(paramKey)) {
      if (extraParamNames?.includes(paramKey)) {
        continue;
      }
      throw createGraphQLError(`Unexpected parameter "${paramKey}" in the request body.`, {
        extensions: {
          http: {
            status: 400
          },
          code: "BAD_REQUEST"
        }
      });
    }
  }
}
__name(assertInvalidParams, "assertInvalidParams");
function checkGraphQLQueryParams(params, extraParamNames) {
  if (!isObject3(params)) {
    throw createGraphQLError(`Expected params to be an object but given ${extendedTypeof2(params)}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        },
        code: "BAD_REQUEST"
      }
    });
  }
  assertInvalidParams(params, extraParamNames);
  if (params["query"] == null) {
    throw createGraphQLError("Must provide query string.", {
      extensions: {
        http: {
          spec: true,
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        },
        code: "BAD_REQUEST"
      }
    });
  }
  const queryType = extendedTypeof2(params["query"]);
  if (queryType !== "string") {
    throw createGraphQLError(`Expected "query" param to be a string, but given ${queryType}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        },
        code: "BAD_REQUEST"
      }
    });
  }
  const variablesParamType = extendedTypeof2(params["variables"]);
  if (!["object", "null", "undefined"].includes(variablesParamType)) {
    throw createGraphQLError(`Expected "variables" param to be empty or an object, but given ${variablesParamType}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        },
        code: "BAD_REQUEST"
      }
    });
  }
  const extensionsParamType = extendedTypeof2(params["extensions"]);
  if (!["object", "null", "undefined"].includes(extensionsParamType)) {
    throw createGraphQLError(`Expected "extensions" param to be empty or an object, but given ${extensionsParamType}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        },
        code: "BAD_REQUEST"
      }
    });
  }
  return params;
}
__name(checkGraphQLQueryParams, "checkGraphQLQueryParams");
function useCheckGraphQLQueryParams(extraParamNames) {
  return {
    onParams({ params }) {
      checkGraphQLQueryParams(params, extraParamNames);
    }
  };
}
__name(useCheckGraphQLQueryParams, "useCheckGraphQLQueryParams");
function extendedTypeof2(val) {
  if (val === null) {
    return "null";
  }
  if (Array.isArray(val)) {
    return "array";
  }
  return typeof val;
}
__name(extendedTypeof2, "extendedTypeof");
function isObject3(val) {
  return extendedTypeof2(val) === "object";
}
__name(isObject3, "isObject");

// node_modules/graphql-yoga/esm/plugins/request-validation/use-check-method-for-graphql.js
init_modules_watch_stub();
function isValidMethodForGraphQL(method) {
  return method === "GET" || method === "POST";
}
__name(isValidMethodForGraphQL, "isValidMethodForGraphQL");
function useCheckMethodForGraphQL() {
  return {
    onRequestParse({ request }) {
      if (!isValidMethodForGraphQL(request.method)) {
        throw createGraphQLError("GraphQL only supports GET and POST requests.", {
          extensions: {
            http: {
              status: 405,
              headers: {
                Allow: "GET, POST"
              }
            },
            code: "BAD_REQUEST"
          }
        });
      }
    }
  };
}
__name(useCheckMethodForGraphQL, "useCheckMethodForGraphQL");

// node_modules/graphql-yoga/esm/plugins/request-validation/use-http-validation-error.js
init_modules_watch_stub();
function useHTTPValidationError() {
  return {
    onValidate() {
      return ({ valid, result }) => {
        if (!valid) {
          for (const error of result) {
            error.extensions ||= {};
            error.extensions.code ||= "GRAPHQL_VALIDATION_FAILED";
            error.extensions.http ||= {};
            error.extensions.http.spec = error.extensions.http.spec == null ? true : error.extensions.http.spec;
            error.extensions.http.status ||= 400;
          }
        }
      };
    }
  };
}
__name(useHTTPValidationError, "useHTTPValidationError");

// node_modules/graphql-yoga/esm/plugins/request-validation/use-limit-batching.js
init_modules_watch_stub();
function useLimitBatching(limit) {
  return {
    onRequestParse() {
      return {
        onRequestParseDone({ requestParserResult }) {
          if (Array.isArray(requestParserResult)) {
            if (!limit) {
              throw createGraphQLError(`Batching is not supported.`, {
                extensions: {
                  http: {
                    status: 400
                  },
                  code: "BAD_REQUEST"
                }
              });
            }
            if (requestParserResult.length > limit) {
              throw createGraphQLError(`Batching is limited to ${limit} operations per request.`, {
                extensions: {
                  http: {
                    status: 413
                  },
                  code: "BAD_REQUEST"
                }
              });
            }
          }
        }
      };
    }
  };
}
__name(useLimitBatching, "useLimitBatching");

// node_modules/graphql-yoga/esm/plugins/request-validation/use-prevent-mutation-via-get.js
init_modules_watch_stub();
function assertMutationViaGet(method, document, operationName) {
  const operation = document ? getOperationAST(document, operationName) ?? void 0 : void 0;
  if (!operation) {
    throw createGraphQLError("Could not determine what operation to execute.", {
      extensions: {
        code: "OPERATION_RESOLUTION_FAILURE",
        http: {
          status: 400
        }
      }
    });
  }
  if (operation.operation === "mutation" && method === "GET") {
    throw createGraphQLError("Can only perform a mutation operation from a POST request.", {
      extensions: {
        http: {
          status: 405,
          headers: {
            Allow: "POST"
          }
        },
        code: "BAD_REQUEST"
      }
    });
  }
}
__name(assertMutationViaGet, "assertMutationViaGet");
function usePreventMutationViaGET() {
  return {
    onParse() {
      return ({ result, context: {
        request,
        // the `params` might be missing in cases where the user provided
        // malformed context to getEnveloped (like `yoga.getEnveloped({})`)
        params: { operationName } = {}
      } }) => {
        if (!request) {
          return;
        }
        if (result instanceof Error) {
          if (result instanceof GraphQLError) {
            const extensions = result.extensions ||= {};
            extensions["code"] ||= "GRAPHQL_PARSE_FAILED";
            const httpExtensions = extensions["http"] ||= {};
            httpExtensions.spec ||= true;
            httpExtensions.status ||= 400;
          }
        } else {
          assertMutationViaGet(request.method, result, operationName);
        }
      };
    }
  };
}
__name(usePreventMutationViaGET, "usePreventMutationViaGET");

// node_modules/graphql-yoga/esm/plugins/use-health-check.js
init_modules_watch_stub();
function useHealthCheck({ id = Date.now().toString(), logger = console, endpoint = "/health" } = {}) {
  return {
    onRequest({ endResponse: endResponse2, fetchAPI, request }) {
      if (request.url.endsWith(endpoint)) {
        logger.debug("Responding Health Check");
        const response = new fetchAPI.Response(null, {
          status: 200,
          headers: {
            "x-yoga-id": id
          }
        });
        endResponse2(response);
      }
    }
  };
}
__name(useHealthCheck, "useHealthCheck");

// node_modules/graphql-yoga/esm/plugins/use-parser-and-validation-cache.js
init_modules_watch_stub();

// node_modules/graphql-yoga/esm/utils/create-lru-cache.js
init_modules_watch_stub();

// node_modules/lru-cache/dist/esm/index.js
init_modules_watch_stub();
var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
var warned = /* @__PURE__ */ new Set();
var PROCESS = typeof process === "object" && !!process ? process : {};
var emitWarning = /* @__PURE__ */ __name((msg, type, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
}, "emitWarning");
var AC = globalThis.AbortController;
var AS = globalThis.AbortSignal;
if (typeof AC === "undefined") {
  AS = class AbortSignal {
    static {
      __name(this, "AbortSignal");
    }
    onabort;
    _onabort = [];
    reason;
    aborted = false;
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  AC = class AbortController {
    static {
      __name(this, "AbortController");
    }
    constructor() {
      warnACPolyfill();
    }
    signal = new AS();
    abort(reason) {
      if (this.signal.aborted)
        return;
      this.signal.reason = reason;
      this.signal.aborted = true;
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      this.signal.onabort?.(reason);
    }
  };
  let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
  const warnACPolyfill = /* @__PURE__ */ __name(() => {
    if (!printACPolyfillWarning)
      return;
    printACPolyfillWarning = false;
    emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
  }, "warnACPolyfill");
}
var shouldWarn = /* @__PURE__ */ __name((code) => !warned.has(code), "shouldWarn");
var TYPE = Symbol("type");
var isPosInt = /* @__PURE__ */ __name((n) => n && n === Math.floor(n) && n > 0 && isFinite(n), "isPosInt");
var getUintArray = /* @__PURE__ */ __name((max2) => !isPosInt(max2) ? null : max2 <= Math.pow(2, 8) ? Uint8Array : max2 <= Math.pow(2, 16) ? Uint16Array : max2 <= Math.pow(2, 32) ? Uint32Array : max2 <= Number.MAX_SAFE_INTEGER ? ZeroArray : null, "getUintArray");
var ZeroArray = class extends Array {
  static {
    __name(this, "ZeroArray");
  }
  constructor(size) {
    super(size);
    this.fill(0);
  }
};
var Stack = class _Stack {
  static {
    __name(this, "Stack");
  }
  heap;
  length;
  // private constructor
  static #constructing = false;
  static create(max2) {
    const HeapCls = getUintArray(max2);
    if (!HeapCls)
      return [];
    _Stack.#constructing = true;
    const s = new _Stack(max2, HeapCls);
    _Stack.#constructing = false;
    return s;
  }
  constructor(max2, HeapCls) {
    if (!_Stack.#constructing) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    this.heap = new HeapCls(max2);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
};
var LRUCache = class _LRUCache {
  static {
    __name(this, "LRUCache");
  }
  // options that cannot be changed without disaster
  #max;
  #maxSize;
  #dispose;
  #disposeAfter;
  #fetchMethod;
  #memoMethod;
  /**
   * {@link LRUCache.OptionsBase.ttl}
   */
  ttl;
  /**
   * {@link LRUCache.OptionsBase.ttlResolution}
   */
  ttlResolution;
  /**
   * {@link LRUCache.OptionsBase.ttlAutopurge}
   */
  ttlAutopurge;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnGet}
   */
  updateAgeOnGet;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnHas}
   */
  updateAgeOnHas;
  /**
   * {@link LRUCache.OptionsBase.allowStale}
   */
  allowStale;
  /**
   * {@link LRUCache.OptionsBase.noDisposeOnSet}
   */
  noDisposeOnSet;
  /**
   * {@link LRUCache.OptionsBase.noUpdateTTL}
   */
  noUpdateTTL;
  /**
   * {@link LRUCache.OptionsBase.maxEntrySize}
   */
  maxEntrySize;
  /**
   * {@link LRUCache.OptionsBase.sizeCalculation}
   */
  sizeCalculation;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
   */
  noDeleteOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
   */
  noDeleteOnStaleGet;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
   */
  allowStaleOnFetchAbort;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
   */
  allowStaleOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.ignoreFetchAbort}
   */
  ignoreFetchAbort;
  // computed properties
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      // methods
      isBackgroundFetch: /* @__PURE__ */ __name((p) => c.#isBackgroundFetch(p), "isBackgroundFetch"),
      backgroundFetch: /* @__PURE__ */ __name((k, index, options, context) => c.#backgroundFetch(k, index, options, context), "backgroundFetch"),
      moveToTail: /* @__PURE__ */ __name((index) => c.#moveToTail(index), "moveToTail"),
      indexes: /* @__PURE__ */ __name((options) => c.#indexes(options), "indexes"),
      rindexes: /* @__PURE__ */ __name((options) => c.#rindexes(options), "rindexes"),
      isStale: /* @__PURE__ */ __name((index) => c.#isStale(index), "isStale")
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return this.#max;
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return this.#maxSize;
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return this.#calculatedSize;
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return this.#size;
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return this.#fetchMethod;
  }
  get memoMethod() {
    return this.#memoMethod;
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return this.#dispose;
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const { max: max2 = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
    if (max2 !== 0 && !isPosInt(max2)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max2 ? getUintArray(max2) : Array;
    if (!UintArray) {
      throw new Error("invalid max value: " + max2);
    }
    this.#max = max2;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (memoMethod !== void 0 && typeof memoMethod !== "function") {
      throw new TypeError("memoMethod must be a function if defined");
    }
    this.#memoMethod = memoMethod;
    if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = /* @__PURE__ */ new Map();
    this.#keyList = new Array(max2).fill(void 0);
    this.#valList = new Array(max2).fill(void 0);
    this.#next = new UintArray(max2);
    this.#prev = new UintArray(max2);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max2);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === "function") {
      this.#dispose = dispose;
    }
    if (typeof disposeAfter === "function") {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = void 0;
      this.#disposed = void 0;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      this.#initializeTTLTracking();
    }
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
      }
    }
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (this.#isStale(index)) {
            this.#delete(this.#keyList[index], "expire");
          }
        }, ttl + 1);
        if (t.unref) {
          t.unref();
        }
      }
    };
    this.#updateItemAge = (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        if (!ttl || !start)
          return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    };
    let cachedNow = 0;
    const getNow = /* @__PURE__ */ __name(() => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    }, "getNow");
    this.getRemainingTTL = (key) => {
      const index = this.#keyMap.get(key);
      if (index === void 0) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    this.#isStale = (index) => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    };
  }
  // conditionally set private methods related to TTL
  #updateItemAge = /* @__PURE__ */ __name(() => {
  }, "#updateItemAge");
  #statusTTL = /* @__PURE__ */ __name(() => {
  }, "#statusTTL");
  #setItemTTL = /* @__PURE__ */ __name(() => {
  }, "#setItemTTL");
  /* c8 ignore stop */
  #isStale = /* @__PURE__ */ __name(() => false, "#isStale");
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = (index) => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = /* @__PURE__ */ __name((_i) => {
  }, "#removeItemSize");
  #addItemSize = /* @__PURE__ */ __name((_i, _s, _st) => {
  }, "#addItemSize");
  #requireSize = /* @__PURE__ */ __name((_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
    }
    return 0;
  }, "#requireSize");
  *#indexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#tail; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#head) {
          break;
        } else {
          i = this.#prev[i];
        }
      }
    }
  }
  *#rindexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#head; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#tail) {
          break;
        } else {
          i = this.#next[i];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of this.#indexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of this.#rindexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of this.#indexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of this.#rindexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * A String value that is used in the creation of the default string
   * description of an object. Called by the built-in method
   * `Object.prototype.toString`.
   */
  [Symbol.toStringTag] = "LRUCache";
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(fn, getOptions = {}) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      if (fn(value, this.#keyList[i], this)) {
        return this.get(this.#keyList[i], getOptions);
      }
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of this.#rindexes({ allowStale: true })) {
      if (this.#isStale(i)) {
        this.#delete(this.#keyList[i], "expire");
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(key) {
    const i = this.#keyMap.get(key);
    if (i === void 0)
      return void 0;
    const v = this.#valList[i];
    const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    if (value === void 0)
      return void 0;
    const entry = { value };
    if (this.#ttls && this.#starts) {
      const ttl = this.#ttls[i];
      const start = this.#starts[i];
      if (ttl && start) {
        const remain = ttl - (perf.now() - start);
        entry.ttl = remain;
        entry.start = Date.now();
      }
    }
    if (this.#sizes) {
      entry.size = this.#sizes[i];
    }
    return entry;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRLUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const arr = [];
    for (const i of this.#indexes({ allowStale: true })) {
      const key = this.#keyList[i];
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0 || key === void 0)
        continue;
      const entry = { value };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i];
        const age = perf.now() - this.#starts[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(k, v, setOptions = {}) {
    if (v === void 0) {
      this.delete(k);
      return this;
    }
    const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
    let { noUpdateTTL = this.noUpdateTTL } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      this.#delete(k, "set");
      return this;
    }
    let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
    if (index === void 0) {
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status)
        status.set = "add";
      noUpdateTTL = false;
    } else {
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
          const { __staleWhileFetching: s } = oldVal;
          if (s !== void 0 && !noDisposeOnSet) {
            if (this.#hasDispose) {
              this.#dispose?.(s, k, "set");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([s, k, "set"]);
            }
          }
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, "set");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([oldVal, k, "set"]);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== void 0)
            status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status)
        this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== void 0) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, "evict");
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([v, k, "evict"]);
      }
    }
    this.#removeItemSize(head);
    if (free) {
      this.#keyList[head] = void 0;
      this.#valList[head] = void 0;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = "hit";
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const { allowStale = this.allowStale } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index === void 0 || !allowStale && this.#isStale(index)) {
      return;
    }
    const v = this.#valList[index];
    return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === void 0 ? void 0 : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AC();
    const { signal } = options;
    signal?.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = /* @__PURE__ */ __name((v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort)
            options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (this.#valList[index] === p) {
        if (v2 === void 0) {
          if (bf2.__staleWhileFetching) {
            this.#valList[index] = bf2.__staleWhileFetching;
          } else {
            this.#delete(k, "fetch");
          }
        } else {
          if (options.status)
            options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    }, "cb");
    const eb = /* @__PURE__ */ __name((er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    }, "eb");
    const fetchFail = /* @__PURE__ */ __name((er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (this.#valList[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === void 0;
        if (del) {
          this.#delete(k, "fetch");
        } else if (!allowStaleAborted) {
          this.#valList[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== void 0) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    }, "fetchFail");
    const pcall = /* @__PURE__ */ __name((res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2 === void 0 ? void 0 : v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res(void 0);
          if (options.allowStaleOnFetchAbort) {
            res = /* @__PURE__ */ __name((v2) => cb(v2, true), "res");
          }
        }
      });
    }, "pcall");
    if (options.status)
      options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: void 0
    });
    if (index === void 0) {
      this.set(k, bf, { ...fetchOpts.options, status: void 0 });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod)
      return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      // get options
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      // set options
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status)
        status.fetch = "get";
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === void 0) {
      if (status)
        status.fetch = "miss";
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== void 0;
        if (status) {
          status.fetch = "inflight";
          if (stale)
            status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status)
          status.fetch = "hit";
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status)
          this.#statusTTL(status, index);
        return v;
      }
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== void 0;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? "stale" : "refresh";
        if (staleVal && isStale)
          status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  async forceFetch(k, fetchOptions = {}) {
    const v = await this.fetch(k, fetchOptions);
    if (v === void 0)
      throw new Error("fetch() returned undefined");
    return v;
  }
  memo(k, memoOptions = {}) {
    const memoMethod = this.#memoMethod;
    if (!memoMethod) {
      throw new Error("no memoMethod provided to constructor");
    }
    const { context, forceRefresh, ...options } = memoOptions;
    const v = this.get(k, options);
    if (!forceRefresh && v !== void 0)
      return v;
    const vv = memoMethod(k, v, {
      options,
      context
    });
    this.set(k, vv, options);
    return vv;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status)
        this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status)
          status.get = "stale";
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.#delete(k, "expire");
          }
          if (status && allowStale)
            status.returnedStale = true;
          return allowStale ? value : void 0;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== void 0) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : void 0;
        }
      } else {
        if (status)
          status.get = "hit";
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
  }
  #connect(p, n) {
    this.#prev[n] = p;
    this.#next[p] = n;
  }
  #moveToTail(index) {
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    return this.#delete(k, "delete");
  }
  #delete(k, reason) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== void 0) {
        deleted = true;
        if (this.#size === 1) {
          this.#clear(reason);
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, reason);
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, reason]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = void 0;
          this.#valList[index] = void 0;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            const pi = this.#prev[index];
            this.#next[pi] = this.#next[index];
            const ni = this.#next[index];
            this.#prev[ni] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return this.#clear("delete");
  }
  #clear(reason) {
    for (const index of this.#rindexes({ allowStale: true })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, reason);
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([v, k, reason]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(void 0);
    this.#keyList.fill(void 0);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
};

// node_modules/graphql-yoga/esm/utils/create-lru-cache.js
var DEFAULT_MAX = 1024;
var DEFAULT_TTL = 36e5;
function _createLRUCache({ max: max2 = DEFAULT_MAX, ttl = DEFAULT_TTL } = {}) {
  return new LRUCache({ max: max2, ttl });
}
__name(_createLRUCache, "_createLRUCache");

// node_modules/graphql-yoga/esm/plugins/use-parser-and-validation-cache.js
function useParserAndValidationCache({ documentCache = _createLRUCache(), errorCache = _createLRUCache(), validationCache = true }) {
  const validationCacheByRules = _createLRUCache();
  return {
    onParse({ params, setParsedDocument }) {
      const strDocument = params.source.toString();
      const document = documentCache.get(strDocument);
      if (document) {
        setParsedDocument(document);
        return;
      }
      const parserError = errorCache.get(strDocument);
      if (parserError) {
        throw parserError;
      }
      return ({ result }) => {
        if (result != null) {
          if (result instanceof Error) {
            errorCache.set(strDocument, result);
          } else {
            documentCache.set(strDocument, result);
          }
        }
      };
    },
    onValidate({
      params: { schema: schema2, documentAST, rules },
      setResult
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    }) {
      if (schema2 == null) {
        return;
      }
      if (validationCache !== false) {
        const rulesKey = rules?.map((rule) => rule.name).join(",") || "";
        let validationCacheBySchema = validationCacheByRules.get(rulesKey);
        if (!validationCacheBySchema) {
          validationCacheBySchema = /* @__PURE__ */ new WeakMap();
          validationCacheByRules.set(rulesKey, validationCacheBySchema);
        }
        let validationCacheByDocument = validationCacheBySchema.get(schema2);
        if (!validationCacheByDocument) {
          validationCacheByDocument = /* @__PURE__ */ new WeakMap();
          validationCacheBySchema.set(schema2, validationCacheByDocument);
        }
        const cachedResult = validationCacheByDocument.get(documentAST);
        if (cachedResult) {
          setResult(cachedResult);
          return;
        }
        return ({ result }) => {
          if (result != null) {
            validationCacheByDocument?.set(documentAST, result);
          }
        };
      }
    }
  };
}
__name(useParserAndValidationCache, "useParserAndValidationCache");

// node_modules/graphql-yoga/esm/plugins/use-request-parser.js
init_modules_watch_stub();
var DEFAULT_MATCHER = /* @__PURE__ */ __name(() => true, "DEFAULT_MATCHER");
function useRequestParser(options) {
  const matchFn = options.match || DEFAULT_MATCHER;
  return {
    onRequestParse({ request, setRequestParser }) {
      if (matchFn(request)) {
        setRequestParser(options.parse);
      }
    }
  };
}
__name(useRequestParser, "useRequestParser");

// node_modules/graphql-yoga/esm/plugins/use-result-processor.js
init_modules_watch_stub();

// node_modules/graphql-yoga/esm/plugins/result-processor/accept.js
init_modules_watch_stub();
function getMediaTypesForRequestInOrder(request) {
  const accepts = (request.headers.get("accept") || "*/*").replace(/\s/g, "").toLowerCase().split(",");
  const mediaTypes = [];
  for (const accept of accepts) {
    const [mediaType, ...params] = accept.split(";");
    if (mediaType === void 0)
      continue;
    const charset = params?.find((param) => param.includes("charset=")) || "charset=utf-8";
    if (charset !== "charset=utf-8") {
      continue;
    }
    mediaTypes.push(mediaType);
  }
  return mediaTypes.reverse();
}
__name(getMediaTypesForRequestInOrder, "getMediaTypesForRequestInOrder");
function isMatchingMediaType(askedMediaType, processorMediaType) {
  const [askedPre, askedSuf] = askedMediaType.split("/");
  const [pre, suf] = processorMediaType.split("/");
  if ((pre === "*" || pre === askedPre) && (suf === "*" || suf === askedSuf)) {
    return true;
  }
  return false;
}
__name(isMatchingMediaType, "isMatchingMediaType");

// node_modules/graphql-yoga/esm/plugins/result-processor/multipart.js
init_modules_watch_stub();

// node_modules/graphql-yoga/esm/plugins/result-processor/stringify.js
init_modules_watch_stub();
function jsonStringifyResultWithoutInternals(result) {
  if (Array.isArray(result)) {
    return `[${result.map((r) => {
      const sanitizedResult2 = omitInternalsFromResultErrors(r);
      const stringifier2 = r.stringify || JSON.stringify;
      return stringifier2(sanitizedResult2);
    }).join(",")}]`;
  }
  const sanitizedResult = omitInternalsFromResultErrors(result);
  const stringifier = result.stringify || JSON.stringify;
  return stringifier(sanitizedResult);
}
__name(jsonStringifyResultWithoutInternals, "jsonStringifyResultWithoutInternals");
function omitInternalsFromResultErrors(result) {
  if (result.errors?.length || result.extensions?.http) {
    const newResult = { ...result };
    newResult.errors &&= newResult.errors.map(omitInternalsFromError);
    if (newResult.extensions) {
      const { http, ...extensions } = result.extensions;
      newResult.extensions = Object.keys(extensions).length ? extensions : void 0;
    }
    return newResult;
  }
  return result;
}
__name(omitInternalsFromResultErrors, "omitInternalsFromResultErrors");
function omitInternalsFromError(err) {
  if (isGraphQLError2(err)) {
    const serializedError = "toJSON" in err && typeof err.toJSON === "function" ? err.toJSON() : Object(err);
    const { http, unexpected, ...extensions } = serializedError.extensions || {};
    return createGraphQLError(err.message, {
      nodes: err.nodes,
      source: err.source,
      positions: err.positions,
      path: err.path,
      originalError: omitInternalsFromError(err.originalError || void 0),
      extensions: Object.keys(extensions).length ? extensions : void 0
    });
  }
  return err;
}
__name(omitInternalsFromError, "omitInternalsFromError");

// node_modules/graphql-yoga/esm/plugins/result-processor/multipart.js
function processMultipartResult(result, fetchAPI) {
  const headersInit = {
    Connection: "keep-alive",
    "Content-Type": 'multipart/mixed; boundary="-"',
    "Transfer-Encoding": "chunked"
  };
  const responseInit = getResponseInitByRespectingErrors(result, headersInit);
  let iterator;
  const textEncoder = new fetchAPI.TextEncoder();
  const readableStream = new fetchAPI.ReadableStream({
    start(controller) {
      if (isAsyncIterable4(result)) {
        iterator = result[Symbol.asyncIterator]();
      } else {
        let finished = false;
        iterator = {
          next: /* @__PURE__ */ __name(() => {
            if (finished) {
              return fakePromise({ done: true, value: null });
            }
            finished = true;
            return fakePromise({ done: false, value: result });
          }, "next")
        };
      }
      controller.enqueue(textEncoder.encode("\r\n"));
      controller.enqueue(textEncoder.encode(`---`));
    },
    pull(controller) {
      return handleMaybePromise(() => iterator.next(), ({ done, value }) => {
        if (value != null) {
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(textEncoder.encode("Content-Type: application/json; charset=utf-8"));
          controller.enqueue(textEncoder.encode("\r\n"));
          const chunk = jsonStringifyResultWithoutInternals(value);
          const encodedChunk = textEncoder.encode(chunk);
          controller.enqueue(textEncoder.encode("Content-Length: " + encodedChunk.byteLength));
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(encodedChunk);
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(textEncoder.encode("---"));
        }
        if (done) {
          controller.enqueue(textEncoder.encode("--\r\n"));
          controller.close();
        }
      }, (err) => {
        controller.error(err);
      });
    },
    cancel(e) {
      if (iterator.return) {
        return handleMaybePromise(() => iterator.return?.(e), () => {
        });
      }
    }
  });
  return new fetchAPI.Response(readableStream, responseInit);
}
__name(processMultipartResult, "processMultipartResult");

// node_modules/graphql-yoga/esm/plugins/result-processor/regular.js
init_modules_watch_stub();
function processRegularResult(executionResult, fetchAPI, acceptedHeader) {
  if (isAsyncIterable2(executionResult)) {
    return new fetchAPI.Response(null, {
      status: 406,
      statusText: "Not Acceptable",
      headers: {
        accept: "application/json; charset=utf-8, application/graphql-response+json; charset=utf-8"
      }
    });
  }
  const headersInit = {
    "Content-Type": acceptedHeader + "; charset=utf-8"
  };
  const responseInit = getResponseInitByRespectingErrors(
    executionResult,
    headersInit,
    // prefer 200 only if accepting application/json and all errors are exclusively GraphQL errors
    acceptedHeader === "application/json" && !Array.isArray(executionResult) && areGraphQLErrors2(executionResult.errors) && executionResult.errors.some((err) => !err.extensions?.["originalError"] || isGraphQLError2(err.extensions["originalError"]))
  );
  const responseBody = jsonStringifyResultWithoutInternals(executionResult);
  return new fetchAPI.Response(responseBody, responseInit);
}
__name(processRegularResult, "processRegularResult");

// node_modules/graphql-yoga/esm/plugins/result-processor/sse.js
init_modules_watch_stub();
function getSSEProcessor() {
  return /* @__PURE__ */ __name(function processSSEResult(result, fetchAPI) {
    let pingIntervalMs = 12e3;
    if (false) {
      pingIntervalMs = 300;
    }
    const headersInit = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none"
    };
    const responseInit = getResponseInitByRespectingErrors(result, headersInit, true);
    let iterator;
    let pingInterval;
    const textEncoder = new fetchAPI.TextEncoder();
    const readableStream = new fetchAPI.ReadableStream({
      start(controller) {
        controller.enqueue(textEncoder.encode(":\n\n"));
        pingInterval = setInterval(() => {
          if (!controller.desiredSize) {
            clearInterval(pingInterval);
            return;
          }
          controller.enqueue(textEncoder.encode(":\n\n"));
        }, pingIntervalMs);
        if (isAsyncIterable4(result)) {
          iterator = result[Symbol.asyncIterator]();
        } else {
          let finished = false;
          iterator = {
            next: /* @__PURE__ */ __name(() => {
              if (finished) {
                return fakePromise({ done: true, value: null });
              }
              finished = true;
              return fakePromise({ done: false, value: result });
            }, "next")
          };
        }
      },
      pull(controller) {
        return handleMaybePromise(() => iterator.next(), (result2) => {
          if (result2.value != null) {
            controller.enqueue(textEncoder.encode(`event: next
`));
            const chunk = jsonStringifyResultWithoutInternals(result2.value);
            controller.enqueue(textEncoder.encode(`data: ${chunk}

`));
          }
          if (result2.done) {
            controller.enqueue(textEncoder.encode(`event: complete
`));
            controller.enqueue(textEncoder.encode(`data:

`));
            clearInterval(pingInterval);
            controller.close();
          }
        }, (err) => {
          controller.error(err);
        });
      },
      cancel(e) {
        clearInterval(pingInterval);
        if (iterator.return) {
          return handleMaybePromise(() => iterator.return?.(e), () => {
          });
        }
      }
    });
    return new fetchAPI.Response(readableStream, responseInit);
  }, "processSSEResult");
}
__name(getSSEProcessor, "getSSEProcessor");

// node_modules/graphql-yoga/esm/plugins/use-result-processor.js
var multipart = {
  mediaTypes: ["multipart/mixed"],
  asyncIterables: true,
  processResult: processMultipartResult
};
function getSSEProcessorConfig() {
  return {
    mediaTypes: ["text/event-stream"],
    asyncIterables: true,
    processResult: getSSEProcessor()
  };
}
__name(getSSEProcessorConfig, "getSSEProcessorConfig");
var regular = {
  mediaTypes: ["application/graphql-response+json", "application/json"],
  asyncIterables: false,
  processResult: processRegularResult
};
function useResultProcessors() {
  const isSubscriptionRequestMap = /* @__PURE__ */ new WeakMap();
  const sse = getSSEProcessorConfig();
  const defaultList = [sse, multipart, regular];
  const subscriptionList = [sse, regular];
  return {
    onSubscribe({ args: { contextValue } }) {
      if (contextValue.request) {
        isSubscriptionRequestMap.set(contextValue.request, true);
      }
    },
    onResultProcess({ request, result, acceptableMediaTypes, setResultProcessor }) {
      const isSubscriptionRequest = isSubscriptionRequestMap.get(request);
      const processorConfigList = isSubscriptionRequest ? subscriptionList : defaultList;
      const requestMediaTypes = getMediaTypesForRequestInOrder(request);
      const isAsyncIterableResult = isAsyncIterable4(result);
      for (const resultProcessorConfig of processorConfigList) {
        for (const requestMediaType of requestMediaTypes) {
          if (isAsyncIterableResult && !resultProcessorConfig.asyncIterables) {
            continue;
          }
          for (const processorMediaType of resultProcessorConfig.mediaTypes) {
            acceptableMediaTypes.push(processorMediaType);
            if (isMatchingMediaType(processorMediaType, requestMediaType)) {
              setResultProcessor(resultProcessorConfig.processResult, processorMediaType);
            }
          }
        }
      }
    }
  };
}
__name(useResultProcessors, "useResultProcessors");

// node_modules/graphql-yoga/esm/plugins/use-unhandled-route.js
init_modules_watch_stub();

// node_modules/graphql-yoga/esm/landing-page-html.js
init_modules_watch_stub();
var landing_page_html_default = `<!doctype html><html lang=en><head><meta charset=utf-8><title>Welcome to GraphQL Yoga</title><link rel=icon href=https://raw.githubusercontent.com/graphql-hive/graphql-yoga/refs/heads/main/website/src/app/favicon.ico><style>body,html{padding:0;margin:0;height:100%;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;color:#fff;background-color:#000}main>section.hero{display:flex;height:90vh;justify-content:center;align-items:center;flex-direction:column}.logo{display:flex;align-items:center}.buttons{margin-top:24px}h1{font-size:80px}h2{color:#888;max-width:50%;margin-top:0;text-align:center}a{color:#fff;text-decoration:none;margin-left:10px;margin-right:10px;font-weight:700;transition:color .3s ease;padding:4px;overflow:visible}a.graphiql:hover{color:rgba(255,0,255,.7)}a.docs:hover{color:rgba(28,200,238,.7)}a.tutorial:hover{color:rgba(125,85,245,.7)}svg{margin-right:24px}.not-what-your-looking-for{margin-top:5vh}.not-what-your-looking-for>*{margin-left:auto;margin-right:auto}.not-what-your-looking-for>p{text-align:center}.not-what-your-looking-for>h2{color:#464646}.not-what-your-looking-for>p{max-width:600px;line-height:1.3em}.not-what-your-looking-for>pre{max-width:300px}</style></head><body id=body><main><section class=hero><div class=logo><div><svg xmlns=http://www.w3.org/2000/svg viewBox="-0.41 0.445 472.812 499.811" height=150><defs><linearGradient id=paint0_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint1_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint2_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint3_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint4_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint5_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><filter id=filter0_f_1677_11483 x=23 y=-25 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter><filter id=filter1_f_1677_11483 x=-24 y=19 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter><linearGradient id=paint6_linear_1677_11483 x1=30 y1=28 x2=66.1645 y2=44.4363 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><filter id=filter2_f_1677_11483 x=-12 y=-44 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter><filter id=filter3_f_1677_11483 x=13 y=19 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter></defs><mask id=mask0_1677_11483 style=mask-type:alpha maskUnits=userSpaceOnUse x=16 y=14 width=58 height=62><path d="M21 25.3501C21.7279 25.3501 22.4195 25.5056 23.0433 25.7853L42.1439 14.8C43.0439 14.3 44.1439 14 45.1439 14C46.2439 14 47.2439 14.3 48.1439 14.8L64.5439 24.3C63.3439 25.1 62.4439 26.3 61.8439 27.7L45.9438 18.5C45.6439 18.3 45.344 18.3 45.0441 18.3C44.7441 18.3 44.4439 18.4 44.1439 18.5L25.8225 29.0251C25.9382 29.4471 26 29.8914 26 30.3501C26 33.1115 23.7614 35.3501 21 35.3501C18.2386 35.3501 16 33.1115 16 30.3501C16 27.5887 18.2386 25.3501 21 25.3501Z" fill=url(#paint3_linear_1677_11483) /><path d="M67.2438 35.0329C65.3487 34.3219 64 32.4934 64 30.35C64 27.5886 66.2386 25.35 69 25.35C71.7614 25.35 74 27.5886 74 30.35C74 32.1825 73.0142 33.7848 71.5439 34.6554V55.2C71.5439 57.4 70.3439 59.4 68.5439 60.5L52.1439 69.9C52.1439 68.4 51.6438 66.9 50.7438 65.8L66.3439 56.8C66.9439 56.5 67.2438 55.9 67.2438 55.2V35.0329Z" fill=url(#paint4_linear_1677_11483) /><path d="M49.8439 69.1055C49.9458 69.5034 50 69.9204 50 70.3501C50 73.1115 47.7614 75.3501 45 75.3501C42.5102 75.3501 40.4454 73.5302 40.0633 71.1481L21.8439 60.6C19.9439 59.5 18.8439 57.5 18.8439 55.3V36.8C19.5439 37 20.3439 37.2 21.0439 37.2C21.7439 37.2 22.4439 37.1 23.0439 36.9V55.3C23.0439 56 23.4438 56.6 23.9438 56.9L41.3263 66.9583C42.2398 65.9694 43.5476 65.3501 45 65.3501C47.3291 65.3501 49.2862 66.9426 49.8419 69.0981L49.8436 69.0997L49.8439 69.1055Z" fill=url(#paint5_linear_1677_11483) /></mask><mask id=mask1_1677_11483 style=mask-type:alpha maskUnits=userSpaceOnUse x=30 y=28 width=30 height=30><path fill-rule=evenodd clip-rule=evenodd d="M49.3945 32.3945C49.3945 34.7088 47.5796 38.5469 45 38.5469C42.4271 38.5469 40.6055 34.7112 40.6055 32.3945C40.6055 29.9714 42.5769 28 45 28C47.4231 28 49.3945 29.9714 49.3945 32.3945ZM35.332 49.0433V48.2148C35.332 42.8117 37.8535 41.0004 39.8796 39.545L39.8801 39.5447C40.3928 39.1767 40.8604 38.8404 41.2488 38.4742C42.3293 39.6642 43.626 40.3047 45 40.3047C46.3752 40.3047 47.6725 39.6642 48.7529 38.4754C49.1408 38.841 49.6078 39.1773 50.1199 39.5447L50.1204 39.545C52.1465 41.0004 54.668 42.8117 54.668 48.2148V49.0433L53.8406 49.092C49.9848 49.3185 46.8646 46.9002 45 43.5777C43.1159 46.935 39.9847 49.318 36.1594 49.092L35.332 49.0433ZM58.1463 51.0747L58.1463 51.0746C57.0179 50.891 50.0128 49.7507 45.0007 55.693C40.0116 49.7553 33.1965 50.8592 31.9095 51.0677L31.9095 51.0677C31.7906 51.087 31.7189 51.0986 31.7002 51.0963C31.7005 51.0969 31.7011 51.1045 31.7023 51.1187C31.726 51.4003 31.9682 54.2745 34.0566 56.2422L30 58H60L55.8956 56.2422C57.8537 54.4764 58.1396 52.2685 58.2508 51.4092V51.4091C58.2697 51.2628 58.2836 51.1556 58.2998 51.0963C58.2881 51.0977 58.2356 51.0892 58.1463 51.0747ZM40.4836 50.104C42.3956 49.3212 43.6746 48.1737 45 46.61C46.332 48.1841 47.6159 49.3259 49.5164 50.104C49.5356 50.1425 49.5557 50.1805 49.5756 50.2182C49.5793 50.2253 49.583 50.2323 49.5867 50.2393C48.0911 50.8127 46.4264 51.825 45.0047 53.1444C43.5906 51.8221 41.9673 50.8196 40.4256 50.2153C40.4455 50.1784 40.4648 50.1415 40.4836 50.104Z" fill=black /></mask><path d="M 40.59 93.095 C 46.517 93.095 52.14 94.365 57.22 96.635 L 212.7 7.22 C 220.025 3.149 228.978 0.706 237.12 0.706 C 246.073 0.706 254.213 3.149 261.54 7.22 L 395.032 84.547 C 385.264 91.059 377.939 100.827 373.055 112.224 L 243.631 37.338 C 241.19 35.71 238.747 35.71 236.305 35.71 C 233.863 35.71 231.42 36.523 228.978 37.338 L 79.84 123.009 C 80.786 126.443 81.29 130.058 81.29 133.793 C 81.29 156.269 63.065 174.493 40.59 174.493 C 18.116 174.493 -0.109 156.269 -0.109 133.793 C -0.109 111.32 18.116 93.095 40.59 93.095 Z" fill=url(#paint0_linear_1677_11483) /><path d="M 417.01 171.913 C 401.585 166.126 390.603 151.238 390.603 133.793 C 390.603 111.32 408.83 93.095 431.303 93.095 C 453.777 93.095 472.001 111.32 472.001 133.793 C 472.001 148.706 463.976 161.755 452.011 168.835 L 452.011 336.07 C 452.011 353.977 442.243 370.258 427.591 379.21 L 294.098 455.726 C 294.098 443.516 290.029 431.306 282.703 422.353 L 409.683 349.093 C 414.568 346.651 417.01 341.767 417.01 336.07 L 417.01 171.913 Z" fill=url(#paint1_linear_1677_11483) /><path d="M 275.376 449.253 C 276.206 452.495 276.646 455.889 276.646 459.389 C 276.646 481.863 258.422 500.087 235.947 500.087 C 215.679 500.087 198.87 485.272 195.761 465.883 L 47.46 380.025 C 31.995 371.071 23.041 354.792 23.041 336.884 L 23.041 186.296 C 28.738 187.923 35.25 189.553 40.948 189.553 C 46.646 189.553 52.345 188.738 57.228 187.111 L 57.228 336.884 C 57.228 342.582 60.485 347.465 64.554 349.908 L 206.042 431.777 C 213.481 423.728 224.127 418.689 235.947 418.689 C 254.905 418.689 270.833 431.656 275.36 449.196 L 275.376 449.214 L 275.376 449.253 Z" fill=url(#paint2_linear_1677_11483) /><g mask=url(#mask0_1677_11483) transform="matrix(8.139854, 0, 0, 8.139854, -130.346375, -113.251038)"><g filter=url(#filter0_f_1677_11483)><circle cx=73 cy=25 r=26 fill=#ED2E7E /></g><g filter=url(#filter1_f_1677_11483)><circle cx=26 cy=69 r=26 fill=#1CC8EE /></g></g><path fill-rule=evenodd clip-rule=evenodd d="M 271.713 150.431 C 271.713 169.275 256.948 200.517 235.947 200.517 C 215.003 200.517 200.172 169.292 200.172 150.431 C 200.172 130.708 216.225 114.666 235.947 114.666 C 255.67 114.666 271.713 130.708 271.713 150.431 Z M 157.251 285.952 L 157.251 279.212 C 157.251 235.233 177.771 220.485 194.27 208.641 C 198.447 205.644 202.247 202.901 205.414 199.923 C 214.204 209.608 224.763 214.826 235.947 214.826 C 247.138 214.826 257.697 209.608 266.496 199.931 C 269.653 202.911 273.456 205.644 277.622 208.641 C 294.114 220.485 314.642 235.233 314.642 279.212 L 314.642 285.952 L 307.912 286.351 C 276.525 288.191 251.128 268.509 235.947 241.468 C 220.611 268.795 195.126 288.191 163.981 286.351 L 157.251 285.952 Z M 342.953 302.492 C 333.771 300.994 276.751 291.715 235.955 340.082 C 195.345 291.749 139.865 300.734 129.389 302.436 C 128.428 302.59 127.841 302.688 127.687 302.665 C 127.687 302.673 127.695 302.729 127.702 302.85 C 127.897 305.138 129.867 328.532 146.872 344.55 L 113.849 358.862 L 358.044 358.862 L 324.639 344.55 C 340.576 330.177 342.905 312.202 343.807 305.212 C 343.962 304.022 344.077 303.153 344.206 302.665 C 344.108 302.68 343.686 302.606 342.953 302.492 Z M 199.188 294.59 C 214.751 288.215 225.161 278.879 235.947 266.15 C 246.788 278.96 257.241 288.255 272.707 294.59 C 272.869 294.898 273.031 295.207 273.196 295.518 C 273.219 295.574 273.252 295.631 273.285 295.688 C 261.107 300.361 247.555 308.598 235.989 319.334 C 224.477 308.573 211.258 300.417 198.715 295.493 C 198.87 295.191 199.033 294.891 199.188 294.59 Z" fill=url(#paint6_linear_1677_11483) /><g mask=url(#mask1_1677_11483) transform="matrix(8.139854, 0, 0, 8.139854, -130.346375, -113.251038)"><g filter=url(#filter2_f_1677_11483)><circle cx=38 cy=6 r=26 fill=#ED2E7E /></g><g filter=url(#filter3_f_1677_11483)><circle cx=63 cy=69 r=26 fill=#1CC8EE /></g></g></svg></div><h1>GraphQL Yoga</h1><p>Version: 5.16.0</p></div><h2>The batteries-included cross-platform GraphQL Server.</h2><div class=buttons><a href=https://www.the-guild.dev/graphql/yoga-server/docs class=docs>Read the Docs</a> <a href=https://www.the-guild.dev/graphql/yoga-server/tutorial/basic class=tutorial>Start the Tutorial </a><a href=__GRAPHIQL_LINK__ class=graphiql>Visit GraphiQL</a></div></section><section class=not-what-your-looking-for><h2>Not the page you are looking for? \u{1F440}</h2><p>This page is shown be default whenever a 404 is hit.<br>You can disable this by behavior via the <code>landingPage</code> option.</p><pre>
          <code>
import { createYoga } from 'graphql-yoga';

const yoga = createYoga({
  landingPage: false
})
          </code>
        </pre><p>If you expected this page to be the GraphQL route, you need to configure Yoga. Currently, the GraphQL route is configured to be on <code>__GRAPHIQL_LINK__</code>.</p><pre>
          <code>
import { createYoga } from 'graphql-yoga';

const yoga = createYoga({
  graphqlEndpoint: '__REQUEST_PATH__',
})
          </code>
        </pre></section></main></body></html>`;

// node_modules/graphql-yoga/esm/plugins/use-unhandled-route.js
var defaultRenderLandingPage = /* @__PURE__ */ __name(function defaultRenderLandingPage2(opts) {
  return new opts.fetchAPI.Response(landing_page_html_default.replace(/__GRAPHIQL_LINK__/g, opts.graphqlEndpoint).replace(/__REQUEST_PATH__/g, opts.url.pathname), {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "text/html"
    }
  });
}, "defaultRenderLandingPage");
function useUnhandledRoute(args) {
  let urlPattern;
  function getUrlPattern({ URLPattern }) {
    urlPattern ||= new URLPattern({
      pathname: args.graphqlEndpoint
    });
    return urlPattern;
  }
  __name(getUrlPattern, "getUrlPattern");
  const landingPageRenderer = args.landingPageRenderer || defaultRenderLandingPage;
  return {
    onRequest({ request, fetchAPI, endResponse: endResponse2, url }) {
      if (!request.url.endsWith(args.graphqlEndpoint) && !request.url.endsWith(`${args.graphqlEndpoint}/`) && url.pathname !== args.graphqlEndpoint && url.pathname !== `${args.graphqlEndpoint}/` && !getUrlPattern(fetchAPI).test(url)) {
        if (args.showLandingPage === true && request.method === "GET" && !!request.headers?.get("accept")?.includes("text/html")) {
          const landingPage$ = landingPageRenderer({
            request,
            fetchAPI,
            url,
            graphqlEndpoint: args.graphqlEndpoint,
            get urlPattern() {
              return getUrlPattern(fetchAPI);
            }
          });
          if (isPromise2(landingPage$)) {
            return landingPage$.then(endResponse2);
          }
          endResponse2(landingPage$);
          return;
        }
        endResponse2(new fetchAPI.Response("", {
          status: 404,
          statusText: "Not Found"
        }));
      }
    }
  };
}
__name(useUnhandledRoute, "useUnhandledRoute");

// node_modules/graphql-yoga/esm/process-request.js
init_modules_watch_stub();
function processResult({ request, result, fetchAPI, onResultProcessHooks, serverContext }) {
  let resultProcessor;
  const acceptableMediaTypes = [];
  let acceptedMediaType = "*/*";
  return handleMaybePromise(() => iterateAsync(onResultProcessHooks, (onResultProcessHook) => onResultProcessHook({
    request,
    acceptableMediaTypes,
    result,
    setResult(newResult) {
      result = newResult;
    },
    resultProcessor,
    setResultProcessor(newResultProcessor, newAcceptedMimeType) {
      resultProcessor = newResultProcessor;
      acceptedMediaType = newAcceptedMimeType;
    },
    serverContext
  })), () => {
    if (!resultProcessor) {
      return new fetchAPI.Response(null, {
        status: 406,
        statusText: "Not Acceptable",
        headers: {
          accept: acceptableMediaTypes.join("; charset=utf-8, ")
        }
      });
    }
    return resultProcessor(result, fetchAPI, acceptedMediaType);
  });
}
__name(processResult, "processResult");
function processRequest({ params, enveloped }) {
  const document = enveloped.parse(params.query);
  const errors = enveloped.validate(enveloped.schema, document);
  if (errors.length > 0) {
    return { errors };
  }
  return handleMaybePromise(() => enveloped.contextFactory(), (contextValue) => {
    const executionArgs = {
      schema: enveloped.schema,
      document,
      contextValue,
      variableValues: params.variables,
      operationName: params.operationName
    };
    const operation = getOperationAST(document, params.operationName);
    const executeFn = operation?.operation === "subscription" ? enveloped.subscribe : enveloped.execute;
    return executeFn(executionArgs);
  });
}
__name(processRequest, "processRequest");

// node_modules/graphql-yoga/esm/utils/mask-error.js
init_modules_watch_stub();
function serializeError(error) {
  if (isGraphQLError2(error)) {
    return error.toJSON();
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    };
  }
  return error;
}
__name(serializeError, "serializeError");
var maskError = /* @__PURE__ */ __name((error, message, isDev2 = true) => {
  if (isOriginalGraphQLError2(error)) {
    return error;
  }
  const errorExtensions = {
    code: "INTERNAL_SERVER_ERROR",
    unexpected: true
  };
  const errorOptions = {
    extensions: errorExtensions
  };
  if (isGraphQLError2(error)) {
    errorOptions.nodes = error.nodes;
    errorOptions.source = error.source;
    errorOptions.positions = error.positions;
    errorOptions.path = error.path;
    if (isDev2 && error.originalError) {
      errorExtensions["originalError"] = serializeError(error.originalError);
    }
    if (error.extensions?.["http"]) {
      errorExtensions["http"] = error.extensions["http"];
    }
  } else if (isDev2) {
    errorExtensions["originalError"] = serializeError(error);
  }
  return createGraphQLError(message, errorOptions);
}, "maskError");

// node_modules/graphql-yoga/esm/server.js
var YogaServer = class {
  static {
    __name(this, "YogaServer");
  }
  /**
   * Instance of envelop
   */
  getEnveloped;
  logger;
  graphqlEndpoint;
  fetchAPI;
  plugins;
  instrumentation;
  onRequestParseHooks;
  onParamsHooks;
  onExecutionResultHooks;
  onResultProcessHooks;
  maskedErrorsOpts;
  id;
  version = "5.16.0";
  constructor(options) {
    this.id = options?.id ?? "yoga";
    this.fetchAPI = {
      ...defaultFetchAPI
    };
    if (options?.fetchAPI) {
      for (const key in options.fetchAPI) {
        if (options.fetchAPI[key]) {
          this.fetchAPI[key] = options.fetchAPI[key];
        }
      }
    }
    const logger = options?.logging == null ? true : options.logging;
    this.logger = typeof logger === "boolean" ? logger === true ? createLogger() : createLogger("silent") : typeof logger === "string" ? createLogger(logger) : logger;
    const maskErrorFn = typeof options?.maskedErrors === "object" && options.maskedErrors.maskError || maskError;
    const maskedErrorSet = /* @__PURE__ */ new WeakSet();
    this.maskedErrorsOpts = options?.maskedErrors === false ? null : {
      errorMessage: "Unexpected error.",
      ...typeof options?.maskedErrors === "object" ? options.maskedErrors : {},
      maskError: /* @__PURE__ */ __name((error, message) => {
        if (maskedErrorSet.has(error)) {
          return error;
        }
        const newError = maskErrorFn(error, message, this.maskedErrorsOpts?.isDev);
        if (newError !== error) {
          this.logger.error(error);
        }
        maskedErrorSet.add(newError);
        return newError;
      }, "maskError")
    };
    const maskedErrors = this.maskedErrorsOpts == null ? null : this.maskedErrorsOpts;
    let batchingLimit = 0;
    if (options?.batching) {
      if (typeof options.batching === "boolean") {
        batchingLimit = 10;
      } else {
        batchingLimit = options.batching.limit ?? 10;
      }
    }
    this.graphqlEndpoint = options?.graphqlEndpoint || "/graphql";
    const graphqlEndpoint = this.graphqlEndpoint;
    this.plugins = [
      useEngine({
        parse,
        validate,
        execute: normalizedExecutor,
        subscribe: normalizedExecutor,
        specifiedRules
      }),
      // Use the schema provided by the user
      !!options?.schema && useSchema(options.schema),
      options?.allowedHeaders?.request != null && useAllowedRequestHeaders(options.allowedHeaders.request),
      options?.context != null && useExtendContext((initialContext) => {
        if (options?.context) {
          if (typeof options.context === "function") {
            return options.context(initialContext);
          }
          return options.context;
        }
        return {};
      }),
      // Middlewares before processing the incoming HTTP request
      useHealthCheck({
        id: this.id,
        logger: this.logger,
        endpoint: options?.healthCheckEndpoint
      }),
      options?.cors !== false && useCORS(options?.cors),
      options?.graphiql !== false && useGraphiQL({
        graphqlEndpoint,
        options: options?.graphiql,
        render: options?.renderGraphiQL,
        logger: this.logger
      }),
      // Middlewares before the GraphQL execution
      useRequestParser({
        match: isGETRequest,
        parse: parseGETRequest
      }),
      useRequestParser({
        match: isPOSTJsonRequest,
        parse: parsePOSTJsonRequest
      }),
      options?.multipart !== false && useRequestParser({
        match: isPOSTMultipartRequest,
        parse: parsePOSTMultipartRequest
      }),
      useRequestParser({
        match: isPOSTGraphQLStringRequest,
        parse: parsePOSTGraphQLStringRequest
      }),
      useRequestParser({
        match: isPOSTFormUrlEncodedRequest,
        parse: parsePOSTFormUrlEncodedRequest
      }),
      // Middlewares after the GraphQL execution
      useResultProcessors(),
      ...options?.plugins ?? [],
      options?.parserAndValidationCache !== false && useParserAndValidationCache(!options?.parserAndValidationCache || options?.parserAndValidationCache === true ? {} : options?.parserAndValidationCache),
      useLimitBatching(batchingLimit),
      useCheckGraphQLQueryParams(options?.extraParamNames),
      useUnhandledRoute({
        graphqlEndpoint,
        showLandingPage: options?.landingPage !== false,
        landingPageRenderer: typeof options?.landingPage === "function" ? options.landingPage : void 0
      }),
      // We check the method after user-land plugins because the plugin might support more methods (like graphql-sse).
      useCheckMethodForGraphQL(),
      // We make sure that the user doesn't send a mutation with GET
      usePreventMutationViaGET(),
      // Make sure we always throw AbortError instead of masking it!
      maskedErrors !== null && {
        onSubscribe() {
          return {
            onSubscribeError({ error }) {
              if (isAbortError(error)) {
                throw error;
              }
            }
          };
        }
      },
      maskedErrors !== null && useMaskedErrors(maskedErrors),
      options?.allowedHeaders?.response != null && useAllowedResponseHeaders(options.allowedHeaders.response),
      // We handle validation errors at the end
      useHTTPValidationError()
    ];
    this.getEnveloped = envelop({
      plugins: this.plugins
    });
    this.plugins = this.getEnveloped._plugins;
    this.onRequestParseHooks = [];
    this.onParamsHooks = [];
    this.onExecutionResultHooks = [];
    this.onResultProcessHooks = [];
    for (const plugin of this.plugins) {
      if (plugin) {
        if (plugin.onYogaInit) {
          plugin.onYogaInit({
            yoga: this
          });
        }
        if (plugin.onRequestParse) {
          this.onRequestParseHooks.push(plugin.onRequestParse);
        }
        if (plugin.onParams) {
          this.onParamsHooks.push(plugin.onParams);
        }
        if (plugin.onExecutionResult) {
          this.onExecutionResultHooks.push(plugin.onExecutionResult);
        }
        if (plugin.onResultProcess) {
          this.onResultProcessHooks.push(plugin.onResultProcess);
        }
        if (plugin.instrumentation) {
          this.instrumentation = this.instrumentation ? chain(this.instrumentation, plugin.instrumentation) : plugin.instrumentation;
        }
      }
    }
  }
  handleParams = /* @__PURE__ */ __name(({ request, context, params }) => {
    const additionalContext = context["request"] === request ? {
      params
    } : {
      request,
      params
    };
    Object.assign(context, additionalContext);
    const enveloped = this.getEnveloped(context);
    this.logger.debug(`Processing GraphQL Parameters`);
    return handleMaybePromise(() => handleMaybePromise(() => processRequest({ params, enveloped }), (result) => {
      this.logger.debug(`Processing GraphQL Parameters done.`);
      return result;
    }, (error) => {
      const errors = handleError(error, this.maskedErrorsOpts, this.logger);
      return {
        errors
      };
    }), (result) => {
      if (isAsyncIterable4(result)) {
        result = mapAsyncIterator2(result, (v) => v, (error) => {
          if (error.name === "AbortError") {
            this.logger.debug(`Request aborted`);
            throw error;
          }
          const errors = handleError(error, this.maskedErrorsOpts, this.logger);
          return {
            errors
          };
        });
      }
      return result;
    });
  }, "handleParams");
  getResultForParams = /* @__PURE__ */ __name(({ params, request }, context) => {
    let result;
    let paramsHandler = this.handleParams;
    return handleMaybePromise(() => iterateAsync(this.onParamsHooks, (onParamsHook) => onParamsHook({
      params,
      request,
      setParams(newParams) {
        params = newParams;
      },
      paramsHandler,
      setParamsHandler(newHandler) {
        paramsHandler = newHandler;
      },
      setResult(newResult) {
        result = newResult;
      },
      fetchAPI: this.fetchAPI,
      context
    })), () => handleMaybePromise(() => result || paramsHandler({
      request,
      params,
      context
    }), (result2) => handleMaybePromise(() => iterateAsync(this.onExecutionResultHooks, (onExecutionResult) => onExecutionResult({
      result: result2,
      setResult(newResult) {
        result2 = newResult;
      },
      request,
      context
    })), () => result2)));
  }, "getResultForParams");
  parseRequest = /* @__PURE__ */ __name((request, serverContext) => {
    let url = new Proxy({}, {
      get: /* @__PURE__ */ __name((_target, prop, _receiver) => {
        url = new this.fetchAPI.URL(request.url, "http://localhost");
        return Reflect.get(url, prop, url);
      }, "get")
    });
    let requestParser;
    const onRequestParseDoneList = [];
    return handleMaybePromise(() => iterateAsync(this.onRequestParseHooks, (onRequestParse) => handleMaybePromise(() => onRequestParse({
      request,
      url,
      requestParser,
      serverContext,
      setRequestParser(parser) {
        requestParser = parser;
      }
    }), (requestParseHookResult) => requestParseHookResult?.onRequestParseDone), onRequestParseDoneList), () => {
      this.logger.debug(`Parsing request to extract GraphQL parameters`);
      if (!requestParser) {
        return {
          response: new this.fetchAPI.Response(null, {
            status: 415,
            statusText: "Unsupported Media Type"
          })
        };
      }
      return handleMaybePromise(() => requestParser(request), (requestParserResult) => {
        return handleMaybePromise(() => iterateAsync(onRequestParseDoneList, (onRequestParseDone) => onRequestParseDone({
          requestParserResult,
          setRequestParserResult(newParams) {
            requestParserResult = newParams;
          }
        })), () => ({
          requestParserResult
        }));
      });
    });
  }, "parseRequest");
  handle = /* @__PURE__ */ __name((request, serverContext) => {
    const instrumented = this.instrumentation && getInstrumented({ request });
    const parseRequest = this.instrumentation?.requestParse ? instrumented.asyncFn(this.instrumentation?.requestParse, this.parseRequest) : this.parseRequest;
    return unfakePromise(fakePromise().then(() => parseRequest(request, serverContext)).then(({ response, requestParserResult }) => {
      if (response) {
        return response;
      }
      const getResultForParams = this.instrumentation?.operation ? (payload, context) => {
        const instrumented2 = getInstrumented({ context, request: payload.request });
        const tracedHandler = instrumented2.asyncFn(this.instrumentation?.operation, this.getResultForParams);
        return tracedHandler(payload, context);
      } : this.getResultForParams;
      return handleMaybePromise(() => Array.isArray(requestParserResult) ? Promise.all(requestParserResult.map((params) => getResultForParams({
        params,
        request
      }, Object.create(serverContext)))) : getResultForParams({
        params: requestParserResult,
        request
      }, serverContext), (result) => {
        const tracedProcessResult = this.instrumentation?.resultProcess ? instrumented.asyncFn(this.instrumentation.resultProcess, processResult) : processResult;
        return tracedProcessResult({
          request,
          result,
          fetchAPI: this.fetchAPI,
          onResultProcessHooks: this.onResultProcessHooks,
          serverContext
        });
      });
    }).catch((error) => {
      const errors = handleError(error, this.maskedErrorsOpts, this.logger);
      const result = {
        errors
      };
      return processResult({
        request,
        result,
        fetchAPI: this.fetchAPI,
        onResultProcessHooks: this.onResultProcessHooks,
        serverContext
      });
    }));
  }, "handle");
};
function createYoga(options) {
  const server = new YogaServer(options);
  return createServerAdapter(server, {
    fetchAPI: server.fetchAPI,
    plugins: server["plugins"],
    disposeOnProcessTerminate: options.disposeOnProcessTerminate
  });
}
__name(createYoga, "createYoga");

// graphql/schema.ts
init_modules_watch_stub();
var typeDefs = (
  /* GraphQL */
  `
  type Query {
    getMessages: [Message!]!
    me: User
  }

  type Mutation {
    addMessage(content: String!): Message!
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
  }

  type Subscription {
    newMessages: Message!
  }

  type Message {
    id: ID!
    content: String!
    createdAt: String!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }
`
);

// resolvers/index.ts
init_modules_watch_stub();

// resolvers/queries.ts
init_modules_watch_stub();

// node_modules/drizzle-orm/d1/driver.js
init_modules_watch_stub();

// node_modules/drizzle-orm/entity.js
init_modules_watch_stub();
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
__name(is, "is");

// node_modules/drizzle-orm/logger.js
init_modules_watch_stub();
var ConsoleLogWriter = class {
  static {
    __name(this, "ConsoleLogWriter");
  }
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static {
    __name(this, "DefaultLogger");
  }
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static {
    __name(this, "NoopLogger");
  }
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// node_modules/drizzle-orm/relations.js
init_modules_watch_stub();

// node_modules/drizzle-orm/table.js
init_modules_watch_stub();

// node_modules/drizzle-orm/table.utils.js
init_modules_watch_stub();
var TableName = Symbol.for("drizzle:Name");

// node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static {
    __name(this, "Table");
  }
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema2, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema2;
    this[BaseName] = baseName;
  }
};
function getTableName(table) {
  return table[TableName];
}
__name(getTableName, "getTableName");
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}
__name(getTableUniqueName, "getTableUniqueName");

// node_modules/drizzle-orm/column.js
init_modules_watch_stub();
var Column = class {
  static {
    __name(this, "Column");
  }
  constructor(table, config) {
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.keyAsName = config.keyAsName;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};

// node_modules/drizzle-orm/pg-core/primary-keys.js
init_modules_watch_stub();

// node_modules/drizzle-orm/pg-core/table.js
init_modules_watch_stub();

// node_modules/drizzle-orm/utils.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sql/sql.js
init_modules_watch_stub();

// node_modules/drizzle-orm/pg-core/columns/enum.js
init_modules_watch_stub();

// node_modules/drizzle-orm/pg-core/columns/common.js
init_modules_watch_stub();

// node_modules/drizzle-orm/column-builder.js
init_modules_watch_stub();
var ColumnBuilder = class {
  static {
    __name(this, "ColumnBuilder");
  }
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "") return;
    this.config.name = name;
  }
};

// node_modules/drizzle-orm/pg-core/foreign-keys.js
init_modules_watch_stub();
var ForeignKeyBuilder = class {
  static {
    __name(this, "ForeignKeyBuilder");
  }
  static [entityKind] = "PgForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
};
var ForeignKey = class {
  static {
    __name(this, "ForeignKey");
  }
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// node_modules/drizzle-orm/tracing-utils.js
init_modules_watch_stub();
function iife(fn, ...args) {
  return fn(...args);
}
__name(iife, "iife");

// node_modules/drizzle-orm/pg-core/unique-constraint.js
init_modules_watch_stub();
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName, "uniqueKeyName");
var UniqueConstraintBuilder = class {
  static {
    __name(this, "UniqueConstraintBuilder");
  }
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "PgUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
var UniqueOnConstraintBuilder = class {
  static {
    __name(this, "UniqueOnConstraintBuilder");
  }
  static [entityKind] = "PgUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
var UniqueConstraint = class {
  static {
    __name(this, "UniqueConstraint");
  }
  constructor(table, columns, nullsNotDistinct, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  static [entityKind] = "PgUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};

// node_modules/drizzle-orm/pg-core/utils/array.js
init_modules_watch_stub();
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
__name(parsePgArrayValue, "parsePgArrayValue");
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
__name(parsePgNestedArray, "parsePgNestedArray");
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
__name(parsePgArray, "parsePgArray");
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
__name(makePgArray, "makePgArray");

// node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class extends ColumnBuilder {
  static {
    __name(this, "PgColumnBuilder");
  }
  foreignKeyConfigs = [];
  static [entityKind] = "PgColumnBuilder";
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife(
        (ref2, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table);
        },
        ref,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table) {
    return new ExtraConfigColumn(table, this.config);
  }
};
var PgColumn = class extends Column {
  static {
    __name(this, "PgColumn");
  }
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "PgColumn";
};
var ExtraConfigColumn = class extends PgColumn {
  static {
    __name(this, "ExtraConfigColumn");
  }
  static [entityKind] = "ExtraConfigColumn";
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
var IndexedColumn = class {
  static {
    __name(this, "IndexedColumn");
  }
  static [entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};
var PgArrayBuilder = class extends PgColumnBuilder {
  static {
    __name(this, "PgArrayBuilder");
  }
  static [entityKind] = "PgArrayBuilder";
  constructor(name, baseBuilder, size) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table) {
    const baseColumn = this.config.baseBuilder.build(table);
    return new PgArray(
      table,
      this.config,
      baseColumn
    );
  }
};
var PgArray = class _PgArray extends PgColumn {
  static {
    __name(this, "PgArray");
  }
  constructor(table, config, baseColumn, range2) {
    super(table, config);
    this.baseColumn = baseColumn;
    this.range = range2;
    this.size = config.size;
  }
  size;
  static [entityKind] = "PgArray";
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map(
      (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
    );
    if (isNestedArray) return a;
    return makePgArray(a);
  }
};

// node_modules/drizzle-orm/pg-core/columns/enum.js
var PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
  static {
    __name(this, "PgEnumObjectColumnBuilder");
  }
  static [entityKind] = "PgEnumObjectColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumObjectColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumObjectColumn(
      table,
      this.config
    );
  }
};
var PgEnumObjectColumn = class extends PgColumn {
  static {
    __name(this, "PgEnumObjectColumn");
  }
  static [entityKind] = "PgEnumObjectColumn";
  enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
__name(isPgEnum, "isPgEnum");
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  static {
    __name(this, "PgEnumColumnBuilder");
  }
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumColumn(
      table,
      this.config
    );
  }
};
var PgEnumColumn = class extends PgColumn {
  static {
    __name(this, "PgEnumColumn");
  }
  static [entityKind] = "PgEnumColumn";
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};

// node_modules/drizzle-orm/subquery.js
init_modules_watch_stub();
var Subquery = class {
  static {
    __name(this, "Subquery");
  }
  static [entityKind] = "Subquery";
  constructor(sql2, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
var WithSubquery = class extends Subquery {
  static {
    __name(this, "WithSubquery");
  }
  static [entityKind] = "WithSubquery";
};

// node_modules/drizzle-orm/tracing.js
init_modules_watch_stub();

// node_modules/drizzle-orm/version.js
init_modules_watch_stub();
var version2 = "0.44.7";

// node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version2);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// node_modules/drizzle-orm/view-common.js
init_modules_watch_stub();
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// node_modules/drizzle-orm/sql/sql.js
var FakePrimitiveParam = class {
  static {
    __name(this, "FakePrimitiveParam");
  }
  static [entityKind] = "FakePrimitiveParam";
};
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
__name(isSQLWrapper, "isSQLWrapper");
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
__name(mergeQueries, "mergeQueries");
var StringChunk = class {
  static {
    __name(this, "StringChunk");
  }
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  static {
    __name(this, "SQL");
  }
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
    for (const chunk of queryChunks) {
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        this.usedTables.push(
          schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
        );
      }
    }
  }
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  /** @internal */
  usedTables = [];
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName2 = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName2) : escapeName(schemaName) + "." + escapeName(tableName2),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var Name = class {
  static {
    __name(this, "Name");
  }
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
__name(isDriverValueEncoder, "isDriverValueEncoder");
var noopDecoder = {
  mapFromDriverValue: /* @__PURE__ */ __name((value) => value, "mapFromDriverValue")
};
var noopEncoder = {
  mapToDriverValue: /* @__PURE__ */ __name((value) => value, "mapToDriverValue")
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  static {
    __name(this, "Param");
  }
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
__name(sql, "sql");
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  __name(empty, "empty");
  sql2.empty = empty;
  function fromList(list2) {
    return new SQL(list2);
  }
  __name(fromList, "fromList");
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  __name(raw, "raw");
  sql2.raw = raw;
  function join3(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  __name(join3, "join");
  sql2.join = join3;
  function identifier(value) {
    return new Name(value);
  }
  __name(identifier, "identifier");
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  __name(placeholder2, "placeholder2");
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  __name(param2, "param2");
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    static {
      __name(this, "Aliased");
    }
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  static {
    __name(this, "Placeholder");
  }
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values[p.value.name]);
    }
    return p;
  });
}
__name(fillPlaceholders, "fillPlaceholders");
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
  static {
    __name(this, "View");
  }
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  /** @internal */
  [IsDrizzleView] = true;
  constructor({ name: name2, schema: schema2, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema: schema2,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName2] of Object.entries(nullifyMap)) {
      if (typeof tableName2 === "string" && !joinsNotNullableMap[tableName2]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
__name(mapResultRow, "mapResultRow");
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
__name(orderSelectedFields, "orderSelectedFields");
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index, key] of leftKeys.entries()) {
    if (key !== rightKeys[index]) {
      return false;
    }
  }
  return true;
}
__name(haveSameKeys, "haveSameKeys");
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
__name(mapUpdateSet, "mapUpdateSet");
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor") continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
__name(applyMixins, "applyMixins");
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
__name(getTableColumns, "getTableColumns");
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
__name(getTableLikeName, "getTableLikeName");
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
__name(getColumnNameAndConfig, "getColumnNameAndConfig");
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();

// node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static {
    __name(this, "PgTable");
  }
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [Table.Symbol.ExtraConfigColumns] = {};
};

// node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder = class {
  static {
    __name(this, "PrimaryKeyBuilder");
  }
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
};
var PrimaryKey = class {
  static {
    __name(this, "PrimaryKey");
  }
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};

// node_modules/drizzle-orm/sql/expressions/conditions.js
init_modules_watch_stub();
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
__name(bindIfParam, "bindIfParam");
var eq = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
}, "eq");
var ne = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
}, "ne");
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
__name(and, "and");
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
__name(or, "or");
function not(condition) {
  return sql`not ${condition}`;
}
__name(not, "not");
var gt = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
}, "gt");
var gte = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
}, "gte");
var lt = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
}, "lt");
var lte = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
}, "lte");
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
__name(inArray, "inArray");
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
__name(notInArray, "notInArray");
function isNull(value) {
  return sql`${value} is null`;
}
__name(isNull, "isNull");
function isNotNull(value) {
  return sql`${value} is not null`;
}
__name(isNotNull, "isNotNull");
function exists(subquery) {
  return sql`exists ${subquery}`;
}
__name(exists, "exists");
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
__name(notExists, "notExists");
function between(column, min2, max2) {
  return sql`${column} between ${bindIfParam(min2, column)} and ${bindIfParam(
    max2,
    column
  )}`;
}
__name(between, "between");
function notBetween(column, min2, max2) {
  return sql`${column} not between ${bindIfParam(
    min2,
    column
  )} and ${bindIfParam(max2, column)}`;
}
__name(notBetween, "notBetween");
function like(column, value) {
  return sql`${column} like ${value}`;
}
__name(like, "like");
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
__name(notLike, "notLike");
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
__name(ilike, "ilike");
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
__name(notIlike, "notIlike");

// node_modules/drizzle-orm/sql/expressions/select.js
init_modules_watch_stub();
function asc(column) {
  return sql`${column} asc`;
}
__name(asc, "asc");
function desc(column) {
  return sql`${column} desc`;
}
__name(desc, "desc");

// node_modules/drizzle-orm/relations.js
var Relation = class {
  static {
    __name(this, "Relation");
  }
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
};
var Relations = class {
  static {
    __name(this, "Relations");
  }
  constructor(table, config) {
    this.table = table;
    this.config = config;
  }
  static [entityKind] = "Relations";
};
var One = class _One extends Relation {
  static {
    __name(this, "One");
  }
  constructor(sourceTable, referencedTable, config, isNullable) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
    this.isNullable = isNullable;
  }
  static [entityKind] = "One";
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  static {
    __name(this, "Many");
  }
  constructor(sourceTable, referencedTable, config) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
  }
  static [entityKind] = "Many";
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
__name(getOperators, "getOperators");
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
__name(getOrderByOperators, "getOrderByOperators");
function extractTablesRelationalConfig(schema2, configHelpers) {
  if (Object.keys(schema2).length === 1 && "default" in schema2 && !is(schema2["default"], Table)) {
    schema2 = schema2["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema2)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName2 = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName2) {
          const tableConfig = tablesConfig[tableName2];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
__name(extractTablesRelationalConfig, "extractTablesRelationalConfig");
function createOne(sourceTable) {
  return /* @__PURE__ */ __name(function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  }, "one");
}
__name(createOne, "createOne");
function createMany(sourceTable) {
  return /* @__PURE__ */ __name(function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  }, "many");
}
__name(createMany, "createMany");
function normalizeRelation(schema2, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema2[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
__name(normalizeRelation, "normalizeRelation");
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
__name(createTableRelationsHelpers, "createTableRelationsHelpers");
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
__name(mapRelationalRow, "mapRelationalRow");

// node_modules/drizzle-orm/sqlite-core/db.js
init_modules_watch_stub();

// node_modules/drizzle-orm/selection-proxy.js
init_modules_watch_stub();

// node_modules/drizzle-orm/alias.js
init_modules_watch_stub();
var ColumnAliasProxyHandler = class {
  static {
    __name(this, "ColumnAliasProxyHandler");
  }
  constructor(table) {
    this.table = table;
  }
  static [entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  static {
    __name(this, "TableAliasProxyHandler");
  }
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
var RelationTableAliasProxyHandler = class {
  static {
    __name(this, "RelationTableAliasProxyHandler");
  }
  constructor(alias) {
    this.alias = alias;
  }
  static [entityKind] = "RelationTableAliasProxyHandler";
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
__name(aliasedTable, "aliasedTable");
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
__name(aliasedTableColumn, "aliasedTableColumn");
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
__name(mapColumnsInAliasedSQLToAlias, "mapColumnsInAliasedSQLToAlias");
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
__name(mapColumnsInSQLToAlias, "mapColumnsInSQLToAlias");

// node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class _SelectionProxyHandler {
  static {
    __name(this, "SelectionProxyHandler");
  }
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
init_modules_watch_stub();

// node_modules/drizzle-orm/query-promise.js
init_modules_watch_stub();
var QueryPromise = class {
  static {
    __name(this, "QueryPromise");
  }
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// node_modules/drizzle-orm/sqlite-core/table.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sqlite-core/columns/all.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sqlite-core/columns/blob.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sqlite-core/columns/common.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sqlite-core/foreign-keys.js
init_modules_watch_stub();
var ForeignKeyBuilder2 = class {
  static {
    __name(this, "ForeignKeyBuilder");
  }
  static [entityKind] = "SQLiteForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey2(table, this);
  }
};
var ForeignKey2 = class {
  static {
    __name(this, "ForeignKey");
  }
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "SQLiteForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// node_modules/drizzle-orm/sqlite-core/unique-constraint.js
init_modules_watch_stub();
function uniqueKeyName2(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName2, "uniqueKeyName");
var UniqueConstraintBuilder2 = class {
  static {
    __name(this, "UniqueConstraintBuilder");
  }
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "SQLiteUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  build(table) {
    return new UniqueConstraint2(table, this.columns, this.name);
  }
};
var UniqueOnConstraintBuilder2 = class {
  static {
    __name(this, "UniqueOnConstraintBuilder");
  }
  static [entityKind] = "SQLiteUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder2(columns, this.name);
  }
};
var UniqueConstraint2 = class {
  static {
    __name(this, "UniqueConstraint");
  }
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
  }
  static [entityKind] = "SQLiteUniqueConstraint";
  columns;
  name;
  getName() {
    return this.name;
  }
};

// node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder = class extends ColumnBuilder {
  static {
    __name(this, "SQLiteColumnBuilder");
  }
  static [entityKind] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config) {
    this.config.generated = {
      as,
      type: "always",
      mode: config?.mode ?? "virtual"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder2(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
};
var SQLiteColumn = class extends Column {
  static {
    __name(this, "SQLiteColumn");
  }
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName2(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "SQLiteColumn";
};

// node_modules/drizzle-orm/sqlite-core/columns/blob.js
var SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBigIntBuilder");
  }
  static [entityKind] = "SQLiteBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(table) {
    return new SQLiteBigInt(table, this.config);
  }
};
var SQLiteBigInt = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBigInt");
  }
  static [entityKind] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return BigInt(buf.toString("utf8"));
    }
    return BigInt(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(value.toString());
  }
};
var SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBlobJsonBuilder");
  }
  static [entityKind] = "SQLiteBlobJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteBlobJson(
      table,
      this.config
    );
  }
};
var SQLiteBlobJson = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBlobJson");
  }
  static [entityKind] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return JSON.parse(buf.toString("utf8"));
    }
    return JSON.parse(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(JSON.stringify(value));
  }
};
var SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBlobBufferBuilder");
  }
  static [entityKind] = "SQLiteBlobBufferBuilder";
  constructor(name) {
    super(name, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(table) {
    return new SQLiteBlobBuffer(table, this.config);
  }
};
var SQLiteBlobBuffer = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBlobBuffer");
  }
  static [entityKind] = "SQLiteBlobBuffer";
  mapFromDriverValue(value) {
    if (Buffer.isBuffer(value)) {
      return value;
    }
    return Buffer.from(value);
  }
  getSQLType() {
    return "blob";
  }
};
function blob(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}
__name(blob, "blob");

// node_modules/drizzle-orm/sqlite-core/columns/custom.js
init_modules_watch_stub();
var SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteCustomColumnBuilder");
  }
  static [entityKind] = "SQLiteCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SQLiteCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new SQLiteCustomColumn(
      table,
      this.config
    );
  }
};
var SQLiteCustomColumn = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteCustomColumn");
  }
  static [entityKind] = "SQLiteCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(
      name,
      config,
      customTypeParams
    );
  };
}
__name(customType, "customType");

// node_modules/drizzle-orm/sqlite-core/columns/integer.js
init_modules_watch_stub();
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteBaseIntegerBuilder");
  }
  static [entityKind] = "SQLiteBaseIntegerBuilder";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config) {
    if (config?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
};
var SQLiteBaseInteger = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteBaseInteger");
  }
  static [entityKind] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
};
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
  static {
    __name(this, "SQLiteIntegerBuilder");
  }
  static [entityKind] = "SQLiteIntegerBuilder";
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table) {
    return new SQLiteInteger(
      table,
      this.config
    );
  }
};
var SQLiteInteger = class extends SQLiteBaseInteger {
  static {
    __name(this, "SQLiteInteger");
  }
  static [entityKind] = "SQLiteInteger";
};
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
  static {
    __name(this, "SQLiteTimestampBuilder");
  }
  static [entityKind] = "SQLiteTimestampBuilder";
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table) {
    return new SQLiteTimestamp(
      table,
      this.config
    );
  }
};
var SQLiteTimestamp = class extends SQLiteBaseInteger {
  static {
    __name(this, "SQLiteTimestamp");
  }
  static [entityKind] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
};
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
  static {
    __name(this, "SQLiteBooleanBuilder");
  }
  static [entityKind] = "SQLiteBooleanBuilder";
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table) {
    return new SQLiteBoolean(
      table,
      this.config
    );
  }
};
var SQLiteBoolean = class extends SQLiteBaseInteger {
  static {
    __name(this, "SQLiteBoolean");
  }
  static [entityKind] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
};
function integer(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if (config?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
__name(integer, "integer");

// node_modules/drizzle-orm/sqlite-core/columns/numeric.js
init_modules_watch_stub();
var SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteNumericBuilder");
  }
  static [entityKind] = "SQLiteNumericBuilder";
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumeric(
      table,
      this.config
    );
  }
};
var SQLiteNumeric = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteNumeric");
  }
  static [entityKind] = "SQLiteNumeric";
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    return String(value);
  }
  getSQLType() {
    return "numeric";
  }
};
var SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteNumericNumberBuilder");
  }
  static [entityKind] = "SQLiteNumericNumberBuilder";
  constructor(name) {
    super(name, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumericNumber(
      table,
      this.config
    );
  }
};
var SQLiteNumericNumber = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteNumericNumber");
  }
  static [entityKind] = "SQLiteNumericNumber";
  mapFromDriverValue(value) {
    if (typeof value === "number") return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
var SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteNumericBigIntBuilder");
  }
  static [entityKind] = "SQLiteNumericBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumericBigInt(
      table,
      this.config
    );
  }
};
var SQLiteNumericBigInt = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteNumericBigInt");
  }
  static [entityKind] = "SQLiteNumericBigInt";
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
__name(numeric, "numeric");

// node_modules/drizzle-orm/sqlite-core/columns/real.js
init_modules_watch_stub();
var SQLiteRealBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteRealBuilder");
  }
  static [entityKind] = "SQLiteRealBuilder";
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  /** @internal */
  build(table) {
    return new SQLiteReal(table, this.config);
  }
};
var SQLiteReal = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteReal");
  }
  static [entityKind] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
};
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
__name(real, "real");

// node_modules/drizzle-orm/sqlite-core/columns/text.js
init_modules_watch_stub();
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteTextBuilder");
  }
  static [entityKind] = "SQLiteTextBuilder";
  constructor(name, config) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config.enum;
    this.config.length = config.length;
  }
  /** @internal */
  build(table) {
    return new SQLiteText(
      table,
      this.config
    );
  }
};
var SQLiteText = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteText");
  }
  static [entityKind] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
};
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
  static {
    __name(this, "SQLiteTextJsonBuilder");
  }
  static [entityKind] = "SQLiteTextJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteTextJson(
      table,
      this.config
    );
  }
};
var SQLiteTextJson = class extends SQLiteColumn {
  static {
    __name(this, "SQLiteTextJson");
  }
  static [entityKind] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
};
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config);
}
__name(text, "text");

// node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}
__name(getSQLiteColumnBuilders, "getSQLiteColumnBuilders");

// node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys2 = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var SQLiteTable = class extends Table {
  static {
    __name(this, "SQLiteTable");
  }
  static [entityKind] = "SQLiteTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys: InlineForeignKeys2
  });
  /** @internal */
  [Table.Symbol.Columns];
  /** @internal */
  [InlineForeignKeys2] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
function sqliteTableBase(name, columns, extraConfig, schema2, baseName = name) {
  const rawTable = new SQLiteTable(name, schema2, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
__name(sqliteTableBase, "sqliteTableBase");
var sqliteTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
}, "sqliteTable");

// node_modules/drizzle-orm/sqlite-core/utils.js
init_modules_watch_stub();
function extractUsedTable(table) {
  if (is(table, SQLiteTable)) {
    return [`${table[Table.Symbol.BaseName]}`];
  }
  if (is(table, Subquery)) {
    return table._.usedTables ?? [];
  }
  if (is(table, SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}
__name(extractUsedTable, "extractUsedTable");

// node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase = class extends QueryPromise {
  static {
    __name(this, "SQLiteDeleteBase");
  }
  constructor(table, session, dialect, withList) {
    super();
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.config = { table, withList };
  }
  static [entityKind] = "SQLiteDelete";
  /** @internal */
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.table[Table.Symbol.Columns],
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true,
      void 0,
      {
        type: "delete",
        tables: extractUsedTable(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute(placeholderValues) {
    return this._prepare().execute(placeholderValues);
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
init_modules_watch_stub();

// node_modules/drizzle-orm/sqlite-core/dialect.js
init_modules_watch_stub();

// node_modules/drizzle-orm/casing.js
init_modules_watch_stub();
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
__name(toSnakeCase, "toSnakeCase");
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
__name(toCamelCase, "toCamelCase");
function noopCase(input) {
  return input;
}
__name(noopCase, "noopCase");
var CasingCache = class {
  static {
    __name(this, "CasingCache");
  }
  static [entityKind] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(casing) {
    this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
  }
  getColumnCasing(column) {
    if (!column.keyAsName) return column.name;
    const schema2 = column.table[Table.Symbol.Schema] ?? "public";
    const tableName2 = column.table[Table.Symbol.OriginalName];
    const key = `${schema2}.${tableName2}.${column.name}`;
    if (!this.cache[key]) {
      this.cacheTable(column.table);
    }
    return this.cache[key];
  }
  cacheTable(table) {
    const schema2 = table[Table.Symbol.Schema] ?? "public";
    const tableName2 = table[Table.Symbol.OriginalName];
    const tableKey = `${schema2}.${tableName2}`;
    if (!this.cachedTables[tableKey]) {
      for (const column of Object.values(table[Table.Symbol.Columns])) {
        const columnKey = `${tableKey}.${column.name}`;
        this.cache[columnKey] = this.convert(column.name);
      }
      this.cachedTables[tableKey] = true;
    }
  }
  clearCache() {
    this.cache = {};
    this.cachedTables = {};
  }
};

// node_modules/drizzle-orm/errors.js
init_modules_watch_stub();
var DrizzleError = class extends Error {
  static {
    __name(this, "DrizzleError");
  }
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var DrizzleQueryError = class _DrizzleQueryError extends Error {
  static {
    __name(this, "DrizzleQueryError");
  }
  constructor(query, params, cause) {
    super(`Failed query: ${query}
params: ${params}`);
    this.query = query;
    this.params = params;
    this.cause = cause;
    Error.captureStackTrace(this, _DrizzleQueryError);
    if (cause) this.cause = cause;
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static {
    __name(this, "TransactionRollbackError");
  }
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};

// node_modules/drizzle-orm/sqlite-core/view-base.js
init_modules_watch_stub();
var SQLiteViewBase = class extends View {
  static {
    __name(this, "SQLiteViewBase");
  }
  static [entityKind] = "SQLiteViewBase";
};

// node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect = class {
  static {
    __name(this, "SQLiteDialect");
  }
  static [entityKind] = "SQLiteDialect";
  /** @internal */
  casing;
  constructor(config) {
    this.casing = new CasingCache(config?.casing);
  }
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(_num) {
    return "?";
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length) return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? sql.param(col.onUpdateFn(), col);
      const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, joins, from, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, Column)) {
                  return sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        const tableName2 = field.table[Table.Symbol.Name];
        if (field.columnType === "SQLiteNumericBigInt") {
          if (isSingleTable) {
            chunk.push(sql`cast(${sql.identifier(this.casing.getColumnCasing(field))} as text)`);
          } else {
            chunk.push(
              sql`cast(${sql.identifier(tableName2)}.${sql.identifier(this.casing.getColumnCasing(field))} as text)`
            );
          }
        } else {
          if (isSingleTable) {
            chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
          } else {
            chunk.push(sql`${sql.identifier(tableName2)}.${sql.identifier(this.casing.getColumnCasing(field))}`);
          }
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    if (joins) {
      for (const [index, joinMeta] of joins.entries()) {
        if (index === 0) {
          joinsArray.push(sql` `);
        }
        const table = joinMeta.table;
        const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
        if (is(table, SQLiteTable)) {
          const tableName2 = table[SQLiteTable.Symbol.Name];
          const tableSchema = table[SQLiteTable.Symbol.Schema];
          const origTableName = table[SQLiteTable.Symbol.OriginalName];
          const alias = tableName2 === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
          );
        } else {
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${table}${onSql}`
          );
        }
        if (index < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    return sql.join(joinsArray);
  }
  buildLimit(limit) {
    return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
  }
  buildOrderBy(orderBy) {
    const orderByList = [];
    if (orderBy) {
      for (const [index, orderByValue] of orderBy.entries()) {
        orderByList.push(orderByValue);
        if (index < orderBy.length - 1) {
          orderByList.push(sql`, `);
        }
      }
    }
    return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
  }
  buildFromTable(table) {
    if (is(table, Table) && table[Table.Symbol.IsAlias]) {
      return sql`${sql`${sql.identifier(table[Table.Symbol.Schema] ?? "")}.`.if(table[Table.Symbol.Schema])}${sql.identifier(table[Table.Symbol.OriginalName])} ${sql.identifier(table[Table.Symbol.Name])}`;
    }
    return table;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy: groupBy2,
    limit,
    offset,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName2 = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName2}"."${f.field.name}", but the table "${tableName2}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    const groupByList = [];
    if (groupBy2) {
      for (const [index, groupByValue] of groupBy2.entries()) {
        groupByList.push(groupByValue);
        if (index < groupBy2.length - 1) {
          groupByList.push(sql`, `);
        }
      }
    }
    const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`${leftSelect.getSQL()} `;
    const rightChunk = sql`${rightSelect.getSQL()}`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, SQLiteColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, SQLiteColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(this.casing.getColumnCasing(chunk));
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select: select2 }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(
      ([_, col]) => !col.shouldDisableInsert()
    );
    const insertOrder = colEntries.map(([, column]) => sql.identifier(this.casing.getColumnCasing(column)));
    if (select2) {
      const select22 = valuesOrSelect;
      if (is(select22, SQL)) {
        valuesSqlList.push(select22);
      } else {
        valuesSqlList.push(select22.getSQL());
      }
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
            let defaultValue;
            if (col.default !== null && col.default !== void 0) {
              defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
            } else if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
            } else {
              defaultValue = sql`null`;
            }
            valueList.push(defaultValue);
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict?.length ? sql.join(onConflict) : void 0;
    return sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource
    });
  }
  buildRelationalQuery({
    fullSchema,
    schema: schema2,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config.where) {
        const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config.with) {
        selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config.extras) {
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config.limit;
      offset = config.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema2, tableNamesMap, relation);
        const relationTableName = getTableUniqueName(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema: schema2,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema2[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({
        message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(
        selection.map(
          ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(this.casing.getColumnCasing(field2)) : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_group_array(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            }
          ],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};
var SQLiteSyncDialect = class extends SQLiteDialect {
  static {
    __name(this, "SQLiteSyncDialect");
  }
  static [entityKind] = "SQLiteSyncDialect";
  migrate(migrations, session, config) {
    const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    session.run(migrationTableCreate);
    const dbMigrations = session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    session.run(sql`BEGIN`);
    try {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            session.run(sql.raw(stmt));
          }
          session.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
      session.run(sql`COMMIT`);
    } catch (e) {
      session.run(sql`ROLLBACK`);
      throw e;
    }
  }
};
var SQLiteAsyncDialect = class extends SQLiteDialect {
  static {
    __name(this, "SQLiteAsyncDialect");
  }
  static [entityKind] = "SQLiteAsyncDialect";
  async migrate(migrations, session, config) {
    const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    await session.run(migrationTableCreate);
    const dbMigrations = await session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.run(sql.raw(stmt));
          }
          await tx.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/select.js
init_modules_watch_stub();

// node_modules/drizzle-orm/query-builders/query-builder.js
init_modules_watch_stub();
var TypedQueryBuilder = class {
  static {
    __name(this, "TypedQueryBuilder");
  }
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/select.js
var SQLiteSelectBuilder = class {
  static {
    __name(this, "SQLiteSelectBuilder");
  }
  static [entityKind] = "SQLiteSelectBuilder";
  fields;
  session;
  dialect;
  withList;
  distinct;
  constructor(config) {
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    this.withList = config.withList;
    this.distinct = config.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(source._.selectedFields).map((key) => [key, source[key]])
      );
    } else if (is(source, SQLiteViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new SQLiteSelectBase({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
  static {
    __name(this, "SQLiteSelectQueryBuilderBase");
  }
  static [entityKind] = "SQLiteSelectQueryBuilder";
  _;
  /** @internal */
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  cacheConfig = void 0;
  usedTables = /* @__PURE__ */ new Set();
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields,
      config: this.config
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
    for (const item of extractUsedTable(table)) this.usedTables.add(item);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName2 = getTableLikeName(table);
      for (const item of extractUsedTable(table)) this.usedTables.add(item);
      if (typeof tableName2 === "string" && this.config.joins?.some((join3) => join3.alias === tableName2)) {
        throw new Error(`Alias "${tableName2}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName2 === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName2] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName2 });
      if (typeof tableName2 === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName2] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName2] = true;
            break;
          }
          case "cross":
          case "inner": {
            this.joinsNotNullableMap[tableName2] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName2] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  /**
   * Executes a `cross join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
   *
   * @param table the table to join.
   *
   * @example
   *
   * ```ts
   * // Select all users, each user with every pet
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .crossJoin(pets)
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .crossJoin(pets)
   * ```
   */
  crossJoin = this.createJoin("cross");
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/sqlite-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/sqlite-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/sqlite-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/sqlite-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy2 = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy2) ? groupBy2 : [groupBy2];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    const usedTables = [];
    usedTables.push(...extractUsedTable(this.config.table));
    if (this.config.joins) {
      for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
    }
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
};
var SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
  static {
    __name(this, "SQLiteSelectBase");
  }
  static [entityKind] = "SQLiteSelect";
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      fieldsList,
      "all",
      true,
      void 0,
      {
        type: "select",
        tables: [...this.usedTables]
      },
      this.cacheConfig
    );
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  $withCache(config) {
    this.cacheConfig = config === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config };
    return this;
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute() {
    return this.all();
  }
};
applyMixins(SQLiteSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select2) => ({
      type,
      isAll,
      rightSelect: select2
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
__name(createSetOperator, "createSetOperator");
var getSQLiteSetOperators = /* @__PURE__ */ __name(() => ({
  union,
  unionAll,
  intersect,
  except
}), "getSQLiteSetOperators");
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var except = createSetOperator("except", false);

// node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder = class {
  static {
    __name(this, "QueryBuilder");
  }
  static [entityKind] = "SQLiteQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
    this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
  }
  $with = /* @__PURE__ */ __name((alias, selection) => {
    const queryBuilder = this;
    const as = /* @__PURE__ */ __name((qb) => {
      if (typeof qb === "function") {
        qb = qb(queryBuilder);
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    }, "as");
    return { as };
  }, "$with");
  with(...queries) {
    const self = this;
    function select2(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    __name(select2, "select");
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    __name(selectDistinct, "selectDistinct");
    return { select: select2, selectDistinct };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new SQLiteSyncDialect(this.dialectConfig);
    }
    return this.dialect;
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder = class {
  static {
    __name(this, "SQLiteInsertBuilder");
  }
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "SQLiteInsertBuilder";
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
  }
  select(selectQuery) {
    const select2 = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select2, SQL) && !haveSameKeys(this.table[Columns], select2._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new SQLiteInsertBase(this.table, select2, this.session, this.dialect, this.withList, true);
  }
};
var SQLiteInsertBase = class extends QueryPromise {
  static {
    __name(this, "SQLiteInsertBase");
  }
  constructor(table, values, session, dialect, withList, select2) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, withList, select: select2 };
  }
  static [entityKind] = "SQLiteInsert";
  /** @internal */
  config;
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config = {}) {
    if (!this.config.onConflict) this.config.onConflict = [];
    if (config.target === void 0) {
      this.config.onConflict.push(sql` on conflict do nothing`);
    } else {
      const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
      const whereSql = config.where ? sql` where ${config.where}` : sql``;
      this.config.onConflict.push(sql` on conflict ${targetSql} do nothing${whereSql}`);
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config) {
    if (config.where && (config.targetWhere || config.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    if (!this.config.onConflict) this.config.onConflict = [];
    const whereSql = config.where ? sql` where ${config.where}` : void 0;
    const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
    const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
    const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
    this.config.onConflict.push(
      sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`
    );
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true,
      void 0,
      {
        type: "insert",
        tables: extractUsedTable(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/update.js
init_modules_watch_stub();
var SQLiteUpdateBuilder = class {
  static {
    __name(this, "SQLiteUpdateBuilder");
  }
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "SQLiteUpdateBuilder";
  set(values) {
    return new SQLiteUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    );
  }
};
var SQLiteUpdateBase = class extends QueryPromise {
  static {
    __name(this, "SQLiteUpdateBase");
  }
  constructor(table, set, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table, withList, joins: [] };
  }
  static [entityKind] = "SQLiteUpdate";
  /** @internal */
  config;
  from(source) {
    this.config.from = source;
    return this;
  }
  createJoin(joinType) {
    return (table, on) => {
      const tableName2 = getTableLikeName(table);
      if (typeof tableName2 === "string" && this.config.joins.some((join3) => join3.alias === tableName2)) {
        throw new Error(`Alias "${tableName2}" is already used in this query`);
      }
      if (typeof on === "function") {
        const from = this.config.from ? is(table, SQLiteTable) ? table[Table.Symbol.Columns] : is(table, Subquery) ? table._.selectedFields : is(table, SQLiteViewBase) ? table[ViewBaseConfig].selectedFields : void 0 : void 0;
        on = on(
          new Proxy(
            this.config.table[Table.Symbol.Columns],
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          from && new Proxy(
            from,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      this.config.joins.push({ on, table, joinType, alias: tableName2 });
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.table[Table.Symbol.Columns],
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true,
      void 0,
      {
        type: "insert",
        tables: extractUsedTable(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().run(placeholderValues);
  }, "run");
  all = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().all(placeholderValues);
  }, "all");
  get = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().get(placeholderValues);
  }, "get");
  values = /* @__PURE__ */ __name((placeholderValues) => {
    return this._prepare().values(placeholderValues);
  }, "values");
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/count.js
init_modules_watch_stub();
var SQLiteCountBuilder = class _SQLiteCountBuilder extends SQL {
  static {
    __name(this, "SQLiteCountBuilder");
  }
  constructor(params) {
    super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.session = params.session;
    this.sql = _SQLiteCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  static [entityKind] = "SQLiteCountBuilderAsync";
  [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
  session;
  static buildEmbeddedCount(source, filters) {
    return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return sql`select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters}`;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/query.js
init_modules_watch_stub();
var RelationalQueryBuilder = class {
  static {
    __name(this, "RelationalQueryBuilder");
  }
  constructor(mode, fullSchema, schema2, tableNamesMap, table, tableConfig, dialect, session) {
    this.mode = mode;
    this.fullSchema = fullSchema;
    this.schema = schema2;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  static [entityKind] = "SQLiteAsyncRelationalQueryBuilder";
  findMany(config) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    );
  }
  findFirst(config) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
var SQLiteRelationalQuery = class extends QueryPromise {
  static {
    __name(this, "SQLiteRelationalQuery");
  }
  constructor(fullSchema, schema2, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema2;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
  }
  static [entityKind] = "SQLiteAsyncRelationalQuery";
  /** @internal */
  mode;
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(isOneTimeQuery = false) {
    const { query, builtQuery } = this._toSQL();
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      builtQuery,
      void 0,
      this.mode === "first" ? "get" : "all",
      true,
      (rawRows, mapColumnValue) => {
        const rows = rawRows.map(
          (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
        );
        if (this.mode === "first") {
          return rows[0];
        }
        return rows;
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  _toSQL() {
    const query = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    if (this.mode === "first") {
      return this._prepare(false).get();
    }
    return this._prepare(false).all();
  }
  async execute() {
    return this.executeRaw();
  }
};
var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
  static {
    __name(this, "SQLiteSyncRelationalQuery");
  }
  static [entityKind] = "SQLiteSyncRelationalQuery";
  sync() {
    return this.executeRaw();
  }
};

// node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
init_modules_watch_stub();
var SQLiteRaw = class extends QueryPromise {
  static {
    __name(this, "SQLiteRaw");
  }
  constructor(execute3, getSQL, action, dialect, mapBatchResult) {
    super();
    this.execute = execute3;
    this.getSQL = getSQL;
    this.dialect = dialect;
    this.mapBatchResult = mapBatchResult;
    this.config = { action };
  }
  static [entityKind] = "SQLiteRaw";
  /** @internal */
  config;
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};

// node_modules/drizzle-orm/sqlite-core/db.js
var BaseSQLiteDatabase = class {
  static {
    __name(this, "BaseSQLiteDatabase");
  }
  constructor(resultKind, dialect, session, schema2) {
    this.resultKind = resultKind;
    this.dialect = dialect;
    this.session = session;
    this._ = schema2 ? {
      schema: schema2.schema,
      fullSchema: schema2.fullSchema,
      tableNamesMap: schema2.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    };
    this.query = {};
    const query = this.query;
    if (this._.schema) {
      for (const [tableName2, columns] of Object.entries(this._.schema)) {
        query[tableName2] = new RelationalQueryBuilder(
          resultKind,
          schema2.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema2.fullSchema[tableName2],
          columns,
          dialect,
          session
        );
      }
    }
    this.$cache = { invalidate: /* @__PURE__ */ __name(async (_params) => {
    }, "invalidate") };
  }
  static [entityKind] = "BaseSQLiteDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with = /* @__PURE__ */ __name((alias, selection) => {
    const self = this;
    const as = /* @__PURE__ */ __name((qb) => {
      if (typeof qb === "function") {
        qb = qb(new QueryBuilder(self.dialect));
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    }, "as");
    return { as };
  }, "$with");
  $count(source, filters) {
    return new SQLiteCountBuilder({ source, filters, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select2(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    __name(select2, "select");
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    __name(selectDistinct, "selectDistinct");
    function update(table) {
      return new SQLiteUpdateBuilder(table, self.session, self.dialect, queries);
    }
    __name(update, "update");
    function insert(into) {
      return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
    }
    __name(insert, "insert");
    function delete_(from) {
      return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
    }
    __name(delete_, "delete_");
    return { select: select2, selectDistinct, update, insert, delete: delete_ };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table) {
    return new SQLiteUpdateBuilder(table, this.session, this.dialect);
  }
  $cache;
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(into) {
    return new SQLiteInsertBuilder(into, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(from) {
    return new SQLiteDeleteBase(from, this.session, this.dialect);
  }
  run(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.run(sequel),
        () => sequel,
        "run",
        this.dialect,
        this.session.extractRawRunValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.run(sequel);
  }
  all(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.all(sequel),
        () => sequel,
        "all",
        this.dialect,
        this.session.extractRawAllValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.all(sequel);
  }
  get(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.get(sequel),
        () => sequel,
        "get",
        this.dialect,
        this.session.extractRawGetValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.get(sequel);
  }
  values(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.values(sequel),
        () => sequel,
        "values",
        this.dialect,
        this.session.extractRawValuesValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.values(sequel);
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
};

// node_modules/drizzle-orm/d1/session.js
init_modules_watch_stub();

// node_modules/drizzle-orm/cache/core/cache.js
init_modules_watch_stub();
var Cache = class {
  static {
    __name(this, "Cache");
  }
  static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
  static {
    __name(this, "NoopCache");
  }
  strategy() {
    return "all";
  }
  static [entityKind] = "NoopCache";
  async get(_key) {
    return void 0;
  }
  async put(_hashedQuery, _response, _tables, _config) {
  }
  async onMutate(_params) {
  }
};
async function hashQuery(sql2, params) {
  const dataToHash = `${sql2}-${JSON.stringify(params)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
__name(hashQuery, "hashQuery");

// node_modules/drizzle-orm/sqlite-core/session.js
init_modules_watch_stub();
var ExecuteResultSync = class extends QueryPromise {
  static {
    __name(this, "ExecuteResultSync");
  }
  constructor(resultCb) {
    super();
    this.resultCb = resultCb;
  }
  static [entityKind] = "ExecuteResultSync";
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
};
var SQLitePreparedQuery = class {
  static {
    __name(this, "SQLitePreparedQuery");
  }
  constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
    this.mode = mode;
    this.executeMethod = executeMethod;
    this.query = query;
    this.cache = cache;
    this.queryMetadata = queryMetadata;
    this.cacheConfig = cacheConfig;
    if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
      this.cacheConfig = { enable: true, autoInvalidate: true };
    }
    if (!this.cacheConfig?.enable) {
      this.cacheConfig = void 0;
    }
  }
  static [entityKind] = "PreparedQuery";
  /** @internal */
  joinsNotNullableMap;
  /** @internal */
  async queryWithCache(queryString, params, query) {
    if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.cacheConfig && !this.cacheConfig.enable) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
      try {
        const [res] = await Promise.all([
          query(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return res;
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (!this.cacheConfig) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.queryMetadata.type === "select") {
      const fromCache = await this.cache.get(
        this.cacheConfig.tag ?? await hashQuery(queryString, params),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (fromCache === void 0) {
        let result;
        try {
          result = await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
        await this.cache.put(
          this.cacheConfig.tag ?? await hashQuery(queryString, params),
          result,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        );
        return result;
      }
      return fromCache;
    }
    try {
      return await query();
    } catch (e) {
      throw new DrizzleQueryError(queryString, params, e);
    }
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(result, _isFromBatch) {
    return result;
  }
  mapAllResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  mapGetResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  execute(placeholderValues) {
    if (this.mode === "async") {
      return this[this.executeMethod](placeholderValues);
    }
    return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
  }
  mapResult(response, isFromBatch) {
    switch (this.executeMethod) {
      case "run": {
        return this.mapRunResult(response, isFromBatch);
      }
      case "all": {
        return this.mapAllResult(response, isFromBatch);
      }
      case "get": {
        return this.mapGetResult(response, isFromBatch);
      }
    }
  }
};
var SQLiteSession = class {
  static {
    __name(this, "SQLiteSession");
  }
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "SQLiteSession";
  prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return this.prepareQuery(
      query,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper,
      queryMetadata,
      cacheConfig
    );
  }
  run(query) {
    const staticQuery = this.dialect.sqlToQuery(query);
    try {
      return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
    } catch (err) {
      throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(result) {
    return result;
  }
  all(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  get(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  values(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
  }
  async count(sql2) {
    const result = await this.values(sql2);
    return result[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
};
var SQLiteTransaction = class extends BaseSQLiteDatabase {
  static {
    __name(this, "SQLiteTransaction");
  }
  constructor(resultType, dialect, session, schema2, nestedIndex = 0) {
    super(resultType, dialect, session, schema2);
    this.schema = schema2;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "SQLiteTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
};

// node_modules/drizzle-orm/d1/session.js
var SQLiteD1Session = class extends SQLiteSession {
  static {
    __name(this, "SQLiteD1Session");
  }
  constructor(client, dialect, schema2, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema2;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "SQLiteD1Session";
  logger;
  cache;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    const stmt = this.client.prepare(query.sql);
    return new D1PreparedQuery(
      stmt,
      query,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      if (builtQuery.params.length > 0) {
        builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
      } else {
        const builtQuery2 = preparedQuery.getQuery();
        builtQueries.push(
          this.client.prepare(builtQuery2.sql).bind(...builtQuery2.params)
        );
      }
    }
    const batchResults = await this.client.batch(builtQueries);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  extractRawAllValueFromBatchResult(result) {
    return result.results;
  }
  extractRawGetValueFromBatchResult(result) {
    return result.results[0];
  }
  extractRawValuesValueFromBatchResult(result) {
    return d1ToRawMapping(result.results);
  }
  async transaction(transaction, config) {
    const tx = new D1Transaction("async", this.dialect, this, this.schema);
    await this.run(sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
    try {
      const result = await transaction(tx);
      await this.run(sql`commit`);
      return result;
    } catch (err) {
      await this.run(sql`rollback`);
      throw err;
    }
  }
};
var D1Transaction = class _D1Transaction extends SQLiteTransaction {
  static {
    __name(this, "D1Transaction");
  }
  static [entityKind] = "D1Transaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new _D1Transaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};
function d1ToRawMapping(results) {
  const rows = [];
  for (const row of results) {
    const entry = Object.keys(row).map((k) => row[k]);
    rows.push(entry);
  }
  return rows;
}
__name(d1ToRawMapping, "d1ToRawMapping");
var D1PreparedQuery = class extends SQLitePreparedQuery {
  static {
    __name(this, "D1PreparedQuery");
  }
  constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
    this.logger = logger;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.fields = fields;
    this.stmt = stmt;
  }
  static [entityKind] = "D1PreparedQuery";
  /** @internal */
  customResultMapper;
  /** @internal */
  fields;
  /** @internal */
  stmt;
  async run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.stmt.bind(...params).run();
    });
  }
  async all(placeholderValues) {
    const { fields, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
      });
    }
    const rows = await this.values(placeholderValues);
    return this.mapAllResult(rows);
  }
  mapAllResult(rows, isFromBatch) {
    if (isFromBatch) {
      rows = d1ToRawMapping(rows.results);
    }
    if (!this.fields && !this.customResultMapper) {
      return rows;
    }
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
  }
  async get(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return stmt.bind(...params).all().then(({ results }) => results[0]);
      });
    }
    const rows = await this.values(placeholderValues);
    if (!rows[0]) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return mapResultRow(fields, rows[0], joinsNotNullableMap);
  }
  mapGetResult(result, isFromBatch) {
    if (isFromBatch) {
      result = d1ToRawMapping(result.results)[0];
    }
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    if (this.customResultMapper) {
      return this.customResultMapper([result]);
    }
    return mapResultRow(this.fields, result, this.joinsNotNullableMap);
  }
  async values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.stmt.bind(...params).raw();
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};

// node_modules/drizzle-orm/d1/driver.js
var DrizzleD1Database = class extends BaseSQLiteDatabase {
  static {
    __name(this, "DrizzleD1Database");
  }
  static [entityKind] = "D1Database";
  async batch(batch) {
    return this.session.batch(batch);
  }
};
function drizzle(client, config = {}) {
  const dialect = new SQLiteAsyncDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema2;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema2 = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new SQLiteD1Session(client, dialect, schema2, { logger, cache: config.cache });
  const db = new DrizzleD1Database("async", dialect, session, schema2);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
__name(drizzle, "drizzle");

// drizzle/schema.ts
init_modules_watch_stub();
var users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  avatar: text("avatar"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP")
});
var tours = sqliteTable("tours", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: integer("price").notNull(),
  // Price in cents
  currency: text("currency").default("USD"),
  duration: integer("duration"),
  // Duration in hours
  durationType: text("duration_type").default("hours"),
  // hours, days, weeks
  location: text("location").notNull(),
  coordinates: text("coordinates"),
  // JSON: {lat, lng}
  category: text("category"),
  // adventure, cultural, nature, etc.
  difficulty: text("difficulty").default("easy"),
  // easy, medium, hard
  maxParticipants: integer("max_participants"),
  minParticipants: integer("min_participants").default(1),
  imageUrl: text("image_url"),
  gallery: text("gallery"),
  // JSON array of image URLs
  tags: text("tags"),
  // JSON array of tags
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP")
});
var messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").default("text"),
  // text, image, file, system
  metadata: text("metadata"),
  // JSON for additional data
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP")
});
var subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  connectionId: text("connection_id").notNull(),
  connectionPoolId: text("connection_pool_id").notNull(),
  subscription: text("subscription").notNull(),
  topic: text("topic").notNull(),
  filter: text("filter"),
  userId: integer("user_id").references(() => users.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  expiresAt: text("expires_at")
});

// resolvers/queries.ts
var getMessages = /* @__PURE__ */ __name(async (_parent, _args, context) => {
  const db = drizzle(context.env.DB);
  return await db.select().from(messages).all();
}, "getMessages");
var me = /* @__PURE__ */ __name(async (_parent, _args, _context) => {
  return null;
}, "me");
var Query = {
  getMessages,
  me
};

// resolvers/mutations.ts
init_modules_watch_stub();

// resolvers/utils.ts
init_modules_watch_stub();
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, [
    "deriveBits"
  ]);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      // High iteration count for security
      hash: "SHA-256"
    },
    key,
    256
    // 256 bits = 32 bytes
  );
  const combined = new Uint8Array(salt.length + derivedBits.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(derivedBits), salt.length);
  return btoa(String.fromCharCode(...combined));
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, storedHash) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const combined = new Uint8Array(
      atob(storedHash).split("").map((char) => char.charCodeAt(0))
    );
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);
    const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, [
      "deriveBits"
    ]);
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 1e5,
        hash: "SHA-256"
      },
      key,
      256
    );
    const derivedHash = new Uint8Array(derivedBits);
    return derivedHash.length === storedHashBytes.length && derivedHash.every((byte, index) => byte === storedHashBytes[index]);
  } catch {
    return false;
  }
}
__name(verifyPassword, "verifyPassword");
async function generateToken(userId, username) {
  const data = new TextEncoder().encode(`${userId}-${username}-${Date.now()}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateToken, "generateToken");

// resolvers/mutations.ts
var addMessage = /* @__PURE__ */ __name(async (_parent, { content }, context) => {
  const db = drizzle(context.env.DB);
  const id = crypto.randomUUID();
  await db.insert(messages).values({ id, content }).run();
  const newMsg = await db.select().from(messages).where(eq(messages.id, id)).get();
  context.publish("NEW_MESSAGES", { newMessages: newMsg });
  return newMsg;
}, "addMessage");
var register = /* @__PURE__ */ __name(async (_parent, { username, password }, context) => {
  const db = drizzle(context.env.DB);
  const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
  if (existingUser) {
    throw new Error("User with this username already exists");
  }
  const passwordHash = await hashPassword(password);
  const userId = Math.floor(Math.random() * 1e6);
  await db.insert(users).values({
    id: userId,
    name: username,
    // Use username as name for simplicity
    username,
    passwordHash,
    email: null,
    // Optional field
    phone: null,
    // Optional field
    avatar: null,
    // Optional field
    isActive: true
  }).run();
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) {
    throw new Error("Failed to create user");
  }
  const token = await generateToken(userId, username);
  return {
    user: {
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      createdAt: user.createdAt
    },
    token
  };
}, "register");
var login = /* @__PURE__ */ __name(async (_parent, { username, password }, context) => {
  const db = drizzle(context.env.DB);
  const user = await db.select().from(users).where(eq(users.username, username)).get();
  if (!user) {
    throw new Error("Invalid username or password");
  }
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid username or password");
  }
  const token = await generateToken(user.id, username);
  return {
    user: {
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      createdAt: user.createdAt
    },
    token
  };
}, "login");
var Mutation = {
  addMessage,
  register,
  login
};

// resolvers/subscriptions.ts
init_modules_watch_stub();
var newMessages = {
  subscribe: createSubscriptionHandler("NEW_MESSAGES")
};
var Subscription = {
  newMessages
};

// resolvers/index.ts
var resolvers = {
  Query,
  Mutation,
  Subscription
};

// worker.ts
var schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,
    Subscription: {
      newMessages: {
        subscribe: createSubscriptionHandler("NEW_MESSAGES")
      }
    }
  }
});
var settings = {
  schema,
  wsConnectionPool: /* @__PURE__ */ __name((env) => env.SUBSCRIPTION_POOL, "wsConnectionPool"),
  subscriptionsDb: /* @__PURE__ */ __name((env) => env.DB, "subscriptionsDb")
};
var yoga = createYoga({
  schema,
  graphiql: {
    subscriptionsProtocol: "WS"
  }
});
var baseFetch = /* @__PURE__ */ __name((request, env, executionCtx) => yoga.handleRequest(
  request,
  createDefaultPublishableContext({
    env,
    executionCtx,
    ...settings
  })
), "baseFetch");
var fetch = handleSubscriptions({
  fetch: baseFetch,
  ...settings
});
var worker_default = { fetch };
var SubscriptionPool = createWsConnectionPoolClass(settings);

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Kj0xsW/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Kj0xsW/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  SubscriptionPool,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default,
  schema
};
//# sourceMappingURL=worker.js.map
