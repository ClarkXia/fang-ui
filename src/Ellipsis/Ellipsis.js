import React, {PropTypes} from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

const defaultStyle = {
    overflow: 'hidden'
}

const HIDDEN_STYLE = {
    overflowX: 'scroll',
    height: 0,
    width: 0,
    whiteSpace: 'pre'
}

const ellipsis = (element, ellipsisText) => {
    const limitWidth = element.clientWidth;
    const temp = element.cloneNode(true);
    for (let key in HIDDEN_STYLE) {
        temp.style[key] = HIDDEN_STYLE[key];
    }

    element.parentNode.appendChild(temp);

    let realWidth = temp.scrollWidth;
    if (realWidth <= limitWidth) {
        element.parentNode.removeChild(temp);
        return false;
    }

    temp.innerHTML = ellipsisText;
    const ellipsisWidth = temp.scrollWidth;

    let str = element.innerHTML;
    str = str.replace(/\s+/g, ' ').split('');
    let index;
    while (realWidth > limitWidth && str.length > 1) {
        index = parseInt(str.length / 2);
        str.splice(index, 1);
        temp.innerHTML = str.join('');

        realWidth = temp.scrollWidth + ellipsisWidth;
    }

    if (index !== undefined){
        str.splice(index, 0, ellipsisText);
    }
    element.parentNode.removeChild(temp);

    return str.join('');
}

export default class Ellipsis extends React.Component {
    static propTypes = {
        containerElement: PropTypes.string,
        prefixCls: PropTypes.string,
        children: PropTypes.string,
        ellipsisText: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'ellipsis',
        containerElement: 'div',
        ellipsisText: '..'
    };

    constructor(props) {
        super(props);
        this.state = {
            showStr: props.children
        };
    }

    componentWillReceiveProps(nextProps) {
        this.checked = false;
        if (this.props.children != nextProps.children) {
            this.setState({
                showStr: nextProps.children
            });
        }
    }

    componentDidMount() {
        this.checkWidth();
    }

    componentDidUpdate() {
        this.checkWidth();
    }

    checkWidth() {
        if (this.checked) return;
        const newStr = ellipsis(ReactDOM.findDOMNode(this.refs.ellipsis), this.props.ellipsisText);
        this.checked = true;
        if (newStr !== false) {
            this.setState({
                showStr: newStr
            });
        }
    }

    render() {
        const {containerElement, children, prefixCls, className, style, width, ...other} = this.props;
        return React.createElement(containerElement, {
            style: Object.assign({}, style, defaultStyle),
            className: classNames({
                [`${prefixCls}`]: true,
                [className]: !!className
            }),
            title: children,
            ref: 'ellipsis'
        }, this.state.showStr);
    }
}

Ellipsis.isEllipsis = true;