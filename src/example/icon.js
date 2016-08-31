import React from 'react';
import Icon from '../Icon';
import css from './icon.css';

const Sample = () => {
    return (
        <div>
            <Icon type="close"/>
            <Icon className="custom" type="close"/>
        </div>
    );
}

export default Sample;