import React, {PropTypes} from 'react';
import {createChildFragment} from '../utils/childUtils';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import Icon from '../Icon/Icon';

export default class ButtonArea extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        loading: PropTypes.bool,
        size: PropTypes.oneOf(['large', 'default', 'small']),
        htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
        className: PropTypes.string,
        prefixCls: PropTypes.string,
        icon: PropTypes.string,
        href: PropTypes.string,
        target: PropTypes.string,
        containerElement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ])
    };

    static defaultProps = {
        prefixCls: 'btn',
        onClick: () => {},
        disabled: false,
        containerElement: 'button'
    };

    handleClick = (e) => {
        //TODO add click effect
        if (!this.props.disabled && !this.props.loading){
            this.props.onClick(e);
        }
    };

    // Handle auto focus when click button in Chrome
    handleMouseUp = (e) => {
        findDOMNode(this).blur();
        if (this.props.onMouseUp) {
            this.props.onMouseUp(e);
        }
    };

    createChildren(){
        const {icon, loading, children} = this.props
        const iconType = loading ? 'loading' : icon;

        return createChildFragment({
            icon: iconType ? <Icon type={iconType} /> : null,
            children: children ? <span>{children}</span> : null
        })
    }

    render() {
        const { type, size, className, htmlType, loading, prefixCls, href, target, containerElement, disabled, ...others } = this.props;
        const sizeCls = ({
            large: 'lg',
            small: 'sm'
        })[size] || '';

        const classes = classNames({
            [prefixCls]: true,
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-${sizeCls}`]: sizeCls,
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-disabled`]: disabled,
            [className]: className
        })

        const buttonProps = {
            ...others,
            type: htmlType || 'button',
            className: classes,
            onClick: this.handleClick,
            onMouseUp: this.handleMouseUp,
            href,
            target
        }

        const buttonChildren = this.createChildren();

        if (React.isValidElement(containerElement)) {
            return React.cloneElement(containerElement, buttonProps, buttonChildren);
        }

        return React.createElement(href ? 'a' : containerElement, buttonProps, buttonChildren);
    }
}