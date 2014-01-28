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
xmlObject = objectifier.documentToObject( xmlDoc, "smart", [ "ControlParameters" ] )
# console.log( JSON.stringify( xmlObject, null, " " ) )

describe( "Objectifier [hints]", () ->
    describe( "#documentToObject()", () ->

        it( "Attribute should be set", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.$a.example", xmlObject ) ).to.eql( "yes" )
        )

        it( "Tag should contain text", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.username", xmlObject ) ).to.eql( "foo" )
        )

        it( "Hinted tag should be array", () ->
            chai.expect( objectUtils.isArray( objectUtils.getValue( "authenticateUser.request.ControlParameters", xmlObject ) ) ).to.eql( true )
        )
    )
)