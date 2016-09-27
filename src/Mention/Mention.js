import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Popover from '../Popover';
import Menu, {MenuItem} from '../Menu';
import Input from '../Input';
import getCaretPosition, {getCursorPosition} from '../utils/getCaretPosition';

const noop = () => {};

const escapeRegex = (str) => {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const _getTriggerRegex = (trigger) => {
    if (trigger instanceof RegExp) {
        return trigger;
    } else {
        var escapedTriggerChar = escapeRegex(trigger);

        // first capture group is the part to be replaced on completion
        // second capture group is for extracting the search query
        return new RegExp('(?:^|\\s)(' + escapedTriggerChar + '([^\\s' + escapedTriggerChar + ']*))$');
    }
}

//default suggestion component
const Suggestion = (props) => {
    const {suggestions, addMention, searchLable, prefixCls} = props;
    const data = suggestions.results;
    if (data instanceof Array && data.length > 0) {
        const handleSelect = (e, item) => {
            e.stopPropagation();
            addMention(item.props.value);
        };
        return (
            <Menu
                onItemSelect={handleSelect}
                disableAutoFocus={false}
                className={`${prefixCls}-suggestions`}
            >
                {data.map((item, index) => {
                    const menuValue = item || item[searchLable];
                    if (menuValue) {
                        return (<MenuItem key={index} value={menuValue}>{menuValue}</MenuItem>);
                    }
                })}
            </Menu>
        );
    } else {
        return null;
    }
}

let isComposing = false;

class MentionsInput extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(['input', 'textarea']),
        trigger: PropTypes.any,
        value: PropTypes.string.isRequired,
        onKeyDown: PropTypes.func,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onSelect: PropTypes.func,
        searchLable: PropTypes.string,
        displayTransform: PropTypes.func,
        data: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.array
        ]),
        suggestionComponent: PropTypes.func,
        className: PropTypes.string,
        suggestionClass: PropTypes.string,
        prefixCls: PropTypes.string

        /*chidren: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired*/
    };

    static defaultProps = {
        type: 'textarea',
        searchLable: 'value',
        trigger: '@',
        displayTransform: function(suggestion, trigger){
            if (typeof trigger === 'string') {
                return trigger + suggestion + ' ';
            } else {
                return suggestion + ' ';
            }
        },
        onKeyDown: noop,
        onSelect: noop,
        onBlur: noop,
        suggestionComponent: Suggestion,
        prefixCls: 'mention'
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionStart: null,
            selectionEnd: null,
            suggestions: {},
            suggestionPosition: {
                left: null,
                top: null
            },
            openSuggestion: false
        };
        this._queryId = 0;
        this.setSelectionAfterMention = false;
    }

    componentDidMount() {
        this.updateSuggestionsPosition();
    }

    componentDidUpdate() {
        this.updateSuggestionsPosition();
        if (this.setSelectionAfterMention) {
            this.setSelectionAfterMention = false;

            setTimeout(() => {
                this.setSelection(this.state.selectionStart, this.state.selectionEnd);
            })
        }
    }

    updateSuggestionsPosition() {
        const {suggestionPosition, openSuggestion} = this.state;
        if (!openSuggestion) return;
        const el = ReactDOM.findDOMNode(this.refs.input);

        const caretPosition = getCaretPosition(el, this.props.type === 'input');
        const position = {
            left: caretPosition.left + el.offsetLeft,
            top: caretPosition.top + el.offsetTop
        };

        if (suggestionPosition.left === position.left && suggestionPosition.top === position.top) {
            return;
        }

        this.setState({
            suggestionPosition: position
        });
    }

    updateQueries(inputValue, caretPosition) {
        //TODO: if caret is inside of or directly behind of mention
        this._queryId++;

        const substring = inputValue.substring(0, caretPosition);
        const regex = _getTriggerRegex(this.props.trigger);
        const match = substring.match(regex);
        if (match) {
            const queryStart = substring.indexOf(match[1], match.index);
            this.queryData(match[2], queryStart, queryStart + match[1].length, inputValue);
        } else {
            this.clearSuggestions();
        }
    }

    queryData(query, queryStart, queryEnd, inputValue) {
        const provideData = this.getDataProvider(this.props.data, this.props.searchLable);
        const results = provideData(query);

        const queryId = this._queryId;
        if (results && results.then) {
            results.then((data) => {
                this.updateSuggestions(data, queryId, query, queryStart, queryEnd, inputValue);
            })
        } else if (results instanceof Array) {
            this.updateSuggestions(results, queryId, query, queryStart, queryEnd, inputValue);
        }
    }

    updateSuggestions(suggestions, queryId, query, queryStart, queryEnd, inputValue) {
        if (queryId !== this._queryId) return;

        let openState = true;
        if (suggestions instanceof Array && suggestions.length === 0) {
            openState = false;
        }

        this.setState({
            suggestions: Object.assign({}, this.state.suggestion, {
                query,
                queryStart,
                queryEnd,
                inputValue,
                results: suggestions
            }),
            openSuggestion: openState
        });
    }

    getDataProvider(data, prop) {
        if (data instanceof Array) {
            //if data is an array return a search function
            return function(query, callback){
                let results = [];
                for (let i = 0, l = data.length; i < l; i++) {
                    const searchValue = typeof data[i] === 'string' ? data[i]
                                    : (typeof data[i] === 'object' ? data[i][prop] : null);
                    if (!!searchValue && searchValue.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                        results.push(data[i]);
                    }
                }

                return results;
            }
        } else {
            return data;
        }
    }

    clearSuggestions() {
        if (this.state.openSuggestion) {
            this._queryId++;
            this.setState({
                suggestions: {},
                openSuggestion: false
            });
        }
    }

    setSelection(selectionStart, selectionEnd) {
        if (selectionStart === null || selectionEnd === null) return;

        const el = ReactDOM.findDOMNode(this.refs.input);

        if (el.setSelectionRange) {
            el.setSelectionRange(selectionStart, selectionEnd);
        } else if (el.createTextRange) {
            const range = el.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    addMention = (suggestion) => {
        //const {value = ''} = this.props;
        const {suggestions: {query, queryStart, queryEnd, inputValue}} = this.state;
        const displayValue = this.props.displayTransform(suggestion, this.props.trigger) || suggestion;
        const newValue = inputValue.substring(0, queryStart) + displayValue + inputValue.substring(queryEnd);

        const newCaretPosition = queryStart + displayValue.length;
        this.setState({
            selectionStart: newCaretPosition,
            selectionEnd: newCaretPosition
        });

        this.setSelectionAfterMention = true;

        if (this.props.onChange) {
            var eventMock = { target: { value: newValue }};

            this.props.onChange(eventMock, newValue);
        }

        setTimeout(() => {
            this.clearSuggestions();
        })

    };

    handleChange = (e) => {
        if (document.activeElement !== e.target) {
            return;
            //fix an IE bug (blur from empty input element width placeholder attribute trigger "input" event)
        }
        const newValue = e.target.value;
        if (this.props.onChange) {
            return this.props.onChange(e, newValue);
        }
    };

    handleSelect = (e) => {
        if (isComposing) return;

        const el = ReactDOM.findDOMNode(this.refs.input);
        const {start, end} = getCursorPosition(el)

        if (start === end) {
            this.updateQueries(el.value, end);
        } else {
            //clear suggestions
            this.clearSuggestions();
        }

        this.props.onSelect(e);
    };

    handleKeyDown = (e) => {
        if (!this.state.openSuggestion) {
            this.props.onKeyDown(e);
            return;
        }

        switch(e.keyCode) {
            case 27: {  //ESC
                this.clearSuggestions();
                return;
            }
            case 13: {  //ENTER
                e.preventDefault();
                return;
            }
        }
    };

    handleBlur = (e) => {
        //this.clearSuggestions();
        this.props.onBlur(e);
    };

    handleCompositionStart = () => {
        isComposing = true;
    };

    handleCompositionEnd = () => {
        isComposing = false;
    };

    handleRequestClose = (reason) => {
        if (this.state.openSuggestion){
            this.setState({
                openSuggestion: false
            });
        }
    };

    renderSuggestions() {
        const suggestions = this.state.suggestions;
        const {searchLable, prefixCls} = this.props;
        const SuggestionComponent = this.props.suggestionComponent;

        return (
            <SuggestionComponent
                addMention={this.addMention}
                searchLable={searchLable}
                suggestions={suggestions}
                prefixCls={prefixCls}
            />
        );
    }

    render() {
        const position = {
            ...this.state.suggestionPosition,
            collision: 'fit'
        };

        const {
            type,
            trigger,
            value,
            onKeyDown,
            onBlur,
            onChange,
            onSelect,
            searchLable,
            displayTransform,
            data,
            suggestionComponent,
            className,
            suggestionClass,
            prefixCls,
            ...other
        } = this.props;

        let inputProps = {
            type,
            value,
            ref: 'input',
            autoSize: true,
            onChange: this.handleChange,
            onKeyDown: this.handleKeyDown,
            onSelect: this.handleSelect,
            onBlur: this.handleBlur,
            className: classNames({
                [`${prefixCls}-input`]: true,
                [className]: !!className
            }),
            ...other
        };

        return (
            <div>
                <Input {...inputProps}/>
                <Popover
                    open={this.state.openSuggestion}
                    onRequestClose={this.handleRequestClose}
                    position={position}
                    useLayerForClickAway={false}
                >
                    {this.renderSuggestions()}
                </Popover>
            </div>
        )
    }
}

export default MentionsInput;