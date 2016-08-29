import React from 'react';
import icon from './icon.css'
export default props => {
    const { type, className = '' } = props;
    return <i {...props} className={`${className} icon icon-${type}`.trim()} />;
};