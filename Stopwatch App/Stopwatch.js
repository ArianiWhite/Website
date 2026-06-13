(function ($, doc, win) {

    // Time UI Elements
    var hour = $('#hr');
    var min = $('#min');
    var sec = $('#sec');

    // State Settings
    var liNum = 75;
    var flip = false;
    var intervalCounter = 0;
    var time = null;

    // Buttons & Labels
    var btnStartStop = $('#btn-start-stop');
    var labelStartStop = $('#label-start-stop');
    var btnReset = $('#btn-reset');

    // Animation Properties
    var icnClockLine = $('.icn-clock-line');
    var icnClockLineDeg = 180;
    var clockLines = $('.clockline').find('li');
    var clockLines_arr = [];

    for (var i = 0; i < clockLines.length; i++) {
        clockLines_arr.push(clockLines[i]);
    }

    var currentTime = 0;
    var stop = true;

    var sWatchMethod = {

        timer: function() {
            if (!time) {
                time = setInterval(function() {
                    intervalCounter += 10;

                    if (!stop) {
                        if ((intervalCounter % 1000) === 0) {
                            currentTime += 1000;

                            var appendHour   = (currentTime / (1000 * 60 * 60)) | 0;
                            var appendMinute = ((currentTime / (1000 * 60)) | 0) % 60;
                            var appendSecond = ((currentTime / 1000) | 0) % 60;

                            appendHour   = appendHour   < 10 ? '0' + appendHour   : appendHour;
                            appendMinute = appendMinute < 10 ? '0' + appendMinute : appendMinute;
                            appendSecond = appendSecond < 10 ? '0' + appendSecond : appendSecond;

                            hour.text(appendHour);
                            min.text(appendMinute);
                            sec.text(appendSecond);
                        }

                        var target = $('#clockline li').eq(liNum);

                        if (!flip) {
                            target.css('background', '#ac7a33');
                        } else {
                            target.css('background', 'rgba(250, 248, 238, 0.4)');
                        }

                        liNum += 1;

                        if (liNum > 100) {
                            liNum = 0;
                        }
                        if (liNum == 75) {
                            flip = !flip;
                        }
                    }
                }, 10);
            }
        },

        startAndStop: function() {
            $('#btn-start-stop .stop-watch').addClass('sw-click');
            setTimeout(function() {
                $('#btn-start-stop .stop-watch').removeClass('sw-click');
            }, 200);

            stop = !stop;

            if (stop) {
                labelStartStop.text('START');
                icnClockLine.css('transform', 'rotate(180deg)');
                clearInterval(time);
                time = null;
            } else {
                labelStartStop.text('STOP');
                icnClockLineDeg += 180;
                icnClockLine.css('transform', 'rotate(' + icnClockLineDeg + 'deg)');
                sWatchMethod.timer();
            }

            btnReset.css('opacity', 1);
            $('.btn-reset .bl-parts').css('transition', 'transform 0s');
            btnReset.removeClass('br-click');
            setTimeout(function() {
                $('.btn-reset .bl-parts').css('transition', 'transform 0.5s');
            }, 200);
        },

        reset: function() {
            if (!stop) {
                stop = !stop;
                labelStartStop.text('START');
            }

            clearInterval(time);
            time = null;

            if (intervalCounter) {
                currentTime = 0;
                intervalCounter = 0;
                hour.text("00");
                min.text("00");
                sec.text("00");
                liNum = 75;
                flip = false;

                for (var i = 0; i < clockLines.length; i++) {
                    $('#clockline li').eq(i).css('background', '#fff');
                }

                btnReset.css('opacity', 0.5);
                btnReset.addClass('br-click');
            }
        },

        init: function() {
            const totalTicks = $('#clockline li').length;

            $('#clockline li').each(function(index) {
                const angle = (360 / totalTicks) * index;
                $(this).css('transform', 'rotate(' + angle + 'deg)');
            });

            btnStartStop.on('click', sWatchMethod.startAndStop);
            btnReset.on('click', sWatchMethod.reset);
        }

    };

    $(document).ready(sWatchMethod.init);

})(jQuery, document, window);