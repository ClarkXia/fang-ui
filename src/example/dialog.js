import React from 'react';
import Dialog, {DialogInline} from '../Dialog';
import Button from '../Button';
import css from './dialog.css';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            content: 'content'
        }
    }

    handleDialogClose = () => {
        this.setState({
            open: false
        });
    };

    handleDialogOpen = () => {
        this.setState({
            open: true
        })
    };

    handleConfirm = () => {
        this.setState({
            content: this.state.content + ' content'
        });
    };

    render() {
        const actions = [
            <Button onClick={this.handleDialogClose}>cancel</Button>,
            <Button onClick={this.handleConfirm}>confirm</Button>
        ]
        return (
            <div>
                <a href="javascript:;" onClick={this.handleDialogOpen}>open dialog</a>
                <Dialog
                    open={this.state.open}
                    modal={true}
                    title="this is a dialog title"
                    actions={actions}
                    autoDetectWindowHeight={false}
                    repositionOnUpdate={true}
                    onClose={this.handleDialogClose}
                >
                    <div>
                        {this.state.content}
                    </div>
                </Dialog>
            </div>
        );
    }
}