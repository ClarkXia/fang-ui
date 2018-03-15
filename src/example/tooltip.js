import React from 'react';
import Tooltip from '../Tooltip';
import css from './tooltip.css';

const divStyle = {
    width: 150,
    height: 30,
    position: 'relative',
    margin: 20,
    background: '#aaa',
    lineHeight: '30px',
    textAlign: 'center'
};

export default class sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            content: ['new line','line line line']
        };
    }

    handleOnClick = (e) => {
        console.log('click');
    };

    handleMouseOver = (e) => {
        console.log('mouseover')
    };

    closeTooltip = (e) => {
        this.setState({
            show: false
        });
    };

    handleTrigger = (flag) => {
        if (flag) {
            this.setState({
                show: flag
            })
        }
    };

    addContent = () => {
        this.setState({
            content: ['new line', ...this.state.content]
        });
    }

    render() {
        /*placement one of ['top', 'bottom', 'left', 'right']*/
        const content = (
            <div>
                <input type="text"/><br/>
                <input type="checkbox" /><br/>
                <button>button</button>
            </div>
        );

        const listContent = <div>{this.state.content.map((v, i) => {
                                return <div key={i}>{v}</div>
                            })}</div>;

        return (
            <div>
                <Tooltip placement="top" content="提示文字" trigger="hover">
                    <div style={divStyle} onClick={this.handleOnClick} onMouseOver={this.handleMouseOver}>Tooltip-hover</div>
                </Tooltip>
                <Tooltip placement="top" content={content} trigger="click" show={this.state.show} onTrigger={this.handleTrigger} destroyPopupOnHide={false} className="button-tooltip">
                    <div style={divStyle} onClick={this.handleOnClick} onMouseOver={this.handleMouseOver}>Tooltip-content</div>
                </Tooltip>
                <a href="javascript:;" onClick={this.closeTooltip}>close</a>
                <Tooltip placement="right" content={listContent} trigger="click" onRequestClose={(reson) => {console.log(reson)}}>
                    <div style={divStyle} onClick={this.handleOnClick} onMouseOver={this.handleMouseOver}>Tooltip-click</div>
                </Tooltip>
                <a href="javascript:;" onClick={this.addContent}>add content</a>
                <Tooltip placement="left" content="提示" canAutoPosition={true} destroyPopupOnHide={false} addDisplayEventToTooltip={false}>
                    <div style={divStyle}>trigger</div>
                </Tooltip>
            </div>
        );
    }
}