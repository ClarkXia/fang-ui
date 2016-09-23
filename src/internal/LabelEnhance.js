import React, {PropTypes} from 'react';
import classNames from 'classnames';

export const LabelEnhance = ComponsedComponent => {

    class Label extends React.Component {
        static propTypes = {
            checked: PropTypes.bool,
            defaultChecked: PropTypes.bool,
            disabled: PropTypes.bool,
            style: PropTypes.object,
            className: PropTypes.string
        };

        constructor(props) {
            super(props);
        }

        render() {
            const {prefixCls, className, style, children, checked, disabled, defaultChecked, ...other} = this.props;
            const wrapperCls = classNames({
                [`${prefixCls}-wrapper`]: true,
                [`${prefixCls}-wrapper-checked`]: checked || defaultChecked,
                [`${prefixCls}-wrapper-disabled`]: disabled,
                [className]: !!className
            });

            return (
                <label className={wrapperCls} style={style}>
                    <ComponsedComponent {...other}
                        prefixCls={prefixCls}
                        checked={checked}
                        disabled={disabled}
                        defaultChecked={defaultChecked}
                    />
                    {children !== undefined ? <span>{children}</span> : null}
                </label>
            );
        }
    }

    Label.componentType = ComponsedComponent && ComponsedComponent.componentType;

    return Label;
}