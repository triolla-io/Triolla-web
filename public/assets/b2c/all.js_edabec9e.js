jQuery(document).ready(function($) {
	$(window).on('scroll',function(){		
		//$("body").toggleClass("sticky", $(document).scrollTop() >=$('.header').outerHeight());		
		$("body").toggleClass("sticky", $(document).scrollTop() >=10);		
	});
	
	$(window).on('load', function () { setTimeout(function () { jQuery('body').addClass('loaded') }, 800); });
    //bindScroll();
	
	
	$(".postfolio_banner_but a, .global_but a, .partners_with_but a").on("click", function(e) {
  const target = $(this.hash);
  
  if (target.length) {
    e.preventDefault();
    $("html, body").animate({
      scrollTop: target.offset().top - $(".header").outerHeight()
    }, 1000, "swing");
  }
});

	
	jQuery(".menutoggle a").on("click", function () {
		$('body').toggleClass('mbodyact');
	});
	jQuery(".hmenumobclose a").on("click", function () {
		$('body').removeClass('mbodyact');
	});
	
	$('.footer_menu_col:first-child').addClass('active');
	$('.footer_menu_col:first-child h3 + div').slideDown(350);
	
	$('.footer_menu_col h3').click(function() {
		if($(this).parent().hasClass('active')) {
			//$('.acctitle').removeClass('active');
			//$('.accordcont').slideUp(350);
			$(this).parent().removeClass('active');
			$(this).next().slideUp(350);
		}else {
			$('.footer_menu_col h3').parent().removeClass('active');
			$('.footer_menu_col h3 + div').slideUp(350);
			$(this).parent().addClass('active');
			$(this).next().slideDown(350);
		}
	});
	$('.footer_socail h3').click(function() {
		$(this).parent().toggleClass('active');
		$(this).next().slideToggle(350);
	});	
	$('.footer_contact h3').click(function() {
		$(this).parent().toggleClass('active');
		$(this).next().slideToggle(350);
	});	
	
	$('.blogfield input, .arfield input').focus(function(){
		$(this).parent().parent().parent().addClass('activefact')
	});
	$('.blogfield input, .arfield input').blur(function(){
		if($(this).val()=='')
		$(this).parent().parent().parent().removeClass('activefact')
	});
	
	$('.blogfieldsub a').click(function() {
		$('.blogfieldsub input').trigger('click');		
	});
	$('.arfsub a').click(function() {
		$('.arfsub input').trigger('click');		
	});
	
	$('.ban_toggle_down').click(function() {
		$(this).addClass('active');
		$('.dotshave').addClass('active');
		$('.more_ban_txt').slideDown(350);
	});
	$('.ban_toggle_up').click(function() {		
		$('.more_ban_txt').slideUp(350);
		$('.ban_toggle_down').removeClass('active');
		$('.dotshave').removeClass('active');
	});    
	
	
	
	/*----Common-grid---*/
	const imgs = gsap.utils.toArray('.grid__item-img img')
	
	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}
	imgs.forEach(img => {
		const speed = img.dataset.speed
		gsap.to(img, {
			yPercent: speed * 20,
			ease: 'none',
			scrollTrigger: {
				trigger: img,
				start: 'top bottom',
				scrub: true
			}
		})
	})

	// smooth scroll
	// const lenis = new Lenis()
	function raf(time) {
	// lenis.raf(time)
	requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);
	

	  /********Banner Text*******/
	   $(window).scroll(function(){
            var top = jQuery(this).scrollTop();
			
            var elementWeb  = jQuery('.portfolio_text').first();
            if( elementWeb.length == 0){

                return;
            }
            var ractWeb = elementWeb[0].getBoundingClientRect();
            var animationOffsetWeb = ractWeb.top - top;
            var animationWebRevers = animationOffsetWeb*-1;

            if ($('.portfolio_text').visible(true)) {
                $('.portfolio_text').css({'top':animationOffsetWeb/8+'px'});

            } 
			
			
			
			/********Portfolio Image*******/
			/*var elementWeb_port  = jQuery('.port_gridimage_sec_inner');
		
			if( elementWeb_port.length == 0){
		
				return;
			}
			var ractWeb_port = elementWeb_port[0].getBoundingClientRect();
			var animationOffsetWeb_port = ractWeb_port.top - top;
			var animationWebRevers_port = animationOffsetWeb_port*-1;
		
			if ($('.port_gridimage_sec_inner').visible(true)) {
				$('.newfilcom img').css({'top':animationOffsetWeb_port/6+'px'});
			} else {
		
			}
			
			if ($('.port_gridimage_sec_inner').visible(true)) {
				$('.port_gridimage_sec_inner').addClass('show')
			}*/
		
		
	
	});	
	
	$(window).scroll(function(){
		var top = jQuery(this).scrollTop();
		if ($('.footmobdiv').visible(true)) {	
			$('.footmobdiv').addClass('show');
		}
		if ($('.footer_top').visible(true)) {	
			$('.footer_top').addClass('show');
		}
		if ($('.footer_menu_wrap').visible(true)) {	
			$('.footer_menu_wrap').addClass('show');
		}
		if ($('.footmoblogos').visible(true)) {	
			$('.footmoblogos').addClass('show');
		}
		if ($('.footer_bottom').visible(true)) {	
			$('.footer_bottom').addClass('show');
		}
		if ($('.footer_bot_socail').visible(true)) {	
			$('.footer_bot_socail').addClass('show');
		}
		if ($('.blogmidbotwrap').visible(true)) {	
			$('.blogmidbotwrap').addClass('show');
		}
		if ($('.global_con').visible(true)) {	
			$('.global_con').addClass('show');
		}
		if ($('.portfolio_faq_wrap').visible(true)) {	
			$('.portfolio_faq_wrap').addClass('show');
		}
		
	});
	 
});



jQuery(window).on('load', function(){
	new WOW().init();	
	$('.portfolio_text').addClass('show')
	$('.post_featureimg').addClass('show')
	$('.errorpage').addClass('show')
	
});

/*--equal height---*/
	
equalheight = function(container)
{	
	var currentTallest = 0,
	currentRowStart = 0,
	rowDivs = new Array(),
	$el,
	topPosition = 0;
	jQuery(container).each(function() {
	
	$el = jQuery(this);
	jQuery($el).height('auto')
	topPostion = $el.position().top;
	
	if (currentRowStart != topPostion) {
	for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
	//rowDivs[currentDiv].height(currentTallest);
	rowDivs[currentDiv].css('height',currentTallest);
	}
	rowDivs.length = 0; // empty the array
	currentRowStart = topPostion;
	currentTallest = $el.height();
	rowDivs.push($el);
	} else {
	rowDivs.push($el);
	currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
	}
	for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
	// rowDivs[currentDiv].height(currentTallest);
	rowDivs[currentDiv].css('height',currentTallest);
	}
	});
} 

/*Deskto Menu*/


document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0;

  const navLinkWrap = document.querySelector(".header_menu");
  const navHeader = document.querySelector(".header");
  const headerWhatsapp = document.querySelector(".header_whatsapp");
  const headerBook = document.querySelector(".header_book");

  if (!navLinkWrap || !navHeader || !headerWhatsapp || !headerBook) return;

  const transition = "0.7s ease";
  const screenWidth = window.innerWidth;

  if (screenWidth > 1200) {
    // Save original widths
    const originalNavLinkWidth = navLinkWrap.offsetWidth + "px";
    const originalWhatsappWidth = headerWhatsapp.offsetWidth + "px";
    const originalBookWidth = headerBook.offsetWidth + "px";

    // Set initial styles for smoother transition
    [navLinkWrap, headerWhatsapp, headerBook].forEach(el => {
      el.style.transition = `transform ${transition}, width ${transition}, opacity ${transition}`;
      el.style.transform = "scale(1)";
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
      el.style.width = el.offsetWidth + "px"; // Prevent collapse
    });

    navHeader.style.transition = `width ${transition}`;
    navHeader.style.width = "1009px";

    // Delay scroll listener slightly to avoid initial jump
    setTimeout(() => {
      window.addEventListener("scroll", function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
          // Scroll Down - Hide elements
          [navLinkWrap, headerWhatsapp, headerBook].forEach(el => {
            el.style.transform = "scale(0.6)";
            el.style.width = "0px";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          });

          navHeader.style.width = "550px";
        } else {
          // Scroll Up - Show elements again
          navLinkWrap.style.width = originalNavLinkWidth;
          headerWhatsapp.style.width = originalWhatsappWidth;
          headerBook.style.width = originalBookWidth;

          [navLinkWrap, headerWhatsapp, headerBook].forEach(el => {
            el.style.transform = "scale(1)";
            el.style.opacity = "1";
            el.style.pointerEvents = "auto";
          });

          navHeader.style.width = "1009px";
        }

        lastScrollTop = Math.max(0, scrollTop);
      });
    }, 300);
  }
});



jQuery(document).ready(function ($) {
  function bindMenuHover() {
    if (window.innerWidth >= 1023) {
      $('.header_menu .menu-item-has-children').off('.hoverMenu'); // Remove existing handlers

      $('.header_menu .menu-item-has-children').on('mouseenter.hoverMenu', function () {
        $(this).addClass('active');
      }).on('mouseleave.hoverMenu', function () {
        $(this).removeClass('active');
      });
    } else {
      // Remove hover listeners on smaller screens
      $('.header_menu .menu-item-has-children').off('.hoverMenu');
      $('.header_menu .menu-item-has-children').removeClass('active');
    }
  }

  // Initial bind
  bindMenuHover();

  // Rebind on resize
  $(window).on('resize', function () {
    bindMenuHover();
  });
});

/*End Desktop Menu*/


///////////////split by separator | /////////////////////
 jQuery(document).ready(function($) {

$.fn.chunkify = function( options ) {

		$.fn.chunkify.settings = {
        	//separator: /\s/,
			separator: /\|/,
        	wrapper: 'span',
        	klass: 'chunk'
        };
        
        options = $.extend( $.fn.chunkify.settings, options );

		return this.each(function() {
			
			var $element = $( this );
		    var num = 0;
		    var text = $element.text();
		    
		    
		    var parts = text.split( options.separator );
		    var html = "";
		    
		    for( var i = 0; i < parts.length; ++i ) {
		    
		        num++;
		        
		        var part = parts[i];
		        
		        html += "<" + options.wrapper + " class='" + options.klass + num + "'>" + part + "</" + options.wrapper + "> ";
				
		    
		    
		    }
		    
		    $element.html( html );
		
		}); 
	
	
   };
	
});

jQuery(function() {
  jQuery( ".split" ).chunkify();
  
});
////////////////////////SMOOTH SCROLL TO ANCHOR///////////////
jQuery(document).ready(function($){
	jQuery('a.smooth').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    jQuery('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
		
		////////////////Stop Anchor Being Included In URL//////////////
		jQuery('html, body').stop().animate({
     'scrollTop': $target.offset().top
}, 900, 'swing');
});
});
/////////////ADD DIV BEFORE SUBMIT////////
jQuery(document).ready(function($){
	$('.gform_button').wrap('<div class="bg-effect hvr-sweep-to-right"></div>');

});

/////////////////contacr form radio//////////
jQuery(document).ready(function ($) {
	$(".contact_main_right_in .gchoice:first-child").addClass('active');
	
    jQuery(".contact_main_right_in .gchoice").click(function (e) {
		$(".contact_main_right_in .gchoice").removeClass('active');
		$(this).addClass('active');			         
    });
	
	
});