import React, {PropTypes} from 'react';
import ReactDOM, {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom';

function isDescendant(parent, child) {
    let node = child.parentNode;

    while(node != null){
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
}

export default class RenderToLayer extends React.Component {
    static propTypes = {
        componentClickAway: PropTypes.func,
        open: PropTypes.bool.isRequired,
        render: PropTypes.func.isRequired,
        useLayerForClickAway: PropTypes.bool,
        destroyPopupOnHide: PropTypes.bool
    };

    static defaultProps = {
        useLayerForClickAway: true
    };

    componentDidMount() {
        this.renderLayer();
    }

    componentDidUpdate() {
        this.renderLayer();
    }

    componentWillUnmount() {
        this.unrenderLayer(true);
    }

    onClickAway = (event) => {
        if (event.defaultPrevented) {
            return;
        }
        if (!this.props.componentClickAway) {
            return;
        }
        if (!this.props.open) {
            return;
        }

        const el = this.layer;
        if (event.target !== el && event.target === window ||
            (document.documentElement.contains(event.target) && !isDescendant(el, event.target))) {
            this.props.componentClickAway(event);
        }

    }

    getLayer(){
        return this.layer;
    }

    renderLayer() {
        const {open, render, destroyPopupOnHide} = this.props;
        if (open) {
            if (!this.layer) {
                this.layer = document.createElement('div');
                document.body.appendChild(this.layer);
            }
            !this.bind && this.bindEvent();

            const layerElement = render();
            //this.layerElement = ReactDOM.render(layerElement, this.layer);
            this.layerElement = unstable_renderSubtreeIntoContainer(this, layerElement, this.layer);

            ReactDOM.findDOMNode(this.layerElement).style.display = '';
        } else {
            this.unrenderLayer(destroyPopupOnHide);
        }
    }

    unrenderLayer(destroy) {
        if (!this.layer) {
            return;
        }
        this.bind && this.unbindEvent(this.props);
        if (!destroy) {
            ReactDOM.findDOMNode(this.layerElement).style.display = 'none';
            return;
        }

        unmountComponentAtNode(this.layer);
        document.body.removeChild(this.layer);
        this.layer = null;
    }

    bindEvent() {
        if (this.props.useLayerForClickAway) {
            this.layer.addEventListener('touchstart', this.onClickAway);
            this.layer.addEventListener('click', this.onClickAway);
            this.layer.style.position = 'fixed';
            this.layer.style.top = 0;
            this.layer.style.bottom = 0;
            this.layer.style.left = 0;
            this.layer.style.right = 0;
            this.layer.style.zIndex = 99999;
        } else {
            setTimeout(() => {
                window.addEventListener('touchstart', this.onClickAway);
                window.addEventListener('click', this.onClickAway);
            }, 0);
        }
        this.bind = true;
    }

    unbindEvent(props) {
        if (props.useLayerForClickAway) {
            this.layer.style.position = 'relative';
            this.layer.removeEventListener('touchstart', this.onClickAway);
            this.layer.removeEventListener('click', this.onClickAway);
        } else {
            window.removeEventListener('touchstart', this.onClickAway);
            window.removeEventListener('click', this.onClickAway);
        }
        this.bind = false;
    }

    render() {
        return null;
    }
}