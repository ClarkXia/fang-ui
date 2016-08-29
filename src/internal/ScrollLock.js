import React, { PropTypes } from 'react';

let lockingCounter = 0;
let originalBodyOverflow = null;
export default class ScrollLock extends React.Component {
    static propTypes = {
        lock: PropTypes.bool.isRequired
    };

    componentDidMount() {
        if (this.props.lock === true) this.preventScrolling();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.lock !== nextProps.lock) {
            if (nextProps.lock) {
                this.preventScrolling();
            } else {
                this.allowScrolling();
            }
        }
    }

    componentWillUnmount() {
        this.allowScrolling();
    }

    locked = false;

    preventScrolling() {
        if (this.locked === true)
            return;
        lockingCounter = lockingCounter + 1;
        this.locked = true;

        if (lockingCounter === 1) {
            const body = document.getElementsByTagName('body')[0];
            originalBodyOverflow = body.style.overflow;
            body.style.overflow = 'hidden';
        }
    }

    allowScrolling() {
        if (this.locked === true) {
            lockingCounter = lockingCounter - 1;
            this.locked = false;
        }

        if (lockingCounter === 0 && originalBodyOverflow !== null) {
            const body = document.getElementsByTagName('body')[0];
            body.style.overflow = originalBodyOverflow || '';
            originalBodyOverflow = null;
        }
    }

    render() {
        return null;
    }
}