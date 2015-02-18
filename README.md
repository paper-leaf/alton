# README #

##What is Alton?##
Alton is a jQuery-powered scrolling plugin that utilizes custom vertical scrolling effects in order to present and navigate through web content in a unique manner. It utilizes the whole scrolljacking idea, but greatly improves upon the often-poorly-implemented scrolljacking experiences you might be used to.

## What makes Alton unique? ##
Good question. Here's why Alton rules:

1. The **Bookend** functionality. This allows you to create a bookend experience which allows you to seamlessly introduce your full height section, and summarize or even conclude it. [Here's a demo of Bookend.](#)
2. The **Hero Scroll** functionality. This allows you to scrolljack *only* the "Hero Section", wherein the page will scoll to the top of the section that immediately follows the Hero Section, then re-enable native scrolling for the rest of the page. [Here's a demo of Hero Scroll.](#)
3. The plugin uses **100% height** containers for full-screen presentation; it's great for impactful presentation.
4. You have options for a **couple of different layouts** right out of the box.
5. It's **lightweight, easy to implement,** and **not CPU intensive.**

## What is "ScrollJacking"? ##
Scrolljacking basically means we replace native scrolling (what you're used to) with targeted scrolling: when the user initiates a scroll, either with their mouse or keyboard, scrolljacking takes them to an exact vertical point on the screen (for example, the top of the next content container). When done properly, scrolljacking can be a part of a unique, enjoyable online experience.

## Compatibility ##
This plugin has been tested on IE9+ and with jQuery 1.7+. Anything less and you're on your own – sorry!

## Demos ##

In case you missed the links above, here are a few demos showing the different ways Alton can be used.

[Demo 1 (Standard Implementation)](#)
[Demo 2 (with Bookend functionality)](#)
[Demo 3 (with Hero Scroll functionality)](#)

## Quick start ##
### Bookend Functionality ###
The Idea behind *Bookend* functionality is that you have a header and footer sections ("bookends"), with a featured area of projects or something in the middle. The "featured area of projects" in the middle section are all 100% height, whereas the bookends can be whatever height you'd like them to be. [Here's a demo of Bookend.](#)

Here is an example for all the options available for *Bookend*:

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

### Hero Scroll ###
The Idea behind *Hero Scroll* is that we only apply scrolljacking to the topmost "Hero" container; one scroll movement takes the user to the top of the next section of content and native scrolling is enabled. [Here's a demo of Hero Scroll.](#)

Here is an example for all the options available for *Hero Scroll*:

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
});
```

## What's included ##

## Bugs and feature requests ##

Have a bug or a feature request? Please first read the issue guidelines and search for existing and closed issues. If your problem or idea is not addressed yet, please open a new issue.

### Currently Working On ###
* Custom Animations
* More Customization for slide number indicators (pagination)

## Keep track of our progress. ##

Follow [@paper_leaf](https://twitter.com/paper_leaf) on Twitter.

## Copyright and License ##
*Copyright 2014 Paper Leaf Design*

License: GPL v3

## Frequently Asked Questions ##
#### Does this work on touchscreens? ####
No.
#### Why not? ####
Touch events are a different beast, and considering the amount of people on cheaper, less powerful devices, or even the majority still stuck in contracts, the usability is usually non-existent. That being said, we are continuing to explore ways of implementing this for mobile devices.
#### So you are looking at adding mobile functionality? ####
Possibly!
#### What currently happens on mobile devices, then, if Alton doesn't work? ####
It falls back to regular scrolling on mobile. It's the best of both worlds, like pizza made out of candy.
#### Scrolling appears unresponsive at times. What's going on? ####
After every scroll there's a delay in effect to help get rid of Inertia Scroll on Macs. If you try to scroll within this delay it will prevent you from scrolling, until the barrage of mousewheel events has ended.
#### Why did you name this plugin Alton? ####
We're playing off the idea of height, in that this plugin uses 100% height containers. That led us to the discovery of [Robert Wadlow](http://en.wikipedia.org/wiki/Robert_Wadlow), the world's tallest man – also known as the Alton Giant. *mic drop*
