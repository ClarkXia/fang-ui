import React from 'react';
import PropTypes from 'prop-types';
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
        maxHeight: PropTypes.number,
        multiple: PropTypes.bool,
        onChange: PropTypes.func,
        onEscKeyDown: PropTypes.func,
        onItemSelect: PropTypes.func,
        onKeyDown: PropTypes.func,
        selectedMenuItemStyle: PropTypes.object,
        style: PropTypes.object,
        disableKeyEvent: PropTypes.bool,
        value: PropTypes.any,
        bottomBuffer: PropTypes.number,
        loopList: PropTypes.bool
    };

    static defaultProps = {
        disableAutoFocus: false,
        disableKeyEvent: false,
        maxHeight: null,
        multiple: false,
        onChange: noop,
        //show: false,
        onEscKeyDown: noop,
        onItemSelect: noop,
        onKeyDown: noop,
        bottomBuffer: 0,
        loopList: false
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

        //TODO
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
                'keyboard-focused': 'focused';
        }
        const props = {
            focusState,
            selected,
            onClick: (event) => {
                this.handleMenuItemSelect(event, child, index);
                if (child.props.onClick) child.props.onClick(event);
            },
            onFocus : this.focusItem,
            index: childIndex,
            ref: selected ? 'selectedMenuItem' : (isFocused ? 'focusedMenuItem' : null)
        };

        return React.cloneElement(child, props);
    }

    focusItem = (index, event) => {
        if (!this.hoverLock) {
            this.setFocusIndex(index, false);
        }
    };

    decrementFocusIndex(filteredChildren) {
        let index = this.state.focusIndex;

        index--;
        if (index < 0) {
            index = this.props.loopList ? (this.getMenuItemCount(filteredChildren) - 1) : 0;
        }
        this.setFocusIndex(index, true);
    }

    incrementFocusIndex(filteredChildren) {
        let index = this.state.focusIndex;
        const maxIndex = this.getMenuItemCount(filteredChildren) - 1;

        index++;

        if (index > maxIndex) {
            index = this.props.loopList ? 0 : maxIndex;
        }
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
        if (this.state.focusIndex !== newIndex || this.state.isKeyboardFocused !== isKeyboardFocused) {
            this._scrollToFocusedOption = true;
            this.setState({
                focusIndex: newIndex,
                isKeyboardFocused: isKeyboardFocused
            });
        }

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
            const childIsDisabled = child.props.disabled;
            if (this.isChildSelected(child, props)) selectedIndex = menuItemIndex;
            if (!childIsDivider && !childIsDisabled) menuItemIndex ++;
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
                    this.decrementFocusIndex(filteredChildren);
                } else {
                    this.incrementFocusIndex(filteredChildren);
                }
                return;
            case 13: //enter
                //get focused child
                let focusedChild, menuItemIndex = 0;
                filteredChildren.forEach((child) => {
                    const childIsDivider = child.type && child.type.isDivider;
                    const childIsDisabled = child.props.disabled;
                    if (menuItemIndex == this.state.focusIndex) focusedChild = child;
                    if (!childIsDivider && !childIsDisabled) menuItemIndex ++;
                });

                this.handleMenuItemSelect(event, focusedChild, this.state.focusIndex);
                if (focusedChild.props.onClick) focusedChild.props.onClick(event);
                break;
            case 27: //escape
                this.props.onEscKeyDown(event);
                break;
            case 38: //up
                event.preventDefault();
                this.decrementFocusIndex(filteredChildren);
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

    handleMenuItemSelect(event, item, index) {
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

        this.props.onItemSelect(event, item, index);
    }

    setScrollPosition() {
        const menuDOM = this.refs.menu;

        if (!this._scrollToOption) {
            if (this.refs.selectedMenuItem) {
                const seletedDOM = ReactDOM.findDOMNode(this.refs.selectedMenuItem);
                menuDOM.scrollTop = seletedDOM.offsetTop;
            }
            this._scrollToOption = true;
        }

        if (this.refs.focusedMenuItem || this.refs.selectedMenuItem) {
            const focusedDOM = ReactDOM.findDOMNode(this.refs.focusedMenuItem || this.refs.selectedMenuItem);
            const focusedRect = focusedDOM.getBoundingClientRect();
            const menuRect = menuDOM.getBoundingClientRect();


            if (this._scrollToFocusedOption) {
                this._scrollToFocusedOption = false;
                /*if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
                    menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
                }*/

                if (focusedRect.bottom > menuRect.bottom) {
                    menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight + this.props.bottomBuffer;
                } else if (focusedRect.top < menuRect.top) {
                    menuDOM.scrollTop = focusedDOM.offsetTop;
                }
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
            onItemSelect,
            onEscKeyDown,
            style,
            value,
            onChange,
            disableKeyEvent,
            prefixCls = 'menu',
            className,
            bottomBuffer,
            loopList,
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
        });
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