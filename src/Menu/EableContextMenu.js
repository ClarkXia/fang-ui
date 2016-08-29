import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';


export default function(contextmenu, _options = {}) {
    return (Componet) => {
        return class extends React.Component {
            constructor(props) {
                super(props);
                this.options = typeof _options === 'function' ? (_props) => _options(_props) : (_props) => (_options);
                const options = this.options(props);

                this.state = {
                    showContextMenu: options.show !== undefined && options.show,
                    x: options.pos !== undefined && options.pos.x,
                    y: options.pos !== undefined && options.pos.y
                };

                this.lastClickElement = undefined;
                this.clickableElements = [];
            }

            componentDidMount() {
                const options = this.options(this.props);

                this.child = ReactDOM.findDOMNode(this);
                this.container = document.createElement('div');
                this.container.style.position = 'fixed';
                this.container.style.top = 0;
                this.container.style.left = 0;
                this.container.style.width = 0;
                this.container.style.height = 0;
                //this.updateContainer(options);
                this.child.appendChild(this.container);

                window.addEventListener('click', this.forceHide, false);
                window.addEventListener('contextmenu', this.hide, false);

                this.bindEvent();
                this._renderLayer();

                this._mounted = true;
            }

            componentWillReceiveProps(nextProps) {
                const options = this.options(nextProps);
                if (options.show !== undefined) {
                    this._mounted && this.setState({showContextMenu: options.show});
                }
                if (options.pos !== undefined) {
                    this._mounted && this.setState({...options.pos});
                }


                //this.updateContainer(options);
            }

            updateContainer(options) {
                //set zIndex
            }

            componentDidUpdate() {
                this._renderLayer();
            }

            componentWillUnmount() {
                if (this.container !== null) ReactDOM.unmountComponentAtNode(this.container);

                window.removeEventListener('click', this.forceHide, false);
                window.removeEventListener('contextmenu', this.hide, false);

                this.clickableElements.forEach((ele) => ele.removeEventListener('contextmenu', this.show, false));
                this._mounted = false;
            }

            cloneWithRef(element, newRef) {
                const prevRef = element.ref;
                //prevRef should not be a string type
                if (!prevRef) {
                    return React.cloneElement(element, {ref: newRef});
                }

                return React.cloneElement(element, {
                    ref: (node) => {
                        newRef(node);
                        prevRef && prevRef(node);
                    }
                })
            }

            connectContextMenu = (reactElement) => {
                this.clickableReactElement = this.cloneWithRef(reactElement, (node) => this.clickableElements.push(node));
                this.cleanAndRebind();
                return this.clickableReactElement;
            };

            clean() {
                this.clickableElements = this.clickableElements.filter((ele) => ele !== null);
            }

            bindEvent() {
                this.clickableElements.forEach((ele) => ele.addEventListener('contextmenu', this.show, false));
            }

            cleanAndRebind() {
                this.clean();
                this.bindEvent();
            }

            _renderLayer() {
                //if (this.state.showContextMenu) {
                    const element = typeof contextmenu === 'function' ? contextmenu(this.props) : contextmenu;

                    if (element.type && element.type.isContextMenu) {
                        ReactDOM.render(React.cloneElement(element, {
                            x: this.state.x,
                            y: this.state.y,
                            visible: this.state.showContextMenu
                        }), this.container);
                    }

                //} else {
                //    ReactDOM.unmountComponentAtNode(this.container);
                //}
            }

            show = (event) => {
                event.preventDefault();
                this.lastClickElement = event.target;
                let rect = this.child.getBoundingClientRect(),
                    x = event.clientX,
                    y = event.clientY;

                const newSt = {x, y, showContextMenu: true};
                console.log(this._mounted);
                this._mounted && this.setState(newSt);
            };

            hide = (event, force) => {
                if (event.target !== this.lastClickElement || force) {
                    const newSt = {showContextMenu: false};
                    this._mounted && this.setState(newSt);
                }
            };

            forceHide = (event) => {
                let button = event.which || event.button;
                if (button === 1) setTimeout(() => this.hide(event, true), 0);
            };

            render() {
                return <Componet {...this.props} connectContextMenu={this.connectContextMenu}/>
            }
        };
    };
}