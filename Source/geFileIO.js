
function CVFileSystem() 
{
    //
    // @private variables
    //

    var m_oRequestObj;

    //
    // @public interfaces
    //

    this.Initialize = function () 
    {
        m_oRequestObj = new XMLHttpRequest();
    }

    this.Deinitialize = function () 
    {
    }

    this.LoadFile = function (url)
    {
        m_oRequestObj.open("GET", url, false);
        m_oRequestObj.send(null);

        return m_oRequestObj.responseText; 
    }
}

var File = new CVFileSystem;

