var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.prototype.merge = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var assign = Object.assign || function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return assign.apply(this, args);
    };
    return Tools;
}());
var tools = new Tools();
console.log(tools.merge({ name: '123' }, { age: 18 }, { sex: 'nan' }));
