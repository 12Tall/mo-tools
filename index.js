function getType(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    switch (obj.constructor) {
        case Date:
            return "Date";
        case Array:
            return "Array";
        case Boolean:
            return "Boolean";
        case String:
            return "String";
        case Number:
            return "Number";
        case Function:
            return "Function";
        case HTMLElement:
            return "HTMLElement";
        case Error:
            return "Error";
        default:
            return "object"
    }
}

// 通过参数数量重载
function override(obj, fn_name, new_fn) {
    // 这里是为了判断有些对象没有prorotype 属性，而有些对象的方法必须通过prototype 修改
    var fn = obj.prototype || obj;
    if (["Function", null, undefined].indexOf(getType(fn[fn_name])) > -1) {
        var old_fn = fn[fn_name];
        fn[fn_name] = function () {
            if (new_fn.length === arguments.length) {
                return new_fn.apply(this, arguments);
            } else if (old_fn) {
                return old_fn.apply(this, arguments);
            } else {
                // 如果原本没有该方法则报异常，否则最终会调用函数原本的方法
                throw new Error("couldn't find any implement with " + arguments.length + " parameters!");
            }
        }
    }
}

const format = {
    Date: function () {
        override(Date, "toString", function (format) {
            var date = {
                "y+": this.getFullYear(),
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };

            for (var i in date) {
                if (new RegExp("(" + i + ")").test(format)) {
                    format = format.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1
                            ? date[i]
                            : ("00" + date[i]).substr(-RegExp.$1.length));
                }
            }
            return format;
        });
    }
}

module.exports = {
    getType: getType,
    override: override,
    format: format
}




