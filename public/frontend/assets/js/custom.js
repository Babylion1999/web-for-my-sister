$(document).ready(function(){
    $('#banner2').owlCarousel({
        loop:true,
        margin:50,
        
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true,
            },
            1000:{
                items:2,
                
                loop:false,
            }
        }
            
    });
    $('#banner3').owlCarousel({
        loop:true,
        margin:50,
        loop:true,
        responsiveClass:true,
        autoplay: true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true,
                
            },
            1000:{
                items:1,
                
                loop:true,
            }
        }
            
    });


})