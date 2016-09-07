import React from 'react';
import Menu, {MenuItem} from '../Menu';
import Divider from '../Divider';
import Popover from '../Popover';

const data = ['选项－','选项二','选项三','选项四','选项五','选项六','选项七','选项八','选项九','选项十'];
const divStyle = {
    position: 'relative',
    width: 80,
    height: 30,
    border: '1px solid #000',
    textAlign: 'center',
    lineHeight: '30px'
}

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 7,
            open: false
        }
    }

    handleOnChange = (e, item, index) => {
        e.stopPropagation();
        //fix Uncaught Invariant Violation: React DOM tree root should always have a node reference.
        setTimeout(() => {
            this.setState({
                open: false,
                value: item.props.value
            })
        });
    };

    handleOnClick = (e) => {
        //e.stopPropagation();
        if (!this.state.open) {
            this.setState({
                basedEl: e.currentTarget,
                open: true
            });
        }
    };

    handleRequestClose = (...args) => {
        console.log(args);
        this.setState({
            open: false
        });
    };

    render() {
        const basedOrigin = {
            vertical: 'top',
            horizontal: 'left'
        };
        return (
            <div style={divStyle} onClick={this.handleOnClick}>
                <span>{data[this.state.value - 1]}</span>
                <Popover
                    open={this.state.open}
                    basedEl={this.state.basedEl}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={false}
                    basedOrigin={basedOrigin}
                >
                    <Menu
                        value={this.state.value}
                        onItemClick={this.handleOnChange}
                        show={this.state.open}
                    >
                        {data.map((v, i) => {
                            const disabled = i == 2 ? true : false;
                            if (i == 3) {
                                return <Divider key={i}/>
                            }
                            return <MenuItem key={i} value={i + 1} disabled={disabled}>{v}</MenuItem>
                        })}
                    </Menu>
                </Popover>
            </div>
        );
    }
}