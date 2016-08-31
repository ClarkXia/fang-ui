import React, {PropTypes} from 'react';
import classNames from 'classnames';

const defaultStyle = {
    root: {
        position: 'relative',
        display: 'inline-block'
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        WebkitTransform: 'translate(50%, -50%)',
        transform: 'translate(50%, -50%)'
    }
}

export default class Badge extends React.Component {
    static propTypes = {
        dot: PropTypes.bool,
        badgeContent: PropTypes.node,
        overflowCount: PropTypes.number,
        badgeStyle: PropTypes.object,
        style: PropTypes.object,
        className: PropTypes.string,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'badge',
        dot: false,
        badgeContent: null,
        overflowCount: 99
    };

    render() {
        const {
            badgeContent,
            children,
            dot,
            overflowCount,
            badgeStyle,
            prefixCls,
            className,
            style,
            ...other
        } = this.props;

        let content = '';
        let contentCls = prefixCls + (dot ? '-dot' : '-count');
        if (!dot) {
            if (typeof badgeContent == 'number' || typeof badgeContent == 'string') {
                content = parseInt(badgeContent) > overflowCount ? `${overflowCount}+` : badgeContent;
            } else {
                content = badgeContent;
                contentCls = prefixCls + '-content';
            }
        }

        const hidden = (!badgeContent || badgeContent == 0) && !dot;

        const badgeCls = classNames({
            [className]: !!className,
            [prefixCls]: true,
            [`${prefixCls}-not-wrapper`]: !children
        });

        return (
            <div {...other} className={badgeCls} style={Object.assign({}, defaultStyle.root, style)}>
                {children}
                {hidden ? null :
                    <span className={contentCls} style={Object.assign({}, defaultStyle.badge, badgeStyle)}>
                        {content}
                    </span>
                }
            </div>
        );
    }
}