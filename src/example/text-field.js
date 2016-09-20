import React from 'react';
import TextField from '../TextField';
import Button from '../Button';
import css from './text-field.css';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: 'default'
        }
    }

    handleOnChange = (e) => {
        this.setState({
            inputValue: e.currentTarget.value
        })
    };

    handleOnClick = (e) => {
        alert(this.state.inputValue);
    }

    renderButton() {
        return <Button className="text-field-btn" onClick={this.handleOnClick}>search</Button>
    }

    render(){
        return (
            <div>
                <TextField clearable={true} placeholder="default"/>
                <br/>
                <TextField action={this.renderButton()} />
                <br/>
                <TextField action={this.renderButton()} disabled={false} type="textarea" value={this.state.inputValue} onChange={this.handleOnChange}/>
                <br/>
                <TextField autoSize={true} maxWidth="200px" clearable={true}/>
            </div>
        );
    }
}