( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "underscore"
        )
    else if typeof define is "function" and define.amd
        define( [
            "underscore"
        ], factory )

)( ( _ ) ->
    # This method take an XML DOM Level 2 document and converts it to an
    # object representation with minimal loss of data
    #
    documentToObject = ( xmlDocument, mode = "strict", smartHints = [] ) ->
        rootNode = xmlDocument.documentElement

        # Return object version of the document
        #
        objDocument = {}

        if rootNode.localName?
            nodeName    = rootNode.localName or rootNode.tagName
            nodeName    = rootNode.nodeName if mode is "minimal"
        else
            # localName is not supported below IE9.
            # Fall back to tagName but purge name-space
            #
            nodeName    = rootNode.tagName.replace( /^.*?:/, '' )

        objDocument[ rootNode.localName ] = nodeToObject( rootNode, mode, smartHints )

        return objDocument

    # Conversion can be set to 3 modes:
    # strict (default)
    # smart
    # minimal
    #
    # Strict is a fully reversible and consistent approach. Every tag will always
    # be an array. Tag values are always in $t and name-spaces are separated from
    # the node names and put in $ns
    #
    # Smart mode is almost the same as strict but it tries to prevent every tag
    # from becoming an array. It tries to detect plurals in tag names and it can
    # be fed a list of tag names that are always collections. Smart mode will still
    # place all text in $t and attributes in $a. Name-space will be removed and
    # placed in $ns.
    #
    # Minimal is a non reversible brief representation of the XML.
    # In this mode it will create objects for single nodes and will ignore names spaces
    # If a node only has text the entire node will be set to that text, otherwise
    # $t will be used. If a second child node of the same name is encountered it
    # will upgrade the object node to an array. Attributes and childNodes are mixed
    # together on the object therefor it is not a reversible format. If you are only
    # consuming simple XML and you know the format beforehand this mode will create
    # the leanest object.
    # It will need more code checks on each node to figure out what is inside of it.
    #
    nodeToObject = ( xmlNode, mode = "strict", smartHints = [] ) ->
        objNode    = {}
        objNode.$t = "" if mode is "strict"

        # Add namespace if present except when in minimal mode
        #
        if mode is not "minimal" and xmlNode.prefix
            objNode.$ns = xmlNode.prefix

        # Add attributes if present
        #
        if xmlNode.attributes.length > 0
            switch mode
                when "strict"
                    objNode.$a = {}

                    for i in [ 0...xmlNode.attributes.length ]
                        attribute = xmlNode.attributes.item( i )

                        objNode.$a[ attribute.localName ] =
                            $t:     attribute.nodeValue

                        # Strict mode is the only mode that support name-spaces on
                        # attributes
                        #
                        objNode.$a[ attribute.localName ].$ns = attribute.prefix if attribute.prefix

                when "smart"
                    objNode.$a = {}

                    for i in [ 0...xmlNode.attributes.length ]
                        attribute = xmlNode.attributes.item( i )
                        objNode.$a[ attribute.localName ] = attribute.nodeValue

                when "minimal"
                    # Add attributes directly to the node with minimal fuss
                    # This can cause a potential conflict if an attribute exists
                    # with the same name as a child node (!!)
                    #
                    for i in [ 0...xmlNode.attributes.length ]
                        attribute = xmlNode.attributes.item( i )
                        objNode[ attribute.nodeName ] = attribute.nodeValue

        # Add child nodes if present
        #
        if xmlNode.hasChildNodes()
            # Add the child nodes to the object
            #
            for i in [ 0...xmlNode.childNodes.length ]
                childNode = xmlNode.childNodes.item( i )

                # Take action based on the nodeType
                #
                switch childNode.nodeType
                    when 1 # ELEMENT_NODE
                        nodeName = childNode.localName

                        switch mode
                            when "minimal", "smart"
                                nodeName = childNode.nodeName

                                if not objNode[ nodeName ]?
                                    # This is where we try to get clever
                                    # If the child node name is a plural of the
                                    # parent it is likely a collection.
                                    # Alternatively if the nodeName exists in the
                                    # smartHints array it will also be an array by default
                                    #
                                    parentName = xmlNode.localName

                                    # Check smartHints first and if that fails try a few known plurals
                                    # In the future it might be prudent to add language sensitivity to smart mode
                                    # Different languages will have different ways to do plurals
                                    #
                                    if _.indexOf( smartHints, nodeName ) isnt -1 or nodeName + "s" is parentName or nodeName + "en" is parentName
                                        objNode[ nodeName ] = [] if not objNode[ nodeName ]?
                                        objNode[ nodeName ].push( nodeToObject( childNode, mode, smartHints ) )
                                    else
                                        objNode[ nodeName ] = nodeToObject( childNode, mode, smartHints )

                                else
                                    if _.isArray( objNode[ nodeName ] )
                                        # Add to existing array
                                        #
                                        objNode[ nodeName ].push( nodeToObject( childNode, mode, smartHints ) )
                                    else
                                         # Upgrade node to array
                                        #
                                       objNode[ nodeName ] = [ objNode[ nodeName ], nodeToObject( childNode, mode, smartHints ) ]

                            # Strict mode is the default
                            #
                            else
                                objNode[ nodeName ] = [] if not objNode[ nodeName ]?
                                objNode[ nodeName ].push( nodeToObject( childNode, mode, smartHints ) )

                    when 3 # TEXT_NODE
                        nodeText   = childNode.nodeValue .replace(/^\s+|\s+$/g, "" )

                        if mode is "minimal" or mode is "smart"
                            objNode.$t = nodeText if nodeText
                        else
                            objNode.$t = nodeText

                    when 4 # CDATA_NODE
                        objNode.$t = childNode.nodeValue

        if mode is "minimal" or mode is "smart"
            # Check if the node only contains text
            #
            if xmlNode.childNodes.length is 1 and objNode.$t?
                objNode = objNode.$t

            # Check if the node is an empty object
            #
            if _.isEmpty( objNode )
                objNode = null


        return objNode

    xmlObjectifier =
        documentToObject: documentToObject
        nodeToObject:     nodeToObject
)