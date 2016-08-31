import React from 'react';
import Avatar from '../Avatar';

const Sample = () => {
    return (
        <div>
            <Avatar>A</Avatar>
            <Avatar backgroundColor="#000" color="#666">A</Avatar>
            <Avatar className="avatar-cls" icon={<i className="icon"></i>}></Avatar>
            <Avatar src="http://tva3.sinaimg.cn/crop.0.0.180.180.180/89d11e0ejw1e8qgp5bmzyj2050050aa8.jpg" size={50}/>
        </div>);
}

export default Sample;