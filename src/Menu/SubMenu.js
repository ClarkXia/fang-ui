import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const position = {
    top: true,
    right: true
}

export class SubMenuWrapper extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'sub-menu'
    };

    constructor(props) {
        super(props);
        this.state = {
            position
        };
        this.timer = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this._display = false;
            this.timer = setTimeout(() => {
                this._display = true;
                const menuPosition = this.getMenuPosition();
                if (menuPosition) {
                    this.setState(menuPosition);
                    this.forceUpdate();
                }
            })
        } else {
            //rest state
            this._display = false;
            this.setState({
                position
            })
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.visible !== nextProps.visible;
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

    }

    getMenuPosition() {
        if (!this.menu) return;
        const {innerWidth, innerHeight} = window,
            rect = this.menu.getBoundingClientRect(),
            position = {};

        if (rect.bottom > innerHeight) {
            position.bottom = true;
        } else {
            position.top = true;
        }

        if (rect.right > innerWidth) {
            position.left = true;
        } else {
            position.right = true;
        }

        return {
            position
        };
    }

    getPositionStyles() {
        let style = {},
            {position} = this.state;

        if (position.top) style.top = 0;
        if (position.bottom) style.bottom = 0;
        if (position.right) style.left = '100%';
        if (position.left) style.right = '100%';

        return style;
    }

    render() {
        const {children, visible, className, prefixCls} = this.props;

        const style = {
            display: visible ? 'block' : 'none',
            opacity: this._display ? 1 : 0,
            position: 'absolute',
            ...this.getPositionStyles()
        };

        const cls = classNames({
            [`${prefixCls}`]: true,
            [className]: !!className
        })

        return (
            <ul ref={(c) => (this.menu = c)} style={style} className={cls}>
                {children}
            </ul>
        );
    }
}

const defaultItemStyle = {
    position: 'relative'
}

export default class SubMenu extends React.Component {
    static propTypes = {
        label: PropTypes.node,
        disabled: PropTypes.bool,
        hoverDelay: PropTypes.number,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'sub-menu',
        hoverDelay: 200
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
        this.enter = false;

    }

    componentWillUnmount() {
        if (this.openTimer) clearTimeout(this.openTimer);
        if (this.closeTimer) clearTimeout(this.closeTimer);
        this.enter = false;
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleMouseEnter = () => {
        if (this.closeTimer) clearTimeout(this.closeTimer);

        if (this.props.disabled || this.state.visible || this.enter) return;
        this.enter = true;
        this.openTimer = setTimeout(() => {
            this.setState({
                'visible': true
            })
        }, this.props.hoverDelay);
    };

    handleMouseLeave = () => {
        this.enter = false;
        if (this.openTimer) clearTimeout(this.openTimer);
        if (!this.state.visible) return;
        this.closeTimer = setTimeout(() => {
            this.setState({
                'visible': false
            })
        }, this.props.hoverDelay);
    };

    render() {
        const {disabled, children, label, style, prefixCls} = this.props;

        const cls = classNames({
            [`${prefixCls}-item`]: true,
            disabled,
            active: this.state.visible
        });
        //TODO use createElement
        return (
            <li
                className={cls}
                style={Object.assign({}, defaultItemStyle, style)}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <a href="#" className={`${prefixCls}-link`} onClick={this.handleClick}>
                    {label}
                </a>
                <SubMenuWrapper visible={this.state.visible} prefixCls={prefixCls} >
                    {children}
                </SubMenuWrapper>
            </li>
        )
    }
}