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

describe( "Objectifier", () ->
    describe( "#documentToObject()", () ->

        # Convert the DOM
        #
        xmlObject = objectifier.documentToObject( xmlDoc )
        console.log( JSON.stringify( xmlObject ) )

        it( "Attribute should be set", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.0.$a.example.$t", xmlObject ) ).to.eql( "yes" )
        )

        it( "Tag should contain text", () ->
            chai.expect( objectUtils.getValue( "authenticateUser.request.0.username.0.$t", xmlObject ) ).to.eql( "foo" )
        )
    )
)