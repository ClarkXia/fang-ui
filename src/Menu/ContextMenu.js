import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

const menuStyle = {
    position: 'fixed',
    zIndex: 100
}
export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            left: 0,
            top: 0
        };
        this._display = true;
    }

    static propTypes = {
        prefixCls: PropTypes.string,
        visible: PropTypes.bool
    };

    static defaultProps = {
        prefixCls: 'context-menu'
    };

    componentWillReceiveProps(nextProps) {
        //if (this.props.visible !== nextProps.visible) {
            if (nextProps.visible) {
                if (this.props.x != nextProps.x || this.props.y != nextProps.y) {
                    this._display = false;
                    this.timer = setTimeout(() => {
                        this.showMenu(nextProps);
                    })
                } else {
                    this._display = true;
                }

            } else {
                this._display = false;
            }
        //}
    }

    componentDidMount() {
        if (this.props.visible) {
            this.showMenu(this.props);
        }
    }

    componentWillUnmount() {
        this.menu.parentNode.removeEventListener('contextmenu', this.hideMenu);
        if (this.timer) clearTimeout(this.timer);
    }

    hideMenu = (e) => {
        e.preventDefault();
        this.menu.parentNode.removeEventListener('contextmenu', this.hideMenu);
    };

    showMenu = (props) => {
        this._display = true;
        this.setState(this.getMenuPosition(props.x, props.y));
        this.menu.parentNode.addEventListener('contextmenu', this.hideMenu);
    };

    getMenuPosition = (x, y) => {
        let scrollX = document.documentElement.scrollTop,
            scrollY = document.documentElement.scrollLeft,
            {innerWidth, innerHeight} = window,
            rect = this.menu.getBoundingClientRect(),
            position = {
                top: y + scrollY,
                left: x + scrollX
            };
        if (y + rect.height > innerHeight) {
            position.top -= rect.height;
        }

        if (x + rect.width > innerWidth) {
            position.left -= rect.width;
        }
        return position;
    };

    render() {
        const {visible, children, prefixCls, style} = this.props;
        const measureStyle = {
            display: visible ? 'block' : 'none',
            opacity: this._display ? 1 : 0,
            ...this.state
        }

        return (
            <ul ref={(c) => (this.menu = c)} style={Object.assign({}, menuStyle, measureStyle, style)} className={prefixCls}>
                {children}
            </ul>
        );

    }
}

ContextMenu.isContextMenu = true;