(function() {
  (function(factory) {
    if (typeof exports === "object") {
      return module.exports = factory(require("underscore"));
    } else if (typeof define === "function" && define.amd) {
      return define(["underscore"], factory);
    }
  })(function(_) {
    var documentToObject, nodeToObject, xmlObjectifier;
    documentToObject = function(xmlDocument, mode, smartHints) {
      var nodeName, objDocument, rootNode;
      if (mode == null) {
        mode = "strict";
      }
      if (smartHints == null) {
        smartHints = [];
      }
      rootNode = xmlDocument.documentElement;
      objDocument = {};
      if (rootNode.localName != null) {
        nodeName = rootNode.localName || rootNode.tagName;
        if (mode === "minimal") {
          nodeName = rootNode.nodeName;
        }
      } else {
        nodeName = rootNode.tagName.replace(/^.*?:/, '');
      }
      objDocument[rootNode.localName] = nodeToObject(rootNode, mode, smartHints);
      return objDocument;
    };
    nodeToObject = function(xmlNode, mode, smartHints) {
      var attribute, childNode, i, nodeName, nodeText, objNode, parentName, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
      if (mode == null) {
        mode = "strict";
      }
      if (smartHints == null) {
        smartHints = [];
      }
      objNode = {};
      if (mode === "strict") {
        objNode.$t = "";
      }
      if (mode === !"minimal" && xmlNode.prefix) {
        objNode.$ns = xmlNode.prefix;
      }
      if (xmlNode.attributes.length > 0) {
        switch (mode) {
          case "strict":
            objNode.$a = {};
            for (i = _i = 0, _ref = xmlNode.attributes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              attribute = xmlNode.attributes.item(i);
              objNode.$a[attribute.localName] = {
                $t: attribute.nodeValue
              };
              if (attribute.prefix) {
                objNode.$a[attribute.localName].$ns = attribute.prefix;
              }
            }
            break;
          case "smart":
            objNode.$a = {};
            for (i = _j = 0, _ref1 = xmlNode.attributes.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
              attribute = xmlNode.attributes.item(i);
              objNode.$a[attribute.localName] = attribute.nodeValue;
            }
            break;
          case "minimal":
            for (i = _k = 0, _ref2 = xmlNode.attributes.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
              attribute = xmlNode.attributes.item(i);
              objNode[attribute.nodeName] = attribute.nodeValue;
            }
        }
      }
      if (xmlNode.hasChildNodes()) {
        for (i = _l = 0, _ref3 = xmlNode.childNodes.length; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
          childNode = xmlNode.childNodes.item(i);
          switch (childNode.nodeType) {
            case 1:
              nodeName = childNode.localName;
              switch (mode) {
                case "minimal":
                case "smart":
                  nodeName = childNode.nodeName;
                  if (objNode[nodeName] == null) {
                    parentName = xmlNode.localName;
                    if (_.indexOf(smartHints, nodeName) !== -1 || nodeName + "s" === parentName || nodeName + "en" === parentName) {
                      if (objNode[nodeName] == null) {
                        objNode[nodeName] = [];
                      }
                      objNode[nodeName].push(nodeToObject(childNode, mode, smartHints));
                    } else {
                      objNode[nodeName] = nodeToObject(childNode, mode, smartHints);
                    }
                  } else {
                    if (_.isArray(objNode[nodeName])) {
                      objNode[nodeName].push(nodeToObject(childNode, mode, smartHints));
                    } else {
                      objNode[nodeName] = [objNode[nodeName], nodeToObject(childNode, mode, smartHints)];
                    }
                  }
                  break;
                default:
                  if (objNode[nodeName] == null) {
                    objNode[nodeName] = [];
                  }
                  objNode[nodeName].push(nodeToObject(childNode, mode, smartHints));
              }
              break;
            case 3:
              nodeText = childNode.nodeValue.replace(/^\s+|\s+$/g, "");
              if (mode === "minimal" || mode === "smart") {
                if (nodeText) {
                  objNode.$t = nodeText;
                }
              } else {
                objNode.$t = nodeText;
              }
              break;
            case 4:
              objNode.$t = childNode.nodeValue;
          }
        }
      }
      if (mode === "minimal" || mode === "smart") {
        if (xmlNode.childNodes.length === 1 && (objNode.$t != null)) {
          objNode = objNode.$t;
        }
        if (_.isEmpty(objNode)) {
          objNode = null;
        }
      }
      return objNode;
    };
    return xmlObjectifier = {
      documentToObject: documentToObject,
      nodeToObject: nodeToObject
    };
  });

}).call(this);
