import React, {PropTypes} from 'react';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const noop = () => {};

export default class Checkbox extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        defaultChecked: PropTypes.bool,
        checked: PropTypes.bool,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onClick: PropTypes.func
    };

    static defaultProps = {
        prefixCls: 'checkbox',
        style: {},
        type: 'checkbox',
        className: '',
        defaultChecked: false,
        onFocus: noop,
        onBlur: noop,
        onChange: noop
    };

    constructor(props) {
        super(props);
        const checked = 'checked' in props ? props.checked : props.defaultChecked;
        this.state = {
            checked,
            focus: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('checked' in nextProps) {
            this.setState({checked: nextProps.checked});
        }
    }

    shouldComponentUpdate(...args) {
        return PureRenderMixin.shouldComponentUpdate.apply(this, args);
    }

    handleChange = (e) => {
        const target = e.target || e.srcElement;
        if (!('checked' in this.props)) {
            this.setState({
                checked: target.checked
            });
        }
        this.props.onChange(e,target.checked);
    };

    handleFocus = (e) => {
        this.setState({focus: true});
        this.props.onFocus(e);
    };

    handleBlur = (e) => {
        this.setState({focus: false});
        this.props.onBlur(e);
    };

    render() {
        const {defaultChecked, disabled, className, prefixCls, style, ...other} = this.props;
        const {checked, focus} = this.state;
        const cls = classNames({
            [className]: !!className,
            [prefixCls]: true,
            [`${prefixCls}-checked`]: checked,
            [`${prefixCls}-unchecked`]: !checked,
            [`${prefixCls}-focus`]: focus,
            [`${prefixCls}-disabled`]: disabled
        })

        return (
            <span className={cls} style={style}>
                <span className={`${prefixCls}-inner`} />
                <input
                    {...other}
                    disabled={disabled}
                    className={`${prefixCls}-input`}
                    checked={checked}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                />
            </span>
        )
    }
}