
var g_TotalRayCount = 0;
var g_TotalElapsedTime = 0;

function CRayInfo() 
{
    //
    // @public variables
    //

    this.t               = 99999999.0;
    this.solidAngle      = 0.0;
    this.emission        = new CVector3;
    this.diffuse         = new CVector3;
    this.position        = new CVector3;
    this.normal          = new CVector3;

    //
    // @public interfaces
    //

    this.Assign = function ( rhs )
    {
        this.t = rhs.t;
        this.solidAngle = rhs.solidAngle;
        this.emission.Assign( rhs.emission );
        this.diffuse.Assign( rhs.diffuse );
        this.position.Assign( rhs.position );
        this.normal.Assign( rhs.normal );
    }
}

function CRay3() 
{
    //
    // @public variables
    //

    this.start  = new CVector3;
    this.end    = new CVector3;

    //
    // @public interfaces
    //

    this.Assign = function ( rhs )
    {
        this.start.Assign( rhs.start );
        this.end.Assign( rhs.end );
    }

    this.Set = function ( s, e )
    {
        this.start.Assign(s);
        this.end.Assign( e );
    }
}


function NearestObject(scene, ray, ri) 
{
    var tray = new CRay3;
    var info = new CRayInfo;
    var hitCount = 0;
    var closest_t = 0.0;

    g_TotalRayCount++;

    tray.Assign(ray);

    //
    // Adjust our starting position by an epsilon, to ensure we do not collide against
    // the starting object.
    //

    var vnorm = new CVector3;

    vnorm.Assign(tray.end.Sub(tray.start));
    vnorm.Assign((vnorm.Normalize()).MulScalar(1.0 / 256.0));
    tray.start.AddEq(vnorm);

    for (var i = 0; i < scene.length; i++) {
        var tempInfo = new CRayInfo;

        if (scene[i].Trace(tray, tempInfo)) {
            if (tempInfo.t < closest_t || 0 == hitCount) {
                info.Assign(tempInfo);
                closest_t = info.t;
                hitCount++;
            }
        }
    }

    if (0 == hitCount)
        return false;

    //
    // ATP: We've hit an object, and stored its info
    //

    ri.Assign(info);

    return true;
}

var g_NormalSphere = new CNormalSphere;

include("Source/gePathTrace.js");
include("Source/geRayTrace.js");