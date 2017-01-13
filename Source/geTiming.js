
function CVTimeSystem ()
{
    //
    // @private members
    //

    var m_fCurrentFrameTime      = 0.0;
    var m_fLastFrameTime         = 0.0;
    var m_fElapsedFrameTime      = 0.0;
    var m_fFramerate             = 0.0;
    var m_fFramerateShort        = 0.0;

    //
    // @public members
    //

    this.GE_TIME_MAX_TIME        = 1000.0 * 60.0 * 60.0 * 24.0;   // milliseconds per day

    this.Initialize = function (rate) 
    {
        setInterval('geFramePulse()', 1000 / rate);
    }

    this.Deinitialize = function () 
    {
    }

    this.UpdateTime = function () 
    {
        var tempDate = new Date();

        m_fLastFrameTime = m_fCurrentFrameTime;

        //
        // this will wrap once per day, so we safeguard - theoretically we could 
        // allow wrapping over shorter periods of time...
        //

        m_fCurrentFrameTime = tempDate.getMilliseconds() + tempDate.getSeconds() * 1000.0 +
                              tempDate.getMinutes() * 60000.0 + tempDate.getHours() * 3600000;

        if ( m_fCurrentFrameTime >= m_fLastFrameTime ) 
        {
            m_fElapsedFrameTime = m_fCurrentFrameTime - m_fLastFrameTime;
        }
        else 
        {
            //
            // Wrapped - determine proper elapsed time
            //

            m_fElapsedFrameTime = GE_TIME_MAX_TIME - m_fLastFrameTime + m_fCurrentFrameTime;
        }

        m_fFramerate = 1000.0 / m_fElapsedFrameTime;
        m_fFramerateShort = m_fFramerate.toString().substring(0, 5);
    }

    this.GetFramerate = function () 
    {
        return m_fFramerateShort;
    }

    this.GetElapsedTime = function ()
    {
        return m_fElapsedFrameTime;
    }
}

var Time = new CVTimeSystem();