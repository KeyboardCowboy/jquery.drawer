#jQuery Drawer Plugin
## v1.0-beta1

jQuery plugin to create a dynamic, responsive, multi-device pullout drawer.

## Installation
Add the js and css files to your page.  The css is necessary for positioning.
You will need to add your own styles to make it look pretty.

## Setup
Create an element on your page with another element inside that has the CSS class
of .handle.

**Example**
    <aside id="sidebar">
      <div class="handle">Open/Close</div>
      ... other stuff ...
    </aside>

## Configuration
Use the following JS snippet to initialize the drawer.

    $("aside#sidebar").drawer();

Any of the following settings may be provided via an object like so:

    $("aside#sidebar").drawer({
        speed: 500,
        position: 'right',
        status: 'open',
        adjustMargins: true,
        hoverIntent: {enabled: false}
    });

### speed [int]
Set the length of time it takes for the drawer to open and close in milliseconds.

*default: 500*

### position ['right' | 'left' | 'top' | 'bottom']
Set the side of the screen for the drawer.  It's up to you to choose where it
sits along that plane. (Ex. If on the left, you set where in the left side it
sits, such as centered or near the top or bottom.)

*default: 'right'*

### status ['open' | 'closed']
Choose whether the drawer starts in an open or closed state.

*default: 'open'*

##adjustMargins [true | false]
Whether to adjust the top and bottom margins of the page when the drawer is
positioned to the top or bottom.

*default: true*

###hoverIntent [settings] (Coming Soon)
If you are using the [hoverIntent](http://cherne.net/brian/resources/jquery.hoverIntent.html)
plugin (and I strongly encourage you to), then you can add those settings here
to be applied to the drawer.  Just make sure that plugin is loaded before the
drawer plugin.

Currently only supports on/off.  Not accepting hoverIntent settings yet.

*default: {enabled: false}*

## Responsiveness
You may change the position and default state at any time, such as when the
window resizes, to help with responsive designs by using the following method.

    $(element).setDrawerPosition(position, status)

**Example**
    $(window).resize(function() {
      var w = $(this).width();

      if (w >= 1400) {
        sidebar.setDrawerPosition('right', 'open');
      }
      else if (w < 1400 && w >= 725) {
        sidebar.setDrawerPosition('right', 'closed');
      }
      else if (w < 725) {
        sidebar.setDrawerPosition('bottom', 'closed');
      }
    });
