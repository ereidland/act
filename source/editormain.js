
var IDGenerator = new function()
{
    var _id = 0;

    this.NewID = function()
    {
        return ++_id;
    };
};

function NodeElement(div, x, y, id)
{
    var _id;
    var _div = div;
    var rounding = 10;
    var self = this;

    if (_.isUndefined(id))
        _id = IDGenerator.NewID();
    else
        _id = id;

    _div.draggable({ snapmode: "outer", snap: true});
    _div.addClass("node");
    _div.css({ left: x, top: y});

    this.GetID = function() { return _id; };
    this.SetText = function(text) { _div.text(text); };
    this.SnapPosition = function()
    {
        var position = _div.position();
        position.left *= rounding;
        position.top *= rounding;

        position.left = Math.round(position.left);
        position.top = Math.round(position.top);

        position.left /= rounding;
        position.top /= rounding;

        _div.css({ left: position.left + "px", top: position.top + "px" });
    };
}

var EditorUtil = new function()
{
    var self = this;
    var _editorDiv;

    var _mouse = { x: 0, y: 0 };

    $(function()
    {
        _editorDiv = $("#editor");

        self.NewNode("Testing");
        $("body").mousemove(function(e)
        {
            _mouse.x = e.pageX;
            _mouse.y = e.pageY;
        });
    });

    this.GetMouse = function()
    {
        return { x: _mouse.x, y: _mouse.y };
    };

    this.NewNode = function(text)
    {
        var nodeDiv = $("<div>");
        _editorDiv.append(nodeDiv);
        nodeDiv.append(text);
        var node = new NodeElement(nodeDiv, 100, 200);
    };
};

$(function()
{

});