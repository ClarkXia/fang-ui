import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Dialog, {DialogInline} from '../Dialog/Dialog';
import Button from '../Button/Button';

const noop = () => {};

export default class Modal extends React.Component {
    static defaultProps = {
        prefixCls: 'modal',
        onOk: noop,
        onCancel: noop,
        open: false
    };

    static propTypes = {
        prefixCls: PropTypes.string,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        okText: PropTypes.string,
        cancelText: PropTypes.string,
        confirmLoading: PropTypes.bool,
        open: PropTypes.bool,
        okCancel: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: props.confirmLoading
        }
    }

    handleCancel = (e) => {
        this.props.onCancel(e)
    };

    handleOk = (e) => {
        this.props.onOk(e);
    };

    render() {
        const {okText, cancelText, confirmLoading, okCancel, open, ...other} = this.props;

        let actions = [
            <Button
                key="confirm"
                type="primary"
                loading={this.state.confirmLoading}
                onClick={this.handleOk}
            >
                {okText || 'ok'}
            </Button>
        ];

        if (okCancel) {
            actions.unshift(<Button
                key="cancel"
                type="default"
                onClick={this.handleCancel}
            >
                {cancelText || 'cancel'}
            </Button>)
        }

        return (
            <DialogInline
                actions={actions}
                onClose={this.handleCancel}
                open={open}
                {...other}
            />
        )
    }
}