/*
 * OSC Form Message (Semantic UI Message JS)
 * with jQuery + Semantic UI
 *
 * 2018-01-19
 */
(function ($) {
    var defaultConf = {
        type: 'info',     // 对应 Semantic UI Message 的 className，如 info, warning, positive(success), negative(error)
        header: '',       // 头部
        content: '',      // 内容
        closeable: false, // 是否显示关闭按钮
        disappear: 0      // 消失时间(ms)
    };

    // 显示信息
    var message = function (opts) {
        if (typeof opts === 'string') {
            if ($.isFunction(messageActions[opts])) {
                messageActions[opts].call(this);
            }
            return;
        }

        if (typeof opts === 'object') {
            var option = $.extend({}, defaultConf, opts);
            var wrapperEl = $(this);

            var className = option.type.length > 0 ? '.' + option.type : '';
            var msgEl = wrapperEl.find('.ui.message.osc' + className);

            var html = '';
            // 关闭按钮
            if (option.closeable) {
                html += '<i class="close icon"></i>';
                // 绑定点击事件
                msgEl.on('click', '.close', function () {
                    msgEl.transition('fade');
                });
            }
            // 头部
            if (option.header.length > 0) {
                html += '<div class="header">' + option.header + '</div>';
            }
            // 内容
            if (option.content.length > 0) {
                html += '<p>' + option.content + '</p>';
            }
            msgEl.html(html);
            msgEl.removeClass('hidden');
            // 消失时间
            if (option.disappear > 0) {
                setTimeout(function () {
                    msgEl.addClass('hidden');
                }, option.disappear);
            }
            return;
        }

        console.error('Error: OSC Message opts is error');
    };

    // 操作方法
    var messageActions = {
        // 隐藏所有 message
        hideAll: function () {
            $(this).find('.ui.message.osc').addClass('hidden');
        }
    };

    $.fn.message = message;

}(window.jQuery || window.$));