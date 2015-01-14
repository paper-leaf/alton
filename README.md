# README #
**Name:** featured-scroll.js

**Version:** 1.0

**Author:** Paper Leaf

**Author Website:** http://www.paper-leaf.com

**Description:** A full featured scrolling plugin for creating immersive featured sections or headers.

**Copyright 2014 Paper Leaf Design**


## Credit ##
### is_mobile() Credit ###
is_mobile() based off these helpful posts
- http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery
### Scroll Event Stabilization ###
Getting stable scroll events was helped hugely by Huge Inc's insights
- http://www.hugeinc.com/ideas/perspective/scroll-jacking-on-hugeinc
### Keyboard Events Stabilization ###
Stabilizing keypress events was helped in large part by jQuery OnePage Scroll
- https://github.com/peachananr/onepage-scroll

## Use Cases ##
There is a couple of features that this plugin covers.

To start things off here's every option that is available and it's default

```
#!javascript
$(document).scrollJack({
    firstClass : 'header', // classname of the first element in your page content
    fullSlideClass : 'full', // full page elements container for 
    nextElement : 'div', // set the first element in the first page series.
    previousClass : null, // null when starting at the top. Will be updated based on current postion
    lastClass: 'footer', // last block to scroll to
    slideNumbersContainer: 'slide-numbers', // ID of Slide Numbers
    bodyContainer: 'pageWrapper', // ID of content container
    scrollMode: 'featuredScroll', // Choose scroll mode
    useSlideNumbers: false, // Enable or disable slider pagination
    slideNumbersBorderColor: '#fff', // Choose pagination bullets border color
    slideNumbersColor: '#f8f8f8', // Choose pagination bullets fill color
    animationType: 'cubic-bezier(2.63, 2.64, 2, 2)', // Choose animation style
});
```

### Featured Scroll. ###
The Idea behind featured scroll is that you have a header and footer section with a featured area of projects or something in the middle.

Here is an example for all the options available for featuredScroll:

First ensure you have the proper HTML structure:

```
#!html

<header class="header"></header>
<section class="full">
	<div class="slide"></div>
	<div class="slide"></div>
	<div class="slide"></div>
</section>
<footer class="footer"></footer>
```
Next add the following where you want to call it. Note: **If you don't want errors to occur, only run the script on the page where scrolling occurs**
```
#!javascript

$(document).scrollJack({
	fullSlideClass: 'full',
	firstClass: 'header',
	lastClass: 'footer',
	useSlideNumbers: true,
});
```

### Header Scroll ###
The Idea behind header scroll is that you have a featured header area, that on scroll disappears, an you find yourself at the main content, with native scrolling enabled.

Here is an example for all the options available for headerScroll:

First ensure you have the proper HTML structure:

```
#!html

<section class="header">
<!-- Insert Header Content Here -->
</section>
<section class="pageWrapper">
<!-- Insert Regular Content Here -->
</section>
```
Next add the following where you want to call it. Note: **If you don't want errors to occur, only run the script on the page where scrolling occurs**

```
#!javascript

$(document).scrollJack({
    firstClass : 'header', // classname of the first element in your page content
    bodyContainer: 'pageWrapper', // ID of content container
    scrollMode: 'headerScroll', // Choose scroll mode
    animationType: 'cubic-bezier(2.63, 2.64, 2, 2)', // Choose animation style
});
```

## Frequently Asked Questions ##
Does this work on Mobile? No
Are you looking at adding mobile functionality? Possibly.
The Scrolling appears unresponsive at times. What's going on? After every scroll there's a delay in effect to help get rid of Inertia Scroll on Macs. If you try to scroll within this delay it will prevent you from scrolling, until the barrage of mousewheel events has ended.
