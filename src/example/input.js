import React from 'react';
import Input from '../Input';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleOnChange = (e) => {
        this.setState({
            value: e.currentTarget.value
        });
    }

    render() {
        return (
            <div>
                default<Input autoSize={true}/>
                default value<Input defaultValue="input some text" autoSize={true}/>
                controlled<Input type="text" placeholder="请输入内容auto size" value={this.state.value} maxWidth={150} onChange={this.handleOnChange} autoSize={true}/>
                textarea<Input type="textarea" placeholder="auto size placeholder auto size placeholder" defaultValue="" minRows="2" maxRows="4" autoSize={true}/>
            </div>
        );
    }
}