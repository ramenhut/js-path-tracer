
const GE_INPUT_MOUSE_LEFTBUTTON     = 0x1;
const GE_INPUT_MOUSE_MIDDLEBUTTON   = 0x2;
const GE_INPUT_MOUSE_RIGHTBUTTON    = 0x4;

const GE_INPUT_MOUSEMODE_DEFAULT    = 0;
const GE_INPUT_MOUSEMODE_CLAMP      = 1;

function KeyState() 
{
    var keyCode = 0;
    var keyAscii = 0;
    var keyDown = 0;
}

function MouseState() 
{
    var mouseX = 0;
    var mouseY = 0;
    var buttons = 0;
}

function CVInputSystem() 
{
    //
    // @public variables
    //

    var GE_INPUT_MAX_KEYS       = 103;

    //
    // @private variables
    //

    var m_KeyboardState         = [];
    var m_MouseState            = new MouseState();
    var m_MouseMode             = GE_INPUT_MOUSEMODE_DEFAULT;   

    //
    // @public interfaces
    //
    
    this.Initialize = function ()
    {
        this.ShowCursor( true );
    
        //
        // Key-down Messages
        //
    
        if ( document.addEventListener ) // for FireFox
        {
            document.addEventListener('keydown', this.keydown_isr, true); 
        }
        else if ( document.attachEvent ) // for IE
        {
            document.attachEvent('onkeydown', this.keydown_isr);
        }
    
        //
        // Key-up Messages
        //
    
        if ( document.addEventListener ) // for FireFox
        {
            document.addEventListener('keyup', this.keyup_isr, true); 
        }
        else if ( document.attachEvent ) // for IE
        {
            document.attachEvent('onkeyup', this.keyup_isr );
        }
    
        for ( var i = 0; i < GE_INPUT_MAX_KEYS; i++ )
        {
            m_KeyboardState[i] = new KeyState();
        
            m_KeyboardState[i].keyCode = i;
            m_KeyboardState[i].keyAscii = i;
            m_KeyboardState[i].keyDown = false;
        }
    
        //
        // Mouse Events
        //
    
        if ( document.addEventListener ) // for FireFox
        {
            document.addEventListener('mousemove', this.mousemove_isr, true); 
        }
        else if ( document.attachEvent ) // for IE
        {
            document.attachEvent('mousemove', this.mousemove_isr );
        }
    
        if ( document.addEventListener ) // for FireFox
        {
            document.addEventListener('mousedown', this.mousedown_isr, true); 
        }
        else if ( document.attachEvent ) // for IE
        {
            document.attachEvent('mousedown', this.mousedown_isr );
        }
    
        if ( document.addEventListener ) // for FireFox
        {
            document.addEventListener('mouseup', this.mouseup_isr, true); 
        }
        else if ( document.attachEvent ) // for IE
        {
            document.attachEvent('mouseup', this.mouseup_isr );
        }
    
        //
        // Initial values
        //
    
        m_MouseState.mouseX = 0;
        m_MouseState.mouseY = 0;
        m_MouseState.buttons = 0;
    }

    this.Deinitialize = function ()
    {
    }

    this.ShowCursor = function ( show )
    {
        /*
        if ( show )
        {
            g_RenderCanvas.setAttribute( "style", "cursor: crosshair;" );
        }
        else
        {
            g_RenderCanvas.setAttribute( "style", "cursor: none;" );
        }
        */
    }

    this.GetMouseMode = function ()
    {
        return m_MouseMode;
    }

    this.SetMouseMode = function ( mode )
    {
        m_MouseMode = mode;
    }

    //
    // Interrupt Service Routines
    //

    this.keydown_isr = function ( ev )
    {
        ev = ev || window.event; // for IE
    
        m_KeyboardState[ ev.keyCode ].keyDown = true;
    }

    this.keyup_isr = function ( ev )
    {
        ev = ev || window.event; // for IE
    
        m_KeyboardState[ ev.keyCode ].keyDown = false;
    }

    this.mousemove_isr = function ( ev )
    {
        ev = ev || window.event; // for IE
    
        m_MouseState.mouseX = ev.clientX;
        m_MouseState.mouseY = ev.clientY;
    
        if ( m_MouseState.mouseX == null ) m_MouseState.mouseX = 0;
        if ( m_MouseState.mouseY == null ) m_MouseState.mouseY = 0;
    
        //
        // Now convert the coordinate into local canvas space
        //
    
        // m_MouseState.mouseX -= g_RenderCanvas.offsetLeft;
        // m_MouseState.mouseY -= g_RenderCanvas.offsetTop;
    
        if ( m_MouseMode == GE_INPUT_MOUSEMODE_CLAMP )
        {
            if ( m_MouseState.mouseX < 0 ) m_MouseState.mouseX = 0;
            if ( m_MouseState.mouseX >= Graphics.GetFrameWidth() ) 
            {
                m_MouseState.mouseX = Graphics.GetFrameWidth() - 1;
            }

            if ( m_MouseState.mouseY < 0 ) m_MouseState.mouseY = 0;
            if ( m_MouseState.mouseY >= Graphics.GetFrameHeight() ) 
            {
                m_MouseState.mouseY = Graphics.GetFrameHeight() - 1;
            }
        }
    }

    this.mousedown_isr = function ( ev )
    {
        ev = ev || window.event; // for IE
    
        if ( ev.which == null ) // for IE
        {
            if ( ev.button == 1 ) m_MouseState.buttons |= GE_INPUT_MOUSE_LEFTBUTTON;
            if ( ev.button == 4 ) m_MouseState.buttons |= GE_INPUT_MOUSE_MIDDLEBUTTON;
            if ( ev.button == 2 ) m_MouseState.buttons |= GE_INPUT_MOUSE_RIGHTBUTTON; 
        }
        else // everything else
        {
            if ( ev.which == 1 ) m_MouseState.buttons |= GE_INPUT_MOUSE_LEFTBUTTON;
            if ( ev.which == 2 ) m_MouseState.buttons |= GE_INPUT_MOUSE_MIDDLEBUTTON;
            if ( ev.which == 3 ) m_MouseState.buttons |= GE_INPUT_MOUSE_RIGHTBUTTON;
        }
    }

    this.mouseup_isr = function ( ev )
    {
        ev = ev || window.event; // for IE
    
        if ( ev.which == null ) // for IE
        {
            if ( ev.button == 1 ) m_MouseState.buttons &= ~GE_INPUT_MOUSE_LEFTBUTTON;
            if ( ev.button == 4 ) m_MouseState.buttons &= ~GE_INPUT_MOUSE_MIDDLEBUTTON;
            if ( ev.button == 2 ) m_MouseState.buttons &= ~GE_INPUT_MOUSE_RIGHTBUTTON; 
        }
        else // everything else
        {
            if ( ev.which == 1 ) m_MouseState.buttons &= ~GE_INPUT_MOUSE_LEFTBUTTON;
            if ( ev.which == 2 ) m_MouseState.buttons &= ~GE_INPUT_MOUSE_MIDDLEBUTTON;
            if ( ev.which == 3 ) m_MouseState.buttons &= ~GE_INPUT_MOUSE_RIGHTBUTTON;
        }
    }

    //
    // External interfaces
    //

    this.GetKeyState = function ( key_index )
    {
        return m_KeyboardState[ key_index ].keyDown;
    }

    this.SetKeyState = function( key_index, key_state )
    {
        m_KeyboardState[ key_index ].keyDown = key_state;
    }

    this.GetKeyCode = function ( key_index )
    {
        return m_KeyboardState[ key_index ].keyCode;
    }

    this.GetMouseState = function ()
    {
        return m_MouseState;
    }
}

var Input = new CVInputSystem;