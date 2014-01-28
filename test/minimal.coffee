chai        = require "chai"
objectifier = require "../lib/objectifier.js"
xmldom      = require "madlib-xmldom"
objectUtils = require "madlib-object-utils"

xmlString   = """
<authenticateUser>
    <request example="yes">
        <username>foo</username>
        <password>bar</password>
        <ControlParameters>
            <GetContracts>true</GetContracts>
        </ControlParameters>
    </request>
</authenticateUser>
"""
xmlDoc = xmldom.parse( xmlString )

# Convert the DOM
#
xmlObject = objectifier.documentToObject( xmlDoc, "minimal" )
# console.log( JSON.stringify( xmlObject, null, " " ) )

describe( "Objectifier [minimal]", () ->
    describe( "#documentToObject()", () ->

        it( "Attribute should be set", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.example", xmlObject ) ).to.eql( "yes" )
        )

        it( "Tag should contain text", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.username", xmlObject ) ).to.eql( "foo" )
        )
    )
)