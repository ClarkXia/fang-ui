const primaryStyle = ['fontFamily', 'fontSize', 'fontWeight', 'fontVariant', 'fontStyle',
    'paddingLeft', 'paddingTop', 'paddingBottom', 'paddingRight',
    'marginLeft', 'marginTop', 'marginBottom', 'marginRight',
    'borderLeftColor', 'borderTopColor', 'borderBottomColor', 'borderRightColor',
    'borderLeftStyle', 'borderTopStyle', 'borderBottomStyle', 'borderRightStyle',
    'borderLeftWidth', 'borderTopWidth', 'borderBottomWidth', 'borderRightWidth',
    'line-height', 'outline', 'box-sizing'];

const specificStyle = {
    'word-wrap': 'break-word',
    'overflow-x': 'hidden',
    'overflow-y': 'auto'
};

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

function getCaretPosition(element) {
    if (!simulator) {
        simulator = document.createElement('div');
        simulator.style.position = 'absolute';
        simulator.style.top = '0px';
        simulator.style.left = '0px';
        //simulator.style.visibility = 'hidden';
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
    console.log(boxSizing);
    if (boxSizing === 'content-box') {
        eleWidth = eleWidth - parseInt(getComputedStyle(element, 'padding-left')) - parseInt(getComputedStyle(element, 'padding-right'))
                            - parseInt(getComputedStyle(element, 'border-left-width')) - parseInt(getComputedStyle(element, 'border-right-width'));
        eleHeight = eleHeight - parseInt(getComputedStyle(element, 'padding-top')) - parseInt(getComputedStyle(element, 'padding-bottom'))
                            - parseInt(getComputedStyle(element, 'border-top-width')) - parseInt(getComputedStyle(element, 'border-bottom-width'));
    }
    /*else if (boxSizing === 'border-box'){

    }*/

    specificStyle.width = eleWidth + 'px';
    specificStyle.height = eleHeight + 'px';
    //fouce box-sizing



    for (var styleKey in specificStyle) {
        simulator.style[styleKey] = specificStyle[styleKey];
    }

    var value = element.value, cursorPosition = getCursorPosition(element);
    var beforeText = value.substring(0, cursorPosition),
        afterText = value.substring(cursorPosition);

    var before = document.createElement('span'),
        focus = document.createElement('span'),
        after = document.createElement('span');

    before.innerHTML = toHTML(beforeText);
    after.innerHTML = toHTML(afterText);

    simulator.appendChild(before);
    simulator.appendChild(focus);
    simulator.appendChild(after);

    var focusOffset = focus.getBoundingClientRect(),
        simulatorOffset = simulator.getBoundingClientRect();
    console.log(focusOffset)
    return {
        top: focusOffset.top - simulatorOffset.top - element.scrollTop
             // calculate and add the font height except Firefox
             + (browser.firefox ? 0 : parseInt(getComputedStyle(element, 'fontSize'))),
        left: focusOffset.left - simulatorOffset.left - element.scrollLeft
    };
}

export function getCursorPosition(element) {
    var result = 0;
    if ('selectionStart' in element) {
        result = element.selectionStart;
    } else if ('selection' in document) {
        var range = document.selection.createRange();
        if (browser.ie && parseInt(browser.ie) > 6) {
            element.focus();
            var length = document.selection.createRange.text.length;
            range.moveStart('character', - element.value.length);
            result = range.text.length - length;
        } else {
            /*IE 6*/
            var bodyRange = document.body.createTextRange();
            bodyRange.moveToElementText(element);
            for (; bodyRange.compareEndPoints('StartToStart', range) < 0; result++)
                bodyRange.moveStart('character', 1);
            for (var i = 0; i <= result; i ++){
                if (element.value.charAt(i) == '\n')
                    result++;
            }
            var enterCount = element.value.split('\n').length - 1;
            result -= enterCount;
            return result;
        }
    }
    console.log(result);

    return result;
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

function toHTML(text) {
    return text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br>')
                .split(' ').join('<span style="white-space:prev-wrap">&nbsp;</span>');
}


export default getCaretPosition;