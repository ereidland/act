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

function Node(type, id)
{
    var _parentID;

}