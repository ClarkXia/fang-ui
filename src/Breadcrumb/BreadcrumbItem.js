import React, {PropTypes} from 'react';

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

    render() {
        const {prefixCls, separator, children, setSize, itemKey, itemSize, isLast, showSeparator, ...other} = this.props;

        let link;
        const itemProps = {
            className: `${prefixCls}-link`,
             ref: 'link',
            ...other
        };

        if (itemSize) {
            itemProps.style = {
                width: itemSize
            };
        }
        if ('href' in this.props) {
            link = <a {...itemProps}>{children}</a>;
        } else {
            link = <span {...itemProps}>{children}</span>;
        }

        return (
            <span>
                {link}
                {showSeparator ? <span className={`${prefixCls}-separator`}>{separator}</span> : null}
            </span>
        );
    }
}