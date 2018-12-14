(function ($, window, document, undefined) {
    function Paging(element, options) {
        this.element = element;
        this.options = {
            pageNo: options.pageNo || 1,
            totalPage: options.totalPage,
            totalSize: options.totalSize,
            callback: options.callback
        };
        this.init();
    }

    Paging.prototype = {
        constructor: Paging, init: function () {
            this.creatHtml();
            this.bindEvent();
        }, creatHtml: function () {
            var me = this;
            var content = "<div class=\"Pager\"><ul class=\"pager\" style=\"margin-bottom: 0\">";
            var current = me.options.pageNo;
            var total = me.options.totalPage;
            var totalNum = me.options.totalSize;
            content += "<li><a id=\"firstPage\">首页</a><a id='prePage'>上一页</a></li>";

            content += "<li><a id='nextPage'>下一页</a></li>";
            content += "<li><a id=\"lastPage\">尾页</a></li>";
            content += "<span class='totalPages'> 共<span>" + total + "</span>页 </span></ul></div>";

            me.element.html(content);
        }, bindEvent: function () {
            var me = this;
            me.element.off('click', 'a');
            me.element.on('click', 'a', function () {
                var num = $(this).html();
                var id = $(this).attr("id");
                if (id == "prePage") {
                    if (me.options.pageNo == 1) {
                        me.options.pageNo = 1;
                    } else {
                        me.options.pageNo = +me.options.pageNo - 1;
                    }
                } else if (id == "nextPage") {
                    if (me.options.pageNo == me.options.totalPage) {
                        me.options.pageNo = me.options.totalPage
                    } else {
                        me.options.pageNo = +me.options.pageNo + 1;
                    }
                } else if (id == "firstPage") {
                    me.options.pageNo = 1;
                } else if (id == "lastPage") {
                    me.options.pageNo = me.options.totalPage;
                } else {
                    me.options.pageNo = +num;
                }
                me.creatHtml();
                if (me.options.callback) {
                    me.options.callback(me.options.pageNo);
                }
            });
        }
    };
    $.fn.paging = function (options) {
        return new Paging($(this), options);
    }
})(jQuery, window, document);