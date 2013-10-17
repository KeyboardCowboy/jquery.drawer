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
        status: 'open',
        hoverIntent: {enabled: false}
      };
      $.extend(this.s, defaults, s);

      // Create the elements
      this.constructDrawer();

      // Get dimentions
      this.dims.w = this.stuff.outerWidth();
      this.dims.h = this.stuff.outerHeight();

      this.setPosition();

      // Bind listeners
      this.listenHover();
      this.listenClick();
      this.listenResize();
    },

    /**
     * Build the HTML elements
     */
    constructDrawer: function() {
      this.addClass('drawer');
      this.handle = $('.handle', this).clone();
      this.stuff  = $('<div></div>', {'class': 'stuff'});
      $('.handle', this).remove();

      // Put all the stuff in the drawer.
      this.stuff.html(this.html());
      this.html('').append(this.stuff);
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
     * Listen for the window to resize.
     */
    listenResize: function() {
      var self = this;

      $(window).resize(function() {
        self.setPosition();
      });
    },

    /**
     * Set the CSS attributes for the current drawer position.
     */
    setPosition: function() {
      var w = $(window).width();

      // Adjust for breakpoints
      if (typeof this.s.breakpoints != 'undefined') {
        for (i in this.s.breakpoints) {
          if (w < this.s.breakpoints[i].max && w >= this.s.breakpoints[i].min) {
            this.s.position = this.s.breakpoints[i].position;
            this.s.status   = this.s.breakpoints[i].status;

            // Reset hard positioning
            this.css({'left':'', 'right':'', 'top':'', 'bottom':''});
          }
        }
      }

      // Reset classes
      this.removeClass('top right left bottom');
      this.addClass(this.s.position);

      // Set the starting status
      if (this.s.status == 'open') {
        this.open(0);
      }
      else {
        this.close(0);
      }

      // Set the handle position
      if (this.s.position == 'top') {
        this.append(this.handle);
      }
      else {
        this.prepend(this.handle);
      }
    },

    /**
     * Open the drawer.
     */
    open: function(speed) {
      speed = typeof speed == 'undefined' ? this.s.speed : speed;

      console.log(speed);

      switch (this.s.position) {
        case 'top':
          this.animate({top: 0}, speed);
          break;
        case 'right':
          this.animate({right: 0}, speed);
          break;
        case 'bottom':
          this.animate({bottom: 0}, speed);
          break;
        case 'left':
        default:
          this.animate({left: 0}, speed);
          break;
      }
      this.addClass('open').removeClass('closed');
      this.isOpen = true;
    },

    /**
     * Close the drawer.
     */
    close: function(speed) {
      speed = typeof speed == 'undefined' ? this.s.speed : speed;

      switch (this.s.position) {
        case 'top':
          this.animate({top: -(this.dims.h)}, speed);
          break;
        case 'right':
          this.animate({right: -(this.dims.w)}, speed);
          break;
        case 'bottom':
          this.animate({bottom: -(this.dims.h)}, speed);
          break;
        case 'left':
        default:
          this.animate({left: -(this.dims.w)}, speed);
          break;
      }
      this.addClass('closed').removeClass('open');
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
