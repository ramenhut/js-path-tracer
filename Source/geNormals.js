
function CNormalSphere() 
{
    //
    // @private variables
    //

    var m_NormalList = [];
    var m_bInitialized = false;

    //
    // @public interfaces
    //

    this.Initialize = function () 
    {
        if ( m_bInitialized ) return false;

        Debugger.Printf("Initializing Normal Sphere");

        for (var i = 0; i < (16 * KB); i++) 
        {
            var solidAxis = new CVector3;

            solidAxis.Set( 10.0, 10.0, 10.0 );

		    while ( solidAxis.Length() > 1.0 )
		    {
			    solidAxis.Set( rands(), rands(), rands() );
		    }

		    m_NormalList[i] = new CVector3;
			m_NormalList[i].Assign(solidAxis.Normalize());
        }

        m_bInitialized = true;

        Debugger.Printf("Normal Sphere Completed");

        return true;
    }

    this.Deinitialize = function ()
    {
        if ( !m_bInitialized ) return false;

        m_NormalList = [];

        m_bInitialized = false;

        return true;
    }

    this.RandomNormal = function () 
    {
        if (!m_bInitialized && !this.Initialize())
            return new CVector3;

        var tv = new CVector3;

        var index = Math.floor((Math.random() * (m_NormalList.length - 1)));

        tv.Set(m_NormalList[index].GetX(), m_NormalList[index].GetY(), m_NormalList[index].GetZ());

        return tv;
    }

    this.RandomNormalHemisphere = function (inc, n, solidAngle) 
    {
        if (!m_bInitialized && !this.Initialize())
            return new CVector3;

        var halfSolidAngle = solidAngle / 2.0;

        var randomSolidDelta = rands() * halfSolidAngle;

        var reflect = new CVector3;
        var ndoti = n.Dot(inc);

        reflect.Set(inc.GetX() - (n.GetX() * ndoti * 2.0),
                    inc.GetY() - (n.GetY() * ndoti * 2.0),
                    inc.GetZ() - (n.GetZ() * ndoti * 2.0));

        //
        // Select a random vector to use as the axis for rotation,
        // then rotate our normal by a random value about that axis.
        //

        var solidAxis = new CVector3;

        solidAxis.Assign( this.RandomNormal().Normalize() );

        if (solidAxis.Dot(n) < 0.0) 
        {
            solidAxis.Assign(solidAxis.MulScalar(-1.0));
        }

        //
        // Now rotate our reflection vector by our random half angle, about our random axis
        //

        if (CompareEpsilon(solidAngle, PI)) return solidAxis;

        else if (CompareEpsilon(solidAngle, 0.0)) return reflect;
        
        return reflect.Rotate(randomSolidDelta, solidAxis);
    }
}

