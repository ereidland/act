var Events = new function()
{
    var _callbackList = {};

    function ConvertKey(key)
    {
        if (_.isString(key))
            return key.toLowerCase();

        return null;
    }

    this.Listen = function(key, callback)
    {
        if (!_.isFunction(callback))
            return;

        key = ConvertKey(key);
        if (_.isNull(key))
            return;

        var list = _callbackList[key];
        if (!_.isObject(list))
        {
            list = [];
            _callbackList[key] = list;
        }

        list[list.length] = callback;
    };

    this.Remove = function(key, callback)
    {
        key = ConvertKey(key);
        if (_.isNull(key))
            return;

        var list = _callbackList[key];

        if (_.isObject(list))
        {
            list = _.without(list, [callback]);
            _callbackList[key] = list;
        }
    };

    this.Post = function(key, arg)
    {
        key = ConvertKey(key);
        if (_.isNull(key))
            return;

        var list = _callbackList[key];
        if (_.isObject(list))
        {
            _.each(list, function(callback)
            {
                try
                {
                    callback(arg);
                }
                catch (e) { console.log(e); }
            });
        }
    };
};