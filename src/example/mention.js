import React from 'react';
import Mention from '../Mention';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Mention'
        }
    }

    handleChange = (e, value) => {
        this.setState({
            value
        });
    }

    render() {
        return (
            <Mention data={['1','2']} type="input" autoSize={false} value={this.state.value} onChange={this.handleChange}/>
        );
    }
}