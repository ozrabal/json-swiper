/**
 * swiper gallery
 * copyright Piotr Łepkowski
 * webkowski.pl
 */

var Gallery = Gallery || {};
Gallery = (function(){

    var wrapper = document.getElementById('swiper-wrapper');
    var loader = document.getElementById('loader');
    var _data,
        _manifest,
        _queue,
        _autoplay = 3000;

    var _readJsonData = function( file, callback ){
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        };
        rawFile.send(null);
    };

    var _createGallery = function(data){
        //var data = JSON.parse(jsonData);
        for(var i=0; i < data.length; i++){
            var header = document.createElement('h2');
                header.innerHTML = data[i].title;
            var slide = document.createElement('div');
                slide.className ='swiper-slide';
                slide.appendChild(header);
                wrapper.appendChild(slide);
            var image = {};
            if(data[i].files){
                for(var j=0; j< data[i].files.length; j++){
                    image[i + j] = new Image();
                    image[i + j].src =  data[i].path + data[i].files[j].file;
                    slide =  document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.appendChild(image[i+j]);
                    wrapper.appendChild(slide);
                }
            }
        }
    };

    var _initSwiper = function(){
        _hideLoader();
        var swiper = new Swiper('.swiper-container', {
            //pagination: '.swiper-pagination',
            //nextButton: '.swiper-button-next',
            //prevButton: '.swiper-button-prev',
            //paginationClickable: true,
            keyboardControl: true,
            //preloadImages: true,
            //updateOnImagesReady: true,
            //spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            autoplay: _autoplay,
            autoplayDisableOnInteraction: false
        });
    };

    var _hideLoader = function(){
        window.setTimeout(function(){
            loader.classList.add('hidden');
            document.body.style.overflowY = 'auto';
        },1000);
        loader.classList.add('hiding');
    };

    var _createLoaderManifest = function(data){
        var queue = [];
        for(var i=0; i<data.length; i++) {
            for (var j = 0; j < data[i].files.length; j++) {
                var q = {};
                q.src = data[i].path + data[i].files[j].file;
                q.id = i+j;
                queue.push(q);
            }
        }
        return queue;
    };

    var _onProgress =  function(e){
        loader.innerHTML =  e.progress*100|0 ;
    };

    var _onDataLoad = function(jsonData){
        _data = JSON.parse(jsonData);
        _createGallery(_data);
        _manifest = _createLoaderManifest(_data);
        _queue = new createjs.LoadQueue();
        _queue.loadManifest(_manifest);
        _queue.on('progress', _onProgress);
        _queue.on('complete', _initSwiper);
        //_initSwiper();
    };

    var _onDataStatic = function(jsonData){
        _data = JSON.parse(jsonData);
        _createGallery(_data);
        if(settings.autoplay){
            _autoplay = settings.autoplay;
        }
        _initSwiper();
    };

    var _fullscreen = function() {
        var container = document.getElementById('gallery');
        if (!document.container) {
            if(container.requestFullscreen) {
                container.requestFullscreen();
            }
            if(container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            if(container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    var _uiInit = function(){
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 13) {
                _fullscreen();
            }
        }, false);
        /*document.addEventListener("click", function(e) {
            e.preventDefault();
            _fullscreen();
        }, false);*/
    };

    var init = function(dataFile){
        if(dataFile) {
            _readJsonData(dataFile, _onDataLoad);
        }else{
            _onDataStatic(JSON.stringify(data));
        }
        _uiInit();
    };
    return {
        init: init
    }
})();
Gallery.init('data/data.json');