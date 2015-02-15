//TODO: Separate logic from visuals.

var NodeRegistry = new function()
{
    var _id = 0;
    var _nodes = {};

    this.NewID = function()
    {
        return ++_id;
    };

    this.RegisterNode = function(node)
    {
        if (_.isObject(node))
            _nodes[node.GetID()] = node;
    };

    this.RemoveNode = function(node)
    {
        _nodes[node.GetID()] = undefined;
    };

    this.EachNode = function(callback)
    {
        _.each(_nodes, callback);
    };
};

var NodeTypes = new function()
{
    var _types = {};

    this.RegisterType = function(type)
    {
        if (!_.isObject(type))
            return;

        var name = type.GetName();
        _types[name] = type;
    };

    this.GetNodeType = function(name)
    {
        if (!_.isString(name))
            return null;

        var result = _types[name];

        if (!_.isObject(result))
            return null;

        return result;
    };

    this.Each = function(callback)
    {
        _.each(_types, callback);
    };
}

function NodeType(setup)
{
    function GetValue(config, valueName, defaultValue)
    {
        var value = config[valueName];

        if (_.isUndefined(value))
            return defaultValue;

        return value;
    }

    var _name = GetValue(setup, "name", "UNDEFINED");
    var _maxChildren = GetValue(setup, "max_children", 0);
    var _tooltip = GetValue(setup, "tooltip");

    this.GetMaxChildren = function() { return _maxChildren; }
    this.GetName = function() { return _name; }
    this.CanHaveChildren = function() { return _maxChildren != 0; }
    this.GetTooltip = function() { return _tooltip; }
}

function NodeElement(div, type, id)
{
    var self = this;
    var _id;
    var _div = div;
    var _innerDiv;
    var _type = type;
    var _parent;

    if (_.isString(_type))
        _type = NodeTypes.GetNodeType(_type);

    this.GetID = function() { return _id; };
    this.SetText = function(text) { _innerDiv.text(text); };
    this.GetNodeType = function() { return _type; };
    this.GetName = function() { return _type.GetName(); };
    this.GetDiv = function() { return _div; };
    this.GetInnerDiv = function() { return _innerDiv; };
    this.RemoveRemovalButton = function() { removeButton.hide(); };

    function AddButton(text, callback)
    {
        var button = $("<button>");
        button.text(text);
        button.click(callback);
        _div.append(button);
        return button;
    }

    //Initialization.
    if (_.isUndefined(id))
        _id = NodeRegistry.NewID();
    else
        _id = id;

    _div.addClass("node_container");
    _innerDiv = $("<div>");
    _div.append(_innerDiv);
    _innerDiv.text(this.GetName());
    _innerDiv.addClass("node");

    var addButton = AddButton("+", function()
    {
        var newNode = EditorUtil.NewNode(EditorUtil.GetSelectedType());
        var newDiv = newNode.GetDiv();
        newDiv.detach();
        _div.append(newDiv);
    });

    var removeButton = AddButton("-", function()
    {
        _div.remove();
    });

    _div.append("<br>");

    NodeRegistry.RegisterNode(this);
}

var EditorUtil = new function()
{
    var self = this;
    var _editorDiv;

    var _mouse = { x: 0, y: 0 };
    var _nodeMenu = {};

    var _selectionMenu;

    //TODO: Loading nodes from file.
    var _defaultNodes =
    [
        {
            "name": "Sequence",
            "max_children": -1,
            "tooltip": "Runs all children in order. Fail: any child fails. Success: all children succeed.",
        },
        {
            "name": "Repeater",
            "max_children": 1,
            "tooltip": "Repeatedly runs child node each time it returns a result.",
            "input":
            {
                "max_iterations":
                {
                    "tooltip": "Maximum times to run. <= 0 will run infinity times.",
                    "type": "whole",
                },
            }
        },
        {
            "name": "Selector",
            "max_children": -1,
            "tooltip": "Runs all children in order until one succeeds or they all fail. Fail: all children fail. Success: any children succeed.",
        },
        {
            "name": "ParallelSelector",
            "max_children": -1,
            "tooltip": "Runs all children in order each tick. Returns first Success or Fail result.",
        },
        {
            "name": "Inverter",
            "max_children": 1,
            "tooltip": "Inverts child run result. Fail: child success. Success: child fail. Running: child running.",
        },
        {
            "name": "Succeeder",
            "max_children": 1,
            "tooltip": "Runs child until it gets a Success or Fail. Always returns Success.",
        },
        {
            "name": "Leaf",
            "tooltip": "Does nothing. Placeholder.",
        },
    ];

    $(function()
    {
        _editorDiv = $("#editor");
        //self.NewNode("Repeater");
        $("body").mousemove(function(e)
        {
            _mouse.x = e.pageX;
            _mouse.y = e.pageY;
        });

        //Add all nodes.
        _.each(_defaultNodes, function(value)
        {
            NodeTypes.RegisterType(new NodeType(value));
        });

        var selectionDiv = $("<div>");
        _selectionMenu = $("<select>");
        $("#toolbox").append(selectionDiv);
        selectionDiv.append(_selectionMenu);

        NodeTypes.Each(function(value)
        {
            var option = $("<option value=\"" + value.GetName() +"\">");
            option.text(value.GetName());

            _selectionMenu.append(option);
        });

        var rootNode = self.NewNode("Repeater");
        rootNode.RemoveRemovalButton();
    });

    this.GetSelectedOption = function()
    {
        return _selectionMenu.val();
    };

    this.GetSelectedType = function()
    {
        return NodeTypes.GetNodeType(this.GetSelectedOption());
    };

    this.GetMouse = function()
    {
        return { x: _mouse.x, y: _mouse.y };
    };

    this.NewNode = function(type)
    {
        var nodeDiv = $("<div>");
        _editorDiv.append(nodeDiv);
        var node = new NodeElement(nodeDiv, type);

        return node;
    };
};