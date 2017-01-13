
function CVGraphicsEngine ()
{
    //
    // @private members
    //

    var m_bInitialized          = false;
    var m_oRenderCanvas         = null;
    var m_oRenderContext        = null;
    var m_uiFrameWidth          = 640;
    var m_uiFrameHeight         = 360;

    var m_TextureList           = [];
    var m_VideoList             = [];

    //
    // @public members
    //

    this.GE_FONTTYPE_FILL       = 0;
    this.GE_FONTTYPE_STROKE     = 1;

    //
    // @private interfaces
    //

    function ColorConvert(red, green, blue, alpha) 
    {
        return 'rgba(' + (255 * red) + ',' + (255 * green) + ',' + (255 * blue) + ',' + (255 * alpha) + ')';
    }

    function SetColor(color)
    {
        m_oRenderContext.strokeStyle = color;
        m_oRenderContext.fillStyle = color;
    }

    //
    // @public interfaces
    //

    this.Initialize = function ()
    {
        if ( m_bInitialized ) return false;

        m_oRenderCanvas   = document.getElementById( 'gameWindow' );
        m_uiFrameWidth    = m_oRenderCanvas.getAttribute( "width" );
        m_uiFrameHeight   = m_oRenderCanvas.getAttribute( "height" );
        m_oRenderContext  = m_oRenderCanvas.getContext( "2d" ); 
    
        Debugger.Printf( 'Graphics subsystem initialized (w: ' + m_uiFrameWidth + ', h: ' + m_uiFrameHeight + ')' );

        m_bInitialized = true;

        return true;
    }

    this.Deinitialize = function () 
    {
        if (!m_bInitialized) return false;

        m_bInitialized = false;

        return true;
    }

    this.SetColorRgba = function ( red, green, blue, alpha )
    {
        SetColor( 'rgba(' + parseInt( 255*red ) + ', ' + parseInt( 255*green ) + ', ' + parseInt( 255*blue ) + ', ' + parseFloat( 255*alpha ) + ')' );
    }

    this.SetFont = function (font) 
    {
        m_oRenderContext.font = font;
    }

    this.RenderText = function (x, y, type, msg) 
    {
        if (type == GE_FONTTYPE_FILL) 
        {
            m_oRenderContext.fillText(msg, x, y);
        }
        else if (type == GE_FONTTYPE_STROKE) 
        {
            m_oRenderContext.strokeText(msg, x, y);
        }
    }

    this.Clear = function ( red, green, blue, alpha ) 
    {
        SetColor( ColorConvert( red, green, blue, alpha ) );
        m_oRenderContext.fillRect( 0, 0, m_uiFrameWidth, m_uiFrameHeight );
    }

    this.LoadImage = function (image_path) 
    {
        var image_index = m_TextureList.length;

        m_TextureList[image_index] = document.createElement('img');
        m_TextureList[image_index].src = image_path;
        m_TextureList[image_index].setAttribute("style", "visibility: hidden;");

        return image_index;
    }

    this.LoadVideo = function (video_path) 
    {
        var video_index = m_VideoList.length;

        m_VideoList[video_index] = document.createElement('video');
        m_VideoList[video_index].src = video_path;
        m_VideoList[video_index].setAttribute("style", "display: none;");
        m_VideoList[video_index].play();

        document.body.appendChild(m_VideoList[video_index]);

        return video_index;
    }

    this.UnloadImage = function (image_index) 
    {
        //
        // Shift any texture id's after the removed slot down one
        // (handled by simply removing the stale element)
        //

        m_TextureList.splice(image_index, 1);
    }

    this.UnloadVideo = function (video_index) 
    {
        m_VideoList.splice(video_index, 1);
    }

    this.RenderImage = function (image_index, x, y, w, h) 
    {
        try 
        {
            m_oRenderContext.drawImage(m_TextureList[image_index], x, y, w, h);
        }
        catch (e) {}
    }

    this.RenderVideo = function (video_index, x, y, w, h)
    {
        try 
        {
            m_oRenderContext.drawImage(m_VideoList[video_index], x, y, w, h);
        }
        catch (e) {}
    }

    this.SetShadowProperties = function (offsetx, offsety, blur, color) 
    {
        m_oRenderContext.shadowOffsetX = offsetx;
        m_oRenderContext.shadowOffsetY = offsety;
        m_oRenderContext.shadowBlur = blur;
        m_oRenderContext.shadowColor = color;
    }

    this.SetLineWidth = function (width) 
    {
        m_oRenderContext.lineWidth = width;
    }

    this.RenderLine = function (x1, y1, x2, y2) 
    {
        //
        // Warning: sub-optimal route for rendering large connected
        //          line segments (consider using the context directly)
        // 

        m_oRenderContext.beginPath();
        m_oRenderContext.moveTo(x1, y1);
        m_oRenderContext.lineTo(x2, y2);
        m_oRenderContext.closePath();
        m_oRenderContext.stroke();
    }

    this.RenderRect = function (x, y, w, h, fill) 
    {
        if (fill) m_oRenderContext.fillRect(x, y, w, h);
        else m_oRenderContext.strokeRect(x, y, w, h);
    }

    this.RenderPixel = function (x, y, r, g, b, a) 
    {
        this.SetColorRgba(r, g, b, a);
        this.RenderRect(x, y, 1, 1, true);
    }

    this.GetImageWidth = function (image_index) 
    {
        return m_TextureList[image_index].width;
    }

    this.GetImageHeight = function (image_index) 
    {
        return m_TextureList[image_index].height;
    }

    this.GetContext = function () 
    {
        return m_oRenderContext;
    }

    this.GetFrameWidth = function () 
    {
        return m_uiFrameWidth;
    }

    this.GetFrameHeight = function () 
    {
        return m_uiFrameHeight;
    }

    this.CreateOffscreenBuffer = function () 
    {
        return geGetContext().createImageData(geGetFrameWidth(), geGetFrameHeight());
    }

    this.GetBackbuffer = function () 
    {
        return geGetContext().getImageData(0, 0, geGetFrameWidth(), geGetFrameHeight());
    }

    this.SetBackbuffer = function (image_buffer) 
    {
        geGetContext().putImageData(image_buffer, 0, 0);
    }
}

var Graphics = new CVGraphicsEngine;