import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ItemDropDown, MenuItem} from '../Menu';

const ellipsisItem = () => <div className="ellipsis-item">...</div>;
const basedOrigin = {
    vertical: 'bottom',
    horizontal: 'left'
};

export default class Breadcrumb extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        separator: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        maxWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        itemMinWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        showLastSeparator: PropTypes.bool,
        autoEllipsis: PropTypes.bool,
        ellipsisItem: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func
        ])
    };

    static defaultProps = {
        prefixCls: 'breadcrumb',
        separator: '/',
        showLastSeparator: false,
        autoEllipsis: true,
        itemMinWidth: 100,
        separatorWidth: 20,
        ellipsisItem
    };

    constructor(props) {
        super(props);
        this.itemSize = {};
        this.resized = false;
    }

    componentDidMount() {
        this.props.autoEllipsis && this.resizeBreadcrumbLength();
    }

    componentDidUpdate() {
        this.props.autoEllipsis && this.resizeBreadcrumbLength();
    }

    componentWillReceiveProps() {
        //reset
        this.itemSize = {};
        this.resized = false;
    }

    resizeBreadcrumbLength() {
        if (this.resized) return;
        let childrenKeys = Object.keys(this.itemSize);
        //sort object
        const keysSorted = Object.keys(this.itemSize).sort((a, b) => this.itemSize[a] - this.itemSize[b]);

        const {itemMinWidth, separatorWidth, showLastSeparator} = this.props;
        const dropdownElement = ReactDOM.findDOMNode(this.refs.dropdown);
        const ellipsisWidth = dropdownElement ? dropdownElement.offsetWidth + 1 : 0;

        //total width
        let totalWidth = 0;
        childrenKeys.forEach((key) => {
            totalWidth += this.itemSize[key];
        });
        totalWidth += separatorWidth * (showLastSeparator ? childrenKeys.length : childrenKeys.length - 1);  //do not show last sparator

        let maxWidth = this.props.maxWidth || '100%';
        if (maxWidth.toString().indexOf('%') > -1) {
            maxWidth = this.refs.breadcrumb.parentNode.offsetWidth * parseInt(maxWidth) / 100;
        } else {
            maxWidth = parseInt(maxWidth);
        }
        if (totalWidth > maxWidth) {
            for (let i = keysSorted.length - 1; i >= 0; i--) {
                const width = this.itemSize[keysSorted[i]];

                if (width > itemMinWidth) {

                    if (totalWidth - width + itemMinWidth > maxWidth) {
                        totalWidth = totalWidth - width + itemMinWidth;
                        this.itemSize[keysSorted[i]] = itemMinWidth;
                    } else {
                        this.itemSize[keysSorted[i]] = width - (totalWidth - maxWidth);
                        totalWidth = maxWidth;
                    }
                } else {
                    break;
                }
            }

            let index, dropdownItems = [], pushFlag = childrenKeys.length%2;
            while (totalWidth > maxWidth) {
                index = Math.ceil(childrenKeys.length / 2) - 1;

                if (childrenKeys[index] === undefined) break;

                if (dropdownItems.length === 0) {
                    totalWidth = totalWidth - this.itemSize[childrenKeys[index]] + ellipsisWidth;
                } else {
                    totalWidth = totalWidth - this.itemSize[childrenKeys[index]] - separatorWidth;
                }


                if (pushFlag) {
                    dropdownItems.push(childrenKeys[index]);
                } else {
                    dropdownItems.unshift(childrenKeys[index]);
                }

                delete this.itemSize[childrenKeys[index]];
                childrenKeys.splice(index, 1);
                pushFlag = !pushFlag;
                if (!this.itemSize['ellipsis']){
                    this.itemSize['ellipsis'] = ellipsisWidth;
                }
            }

            if (index !== undefined) {
                childrenKeys.splice(index, 0, 'ellipsis');
                this.dropdownItems = dropdownItems;
            }

            //this.showKeys = childrenKeys;
            this.resizeFlag = false;
            this.reRender = true;

            this.forceUpdate();

        } else {
            this.itemSize = {};
        }

        this.resized = true;
    }

    renderDropDown() {
        const {prefixCls, separator, ellipsisItem} = this.props;
        const children = React.Children.toArray(this.props.children);
        const itemElement = typeof ellipsisItem === 'function' ? ellipsisItem(this.props) : ellipsisItem;

        return (
            <ItemDropDown basedOrigin={basedOrigin} itemElement={itemElement} prefixCls={`${prefixCls}-dropdown`} ref="dropdown">
                {this.dropdownItems.map((index) => {
                    const childProps = {
                        separator,
                        showSeparator: false
                    };
                    return (
                        <MenuItem key={index} value={index}>
                            {React.cloneElement(children[index], childProps)}
                        </MenuItem>
                    );
                })}
            </ItemDropDown>
        );
    }

    handleMountSize = (key, width) => {
        //fix float type
        this.itemSize[key] = width + 1;
    };

    render() {
        const {prefixCls, separator, showLastSeparator, children} = this.props;
        const count = React.Children.count(children);
        const crumbs = React.Children.map(children, (element, index) => {
            const childProps = {
                separator,
                key: index,
                itemKey: index,
                showSeparator: index !== (count - 1) ? true : showLastSeparator
            };

            if (this.reRender && this.dropdownItems && this.dropdownItems.indexOf(index.toString()) > -1) {
                if (!this.resizeFlag) {
                    this.resizeFlag = true;
                    //childProps.key = childProps.itemKey = 'ellipsis';
                    //return <BreadcrumbItem {...childProps}>{this.renderDropDown()}</BreadcrumbItem>;
                    if (element.type) {
                        return React.createElement(element.type, childProps, this.renderDropDown());
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
            childProps.setSize = this.handleMountSize;
            if (this.itemSize[index]) {
                childProps.itemSize = this.itemSize[index];
            }
            return React.cloneElement(element, childProps);
        });

        //console.log(crumbs);

        if (this.reRender) {
            this.reRender = false;
            this.dropdownItems = [];
        }

        return (
            <div className={prefixCls} ref="breadcrumb">
                {crumbs}
            </div>
        );
    }


}