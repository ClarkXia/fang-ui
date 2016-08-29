export default {
    once(el, type, callback) {
        const typeArr = type ? type.split(' ') : [];
        const recursiveFn = (e) => {
            e.target.removeEventListener(e.type, recursiveFn);
            return callback(e);
        };

        for (let i = typeArr.length - 1; i >= 0; i--) {
            this.on(el, typeArr[i], recursiveFn);
        }
    },

    on(el, type, callback) {
        if (el.addEventListener) {
            el.addEventListener(type, callback);
        } else {
            el.attachEvent(`on${type}`, () => {
                callback.call(el);
            });
        }
    },

    off(el, type, callback) {
        if (el.removeEventListener) {
            el.removeEventListener(type, callback);
        } else {
            el.detachEvent(`on${type}`, callback);
        }
    },

    isKeyboard(event) {
        return [
            'keydown',
            'keypress',
            'keyup'
        ].indexOf(event.type) !== -1;
    }
}