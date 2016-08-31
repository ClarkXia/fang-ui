import React from 'react';
import Dialog, {DialogInline} from '../Dialog';
import Button from '../Button';
import css from './dialog.css';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
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
    }

    render() {
        const actions = [
            <Button onClick={this.handleDialogClose}>cancel</Button>,
            <Button>confirm</Button>
        ]
        return (
            <div>
                <a href="javascript:;" onClick={this.handleDialogOpen}>open dialog</a>
                <Dialog
                    open={this.state.open}
                    title="this is a dialog title"
                    actions={actions}
                    autoDetectWindowHeight={true}
                    repositionOnUpdate={true}
                    onClose={this.handleDialogClose}
                >
                    <div>
                        content content
                    </div>
                </Dialog>
            </div>
        );
    }
}