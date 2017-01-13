
function CSphere() 
{
    //
    // @private variables
    //

    var	radius = 0.0;
    var origin = new CVector3;
    var emission = new CVector3;
    var diffuse = new CVector3;
    var solidAngle = PI;

    //
    // @public interfaces
    //

    this.SetSolidAngle = function (angle) { solidAngle = angle; }
    this.GetSolidAngle = function () { return solidAngle; }

    this.SetEmissionEx = function (x, y, z) { emission.Set(x, y, z); }
    this.SetEmission = function (color) { emission.Assign(color); }
    this.GetEmission = function () { return emission; }

    this.SetDiffuseEx = function (x, y, z) { diffuse.Set(x, y, z); }
    this.SetDiffuse = function (color) { diffuse.Assign(color); }
    this.GetDiffuse = function () { return diffuse; }

    //
    // @public interfaces
    //

    this.SetRadius = function ( v )
    {
        radius = v;
    }

    this.SetOriginEx = function (x, y, z)
    {
        origin.Set(x, y, z);
    }

	this.SetOrigin = function ( v )
    {
        origin.Assign( v );
    }

    this.GetOrigin = function () 
    { 
        return origin; 
    }

    this.Trace = function (ray, info) 
    {
        var ray_vec = new CVector3;
        var ray_origin_vec = new CVector3;

        ray_vec.Assign(ray.end.Sub(ray.start));
        ray_origin_vec.Assign(ray.start.Sub(origin));

        var a = ray_vec.Dot(ray_vec);
        var b = 2.0 * (ray_origin_vec.Dot(ray_vec));
        var c = (ray_origin_vec.Dot(ray_origin_vec)) - (radius * radius);
        var d = b * b - 4.0 * a * c;
        var t = 0;

        if (d < 0) return false;

        else if (d == 0) 
        {
            t = -b / (2.0 * a);
        }

        else if (d > 0) 
        {
            t = (-b - Math.sqrt(d)) / (2.0 * a);
        }

        if (t < 0 || t > 1) return false;

        var tv = new CVector3;

        tv.Set(t, t, t);

        //
        // ATP: t equals the parametric solution to our collision
        //

        info.diffuse.Assign(this.GetDiffuse());
        info.emission.Assign(this.GetEmission());
        info.t = t;
        info.solidAngle = this.GetSolidAngle();
        info.position.Assign(ray.start.Add(tv.Mul(ray_vec)));

        //
        // Our normal at info.position is defined by the normalized vector from 
        // our sphere origin to info.position
        //

        info.normal.Assign(info.position.Sub(origin));
        info.normal.Assign( info.normal.Normalize() );

        return true;
    }
}

function CPlane() 
{
    //
    // @private variables
    //

    var normal = new CVector3;
    var distance = 0.0;
    var emission = new CVector3;
    var diffuse = new CVector3;
    var solidAngle = PI;

    //
    // @public interfaces
    //

    this.SetSolidAngle = function (angle) { solidAngle = angle; }
    this.GetSolidAngle = function () { return solidAngle; }

    this.SetEmissionEx = function (x, y, z) { emission.Set(x, y, z); }
    this.SetEmission = function (color) { emission.Assign(color); }
    this.GetEmission = function () { return emission; }

    this.SetDiffuseEx = function (x, y, z) { diffuse.Set(x, y, z); }
    this.SetDiffuse = function (color) { diffuse.Assign(color); }
    this.GetDiffuse = function () { return diffuse; }

    //
    // @public interfaces
    //

    this.SetNormalEx = function (x, y, z)
    {
        normal.Set(x, y, z);
        normal.Assign( normal.Normalize() );
    }

    this.SetNormal = function( n )
    {
        normal.Assign( n.Normalize() );
    }

    this.SetDistance = function ( d )
    {
        distance = d;
    }

    this.Trace = function ( ray, info ) 
    {
        var ray_vec = new CVector3;
        
        ray_vec.Assign( ray.end.Sub(ray.start) );

        var ns = ( normal.GetX() * ray.start.GetX() + normal.GetY() * ray.start.GetY() + normal.GetZ() * ray.start.GetZ() + distance );
        var ts = ( normal.GetX() * ray_vec.GetX() + normal.GetY() * ray_vec.GetY() + normal.GetZ() * ray_vec.GetZ() );

        ns *= -1.0;

        if ( ts == 0 ) return false;

        var t = ns / ts;

        if ( t < 0 || t > 1 ) return false;

        var tv = new CVector3;

        tv.Set(t, t, t);

        //
        // ATP: We have detected a valid collision at parametric value of t
        //

        info.diffuse.Assign( this.GetDiffuse() );
        info.emission.Assign( this.GetEmission() );
        info.t = t;
        info.solidAngle = this.GetSolidAngle();
        info.position.Assign( ray.start.Add( tv.Mul( ray_vec ) ) );
        info.normal.Assign( normal );

        return true;
    }
}