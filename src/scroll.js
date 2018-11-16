import jQuery from 'jquery';
(function($) {
  $.fn.myScroll = function(options) {
    var defaults = {
      speed: 40,
      rowHeight: 24,
    };

    var opts = $.extend({}, defaults, options),
      intId = [];

    function marquee(obj, step) {
      obj.find('ul').animate(
        {
          marginTop: '0',
        },
        2000,
        function() {
          var s = Math.abs(parseInt($(this).css('marginTop')));
          if ((s = step)) {
            $(this)
              .find('li')
              .slice(0, 1)
              .appendTo($(this));
            $(this).css('marginTop', 0);
          }
        }
      );
    }

    this.each(function(i) {
      var sh = opts.rowHeight,
        speed = opts.speed,
        that = $(this);
      intId[i] = setInterval(function() {
        if (that.find('ul').height() == that.height()) {
          clearInterval(intId[i]);
        } else {
          marquee(that, sh);
        }
      }, speed);

      that.hover(
        function() {
          clearInterval(intId[i]);
        },
        function() {
          intId[i] = setInterval(function() {
            if (that.find('ul').height() == that.height()) {
              clearInterval(intId[i]);
            } else {
              marquee(that, sh);
            }
          }, speed);
        }
      );
    });
  };
})(jQuery);

export default jQuery;
