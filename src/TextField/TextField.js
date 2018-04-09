import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Input from '../Input';

const noop = () => {};
export default class TextField extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        disabled: PropTypes.bool,
        value: PropTypes.any,
        defaultValue: PropTypes.any,
        className: PropTypes.string,
        action: PropTypes.element,
        prefixCls: PropTypes.string,
        autoSize: PropTypes.bool,
        onPressEnter: PropTypes.func,
        onKeyDown: PropTypes.func,
        clearable: PropTypes.bool,
        addonBefore: PropTypes.node,
        addonAfter: PropTypes.node
    };

    static defaultProps = {
        defaultValue: '',
        disabled: false,
        autoSize: false,
        prefixCls: 'text-field',
        type: 'text',
        onPressEnter: noop,
        onKeyDown: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            inputValue: props.defaultValue
        }
    }

    clearValue = (e) => {
        if (this.state.inputValue === '' || this.props.value === '') {
            ReactDOM.findDOMNode(this.refs.input).focus();
        }

        e.stopPropagation();
        e.preventDefault();
        const eventMock = {target: { value: '' }, currentTarget: { value: ''}, type: 'eventMock'};
        this.handleTextChange(eventMock);
    };

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.props.onPressEnter(e);
        }
        this.props.onKeyDown(e);
    };

    handleTextChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
        if (this.props.value === undefined){
            this.setState({
                inputValue: e.currentTarget.value
            });
        }
    };

    renderButton() {
        const {prefixCls, action, disabled, value} = this.props;
        const inputValue = value === undefined ? this.state.inputValue : value;
        return action ? (
            <span className={`${prefixCls}-button`}>
                {
                    React.cloneElement(action, {
                        disabled: disabled || inputValue === ''
                    })
                }
            </span>
        ) : null;
    }

    renderClear() {
        if (this.props.clearable) {
            return (
                <span className={`${this.props.prefixCls}-clear-zone`} title={this.props.clearAllText}
                    onClick={this.clearValue}
                >
                    {this.state.inputValue !== '' || (this.props.value && this.props.value !== '') ?
                        <span className={`${this.props.prefixCls}-clear`} dangerouslySetInnerHTML={{ __html: '&times;' }} /> : null}
                </span>
            );
        } else {
            return null;
        }
    }

    renderInput() {
        const {prefixCls, onPressEnter, action, clearable, defaultValue, value, addonAfter, addonBefore, className, ...other} = this.props;

        return (
            <Input
                {...other}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleTextChange}
                value={value === undefined ? this.state.inputValue : value}
                ref="input"
            />
        );
    }

    render() {
        const {prefixCls, clearable, action, className} = this.props;
        const cls = classNames({
            [className]: !!className,
            [`${prefixCls}-wrapper`]: true,
            [`${prefixCls}-group`]: (clearable || action)
        });

        const addonBefore = this.props.addonBefore ? <span className={`${prefixCls}-addon addon-before`}>{this.props.addonBefore}</span> : null;
        const addonAfter = this.props.addonAfter ? <span className={`${prefixCls}-addon addon-after`}>{this.props.addonAfter}</span> : null;

        return (
            <span className={cls}>
                {addonBefore}
                {this.renderInput()}
                {this.renderClear()}
                {this.renderButton()}
                {addonAfter}
            </span>
        );
    }
}