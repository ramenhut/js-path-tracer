
function PathTrace( scene, ray, ri, depth )
{
    if ( depth > 5 ) return new CVector3;

    var info = new CRayInfo;

    if ( !NearestObject( scene, ray, info ) )
        return new CVector3;

    if ( info.emission.GetX() || info.emission.GetY() || info.emission.GetZ() )
    {
        //
        // We've struck a light source - return its color directly
        //

        ri.Assign( info );

        // Debugger.Printf("Object hit with emission of " + info.emission.toString() );

        return info.emission;
    }

    //
    // We struck a diffuse object - iterate and calculate contribution. 
    // Note that if we do not hit a light source before our 5th iteration,
    // then this entire path will not contribute to the final color.
    // 

    var dri = new CRayInfo;

    //
    // Note: we should wrap all of this within a BRDF and properly
    // use a PDF to determine reflectivity direction based on a 
    // solid angle cone.
    //

    var incident = new CVector3;

    incident.Assign( ( info.position.Sub( ray.start ) ).Normalize() );

    //
    // If solidAngle equals 0, then rd will simply equal the proper reflection
    // vector based on the incident vector and normal. If solidAngle equals M_PI,
    // then rd will be a randomly selected reflection vector within the hemisphere
    // oriented about info.normal.
    //
    // If solidAngle is 0 < solidAngle < M_PI, then rd will be a randomly selected
    // reflection vector bounded around the proper reflection vector, by a solid
    // angle of info.solidAngle.
    //

    ri.Assign( info );

    var rd = new CVector3;
    
    rd.Assign( g_NormalSphere.RandomNormalHemisphere( incident, info.normal, info.solidAngle ) );

    var newRay = new CRay3;

    newRay.Set( info.position, info.position.Add( rd.MulScalar( 10000 ) ) );

    var indirectColor   = new CVector3;
    var saComponent     = new CVector3;
    var invSaComponent  = new CVector3;

    indirectColor.Assign(PathTrace(scene, newRay, dri, depth + 1));

    var saAdjust = info.solidAngle / PI;

    saComponent.Assign( ( ( info.diffuse.Mul( indirectColor ) ).MulScalar( FS_MAX( 0, rd.Dot( info.normal ) ) ) ).MulScalar( saAdjust ) );
    invSaComponent.Assign( ( indirectColor.Mul( info.diffuse ) ).MulScalar( 1.0 - saAdjust ) );

    return saComponent.Add( invSaComponent );
}

function PathTraceScene( scene, frame ) 
{
    var p_fovy          = 90.0;
    var p_near          = 0.1;
    var p_far           = 1000.0;
    var p_width         = frame.GetFrameWidth();
    var p_height        = frame.GetFrameHeight();
    var p_aspect        = p_width / p_height;
    var p_fovx          = p_fovy * p_aspect;
    var anglestep_y     = p_fovy / p_height;
    var anglestep_x     = p_fovx / p_width;

    var theta           = -p_fovy/2; 
    var alpha           = p_fovy/2;

    var far_upper_left  = new CVector3;
    var far_upper_right = new CVector3;
    var far_lower_right = new CVector3;
    var far_lower_left  = new CVector3;

    far_upper_left.Set( (-p_far)/Math.tan(theta*(PI/180)), (-p_far)/Math.tan(alpha*(PI/180)),-p_far );

    theta = p_fovy/2; 
    alpha = p_fovx/2;	

    far_upper_right.Set( (-p_far)/Math.tan(theta*(PI/180)), (-p_far)/Math.tan(alpha*(PI/180)),-p_far );

    theta = p_fovy/2; 
    alpha = -p_fovx/2;		

    far_lower_right.Set( (-p_far)/Math.tan(theta*(PI/180)), (-p_far)/Math.tan(alpha*(PI/180)),-p_far );

    theta = -p_fovy/2; 
    alpha = -p_fovx/2;				

    far_lower_left.Set( (-p_far)/Math.tan(theta*(PI/180)), (-p_far)/Math.tan(alpha*(PI/180)),-p_far );
    
    var left_to_right = far_upper_right.GetX() - far_upper_left.GetX();
    var top_to_bottom = far_lower_left.GetY() - far_upper_left.GetY();
    var right_to_left = far_upper_left.GetX() - far_upper_right.GetX();
    var bottom_to_top = far_upper_right.GetY() - far_lower_right.GetY();

    for ( var k = 0; k < 4; k++) 
    {
        var j = Math.floor(Math.random() * (frame.GetFrameHeight() - 1));
        var i = Math.floor(Math.random() * (frame.GetFrameWidth() - 1));

        // if (frame.GetCount(i, j) > 10) continue;

        var ray = new CRay3;
        var info = new CRayInfo;
        var color = new CVector3;

        var sat = 255.0;
        ray.start.Set(0, 0, 0);
        ray.end.Set(far_upper_right.GetX() - (i / p_width) * left_to_right, far_upper_left.GetY() + (j / p_height) * top_to_bottom, -p_far);

        color.Assign(PathTrace(scene, ray, info, 0));
        color.Assign(color.Clamp(0.0, 1.0));

        if (color.x != 0 || color.y != 0 || color.z != 0) 
        {
            frame.Store(i, j, color);
            frame.Render(i, j);
        }
    }

    //
    // Record our metrics
    //

    g_TotalElapsedTime += Time.GetElapsedTime();

    if (g_TotalElapsedTime > 5000)
    {
        Debugger.Printf("Averaging " + Math.ceil( g_TotalRayCount / ( g_TotalElapsedTime / 1000.0 ) ) + " rays/sec ");

        g_TotalElapsedTime = 0;
        g_TotalRayCount = 0;
    }
}