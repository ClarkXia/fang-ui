import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import getCaretPosition from '../utils/getCaretPosition';

const noop = () => {};

class MentionsInput extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(['input', 'textarea']),
        markup: PropTypes.string,
        value: PropTypes.string,
        onKeyDown: PropTypes.func,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onSelect: PropTypes.func

        /*chidren: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired*/
    };

    static defaultProps = {
        type: 'textarea',
        onKeyDown: noop,
        onSelect: noop,
        onBlur: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionStart: null,
            selectionEnd: null,

            caretPosition: null,
            suggestionPosition: null
        }
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    handleChange = (e) => {
        const position = getCaretPosition(e.currentTarget);
        console.log(position);
    }

    render() {
        return <textarea onChange={this.handleChange} style={{margin: '20px'}}/>
    }
}


export default MentionsInput;