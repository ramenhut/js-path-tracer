
//
// N.B.
// We've chosen to write this class in a very (hyper) defensive manner. It is always clear
// whether a method is accessing itself (xyz) or parameter data (via accessors), in order
// to keep indices and accesses from being confused.
//

function CVector3() 
{
    //
    // @private variables
    //

    var xyz = [0.0, 0.0, 0.0];

    //
    // @public interfaces
    //

    this.Clear = function ()
    {
        xyz[0] = 0;
        xyz[1] = 0;
        xyz[2] = 0;
    }

    this.Clamp = function ( lower, upper )
    {
        var tv = new CVector3;

        tv.Set( xyz[0], xyz[1], xyz[2] );

        if ( tv.GetX() < lower ) tv.SetX( lower );
        if ( tv.GetX() > upper ) tv.SetX( upper );

        if ( tv.GetY() < lower ) tv.SetY( lower );
        if ( tv.GetY() > upper ) tv.SetY( upper );

        if ( tv.GetZ() < lower ) tv.SetZ( lower );
        if ( tv.GetZ() > upper ) tv.SetZ( upper );

        return tv;
    }

    this.Normalize = function ()
    {
        var tv = new CVector3;

        tv.Set( xyz[0], xyz[1], xyz[2] );

        var len = this.Length();

        if ( len == 0.0 ) len = 1.0;

        tv.SetX( tv.GetX() / len );
        tv.SetY( tv.GetY() / len );
        tv.SetZ( tv.GetZ() / len );

        return tv;
    }

    this.Cross = function ( rhs )
    {
        var tv = new CVector3;

        tv.Set( xyz[0], xyz[1], xyz[2] );

        tv.SetX( ( xyz[1] * rhs.GetZ() ) - ( xyz[2] * rhs.GetY() ) );
        tv.SetY( ( xyz[2] * rhs.GetX() ) - ( xyz[0] * rhs.GetZ() ) );
        tv.SetZ( ( xyz[0] * rhs.GetY() ) - ( xyz[1] * rhs.GetX() ) );
        
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
        return ( xyz[0] * rhs.GetX() + xyz[1] * rhs.GetY() + xyz[2] * rhs.GetZ() );
    }

    this.Distance = function ( rhs )
    {
        var vecDelta = new CVector3;
        
        vecDelta.Set( rhs.GetX() - xyz[0], rhs.GetY() - xyz[1], rhs.GetZ() - xyz[2] );

        return vecDelta.Length();
    }

    this.Length = function ()
    {
        return Math.sqrt( this.Dot( this ) );
    }

    this.Rotate = function (angle, axis) 
    {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);
        var out = new CVector3;

        var x = (cosTheta + (1 - cosTheta) * axis.GetX() * axis.GetX()) * xyz[0];
            x += ((1 - cosTheta) * axis.GetX() * axis.GetY() - axis.GetZ() * sinTheta) * xyz[1];
            x += ((1 - cosTheta) * axis.GetX() * axis.GetZ() + axis.GetY() * sinTheta) * xyz[2];

        var y = ((1 - cosTheta) * axis.GetX() * axis.GetY() + axis.GetZ() * sinTheta) * xyz[0];
            y += (cosTheta + (1 - cosTheta) * axis.GetY() * axis.GetY()) * xyz[1];
            y += ((1 - cosTheta) * axis.GetY() * axis.GetZ() - axis.GetX() * sinTheta) * xyz[2];

        var z = ((1 - cosTheta) * axis.GetX() * axis.GetZ() - axis.GetY() * sinTheta) * xyz[0];
            z += ((1 - cosTheta) * axis.GetY() * axis.GetZ() + axis.GetX() * sinTheta) * xyz[1];
            z += (cosTheta + (1 - cosTheta) * axis.GetZ() * axis.GetZ()) * xyz[2];

        out.Set(x, y, z);

        return out;
    }

    this.Equals = function ( rhs )
    {
        return ( xyz[0] == rhs.GetX() && xyz[1] == rhs.GetY() && xyz[2] == rhs.GetZ() );
    }

    this.Sub = function ( rhs )
    {
        var out = new CVector3;

        out.Set( xyz[0] - rhs.GetX(), xyz[1] - rhs.GetY(), xyz[2] - rhs.GetZ() );

        return out;
    }

    this.SubEq = function ( rhs )
    {
        xyz[0] = xyz[0] - rhs.GetX();
        xyz[1] = xyz[1] - rhs.GetY();
        xyz[2] = xyz[2] - rhs.GetZ();

        return this;
    }

    this.Add = function ( rhs )
    {
        var out = new CVector3;

        out.Set( xyz[0] + rhs.GetX(), xyz[1] + rhs.GetY(), xyz[2] + rhs.GetZ() );

        return out;
    }

    this.AddEq = function ( rhs )
    {
        xyz[0] = xyz[0] + rhs.GetX();
        xyz[1] = xyz[1] + rhs.GetY();
        xyz[2] = xyz[2] + rhs.GetZ();

        return this;
    }

    this.Mul = function ( rhs )
    {
        var out = new CVector3;

        out.Set( xyz[0] * rhs.GetX(), xyz[1] * rhs.GetY(), xyz[2] * rhs.GetZ() );

        return out;
    }

    this.MulEq = function ( rhs )
    {
        xyz[0] = xyz[0] * rhs.GetX();
        xyz[1] = xyz[1] * rhs.GetY();
        xyz[2] = xyz[2] * rhs.GetZ();

        return this;
    }

    this.MulScalar = function ( rhs )
    {
        var out = new CVector3;

        out.Set( xyz[0] * rhs, xyz[1] * rhs, xyz[2] * rhs );

        return out;
    }

    this.MulScalarEq = function ( rhs )
    {
        xyz[0] = xyz[0] * rhs;
        xyz[1] = xyz[1] * rhs;
        xyz[2] = xyz[2] * rhs;

        return this;
    }

    this.Div = function ( rhs )
    {
        var out = new CVector3;
        var divisor = new CVector3;

        divisor.Set( rhs.GetX(), rhs.GetY(), rhs.GetZ() );

        if ( divisor.GetX() == 0.0 ) divisor.SetX( 0.0001 );
        if ( divisor.GetY() == 0.0 ) divisor.SetY( 0.0001 );
        if ( divisor.GetZ() == 0.0 ) divisor.SetZ( 0.0001 );

        out.Set( xyz[0] / divisor.GetX(), xyz[1] / divisor.GetY(), xyz[2] / divisor.GetZ() );

        return out;
    }

    this.DivEq = function ( rhs )
    {
        var divisor = new CVector3;

        divisor.Set( rhs.GetX(), rhs.GetY(), rhs.GetZ() );

        if ( divisor.GetX() == 0.0 ) divisor.SetX( 0.0001 );
        if ( divisor.GetY() == 0.0 ) divisor.SetY( 0.0001 );
        if ( divisor.GetZ() == 0.0 ) divisor.SetZ( 0.0001 );

        xyz[0] = xyz[0] / divisor.GetX();
        xyz[1] = xyz[1] / divisor.GetY();
        xyz[2] = xyz[2] / divisor.GetZ();

        return this;
    }

    this.DivScalar = function ( rhs )
    {
        var out = new CVector3;
        var div = rhs;

        if ( div == 0.0 ) div = 0.0001;

        out.Set( xyz[0] / div, xyz[1] / div, xyz[2] / div );

        return out;
    }

    this.DivScalarEq = function ( rhs )
    {
        var div = rhs;

        if ( div == 0.0 ) div = 0.0001;

        xyz[0] = xyz[0] / div;
        xyz[1] = xyz[1] / div;
        xyz[2] = xyz[2] / div;

        return this;
    }

    //
    // @public primitives
    //

    this.GetX = function () { return xyz[0]; }
    this.GetY = function () { return xyz[1]; }
    this.GetZ = function () { return xyz[2]; }

    this.SetX = function (x) { xyz[0] = x; }
    this.SetY = function (y) { xyz[1] = y; }
    this.SetZ = function (z) { xyz[2] = z; }

    this.Assign = function (xyzp) 
    {
        xyz[0] = xyzp.GetX();
        xyz[1] = xyzp.GetY();
        xyz[2] = xyzp.GetZ();
    }

    this.Set = function (x, y, z) 
    {
        xyz[0] = x;
        xyz[1] = y;
        xyz[2] = z;
    }

    this.Get = function () 
    {
        var tv = new CVector3;
        tv.Set(xyz[0], xyz[1], xyz[2]);
        return tv;
    }

    this.toString = function () 
    {
        return xyz[0] + ' ' + xyz[1] + ' ' + xyz[2];
    }
}

function CalculateNormal( a, b, c )
{
    var tmpvec1 = b.Sub( a );
    var tmpvec2 = c.Sub( a );
    var crossed = tmpvec1.Cross( tmpvec2 );

    return crossed.Normalize();
}