$(()=>{


    $('.kingdom').each((i,el)=>$(el).children('.image').height(getComputedStyle(el).height));

    var start;
    var pauseStart;
    var end = false;

    var currentKingdom = 0;
    var $kingdom;
    var kingdomStart;

    $(document).keyup(e=>{
        if(/^(Digit[0-9]|Key[A-Z]|Space|Enter)$/.test(e.code)){
            if(end) return;
            if(pauseStart == null) nextKingdom();
            else resume();
        }
        if(/^(Numpad.+|Escape)$/.test(e.code) && start != null){
            if(pauseStart == null) pause();
            else resume();
        }
    });

    $(window).blur(()=>$('html').css('filter','grayscale(1)'));
    $(window).focus(()=>$('html').css('filter','grayscale(0)'));

    function nextKingdom(){
        if(kingdomStart != null && Date.now() - kingdomStart < 1e3) return;
        if(start == null){
            start = Date.now();
            update();
        }
        currentKingdom++;
        $('.completing').removeClass('completing');
        $('body').css('background-position', `50% ${currentKingdom * 100 / 15}%`);
        if(currentKingdom < 15){

            kingdomStart = Date.now();
            const renderedTime = renderTime(start);
            if(currentKingdom == 2) $kingdom.children('.time').text(renderedTime);
            $kingdom = $(`.kingdom:nth-child(${currentKingdom})`);
            if(currentKingdom > 1) $kingdom.children('.start').text(renderedTime);

            $('body').css('background-color', $kingdom.css('background-color'));
            $kingdom.addClass('completing');
            generateFavicon($kingdom.css('background-color'));

        }else{

            end = true;
            var blink = 0;
            $('#time').css('opacity', 0);
            blinkInterval = setInterval(()=>{
                $('#time').css('opacity', ++blink % 2 == 0 ? 0 : 1);
                if(blink > 6) clearInterval(blinkInterval);
            },500);

            $('body').css('background-color','#f00');;
            generateFavicon('#f00');

        }
    }

    function generateFavicon(color){

        const cappy = new Image();
        cappy.onload = ()=>{

            const canvas = document.createElement('canvas');
            canvas.width=32;
            canvas.height=32;

            const context = canvas.getContext('2d');

            context.beginPath();
            context.arc(16,16,16,0,2*Math.PI,!1);
            context.fillStyle = color;
            context.fill();

            context.drawImage(cappy, 0, 0, 32, 32);
            cappy.remove();

            $('#favicon').attr('href', canvas.toDataURL());
        }
        cappy.src = 'img/cappy.svg';
    }
    generateFavicon('#f00');

    function pause(){
        pauseStart = Date.now();
        $('#pause').addClass('on');
    }

    function resume(){
        start = start + (Date.now() - pauseStart);
        pauseStart = null;
        $('#pause').removeClass('on');
        update();
    }

    function renderTime(start){
        var t = Date.now() - start;
        var h = Math.floor(t / 36e5);
        var m = Math.floor((t % 36e5) / 6e4);
        var s = Math.floor((t % 6e4) / 1e3);
        var n = t;
        return `${('0'+h).slice(-2)}:${('0'+m).slice(-2)}:${('0'+s).slice(-2)}.${('00'+n).slice(-3)}`;
    }

    function update(){
        if(pauseStart != null || end) return;
        $('#time').text(renderTime(start));
        if($kingdom != null) $kingdom.children('.time').text(renderTime(kingdomStart));
        requestAnimationFrame(update);
    }

});