$(window).on('load', function() { //makes sure the whole site is loaded 
    $('#status').fadeOut(); //will first fade out the loading animation 
    $('#preloader').delay(500).fadeOut('slow'); //will fade out the white DIV that covers the website. 
    checkTouchScreen();
})

$(document).ready(function() {
    (function(window, undefined) {
        var player = document.getElementById('ap');
        var audio;
        var preloadBar = player.querySelector('.line_preload');
        var seeking = false;
        var rightClick = false;
        var progressBar = player.querySelector('.line_played');
        var trackList = player.querySelector('.player_playlist_list');
        var t = {
            playList: [{
                'file': 'http://incompetech.com/music/royalty-free/mp3-royaltyfree/Hitman.mp3',
                'thumb': 'http://www.electronicbeats.net/app/uploads/2013/08/Woodkid_Festival_Dresden_2013_Electronic_Beats.jpg',
                'trackName': 'Hitman',
                'trackArtist': 'Game of the Year',
                'trackAlbum': 'no album',
                'time': '3:20'
            }, {
                'file': 'https://a.clyp.it/zbh0qeyo.mp3',
                'thumb': '',
                'trackName': 'Forever Believe',
                'trackArtist': 'FRV BLV (nobodycars remux)',
                'trackAlbum': 'Remuxs',
                'time': '1:53'
            }, {
                'file': 'https://a.clyp.it/bthbgqcs.mp3',
                'thumb': 'http://kingofwallpapers.com/3/3-002.jpg',
                'trackName': 'Drifting',
                'trackArtist': 'Relax Company and Cocock',
                'trackAlbum': 'Hitch Cock',
                'time': '3:57'
            }, {
                'file': 'https://a.clyp.it/lygki3hx.mp3',
                'thumb': 'http://www.drodd.com/images15/4-20.png',
                'trackName': 'Clap Along (Lorem ipsum dolor sit amet, consectetur adipisicing.)',
                'trackArtist': 'Williamina Black',
                'trackAlbum': '50 Shades',
                'time': '2:06'
            }, {
                'file': 'https://a.clyp.it/enddsv44.mp3',
                'thumb': 'http://edufuture.biz/images/7/75/Number5_mat1_12.jpg',
                'trackName': 'Pop Tune',
                'trackArtist': 'Wall of Fame',
                'trackAlbum': 'I Love You',
                'time': '3:36'
            }]
        };
        var arr = t.playList;
        var randomArr = arr.slice();
        addRandomLi.called = false;

        function addPlaylistLi() {
            for (var index = 0; index < arr.length; index++) {
                var trackFile = arr[index].file;
                var trackName = arr[index].trackName;
                var trackArtist = arr[index].trackArtist;
                var trackThumb = arr[index].thumb;
                var trackTime = arr[index].time;
                var count = index + 1;
                var html = "";

                html += '<li class="player_playlist_item" song="' + trackFile + '" cover="' + trackThumb + '" artist="' + trackArtist + '" data-track="' + count + '">' +
                    '<div class="song_block" title="' + trackArtist + ' – ' + trackName + '">' +
                    '<p class="title_block">' + trackName + '</p>' +
                    '<p class="artist_block">' + trackArtist + '</p>' +
                    '</div>' +
                    '<div class="song_time">' + trackTime + '</div>' +
                    '</li>';

                $(trackList).append(html);
            }
        }
        addPlaylistLi();
        clickOnSong();

        //Initialize
        initAudio($('.player_playlist_list li:first-child'));

        //Random Button
        $('.random_btn').on('click', function() {
            if (addRandomLi.called == false) {
                addRandomLi.called = true;
                $(trackList).html('');
                addRandomLi();
                $('.random_btn').addClass('active');
            } else if (addRandomLi.called == true) {
                addRandomLi.called = false;
                $(trackList).html('');
                addPlaylistLi();
                $('.random_btn').removeClass('active');
            }

            //       if (!audio.paused) {

            //       }
            //       audio.pause();
            //       clearTime();
            //       audio.loop = false;
            //       $('.repeat_btn').removeClass('active');
            clickOnSong();
            // initAudio($('.player_playlist_list li:first-child'));
            // if (audio.paused) {
            //   $('#play_circle').removeClass('glyphicon-play').addClass('glyphicon-pause');
            //   $('#npAction').text(function(i, text) {
            //     if (text === "PAUSED...") {
            //       return "NOW PLAYING";
            //     }
            //   })
            // }
            // audio.play();
            // timeUpdate();
        })

        //Initializer Function
        function initAudio(element) {
            var song = element.attr('song');
            var title = $('.title_block', element).text();
            var artist = $('.artist_block', element).text();
            var cover = element.attr('cover');

            progressBar.closest('.timeline').addEventListener('mousedown', handlerBar, false);
            progressBar.closest('.timeline').addEventListener('mousemove', seek, false);
            document.documentElement.addEventListener('mouseup', seekingFalse, false);

            //Create Audio Object
            audio = new Audio(song);
            timeUpdate();
            autoPlayNext();

            //Set Current time to 00:00
            if (!audio.currentTime) {
                $('.time_played').html('0:00')
            }

            //Add title and artist name on main paige 
            $('#title').text(title);
            $('#artist').text(artist);

            //Insert Cover image
            var a = {
                    'background-image': 'url(' + cover + ')'
                },
                //No Cover image
                b = {
                    'background-image': 'url(https://s30.postimg.org/shr4aygpt/default_album_art_blue2.jpg)'
                }
            //If Cover exists show it
            if (cover !== '') {
                $('.cover').css(a);
            }
            //If Cover not exist show Default cover image
            else {
                $('.cover').css(b);
            }

            $('.player_playlist_list li').removeClass('active');
            element.addClass('active');
        }

        //After song ends play next song
        function autoPlayNext() {
            $(audio).on("ended", function() {
                clearTime();
                audio.pause();
                var next = $('.player_playlist_list li.active').next();
                if (next.length == 0) {
                    next = $('.player_playlist_list li:first-child');
                }
                initAudio(next);
                audio.play();
                timeUpdate();
            })
        }

        //Play and Pause button
        $('.play_btn').on('click', function() {
            if (!audio.paused) {
                //Pause action
                audio.pause();
            } else {
                //Play action
                audio.play();
            }
            $('#play_circle').toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
            $('#npAction').text(function(i, text) {
                return text === "PAUSED..." ? "NOW PLAYING" : "PAUSED...";
            })
            $('.time_played').fadeIn(400);
            timeUpdate();
        })

        //Next Button
        $('.next_btn').on('click', function() {
            clearTime();
            if (audio.paused) {
                $('#play_circle').removeClass('glyphicon-play').addClass('glyphicon-pause');
                $('#npAction').text(function(i, text) {
                    if (text === "PAUSED...") {
                        return "NOW PLAYING";
                    }
                })
            }
            audio.pause();
            audio.loop = false;
            $('.repeat_btn').removeClass('active');
            var next = $('.player_playlist_list li.active').next();
            if (next.length == 0) {
                next = $('.player_playlist_list li:first-child');
            }
            initAudio(next);
            audio.play();
            timeUpdate();
        })

        //Prev Button
        $('.prev_btn').on('click', function() {
            clearTime();
            if (audio.paused) {
                $('#play_circle').removeClass('glyphicon-play').addClass('glyphicon-pause');
                $('#npAction').text(function(i, text) {
                    if (text === "PAUSED...") {
                        return "NOW PLAYING";
                    }
                })
            }
            audio.pause();
            audio.loop = false;
            $('.repeat_btn').removeClass('active');
            var prev = $('.player_playlist_list li.active').prev();
            if (prev.length == 0) {
                prev = $('.player_playlist_list li:last-child');
            }
            initAudio(prev);
            audio.play();
            timeUpdate();
        })

        //Repeat Button
        $('.repeat_btn').on('click', function() {
            if (audio.loop == false) {
                audio.loop = true;
                $('.repeat_btn').addClass('active');
            } else {
                audio.loop = false;
                $('.repeat_btn').removeClass('active');
            }
        })

        function addRandomLi() {
            // addRandomLi.called = true;
            randomArr = shuffle(randomArr);
            for (var index = 0; index < randomArr.length; index++) {
                trackFile = randomArr[index].file;
                trackName = randomArr[index].trackName;
                trackArtist = randomArr[index].trackArtist;
                trackThumb = randomArr[index].thumb;
                trackTime = randomArr[index].time;
                var count = index + 1;
                var html = "";
                html += '<li class="player_playlist_item" song="' + trackFile + '" cover="' + trackThumb + '" artist="' + trackArtist + '" data-track="' + count + '">' +
                    '<div class="song_block" title="' + trackArtist + ' – ' + trackName + '">' +
                    '<p class="title_block">' + trackName + '</p>' +
                    '<p class="artist_block">' + trackArtist + '</p>' +
                    '</div>' +
                    '<div class="song_time">' + trackTime + '</div>' +
                    '</li>';
                $(trackList).append(html);
            }
        }

        //CLICK ON SONG
        function clickOnSong() {
            $('.player_playlist_list li').on('click', function() {
                if ($(this).hasClass('active') == true) {
                    if (audio.paused) {
                        $('#play_circle').removeClass('glyphicon-play').addClass('glyphicon-pause');
                        $('#npAction').text(function(i, text) {
                            if (text === "PAUSED...") {
                                return "NOW PLAYING";
                            }
                        })
                        audio.play();
                    } else {
                        $('#play_circle').addClass('glyphicon-play').removeClass('glyphicon-pause');
                        $('#npAction').text(function(i, text) {
                            if (text === "NOW PLAYING") {
                                return "PAUSED...";
                            }
                        })
                        audio.pause();
                    }
                } else if ($(this).hasClass('active') == false) {
                    audio.pause();
                    clearTime();
                    audio.loop = false;
                    $('.repeat_btn').removeClass('active');
                    $('#play_circle').removeClass('glyphicon-play').addClass('glyphicon-pause');
                    $('#npAction').text(function(i, text) {
                        if (text === "PAUSED...") {
                            return "NOW PLAYING";
                        }
                    })
                    initAudio($(this));
                    audio.play();
                    timeUpdate();
                }
            })
        }

        function timeUpdate() {
            audio.addEventListener('loadedmetadata', function() {
                var time = audio.duration;

                $(audio).bind('timeupdate', function() {
                    var value = 0;
                    if (audio.currentTime > 0) {
                        value = Math.floor((100 / time) * audio.currentTime);
                    }
                    $('.line_played').css('width', value + '%');

                    //Get Hours & Minutes
                    var curSecs = parseInt(audio.currentTime % 60);
                    var curMins = parseInt((audio.currentTime) / 60) % 60;

                    var secs = parseInt(time % 60);
                    var mins = parseInt((time) / 60) % 60;

                    //Add 0 if les than 10
                    if (curSecs < 10) {
                        curSecs = '0' + curSecs;
                    }
                    if (secs < 10) {
                        secs = '0' + secs;
                    }
                    $('.time_played').html(curMins + ':' + curSecs);
                    $('.full_time').html(mins + ':' + secs);

                    if (audio.buffered) {
                        var buffered = audio.buffered;
                        if (buffered.length) {
                            var loaded = Math.round(100 * buffered.end(0) / time);
                            preloadBar.style.width = loaded + '%';
                        }
                    }
                })
            })
        }

        function clearTime() {
            $('.line_played').css('width', '0%');
            $('.time_played').html('0:00');
            // $('.full_time').html('0:00');
        }

        //Shuffle function
        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        //Move and seeking Progress Bar and set Current Time
        function moveBar(evt, el, dir) {
            var value;
            if (dir === 'horizontal') {
                value = Math.round(((evt.clientX - el.offset().left) + window.pageXOffset) * 100 / el.parentNode.offsetWidth);
                el.style.width = value + '%';
                return value;
            }
        }

        function handlerBar(evt) {
            rightClick = (evt.which === 3) ? true : false;
            seeking = true;
            seek(evt);
        }

        function seek(evt) {
            if (seeking && rightClick === false && audio.readyState !== 0) {
                var value = moveBar(evt, progressBar, 'horizontal');
                audio.currentTime = audio.duration * (value / 100);
            }
        }

        function seekingFalse() {
            seeking = false;
        }

        Element.prototype.offset = function() {
            var el = this.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            return {
                left: el.left + scrollLeft
            };
        };

        (function() {
            $('.playlist_btn').on('click', function() {
                $('.player_playlist').toggleClass('active');
                $('.glyphicon-menu-left').toggleClass('active');
                $('.waves').toggleClass('active');
                $('.album_wrap').toggleClass('active');
                $('.song_playing').toggleClass('active');
                $('.timeline_wrap').toggleClass('active');
                $('.player_btns').toggleClass('active');
                $('.line_played').toggleClass('active');
                $('.full_line').toggleClass('active');
                $('.time_of_song').toggleClass('active');
                $('.timeline_pointer').toggleClass('active');
                $('.line_preload').toggleClass('active');
            })
        })();

        (function() {
            $('.hamburger-menu').on('click', function() {
                $('.bar').toggleClass('active');
                $('.hamburger-menu').toggleClass('active');
                $('.playlist_btn').toggleClass('active');
                $('.nav_menu').toggleClass('active');
                $('.player_fade').toggleClass('active');
            })
            $('.player_fade').on('click', function() {
                $('.bar').removeClass('active');
                $('.hamburger-menu').removeClass('active');
                $('.playlist_btn').removeClass('active');
                $('.nav_menu').removeClass('active');
                $('.player_fade').removeClass('active');
            })
        })();

        // отменить выделение текста
        function preventSelection(element) {
            var preventSelection = false;

            function addHandler(element, event, handler) {
                if (element.attachEvent)
                    element.attachEvent('on' + event, handler);
                else
                if (element.addEventListener)
                    element.addEventListener(event, handler, false);
            }

            function removeSelection() {
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection && document.selection.clear)
                    document.selection.clear();
            }

            function killCtrlA(event) {
                var event = event || window.event;
                var sender = event.target || event.srcElement;
                if (sender.tagName.match(/INPUT|TEXTAREA/i))
                    return;
                var key = event.keyCode || event.which;
                if (event.ctrlKey && key == 'A'.charCodeAt(0)) // 'A'.charCodeAt(0) можно заменить на 65
                {
                    removeSelection();
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
            addHandler(element, 'mousemove', function() {
                if (preventSelection)
                    removeSelection();
            });
            addHandler(element, 'mousedown', function(event) {
                var event = event || window.event;
                var sender = event.target || event.srcElement;
                preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
            });
            addHandler(element, 'mouseup', function() {
                if (preventSelection)
                    removeSelection();
                preventSelection = false;
            });
            addHandler(element, 'keydown', killCtrlA);
            addHandler(element, 'keyup', killCtrlA);
        }
        preventSelection(document);
    })(window);
});

// function checkTouchScreen() {
//   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//     $('body').addClass('touch-screen');
//     return true;
//   } else {
//     $('body').removeClass('touch-screen');
//     return false;
//   }
// }

//черновик

//Shuffle Button
//   function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex ;
//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
//       // Pick a remaining element...
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex -= 1;
//       // And swap it with the current element.
//       temporaryValue = array[currentIndex];
//       array[currentIndex] = array[randomIndex];
//       array[randomIndex] = temporaryValue;
//     }
//     return array;
//   }

//перетягивание Progress Bar упрощённая версия
// $(".timeline").mouseup(function(e) {
//   var leftOffset = e.pageX - $(this).offset().left;
//   var songPercents = leftOffset / $('.timeline').width();
//   audio.currentTime = songPercents * audio.duration;
// });