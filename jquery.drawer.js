(function ($) {
  function Drawer() {};

  /**
   * The window object.
   */
  Drawer.prototype = {
    // Elements
    handle: null,
    stuff:  null,

    // Settings
    s: {},

    // Parameters
    isOpen: true,
    dims: {},

    // Initialize
    drawer: function(s) {
      // Declare the settings
      var defaults = {
        speed: 500,
        handleSelector: '',
        position: 'right',
        hoverIntent: {enabled: false}
      };
      $.extend(this.s, defaults, s);

      console.log(this.s);

      // Create the elements
      this.setCss();
      this.handle = $('.handle', this).clone();
      this.stuff  = $('<div></div>', {'class': 'stuff'});
      $('.handle', this).remove();

      // Put all the stuff in the drawer.
      this.stuff.html(this.html());
      this.html('').append(this.stuff);

      // Add the handle
      this.handle.html(this.s.handleText);
      this.prepend(this.handle);

      // Get dimentions
      this.dims.w = this.stuff.outerWidth();
      this.dims.h = this.stuff.outerHeight();

      // Bind listeners
      this.listenHover();
      this.listenClick();
    },

    /**
     * Set the initial state CSS for the drawer.
     */
    setCss: function() {
      this.addClass('drawer').addClass(this.s.position);
      this.css({
        'position': 'relative'
      });
    },

    /**
     * Listen for a hover event.
     */
    listenHover: function() {
      var drawer = this;

      if (this.s.hoverIntent.enabled) {
        // @todo: add hoverIntent settings
        this.hoverIntent(function() {drawer.open()}, function() {drawer.close()});
      }
      else {
        this.hover(function() {drawer.open()}, function() {drawer.close()});
      }
    },

    /**
     * Listen for a click event on the handle.
     */
    listenClick: function() {
      var drawer = this;

      this.handle.on('click', function() {
        if (drawer.isOpen) {
          drawer.close();
        }
        else {
          drawer.open();
        }
      });
    },

    /**
     * Open the drawer.
     */
    open: function() {
      this.animate({right: '0'}, this.s.speed).addClass('open').removeClass('closed');
      this.isOpen = true;
    },

    /**
     * Close the drawer.
     */
    close: function() {
      this.animate({right: -(this.dims.w)}, this.s.speed).addClass('closed').removeClass('open');
      this.isOpen = false;
    }
  }

  /**
   * Extend the function to elements.
   */
  $.fn.drawer = function(s) {
    var e = $(this);

    // Make sure we have an object for settings
    s = typeof s != 'object' ? {} : s;

    $.extend(true,e, new Drawer);
    e.drawer(s);
  }
})(jQuery);


/*

      // Add open/close animations
      indi.height(sidebar.outerHeight());
      indi.find('span').width(sidebar.height());
      var w = -(sidebar.find('.inner').outerWidth() - indi.outerWidth());
      var open = true;

      sidebar.hoverIntent(function() {
        $(this).animate({right: '0'}, 500);
        open = true;
      }, function() {
        $(this).animate({right: w}, 500);
        open = false;
      });

      // Add a click listener to the jumplist for touch devices
      indi.click(function() {
        if (open) {
          sidebar.animate({right: w}, 500);
          open = false;
        }
        else {
          sidebar.animate({right: 0}, 500);
          open = true;
        }
      });

      var offset = sidebar.position();
      var thresh = 20;
      var start = offset.top - thresh;

      // Keep the list in the viewport
      $(window).scroll(function() {
        var scroll = $(this).scrollTop();

        if (scroll >= start) {
          sidebar.css({'position': 'fixed', 'top': thresh});
        }
        else {
          sidebar.css({'position': 'relative'});
        }
      });
*/
