'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * По ивенту возвращает массив из него самого и "старших" ивента
 * например slide.funny -> [ slide.funny, slide ]
 * @param {String} event
 * @returns {String[]}
 */
function addParentEvents(event) {
    const result = [event];
    while (event.includes('.')) {
        event = event.slice(0, event.lastIndexOf('.'));
        result.push(event);
    }

    return result;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = {};

    /**
     * Производит процесс подписки сформированного обьекта студента на ивент.
     * @param {String} event
     * @param {Object} student
     */
    function subscribeStudent(event, { context, handler, times = Infinity, freq = 1 }) {
        if (events[event] === undefined) {
            events[event] = [];
        }
        events[event].push({ context, handler, times, freq, callNo: 0 });
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            subscribeStudent(event, { context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (let ivent of Object.keys(events)) {
                if (ivent === event || ivent.startsWith(event + '.')) {
                    events[ivent] = events[ivent].filter(entry => entry.context !== context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            addParentEvents(event).map(ivent => events[ivent]) // все подписки на ивенты
                .filter(entry => entry) // не пустые
                .forEach(entry => entry.forEach(student => { // для каждой подписки
                    if (student.callNo < student.times && student.callNo % student.freq === 0) {
                        student.handler.call(student.context);
                    }
                    student.callNo++;
                }));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            times = times < 1 ? Infinity : times; // меньше 1 - всегда
            subscribeStudent(event, { context, handler, times });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            frequency = frequency < 1 ? Infinity : frequency; // меньше 1 - всегда
            subscribeStudent(event, { context, handler, freq: frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,
    isStar
};
