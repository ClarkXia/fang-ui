import React, {PropTypes} from 'react';
import classNames from 'classnames';

const noop = () => {};

const getChildrenChecked = (children) => {
    let value = null;

    React.Children.forEach(children, (radio) => {
        if (radio && radio.props && radio.props.checked) {
            value = radio.props.value;
        }
    });

    return value;
}

export default class RadioGroup extends React.Component {
    static defaultProps = {
        prefixCls: 'radio-group',
        disabled: false,
        onChange: noop
    };

    constructor(props) {
        super(props);
        let value;
        if ('value' in props) {
            value = props.value;
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        } else {
            value = getChildrenChecked(props.children);
        }

        this.state = {
            value
        };
    }

    componentWillReceiveProps(nextProps){
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value
            });
        } else {
            const value = getChildrenChecked(nextProps.children);
            if (value) {
                this.setState({
                    value
                });
            }
        }
    }

    //shouldComponentUpdate

    handleRadioChange = (e) => {
        if (!('value' in this.props)) {
            this.setState({
                value: e.target.value
            });
        }

        this.props.onChange(e);
    };

    render() {
        const {children, prefixCls, className} = this.props;
        const newChildren = React.Children.map(children, (radio) => {
            //must be radio component or LabelEnhanced radio
            if(radio && radio.type && radio.type.componentType === 'radio' && radio.props) {
                const keyProps = {};
                if (!('key' in radio) && typeof radio.props.value === 'string') {
                    keyProps.key = radio.props.value;
                }

                return React.cloneElement(radio, Object.assign({}, keyProps, radio.props, {
                    onChange: this.handleRadioChange,
                    checked: this.state.value == radio.props.value,
                    disabled: radio.props.disabled || this.props.disabled
                }));
            }
        });

        const cls = classNames({
            [`${prefixCls}`]: true,
            [className]: !!className
        });
        return <div className={cls} style={this.props.style}>{newChildren}</div>;
    }

}