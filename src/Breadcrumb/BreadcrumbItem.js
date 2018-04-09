import React from 'react';
import PropTypes from 'prop-types';

export default class BreadcrumbItem extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        separator: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        href: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'breadcrumb',
        separator: '/'
    };

    componentDidMount() {
        this.setMountSize();
    }

    componentDidUpdate() {
        this.setMountSize();
    }

    setMountSize() {
        const {setSize, itemKey} = this.props;
        //console.log(this.refs.link.clientWidth);
        if (setSize) setSize(itemKey, this.refs.link.offsetWidth); //offsetWidth 自动取整
    }

    createChildren() {
        const {itemSize, children} = this.props;
        return React.Children.map(children, (child) => {
            if (typeof child === 'object'){
                const newProps = {}
                if (child.type && child.type.isEllipsis) {
                    newProps.width = itemSize;
                }
                return React.cloneElement(child, newProps);
            } else {
                return child;
            }

        })
    }

    render() {
        const {prefixCls, separator, children, setSize, itemKey, itemSize, isLast, showSeparator, lastItemSize, ...other} = this.props;
        let link;
        const itemProps = {
            className: `${prefixCls}-link`,
            ref: 'link',
            ...other
        };

        if (itemSize && itemSize !== lastItemSize) {
            itemProps.style = {
                width: itemSize,
                display: 'inline-block'
            };
        }

        if ('href' in this.props) {
            link = <a {...itemProps}>{this.createChildren()}</a>;
        } else {
            link = <span {...itemProps}>{this.createChildren()}</span>;
        }

        return (
            <span>
                {link}
                {showSeparator ? <span className={`${prefixCls}-separator`}>{separator}</span> : null}
            </span>
        );
    }
}