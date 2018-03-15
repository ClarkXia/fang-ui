import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function getStyles(props) {
    if (props.width) {
        return {
            width: props.width
            //TODO other default styles
        };
    } else {
        return {};
    }
}

export default class Tab extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        prefixCls: PropTypes.string,
        icon: PropTypes.node,
        index: PropTypes.any,
        label: PropTypes.node,
        onActive: PropTypes.func,
        selected: PropTypes.bool,
        style: PropTypes.object,
        value: PropTypes.any,
        width: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'tabs'
    }

    handleClick = (event) => {
        if (this.props.onClick) {
            this.props.onClick(this.props.value, event, this);
        }
    }

    render() {
        const {icon, index, onActive, onTouchTap, prefixCls, className, selected, label, style, value, width, onClick, ...other} = this.props;

        //TODO check icon if is valid element
        //TODO add event
        const cls = classNames({
            [`${prefixCls}-tab-active`]: selected,
            [`${prefixCls}-tab`]: true,
            [className]: !!className
        });
        return (
            <div
                {...other}
                className={cls}
                onClick={this.handleClick}
                style={Object.assign({}, getStyles(this.props), style)}
            >
                {icon}
                {label}
            </div>
        );
    }
}