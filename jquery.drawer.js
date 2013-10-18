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
        position: 'right',
        status: 'open',
        adjustMargins: true,
        hoverIntent: {enabled: false}
      };
      $.extend(this.s, defaults, s);

      // Create the elements
      this.constructDrawer();

      // Position the drawer
      this.setDrawerPosition(this.s.position, this.s.status, true);

      // Bind listeners
      this.listenHover();
      this.listenClick();
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
     * Set the CSS attributes for the current drawer position.
     */
    setDrawerPosition: function(newPos, newStatus, force) {
      var change = false;
      force = force || false;

      // If the status is changing
      if (typeof newStatus != 'undefined') {
        this.s.status = newStatus;
        change = true;
      }

      // If the position is changing
      if (this.s.position != newPos || force) {
        this.s.position = newPos;

        // Reset classes and hard positioning
        this.removeClass('top right left bottom');
        this.addClass(this.s.position);
        this.css({'left':'', 'right':'', 'top':'', 'bottom':''});

        // Get dimentions
        this.getDimentions();

        switch (this.s.position) {
          case 'top':
            this.handle.width('auto');
            this.append(this.handle);
            break;
          case 'right':
            this.handle.width(this.dims.h);
            this.prepend(this.handle);
            break;
          case 'bottom':
            this.handle.width('auto');
            this.prepend(this.handle);
            break;
          case 'left':
            this.handle.width(this.dims.h);
            this.prepend(this.handle);
            break;
        }

        // Adjust magins if necessary
        this.adjustMargins();

        change = true;
      }

      // If either setting changed, check the open/close status
      if (change) {
        // Set the open/closed state
        if (this.s.status == 'open') {
          this.open(0);
        }
        else {
          this.close(0);
        }
      }
    },

    /**
     * Store the dimentions of the drawer for positioning.
     */
    getDimentions: function() {
      this.dims.w = this.stuff.outerWidth();
      this.dims.h = this.stuff.outerHeight();
    },

    /**
     * Adjust the margins for certain positions.
     */
    adjustMargins: function() {
      if (!this.s.adjustMargins) {
        return;
      }

      switch (this.s.position) {
        case 'top':
          $('body').css('margin-top', this.handle.outerHeight());
          break;
        case 'right':
          $('body').css('margin-top', '');
          $('body').css('margin-bottom', '');
          break;
        case 'bottom':
          $('body').css('margin-bottom', this.handle.outerHeight());
          break;
        case 'left':
          $('body').css('margin-top', '');
          $('body').css('margin-bottom', '');
          break;
      }
    },

    /**
     * Open the drawer.
     */
    open: function(speed) {
      speed = typeof speed == 'undefined' ? this.s.speed : speed;

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

      // Recalculate the dimentions.
      this.getDimentions();

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
    // Make sure we have an object for settings
    s = typeof s != 'object' ? {} : s;
    $.extend(true, this, new Drawer);
    this.drawer(s);
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
