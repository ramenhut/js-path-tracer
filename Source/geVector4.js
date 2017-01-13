
//
// N.B.
// We've chosen to write this class in a very (hyper) defensive manner. It is always clear
// whether a method is accessing itself (xyz) or parameter data (via accessors), in order
// to keep indices and accesses from being confused.
//

function CVector4() 
{
    //
    // @private variables
    //

    var xyzw = [0.0, 0.0, 0.0, 1.0];

    //
    // @public interfaces
    //

    this.Clear = function ()
    {
        xyzw[0] = 0;
        xyzw[1] = 0;
        xyzw[2] = 0;
        xyzw[3] = 1;
    }

    this.Clamp = function ( lower, upper )
    {
        var tv = new CVector4;

        tv.Set( xyzw[0], xyzw[1], xyzw[2], xyzw[3] );

        if ( tv.GetX() < lower ) tv.SetX( lower );
        if ( tv.GetX() > upper ) tv.SetX( upper );

        if ( tv.GetY() < lower ) tv.SetY( lower );
        if ( tv.GetY() > upper ) tv.SetY( upper );

        if ( tv.GetZ() < lower ) tv.SetZ( lower );
        if ( tv.GetZ() > upper ) tv.SetZ( upper );

        if (tv.GetW() < lower) tv.SetW(lower);
        if (tv.GetW() > upper) tv.SetW(upper);

        return tv;
    }

    this.Normalize = function ()
    {
        var tv = new CVector4;

        tv.Set( xyzw[0], xyzw[1], xyzw[2], xyzw[3] );

        var len = this.Length();

        if ( len == 0.0 ) len = 1.0;

        tv.SetX( tv.GetX() / len );
        tv.SetY( tv.GetY() / len );
        tv.SetZ( tv.GetZ() / len );
        tv.SetW( tv.GetW() / len );

        return tv;
    }

    this.Project = function ( rhs )
    {
        //
	    // Project rhs onto *this
	    //

        var thisNormal = this.Normalize();

	    var projectedLength = rhs.Dot( thisNormal );
	    
        return thisNormal.MulScalar( projectedLength );
    }

    this.Parallel = function ( rhs )
    {
        var a = this.Angle( rhs );

        if ( a == 0.0 || CompareEpsilon( a, PI ) )
            return true;

        return false;
    }

    this.Orthogonal = function ( rhs )
    {
        return ( this.Dot( rhs ) == 0 );
    }

    this.Angle = function ( rhs )
    {
        var product = this.Dot( rhs );

	    //
	    // cos(t) = v1 (dot) v2 / ||v1|| * ||v2|| 
	    //

	    var len1 = this.Length();
	    var len2 = rhs.Length();

	    if ( len1 == 0 ) len1 = 0.1;
	    if ( len2 == 0 ) len2 = 0.1;

	    var v_angle = product / ( len1 * len2 );

	    return Math.acos( v_angle );
    }

    this.Dot = function ( rhs )
    {
        return ( xyzw[0] * rhs.GetX() + xyzw[1] * rhs.GetY() + xyzw[2] * rhs.GetZ() + xyzw[3] * rhs.GetW() );
    }

    this.Distance = function ( rhs )
    {
        var vecDelta = new CVector4;
        
        vecDelta.Set( rhs.GetX() - xyzw[0], rhs.GetY() - xyzw[1], rhs.GetZ() - xyzw[2], rhs.GetW() - xyzw[3] );

	    return vecDelta.Length();
    }

    this.Length = function ()
    {
        return Math.sqrt( this.Dot( this ) );
    }

    this.Equals = function ( rhs )
    {
        return ( xyzw[0] == rhs.GetX() && xyzw[1] == rhs.GetY() && xyzw[2] == rhs.GetZ() && xyzw[3] == rhs.GetW() );
    }

    this.Sub = function ( rhs )
    {
        var out = new CVector4;

        out.Set( xyzw[0] - rhs.GetX(), xyzw[1] - rhs.GetY(), xyzw[2] - rhs.GetZ(), xyzw[3] - rhs.GetW() );

        return out;
    }

    this.SubEq = function ( rhs )
    {
        xyzw[0] = xyzw[0] - rhs.GetX();
        xyzw[1] = xyzw[1] - rhs.GetY();
        xyzw[2] = xyzw[2] - rhs.GetZ();
        xyzw[3] = xyzw[3] - rhs.GetW();

        return this;
    }

    this.Add = function ( rhs )
    {
        var out = new CVector4;

        out.Set( xyzw[0] + rhs.GetX(), xyzw[1] + rhs.GetY(), xyzw[2] + rhs.GetZ(), xyzw[3] + rhs.GetW() );

        return out;
    }

    this.AddEq = function ( rhs )
    {
        xyzw[0] = xyzw[0] + rhs.GetX();
        xyzw[1] = xyzw[1] + rhs.GetY();
        xyzw[2] = xyzw[2] + rhs.GetZ();
        xyzw[3] = xyzw[3] + rhs.GetW();

        return this;
    }

    this.Mul = function ( rhs )
    {
        var out = new CVector4;

        out.Set( xyzw[0] * rhs.GetX(), xyzw[1] * rhs.GetY(), xyzw[2] * rhs.GetZ(), xyzw[3] * rhs.GetW() );

        return out;
    }

    this.MulEq = function ( rhs )
    {
        xyzw[0] = xyzw[0] * rhs.GetX();
        xyzw[1] = xyzw[1] * rhs.GetY();
        xyzw[2] = xyzw[2] * rhs.GetZ();
        xyzw[3] = xyzw[3] * rhs.GetW();

        return this;
    }

    this.MulScalar = function ( rhs )
    {
        var out = new CVector4;

        out.Set( xyzw[0] * rhs, xyzw[1] * rhs, xyzw[2] * rhs, xyzw[3] * rhs );

        return out;
    }

    this.MulScalarEq = function ( rhs )
    {
        xyzw[0] = xyzw[0] * rhs;
        xyzw[1] = xyzw[1] * rhs;
        xyzw[2] = xyzw[2] * rhs;
        xyzw[3] = xyzw[3] * rhs;

        return this;
    }

    this.Div = function ( rhs )
    {
        var out = new CVector4;
        var divisor = new CVector4;

        divisor.Set( rhs.GetX(), rhs.GetY(), rhs.GetZ(), rhs.GetW() );

        if ( divisor.GetX() == 0.0 ) divisor.SetX( 0.0001 );
        if ( divisor.GetY() == 0.0 ) divisor.SetY( 0.0001 );
        if ( divisor.GetZ() == 0.0 ) divisor.SetZ( 0.0001 );
        if ( divisor.GetW() == 0.0 ) divisor.SetW( 0.0001 );

        out.Set( xyzw[0] / divisor.GetX(), xyzw[1] / divisor.GetY(), xyzw[2] / divisor.GetZ(), xyzw[3] / divisor.GetW() );

        return out;
    }

    this.DivEq = function ( rhs )
    {
        var divisor = new CVector4;

        divisor.Set( rhs.GetX(), rhs.GetY(), rhs.GetZ(), rhs.GetW() );

        if ( divisor.GetX() == 0.0 ) divisor.SetX( 0.0001 );
        if ( divisor.GetY() == 0.0 ) divisor.SetY( 0.0001 );
        if ( divisor.GetZ() == 0.0 ) divisor.SetZ( 0.0001 );
        if ( divisor.GetW() == 0.0 ) divisor.SetW( 0.0001 );

        xyzw[0] = xyzw[0] / divisor.GetX();
        xyzw[1] = xyzw[1] / divisor.GetY();
        xyzw[2] = xyzw[2] / divisor.GetZ();
        xyzw[3] = xyzw[3] / divisor.GetW();

        return this;
    }

    this.DivScalar = function ( rhs )
    {
        var out = new CVector4;
        var div = rhs;

        if ( div == 0.0 ) div = 0.0001;

        out.Set( xyzw[0] / div, xyzw[1] / div, xyzw[2] / div, xyzw[3] / div );

        return out;
    }

    this.DivScalarEq = function ( rhs )
    {
        var div = rhs;

        if ( div == 0.0 ) div = 0.0001;

        xyzw[0] = xyzw[0] / div;
        xyzw[1] = xyzw[1] / div;
        xyzw[2] = xyzw[2] / div;
        xyzw[3] = xyzw[3] / div;

        return this;
    }

    //
    // @public primitives
    //

    this.GetX = function () { return xyzw[0]; }
    this.GetY = function () { return xyzw[1]; }
    this.GetZ = function () { return xyzw[2]; }
    this.GetW = function () { return xyzw[3]; }

    this.SetX = function (x) { xyzw[0] = x; }
    this.SetY = function (y) { xyzw[1] = y; }
    this.SetZ = function (z) { xyzw[2] = z; }
    this.SetW = function (w) { xyzw[3] = w; }

    this.Assign = function (xyzwp) 
    {
        xyzw[0] = xyzwp.GetX();
        xyzw[1] = xyzwp.GetY();
        xyzw[2] = xyzwp.GetZ();
        xyzw[3] = xyzwp.GetW();
    }

    this.Set = function (x, y, z, w) 
    {
        xyzw[0] = x;
        xyzw[1] = y;
        xyzw[2] = z;
        xyzw[3] = w;
    }

    this.Get = function () 
    {
        var tv = new CVector4;
        tv.Set(xyzw[0], xyzw[1], xyzw[2], xyzw[3]);
        return tv;
    }

    this.toString = function () 
    {
        return xyzw[0] + ' ' + xyzw[1] + ' ' + xyzw[2] + ' ' + xyzw[3];
    }
}
