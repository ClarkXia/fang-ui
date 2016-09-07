import React from 'react';
import Notification from '../Notification';
import Button from '../Button';
import css from './notification.css';

const message = Notification.newInstance({
    prefixCls: 'message'
    /*style: {
        top: 30,
        right: 0
    }*/
});

const messageArray = [
    'message1: show message',
    'message2: hide message',
    'message3: click Button',
    'message4: some message'
]

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
    }

    handleOnClick = (e) => {
        let a = message.notice({
            content: messageArray[Math.floor(Math.random()*messageArray.length)],
            duration: 10,
            closable: true,
            onClose: (key) => {console.log(key);},
            //key: 'custom-key',
            style: {
                color: '#aaa'
            }
        });
        console.log(a);
    };

    render() {
        return (
            <div style={{marginBottom: 20}}>
                <Button onClick={this.handleOnClick}>message</Button>
            </div>
        );
    }
}