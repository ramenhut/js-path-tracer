
function RayTrace( scene, ray, ri, depth )
{
	var info = new CRayInfo;
    var lightInfo = new CRayInfo;

	if ( !NearestObject( scene, ray, info ) )
		return new CVector3;

	if (info.emission.GetX() || info.emission.GetY() || info.emission.GetZ()) 
    {
	    //
	    // We've struck a light source - return its color directly
	    //

	    ri.Assign(info);

	    return info.emission;
	}

	//
	// Determine whether we can see the light source directly. If so, illuminate
    //

	var shadow = false;
	var lightPosition = new CVector3;
    var lightColor = new CVector3;
	var lightRay = new CRay3;
	var lightIncident = new CVector3;
	var reflectColor = new CVector3;
	var lightContrib = new CVector3;

	reflectColor.Set(0,0,0);
	lightPosition.Set(0, 20, -50);
    lightColor.Set( 1, 1, 1 );
	lightRay.Set(info.position, lightPosition);

	if (NearestObject(scene, lightRay, lightInfo)) 
    {
        shadow = true;
	}
	else 
    {
        //
        // We can see the light - determine contribution
        //

        lightIncident.Assign(lightPosition.Sub(info.position));
        lightIncident.Assign(lightIncident.Normalize());

        lightContrib = lightColor.MulScalar( lightIncident.Dot(info.normal) );
	}

    //
    // If we're perfectly reflective, determine the reflection color
    //

    if (0 == info.solidAngle) 
    {
        var dri = new CRayInfo;
        var rd = new CVector3;
        var incident = new CVector3;
        var newRay = new CRay3;

        incident.Assign((info.position.Sub(ray.start)).Normalize());

        rd.Assign(g_NormalSphere.RandomNormalHemisphere(incident, info.normal, info.solidAngle));

        newRay.Set(info.position, info.position.Add(rd.MulScalar(10000)));

        reflectColor.Assign(RayTrace(scene, newRay, dri, depth + 1));
    }
    else
    {
        reflectColor.Set(1, 1, 1);
    }

    if (shadow)
    {
        var final = new CVector3;

        final.Assign(info.diffuse.Mul(reflectColor));
        final.Set(final.GetX() / 5, final.GetY() / 5, final.GetZ() / 5);

        return final;
    }
    else
    {
        var final = new CVector3;
        final.Assign(info.diffuse.Mul(lightContrib.Mul(reflectColor)));

        return final;
    }
}

var k = 0;

function RayTraceScene( scene, frame ) 
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

	var end = k + 8;

	for ( k; k < end; k++) 
    {
        var j = Math.floor(k / frame.GetFrameWidth()) % frame.GetFrameHeight();
        var i = k % frame.GetFrameWidth();

	    var ray = new CRay3;
	    var info = new CRayInfo;
	    var color = new CVector3;

	    var sat = 255.0;
	    ray.start.Set(0, 0, 0);
	    ray.end.Set(far_upper_right.GetX() - (i / p_width) * left_to_right, far_upper_left.GetY() + (j / p_height) * top_to_bottom, -p_far);

	    color.Assign(RayTrace(scene, ray, info, 0));
	    color.Assign(color.Clamp(0.0, 1.0));

	    frame.Store(i, j, color);
	    frame.Render(i, j);
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