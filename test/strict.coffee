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
        <emptyTag/>
    </request>
</authenticateUser>
"""
xmlDoc = xmldom.parse( xmlString )

# Convert the DOM
#
xmlObject = objectifier.documentToObject( xmlDoc, "strict" )
# console.log( JSON.stringify( xmlObject, null, " " ) )

describe( "Objectifier [strict]", () ->
    describe( "#documentToObject()", () ->

        it( "Attribute should be set", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.0.$a.example.$t", xmlObject ) ).to.eql( "yes" )
        )

        it( "Tag should contain text", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.0.username.0.$t", xmlObject ) ).to.eql( "foo" )
        )
    )
)