new Vue({
    el: '#app',
    data: {
        activeForm: 'Enter Duration',
        form: {
            hours: null,
            minutes: null,
            seconds: null
        },
        timer: null,
        timerMeta: {
            duration: 0,
            elapsed: 0,
            endTime: 0,
            timeLeft: 0,
            prettyTime: null,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        tickRate: 1,
        isTimerActive: false,
        isPaused: false,
        isTimerEnded: false,
        timerStateText: 'PAUSE',
        allowSound: true
    },
    mouned() {
        console.log(Notification.permission);
    },
    computed: {
        isFormValid() {
            return this.form.hours > 0 || this.form.minutes > 0 || this.form.seconds > 0;
        }
    },
    methods: {
        createTimer() {
            if (this.isFormValid) {
                const durationSeconds = (this.form.hours * 60 * 60) + (this.form.minutes * 60) + (this.form.seconds);

                this.timerMeta = {
                    ...this.timerMeta,
                    duration: (durationSeconds * 1000),
                    hours: this.form.hours,
                    minutes: this.form.minutes,
                    seconds: this.form.seconds
                }

                this.timerMeta.endTime = Date.now() + this.timerMeta.duration;
                this.timerMeta.timeLeft = this.timerMeta.endTime;
                this.timerMeta.prettyTime = this.toTimeString();

                this.timer = setInterval(this.timerFunction, this.tickRate);

                this.isTimerActive = true;
                this.isTimerEnded = false;
            }
        },
        quickTimer(h, m, s) {
            this.form = {
                hours: h,
                minutes: m,
                seconds: s
            };

            this.createTimer();
        },
        timerFunction() {
            this.timerMeta.elapsed += 1000;
            this.timerMeta.timeLeft = this.timerMeta.endTime - Date.now();
            this.timerMeta.prettyTime = this.toTimeString();

            if (this.timerMeta.timeLeft <= 0) {
                this.timerMeta.prettyTime = `00:00:00`;
                this.notify();
                this.stopTimer();
            } else {
                document.title = `${this.timerMeta.prettyTime} | timer`;
            }
        },
        clearForm() {
            this.form = {
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        },
        notify() {
            var notification = new Notification('Timer Done');
            document.title = 'TIMER ENDED | spaghet';

            if (this.allowSound) {
                this.$refs.audio.play();
            }
            
            this.isTimerEnded = true;
        },
        repeatTimer() {
            this.timerMeta.endTime = Date.now() + this.timerMeta.duration;
            this.timerMeta.timeLeft = this.timerMeta.endTime;
            this.timerMeta.prettyTime = this.toTimeString();

            this.timer = setInterval(this.timerFunction, this.tickRate);
            this.isTimerEnded = false;
        },
        stopTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },
        cancel() {
            clearInterval(this.timer);
            this.timer = null;
            this.isTimerActive = false;
            this.activeForm = 'Enter Duration';
        },
        playPause() {
            if (this.isPaused) {
                this.timerStateText = 'PAUSE';
                this.isPaused = false;
                this.resumeTimer();
            } else {
                this.timerStateText = 'RESUME';
                this.isPaused = true;
                this.pauseTimer();
            }
        },
        resumeTimer() {
            this.timerMeta.endTime = Date.now() + this.timerMeta.timeLeft;
            this.timerMeta.timeLeft = this.timerMeta.endTime;
            this.timerMeta.prettyTime = this.toTimeString();

            this.timer = setInterval(this.timerFunction, this.tickRate);
        },
        pauseTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },
        toTimeString() {
            const hours = Math.floor((this.timerMeta.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((this.timerMeta.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((this.timerMeta.timeLeft % (1000 * 60)) / 1000);

            return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
        },
        padZero(num) {
            return String(num).length > 1 ? num : `0${num}`;
        },
        formatMaxLength(field, max) {
            if (this.form[field].length > max) {
                this.form[field] = Number(String(this.form[field]).slice(0, max))
            }
        },
        pastTimers() {
            // @TODO
            // Persiist past timers
        },
        saveTimer() {
            // @TODO
            // Save active timer in event of refresh.
        }
    }
});