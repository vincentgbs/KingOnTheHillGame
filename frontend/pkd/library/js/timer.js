const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 30;

let timer = {
    timePassed: 0,
    timeLeft: TIME_LIMIT,
    timerInterval: null,
    display_timer: function(id) {
        document.querySelector('#'+id).innerHTML = `
        <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                  <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                  <path
                    id="base-timer-path-remaining"
                    stroke-dasharray="283"
                    class="base-timer__path-remaining ${COLOR_CODES.info.color}"
                    d="
                      M 50, 50
                      m -45, 0
                      a 45,45 0 1,0 90,0
                      a 45,45 0 1,0 -90,0
                    "
                  ></path>
                </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">${timer.formatTime(
            timer.timeLeft
            )}</span>
        </div>
        `;
    },
    onTimesUp: function() {
        clearInterval(timer.timerInterval);
    },
    startTimer: function() {
        if (timer.timeLeft <= 0) {
            return false;
        }
        timer.timerInterval = setInterval(() => {
            timer.timePassed = timer.timePassed += 1;
            timer.timeLeft = TIME_LIMIT - timer.timePassed;
            document.getElementById("base-timer-label").innerHTML = timer.formatTime(
                timer.timeLeft
            );
            timer.setCircleDasharray();
            timer.setRemainingPathColor(timer.timeLeft);

            if (timer.timeLeft === 0) {
                timer.onTimesUp();
            }
        }, 1000);
    },
    formatTime: function(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    },
    setRemainingPathColor: function(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document.getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
            document.getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document.getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
            document.getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
        }
    },
    calculateTimeFraction: function() {
        const rawTimeFraction = timer.timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    },
    setCircleDasharray: function() {
        const circleDasharray = `${(
            timer.calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document.getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    },
}
