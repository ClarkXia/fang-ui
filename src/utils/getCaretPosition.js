const primaryStyle = ['fontFamily', 'fontSize', 'fontWeight', 'fontVariant', 'fontStyle',
    'paddingLeft', 'paddingTop', 'paddingBottom', 'paddingRight',
    'marginLeft', 'marginTop', 'marginBottom', 'marginRight',
    'borderLeftColor', 'borderTopColor', 'borderBottomColor', 'borderRightColor',
    'borderLeftStyle', 'borderTopStyle', 'borderBottomStyle', 'borderRightStyle',
    'borderLeftWidth', 'borderTopWidth', 'borderBottomWidth', 'borderRightWidth',
    'line-height', 'outline', 'box-sizing'];

const specificStyle = {
    'wordWrap': 'break-word',
    'whiteSpace': 'pre-wrap',
    'overflow-x': 'hidden',
    'overflow-y': 'auto'
};

const inputSpecificStyle = {
    'whiteSpace': 'nowrap',
    'overflow-x': 'auto',
    'overflow-y': 'hidden'
}

const browser = function(){
    let b = {};
    const ua = navigator.userAgent.toLowerCase();
    let s;
    (s = ua.match(/msie ([\d.]+)/)) ? b.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? b.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? b.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? b.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? b.safari = s[1] : 0;
    return b;
}();

let simulator;

function getCaretPosition(element, inputFlag) {
    if (!simulator) {
        simulator = document.createElement('div');
        simulator.style.position = 'absolute';
        simulator.style.top = '-9999px';
        //simulator.style.top = '100px';
        simulator.style.left = '0px';
        simulator.style.visibility = 'hidden';

        document.body.appendChild(simulator);
    }
    var elementOffset = element.getBoundingClientRect();

    if (browser.ie) {
        element.focus();
        var range = document.selection.createRange();
        return {
            left: range.boundingLeft - elementOffset.left,
            top: parseInt(range.boundingTop) - elementOffset.top + element.scrollTop
                + document.documentElement.scrollTop + parseInt(getComputedStyle(element, 'fontSize'))
        };
    }

    simulator.innerHTML = '';
    //clone all styles
    for (var i = 0, l = primaryStyle.length; i < l; i++) {
        cloneStyle(element, simulator, primaryStyle[i]);
    }


    let eleWidth = element.offsetWidth,
        eleHeight = element.offsetHeight;
    const boxSizing = getComputedStyle(element, 'box-sizing');

    if (boxSizing === 'content-box') {
        eleWidth = eleWidth - parseInt(getComputedStyle(element, 'padding-left')) - parseInt(getComputedStyle(element, 'padding-right'))
                            - parseInt(getComputedStyle(element, 'border-left-width')) - parseInt(getComputedStyle(element, 'border-right-width'));
        eleHeight = eleHeight - parseInt(getComputedStyle(element, 'padding-top')) - parseInt(getComputedStyle(element, 'padding-bottom'))
                            - parseInt(getComputedStyle(element, 'border-top-width')) - parseInt(getComputedStyle(element, 'border-bottom-width'));
    }
    /*else if (boxSizing === 'border-box'){

    }*/

    let spStyle = inputFlag ? inputSpecificStyle : specificStyle;
    spStyle.width = eleWidth + 'px';
    spStyle.height = eleHeight + 'px';

    for (var styleKey in spStyle) {
        simulator.style[styleKey] = spStyle[styleKey];
    }

    var value = element.value, cursorPosition = getCursorPosition(element).start;
    var beforeText = value.substring(0, cursorPosition),
        afterText = value.substring(cursorPosition);

    var before = document.createElement('span'),
        focus = document.createElement('span'),
        after = document.createElement('span');

    before.innerHTML = toHTML(beforeText, inputFlag);
    after.innerHTML = toHTML(afterText, inputFlag);

    simulator.appendChild(before);
    simulator.appendChild(focus);
    simulator.appendChild(after);

    var focusOffset = focus.getBoundingClientRect(),
        simulatorOffset = simulator.getBoundingClientRect();

    return {
        top: focusOffset.top - simulatorOffset.top - element.scrollTop
             // calculate and add the font height except Firefox
             + (browser.firefox ? 0 : parseInt(getComputedStyle(element, 'fontSize'))),
        left: focusOffset.left - simulatorOffset.left - element.scrollLeft
    };
}

export function getCursorPosition(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, '\n');

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart('character', -len);
                start += normalizedValue.slice(0, start).split('\n').length - 1;

                if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd('character', -len);
                    end += normalizedValue.slice(0, end).split('\n').length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function getComputedStyle(element, styleName) {
    return browser.ie ? element.currentStyle[styleName] :
                        document.defaultView.getComputedStyle(element, null)[styleName];
}

function cloneStyle(element, target, styleName) {
    var styleValue = getComputedStyle(element, styleName);
    if (!!styleValue) {
        target.style[styleName] = styleValue;
    }
}

function toHTML(text, replaceWhiteSpace) {
    if (replaceWhiteSpace){
        return text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br>')
                   .split(' ').join('<span style="white-space:prev-wrap">&nbsp;</span>');
    }
    return text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


export default getCaretPosition;