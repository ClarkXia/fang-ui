import React, {PropTypes} from 'react';
import classNames from 'classnames';

const noop = () => {};

export default class Switch extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        defaultChecked: PropTypes.bool,
        checkedChildren: PropTypes.any,
        unCheckedChildren: PropTypes.any,
        onChange: PropTypes.func
    };

    static defaultProps = {
        prefixCls: 'switch',
        checkedChildren: null,
        unCheckedChildren: null,
        className: '',
        defaultChecked: false,
        disabled: false,
        onChange: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            checked: 'checked' in props ? !!props.checked : !!props.defaultChecked
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('checked' in nextProps) {
            this.setState({
                checked: !!nextProps.checked
            });
        }
    }

    handleKeyDown = (e) => {
        switch (e.keyCode) {
            case 37:  //left
                this.setChecked(false);
                return;
            case 39:
                this.setChecked(true);
                return;
            default:
                return
        }
    };

    handleMouseUp = (e) => {
        if (this.props.onMouseUp) {
            this.props.onMouseUp(e);
        }
    };

    handleOnClick = (e) => {
        this.setChecked(!this.state.checked);
    };

    setChecked(checked) {
        if (this.props.disabled) return;

        if (!('checked' in this.props)) {
            this.setState({checked});
        }
        this.props.onChange(checked);
    }

    render() {
        const {className, prefixCls, disabled, checkedChildren, unCheckedChildren, ...other} = this.props;
        const checked = this.state.checked;

        const cls = classNames({
            [`${prefixCls}`]: true,
            [`${prefixCls}-checked`]: checked,
            [`${prefixCls}-disabled`]: disabled
        });

        return (
            <span {...other}
                className={cls}
                tabIndex="0"
                ref="switch"
                onKeyDown={this.handleKeyDown}
                onClick={this.handleOnClick}
                onMouseUp={this.handleMouseUp}
            >
                <span className={`${prefixCls}-inner`}>
                    {checked ? checkedChildren : unCheckedChildren}
                </span>
            </span>
        )
    }
}