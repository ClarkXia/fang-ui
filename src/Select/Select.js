import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const stringOrNode = React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
]);

function stringifyValue (value) {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    } else {
        return value;
    }
}

let instanceId = 1;

class Value extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        disabled: PropTypes.bool,
        id: PropTypes.string,
        onClick: PropTypes.func,
        onRemove: PropTypes.func,
        value: PropTypes.object.isRequired,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'select'
    }

    handleMouseDown (event) {
        if (event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        if (this.props.onClick) {
            event.stopPropagation();
            this.props.onClick(this.props.value, event);
            return;
        }
        if (this.props.value.href) {
            event.stopPropagation();
        }
    }

    onRemove = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onRemove(this.props.value);
    }

    handleTouchEndRemove (event){
        if(this.dragging) return;

        // Fire the mouse events
        this.onRemove(event);
    }

    handleTouchMove (event) {
        this.dragging = true;
    }

    handleTouchStart (event) {
        this.dragging = false;
    }

    renderRemoveIcon () {
        if (this.props.disabled || !this.props.onRemove) return;
        const className = `${this.props.prefixCls}-value-icon`;
        return (
            <span className={className}
                onMouseDown={this.onRemove}
                onTouchEnd={this.handleTouchEndRemove}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}>
                &times;
            </span>
        );
    }

    renderLabel () {
        let className = `${this.props.prefixCls}-value-label`;
        return this.props.onClick || this.props.value.href ? (
            <a className={className} href={this.props.value.href} target={this.props.value.target} onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
                {this.props.children}
            </a>
        ) : (
            <span className={className} role="option" aria-selected="true" id={this.props.id}>
                {this.props.children}
            </span>
        );
    }

    render () {
        return (
            <div className={classNames(`${this.props.prefixCls}-value`, this.props.value.className)}
                style={this.props.value.style}
                title={this.props.value.title}
                >
                {this.renderLabel()}
                {this.renderRemoveIcon()}
            </div>
        );
    }
}

class Option extends React.Component {
    static propTypes = {
        children: React.PropTypes.node,
        className: React.PropTypes.string,
        instancePrefix: React.PropTypes.string.isRequired,
        isDisabled: React.PropTypes.bool,
        isFocused: React.PropTypes.bool,
        isSelected: React.PropTypes.bool,
        onFocus: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        onUnfocus: React.PropTypes.func,
        option: React.PropTypes.object.isRequired,
        optionIndex: React.PropTypes.number
    };

    blockEvent (event) {
        event.preventDefault();
        event.stopPropagation();
        if ((event.target.tagName !== 'A') || !('href' in event.target)) {
            return;
        }
        if (event.target.target) {
            window.open(event.target.href, event.target.target);
        } else {
            window.location.href = event.target.href;
        }
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(this.props.isSelected);
        if (this.props.isSelected) {
            console.log(this.props.option)
            this.props.onRemove(this.props.option)
        } else {
            this.props.onSelect(this.props.option, event);
        }
    };

    handleMouseEnter = (event) => {
        this.onFocus(event);
    };

    handleMouseMove = (event) => {
        this.onFocus(event);
    };

    handleTouchEnd = (event) => {
        // Check if the view is being dragged, In this case
        // we don't want to fire the click event (because the user only wants to scroll)
        if(this.dragging) return;

        this.handleMouseDown(event);
    };

    handleTouchMove = (event) => {
        // Set a flag that the view is being dragged
        this.dragging = true;
    };

    handleTouchStart = (event) => {
        // Set a flag that the view is not being dragged
        this.dragging = false;
    };

    onFocus = (event) => {
        if (!this.props.isFocused) {
            this.props.onFocus(this.props.option, event);
        }
    };

    render () {
        var { option, instancePrefix, optionIndex } = this.props;
        var className = classNames(this.props.className, option.className);

        return option.disabled ? (
            <div className={className}
                onMouseDown={this.blockEvent}
                onClick={this.blockEvent}>
                {this.props.children}
            </div>
        ) : (
            <div className={className}
                style={option.style}
                role="option"
                onMouseDown={this.handleMouseDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseMove}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                id={instancePrefix + '-option-' + optionIndex}
                title={option.title}>
                {this.props.children}
            </div>
        );
    }
}


export default class Select extends React.Component {
    static propTypes = {
        addLabelText: PropTypes.string,
        allowCreate: PropTypes.bool,
        autoBlur: PropTypes.bool,
        autofocus: PropTypes.bool,
        autosize: PropTypes.bool,
        backspaceRemoves: PropTypes.bool,
        className: PropTypes.string,
        clearAllText: stringOrNode,
        clearValueText: stringOrNode,
        clearable: PropTypes.bool,
        delimiter: PropTypes.string,
        disabled: PropTypes.bool,
        escapeClearsValue: PropTypes.bool,
        filterOption: PropTypes.func,
        filterOptions: PropTypes.any,
        inputProps: PropTypes.object,
        inputRenderer: PropTypes.func,
        isLoading: PropTypes.bool,
        joinValues: PropTypes.bool,
        labelKey: PropTypes.string,
        matchPos: PropTypes.string,
        matchProp: PropTypes.string,
        menuBuffer: PropTypes.number,
        menuContainerStyle: PropTypes.object,
        menuRenderer: PropTypes.func,
        menuStyle: PropTypes.object,
        multi: PropTypes.bool,
        name: PropTypes.string,
        newOptionCreator: PropTypes.func,
        noResultsText: stringOrNode,
        onBlur: PropTypes.func,
        onBlurResetsInput: PropTypes.bool,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onFocus: PropTypes.func,
        onInputChange: PropTypes.func,
        onMenuScrollToBottom: PropTypes.func,
        onOpen: PropTypes.func,
        onValueClick: PropTypes.func,
        openAfterFocus: PropTypes.bool,
        openOnFocus: PropTypes.bool,
        optionClassName: PropTypes.string,
        optionComponent: PropTypes.func,
        optionRenderer: PropTypes.func,
        options: PropTypes.array,
        pageSize: PropTypes.number,
        placeholder: stringOrNode,
        required: PropTypes.bool,
        resetValue: PropTypes.any,
        scrollMenuIntoView: PropTypes.bool,
        searchable: PropTypes.bool,
        simpleValue: PropTypes.bool,
        style: PropTypes.object,
        tabIndex: PropTypes.string,
        tabSelectsValue: PropTypes.bool,
        value: PropTypes.any,
        valueComponent: PropTypes.func,
        valueKey: PropTypes.string,
        valueRenderer: PropTypes.func,
        wrapperStyle: PropTypes.object,
        prefixCls: PropTypes.string,
        preserveInputValue: PropTypes.bool
    };

    static defaultProps = {
        addLabelText: 'Add "{label}"?',
        autosize: true,
        allowCreate: false,
        backspaceRemoves: true,
        clearable: true,
        clearAllText: 'Clear all',
        clearValueText: 'Clear value',
        delimiter: ',',
        disabled: false,
        escapeClearsValue: true,
        filterOptions: true,
        inputProps: {},
        isLoading: false,
        joinValues: false,
        labelKey: 'label',
        matchPos: 'any',
        matchProp: 'any',
        menuBuffer: 0,
        multi: false,
        noResultsText: 'No results found',
        onBlurResetsInput: true,
        openAfterFocus: false,
        optionComponent: Option,
        pageSize: 5,
        placeholder: 'Select...',
        required: false,
        scrollMenuIntoView: true,
        searchable: true,
        simpleValue: false,
        tabSelectsValue: true,
        valueComponent: Value,
        valueKey: 'value',
        prefixCls: 'select',
        preserveInputValue: false
    };

    constructor (props) {
        super(props);
        this.state = {
            inputValue: '',
            isFocused: false,
            isLoading: false,
            isOpen: false,
            isPseudoFocused: false,
            required: false
        };
    }

    componentWillMount () {
        this._instancePrefix = 'react-select-' + (++instanceId) + '-';
        const valueArray = this.getValueArray(this.props.value);

        if (this.props.required) {
            this.setState({
                required: this.handleRequired(valueArray[0], this.props.multi)
            });
        }
    }

    componentDidMount () {
        if (this.props.autofocus) {
            this.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        const valueArray = this.getValueArray(nextProps.value, nextProps);

        if (nextProps.required) {
            this.setState({
                required: this.handleRequired(valueArray[0], nextProps.multi)
            });
        }
    }

    componentWillUpdate (nextProps, nextState) {
        if (nextState.isOpen !== this.state.isOpen) {
            const handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
            handler && handler();
        }
    }

    componentDidUpdate (prevProps, prevState) {
        // focus to the selected option
        if (this.refs.menu && this.refs.focused && this.state.isOpen && !this.hasScrolledToOption) {
            let focusedOptionNode = ReactDOM.findDOMNode(this.refs.focused);
            let menuNode = ReactDOM.findDOMNode(this.refs.menu);
            menuNode.scrollTop = focusedOptionNode.offsetTop;
            this.hasScrolledToOption = true;
        } else if (!this.state.isOpen) {
            this.hasScrolledToOption = false;
        }

        if (this._scrollToFocusedOptionOnUpdate && this.refs.focused && this.refs.menu) {
            this._scrollToFocusedOptionOnUpdate = false;
            var focusedDOM = ReactDOM.findDOMNode(this.refs.focused);
            var menuDOM = ReactDOM.findDOMNode(this.refs.menu);
            var focusedRect = focusedDOM.getBoundingClientRect();
            var menuRect = menuDOM.getBoundingClientRect();
            if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
                menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
            }
        }
        if (this.props.scrollMenuIntoView && this.refs.menuContainer) {
            var menuContainerRect = this.refs.menuContainer.getBoundingClientRect();
            const winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            if (winH < menuContainerRect.bottom + this.props.menuBuffer) {
                window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - winH);
            }
        }
        if (prevProps.disabled !== this.props.disabled) {
            this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
            this.closeMenu();
        }
    }

    focus () {
        if (!this.refs.input) return;
        this.refs.input.focus();

        if (this.props.openAfterFocus) {
            this.setState({
                isOpen: true
            });
        }
    }

    blurInput() {
        if (!this.refs.input) return;
        this.refs.input.blur();
    }

    handleTouchMove = (event) => {
        // Set a flag that the view is being dragged
        this.dragging = true;
    };

    handleTouchStart = (event) => {
        // Set a flag that the view is not being dragged
        this.dragging = false;
    };

    handleTouchEnd = (event) => {
        // Check if the view is being dragged, In this case
        // we don't want to fire the click event (because the user only wants to scroll)
        if(this.dragging) return;

        // Fire the mouse events
        this.handleMouseDown(event);
    };

    handleTouchEndClearValue (event) {
        // Check if the view is being dragged, In this case
        // we don't want to fire the click event (because the user only wants to scroll)
        if(this.dragging) return;

        // Clear the value
        this.clearValue(event);
    }

    handleMouseDown =  (event) => {
        // if the event was triggered by a mousedown and not the primary
        // button, or if the component is disabled, ignore it.
        if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
            return;
        }

        if (event.target.tagName === 'INPUT') {
            return;
        }

        // prevent default event handlers
        event.stopPropagation();
        event.preventDefault();

        // for the non-searchable select, toggle the menu
        if (!this.props.searchable) {
            this.focus();
            return this.setState({
                isOpen: !this.state.isOpen
            });
        }

        if (this.state.isFocused) {
            // On iOS, we can get into a state where we think the input is focused but it isn't really,
            // since iOS ignores programmatic calls to input.focus() that weren't triggered by a click event.
            // Call focus() again here to be safe.
            this.focus();

            let input = this.refs.input;
            if (typeof input.getInput === 'function') {
                // Get the actual DOM input if the ref is an <Input /> component
                input = input.getInput();
            }

            // clears the value so that the cursor will be at the end of input when the component re-renders
            input.value = '';

            // if the input is focused, ensure the menu is open
            this.setState({
                isOpen: true,
                isPseudoFocused: false
            });
        } else {
            // otherwise, focus the input and open the menu
            this._openAfterFocus = true;
            this.focus();
        }
    };

    handleMouseDownOnArrow (event) {
        // if the event was triggered by a mousedown and not the primary
        // button, or if the component is disabled, ignore it.
        if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
            return;
        }
        // If the menu isn't open, let the event bubble to the main handleMouseDown
        if (!this.state.isOpen) {
            return;
        }
        // prevent default event handlers
        event.stopPropagation();
        event.preventDefault();
        // close the menu
        this.closeMenu();
    }

    handleMouseDownOnMenu (event) {
        // if the event was triggered by a mousedown and not the primary
        // button, or if the component is disabled, ignore it.
        if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        this._openAfterFocus = true;
        this.focus();
    }

    closeMenu () {
        this.setState({
            isOpen: false,
            isPseudoFocused: this.state.isFocused && !this.props.multi,
            inputValue: ''
        });
        this.hasScrolledToOption = false;
    }

    handleInputFocus = (event) => {
        var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
        this.setState({
            isFocused: true,
            isOpen: isOpen
        });
        this._openAfterFocus = false;
    };

    handleInputBlur = (event) => {
        if (this.refs.menu && (this.refs.menu === document.activeElement || this.refs.menu.contains(document.activeElement))) {
            this.focus();
            return;
        }

        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
        var onBlurredState = {
            isFocused: false,
            isOpen: false,
            isPseudoFocused: false
        };
        if (this.props.onBlurResetsInput) {
            onBlurredState.inputValue = '';
        }
        this.setState(onBlurredState);
    };

    handleInputChange = (event) => {
        let newInputValue = event.target.value;
        if (this.state.inputValue !== event.target.value && this.props.onInputChange) {
            let nextState = this.props.onInputChange(newInputValue);
            // Note: != used deliberately here to catch undefined and null
            if (nextState != null && typeof nextState !== 'object') {
                newInputValue = '' + nextState;
            }
        }

        this.setState({
            isOpen: true,
            isPseudoFocused: false,
            inputValue: newInputValue
        });
    };

    handleKeyDown = (event) => {
        if (this.props.disabled) return;
        switch (event.keyCode) {
            case 8: // backspace
                if (!this.state.inputValue && this.props.backspaceRemoves) {
                    event.preventDefault();
                    this.popValue();
                }
            return;
            case 9: // tab
                if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
                    return;
                }
                this.selectFocusedOption();
            return;
            case 13: // enter
                if (!this.state.isOpen) return;
                event.stopPropagation();
                this.selectFocusedOption();
            break;
            case 27: // escape
                if (this.state.isOpen) {
                    this.closeMenu();
                    event.stopPropagation();
                } else if (this.props.clearable && this.props.escapeClearsValue) {
                    this.clearValue(event);
                    event.stopPropagation();
                }
            break;
            case 38: // up
                this.focusPreviousOption();
            break;
            case 40: // down
                this.focusNextOption();
            break;
            case 33: // page up
                this.focusPageUpOption();
            break;
            case 34: // page down
                this.focusPageDownOption();
            break;
            case 35: // end key
                this.focusEndOption();
            break;
            case 36: // home key
                this.focusStartOption();
            break;
            // case 188: // ,
            //  if (this.props.allowCreate && this.props.multi) {
            //      event.preventDefault();
            //      event.stopPropagation();
            //      this.selectFocusedOption();
            //  } else {
            //      return;
            //  }
            // break;
            default: return;
        }
        event.preventDefault();
    }

    handleValueClick (option, event) {
        if (!this.props.onValueClick) return;
        this.props.onValueClick(option, event);
    }

    handleMenuScroll (event) {
        if (!this.props.onMenuScrollToBottom) return;
        let { target } = event;
        if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
            this.props.onMenuScrollToBottom();
        }
    }

    handleRequired (value, multi) {
        if (!value) return true;
        return (multi ? value.length === 0 : Object.keys(value).length === 0);
    }

    getOptionLabel = (op) => {
        return op[this.props.labelKey];
    };

    /**
     * Turns a value into an array from the given options
     * @param   {String|Number|Array}   value       - the value of the select input
     * @param   {Object}        nextProps   - optionally specify the nextProps so the returned array uses the latest configuration
     * @returns {Array} the value of the select represented in an array
     */
    getValueArray (value, nextProps) {
        /** support optionally passing in the `nextProps` so `componentWillReceiveProps` updates will function as expected */
        const props = typeof nextProps === 'object' ? nextProps : this.props;
        if (props.multi) {
            if (typeof value === 'string') value = value.split(props.delimiter);
            if (!Array.isArray(value)) {
                if (value === null || value === undefined) return [];
                value = [value];
            }
            return value.map(value => this.expandValue(value, props)).filter(i => i);
        }
        var expandedValue = this.expandValue(value, props);
        return expandedValue ? [expandedValue] : [];
    }

    /**
     * Retrieve a value from the given options and valueKey
     * @param   {String|Number|Array}   value   - the selected value(s)
     * @param   {Object}        props   - the Select component's props (or nextProps)
     */
    expandValue (value, props) {
        if (typeof value !== 'string' && typeof value !== 'number') return value;
        let { options, valueKey } = props;
        if (!options) return;
        for (var i = 0; i < options.length; i++) {
            if (options[i][valueKey] === value) return options[i];
        }
    }

    setValue (value) {
        if (this.props.autoBlur){
            this.blurInput();
        }
        if (!this.props.onChange) return;
        if (this.props.required) {
            const required = this.handleRequired(value, this.props.multi);
            this.setState({ required });
        }
        if (this.props.simpleValue && value) {
            value = this.props.multi ? value.map(i => i[this.props.valueKey]).join(this.props.delimiter) : value[this.props.valueKey];
        }
        this.props.onChange(value);
    }

    selectValue = (value) => {
        //NOTE: update value in the callback to make sure the input value is empty so that there are no sttyling issues (Chrome had issue otherwise)

        //checkvlaue
        const valueArray = this.getValueArray(this.props.value);
        if (valueArray && valueArray.indexOf(value) > -1){
            this.removeValue(value);
            return;
        }

        this.hasScrolledToOption = false;
        if (this.props.multi) {
            this.setState({
                inputValue: '',
                focusedIndex: null
            }, () => {
                this.addValue(value);
            });
        } else {
            this.setState({
                isOpen: false,
                inputValue: '',
                isPseudoFocused: this.state.isFocused
            }, () => {
                this.setValue(value);
            });
        }
    }

    addValue (value) {
        var valueArray = this.getValueArray(this.props.value);
        this.setValue(valueArray.concat(value));
    }

    popValue () {
        var valueArray = this.getValueArray(this.props.value);
        if (!valueArray.length) return;
        if (valueArray[valueArray.length-1].clearableValue === false) return;
        this.setValue(valueArray.slice(0, valueArray.length - 1));
    }

    removeValue = (value) => {
        console.log(value)
        var valueArray = this.getValueArray(this.props.value);
        console.log(valueArray);
        this.setValue(valueArray.filter(i => i !== value));
        this.focus();
    }

    clearValue = (event) => {
        // if the event was triggered by a mousedown and not the primary
        // button, ignore it.
        if (event && event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.setValue(this.getResetValue());
        this.setState({
            isOpen: false,
            inputValue: ''
        }, this.focus);
    }

    getResetValue() {
        if (this.props.resetValue !== undefined) {
            return this.props.resetValue;
        } else if (this.props.multi) {
            return [];
        } else {
            return null;
        }
    }

    focusOption = (option) => {
        this.setState({
            focusedOption: option
        });
    };

    focusNextOption () {
        this.focusAdjacentOption('next');
    }

    focusPreviousOption () {
        this.focusAdjacentOption('previous');
    }

    focusPageUpOption () {
        this.focusAdjacentOption('page_up');
    }

    focusPageDownOption () {
        this.focusAdjacentOption('page_down');
    }

    focusStartOption () {
        this.focusAdjacentOption('start');
    }

    focusEndOption () {
        this.focusAdjacentOption('end');
    }

    focusAdjacentOption (dir) {
        var options = this._visibleOptions
            .map((option, index) => ({ option, index }))
            .filter(option => !option.option.disabled);
        this._scrollToFocusedOptionOnUpdate = true;
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
                inputValue: '',
                focusedOption: this._focusedOption || options[dir === 'next' ? 0 : options.length - 1].option
            });
            return;
        }
        if (!options.length) return;
        var focusedIndex = -1;
        for (var i = 0; i < options.length; i++) {
            if (this._focusedOption === options[i].option) {
                focusedIndex = i;
                break;
            }
        }
        if (dir === 'next' && focusedIndex !== -1 ) {
            focusedIndex = (focusedIndex + 1) % options.length;
        } else if (dir === 'previous') {
            if (focusedIndex > 0) {
                focusedIndex = focusedIndex - 1;
            } else {
                focusedIndex = options.length - 1;
            }
        } else if (dir === 'start') {
            focusedIndex = 0;
        } else if (dir === 'end') {
            focusedIndex = options.length - 1;
        } else if (dir === 'page_up') {
            var potentialIndex = focusedIndex - this.props.pageSize;
            if ( potentialIndex < 0 ) {
                focusedIndex = 0;
            } else {
                focusedIndex = potentialIndex;
            }
        } else if (dir === 'page_down') {
            var potentialIndex = focusedIndex + this.props.pageSize;
            if ( potentialIndex > options.length - 1 ) {
                focusedIndex = options.length - 1;
            } else {
                focusedIndex = potentialIndex;
            }
        }

        if (focusedIndex === -1) {
            focusedIndex = 0;
        }

        this.setState({
            focusedIndex: options[focusedIndex].index,
            focusedOption: options[focusedIndex].option
        });
    }

    selectFocusedOption () {
        // if (this.props.allowCreate && !this.state.focusedOption) {
        //  return this.selectValue(this.state.inputValue);
        // }
        if (this._focusedOption) {
            return this.selectValue(this._focusedOption);
        }
    }

    renderLoading () {
        if (!this.props.isLoading) return;
        return (
            <span className="Select-loading-zone" aria-hidden="true">
                <span className="Select-loading" />
            </span>
        );
    }

    renderValue (valueArray, isOpen) {
        let renderLabel = this.props.valueRenderer || this.getOptionLabel;
        let ValueComponent = this.props.valueComponent;
        if (!valueArray.length) {
            return !this.state.inputValue ? <div className="Select-placeholder">{this.props.placeholder}</div> : null;
        }
        let onClick = this.props.onValueClick ? this.handleValueClick : null;
        if (this.props.multi) {
            return valueArray.map((value, i) => {
                return (
                    <ValueComponent
                        id={this._instancePrefix + '-value-' + i}
                        instancePrefix={this._instancePrefix}
                        disabled={this.props.disabled || value.clearableValue === false}
                        key={`value-${i}-${value[this.props.valueKey]}`}
                        onClick={onClick}
                        onRemove={this.removeValue}
                        value={value}
                    >
                        {renderLabel(value)}
                        <span className="Select-aria-only">&nbsp;</span>
                    </ValueComponent>
                );
            });
        } else if (!this.state.inputValue) {
            if (isOpen) onClick = null;
            return (
                <ValueComponent
                    id={this._instancePrefix + '-value-item'}
                    disabled={this.props.disabled}
                    instancePrefix={this._instancePrefix}
                    onClick={onClick}
                    value={valueArray[0]}
                >
                    {renderLabel(valueArray[0])}
                </ValueComponent>
            );
        }
    }

    renderInput (valueArray, focusedOptionIndex) {
        if (this.props.inputRenderer) {
            return this.props.inputRenderer();
        } else {
            var className = classNames('Select-input', this.props.inputProps.className);
            const isOpen = !!this.state.isOpen;

            const ariaOwns = classNames({
                [this._instancePrefix + '-list']: isOpen,
                [this._instancePrefix + '-backspace-remove-message']: this.props.multi
                    && !this.props.disabled
                    && this.state.isFocused
                    && !this.state.inputValue
            });

            // TODO: Check how this project includes Object.assign()
            const inputProps = Object.assign({}, this.props.inputProps, {
                role: 'combobox',
                className: className,
                tabIndex: this.props.tabIndex,
                onBlur: this.handleInputBlur,
                onChange: this.handleInputChange,
                onFocus: this.handleInputFocus,
                ref: 'input',
                required: this.state.required,
                value: this.state.inputValue
            });

            if (this.props.disabled || !this.props.searchable) {
                const { inputClassName, ...divProps } = this.props.inputProps;
                return (
                    <div
                        {...divProps}
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-owns={isOpen ? this._instancePrefix + '-list' : this._instancePrefix + '-value'}
                        aria-activedescendant={isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value'}
                        className={className}
                        tabIndex={this.props.tabIndex || 0}
                        onBlur={this.handleInputBlur}
                        onFocus={this.handleInputFocus}
                        ref="input"
                        aria-readonly={'' + !!this.props.disabled}
                        style={{ border: 0, width: 1, display:'inline-block' }}/>
                );
            }

            if (this.props.autosize) {
                return (
                    /*<Input {...inputProps} minWidth="5px" />*/
                    <input {...inputProps} />
                );
            }
            return (
                <div className={ className }>
                    <input {...inputProps} />
                </div>
            );
        }
    }

    renderClear () {
        if (!this.props.clearable || !this.props.value || (this.props.multi && !this.props.value.length) || this.props.disabled || this.props.isLoading) return;
        return (
            <span className="Select-clear-zone" title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
                onMouseDown={this.clearValue}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEndClearValue}
            >
                <span className="Select-clear" dangerouslySetInnerHTML={{ __html: '&times;' }} />
            </span>
        );
    }

    renderArrow () {
        return (
            <span className="Select-arrow-zone" onMouseDown={this.handleMouseDownOnArrow}>
                <span className="Select-arrow" onMouseDown={this.handleMouseDownOnArrow} />
            </span>
        );
    }

    filterOptions (excludeOptions) {
        var filterValue = this.state.inputValue;
        var options = this.props.options || [];
        if (typeof this.props.filterOptions === 'function') {
            return this.props.filterOptions.call(this, options, filterValue, excludeOptions);
        } else if (this.props.filterOptions) {
            /*if (this.props.ignoreAccents) {
                filterValue = stripDiacritics(filterValue);
            }
            if (this.props.ignoreCase) {
                filterValue = filterValue.toLowerCase();
            }*/
            if (excludeOptions) excludeOptions = excludeOptions.map(i => i[this.props.valueKey]);
            return options.filter(option => {
                if (excludeOptions && excludeOptions.indexOf(option[this.props.valueKey]) > -1) return false;
                if (this.props.filterOption) return this.props.filterOption.call(this, option, filterValue);
                if (!filterValue) return true;
                var valueTest = String(option[this.props.valueKey]);
                var labelTest = String(option[this.props.labelKey]);
                /*if (this.props.ignoreAccents) {
                    if (this.props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
                    if (this.props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
                }
                if (this.props.ignoreCase) {
                    if (this.props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
                    if (this.props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
                }*/
                return this.props.matchPos === 'start' ? (
                    (this.props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
                    (this.props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
                ) : (
                    (this.props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0) ||
                    (this.props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0)
                );
            });
        } else {
            return options;
        }
    }

    renderMenu (options, valueArray, focusedOption) {
        if (options && options.length) {
            if (this.props.menuRenderer) {
                return this.props.menuRenderer({
                    focusedOption,
                    focusOption: this.focusOption,
                    labelKey: this.props.labelKey,
                    options,
                    selectValue: this.selectValue,
                    valueArray
                });
            } else {
                let Option = this.props.optionComponent;
                let renderLabel = this.props.optionRenderer || this.getOptionLabel;

                return options.map((option, i) => {
                    let isSelected = valueArray && valueArray.indexOf(option) > -1;
                    let isFocused = option === focusedOption;
                    let optionRef = isFocused ? 'focused' : null;
                    let optionClass = classNames(this.props.optionClassName, {
                        [`${this.props.prefixCls}-option`]: true,
                        'selected': isSelected,
                        'focused': isFocused,
                        'disabled': option.disabled
                    });

                    return (
                        <Option
                            instancePrefix={this._instancePrefix}
                            optionIndex={i}
                            className={optionClass}
                            isDisabled={option.disabled}
                            isFocused={isFocused}
                            key={`option-${i}-${option[this.props.valueKey]}`}
                            onSelect={this.selectValue}
                            onRemove={this.removeValue}
                            onFocus={this.focusOption}
                            option={option}
                            isSelected={isSelected}
                            ref={optionRef}
                            >
                            {renderLabel(option)}
                        </Option>
                    );
                });
            }
        } else if (this.props.noResultsText) {
            return (
                <div className="Select-noresults">
                    {this.props.noResultsText}
                </div>
            );
        } else {
            return null;
        }
    }

    renderHiddenField (valueArray) {
        if (!this.props.name) return;
        if (this.props.joinValues) {
            let value = valueArray.map(i => stringifyValue(i[this.props.valueKey])).join(this.props.delimiter);
            return (
                <input
                    type="hidden"
                    ref="value"
                    name={this.props.name}
                    value={value}
                    disabled={this.props.disabled} />
            );
        }
        return valueArray.map((item, index) => (
            <input key={'hidden.' + index}
                type="hidden"
                ref={'value' + index}
                name={this.props.name}
                value={stringifyValue(item[this.props.valueKey])}
                disabled={this.props.disabled} />
        ));
    }

    getFocusableOptionIndex (selectedOption) {
        var options = this._visibleOptions;
        if (!options.length) return null;

        let focusedOption = this.state.focusedOption || selectedOption;
        if (focusedOption && !focusedOption.disabled) {
            const focusedOptionIndex = options.indexOf(focusedOption);
            if (focusedOptionIndex !== -1) {
                return focusedOptionIndex;
            }
        }

        for (var i = 0; i < options.length; i++) {
            if (!options[i].disabled) return i;
        }
        return null;
    }

    renderOuter (options, valueArray, focusedOption) {
        let menu = this.renderMenu(options, valueArray, focusedOption);
        if (!menu) {
            return null;
        }

        return (
            <div ref="menuContainer" className="Select-menu-outer" style={this.props.menuContainerStyle}>
                <div ref="menu" role="listbox" className="Select-menu" id={this._instancePrefix + '-list'}
                         style={this.props.menuStyle}
                         onScroll={this.handleMenuScroll}
                         onMouseDown={this.handleMouseDownOnMenu}>
                    {menu}
                </div>
            </div>
        );
    }

    render () {
        let valueArray = this.getValueArray(this.props.value);
        let options = this._visibleOptions = this.filterOptions(this.props.multi ? valueArray : null);
        let isOpen = this.state.isOpen;
        if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
        const focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);

        let focusedOption = null;
        if (focusedOptionIndex !== null) {
            focusedOption = this._focusedOption = this._visibleOptions[focusedOptionIndex];
        } else {
            focusedOption = this._focusedOption = null;
        }
        let className = classNames('Select', this.props.className, {
            'Select--multi': this.props.multi,
            'Select--single': !this.props.multi,
            'is-disabled': this.props.disabled,
            'is-focused': this.state.isFocused,
            'is-loading': this.props.isLoading,
            'is-open': isOpen,
            'is-pseudo-focused': this.state.isPseudoFocused,
            'is-searchable': this.props.searchable,
            'has-value': valueArray.length
        });

        return (
            <div ref="wrapper"
                 className={className}
                 style={this.props.wrapperStyle}>
                {this.renderHiddenField(valueArray)}
                <div ref="control"
                    className="Select-control"
                    style={this.props.style}
                    onKeyDown={this.handleKeyDown}
                    onMouseDown={this.handleMouseDown}
                    onTouchEnd={this.handleTouchEnd}
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                >
                    <span className="Select-multi-value-wrapper" id={this._instancePrefix + '-value'}>
                        {this.renderValue(valueArray, isOpen)}
                        {this.renderInput(valueArray, focusedOptionIndex)}
                    </span>
                    {this.renderLoading()}
                    {this.renderClear()}
                    {this.renderArrow()}
                </div>
                {isOpen ? this.renderOuter(options, valueArray, focusedOption) : null}
            </div>
        );
    }
}