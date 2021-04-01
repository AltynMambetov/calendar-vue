Vue.config.devtools = true;
new Vue({
    el: '#app',
    data() {
        return {
            month: moment().month(),
            fullYear: moment().year(),
            selectedRangeDate: [],
            selectedRangeDateIndex: [],
            calendarDates: [],
        }
    },
    computed: {
        getLastThirtyDays() {
            // Получаем последние 30 дней с сегодняшней даты
            let arr = [];
            for (let i = 0; i < 29; i++) {
                let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
                arr.unshift(date);
            }
            return arr;
        },
        prevMonth: function () {
            // Получаем предыдущий месяц
            return moment(this.fullYear).month(this.month - 1).format('M');
        },
        nextMonth: function () {
            // Получаем следующий месяц
            moment.locale('ru');
            let monthStr = (this.month + 1).toString();
            if (monthStr.length === 1) {
                monthStr = '0' + monthStr;
            }
            return moment(this.fullYear).month(this.month + 1).format('M');
        },
        endOfMonth: function () {
            // Получаем последний день месяца (28,29,30,31)
            moment.locale('ru');
            return moment(this.fullYear).month(this.month).endOf('month').format('D');
        },
        endOfPrevMonth: function () {
            // Получаем последний день предыдущего месяца (28,29,30,31)
            moment.locale('ru');
            return moment(this.fullYear).month(this.prevMonth - 1).endOf('month').format('D');
        },
        startWeekday: function () {
            // Получаем день недели, когда начался отсчет месяца
            moment.locale('ru');
            let monthStr = (this.month + 1).toString();
            if (monthStr.length === 1) {
                monthStr = '0' + monthStr;
            }
            return moment(this.fullYear + '-' + monthStr + '-' + '01').isoWeekday();
        },
        endWeekday: function () {
            // Получаем день недели, когда закончился отсчет месяца
            moment.locale('ru');
            let monthStr = (this.month + 1).toString();
            if (monthStr.length === 1) {
                monthStr = '0' + monthStr;
            }
            return moment(this.fullYear + '-' + monthStr + '-' + this.endOfMonth).isoWeekday();
        },
        monthName: function() {
            // Получаем название месяца
            moment.locale('ru');
            return moment().month(this.month).format('MMMM');
        },
        weekDays: function () {
            // Получаем список дни недели, укороченные (пн,вт,ср,чт,пт,сб,вс)
            moment.locale('ru');
            let days = moment.weekdaysMin();
            let day = days.shift();
            days.push(day);
            return days;
        },
    },
    methods: {
        getSelMonthDay(day, index) {
            // Получаем выбраные дни в календаре и их индекс
            let el = document.querySelector('.calendar__date-circle' + index).parentElement;
            let date = el.getAttribute('id');

            if (this.selectedRangeDate.length > 1) {
                this.removeClassSelected();
                this.unhighlightRange(this.selectedRangeDateIndex);
                this.selectedRangeDate = [];
                this.selectedRangeDateIndex = [];
                this.selectedRangeDate.push(date);
                this.selectedRangeDateIndex.push(index);
                this.addClassSelected();
            } else {
                this.selectedRangeDate.push(date);
                this.selectedRangeDateIndex.push(index);
                this.addClassSelected();
            }
        },
        addClassSelected() {
            // Добавляем класс выбора даты
            for (let i = 0; i < this.selectedRangeDate.length; i++) {
                let day = document.getElementById(this.selectedRangeDate[i]);
                if (day != null) {
                    day.classList.add('calendar__date-selected');
                }
            }

            if (this.selectedRangeDateIndex.length === 2 && new Date(this.selectedRangeDate[0]) > new Date(this.selectedRangeDate[1])) {
                let start = document.getElementById(this.selectedRangeDate[1]);
                let end = document.getElementById(this.selectedRangeDate[0]);

                console.log(start);
                console.log(end);

                if (start != null) {
                    start.classList.add('calendar__date-selected-start');
                }

                if (end != null) {
                    end.classList.add('calendar__date-selected-end');
                }
            } else if (this.selectedRangeDateIndex.length === 2 && new Date(this.selectedRangeDate[0]) < new Date(this.selectedRangeDate[1])) {
                let start = document.getElementById(this.selectedRangeDate[0]);
                let end = document.getElementById(this.selectedRangeDate[1]);

                if (start != null) {
                    start.classList.add('calendar__date-selected-start');
                }

                if (end != null) {
                    end.classList.add('calendar__date-selected-end');
                }
            } else if (this.selectedRangeDateIndex.length === 2 && new Date(this.selectedRangeDate[0]).getTime() === new Date(this.selectedRangeDate[1]).getTime()) {
                let start = document.getElementById(this.selectedRangeDate[0]);
                if (start != null) {
                    start.classList.add('calendar__date-selected-one');
                }
            }
        },
        removeClassSelected() {
            // Удаляем класс выбора даты с элементов
            let a = document.getElementById(this.selectedRangeDate[0]);
            let b = document.getElementById(this.selectedRangeDate[1]);

            if (a != null) {
                a.classList.remove('calendar__date-selected');
                a.classList.remove('calendar__date-selected-start');
                a.classList.remove('calendar__date-selected-end');
            }
            if (b != null) {
                b.classList.remove('calendar__date-selected');
                b.classList.remove('calendar__date-selected-end');
                b.classList.remove('calendar__date-selected-start');
                b.classList.remove('calendar__date-selected-one');
            }
        },
        highlightRange(arr) {
            // Отмечаем цветом выбранный период
            if (arr[0] > arr[1]) {
                for (let i = arr[1]; i <= arr[0]; i++) {
                    let date = document.querySelector('.calendar__date-circle' + i).parentElement;
                    date.classList.add('highlight');
                }
            } else {
                for (let i = arr[0]; i <= arr[1]; i++) {
                    let date = document.querySelector('.calendar__date-circle' + i).parentElement;
                    date.classList.add('highlight');
                }
            }
        },
        unhighlightRange(arr) {
            // Удаляем выделением цветом даты
            if (arr[0] > arr[1]) {
                for (let i = arr[1]; i <= arr[0]; i++) {
                    let date = document.querySelector('.calendar__date-circle' + i).parentElement;
                    date.classList.remove('highlight');
                }
            } else {
                for (let i = arr[0]; i <= arr[1]; i++) {
                    let date = document.querySelector('.calendar__date-circle' + i).parentElement;
                    date.classList.remove('highlight');
                }
            }
        },
        showPrevMonth() {
            // Показать предыдущий месяц
            let elements = document.querySelectorAll('.calendar__date');

            if (this.month === 0) {
                this.month = 11;
                this.fullYear = this.fullYear - 1;
            } else {
                this.month = this.month - 1;
            }
            // this.addClassSelected();
            elements.forEach(el => {
                el.classList.remove('calendar__date-selected');
                el.classList.remove('calendar__date-selected-start');
                el.classList.remove('calendar__date-selected-end');
                el.classList.remove('highlight');
            });
        },
        showNextMonth() {
            // Показать следующий месяц
            if (this.month === 11) {
                this.month = 0;
                this.fullYear = this.fullYear + 1;
            } else {
                this.month = this.month + 1;
            }
            this.addClassSelected();
        },
        getCalendarDates() {
            this.calendarDates = [];
            let prevEndDay = parseInt(this.endOfPrevMonth);
            let num = 1;

            // Пушим последние дни предыдущего месяца
            if (this.startWeekday != 1) {
                while (num != this.startWeekday) {
                    num++;
                    this.calendarDates.unshift(prevEndDay);
                    prevEndDay--;
                }
            }

            // Пушим дни выбранного месяца
            for (let i = 1; i <= this.endOfMonth; i++) {
                this.calendarDates.push(i);
            }

            // Пушим первые дни следующего месяца
            if (this.startWeekday === 1 && this.endWeekday === 7) {
                for (let i = 1; i <= this.endWeekday; i++) {
                    this.calendarDates.push(i);
                }
            } else if (this.startWeekday === 1 && this.endWeekday < 7 || this.startWeekday != 1) {
                for (let i = 1; i <= 7 - this.endWeekday; i++) {
                    this.calendarDates.push(i);
                }
            }
        }
    },
    watch: {
        selectedRangeDateIndex: function () {
            if (this.selectedRangeDateIndex.length === 2) {
                this.highlightRange(this.selectedRangeDateIndex)
            }
        },
    },
    created() {
        this.getCalendarDates();
    },
    mounted() {
        console.log(this.startWeekday, ' startWeekday');
        this.removeClassSelected();
    }
});
