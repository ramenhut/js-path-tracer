
function include( file ) { document.write( '<script src="' + file + '"></script>'); }

//
// The following structure facilitates obfuscation (which is discouraged). In this case,
// it pushes as many functions into inner scopes as possible, so as to promote a higher
// level of name mangling.
// 

function CVEngine() 
{
    include("Source/geBase.js");
    include("Source/geDebug.js");
    include("Source/geMath.js");
    include("Source/geObject.js");
    include("Source/geFrame.js");
    include("Source/geTrace.js");
    include("Source/geTiming.js");
    include("Source/geGraphics.js");
    include("Source/geInput.js");
    include("Source/geFileIO.js");
    include("Source/geGame.js");

    this.Initialize = function ()
    {
        Debugger.Initialize();
        File.Initialize();
        Time.Initialize(0);
        Input.Initialize();
        Graphics.Initialize();
        Game.Initialize();
    }

    this.Pulse = function () 
    {
        Time.UpdateTime();
        Game.Update();
        Game.Render();
    }

    this.ToggleTraceMode = function () 
    {
        Game.ToggleTraceMode();
    }

    this.SetMipLevel = function (newLevel) 
    {
        Game.SetMipLevel(newLevel);
    }
}

var g_Engine = new CVEngine;

function geInitialize()
{
    g_Engine.Initialize();
}

function geFramePulse()
{
    g_Engine.Pulse();
}

function geToggleTraceMode() 
{
    g_Engine.ToggleTraceMode();
}

function geSetMipLevel(newLevel) 
{
    g_Engine.SetMipLevel(newLevel);
}
