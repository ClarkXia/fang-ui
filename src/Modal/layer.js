import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import Button from '../Button/Button';

export default function layer(config) {
    const props = Object.assign({}, config);
    let div = document.createElement('div');
    document.body.appendChild(div);

    let d;
    let promiseLock = false;

    props.okText = props.okText || 'ok';
    props.cancelText = props.cancelText || 'cancel';

    function close() {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
    }

    function callFn(fn) {
        if (promiseLock) return;
        if (fn && typeof fn === 'function') {
            let ret = fn();
            if (!ret) {
                close();
            }
            //return promise
            if (ret && ret.then) {
                promiseLock = true;
                d.setState({confirmLoading: true})
                ret.then(close);
            }
        } else {
            close();
        }
    }
    //render ok and cancel button (default)
    if (!('okCancel' in props)) {
        props.okCancel = true;
    }

    ReactDOM.render(
        <Modal
            open={true}
            modal={props.modal}
            title={props.title}
            prefixCls="dialog"
            okCancel={props.okCancel}
            onOk={(e) => callFn(props.onOk)}
            onCancel={(e) => callFn(props.onCancel)}
            closable={!!props.closable}

        >
            {props.content}
        </Modal>,
        div, function(){d = this;}
    );

    return {
        destroy: close
    };
}

layer.alert = function (props) {
    const config = Object.assign({}, {
        okCancel: false,
        modal: true,
        closable: false
    }, props);
    return layer(config);
}

layer.confirm = function (props) {
    const config = Object.assign({}, {
        okCancel: true,
        modal: true,
        closable: false
    }, props);
    return layer(config);
}