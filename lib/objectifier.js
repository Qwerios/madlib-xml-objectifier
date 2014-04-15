(function() {
  (function(factory) {
    if (typeof exports === "object") {
      return module.exports = factory(require("underscore"));
    } else if (typeof define === "function" && define.amd) {
      return define(["underscore"], factory);
    }
  })(function(_) {
    var documentToObject, getAttributeName, getNodeName, nodeToObject, xmlObjectifier;
    getNodeName = function(node) {
      return node.localName || node.tagName.replace(/^.*?:/, '');
    };
    getAttributeName = function(attr) {
      return attr.localName || attr.baseName || attr.name.replace(/^.*?:/, '');
    };
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
      nodeName = getNodeName(rootNode);
      if (mode === "minimal") {
        nodeName = rootNode.nodeName;
      }
      objDocument[nodeName] = nodeToObject(rootNode, mode, smartHints);
      return objDocument;
    };
    nodeToObject = function(xmlNode, mode, smartHints) {
      var attribute, attributeName, childNode, i, nodeName, nodeText, objNode, parentName, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
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
              attributeName = getAttributeName(attribute);
              objNode.$a[attributeName] = {
                $t: attribute.value
              };
              if (attribute.prefix) {
                objNode.$a[attributeName].$ns = attribute.prefix;
              }
            }
            break;
          case "smart":
            objNode.$a = {};
            for (i = _j = 0, _ref1 = xmlNode.attributes.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
              attribute = xmlNode.attributes.item(i);
              attributeName = getAttributeName(attribute);
              objNode.$a[attributeName] = attribute.value;
            }
            break;
          case "minimal":
            for (i = _k = 0, _ref2 = xmlNode.attributes.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
              attribute = xmlNode.attributes.item(i);
              objNode[attribute.nodeName] = attribute.value;
            }
        }
      }
      if (xmlNode.hasChildNodes()) {
        for (i = _l = 0, _ref3 = xmlNode.childNodes.length; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
          childNode = xmlNode.childNodes.item(i);
          switch (childNode.nodeType) {
            case 1:
              nodeName = getNodeName(childNode);
              switch (mode) {
                case "minimal":
                case "smart":
                  nodeName = childNode.nodeName;
                  if (objNode[nodeName] == null) {
                    parentName = getNodeName(xmlNode);
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
    /**
    #   The XML objectifier is tasked with turning a W3 DOM Document into a usable
    #   JavaScript object.
    #
    #   @author     mdoeswijk
    #   @module     xmlObjectifier
    #   @version    0.1
    */

    return xmlObjectifier = {
      /**
      #   Turns the provided XML DOM document into an object representation.
      #   Supports 3 modes with varying levels of verbosity.
      #
      #   @function documentToObject
      #   @param {DOM Document}        xmlDocument    A W3 DOM Level 2 document
      #   @param {String}             [mode]          The conversion mode to use. One of 'strict', 'smart' or 'minimal'
      #   @param {Array of Strings}   [smartHints]    An array of tag names that should always be presented as an array for 'smart' mode conversion
      #
      #   @return {Object}   Object representation of the XML Document
      #
      */

      documentToObject: documentToObject,
      /**
      #   Turns the provided XML DOM Node into an object representation.
      #   Supports 3 modes with varying levels of verbosity.
      #
      #   @function nodeToObject
      #   @param {DOM Node}            xmlNode        A W3 DOM Level 2 node
      #   @param {String}             [mode]          The conversion mode to use. One of 'strict', 'smart' or 'minimal'
      #   @param {Array of Strings}   [smartHints]    An array of tag names that should always be presented as an array for 'smart' mode conversion
      #
      #   @return {Object}   Object representation of the XML Node
      #
      */

      nodeToObject: nodeToObject
    };
  });

}).call(this);
