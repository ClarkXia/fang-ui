import React from 'react';

export default props => {
    const { type, className = '' } = props;
    return <i {...props} className={`${className} icon icon-${type}`.trim()} />;
};