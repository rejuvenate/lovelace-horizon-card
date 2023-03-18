'use strict';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    };
  }

  return _get.apply(this, arguments);
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");

  return typeof key === "symbol" ? key : String(key);
}

function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();

  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }

  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}

function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };

  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;

          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;

      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }

      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);

      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }

      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];

      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }

      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];

      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);

        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }

        var newExtras = elementFinisherExtras.extras;

        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }

          extras.push.apply(extras, newExtras);
        }
      }

      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];

      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }

        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;

          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }

      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);

      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }

      var key = _toPropertyKey(elementObject.key);

      var placement = String(elementObject.placement);

      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }

      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };

      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }

      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);

      var finisher = _optionalCallableProperty(elementObject, "finisher");

      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);

      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }

      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");

      var finisher = _optionalCallableProperty(obj, "finisher");

      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);

        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }

          constructor = newConstructor;
        }
      }

      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}

function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);

  var descriptor;

  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }

  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}

function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}

function _coalesceClassElements(elements) {
  var newElements = [];

  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;

    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }

        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }

          other.decorators = element.decorators;
        }

        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }

  return newElements;
}

function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}

function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}

function _optionalCallableProperty(obj, name) {
  var value = obj[name];

  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }

  return value;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$3=Symbol(),n$4=new Map;class s$3{constructor(t,n){if(this._$cssResult$=!0,n!==e$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){let e=n$4.get(this.cssText);return t$2&&void 0===e&&(n$4.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o$3=t=>new s$3("string"==typeof t?t:t+"",e$3),r$2=(t,...n)=>{const o=1===t.length?t[0]:n.reduce(((e,n,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1]),t[0]);return new s$3(o,e$3)},i$2=(e,n)=>{t$2?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$2=window.trustedTypes,r$1=e$2?e$2.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$2={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$3=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$3};class a$1 extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o();}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Eh(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1);}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$2(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$ES(t,i,s=l$2){var e,r;const h=this.constructor._$Eh(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$2.toAttribute)(i,s.type);this._$Ei=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$Ei=null;}}_$AK(t,i){var s,e,r;const h=this.constructor,n=h._$Eu.get(t);if(void 0!==n&&this._$Ei!==n){const t=h.getPropertyOptions(n),l=t.converter,a=null!==(r=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==r?r:o$2.fromAttribute;this._$Ei=n,this[n]=a(i,t.type),this._$Ei=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$3)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$EC());}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU();}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return !0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$E_=void 0),this._$EU();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;const i$1=globalThis.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$1=`lit$${(Math.random()+"").slice(9)}$`,o$1="?"+e$1,n$2=`<${o$1}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea)$/i,$=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),p=$(1),b=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),x=new WeakMap,w=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,$=-1,p=0;for(;p<s.length&&(d.lastIndex=p,u=d.exec(s),null!==u);)p=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,$=-1):void 0===u[1]?$=-2:($=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$2:$>=0?(l.push(o),s.slice(0,$)+"$lit$"+s.slice($)+e$1+y):s+e$1+(-2===$?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");return [void 0!==s$1?s$1.createHTML(u):u,l]};class P{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=P.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e$1)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e$1),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e$1),s=t.length-1;if(s>0){l.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$1)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e$1,t+1));)c.push({type:7,index:r}),t+=e$1.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function V(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=V(t,d._$AS(t,i.values),d,e)),i}class E{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=V(this,t,i),r(t)?t===T||null==t||""===t?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):u(t)?this.M(t):this.$(t);}A(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t));}$(t){this._$AH!==T&&r(this._$AH)?this._$AA.nextSibling.data=t:this.S(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=P.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new E(o,this),i=t.p(this.options);t.m(s),this.S(i),this._$AH=t;}}_$AC(t){let i=x.get(t.strings);return void 0===i&&x.set(t.strings,i=new P(t)),i}M(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.A(h()),this.A(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=T;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=V(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=V(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===T?t=T:t!==T&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.k(t);}k(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}k(t){this.element[this.name]=t===T?void 0:t;}}const k=i$1?i$1.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}k(t){t&&t!==T?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=V(this,t,i,0))&&void 0!==s?s:T)===b)return;const e=this._$AH,o=t===T&&e!==T||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==T&&(e===T||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(P,N),(null!==(t$1=globalThis.litHtmlVersions)&&void 0!==t$1?t$1:globalThis.litHtmlVersions=[]).push("2.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=w(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$1=globalThis.litElementPolyfillSupport;null==n$1||n$1({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n=n=>e=>"function"==typeof e?((n,e)=>(window.customElements.define(n,e),e))(n,e):((n,e)=>{const{kind:t,elements:i}=e;return {kind:t,elements:i,finisher(e){window.customElements.define(n,e);}}})(n,e);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i(e,n)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t(t){return e({...t,state:!0})}

var _templateObject$7;
var cardStyles = r$2(_templateObject$7 || (_templateObject$7 = _taggedTemplateLiteral(["\n  .sun-card {\n    --sun-card-primary: var(--primary-text-color, #000000);\n    --sun-card-secondary: var(--secondary-text-color, #828282);\n    --sun-card-accent: #d7d7d7;\n\n    --sun-card-lines: var(--sun-card-accent);\n    --sun-card-field-name-color: var(--sun-card-secondary);\n    --sun-card-field-value-color: var(--sun-card-primary);\n\n    --sun-card-stop-invisible: rgb(0,0,0,0);\n    --sun-card-stop-sun-color: #f9d05e;\n    --sun-card-stop-dawn-color: #393b78;\n    --sun-card-stop-day-color: #8ebeeb;\n    --sun-card-stop-dusk-color: #393b78;\n\n    padding: 0.5rem;\n    font-size: 1.3rem;\n    font-family: var(--primary-font-family);\n  }\n\n  .sun-card.sun-card-dark {\n    --sun-card-primary: #ffffff;\n    --sun-card-secondary: #828282;\n    --sun-card-accent: #464646;\n  }\n  \n  .sun-card-field-row {\n    display: flex;\n    justify-content: space-around;\n    margin: 1rem 1.5rem 0 1.5rem;\n  }\n\n  .sun-card-text-container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  .sun-card-field-name {\n    color: var(--sun-card-field-name-color);\n  }\n\n  .sun-card-field-value {\n    color: var(--sun-card-field-value-color);\n  }\n\n  .sun-card-header {\n    display: flex;\n    justify-content: space-between;\n    margin: 0 4rem 0 4rem;\n  }\n\n  .sun-card-header .sun-card-field-value {\n    font-size: 1.85rem;\n  }\n\n  .sun-card-title {\n    margin: 0.5rem 0.5rem 3rem 3rem;\n    font-size: 2rem;\n    font-weight: 500;\n    color: var(--sun-card-primary);\n  }\n\n  .sun-card-graph {\n    shape-rendering=\"geometricPrecision\";\n    margin: 2rem 0 2rem 0;\n  }\n\n  .sun-card-graph .sunInitialStop {\n    stop-color: var(--sun-card-stop-sun-color);\n  }\n\n  .sun-card-graph .sunMiddleStop {\n    stop-color: var(--sun-card-stop-sun-color);\n  }\n\n  .sun-card-graph .sunEndStop {\n    stop-color: var(--sun-card-stop-invisible);\n  }\n\n  .sun-card-graph .dawnInitialStop {\n    stop-color: var(--sun-card-stop-dawn-color);\n  }\n\n  .sun-card-graph .dawnMiddleStop {\n    stop-color: var(--sun-card-stop-dawn-color);\n  }\n\n  .sun-card-graph .dawnEndStop {\n    stop-color: var(--sun-card-stop-invisible);\n  }\n\n  .sun-card-graph .dayInitialStop {\n    stop-color: var(--sun-card-stop-day-color);\n  }\n\n  .sun-card-graph .dayMiddleStop {\n    stop-color: var(--sun-card-stop-day-color);\n  }\n\n  .sun-card-graph .dayEndStop {\n    stop-color: var(--sun-card-stop-invisible);\n  }\n\n  .sun-card-graph .duskInitialStop {\n    stop-color: var(--sun-card-stop-dusk-color);\n  }\n\n  .sun-card-graph .duskMiddleStop {\n    stop-color: var(--sun-card-stop-dusk-color);\n  }\n\n  .sun-card-graph .duskEndStop {\n    stop-color: var(--sun-card-stop-invisible);\n  }\n\n  .card-config ul {\n    list-style: none;\n    padding: 0 0 0 1.5rem;\n  }\n\n  .card-config li {\n    padding: 0.5rem 0;\n  }\n"])));

var azimuth$p = "Азимут";
var dawn$p = "Зора";
var dusk$p = "Здрач";
var elevation$p = "Височина";
var noon$p = "Пладне";
var sunrise$p = "Изгрев";
var sunset$p = "Залез";
var errors$p = {
	SunIntegrationNotFound: "Интеграцията Sun не е намерена"
};
var bg = {
	azimuth: azimuth$p,
	dawn: dawn$p,
	dusk: dusk$p,
	elevation: elevation$p,
	noon: noon$p,
	sunrise: sunrise$p,
	sunset: sunset$p,
	errors: errors$p
};

var azimuth$o = "Azimut";
var dawn$o = "Alba";
var dusk$o = "Capvespre";
var elevation$o = "Elevació";
var noon$o = "Migdia solar";
var sunrise$o = "Sortida del sol";
var sunset$o = "Posta del sol";
var errors$o = {
	SunIntegrationNotFound: "No s'ha trobat la integració Sun"
};
var ca = {
	azimuth: azimuth$o,
	dawn: dawn$o,
	dusk: dusk$o,
	elevation: elevation$o,
	noon: noon$o,
	sunrise: sunrise$o,
	sunset: sunset$o,
	errors: errors$o
};

var azimuth$n = "Azimut";
var dawn$n = "Svítání";
var dusk$n = "Soumrak";
var elevation$n = "Výška";
var noon$n = "Sluneční poledne";
var sunrise$n = "Východ slunce";
var sunset$n = "Západ slunce";
var errors$n = {
	SunIntegrationNotFound: "Integrace Sun nenalezena"
};
var cs = {
	azimuth: azimuth$n,
	dawn: dawn$n,
	dusk: dusk$n,
	elevation: elevation$n,
	noon: noon$n,
	sunrise: sunrise$n,
	sunset: sunset$n,
	errors: errors$n
};

var azimuth$m = "Azimut";
var dawn$m = "Daggry";
var dusk$m = "Skumring";
var elevation$m = "Højde";
var noon$m = "Middag";
var sunrise$m = "Solopgang";
var sunset$m = "Solnedgang";
var errors$m = {
	SunIntegrationNotFound: "kunne ikke finde integrationen for Sol"
};
var da = {
	azimuth: azimuth$m,
	dawn: dawn$m,
	dusk: dusk$m,
	elevation: elevation$m,
	noon: noon$m,
	sunrise: sunrise$m,
	sunset: sunset$m,
	errors: errors$m
};

var azimuth$l = "Azimut";
var dawn$l = "Morgendämmerung";
var dusk$l = "Abenddämmerung";
var elevation$l = "Zenitwinkel";
var noon$l = "Zenit";
var sunrise$l = "Sonnenaufgang";
var sunset$l = "Sonnenuntergang";
var errors$l = {
	SunIntegrationNotFound: "Sun integration not found"
};
var de = {
	azimuth: azimuth$l,
	dawn: dawn$l,
	dusk: dusk$l,
	elevation: elevation$l,
	noon: noon$l,
	sunrise: sunrise$l,
	sunset: sunset$l,
	errors: errors$l
};

var azimuth$k = "Azimuth";
var dawn$k = "Dawn";
var dusk$k = "Dusk";
var elevation$k = "Elevation";
var noon$k = "Solar noon";
var sunrise$k = "Sunrise";
var sunset$k = "Sunset";
var errors$k = {
	SunIntegrationNotFound: "Sun integration not found"
};
var en = {
	azimuth: azimuth$k,
	dawn: dawn$k,
	dusk: dusk$k,
	elevation: elevation$k,
	noon: noon$k,
	sunrise: sunrise$k,
	sunset: sunset$k,
	errors: errors$k
};

var azimuth$j = "Azimut";
var dawn$j = "Amanecer";
var dusk$j = "Anochecer";
var elevation$j = "Elevación";
var noon$j = "Mediodía solar";
var sunrise$j = "Salida del sol";
var sunset$j = "Atardecer";
var errors$j = {
	SunIntegrationNotFound: "Sun integration not found"
};
var es = {
	azimuth: azimuth$j,
	dawn: dawn$j,
	dusk: dusk$j,
	elevation: elevation$j,
	noon: noon$j,
	sunrise: sunrise$j,
	sunset: sunset$j,
	errors: errors$j
};

var azimuth$i = "Asimuut";
var dawn$i = "Koidik";
var dusk$i = "Hämarik";
var elevation$i = "Kõrgus";
var noon$i = "Keskpäev";
var sunrise$i = "Päikesetõus";
var sunset$i = "Päikeseloojang";
var errors$i = {
	SunIntegrationNotFound: "Sun integration not found"
};
var et = {
	azimuth: azimuth$i,
	dawn: dawn$i,
	dusk: dusk$i,
	elevation: elevation$i,
	noon: noon$i,
	sunrise: sunrise$i,
	sunset: sunset$i,
	errors: errors$i
};

var azimuth$h = "Atsimuutti";
var dawn$h = "Sarastus";
var dusk$h = "Hämärä";
var elevation$h = "Korkeus";
var noon$h = "Keskipäivä";
var sunrise$h = "Auringonnousu";
var sunset$h = "Auringonlasku";
var errors$h = {
	SunIntegrationNotFound: "Sun integration not found"
};
var fi = {
	azimuth: azimuth$h,
	dawn: dawn$h,
	dusk: dusk$h,
	elevation: elevation$h,
	noon: noon$h,
	sunrise: sunrise$h,
	sunset: sunset$h,
	errors: errors$h
};

var azimuth$g = "Azimut";
var dawn$g = "Aube";
var dusk$g = "Crépuscule";
var elevation$g = "Élévation";
var noon$g = "Midi solaire";
var sunrise$g = "Lever du soleil";
var sunset$g = "Coucher du soleil";
var errors$g = {
	SunIntegrationNotFound: "Sun integration not found"
};
var fr = {
	azimuth: azimuth$g,
	dawn: dawn$g,
	dusk: dusk$g,
	elevation: elevation$g,
	noon: noon$g,
	sunrise: sunrise$g,
	sunset: sunset$g,
	errors: errors$g
};

var azimuth$f = "אזימוט";
var dawn$f = "עלות השחר";
var dusk$f = "בין הערבים";
var elevation$f = "גובה";
var noon$f = "אמצע היום";
var sunrise$f = "זריחה";
var sunset$f = "שקיעה";
var errors$f = {
	SunIntegrationNotFound: "אינטגרצית שמש לא נמצאה"
};
var he = {
	azimuth: azimuth$f,
	dawn: dawn$f,
	dusk: dusk$f,
	elevation: elevation$f,
	noon: noon$f,
	sunrise: sunrise$f,
	sunset: sunset$f,
	errors: errors$f
};

var azimuth$e = "Azimut";
var dawn$e = "Hajnal";
var dusk$e = "Szürkület";
var elevation$e = "Magasság";
var noon$e = "Dél";
var sunrise$e = "Napkelte";
var sunset$e = "Napnyugta";
var errors$e = {
	SunIntegrationNotFound: "Sun integration not found"
};
var hu = {
	azimuth: azimuth$e,
	dawn: dawn$e,
	dusk: dusk$e,
	elevation: elevation$e,
	noon: noon$e,
	sunrise: sunrise$e,
	sunset: sunset$e,
	errors: errors$e
};

var azimuth$d = "Áttarhorn";
var dawn$d = "Dögun";
var dusk$d = "Rökkur";
var elevation$d = "Hækkun";
var noon$d = "Sólarhádegi";
var sunrise$d = "Sólarupprás";
var sunset$d = "Sólsetur";
var errors$d = {
	SunIntegrationNotFound: "Sólar eining fannst ekki"
};
var is = {
	azimuth: azimuth$d,
	dawn: dawn$d,
	dusk: dusk$d,
	elevation: elevation$d,
	noon: noon$d,
	sunrise: sunrise$d,
	sunset: sunset$d,
	errors: errors$d
};

var azimuth$c = "Azimuth";
var dawn$c = "Alba";
var dusk$c = "Crepuscolo";
var elevation$c = "Elevazione";
var noon$c = "Mezzogiorno solare";
var sunrise$c = "Alba";
var sunset$c = "Tramonto";
var errors$c = {
	SunIntegrationNotFound: "Sun integration not found"
};
var it = {
	azimuth: azimuth$c,
	dawn: dawn$c,
	dusk: dusk$c,
	elevation: elevation$c,
	noon: noon$c,
	sunrise: sunrise$c,
	sunset: sunset$c,
	errors: errors$c
};

var azimuth$b = "Azimutas";
var dawn$b = "Aušra";
var dusk$b = "Prieblanda";
var elevation$b = "Pakilimas";
var noon$b = "Vidurdienis";
var sunrise$b = "Saulėtekis";
var sunset$b = "Saulėlydis";
var errors$b = {
	SunIntegrationNotFound: "Sun integration not found"
};
var lt = {
	azimuth: azimuth$b,
	dawn: dawn$b,
	dusk: dusk$b,
	elevation: elevation$b,
	noon: noon$b,
	sunrise: sunrise$b,
	sunset: sunset$b,
	errors: errors$b
};

var azimuth$a = "Azimut";
var dawn$a = "Daggry";
var dusk$a = "Skumring";
var elevation$a = "Elevasjon";
var noon$a = "Middag";
var sunrise$a = "Soloppgang";
var sunset$a = "Solnedgang";
var errors$a = {
	SunIntegrationNotFound: "Fant ikke Sol-integrasjonen"
};
var nb = {
	azimuth: azimuth$a,
	dawn: dawn$a,
	dusk: dusk$a,
	elevation: elevation$a,
	noon: noon$a,
	sunrise: sunrise$a,
	sunset: sunset$a,
	errors: errors$a
};

var azimuth$9 = "Azimut";
var dawn$9 = "Dageraad";
var dusk$9 = "Schemer";
var elevation$9 = "Hoogte";
var noon$9 = "Zonne-middag";
var sunrise$9 = "Zonsopkomst";
var sunset$9 = "Zonsondergang";
var errors$9 = {
	SunIntegrationNotFound: "Sun integration not found"
};
var nl = {
	azimuth: azimuth$9,
	dawn: dawn$9,
	dusk: dusk$9,
	elevation: elevation$9,
	noon: noon$9,
	sunrise: sunrise$9,
	sunset: sunset$9,
	errors: errors$9
};

var azimuth$8 = "Asimut";
var dawn$8 = "Daggry";
var dusk$8 = "Skumring";
var elevation$8 = "Høgde";
var noon$8 = "Middag";
var sunrise$8 = "Soloppgang";
var sunset$8 = "Solnedgang";
var errors$8 = {
	SunIntegrationNotFound: "Kunne ikkje finne sol-integrasjonen"
};
var nn = {
	azimuth: azimuth$8,
	dawn: dawn$8,
	dusk: dusk$8,
	elevation: elevation$8,
	noon: noon$8,
	sunrise: sunrise$8,
	sunset: sunset$8,
	errors: errors$8
};

var azimuth$7 = "Azymut";
var dawn$7 = "Świt";
var dusk$7 = "Zmierzch";
var elevation$7 = "Wysokość";
var noon$7 = "Górowanie";
var sunrise$7 = "Wschód";
var sunset$7 = "Zachód";
var errors$7 = {
	SunIntegrationNotFound: "Nie odnaleziono integracji sun"
};
var pl = {
	azimuth: azimuth$7,
	dawn: dawn$7,
	dusk: dusk$7,
	elevation: elevation$7,
	noon: noon$7,
	sunrise: sunrise$7,
	sunset: sunset$7,
	errors: errors$7
};

var azimuth$6 = "Azimute";
var dawn$6 = "Amanhecer";
var dusk$6 = "Anoitecer";
var elevation$6 = "Elevação";
var noon$6 = "Meio dia solar";
var sunrise$6 = "Nascer do sol";
var sunset$6 = "Pôr do sol";
var errors$6 = {
	SunIntegrationNotFound: "Integração Sol não encontrada"
};
var ptBR = {
	azimuth: azimuth$6,
	dawn: dawn$6,
	dusk: dusk$6,
	elevation: elevation$6,
	noon: noon$6,
	sunrise: sunrise$6,
	sunset: sunset$6,
	errors: errors$6
};

var azimuth$5 = "Азимут";
var dawn$5 = "Рассвет";
var dusk$5 = "Сумерки";
var elevation$5 = "Высота";
var noon$5 = "Зенит";
var sunrise$5 = "Восход";
var sunset$5 = "Закат";
var errors$5 = {
	SunIntegrationNotFound: "Sun integration not found"
};
var ru = {
	azimuth: azimuth$5,
	dawn: dawn$5,
	dusk: dusk$5,
	elevation: elevation$5,
	noon: noon$5,
	sunrise: sunrise$5,
	sunset: sunset$5,
	errors: errors$5
};

var azimuth$4 = "Azimut";
var dawn$4 = "Úsvit";
var dusk$4 = "Súmrak";
var elevation$4 = "Výška";
var noon$4 = "Slnečné poludnie";
var sunrise$4 = "Východ slnka";
var sunset$4 = "Západ slnka";
var errors$4 = {
	SunIntegrationNotFound: "Integrácia slnka sa nenašla"
};
var sk = {
	azimuth: azimuth$4,
	dawn: dawn$4,
	dusk: dusk$4,
	elevation: elevation$4,
	noon: noon$4,
	sunrise: sunrise$4,
	sunset: sunset$4,
	errors: errors$4
};

var azimuth$3 = "Azimut";
var dawn$3 = "Zora";
var dusk$3 = "Mrak";
var elevation$3 = "Višina";
var noon$3 = "Sončno poldne";
var sunrise$3 = "Sončni vzhod";
var sunset$3 = "Sončni zahod";
var errors$3 = {
	SunIntegrationNotFound: "Sun integration not found"
};
var sl = {
	azimuth: azimuth$3,
	dawn: dawn$3,
	dusk: dusk$3,
	elevation: elevation$3,
	noon: noon$3,
	sunrise: sunrise$3,
	sunset: sunset$3,
	errors: errors$3
};

var azimuth$2 = "Azimut";
var dawn$2 = "Gryning";
var dusk$2 = "Skymning";
var elevation$2 = "Elevation";
var noon$2 = "Middag";
var sunrise$2 = "Soluppgång";
var sunset$2 = "Solnedgång";
var errors$2 = {
	SunIntegrationNotFound: "Sun integration not found"
};
var sv = {
	azimuth: azimuth$2,
	dawn: dawn$2,
	dusk: dusk$2,
	elevation: elevation$2,
	noon: noon$2,
	sunrise: sunrise$2,
	sunset: sunset$2,
	errors: errors$2
};

var azimuth$1 = "Güney Açısı";
var dawn$1 = "Şafak";
var dusk$1 = "Alacakaranlık";
var elevation$1 = "Yükseklik";
var noon$1 = "Öğle";
var sunrise$1 = "Gündoğumu";
var sunset$1 = "Günbatımı";
var errors$1 = {
	SunIntegrationNotFound: "Güneş entegrasyonu bulunamadı"
};
var tr = {
	azimuth: azimuth$1,
	dawn: dawn$1,
	dusk: dusk$1,
	elevation: elevation$1,
	noon: noon$1,
	sunrise: sunrise$1,
	sunset: sunset$1,
	errors: errors$1
};

var azimuth = "Азимут";
var dawn = "Світанок";
var dusk = "Сутінки";
var elevation = "Висота";
var noon = "Заніт";
var sunrise = "Схід";
var sunset = "Захід";
var errors = {
	SunIntegrationNotFound: "Інтеграцію Sun не знайдено"
};
var uk = {
	azimuth: azimuth,
	dawn: dawn,
	dusk: dusk,
	elevation: elevation,
	noon: noon,
	sunrise: sunrise,
	sunset: sunset,
	errors: errors
};

var Constants = function Constants() {
  _classCallCheck(this, Constants);
};

_defineProperty(Constants, "DEFAULT_CONFIG", {
  type: 'sun-card',
  darkMode: true,
  language: 'en',
  use12hourClock: false,
  component: 'sun.sun',
  fields: {
    sunrise: true,
    sunset: true,
    dawn: true,
    noon: true,
    dusk: true,
    azimuth: false,
    elevation: false
  }
});

_defineProperty(Constants, "EVENT_X_POSITIONS", {
  dayStart: 5,
  sunrise: 101,
  sunset: 449,
  dayEnd: 545
});

_defineProperty(Constants, "HORIZON_Y", 108);

_defineProperty(Constants, "SUN_RADIUS", 17);

_defineProperty(Constants, "SUN_SECTIONS", {
  dawn: 105,
  day: 499 - 106,
  dusk: 605 - 500
});

_defineProperty(Constants, "DEFAULT_SUN_INFO", {
  dawnProgressPercent: 0,
  dayProgressPercent: 0,
  duskProgressPercent: 0,
  sunAboveHorizon: false,
  sunPercentOverHorizon: 0,
  sunPosition: {
    x: 0,
    y: 0
  },
  sunrise: 0,
  sunset: 0
});

_defineProperty(Constants, "DEFAULT_TIMES", {
  dawn: new Date(),
  dusk: new Date(),
  noon: new Date(),
  sunrise: new Date(),
  sunset: new Date()
});

_defineProperty(Constants, "LOCALIZATION_LANGUAGES", {
  bg: bg,
  ca: ca,
  cs: cs,
  da: da,
  de: de,
  en: en,
  es: es,
  et: et,
  fi: fi,
  fr: fr,
  he: he,
  hu: hu,
  is: is,
  it: it,
  lt: lt,
  nb: nb,
  nl: nl,
  nn: nn,
  pl: pl,
  'pt-BR': ptBR,
  ru: ru,
  sk: sk,
  sl: sl,
  sv: sv,
  tr: tr,
  uk: uk
});

_defineProperty(Constants, "FALLBACK_LOCALIZATION", en);

var ESunCardErrors;

(function (ESunCardErrors) {
  ESunCardErrors["SunIntegrationNotFound"] = "SunIntegrationNotFound";
})(ESunCardErrors || (ESunCardErrors = {}));

var ESunCardI18NKeys;

(function (ESunCardI18NKeys) {
  ESunCardI18NKeys["Azimuth"] = "azimuth";
  ESunCardI18NKeys["Dawn"] = "dawn";
  ESunCardI18NKeys["Dusk"] = "dusk";
  ESunCardI18NKeys["Elevation"] = "elevation";
  ESunCardI18NKeys["Noon"] = "noon";
  ESunCardI18NKeys["Sunrise"] = "sunrise";
  ESunCardI18NKeys["Sunset"] = "sunset";
})(ESunCardI18NKeys || (ESunCardI18NKeys = {}));

var _templateObject$6, _templateObject2$2;
var HelperFunctions = /*#__PURE__*/function () {
  function HelperFunctions() {
    _classCallCheck(this, HelperFunctions);
  }

  _createClass(HelperFunctions, null, [{
    key: "nothing",
    value: function nothing() {
      return p(_templateObject$6 || (_templateObject$6 = _taggedTemplateLiteral([""])));
    }
  }, {
    key: "renderFieldElement",
    value: function renderFieldElement(i18n, translationKey, value) {
      var display;

      if (value === undefined) {
        return HelperFunctions.nothing();
      } else if (value instanceof Date) {
        display = i18n.formatDateAsTime(value);
      } else {
        display = value.toString();
      }

      return p(_templateObject2$2 || (_templateObject2$2 = _taggedTemplateLiteral(["\n      <div class=\"sun-card-text-container\">\n        <span class=\"sun-card-field-name\">", "</span>\n        <span class=\"sun-card-field-value\">", "</span>\n      </div>\n    "])), i18n.tr(translationKey), display);
    }
  }, {
    key: "isValidLanguage",
    value: function isValidLanguage(language) {
      return Object.keys(Constants.LOCALIZATION_LANGUAGES).includes(language);
    }
  }, {
    key: "todayAtStartOfDay",
    value: function todayAtStartOfDay() {
      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      return today;
    }
  }, {
    key: "todayAtEndOfDay",
    value: function todayAtEndOfDay() {
      var today = new Date();
      today.setHours(23);
      today.setMinutes(59);
      today.setSeconds(59);
      today.setMilliseconds(999);
      return today;
    }
  }, {
    key: "findSectionPosition",
    value: function findSectionPosition(msSinceSectionStart, msSectionEnd, section) {
      return Math.min(msSinceSectionStart, msSectionEnd) * section / msSectionEnd;
    }
  }, {
    key: "findSunProgress",
    value: function findSunProgress(sunPosition, startPosition, endPosition) {
      return HelperFunctions.clamp(0, 100, 100 * (sunPosition - startPosition) / (endPosition - startPosition));
    }
  }, {
    key: "clamp",
    value: function clamp(min, max, value) {
      if (min === max) {
        return min;
      }

      if (min > max) {
        throw new RangeError('Min value can not be bigger than the max value');
      }

      return Math.min(Math.max(value, min), max);
    }
  }]);

  return HelperFunctions;
}();

var I18N = /*#__PURE__*/function () {
  function I18N(language, use12HourClock) {
    _classCallCheck(this, I18N);

    _defineProperty(this, "localization", void 0);

    _defineProperty(this, "dateFormatter", void 0);

    this.localization = Constants.LOCALIZATION_LANGUAGES[language]; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat

    var dateTimeFormatOptions = {
      timeStyle: 'short'
    }; // if user hasn't defined this specifically in config
    // let the formatter figure it out based on language

    if (use12HourClock !== undefined) {
      dateTimeFormatOptions.hour12 = use12HourClock;
    }

    this.dateFormatter = new Intl.DateTimeFormat(language, dateTimeFormatOptions);
  }

  _createClass(I18N, [{
    key: "formatDateAsTime",
    value: function formatDateAsTime(date) {
      return this.dateFormatter.formatToParts(date).map(function (_ref) {
        var type = _ref.type,
            value = _ref.value;

        switch (type) {
          // intentional fallthrough
          case 'hour':
          case 'minute':
          case 'dayPeriod':
          case 'literal':
            return value;

          /* istanbul ignore next */

          default:
            return '';
        }
      }).join('');
    }
    /**
     * TR -> TRanslation
     * @param translationKey The key to lookup a translation for
     * @returns The string specified in the translation files
     */

  }, {
    key: "tr",
    value: function tr(translationKey) {
      return this.getLocalizationElement(this.localization, translationKey).toString();
    } // Janky recursive logic to handle nested values in i18n json sources

  }, {
    key: "getLocalizationElement",
    value: function getLocalizationElement(localization, translationKey) {
      if (translationKey.includes('.')) {
        var parts = translationKey.split('.', 2); // TODO: maybe add typecheck

        var _localization = this.getLocalizationElement(this.localization, parts[0]);

        return this.getLocalizationElement(_localization, parts[1]);
      } else {
        var _ref2, _ref3;

        // if the translation isn't completed in the target language, fall back to english
        // give ugly string for developers who misstype
        return (_ref2 = (_ref3 = localization ? localization[translationKey] : undefined) !== null && _ref3 !== void 0 ? _ref3 : Constants.FALLBACK_LOCALIZATION[translationKey]) !== null && _ref2 !== void 0 ? _ref2 : "Translation key '".concat(translationKey, "' doesn't have a valid translation");
      }
    }
  }]);

  return I18N;
}();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var EventUtils = /*#__PURE__*/function () {
  function EventUtils() {
    _classCallCheck(this, EventUtils);

    _defineProperty(this, "eventMap", new Map());
  }

  _createClass(EventUtils, [{
    key: "on",
    value: function on(eventName, listener) {
      var eventListeners = this.eventMap.get(eventName) || [];
      eventListeners.push(listener);
      this.eventMap.set(eventName, eventListeners);
    }
  }, {
    key: "emit",
    value: function emit(eventName, data) {
      var eventListeners = this.eventMap.get(eventName) || [];
      eventListeners.forEach(function (eventListener) {
        eventListener(data);
      });
    }
  }]);

  return EventUtils;
}();

var _templateObject$5, _templateObject2$1, _templateObject3$1, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;
var SunCardEditorContent = /*#__PURE__*/function (_EventUtils) {
  _inherits(SunCardEditorContent, _EventUtils);

  var _super = _createSuper(SunCardEditorContent);

  function SunCardEditorContent(config) {
    var _this;

    _classCallCheck(this, SunCardEditorContent);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "config", void 0);

    _this.config = config;
    return _this;
  }

  _createClass(SunCardEditorContent, [{
    key: "render",
    value: function render() {
      return p(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral(["\n      <div class=\"card-config\">\n        <div>\n          ", "\n        </div>\n        <div>\n          ", "\n        </div>\n        <div>\n          ", "\n        </div>\n        <div>\n          ", "\n        </div>\n        <div>\n          ", "\n        </div>\n      </div>\n    "])), this.renderTitleEditor(), this.renderLanguageEditor(), this.renderDarkModeEditor(), this.render12HourClockEditor(), this.renderFieldsEditor());
    }
  }, {
    key: "onConfigChanged",
    value: function onConfigChanged(event) {
      this.emit('configChanged', event);
    }
  }, {
    key: "renderTitleEditor",
    value: function renderTitleEditor() {
      var _this$config$title,
          _this$config,
          _this2 = this;

      return p(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["\n      <paper-input\n        label=\"Title (Optional)\"\n        .configValue=", "\n        .value=", "\n        @value-changed=", "\n      >\n      </paper-input>\n    "])), 'title', (_this$config$title = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.title) !== null && _this$config$title !== void 0 ? _this$config$title : '', function (event) {
        return _this2.onConfigChanged(event);
      });
    }
  }, {
    key: "renderLanguageEditor",
    value: function renderLanguageEditor() {
      var _this$config$language,
          _this$config2,
          _this3 = this;

      // TODO: Add language full name
      var selectedLanguage = Object.keys(Constants.LOCALIZATION_LANGUAGES).indexOf((_this$config$language = (_this$config2 = this.config) === null || _this$config2 === void 0 ? void 0 : _this$config2.language) !== null && _this$config$language !== void 0 ? _this$config$language : '') + 1;
      return p(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteral(["\n      <paper-dropdown-menu\n        label=\"Language\"\n        .configValue=", "\n        @value-changed=", "\n      >\n        <paper-listbox slot=\"dropdown-content\" selected=\"", "\">\n          <paper-item label=\"default\">Default</paper-item>\n          ", "\n        </paper-listbox>\n      </paper-dropdown-menu>\n    "])), 'language', function (event) {
        return _this3.onConfigChanged(event);
      }, selectedLanguage, Object.keys(Constants.LOCALIZATION_LANGUAGES).map(function (language) {
        return p(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n            <paper-item label=\"", "\">", "</paper-item>\n          "])), language, language);
      }));
    }
  }, {
    key: "renderDarkModeEditor",
    value: function renderDarkModeEditor() {
      var _this$config$darkMode,
          _this$config3,
          _this4 = this;

      var selectedDarkMode = (_this$config$darkMode = (_this$config3 = this.config) === null || _this$config3 === void 0 ? void 0 : _this$config3.darkMode) !== null && _this$config$darkMode !== void 0 ? _this$config$darkMode : 'default';
      return p(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n      <label id=\"theme\">Theme:</label>\n      <paper-radio-group\n        aria-labelledby=\"theme\"\n        .configValue=", "\n        .selected=", "\n        @paper-radio-group-changed=", "\n      >\n        <paper-radio-button name=\"default\">Default</paper-radio-button>\n        <paper-radio-button name=\"true\">Dark</paper-radio-button>\n        <paper-radio-button name=\"false\">Light</paper-radio-button>\n      </paper-radio-group>\n    "])), 'darkMode', selectedDarkMode.toString(), function (event) {
        return _this4.onConfigChanged(event);
      });
    }
  }, {
    key: "render12HourClockEditor",
    value: function render12HourClockEditor() {
      var _this$config$use12hou,
          _this$config4,
          _this5 = this;

      var selectedClockMode = (_this$config$use12hou = (_this$config4 = this.config) === null || _this$config4 === void 0 ? void 0 : _this$config4.use12hourClock) !== null && _this$config$use12hou !== void 0 ? _this$config$use12hou : 'default';
      return p(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n      <label id=\"clock\">Clock mode:</label>\n      <paper-radio-group\n        aria-labelledby=\"clock\"\n        .configValue=", "\n        .selected=", "\n        @paper-radio-group-changed=", "\n      >\n        <paper-radio-button name=\"default\">Default</paper-radio-button>\n        <paper-radio-button name=\"true\">12 hours</paper-radio-button>\n        <paper-radio-button name=\"false\">24 hourse</paper-radio-button>\n      </paper-radio-group>\n    "])), 'use12hourClock', selectedClockMode.toString(), function (event) {
        return _this5.onConfigChanged(event);
      });
    }
  }, {
    key: "renderFieldsEditor",
    value: function renderFieldsEditor() {
      var _this6 = this;

      return p(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n      <label>Card fields:</label>\n      <ul>\n        ", "\n      </ul>\n    "])), Object.entries(ESunCardI18NKeys).map(function (_ref) {
        var _this6$config$fields$, _this6$config$fields;

        var _ref2 = _slicedToArray(_ref, 2),
            name = _ref2[0],
            configValue = _ref2[1];

        return p(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n            <li><ha-switch .configValue=", " .checked=", " @change=", "></ha-switch> ", "</li>\n          "])), configValue, (_this6$config$fields$ = (_this6$config$fields = _this6.config.fields) === null || _this6$config$fields === void 0 ? void 0 : _this6$config$fields[configValue]) !== null && _this6$config$fields$ !== void 0 ? _this6$config$fields$ : Constants.DEFAULT_CONFIG.fields[configValue], function (event) {
          return _this6.onConfigChanged(event);
        }, name);
      }));
    }
  }]);

  return SunCardEditorContent;
}(EventUtils);

var SunCardEditor = _decorate([n('sun-card-editor')], function (_initialize, _LitElement) {
  var SunCardEditor = /*#__PURE__*/function (_LitElement2) {
    _inherits(SunCardEditor, _LitElement2);

    var _super = _createSuper(SunCardEditor);

    function SunCardEditor() {
      var _this;

      _classCallCheck(this, SunCardEditor);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initialize(_assertThisInitialized(_this));

      return _this;
    }

    return SunCardEditor;
  }(_LitElement);

  return {
    F: SunCardEditor,
    d: [{
      kind: "field",
      "static": true,
      key: "cardType",
      value: function value() {
        return 'sun-card-editor';
      }
    }, {
      kind: "field",
      "static": true,
      key: "CONFIG_CHANGED_EVENT",
      value: function value() {
        return 'config-changed';
      }
    }, {
      kind: "field",
      decorators: [e({
        type: Object
      })],
      key: "hass",
      value: void 0
    }, {
      kind: "field",
      decorators: [e()],
      key: "config",
      value: void 0
    }, {
      kind: "get",
      "static": true,
      key: "styles",
      value: function styles() {
        return cardStyles;
      }
    }, {
      kind: "method",
      key: "setConfig",
      value: function setConfig(config) {
        this.config = config;
      }
    }, {
      kind: "method",
      key: "configChanged",
      value: function configChanged(event) {
        var _event$target, _ref, _event$detail$value, _event$detail, _event$target2, _event$target3;

        var property = (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.configValue;
        var value = (_ref = (_event$detail$value = (_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.value) !== null && _event$detail$value !== void 0 ? _event$detail$value : (_event$target2 = event.target) === null || _event$target2 === void 0 ? void 0 : _event$target2.selected) !== null && _ref !== void 0 ? _ref : (_event$target3 = event.target) === null || _event$target3 === void 0 ? void 0 : _event$target3.checked;

        var newConfig = _objectSpread2(_objectSpread2({}, this.config), {}, _defineProperty({}, property, value)); // Handles default or empty values by deleting the config property


        if (value === 'default' || value === undefined || value === '') {
          delete newConfig[property];
        } // Handles boolean values


        if (value === 'true' || value === 'false') {
          newConfig[property] = value === 'true';
        } // Handles fields config


        if (Object.values(ESunCardI18NKeys).includes(property)) {
          delete newConfig[property];
          newConfig.fields = _objectSpread2(_objectSpread2({}, newConfig.fields), {}, _defineProperty({}, property, value));
        }

        var customEvent = new CustomEvent(SunCardEditor.CONFIG_CHANGED_EVENT, {
          bubbles: true,
          composed: true,
          detail: {
            config: newConfig
          }
        });
        this.dispatchEvent(customEvent);
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        var _this2 = this;

        var content = new SunCardEditorContent(this.config);
        content.on('configChanged', function (event) {
          return _this2.configChanged(event);
        });
        return content.render();
      }
    }]
  };
}, s);

var _templateObject$4;
var SunErrorContent = /*#__PURE__*/function () {
  function SunErrorContent(config, error) {
    _classCallCheck(this, SunErrorContent);

    _defineProperty(this, "i18n", void 0);

    _defineProperty(this, "error", void 0);

    this.i18n = config.i18n;
    this.error = error;
  }

  _createClass(SunErrorContent, [{
    key: "render",
    value: function render() {
      var errorMessage = this.i18n.tr("errors.".concat(this.error));
      console.error(errorMessage);
      return p(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(["\n      <div class=\"sun-card-error\">\n        ", "\n      </div>\n    "])), errorMessage);
    }
  }]);

  return SunErrorContent;
}();

var _templateObject$3;
var SunCardFooter = /*#__PURE__*/function () {
  function SunCardFooter(config, data) {
    _classCallCheck(this, SunCardFooter);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "i18n", void 0);

    _defineProperty(this, "times", void 0);

    _defineProperty(this, "fields", void 0);

    this.data = data;
    this.i18n = config.i18n;
    this.times = data === null || data === void 0 ? void 0 : data.times;
    this.fields = config.fields;
  }

  _createClass(SunCardFooter, [{
    key: "render",
    value: function render() {
      var _this$fields, _this$times, _this$fields2, _this$times2, _this$fields3, _this$times3, _this$fields4, _this$data, _this$data2, _this$fields5, _this$data3, _this$data4;

      return p(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(["\n      <div class=\"sun-card-footer\">\n        <div class=\"sun-card-field-row\">\n          ", "\n          ", "\n          ", "\n        </div>\n\n        <div class=\"sun-card-field-row\">\n          ", "\n          ", "\n        </div>\n      </div>\n    "])), ((_this$fields = this.fields) === null || _this$fields === void 0 ? void 0 : _this$fields.dawn) !== undefined && ((_this$times = this.times) === null || _this$times === void 0 ? void 0 : _this$times.dawn) !== undefined ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Dawn, this.times.dawn) : HelperFunctions.nothing(), ((_this$fields2 = this.fields) === null || _this$fields2 === void 0 ? void 0 : _this$fields2.noon) !== undefined && ((_this$times2 = this.times) === null || _this$times2 === void 0 ? void 0 : _this$times2.noon) !== undefined ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Noon, this.times.noon) : HelperFunctions.nothing(), ((_this$fields3 = this.fields) === null || _this$fields3 === void 0 ? void 0 : _this$fields3.dusk) !== undefined && ((_this$times3 = this.times) === null || _this$times3 === void 0 ? void 0 : _this$times3.dusk) !== undefined ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Dusk, this.times.dusk) : HelperFunctions.nothing(), ((_this$fields4 = this.fields) === null || _this$fields4 === void 0 ? void 0 : _this$fields4.azimuth) !== undefined && ((_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.azimuth) !== undefined ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Azimuth, (_this$data2 = this.data) === null || _this$data2 === void 0 ? void 0 : _this$data2.azimuth) : HelperFunctions.nothing(), ((_this$fields5 = this.fields) === null || _this$fields5 === void 0 ? void 0 : _this$fields5.elevation) !== undefined && ((_this$data3 = this.data) === null || _this$data3 === void 0 ? void 0 : _this$data3.elevation) !== undefined ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Elevation, (_this$data4 = this.data) === null || _this$data4 === void 0 ? void 0 : _this$data4.elevation) : HelperFunctions.nothing());
    }
  }]);

  return SunCardFooter;
}();

var _templateObject$2;
var SunCardGraph = /*#__PURE__*/function () {
  function SunCardGraph(data) {
    var _data$sunInfo;

    _classCallCheck(this, SunCardGraph);

    _defineProperty(this, "sunInfo", void 0);

    this.sunInfo = (_data$sunInfo = data === null || data === void 0 ? void 0 : data.sunInfo) !== null && _data$sunInfo !== void 0 ? _data$sunInfo : Constants.DEFAULT_SUN_INFO;
  }

  _createClass(SunCardGraph, [{
    key: "render",
    value: function render() {
      var sunID = 'sun-gradient';
      var dawnID = 'dawn-gradient';
      var dayID = 'day-gradient';
      var duskID = 'dusk-gradient';
      var viewBox = "0 0 550 150"; // TODO: Check sun opacity

      return p(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["\n      <div class=\"sun-card-graph\">\n        <svg viewBox=\"", "\" xmlns=\"http://www.w3.org/2000/svg\">\n          \n          <!-- Define gradients for use when drawing afterwards -->\n          <defs>\n            <linearGradient id=\"", "\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n              <stop offset=\"0%\" class=\"sunInitialStop\" />\n              <stop offset=\"", "%\" class=\"sunMiddleStop\" />\n              <stop offset=\"", "%\" class=\"sunEndStop\" />\n            </linearGradient>\n            \n            <linearGradient id=\"", "\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n              <stop offset=\"0%\" class=\"dawnInitialStop\" />\n              <stop offset=\"", "%\" class=\"dawnMiddleStop\" />\n              <stop offset=\"", "%\" class=\"dawnEndStop\" />\n            </linearGradient>\n            \n            <linearGradient id=\"", "\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n              <stop offset=\"0%\" class=\"dayInitialStop\" />\n              <stop offset=\"", "%\" class=\"dayMiddleStop\" />\n              <stop offset=\"", "%\" class=\"dayEndStop\" />\n            </linearGradient>\n            \n            <linearGradient id=\"", "\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n              <stop offset=\"0%\" class=\"duskInitialStop\" />\n              <stop offset=\"", "%\" class=\"duskMiddleStop\" />\n              <stop offset=\"", "%\" class=\"duskEndStop\" />\n            </linearGradient>\n          </defs>\n\n          <!-- Draw path of the sun across the 'sky' -->\n          <path \n            class=\"sun-card-sun-line\"\n            d=\"M5,146 C29,153 73,128 101,108 C276,-29 342,23 449,108 C473,123 509,150 545,146\"\n            fill=\"none\"\n            stroke=\"var(--sun-card-lines)\"\n          />\n\n          <!-- Draw between the path of the sun and the horizon line for dawn -->\n          <!-- IE: First dark blue part -->\n          <path\n            d=\"M5,146 C29,153 73,128 101,108 L 5 108\"\n            fill=\"url(#", ")\"\n            stroke=\"url(#", ")\"\n            opacity=\"", "\"\n          />\n\n          <!-- Draw between the path of the sun and the horizon line for day -->\n          <!-- IE: Main light blue part in the middle -->\n          <path \n            d=\"M101,108 C276,-29 342,23 449,108 L 104,108\"\n            fill=\"url(#", ")\"\n            stroke=\"url(#", ")\"\n            opacity=\"", "\"\n          />\n\n          <!-- Draw between the path of the sun and the horizon line for dusk -->\n          <!-- IE: Last dark blue part -->\n          <path \n            d=\"M449,108 C473,123 509,150 545,146 L 545 108\"\n            fill=\"url(#", ")\"\n            stroke=\"url(#", ")\"\n            opacity=\"", "\"\n          />\n\n          <!-- Draw the horizon, dawn and dusk lines (the gray horizontal/vertical lines) -->\n          <line x1=\"5\" y1=\"108\" x2=\"545\" y2=\"108\" stroke=\"var(--sun-card-lines)\" />\n          <line x1=\"101\" y1=\"25\" x2=\"101\" y2=\"100\" stroke=\"var(--sun-card-lines)\" />\n          <line x1=\"449\" y1=\"25\" x2=\"449\" y2=\"100\" stroke=\"var(--sun-card-lines)\" />\n\n          <!-- Draw a circle representing the sun -->\n          <circle\n            cx=\"", "\"\n            cy=\"", "\"\n            r=\"17\"\n            opacity=\"", "\"\n            stroke=\"none\" fill=\"url(#", ")\"\n          />\n        </svg>\n      </div>\n    "])), viewBox, sunID, this.sunInfo.sunPercentOverHorizon, this.sunInfo.sunPercentOverHorizon, dawnID, this.sunInfo.dawnProgressPercent, this.sunInfo.dawnProgressPercent, dayID, this.sunInfo.dayProgressPercent, this.sunInfo.dayProgressPercent, duskID, this.sunInfo.duskProgressPercent, this.sunInfo.duskProgressPercent, dawnID, dawnID, this.sunInfo.dawnProgressPercent, dayID, dayID, this.sunInfo.dayProgressPercent, duskID, duskID, this.sunInfo.duskProgressPercent, this.sunInfo.sunPosition.x, this.sunInfo.sunPosition.y, this.sunInfo.sunPercentOverHorizon, sunID);
    }
  }]);

  return SunCardGraph;
}();

var _templateObject$1, _templateObject2, _templateObject3;
var SunCardHeader = /*#__PURE__*/function () {
  function SunCardHeader(config, data) {
    _classCallCheck(this, SunCardHeader);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "times", void 0);

    _defineProperty(this, "fields", void 0);

    _defineProperty(this, "i18n", void 0);

    this.title = config.title;
    this.fields = config.fields;
    this.times = data === null || data === void 0 ? void 0 : data.times;
    this.i18n = config.i18n;
  }

  _createClass(SunCardHeader, [{
    key: "render",
    value: function render() {
      return p(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\n      ", "\n      ", "\n    "])), this.showTitle() ? this.renderTitle() : HelperFunctions.nothing(), this.renderHeader());
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return p(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div class=\"sun-card-title\">", "</div>"])), this.title);
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var _this$fields, _this$times, _this$fields2, _this$times2;

      return p(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n      <div class=\"sun-card-header\">\n        ", "\n        ", "\n      </div>\n    "])), (_this$fields = this.fields) !== null && _this$fields !== void 0 && _this$fields.sunrise && (_this$times = this.times) !== null && _this$times !== void 0 && _this$times.sunrise ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Sunrise, this.times.sunrise) : HelperFunctions.nothing(), (_this$fields2 = this.fields) !== null && _this$fields2 !== void 0 && _this$fields2.sunset && (_this$times2 = this.times) !== null && _this$times2 !== void 0 && _this$times2.sunset ? HelperFunctions.renderFieldElement(this.i18n, ESunCardI18NKeys.Sunset, this.times.sunset) : HelperFunctions.nothing());
    }
  }, {
    key: "showTitle",
    value: function showTitle() {
      return this.title !== undefined;
    }
  }]);

  return SunCardHeader;
}();

var _templateObject;
var SunCardContent = /*#__PURE__*/function () {
  function SunCardContent(config, data) {
    _classCallCheck(this, SunCardContent);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "data", void 0);

    this.config = config;
    this.data = data;
  }

  _createClass(SunCardContent, [{
    key: "render",
    value: function render() {
      return p(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <ha-card>\n        <div class=\"sun-card ", "\">\n          ", "\n          ", "\n          ", "\n        </div>\n      </ha-card>\n    "])), this.config.darkMode ? 'sun-card-dark' : '', this.showHeader() ? this.renderHeader() : HelperFunctions.nothing(), this.renderGraph(), this.showFooter() ? this.renderFooter() : HelperFunctions.nothing());
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return new SunCardHeader(this.config, this.data).render();
    }
  }, {
    key: "renderGraph",
    value: function renderGraph() {
      return new SunCardGraph(this.data).render();
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      return new SunCardFooter(this.config, this.data).render();
    }
  }, {
    key: "showHeader",
    value: function showHeader() {
      // logic based on config
      return true;
    }
  }, {
    key: "showFooter",
    value: function showFooter() {
      // logic based on config
      return true;
    }
  }]);

  return SunCardContent;
}();

var SunCard = _decorate([n('sun-card')], function (_initialize, _LitElement) {
  var SunCard = /*#__PURE__*/function (_LitElement2) {
    _inherits(SunCard, _LitElement2);

    var _super = _createSuper(SunCard);

    function SunCard() {
      var _this;

      _classCallCheck(this, SunCard);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initialize(_assertThisInitialized(_this));

      return _this;
    }

    return SunCard;
  }(_LitElement);

  return {
    F: SunCard,
    d: [{
      kind: "field",
      "static": true,
      key: "cardType",
      value: function value() {
        return 'sun-card';
      }
    }, {
      kind: "field",
      "static": true,
      key: "cardName",
      value: function value() {
        return 'Sun Card';
      }
    }, {
      kind: "field",
      "static": true,
      key: "cardDescription",
      value: function value() {
        return 'Custom card that display a graph to track the sun position and related events';
      }
    }, {
      kind: "field",
      decorators: [t()],
      key: "config",
      value: function value() {
        return {
          type: SunCard.cardType
        };
      }
    }, {
      kind: "field",
      decorators: [t()],
      key: "data",
      value: void 0
    }, {
      kind: "field",
      key: "hasRendered",
      value: function value() {
        return false;
      }
    }, {
      kind: "field",
      key: "lastHass",
      value: void 0
    }, {
      kind: "get",
      "static": true,
      key: "styles",
      value: function styles() {
        return cardStyles;
      }
    }, {
      kind: "set",
      key: "hass",
      value: function hass(_hass) {
        this.lastHass = _hass;

        if (!this.hasRendered) {
          this.populateConfigFromHass();
          return;
        }

        this.processLastHass();
      }
    }, {
      kind: "method",
      "static": true,
      key: "getConfigElement",
      value: function getConfigElement() {
        return document.createElement(SunCardEditor.cardType);
      } // called by HASS whenever config changes

    }, {
      kind: "method",
      key: "setConfig",
      value: function setConfig(config) {
        var _config$component, _config$fields$sunris, _config$fields, _config$fields$sunset, _config$fields2, _config$fields$dawn, _config$fields3, _config$fields$noon, _config$fields4, _config$fields$dusk, _config$fields5, _config$fields$azimut, _config$fields6, _config$fields$elevat, _config$fields7;

        var newConfig = _objectSpread2({}, this.config);

        newConfig.title = config.title;
        newConfig.darkMode = config.darkMode;
        newConfig.language = config.language;
        newConfig.use12hourClock = config.use12hourClock;
        newConfig.component = (_config$component = config.component) !== null && _config$component !== void 0 ? _config$component : Constants.DEFAULT_CONFIG.component;

        if (newConfig.language && !HelperFunctions.isValidLanguage(newConfig.language)) {
          throw Error("".concat(config.language, " is not a supported language. Supported languages: ").concat(Object.keys(Constants.LOCALIZATION_LANGUAGES)));
        }

        var defaultFields = Constants.DEFAULT_CONFIG.fields;
        newConfig.fields = {
          sunrise: (_config$fields$sunris = (_config$fields = config.fields) === null || _config$fields === void 0 ? void 0 : _config$fields.sunrise) !== null && _config$fields$sunris !== void 0 ? _config$fields$sunris : defaultFields.sunrise,
          sunset: (_config$fields$sunset = (_config$fields2 = config.fields) === null || _config$fields2 === void 0 ? void 0 : _config$fields2.sunset) !== null && _config$fields$sunset !== void 0 ? _config$fields$sunset : defaultFields.sunset,
          dawn: (_config$fields$dawn = (_config$fields3 = config.fields) === null || _config$fields3 === void 0 ? void 0 : _config$fields3.dawn) !== null && _config$fields$dawn !== void 0 ? _config$fields$dawn : defaultFields.dawn,
          noon: (_config$fields$noon = (_config$fields4 = config.fields) === null || _config$fields4 === void 0 ? void 0 : _config$fields4.noon) !== null && _config$fields$noon !== void 0 ? _config$fields$noon : defaultFields.noon,
          dusk: (_config$fields$dusk = (_config$fields5 = config.fields) === null || _config$fields5 === void 0 ? void 0 : _config$fields5.dusk) !== null && _config$fields$dusk !== void 0 ? _config$fields$dusk : defaultFields.dusk,
          azimuth: (_config$fields$azimut = (_config$fields6 = config.fields) === null || _config$fields6 === void 0 ? void 0 : _config$fields6.azimuth) !== null && _config$fields$azimut !== void 0 ? _config$fields$azimut : defaultFields.azimuth,
          elevation: (_config$fields$elevat = (_config$fields7 = config.fields) === null || _config$fields7 === void 0 ? void 0 : _config$fields7.elevation) !== null && _config$fields$elevat !== void 0 ? _config$fields$elevat : defaultFields.elevation
        };
        this.config = newConfig;

        if (this.lastHass) {
          this.populateConfigFromHass();
        }
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        var _this$data;

        if ((_this$data = this.data) !== null && _this$data !== void 0 && _this$data.error) {
          return new SunErrorContent(this.config, this.data.error).render();
        } // TODO: Move
        // init i18n component (assume set config has run at least once)


        this.config.i18n = new I18N(this.config.language, this.config.use12hourClock); // render components

        return new SunCardContent(this.config, this.data).render();
      }
    }, {
      kind: "method",
      key: "updated",
      value: function updated(changedProperties) {
        _get(_getPrototypeOf(SunCard.prototype), "updated", this).call(this, changedProperties);

        if (!this.hasRendered) {
          this.hasRendered = true;
          this.processLastHass();
        }
      }
    }, {
      kind: "method",
      key: "populateConfigFromHass",
      value: function populateConfigFromHass() {
        var _this$config$darkMode, _this$lastHass$themes, _ref, _this$config$language, _locale;

        // respect setting in hass
        // NOTE: custom-card-helpers types are not up to date with home assistant
        // NOTE: Old releases from Home Assistant doesn't provide the locale property
        this.config.darkMode = (_this$config$darkMode = this.config.darkMode) !== null && _this$config$darkMode !== void 0 ? _this$config$darkMode : (_this$lastHass$themes = this.lastHass.themes) === null || _this$lastHass$themes === void 0 ? void 0 : _this$lastHass$themes.darkMode;
        this.config.language = (_ref = (_this$config$language = this.config.language) !== null && _this$config$language !== void 0 ? _this$config$language : (_locale = this.lastHass.locale) === null || _locale === void 0 ? void 0 : _locale.language) !== null && _ref !== void 0 ? _ref : this.lastHass.language;
      }
    }, {
      kind: "method",
      key: "processLastHass",
      value: function processLastHass() {
        if (!this.lastHass) {
          return;
        }

        this.populateConfigFromHass();
        var sunComponent = this.config.component;

        if (this.lastHass.states[sunComponent]) {
          var sunAttrs = this.lastHass.states[sunComponent].attributes;
          var times = this.readTimes(sunAttrs);
          var sunInfo = this.calculateSunInfo(times.sunrise, times.sunset);
          this.data = {
            azimuth: sunAttrs.azimuth,
            elevation: sunAttrs.elevation,
            sunInfo: sunInfo,
            times: times
          };
        } else {
          this.data = {
            azimuth: 0,
            elevation: 0,
            sunInfo: Constants.DEFAULT_SUN_INFO,
            times: Constants.DEFAULT_TIMES,
            error: ESunCardErrors.SunIntegrationNotFound
          };
        }
      }
      /* For the math to work in #calculateSunInfo(sunrise, sunset), we need the
       * date part of the given 'date-time' to be equal. This will not be the
       * case whenever we pass one of the 'times', ie: when we pass dawn, hass
       * will update that variable with tomorrows dawn.
       *
       * This function safe-guards that through standardizing the 'date'-part on
       * the last 'time'; sunset. This means that all dates will have the date of the
       * sunset, thus ensuring equal date across all times of day.
       */

    }, {
      kind: "method",
      key: "readTimes",
      value: function readTimes(sunAttributes) {
        var sunset = new Date(sunAttributes.next_setting);
        var year = sunset.getUTCFullYear();
        var month = sunset.getUTCMonth();
        var date = sunset.getUTCDate();
        return {
          dawn: this.readTime(sunAttributes.next_dawn, year, month, date),
          dusk: this.readTime(sunAttributes.next_dusk, year, month, date),
          noon: this.readTime(sunAttributes.next_noon, year, month, date),
          sunrise: this.readTime(sunAttributes.next_rising, year, month, date),
          sunset: sunset
        };
      }
    }, {
      kind: "method",
      key: "readTime",
      value: function readTime(attributeToParse, year, month, date) {
        var read = new Date(attributeToParse);
        read.setUTCFullYear(year);
        read.setUTCMonth(month);
        read.setUTCDate(date);
        return read;
      }
    }, {
      kind: "method",
      key: "calculateSunInfo",
      value: function calculateSunInfo(sunrise, sunset) {
        var _this$shadowRoot;

        var sunLine = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.querySelector('path'); // find the instances of time for today

        var dayStart = HelperFunctions.todayAtStartOfDay().valueOf();
        var sunriseMs = sunrise.valueOf();
        var sunsetMs = sunset.valueOf();
        var dayEnd = HelperFunctions.todayAtEndOfDay().valueOf(); // calculate relevant moments in time

        var now = Date.now();
        var msSinceStartOfDay = Math.max(now - dayStart, 0);
        var msSinceDawn = Math.max(now - sunriseMs, 0);
        var msSinceDusk = Math.max(now - sunsetMs, 0);
        var msUntillDawn = sunriseMs - dayStart;
        var msOfDaylight = sunsetMs - sunriseMs;
        var msUntillEnd = dayEnd - sunsetMs; // find section positions

        var dawnSectionPosition = HelperFunctions.findSectionPosition(msSinceStartOfDay, msUntillDawn, Constants.SUN_SECTIONS.dawn);
        var daySectionPosition = HelperFunctions.findSectionPosition(msSinceDawn, msOfDaylight, Constants.SUN_SECTIONS.day);
        var duskSectionPosition = HelperFunctions.findSectionPosition(msSinceDusk, msUntillEnd, Constants.SUN_SECTIONS.dusk); // find the sun position

        var position = dawnSectionPosition + daySectionPosition + duskSectionPosition;
        var sunPosition = sunLine.getPointAtLength(position); // calculate section progress, in percentage

        var dawnProgressPercent = HelperFunctions.findSunProgress(sunPosition.x, Constants.EVENT_X_POSITIONS.dayStart, Constants.EVENT_X_POSITIONS.sunrise);
        var dayProgressPercent = HelperFunctions.findSunProgress(sunPosition.x, Constants.EVENT_X_POSITIONS.sunrise, Constants.EVENT_X_POSITIONS.sunset);
        var duskProgressPercent = HelperFunctions.findSunProgress(sunPosition.x, Constants.EVENT_X_POSITIONS.sunset, Constants.EVENT_X_POSITIONS.dayEnd); // calculate sun position in regards to the horizon

        var sunCenterY = sunPosition.y - Constants.SUN_RADIUS;
        var sunCenterYAboveHorizon = Constants.HORIZON_Y - sunCenterY;
        var sunAboveHorizon = sunCenterYAboveHorizon > 0;
        var sunPercentOverHorizon = 100 * sunCenterYAboveHorizon / (2 * Constants.SUN_RADIUS);
        sunPercentOverHorizon = HelperFunctions.clamp(0, 100, sunPercentOverHorizon);
        return {
          sunrise: sunriseMs,
          sunset: sunsetMs,
          dawnProgressPercent: dawnProgressPercent,
          dayProgressPercent: dayProgressPercent,
          duskProgressPercent: duskProgressPercent,
          sunAboveHorizon: sunAboveHorizon,
          sunPercentOverHorizon: sunPercentOverHorizon,
          sunPosition: {
            x: sunPosition.x,
            y: sunPosition.y
          }
        };
      }
    }]
  };
}, s);
window.customCards = window.customCards || [];
window.customCards.push({
  type: SunCard.cardType,
  name: SunCard.cardName,
  preview: true,
  description: SunCard.cardDescription
});
