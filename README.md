# madlib-xml-objectifier
[![Build Status](https://travis-ci.org/Qwerios/madlib-xml-objectifier.svg?branch=master)](https://travis-ci.org/Qwerios/madlib-xml-objectifier) [![NPM version](https://badge.fury.io/js/madlib-xml-objectifier.png)](http://badge.fury.io/js/madlib-xml-objectifier) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/madlib-xml-objectifier.png?downloads=true&stars=true)](https://nodei.co/npm/madlib-xml-objectifier.png?downloads=true&stars=true)

A converter utility to turn an XML Document (DOM level 2) into a JavaScript object.


## acknowledgments
The Marviq Application Development library (aka madlib) was developed by me when I was working at Marviq. They were cool enough to let me publish it using my personal github account instead of the company account. We decided to open source it for our mutual benefit and to ensure future updates should I decide to leave the company.


## philosophy
JavaScript is the language of the web. Wouldn't it be nice if we could stop having to rewrite (most) of our code for all those web connected platforms running on JavaScript? That is what madLib hopes to achieve. The focus of madLib is to have the same old boring stuff ready made for multiple platforms. Write your core application logic once using modules and never worry about the basics stuff again. Basics including XHR, XML, JSON, host mappings, settings, storage, etcetera. The idea is to use the tried and proven frameworks where available and use madlib based modules as the missing link.

Currently madLib is focused on supporting the following platforms:

* Web browsers (IE6+, Chrome, Firefox, Opera)
* Appcelerator/Titanium
* PhoneGap
* NodeJS


## installation
```bash
npm install madlib-xml-objectifier
```


## usage
The xml-objectifier module exposes two main methods: documentToObject and nodeToObject.
Both perform the same task and the only real reason for the documentToObject method to exist is as a convenience to get the root element automatically.
This module is pure JavaScript (well CoffeeScript actually) and can be used directly in both browser and nodejs environments.

You might want to look at the following other madlib modules to use together with the objectifier:
* [xmldom](https://github.com/Qwerios/madlib-xmldom)
* [xml-deobjectifier](https://github.com/Qwerios/madlib-xml-deobjectifier)
* [object-utils](https://github.com/Qwerios/madlib-object-utils)

#### documentToObject
```javascript
var xmldom      = require( "madlib-xmldom"          );
var objectifier = require( "madlib-xml-objectifier" );

var xmlDoc    = xmldom.parse( "<example><books><book>An example book</book></books></example>" );
var xmlObject = objectifier.documentToObject( xmlDoc, "smart" );
```

#### conversion modes
The objectifier can work in 3 modes:
strict:
* every tag is an array
* attributes are separate
* namespace support for tags and attributes
* reversible with [xml-deobjectifier](https://github.com/Qwerios/madlib-xml-deobjectifier)

smart:
* tags are arrays based on plural tag name detection
* smart hinting can be used to force arrays
* attributes are separate
* no namespace support
* mostly reversible with [xml-deobjectifier](https://github.com/Qwerios/madlib-xml-deobjectifier)

minimal:
* flattens attributes and tags as much as possible
* no namespace support
* lossy conversion, not reversible

With the following example XML output would look like this:
```xml
<example>
    <books foo="bar">
        <book>An example book</book>
    </books>
</example>
```

##### strict:
```javascript
{
    "example": {
        "$t": "",
        "books": [
            {
                "$t": "",
                "$a": {
                    "foo": {
                        "$t": "bar"
                    }
                },
                "book": [
                    {
                        "$t": "An example book"
                    }
                ]
            }
        ]
    }
}
```

##### smart:
```javascript
{
    "example": {
        "books": {
            "$a": {
                "foo": {
                    "$t": "bar"
                }
            },
            "book": [
                "An example book"
            ]
        }
    }
}
```

##### minimal:
```javascript
{
    "example": {
        "books": {
            "foo": "bar",
            "book": "An example book"
        }
    }
}
```

Beware that when you are using minimal mode and you have a tag with both text and attributes you will see the $t again:

```xml
<example>
    <books>
        <book isbn="12345">An example book</book>
    </books>
</example>
```

```javascript
{
    "example": {
        "books": {
            "book": {
                "$t": "An example book",
                "isbn": "12345"
            }
        }
    }
}
```
