
function CFrame() 
{
    //
    // @private variables
    //

    var MipLevel = 2;
    var FrameBuffer = [];
    var CountBuffer = [];
    var FinalBuffer = [];

    this.GetFrameWidth = function () 
    {
        return Graphics.GetFrameWidth() / MipLevel;
    }

    this.GetFrameHeight = function () 
    {
        return Graphics.GetFrameHeight() / MipLevel;
    }

    this.Initialize = function ()
    {
    }

    this.Deinitialize = function ()
    {
        FrameBuffer = [];
        CountBuffer = [];
        FinalBuffer = [];
    }

    this.Store = function ( x, y, value )
    {
        var index = y * this.GetFrameWidth() + x;

        if ( CountBuffer[index] == null )
        {
            FrameBuffer[index] = new CVector3;
            CountBuffer[index] = 0;
            FinalBuffer[index] = new CVector3;
        }

        CountBuffer[index]++;
        FrameBuffer[index].AddEq(value);
        FinalBuffer[index] = FrameBuffer[index].DivScalar(CountBuffer[index]);
    }

    this.GetCount = function (x, y)
    {
        var index = y * this.GetFrameWidth() + x;

        return CountBuffer[index];
    }

    this.Render = function (x, y) 
    {
        var index = y * this.GetFrameWidth() + x;

        var color = FinalBuffer[index];

        Graphics.SetColorRgba(color.GetX(), color.GetY(), color.GetZ(), 1);
        Graphics.RenderRect(x * MipLevel, (this.GetFrameHeight() - y - 1) * MipLevel, MipLevel, MipLevel, true);
        // Graphics.RenderPixel(x, (this.GetFrameHeight() - y - 1), color.GetX(), color.GetY(), color.GetZ(), 1);
    }

    this.SetMipLevel = function (newMip) 
    {
        if (newMip <= 0) MipLevel = 1;
        if (newMip > 10) MipLevel = 10;
        else MipLevel = newMip;
    }
}