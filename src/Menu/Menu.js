import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const noop = () => {};
const defaultStyle = {
    position: 'relative'
}

export default class Menu extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        disableAutoFocus: PropTypes.bool,
        initialKeyBoardFocused: PropTypes.bool,
        maxHeight: PropTypes.number,
        multiple: PropTypes.bool,
        onChange: PropTypes.func,
        onEscKeyDown: PropTypes.func,
        onItemClick: PropTypes.func,
        onKeyDown: PropTypes.func,
        selectedMenuItemStyle: PropTypes.object,
        style: PropTypes.object,
        disableKeyEvent: PropTypes.bool,
        value: PropTypes.any
    };

    static defaultProps = {
        disableAutoFocus: false,
        disableKeyEvent: false,
        maxHeight: null,
        multiple: false,
        onChange: noop,
        //show: false,
        onEscKeyDown: noop,
        onItemClick: noop,
        onKeyDown: noop
    };

    constructor(props) {
        super(props);
        const filteredChildren = this.getFilteredChildren(props.children);
        const selectedIndex = this.getSelectedIndex(props, filteredChildren);
        this.state = {
            focusIndex: props.disableAutoFocus ? -1 : selectedIndex >= 0 ? selectedIndex : 0,
            isKeyboardFocused: props.initiallyKeyboardFocused
        };
    }

    componentDidMount() {
        this.setScrollPosition();
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('mousemove', this.unlockEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('mousemove', this.unlockEvent);
    }

    componentWillReceiveProps(nextProps) {
        const filteredChildren = this.getFilteredChildren(nextProps.children);
        const selectedIndex = this.getSelectedIndex(nextProps, filteredChildren);

        this.setState({
            focusIndex: nextProps.disableAutoFocus ? -1 : selectedIndex >= 0 ? selectedIndex : 0
        })
    }

    componentDidUpdate(prevProps, prevState) {
        /*if (this.refs.focusedMenuItem) {
            let focusedOptionNode = ReactDOM.findDOMNode(this.refs.focusedMenuItem);
            let menuNode = this.refs.menu;
            menuNode.scrollTop = focusedOptionNode.offsetTop;
            this.hasScrolledToOption = true;
        }*/
        this.setScrollPosition()


        if (this.props.scrollMenuIntoView && this.refs.menuContainer) {
            const menuContainerRect = this.refs.menuContainer.getBoundingClientRect();
            const winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            if (winH < menuContainerRect.bottom /* + this.props.menuBuffer*/) {
                window.scrollBy(0, menuContainerRect.bottom /* + this.props.menuBuffer*/ - winH);
            }
        }
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        return true;
    }*/

    /*handleClickAway = (event) => {
        if (event.defaultPrevented) {
            return;
        }

        this.setFocusIndex(-1, false);
    };*/

    getFilteredChildren(children) {
        const filteredChildren = [];
        React.Children.forEach(children, (child) => {
            if (child) {
                filteredChildren.push(child);
            }
        });
        return filteredChildren;
    }

    cloneMenuItem(child, childIndex, /*styles,*/ index) {
        const selected = this.isChildSelected(child, this.props);

        const isFocused = childIndex === this.state.focusIndex;
        let focusState = '';
        if (isFocused) {
            focusState = this.state.isKeyboardFocused ?
                'keyborad-focused': 'focused';
        }
        const props = {
            focusState,
            selected,
            onClick: (event) => {
                this.handleMenuItemClick(event, child, index);
                if (child.props.onClick) child.props.onClick(event);
            },
            onFocus : this.focusItem,
            index: childIndex,
            ref: isFocused ? 'focusedMenuItem' : null
        };

        return React.cloneElement(child, props);
    }

    focusItem = (index, event) => {
        if (!this.hoverLock) {
            this.setFocusIndex(index, true);
        }
    };

    decrementFocusIndex() {
        let index = this.state.focusIndex;

        index--;
        if (index < 0) index = 0;
        this.setFocusIndex(index, true);
    }

    incrementFocusIndex(filteredChildren) {
        let index = this.state.focusIndex;
        const maxIndex = this.getMenuItemCount(filteredChildren) - 1;

        index++;

        if (index > maxIndex) index = maxIndex;
        this.setFocusIndex(index, true);
    }

    isChildSelected(child, props) {
        const value = props.value;
        const childValue = child.props.value;
        if (props.multiple) {
            return value.length && value.indexOf(childValue) !== -1;
        } else {
            return child.props.value && value === childValue;
        }
    }

    setFocusIndex(newIndex, isKeyboardFocused) {
        this.setState({
            focusIndex: newIndex,
            isKeyboardFocused: isKeyboardFocused
        });
    }

    getMenuItemCount(filteredChildren) {
        let menuItemCount = 0;
        filteredChildren.forEach((child) => {
            const isDisable = child.props.disabled;
            const isDivider = child.type && child.type.isDivider;
            if (!isDisable && !isDivider) menuItemCount++;
        });

        return menuItemCount;
    }

    getSelectedIndex(props, filteredChildren) {
        let selectedIndex = -1;
        let menuItemIndex = 0;

        filteredChildren.forEach((child) => {
            const childIsDivider = child.type && child.type.isDivider;
            if (this.isChildSelected(child, props)) selectedIndex = menuItemIndex;
            if (!childIsDivider) menuItemIndex ++;
        });
        return selectedIndex;
    }

    handleKeyDown = (event) => {
        if (this.props.disableKeyEvent) return;
        const filteredChildren = this.getFilteredChildren(this.props.children);
        this.hoverLock = true;
        switch(event.keyCode) {
            case 9: //tab
                event.preventDefault();
                if (event.shiftKey) {
                    this.decrementFocusIndex();
                } else {
                    this.incrementFocusIndex(filteredChildren);
                }
                return;
            case 13: //enter
                //get focused child
                const {children} = this.props;
                if (Array.isArray(children)) {
                    const child = children[this.state.focusIndex];
                    this.handleMenuItemClick(event, child, this.state.focusIndex);
                    if (child.props.onClick) child.props.onClick(event);
                }
                //this.props.onEscKeyDown(event);
                break;
            case 27: //escape
                this.props.onEscKeyDown(event);
                break;
            case 38: //up
                event.preventDefault();
                this.decrementFocusIndex();
                break;
            case 40: //down
                event.preventDefault();
                this.incrementFocusIndex(filteredChildren);
                break;
            case 33: // page up
                break;
            case 34: // page down
                break;
            default: return;

        }

        this.props.onKeyDown(event);
    };

    unlockEvent = (event) => {
        this.hoverLock = false;
    }

    setFocusIndexStartsWith(keys) {
        let foundIndex = -1;
        const selectedVal = this.props.value;
        React.Children.forEach(this.props.children, (child, index) => {
            if (foundIndex >= 0) {
                return;
            }
            const {value} = child.props;

            if (typeof selectedVal === 'string' && selectedVal === value) {
                foundIndex = index;
            }
            if (Array.isArray(selectedVal) && selectedVal.indexOf(value) == selectedVal.length) {
                foundIndex = index;
            }
        });
        if (foundIndex >= 0) {
            this.setFocusIndex(foundIndex, true);
            return true;
        }

        return false;
    }

    handleMenuItemClick(event, item, index) {
        const {children, multiple, value} = this.props;
        const itemValue = item.props.value;
        const focusIndex = React.isValidElement(children) ? 0 : children.indexOf(item);

        this.setFocusIndex(focusIndex, false);

        if (multiple) {
            const itemIndex = value.indexOf(itemValue);
            const [...newValue] = value;
            if (itemIndex === -1) {
                newValue.push(itemIndex);
            } else {
                newValue.splice(itemIndex, 1);
            }

            this.props.onChange(event, newValue);
        } else if (!multiple && itemValue !== value) {
            this.props.onChange(event, itemValue);
        }

        this.props.onItemClick(event, item, index);
    }

    setScrollPosition() {
        if (this.refs.focusedMenuItem) {
            const focusedDOM = ReactDOM.findDOMNode(this.refs.focusedMenuItem);
            const menuDOM = this.refs.menu;
            const focusedRect = focusedDOM.getBoundingClientRect();
            const menuRect = menuDOM.getBoundingClientRect();

            if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
                menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
            }
        }
    }

    render() {
        const {
            children,
            disableAutoFocus,
            maxHeight,
            multiple,
            openDirection = 'bottom-left',
            onItemClick,
            onEscKeyDown,
            style,
            value,
            onChange,
            disableKeyEvent,
            prefixCls = 'menu',
            className,
            show,
            ...other
        } = this.props;

        const {focusIndex} = this.state;
        const openDown = openDirection.split('-')[0] === 'bottom';
        const filteredChildren = this.getFilteredChildren(children);

        let menuItemIndex = 0;
        const newChildren = React.Children.map(filteredChildren, (child, index) => {
            const childIsDivider = child.type && child.type.isDivider;
            const childIsDisabled = child.props.disabled;

            const cloneChild = childIsDivider ? React.cloneElement(child) :
                childIsDisabled ? React.cloneElement(child) :
                this.cloneMenuItem(child, menuItemIndex, /*style,*/ index);
            if (!childIsDisabled && !childIsDivider) menuItemIndex++;

            return cloneChild;
        });

        const cls = classNames({
            [`${prefixCls}-content`]: true,
            [className]: !!className
        })
        return (
            <div
                /*onKeyDown={this.handleKeyDown}*/
                ref="menuContainer"
                className={`${prefixCls}-container`}
            >
                <ul {...other}  className={cls} ref="menu" style={Object.assign({}, defaultStyle, style)}>
                    {newChildren}
                </ul>
            </div>
        );
    }
}