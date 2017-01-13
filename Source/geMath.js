
//
// Math Library
//

function CompareEpsilon( a, b )
{
    if ( a > ( b - EPSILON ) && a < ( b + EPSILON ) )
        return true;

    return false;
}

function rands()
{
    return (Math.random() - 0.5) * 2.0;
}

include("Source/geVector3.js");
include("Source/geVector4.js");
include("Source/geNormals.js");
include("Source/geMatrix3.js");
include("Source/geMatrix4.js");