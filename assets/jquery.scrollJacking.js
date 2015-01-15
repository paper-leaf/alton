/* ===============================================================================
 * featured-scroll.js v1.0
 * ===============================================================================
 * Copyright 2014 Paper Leaf Design
 * http://www.paper-leaf.com
 * 
 * Author: Paper Leaf
 *
 * A full featured scrolling plugin for creating
 * immersive featured sections or headers.
 *
 * Credit: 
 * is_mobile() based off these helpful posts
 * - http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery
 * 
 * Getting stable scroll events was helped hugely by Huge Inc's insights
 * - http://www.hugeinc.com/ideas/perspective/scroll-jacking-on-hugeinc
 *
 * Stabilizing keypress events was helped in large part by jQuery OnePage Scroll
 * - https://github.com/peachananr/onepage-scroll
 * 
 * License: GPL v3
 * =============================================================================== */

(function ($) {
    /* ===============================================================================
     * Table of Contents
     * -------------------
     * 
     * 1. Default Options
     * 2. Global Variables
     * 3. Initiate Layout
     * 4. Mobile Device Check
     * 5. Click to Navigate
     * 6. Update Position
     * 7. Move Up
     * 8. Move Down
     * 9. Prevent Default Animations
     * 10. Scroll To
     * 11. Featured Scroll
     * 12. Header Scroll
     * 
     * =============================================================================== */

    /* =============================================================================
     * Default Options
     * -------------------
     * Creating defaults in case the user doesn't feel like adding their own
     * ============================================================================= */
    "use strict";
    var defaults = {
            firstClass : 'header', // classname of the first element in your page content
            fullSlideContainer : 'full', // full page elements container for 
            singleSlideClass : 'slide',
            nextElement : 'div', // set the first element in the first page series.
            previousClass : null, // null when starting at the top. Will be updated based on current postion
            lastClass: 'footer', // last block to scroll to
            slideNumbersContainer: 'slide-numbers', // ID of Slide Numbers
            bodyContainer: 'pageWrapper', // ID of content container
            scrollMode: 'featuredScroll', // Choose scroll mode
            useSlideNumbers: false, // Enable or disable slider
            slideNumbersBorderColor: '#fff',
            slideNumbersColor: '#000',
            animationType: 'slow'
        };

    $.fn.scrollJack = function (options) {
        /* =============================================================================
         * User Settings
         * -------------------
         * Update the default settings with user selected options
         * ============================================================================= */
        var settings = $.extend(true, {}, defaults, options),

            /* =============================================================================
             * Global Variables
             * -------------------
             * Setting up variables that will be used throught the plugin
             * ============================================================================= */
            singleSlideClass = settings.singleSlideClass,
            singleSlide = document.getElementsByClassName(singleSlideClass),
            bodyScroll,
            down = false,
            up = false,
            current,
            next = $('.' + singleSlideClass + ':first'),
            previous = null,
            last = $('.' + settings.lastClass),
            projectCount = $('.' + settings.fullSlideContainer).children().length,
            slideNumbers,
            top = true,
            upCount = 0,
            downCount = 0,
            windowHeight = $(window).height(),
            animating = false,
            docElem = window.document.documentElement,
            scrollOffset,
            i;


        if ($('.' + settings.firstClass).length > 0) {
            current = $('.' + settings.firstClass); // current element is the topmost element
        } else {
            previous = null;
            current = next;
            next = current.next();
            last = $('.' + singleSlideClass + ':last');
        }

        /* =============================================================================
         * Position Variables
         * -------------------
         * Update postion variable if headerScroll
         * ============================================================================= */
        if (settings.scrollMode === 'headerScroll') {
            current = $('.' + settings.firstClass), // current element is the topmost element
            next = $('.' + settings.bodyContainer + ':first');
        }

        /* ============================================================================
         * Initiate Layout
         * -------------------
         * Get the slides to 100% height, and add pagination
         * ============================================================================ */
        function initiateLayout(style) {
            if (style === 'featuredScroll') {
                for (i = singleSlide.length - 1; i >= 0; i -= 1) {
                    $(singleSlide[i]).outerHeight(windowHeight);
                }
                if (settings.useSlideNumbers) {
                    // Create Slider Buttons
                    $('.' + settings.bodyContainer).append('<div id="' + settings.slideNumbersContainer + '"></div>');
                    $('#' + settings.slideNumbersContainer).css({
                        'height': '100%',
                        'position': 'fixed',
                        'top': 0,
                        'right': '0px',
                        'bottom': '0px',
                        'width': '86px',
                        'z-index': 999
                    });
                    $('.' + settings.bodyContainer + ' #' + settings.slideNumbersContainer).append('<ul></ul>');
                    $('.' + settings.bodyContainer + ' #' + settings.slideNumbersContainer + ' ul').css({
                        'transform': 'translateY(-50%)',
                        '-moz-transform': 'translateY(-50%)',
                        '-ms-transform': 'translateY(-50%)',
                        '-o-transform': 'translateY(-50%)',
                        '-webkit-transform': 'translateY(-50%)',
                        'top': '50%',
                        'position': 'fixed'
                    });
                    
                    var testCount = 0;

                    while (testCount < projectCount) {
                        $('.' + settings.bodyContainer + ' #' + settings.slideNumbersContainer + ' ul').append('<li class="paginate"></ul>');
                        $('.paginate').css({
                            'cursor':'pointer',
                            'border-radius':'50%',
                            'list-style': 'none',
                            'background': settings.slideNumbersBorderColor,
                            'border':'2px solid' + settings.slideNumbersBorderColor,
                            'height': '10px',
                            'width': '10px',
                            'margin': '5px 0'
                        });
                        testCount += 1;
                    }

                    // Store the slidenumbers
                    slideNumbers =  document.getElementsByClassName('paginate');
                }
            } else {
                $('.'+settings.firstClass).css('height', windowHeight + 10);
                if (!$('.'+settings.firstClass).hasClass('active')) {
                    $('.'+settings.firstClass).toggleClass('active');
                }
            }
        }

        /* ============================================================================
         * Mobile device check
         * -------------------
         * Check if mobile device
         * ============================================================================ */
        function is_mobile() {
            return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
        }

        /* ============================================================================
         * Update pagination
         * -------------------
         * Updates pagination on scroll down or up when called etc.
         * ============================================================================ */
        function slideIndex(element, toggle) {
            if (toggle) {
                if ($(slideNumbers[$(element).parent().children().index(element)]).hasClass('active')) {
                    $(slideNumbers[$(element).parent().children().index(element)]).toggleClass('active');
                    $(slideNumbers[$(element).parent().children().index(element)]).css('background', settings.slideNumbersBorderColor);
                }
            } else {
                if (!$(slideNumbers[$(element).parent().children().index(element)]).hasClass('active')) {
                    $(slideNumbers[$(element).parent().children().index(element)]).toggleClass('active');
                    $(slideNumbers[$(element).parent().children().index(element)]).css('background', settings.slideNumbersColor);
                }
            }
        }

        /* ============================================================================
         * Slide Numbers Fade
         * -------------------
         * Fades out the slide numbers
         * ============================================================================ */
        function slideNumbersFade(fadeInOut) {
            if (settings.useSlideNumbers) {
                if (fadeInOut) {
                    $('#' + settings.slideNumbersContainer).fadeIn();
                } else {
                    $('#' + settings.slideNumbersContainer).fadeOut();
                }
            }
        }

        /* ============================================================================
         * Click to Navigate
         * -------------------
         * Adds click to navigate functionality to pagination
         * ============================================================================ */
        function clickToNavigate(elementIndex) {
            var elementContainer = document.getElementsByClassName(singleSlideClass);
            $(document).scrollTo($(elementContainer[elementIndex]));
            current = elementContainer[elementIndex];
            if ($(current).prev().hasClass(singleSlideClass)) {
                previous = $(current).prev();
            } else {
                previous = $('.' + settings.firstClass);
            }
            if ($(current).next().hasClass(singleSlideClass)) {
                next = $(current).next();
            } else {
                next = $('.' + settings.lastClass);
            }
            
            slideIndex($('#'+settings.slideNumbersContainer+' li.active'), true);
            slideIndex(elementContainer[elementIndex], false);
        }

        /* ============================================================================
         * Update Position
         * -------------------
         * Update current, previous and next, based on window position on load.
         * ============================================================================ */
        function getCurrentPosition() {
            if ($(window).scrollTop() >= next.offset().top && $(window).scrollTop()+$(window).height() !== $(document).height()) {
                var offsetTest;
                $('.' + singleSlideClass).each(function () {
                    offsetTest = $(this).offset().top;
                    if (offsetTest <= $(window).scrollTop()) {
                        if ($(this).prev().hasClass(singleSlideClass)) {
                            previous = $(this).prev();
                        } else {
                            previous = $('.' + settings.firstClass);
                        }
                        current = $(this);
                        if (current.next().hasClass(singleSlideClass)) {
                            next = $(this).next();
                        } else {
                            next = $('.' + settings.lastClass);
                        }
                        top = false;
                    }
                });
                slideIndex(current, false);
            } else {
                slideNumbersFade(false);
                $(document).scrollTo(current);
            }
        }

        /* ============================================================================
         * Prevent Default Animations
         * -------------------
         * Stops default scroll animations when called
         * ============================================================================ */

        function preventDefault(e) {
          e = e || window.event;
          if (e.preventDefault) {
                e.stopPropagation();
                e.returnValue = false;
            }
        }

        function stopDefaultAnimate(event) {
            return preventDefault(event);
        }

        /* ============================================================================
         * Move Down
         * -------------------
         * All the code to move the page down
         * ============================================================================ */
        $.fn.moveDown = function () {
            scrollOffset = scrollY();
            if (scrollOffset >= 0 && (scrollOffset <= $(current).scrollTop()) && top === true) {
                // Check if top of page
                // Update the selectors
                previous = current;
                current = next;
                next = current.next();

                // Set Slide Indexes and Fade Slide Numbers
                if (settings.useSlideNumbers) {
                    slideIndex(current, false);
                    slideNumbersFade(true);
                }

                // Update top variable
                top = false;
                $(document).scrollTo(current); // Scroll to selected element
            } else if (!bodyScroll && next && $(current).offset().top < scrollOffset + 1) {
                // Check if slide
                if (next.hasClass(singleSlideClass)) {
                    // Update the selectors
                    previous = current;
                    current = next;
                    next = $(current).next();
                    // Set Slide Indexes and Fade Slide Numbers
                    if (settings.useSlideNumbers) {
                        slideIndex(previous, true);
                        slideIndex(current, false);
                    }
                    $(document).scrollTo(current); // Scroll to selected element
                } else if (last != $('.' + singleSlideClass + ':last')) {
                    // Update the selectors
                    console.log(last != $('.' + singleSlideClass + ':last'));
                    previous = $('.' + singleSlideClass + ':last');
                    current = last;
                    next = null;
                    if ($(window).scrollTop() + windowHeight + 10  >= $(document).height() - $(last).height()) {
                        // Check for bottom
                        // Set Slide Indexes and Fade Slide Numbers
                        if (settings.useSlideNumbers) {
                            slideIndex(previous, false);
                            slideNumbersFade(false);
                        }
                    }
                    $(document).scrollTo(current); // Scroll to selected element
                }
            }
        };

        /* ============================================================================
         * Move Up
         * -------------------
         * All the code to move the page up
         * ============================================================================ */
        $.fn.moveUp = function () {
            scrollOffset = scrollY();
            if ($('.' + settings.fullSlideContainer).scrollTop() + 1 > scrollOffset && previous && scrollOffset > 0) {
                // Check if not scrolling to top of page
                if ($(current).offset().top >= scrollOffset) {
                    // Update the selectors
                    current = $('.' + settings.firstClass);
                    previous = null;
                    next = $('.' + singleSlideClass);

                    // Update and fade slideNumbers
                    if (settings.useSlideNumbers) {
                        slideNumbersFade(false);
                        slideIndex(next, false);
                    }
                    // Update top variable as we are at the top of the page
                    top = true;
                } else {
                    // Update the selectors
                    current = previous;
                    previous = null;
                    next = $('.' + singleSlideClass);

                    // Update and fade slideNumbers
                    if (settings.useSlideNumbers) {
                        slideIndex(current, true);
                        slideIndex(previous, true);
                    }
                }
                $(document).scrollTo(current); // Scroll to proper element
            } else if (!bodyScroll && $('.' + settings.fullSlideContainer).scrollTop() < scrollOffset) {
                // Update the selectors
                current = previous;
                previous = $(current).prev();
                next = $(current).next();

                // Update and fade slideNumbers
                if (settings.useSlideNumbers) {
                    slideIndex(current, false);
                    slideIndex(next, true);
                    slideNumbersFade(true);
                }

                // Scroll to proper element
                $(document).scrollTo(current);

                // Stop default scrolling
            }

            // Update movement variables
            up = true;
            down = false;

            // Stop default scrolling animations
        };

        /* ============================================================================
         * Scroll To
         * -------------------
         * Scroll to element. This is a public function and can be used in an JS file
         * ============================================================================ */
        $.fn.scrollTo = function (element) {
            if (element !== last) {
                $("body,html").stop(true, true).animate({scrollTop: $(element).offset().top,easing: settings.animationType});
            } else {
                $("body,html").stop(true, true).animate({scrollTop: $(document).height() - windowHeight,easing: settings.animationType});
            }
        };

         /* ============================================================================
         * ScrollY
         * -------------------
         * Replacing default scrollY with IE8 Compat
         * ============================================================================ */
        function scrollY() {
            return window.pageYOffset || docElem.scrollTop;
        }

        /* ============================================================================
         * Featured Scroll
         * -------------------
         * Scroll based on the idea of having a header, a full screen featured projects
         * area, and then a footer after
         * ============================================================================ */
        function featuredScroll(e) {
            bodyScroll = $('body,html').is(':animated') || $('body').is(':animated') || $('html').is(':animated'); // Check if body is currently animated

            if (!bodyScroll) {
                clearTimeout($.data(this, 'scrollTimer'));
                $.data(this, 'scrollTimer', setTimeout(function() {
                    animating = false;
                }, 50));
            }

            if (e.originalEvent.detail/3 >= 1 && !animating || e.originalEvent.wheelDelta / 3 <= -1 && !animating) {
                // Check if scrolling down
                downCount += 1;
                $(document).moveDown();
                animating = true;
            } else if (e.originalEvent.detail / 3 <= -1 && !animating || e.originalEvent.wheelDelta / 3 >= 1 && !animating) {
                // Check if not scrolling up
                upCount += 1;
                $(document).moveUp();
                animating = true;
            }
            return false;
        }

        /* ============================================================================
         * Header Scroll
         * -------------------
         * Scroll jacking for full size header image, then re-enables native scrolling
         * 
         * ============================================================================ */
        function headerScroll(e) {
            scrollOffset = scrollY();
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                if ($(next).offset().top > 0 && scrollOffset < $('.' + settings.firstClass).height()) {
                    if ($('.'+settings.firstClass).hasClass('active')) {
                        $('.'+settings.firstClass).toggleClass('active');
                        $(document).scrollTo(next);
                        previous = current;
                        current = next;
                        return stopDefaultAnimate(e);
                    } else if (!$('html, body').is(':animated')){
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
              if (!$('.'+settings.firstClass).hasClass('active') && $(window).scrollTop() <= $('.'+settings.firstClass).height() ) {
                    $('.'+settings.firstClass).toggleClass('active');
                    $(document).scrollTo(previous);
                    next = current;
                    current = previous;
                } else if (!$('html, body').is(':animated')){
                    return true;
                }
            }
            return false;
        }


        /* ============================================================================
         * Function Calls and Ordering
         * -------------------
         * Calling all the functions on document load to make sure nothing breaks
         * ============================================================================ */
        $(document).ready(function () {
            initiateLayout(settings.scrollMode);
            if (settings.scrollMode === 'featuredScroll') {
                getCurrentPosition();
            }
            if (settings.scrollMode === 'featuredScroll') {
                $('#'+ settings.slideNumbersContainer +' li').on("click", function () {
                    clickToNavigate($(this).parent().children().index(this));
                });

                 // Key Up Key Down etc
                $(document).keydown(function (e) {
                    switch (e.which) {
                    case 40: // arrowUp
                        $(document).moveDown(e);
                        break;
                    case 33: // pageUp 
                        $(document).moveDown(e);
                        break;
                    case 34: // pageDown
                        $(document).moveUp(e);
                        break;
                    case 38: // arrowDown
                        $(document).moveUp(e);
                        break;
                    case 50: // home
                        $(document).scrollTo('.' + settings.firstClass);
                        break;
                    case 49: // end
                        $(document).scrollTo(last);
                        break;
                    }
                });
            }
            if (!is_mobile()) {
                 if (settings.scrollMode === 'featuredScroll') {
                    $(document).on({'DOMMouseScroll mousewheel' : featuredScroll });
                } else if (settings.scrollMode === 'headerScroll') {
                    $(document).on({'DOMMouseScroll mousewheel' : headerScroll });
                }
            }
        });
    };
})(jQuery);