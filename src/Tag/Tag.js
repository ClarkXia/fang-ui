import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Icon from '../Icon/Icon'

const noop = () => {};

export default class Tag extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        onClose: PropTypes.func,
        style: PropTypes.object
    };

    static defaultProps = {
        prefixCls: 'tag'
    };

    render() {
        const {prefixCls, onClose, className, children, ...other} = this.props;
        const closeIcon = onClose ? <Icon type="close" onClick={onClose} /> : '';
        const tagCls = classNames({
            [prefixCls]: true,
            [className]: !!className
        });

        return (
            <div {...other} className={tagCls}>
                <span className={`${prefixCls}-content`}>{children}</span>
                {closeIcon}
            </div>
        )
    }
}