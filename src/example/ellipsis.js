import React from 'react';
import Ellipsis from '../Ellipsis';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'some text'
        };
    }

    handleOnClick = () => {
        this.setState({
            text: this.refs.input.value
        })
    }

    render() {
        return (
            <div>
                <input type="text" ref="input"/>
                <a onClick={this.handleOnClick}>change</a>
                <Ellipsis style={{width: 100,height: 20, lineHeight: '20px'}}>{this.state.text}</Ellipsis>
            </div>
        );
    }
}