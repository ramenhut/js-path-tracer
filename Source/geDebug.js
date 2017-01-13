
function CVDebugSystem() 
{
    //
    // @private variables
    //

    var m_oDebugWindow;

    //
    // @public interfaces
    //

    this.Initialize = function () 
    {
        m_oDebugWindow = document.createElement("textarea");

        m_oDebugWindow.id = "debugWindow";
        m_oDebugWindow.rows = 6;
        m_oDebugWindow.cols = 77;
        m_oDebugWindow.setAttribute("readOnly", "readOnly");
        m_oDebugWindow.setAttribute("disabled", "disabled");

        document.getElementById('debugWindow').appendChild(m_oDebugWindow);

        this.Clear();
        this.Printf("Debug subsystem initialized.");
    }

    this.Printf = function (msg) 
    {
        m_oDebugWindow.value = m_oDebugWindow.value + "\n" + " " + msg;
        m_oDebugWindow.scrollTop = m_oDebugWindow.scrollHeight;       // auto scroll
    }

    this.Clear = function () 
    {
        m_oDebugWindow.value = "";
    }
}

var Debugger = new CVDebugSystem;