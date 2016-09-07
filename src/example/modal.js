import React from 'react';
import Modal, {Layer} from '../Modal';
import Button from '../Button';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAlert = () => {
        Layer.alert({
            content: 'alert some message',
            okText: 'OK!',
            onOk: function(){
                console.log('alert ok');
            }
        })
    };

    handleConfirm = () => {
        Layer.confirm({
            content: 'confirm some message',
            okText: '确认',
            cancelText: '取消',
            onOk: function(){
                console.log('confirm ok');
            },
            onCancel: function(){
                console.log('confirm cancel');
            }
        })
    };

    handleModal = () => {
        Layer.dialog({
            title: 'this is a dialog',
            content: <div><span style={{color: '#2db7f5'}}>some content some content</span></div>,
            okText: 'Promise确认',
            cancelText: 'D取消',
            onOk: function(){
                return new Promise((resolve) => {
                    console.log('wait for resolve')
                    setTimeout(() => {
                        console.log('dialog ok');
                        resolve();
                    }, 5000);
                })
            },
            onCancel: function(){
                console.log('dialog cancel');
            }
        })
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleAlert}>Alert</Button>
                <Button onClick={this.handleConfirm}>Confirm</Button>
                <Button onClick={this.handleModal}>Use Layer to Create Dialog</Button>
            </div>
        );
    }
}