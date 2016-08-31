import React from 'react';
import Badge from '../Badge';
import css from './badge.css';

const divStyle = {
    width: 50,
    height: 50,
    backgroundColor: '#aaa',
    position: 'relative'
};

const Sample = () => {
    return (
        <div>
            <Badge badgeContent={3} >
                <div style={divStyle}></div>
            </Badge>
            <Badge badgeContent={101}>
                <div style={divStyle}></div>
            </Badge>
            <Badge badgeContent={101} overflowCount={9}>
                <div style={divStyle}></div>
            </Badge>
            <Badge badgeContent={101} dot={true}>
                <div style={divStyle}></div>
            </Badge>
            <Badge dot={true}>
                text
            </Badge>
        </div>
    );
};

export default Sample;