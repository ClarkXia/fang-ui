import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Icon from '../Icon';

let count = 0;
const now = Date.now();

function getKey() {
    return `notification-${now}-${count++}`;
}

const noop = () => {};

class Notice extends React.Component {
    static propTypes = {
        duration: PropTypes.number,
        onClose: PropTypes.func,
        children: PropTypes.any
    };

    static defaultProps = {
        duration: 1.5,
        onClose: noop,
        style: {}
    };

    componentDidMount() {
        if (this.props.duration) {
            this.closeTimer = setTimeout(() => {
                this.close();
            }, this.props.duration * 1000);
        }
    }

    componentWillUnmount() {
        this.clearCloseTimer();
    }

    clearCloseTimer() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }

    close = () => {
        this.clearCloseTimer();
        this.props.onClose();
    }

    render() {
        const {prefixCls, className, style, children, closable} = this.props;
        const componentCls = `${prefixCls}-notice`;
        const cls = classNames({
            [`${componentCls}`]: true,
            [`${componentCls}-closable`]: closable,
            [className]: !!className
        });

        return (
            <div className={cls} style={style}>
                <div className={`${componentCls}-content`}>
                    {children}
                    {closable ? <Icon type="close" className={`${componentCls}-close`} onClick={this.close} /> : null}
                </div>
            </div>
        );
    }
}

class Notification extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            notices: []
        };
    }

    static propTypes = {
        prefixCls: PropTypes.string,
        style: PropTypes.object
    };

    static defaultProps = {
        prefixCls: 'notification'
    };

    add(notice) {
        const key = notice.key = notice.key || getKey();
        this.setState(prevState => {
            const notices = prevState.notices;
            if (!notices.filter(v => v.key === key).length) {
                return {
                    notices: notices.concat(notice)
                };
            }
        });

        return key;
    }

    remove(key) {
        this.setState(prevState => {
            return {
                notices: prevState.notices.filter(v => v.key !== key)
            };
        })
    }

    render() {
        const {prefixCls, className, style} = this.props;
        const noticeNodes = this.state.notices.map((notice) => {
            const {onClose, content, ...other} = notice;
            const closeFunc = () => {
                this.remove(notice.key);
                if (onClose){
                    onClose(notice.key);
                }
            }

            return (
                <Notice
                    prefixCls={prefixCls}
                    {...other}
                    onClose={closeFunc}
                >
                    {content}
                </Notice>
            );
        })

        const cls = classNames({
            [prefixCls]: true,
            [className]: !!className
        });

        return (
            <div className={cls} style={style}>
                {noticeNodes}
            </div>
        )
    }
}

Notification.newInstance = function (props = {}){
    const div = document.createElement('div');
    document.body.appendChild(div);
    const notification = ReactDOM.render(<Notification {...props}/>, div);

    return {
        notice(noticeProps) {
            return notification.add(noticeProps);
        },
        removeNotice(key) {
            notification.remove(key);
        },
        component: notification,
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        }
    };
}

export default Notification;