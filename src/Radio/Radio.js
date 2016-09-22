import React, {PropType} from 'react';
import Checkbox from '../Checkbox';

export default class Radio extends React.Component {
    static defaultProps = {
        prefixCls: 'radio',
        type: 'radio'
    };

    render() {
        return <Checkbox {...this.props} ref="checkbox" />;
    }
}