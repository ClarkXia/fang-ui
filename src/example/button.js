import React from 'react';
import Button from '../Button';
import css from './button.css';

const handleClick = () => {
    alert('click');
}

const Sample = () => {
    return (
        <div>
            <Button onClick={handleClick}>click</Button>
            <Button onClick={handleClick} disabled>disabled</Button>
            <Button href="#link">link button</Button>
            <Button htmlType="submit">submit</Button>
            <Button htmlType="reset">reset</Button>
            <Button icon="close">icon button</Button>
            <Button loading={true}>width loading icon</Button>
        </div>
    )
}

export default Sample;