import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default class MenuItem extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        focusState: PropTypes.string,
        data: PropTypes.object,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        disabled: false,
        focusState: '',
        prefixCls: 'menu-item',
        className: ''
    };

    handleMouseEnter = (event) => {
        if (!this.props.disabled) this.onFocus(event);
    };

    handleMouseMove = (event) => {
        if (!this.props.disabled) this.onFocus(event);
    };

    onFocus = (event) => {
        if (!this.props.focusState && this.props.onFocus) {
            this.props.onFocus(this.props.index, event);
        }
    }

    render() {
        const {disabled, children, className, prefixCls, focusState, selected, index, onFocus, label, ...other} = this.props;

        const cls = classNames({
            [`${prefixCls}`]: true,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-selected`]: selected,
            [focusState]: !!focusState,
            [className]: !!className
        });

        return (
            <li
                className={cls}
                {...other}
                /*onMouseEnter={this.handleMouseEnter}*/
                onMouseMove={this.handleMouseMove}
            >
                {children}
            </li>
        );
    }
}

MenuItem.isMenuItem = true;