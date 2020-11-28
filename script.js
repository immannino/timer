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
            prettyEndTime: null,
            timeLeft: 0,
            prettyTime: null,
            hours: 0,
            minutes: 0,
            seconds: 0,
        },
        tickRate: 50,
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
        },
        formEndTime() {
            if (this.isFormValid) {
                const endDate = this.calculateEndTime(this.form.hours, this.form.minutes, this.form.seconds);

                console.log(endDate.toLocaleString());
                return endDate.toLocaleTimeString();
            } else {
                return null;
            }
        }
    },
    methods: {
        createTimer() {
            if (this.isFormValid) {
                const durationMS = (this.form.hours * 60 * 60 * 1000) + (this.form.minutes * 60 * 1000) + (this.form.seconds * 1000);

                this.timerMeta = {
                    ...this.timerMeta,
                    duration: durationMS,
                    hours: this.form.hours,
                    minutes: this.form.minutes,
                    seconds: this.form.seconds,
                    prettyEndTime: this.calculateEndTime(this.form.hours, this.form.minutes, this.form.seconds)
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
            try {
                var notification = new Notification('Timer Done');
                document.title = 'TIMER ENDED | spaghet';
            } catch (err) {
                console.log('Noficications not supported');
                window.alert('TIMER ENDED');
            }

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
        calculateEndTime(hh, mm, ss) {
            const durMS = (hh * 60 * 60 * 1000) + (mm * 60 * 1000) + (ss * 100);
            return new Date((Date.now() + durMS));
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