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

    render() {
        const {disabled, children, className, prefixCls, focusState, selected, ...other} = this.props;

        const cls = classNames({
            [`${prefixCls}`]: true,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-selected`]: selected,
            [focusState]: !!focusState,
            [className]: !!className
        })

        return (
            <div className={cls} {...other}>
                <a href="javascript:;">
                    {children}
                </a>
            </div>
        );
    }
}

MenuItem.isMenuItem = true;