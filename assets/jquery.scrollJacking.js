/* ===============================================================================
 * featured-scroll.js v1.0
 * ===============================================================================
 * Copyright 2014 Paper Leaf Design
 * http://www.paper-leaf.com
 * 
 * Author: Paper Leaf
 *
 * A full featured scrolling pluding for creating
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

(function ($) {
    /* =============================================================================
     * Default Options
     * -------------------
     * Creating defaults in case the user doesn't feel like adding their own
     * ============================================================================= */
    "use strict";
    var defaults = {
            firstClass : 'header', // classname of the first element in your page content
            fullSlideClass : 'full', // full page elements container for 
            nextElement : 'div', // set the first element in the first page series.
            previousClass : null, // null when starting at the top. Will be updated based on current postion
            lastClass: 'footer', // last block to scroll to
            slideNumbersContainer: 'slide-numbers', // ID of Slide Numbers
            bodyContainer: 'pageWrapper', // ID of content container
            scrollMode: 'featuredScroll' // Choose scroll mode
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
            singleSlideClass = $('.' + settings.fullSlideClass + ' ' + settings.nextElement).attr('class'),
            singleSlide = document.getElementsByClassName(singleSlideClass),
            current = $('.' + settings.firstClass), // current element is the topmost element
            next = $('.' + singleSlideClass + ':first'),
            previous = null,
            last = $('.' + settings.lastClass),
            bodyScroll,
            scrolling,
            down = false,
            up = false,
            projectCount = $('.' + settings.fullSlideClass).children().length,
            slideNumbers,
            timeout,
            top = true,
            upCount = 0,
            downCount = 0,
            windowTop = $(window).scrollTop(),
            windowHeight = $(window).height(),
            i;

        /* ============================================================================
         * Initiate Layout
         * -------------------
         * Get the slides to 100% height, and add pagination
         * ============================================================================ */
        function initiateLayout() {
            for (i = singleSlide.length - 1; i >= 0; i -= 1) {
                $(singleSlide[i]).css('height', windowHeight + 10);
            }

            // Create Slider Buttons
            $('#' + settings.bodyContainer).append('<div id="' + settings.slideNumbersContainer + '"></div>');
            $('#' + settings.bodyContainer + ' #' + settings.slideNumbersContainer).append('<ul></ul>');
            var testCount = 0;

            while (testCount < projectCount) {
                $('#' + settings.bodyContainer + ' #' + settings.slideNumbersContainer + ' ul').append('<li class="paginate" style="cursor:pointer;"></ul>');
                testCount += 1;
            }

            // Store the slidenumbers
            slideNumbers =  document.getElementsByClassName('paginate');
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
                }
            } else {
                if (!$(slideNumbers[$(element).parent().children().index(element)]).hasClass('active')) {
                    $(slideNumbers[$(element).parent().children().index(element)]).toggleClass('active');
                }
            }
        }

        // Slide Numbers Fade
        function slideNumbersFade(fadeInOut) {
            if (fadeInOut) {
                $('#' + settings.slideNumbersContainer).fadeIn();
            } else {
                $('#' + settings.slideNumbersContainer).fadeOut();
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
            $('.paginate').each(function () {
                if ($(this).hasClass('active')) {
                    $(this).toggleClass('active');
                }
            });
            slideIndex(elementContainer[elementIndex], false);
        }

        /* ============================================================================
         * Update Position
         * -------------------
         * Update current, previous and next, based on window position on load.
         * ============================================================================ */
        function getCurrentPosition() {
            if ($(window).scrollTop() >= next.offset().top) {
                $('.' + singleSlideClass).each(function () {
                    var offsetTest = $(this).offset().top;
                    if (offsetTest === $(window).scrollTop() - 28) {
                        if ($(this).prev().hasClass(singleSlideClass)) {
                            previous = $(this).prev();
                        } else {
                            previous = $('.' + settings.firstClass);
                        }
                        current = $(this);
                        if ($(this).next().hasClass(singleSlideClass)) {
                            next = $(this).next();
                        } else {
                            next = $('.' + settings.lastClass);
                        }
                        top = false;
                        slideIndex(current, false);
                    }
                });
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
        function stopDefaultAnimate(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        /* ============================================================================
         * Move Up
         * -------------------
         * All the code to move the page up
         * ============================================================================ */
        $.fn.moveUp = function () {
            if ($(window).scrollTop() >= 0 && ($(window).scrollTop() <= $(current).scrollTop()) && top === true) {
                // Check if top of page
                // Update the selectors
                previous = current;
                current = next;
                next = current.next();
                stopDefaultAnimate(event); // Prevent default animation for scrolls

                // Set Slide Indexes and Fade Slide Numbers
                slideIndex(current, false);
                slideNumbersFade(true);

                // Update top variable
                top = false;
                $(document).scrollTo(current); // Scroll to selected element
            } else if (!bodyScroll && next && $(current).offset().top < $(window).scrollTop() + 1) {
                // Check if slide
                if (next.hasClass(singleSlideClass)) {
                    // Update the selectors
                    previous = current;
                    current = next;
                    next = $(current).next();
                    // Set Slide Indexes and Fade Slide Numbers
                    slideIndex(previous, true);
                    slideIndex(current, false);
                    slideNumbersFade(true);
                    $(document).scrollTo(current); // Scroll to selected element
                } else {
                    // Update the selectors
                    previous = $('.' + singleSlideClass + ':last');
                    current = last;
                    next = null;
                    if ($(window).scrollTop() + windowHeight + 10 >= $(document).height() - $('.ctas').height()) {
                        // Check for bottom
                        // Set Slide Indexes and Fade Slide Numbers
                        slideIndex(previous, false);
                        slideNumbersFade(false);
                    }
                    $(document).scrollTo(current); // Scroll to selected element
                }
            }
        };

        /* ============================================================================
         * Move Down
         * -------------------
         * All the code to move the page down
         * ============================================================================ */
        $.fn.moveDown = function () {
            if ($('.' + settings.fullSlideClass).offset().top + 1 > $(window).scrollTop() && previous && $(window).scrollTop() > 0) {
                // Check if not scrolling to top of page
                if ($(current).offset().top >= $(window).scrollTop()) {
                    // Update the selectors
                    current = $('.' + settings.firstClass);
                    previous = null;
                    next = $('.' + singleSlideClass);

                    // Update and fade slideNumbers
                    slideNumbersFade(false);
                    slideIndex(next, true);
                    // Update top variable as we are at the top of the page
                    top = true;
                } else {
                    // Update the selectors
                    current = previous;
                    previous = null;
                    next = $('.' + singleSlideClass);

                    // Update and fade slideNumbers
                    slideIndex(current, true);
                    slideIndex(previous, true);
                }
                stopDefaultAnimate(event); // Stop default scrolling animations
                $(document).scrollTo(current); // Scroll to proper element
            } else if (!bodyScroll && $('.' + settings.fullSlideClass).offset().top < $(window).scrollTop()) {
                // Update the selectors
                current = previous;
                previous = $(current).prev();
                next = $(current).next();

                // Update and fade slideNumbers
                slideIndex(current, false);
                slideIndex(next, true);
                slideNumbersFade(true);
                // Scroll to proper element
                $(document).scrollTo(current);

                // Stop default scrolling
                stopDefaultAnimate(event);
            }

            // Update movement variables
            up = true;
            down = false;

            // Stop default scrolling animations
            stopDefaultAnimate(event);
        };

        /* ============================================================================
         * Scroll To
         * -------------------
         * Scroll to element. This is a public function and can be used in an JS file
         * ============================================================================ */
        $.fn.scrollTo = function (element) {
            if (element !== last) {
                $("body,html").stop(true, true).animate({scrollTop: $(element).offset().top}, "slow");
            } else {
                $("body,html").stop(true, true).animate({scrollTop: $(document).height() - windowHeight}, "slow");
            }
        };

        /* ============================================================================
         * Featured Scroll
         * -------------------
         * Scroll based on the idea of having a header, a full screen featured projects
         * area, and then a footer after
         * ============================================================================ */
        function featuredScroll(event) {
            bodyScroll = $('body,html').is(':animated'); // Check if body is currently animated
            down = false; // Initiate down movement variable
            up = false; // Initiate up movement variable
            if (event.originalEvent.wheelDelta/3 >= 1 && scrolling !== true || event.originalEvent.wheelDelta/3 <= -1 && scrolling !== true || event.originalEvent.detail/3 >= 1 && scrolling !== true || event.originalEvent.detail/3 <= 1 && scrolling !== true) {
                scrolling = true; // Check scroll down etc.
                clearTimeout(timeout); // Clear any existing timeout interval

                // Enable scrolling after a time period
                timeout = setTimeout(function () {
                    scrolling = false;
                    down = false;
                    up = false;
                    downCount = 0;
                    upCount = 0;
                }, 1500);
                $("html, body").off('DOMMouseScroll', false);
                $("html, body").off('mousewheel', false);
            }

            if (event.originalEvent.detail/3 >= 1 && !down && downCount < 1 || event.originalEvent.wheelDelta / 3 <= -1 && !down && downCount < 1) {
                // Check if scrolling down
                downCount += 1;
                $(document).moveUp();
            } else if (event.originalEvent.detail / 3 <= -1 && !up && upCount < 1 || event.originalEvent.wheelDelta / 3 >= 1 && !up && upCount < 1) {
                // Check if not scrolling up
                upCount += 1;
                $(document).moveDown();
            }
            return false;
        }

        /* ============================================================================
         * Header Scroll
         * -------------------
         * Scroll jacking for full size header image, then re-enables native scrolling
         * 
         * ====== COMING SOON =======
         * ============================================================================ */
        // function headerScroll(event) {
        //   if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
        //     if ($(next).offset().top > 0 && $(window).scrollTop() < $('.'+settings.firstClass).height()){
        //       if ($('.'+settings.firstClass).hasClass('active')) {
        //         $('.'+settings.firstClass).toggleClass('active');
        //         scrollTo(next);
        //         stopDefaultAnimate();
        //         return false;
        //       } else if (!$('html, body').is(':animated')){
        //         return true;
        //       }
        //   }
        //   else {
        //     return true;
        //   }
        // } else {
        //   if (!$('.'+settings.firstClass).hasClass('active') && $(window).scrollTop() <= $('.'+settings.firstClass).height() ) {
        //       $('.'+settings.firstClass).toggleClass('active');
        //       $("html, body").animate({scrollTop: $('.'+settings.firstClass).offset().top}, "slow");
        //     } else if (!$('html, body').is(':animated')){
        //       return true;
        //     }
        //   }
        //   return false;
        // }


        /* ============================================================================
         * Function Calls and Ordering
         * -------------------
         * Calling all the functions on document load to make sure nothing breaks
         * ============================================================================ */
        $(document).ready(function () {
            initiateLayout();
            getCurrentPosition();
            if (settings.scrollMode === 'featuredScroll') {
                $('#slide-numbers li').on("click", function () {
                    clickToNavigate($(this).parent().children().index(this));
                });

                 // Key Up Key Down etc
                $(document).keydown(function (event) {
                    switch (event.which) {
                    case 40: // arrowUp
                        $(document).moveUp();
                        break;
                    case 33: // pageUp 
                        $(document).moveUp();
                        break;
                    case 34: // pageDown
                        $(document).moveDown();
                        break;
                    case 38: // arrowDown
                        $(document).moveDown();
                        break;
                    case 50: // home
                        $(document).scrollTo('.' + settings.firstClass);
                        break;
                    case 49: // end
                        $(document).scrollTo(last);
                        break;
                    }
                });
                if (!is_mobile()) {
                    $(document).on({'DOMMouseScroll mousewheel' : featuredScroll });
                }
            }
        });
    };
})(jQuery);