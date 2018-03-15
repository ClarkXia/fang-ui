import React from 'react';
import PropTypes from 'prop-types';

function getStyles(props) {
    const {
        backgroundColor,
        color,
        size
    } = props;

    const styles = {
        root: {
            color: color || '#fff',
            backgroundColor: backgroundColor || '#bcbcbc',
            userSelect: 'none',
            display: 'inline-block',
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: size + 'px',
            fontSize: size / 2,
            borderRadius: '50%',
            height: size,
            width: size
        },
        icon: {
            color: color || '#fff',
            width: size * 0.6,
            height: size * 0.6,
            fontSize: size * 0.6
            //margin: size * 0.2
        }
    }

    return styles;
}

export default class Avatar extends React.Component {
    static propType = {
        prefixCls: PropTypes.string,
        backgroundColor: PropTypes.string,
        className: PropTypes.string,
        color: PropTypes.string,
        icon: PropTypes.element,
        size: PropTypes.number,
        src: PropTypes.string,
        style: PropTypes.object
    };

    static defaultProps = {
        prefixCls: 'avatar',
        size: 40
    };

    render() {
        const {backgroundColor, icon, src, style, className, prefixCls, ...other} = this.props;
        const styles = getStyles(this.props);
        const newClassName = className ? (className + ` ${prefixCls}-item`) : `${prefixCls}-item`
        if (src) {
            return (
                <img
                    {...other}
                    style={Object.assign(styles.root, style)}
                    src={src}
                    className={newClassName}
                />
            );
        } else {
            return (
                <div
                    {...other}
                    style={Object.assign(styles.root, style)}
                    className={newClassName}
                >
                    {icon && React.cloneElement(icon, {
                        style: Object.assign(styles.icon, icon.props.style)
                    })}
                    {this.props.children}
                </div>
            );
        }
    }
}