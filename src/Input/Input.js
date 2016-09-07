import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default class Input extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        id: PropTypes.string,
        disabled: PropTypes.bool,
        value: PropTypes.any,
        minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        defaultValue: PropTypes.any,
        className: PropTypes.string,
        prefixCls: PropTypes.string,
        autoSize: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        prefixCls: 'input',
        disabled: false,
        type: 'text',
        autoSize: false,
        minWidth: 1
    };

    constructor(props) {
        super(props);
        if (props.type === 'text') {
            this.state = {
                inputStyle: {
                    width: props.minWidth
                }
            };
        } else {
            this.state = {
                inputStyle: null
            };
        }
    }

    componentDidMount() {
        this.resizeInput();
    }

    /*componentDidUpdate(preProps, prevState) {

    }*/

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            setTimeout(() => {this.resizeInput()});
        }
    }

    handleKeyDown = (e) => {

    };

    handleTextChange = (e) => {
        this.resizeInput();
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    };

    resizeInput = () => {
        const {type, autoSize} = this.props;
        if (autoSize && this.refs.input) {
            if (type === 'textarea') {
                const {minRows, maxRows} = this.props;
                const textareaStyle = calculateTextareaHeight(this.refs.input, minRows, maxRows);
                this.setState({
                    inputStyle: textareaStyle
                });
            } else if (type === 'text') {
                let inputWidth = calculateInputWidth(this.refs.input);
                inputWidth = this.props.maxWidth ? Math.min(inputWidth, parseInt(this.props.maxWidth)) : inputWidth;
                inputWidth = this.props.minWidth ? Math.max(inputWidth, parseInt(this.props.minWidth)) : inputWidth;

                this.setState({
                    inputStyle: {
                        width: inputWidth
                    }
                });
            }
        }

    };

    render() {
        const {prefixCls, autoSize, onAutoSize, className, style, type, minWidth, maxWidth, minRows, maxRows, ...other} = this.props;

        const newProps = {
            ...other,
            ref: 'input',
            style: Object.assign({}, style, this.state.inputStyle),
            className: classNames({
                [prefixCls]: true,
                [className]: !!className
            }),
            onChange: this.handleTextChange
        };

        return React.createElement(type === 'textarea' ? 'textarea' : 'input', newProps);
    }
}

const HIDDEN_TEXTAREA_STYLE = `
    min-height:0 !important;
    max-height:none !important;
    height:0 !important;
    visibility:hidden !important;
    overflow:hidden !important;
    position:absolute !important;
    z-index:-1000 !important;
    top:0 !important;
    right:0 !important
`;

const HIDDEN_INPUT_STYLE = `
    height:0 !important;
    visibility:hidden !important;
    overflow:scroll !important;
    white-space:pre;
    position:absolute !important;
    z-index:-1000 !important;
    top:0 !important;
    left:0 !important
`;

const INPUT_SIZING_STYLE = [
    'font-size',
    'font-family',
    'font-weight',
    'font-style',
    'letter-spacing',
    'padding-left',
    'padding-right',
    'border-width',
    'text-rendering',
    'text-transform',
    'text-indent',
    'box-sizing'
];

const TEXTAREA_SIZING_STYLE = INPUT_SIZING_STYLE.concat([
    'width',
    'line-height',
    'padding-top',
    'padding-bottom'
]);

let hiddenTextarea, hiddenDiv;

function calculateNodeStyle(node, direction = 'vertical') {
    const style = window.getComputedStyle(node);

    const boxSizing = style.getPropertyValue('box-sizing') || style.getPropertyValue('-moz-box-sizing') || style.getPropertyValue('-webkit-box-sizing');
    const paddingSize = parseFloat(style.getPropertyValue(direction === 'vertical' ? 'padding-top' : 'padding-left'))
                      + parseFloat(style.getPropertyValue(direction === 'vertical' ? 'padding-bottom' : 'padding-right'));
    const borderSize = parseFloat(style.getPropertyValue(direction === 'vertical' ? 'border-top-width' : 'border-left-width'))
                     + parseFloat(style.getPropertyValue(direction === 'vertical' ? 'boder-bottom-width' : 'boder-right-width'));
    const SIZING_STYLE = direction === 'vertical' ? TEXTAREA_SIZING_STYLE : INPUT_SIZING_STYLE;
    const sizingStyle = SIZING_STYLE.map(cssProp => `${cssProp}:${style.getPropertyValue(cssProp)}`).join(';');

    return {
        paddingSize, borderSize, boxSizing, sizingStyle
    };
}

function calculateTextareaHeight(node, minRows = null, maxRows = null) {
    if (!hiddenTextarea) {
        hiddenTextarea = document.createElement('textarea');
        document.body.appendChild(hiddenTextarea);
    }

    let {paddingSize, borderSize, boxSizing, sizingStyle} = calculateNodeStyle(node);
    hiddenTextarea.setAttribute('style', `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`);
    hiddenTextarea.value = node.value || node.placeholder || '';

    let textareaHeight = {};
    let minHeight,maxHeight;
    let height = hiddenTextarea.scrollHeight;
    if (boxSizing === 'border-box') {
        height = height + borderSize;
    } else if (boxSizing === 'content-box') {
        height = height - paddingSize;
    }

    if (minRows !== null || maxRows !== null) {
        //measure height of textarea width single row
        hiddenTextarea.value = '';
        let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
        if (minRows !== null) {
            minHeight = singleRowHeight * minRows;
            if (boxSizing === 'border-box') {
                minHeight = minHeight + paddingSize + borderSize;
            }
            textareaHeight.minHeight = minHeight;
            height = Math.max(minHeight, height);
        }

        if (maxRows !== null) {
            maxHeight = singleRowHeight * maxRows;
            if (boxSizing === 'border-box') {
                maxHeight = maxHeight + paddingSize + borderSize;
            }
            textareaHeight.maxHeight = maxHeight;
            height = Math.min(maxHeight, height);
        }
    }
    textareaHeight.height = height;

    return textareaHeight;
}

function calculateInputWidth(inputNode) {
    if (!hiddenDiv) {
        hiddenDiv = document.createElement('div');
        document.body.appendChild(hiddenDiv);
    }

    let {paddingSize, borderSize, boxSizing, sizingStyle} = calculateNodeStyle(inputNode, 'horizontal');

    hiddenDiv.setAttribute('style', `${sizingStyle};${HIDDEN_INPUT_STYLE}`);
    hiddenDiv.innerText = inputNode.value || inputNode.placeholder || '';

    let width = hiddenDiv.scrollWidth;

    if (boxSizing === 'border-box') {
        width = width + borderSize;
    } else if (boxSizing === 'content-box') {
        width = width - paddingSize;
    }

    return Math.max(width, 1) + 2;
}