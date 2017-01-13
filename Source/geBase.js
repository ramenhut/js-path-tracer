
var KB            = 1024;
var MB            = (KB*KB);
var GB            = (KB*MB);
var PI            = 3.14159262;
var EPSILON       = ( 1.0 / 256.0 );

function FS_STRIDE( width )
{
    return (3*width);
}

function FS_OFFSET( x, y, w )
{
    return (y*FS_STRIDE(w)+x*3);
}

function FS_MAX( a, b )
{
    if ( a > b ) return a;

    return b;
}

function FS_MIN( a, b )
{
    if ( a < b ) return a;

    return b;
}

Function.prototype.method = function ( name, func ) 
{
    //
    // Simple routine for adding an interface to a prototype
    //

    this.prototype[name] = func;

    return this;
};

Function.prototype.inherits = function ( parent )
{
    //
    // Warning: this is a very dangerous way of handling things. 
    //          We're using it here with great caution - in a very
    //          specific set of scenarios - do not misuse!
    //

    this.prototype = new parent();

    return this;
}