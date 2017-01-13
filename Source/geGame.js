
function CVGameSystem() 
{
    var TraceMode = 0;
    var Frame = new CFrame;
    var sceneList = [];

    this.Initialize = function () {
        //
        // Setup our scene list
        //

        sceneList[0] = new CPlane;
        sceneList[1] = new CPlane;
        sceneList[2] = new CPlane;
        sceneList[3] = new CPlane;
        sceneList[4] = new CPlane;
        sceneList[5] = new CPlane;
        sceneList[6] = new CSphere;
        sceneList[7] = new CSphere;

        //
        // Object 0: Ceiling
        //

        sceneList[0].SetDiffuseEx(1.0, 1.0, 1.0);
        sceneList[0].SetEmissionEx(3, 3, 3);
        sceneList[0].SetNormalEx(0, -1, 0);
        sceneList[0].SetDistance(30.0);

        //
        // Object 1: Rear Wall
        //

        sceneList[1].SetDiffuseEx(0.75, 0.75, 0.75);
        sceneList[1].SetEmissionEx(0,0,0);
        sceneList[1].SetNormalEx(0, 0, 1);
        sceneList[1].SetDistance(100.0);

        //
        // Object 2: Floor
        //

        sceneList[2].SetDiffuseEx(0.75, 0.75, 0.75);
        sceneList[2].SetEmissionEx(0, 0, 0);
        sceneList[2].SetNormalEx(0, 1, 0);
        sceneList[2].SetDistance(50.0);

        //
        // Object 3: Left Wall
        //

        sceneList[3].SetDiffuseEx(1.0, 0.5, 0.5);
        sceneList[3].SetEmissionEx(0, 0, 0);
        sceneList[3].SetNormalEx(1, 0, 0);
        sceneList[3].SetDistance(50.0);

        //
        // Object 4: Right Wall
        //

        sceneList[4].SetDiffuseEx(0.5, 0.5, 1.0);
        sceneList[4].SetEmissionEx(0, 0, 0);
        sceneList[4].SetNormalEx(-1, 0, 0);
        sceneList[4].SetDistance(50.0);

        //
        // Object 5: Front Wall
        //

        sceneList[5].SetDiffuseEx(0.75, 0.75, 0.75);
        sceneList[5].SetEmissionEx(0,0,0);
        sceneList[5].SetNormalEx(0, 0, -1);
        sceneList[5].SetDistance(30.0);

        //
        // Object 6: Sphere 0
        //

        sceneList[6].SetSolidAngle(0.0);
        sceneList[6].SetDiffuseEx(1, 1, 0);
        sceneList[6].SetEmissionEx(0, 0, 0);
        sceneList[6].SetOriginEx(-20, -35, -70);
        sceneList[6].SetRadius(15.0);

        //
        // Object 7: Sphere 1
        //

        sceneList[7].SetDiffuseEx(1, 1, 1);
        sceneList[7].SetEmissionEx(0, 0, 0);
        sceneList[7].SetOriginEx(20, -35, -80);
        sceneList[7].SetRadius(15.0);

        Frame.Initialize();

        Graphics.Clear(0.0, 0.0, 0.0, 1.0);

        Debugger.Printf("Game System Initialized...");
    }

    this.Deinitialize = function () 
    {
        sceneList = [];

        Frame.Deinitialize();
    }

    this.Update = function () 
    {
    }

    this.Render = function () 
    {
        if ( TraceMode ) RayTraceScene(sceneList, Frame);
        else             PathTraceScene( sceneList, Frame );
    }

    this.ToggleTraceMode = function ()
    {
        TraceMode = !TraceMode;

        Frame.Deinitialize();

        k = 0;

        Graphics.Clear(0.0, 0.0, 0.0, 1.0);
    }

    this.SetMipLevel = function (newLevel) 
    {
        Frame.Deinitialize();
        Frame.SetMipLevel(newLevel);
        k = 0;
        Graphics.Clear(0, 0, 0, 1);
    }
}

var Game = new CVGameSystem;