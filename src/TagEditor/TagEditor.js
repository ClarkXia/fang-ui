import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Input from '../Input';

const stringOrNode = React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
]);

function getStyle (el, prop) {
    if (getComputedStyle !== 'undefined') {
        return getComputedStyle(el, null).getPropertyValue(prop);
    } else {
        return el.currentStyle[prop];
    }
}

class Value extends React.Component {
    static propTypes = {
        disabled: PropTypes.bool,
        id: PropTypes.string,
        onClick: PropTypes.func,
        onRemove: PropTypes.func,
        value: PropTypes.object.isRequired,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        prefixCls: 'tag'
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

    renderRemoveIcon () {
        if (this.props.disabled || !this.props.onRemove) return;
        const className = `${this.props.prefixCls}-value-icon`;
        return (
            <span className={className} onMouseDown={this.onRemove}>
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
            <span className={className} role="option" id={this.props.id}>
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

export default class TagEditor extends React.Component {
    static propTypes = {
        autosize: PropTypes.bool,
        inputMaxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        backspaceRemove: PropTypes.bool,
        className: PropTypes.string,
        clearAllText: stringOrNode,
        clearable: PropTypes.bool,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        labelKey: PropTypes.string,
        onBlur: PropTypes.func,
        onBlurResetsInput: PropTypes.bool,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        onInputChange: PropTypes.func,
        onInputEnter: PropTypes.func,
        onValueClick: PropTypes.func,
        style: PropTypes.object,
        tabIndex: PropTypes.string,
        value: PropTypes.any,
        valueComponent: PropTypes.func,
        wrapperStyle: PropTypes.object,
        prefixCls: PropTypes.string
    };

    static defaultProps = {
        autosize: true,
        backspaceRemove: true,
        inputMaxWidth: '100%',
        clearable: false,
        disabled: false,
        inputProps: {},
        valueComponent: Value,
        prefixCls: 'tag-editor'
    };

    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
    }

    componentDidMount() {
        if (this.props.autofocus) {
            this.focus();
        }
        this.calculateInputMaxWidth();
    }

    calculateInputMaxWidth() {
        const input = ReactDOM.findDOMNode(this.refs.input);
        if (!input) return;
        const {inputMaxWidth} = this.props;


        if (inputMaxWidth) {
            const element = this.refs.control;
            //TODO border-box content-box
            const inputMarginSize = parseInt(getStyle(input, 'margin-left')) + parseInt(getStyle(input, 'margin-right'));
            const controlWidth = element.offsetWidth - parseInt(getStyle(element, 'padding-left')) - parseInt(getStyle(element, 'padding-right'))
                                - parseInt(getStyle(element, 'border-left-width')) - parseInt(getStyle(element, 'border-left-width'));
            if (inputMaxWidth.toString().indexOf('%') > -1) {
                this.inputMaxWidth = controlWidth * parseInt(inputMaxWidth) / 100 - inputMarginSize;
            } else {
                this.inputMaxWidth = inputMaxWidth;
            }
        }
    }

    focus() {
        if(!this.refs.input) return;
        ReactDOM.findDOMNode(this.refs.input).focus();
    }

    blurInput() {
        if (!this.refs.input) return;
        ReactDOM.findDOMNode(this.refs.input).blur();
    }

    handleMouseDown = (event) => {
        if (this.props.disabled || (event.type === 'mousedown') && event.button !== 0) return;

        if (event.target.tagName === 'INPUT') return;

        event.stopPropagation();
        event.preventDefault();

        this.focus();
    };

    handleInputFocus = (event) => {
        if(this.props.onFocus) {
            this.props.onFocus(event);
        }

        this.setState({
            isFocused: true
        });
    };

    handleInputBlur = (event) => {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
        const st = {
            isFocused: false
        }
        if (this.props.onBlurResetInput) {
            st.inputValue = '';
        }

        this.setState(st);
    };

    handleInputChange = (event) => {
        let newValue = event.target.value;

        if (this.state.inputValue !== event.target.value && this.props.onInputChange) {
            let nextState = this.props.onInputChange(newValue);
            if (nextState != null && typeof nextState !== 'object') {
                newValue = '' + nextState;
            }
        }

        this.setState({
            inputValue: newValue
        });
    };

    handleKeyDown = (event) => {
        if (this.props.disabled) return;
        switch (event.keyCode) {
            case 8: //backspace
                if (!this.state.inputValue && this.props.backspaceRemove) {
                    event.preventDefault();
                    this.popValue();
                }
                return;
            case 13: //enter
                this.handleInputEnter(event);
                break;
            default:
                return;
        }

        event.preventDefault();
    };

    handleValueClick(option, event) {
        if (!this.props.onValueClick) return;
        this.props.onValueClick(option, event);
    }

    getOptionLabel = (op) => {
        return this.props.labelKey ? op[this.props.labelKey] : op;
    };

    getValueArray(value, nextProps) {
        const props = typeof nextProps === 'object' ? nextProps : this.props;

        if (!Array.isArray(value)) {
            if (value === null || value === undefined) return [];
            value = [value];
        }

        return value;
    }

    handleInputEnter(event) {
        if (this.state.inputValue !== '') {
            if (this.props.onInputEnter) {
                this.props.onInputEnter(this.state.inputValue, event);
            }

            if (this.props.labelKey) {
                this.addValue({
                    [this.props.labelKey]: this.state.inputValue
                });
            } else {
                this.addValue(this.state.inputValue);
            }

            this.setState({
                inputValue: ''
            });
        }
    }

    setValue(value) {
        if (!this.props.onChange) return;
        this.props.onChange(value);
    }

    addValue(value) {
        let valueArray = this.getValueArray(this.props.value);
        this.setValue(valueArray.concat(value));
        if (this.props.onAdd) {
            this.props.onAdd(value);
        }
    }

    popValue() {
        let valueArray = this.getValueArray(this.props.value);
        if (!valueArray.length) return;
        if (this.props.onRemove) {
            this.props.onRemove(valueArray[valueArray.length - 1]);
        }
        this.setValue(valueArray.slice(0, valueArray.length - 1));

    }

    removeValue = (value) => {
        let valueArray = this.getValueArray(this.props.value);
        if (this.props.onRemove) {
            this.props.onRemove(value);
        }

        this.setValue(valueArray.filter(i => i !== value));
        this.focus();
    };

    clearValue = (event) => {
        if (event && event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.setValue([]); //reset value
        this.setState({
            inputValue: ''
        }, this.focus);
    };

    renderValue(valueArray) {
        const ValueComponent = this.props.valueComponent;
        const renderLabel = this.props.valueRender || this.getOptionLabel;
        if (!valueArray.length) {
            return null;
        }

        let onClick = this.props.onValueClick ? this.handleValueClick : null;

        return valueArray.map((value, i) => {
            return (
                <ValueComponent
                    key={`value-${i}`}
                    onClick={onClick}
                    onRemove={this.removeValue}
                    value={value}
                    disabled={this.props.disabled}
                >
                    {renderLabel(value)}
                </ValueComponent>
            );
        })
    }

    renderInput(valueArray) {
        const cls = classNames(`${this.props.prefixCls}-input`, this.props.inputProps.className);

        const inputProps = Object.assign({}, this.props.inputProps, {
            className: cls,
            tabIndex: this.props.tabIndex,
            onBlur: this.handleInputBlur,
            onChange: this.handleInputChange,
            onFocus: this.handleInputFocus,
            ref: 'input',
            value: this.state.inputValue
        });

        if (this.props.disabled) {
            const {inputClassName, ...divProps} = this.props.inputProps;

            return (
                <div
                    {...divProps}
                    className={cls}
                    tabIndex={this.props.tabIndex || 0}
                    onBlur={this.handleInputBlur}
                    onFocus={this.handleInputFocus}
                    ref="input"
                    style={{ border: 0, width: 1, display:'inline-block'}}
                />
            );
        }

        if (this.props.autosize) {
            if (this.inputMaxWidth) {
                inputProps.maxWidth = this.inputMaxWidth;
            }
            return (
                <Input {...inputProps} minWidth="5px" autoSize={true}/>
            );
        }
        return (
            <div className={cls}>
                <input {...inputProps} />
            </div>
        );
    }

    renderClear () {
        if (!this.props.clearable || !this.props.value || !this.props.value.length || this.props.disabled) return;
        return (
            <span className={`${this.props.prefixCls}-clear-zone`} title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
                onMouseDown={this.clearValue}
            >
                <span className={`${this.props.prefixCls}-clear`} dangerouslySetInnerHTML={{ __html: '&times;' }} />
            </span>
        );
    }

    render() {
        const valueArray = this.getValueArray(this.props.value);
        const cls = classNames(this.props.prefixCls, this.props.className, {
            'is-diabled': this.props.disabled,
            'is-focused': this.state.isFocused,
            'has-value': valueArray.length
        });
        return (
            <div
                ref="wrapper"
                className={cls}
                style={this.props.wrapperStyle}
            >
                <div
                    ref="control"
                    className={`${this.props.prefixCls}-control`}
                    style={this.props.style}
                    onKeyDown={this.handleKeyDown}
                    onMouseDown={this.handleMouseDown}
                >
                    <span className={`${this.props.prefixCls}-value-wrapper`}>
                        {this.renderValue(valueArray)}
                        {this.renderInput(valueArray)}
                    </span>
                    {this.renderClear()}
                </div>
            </div>
        );
    }

}