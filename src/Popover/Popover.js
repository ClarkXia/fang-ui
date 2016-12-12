import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import RenderToLayer from '../internal/RenderToLayer';

const rootStyle = {
    position: 'absolute',
    opacity: 0
};

const invisibleStyle = {
    display: 'none'
};

export default class Popover extends React.Component {
    static propTypes = {
        basedEl: PropTypes.object,
        basedOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'middle', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right'])
        }),
        targetOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'middle', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right'])
        }),
        onRequestClose: PropTypes.func,
        open: PropTypes.bool,
        useLayerForClickAway: PropTypes.bool,
        autoCloseWhenOffScreen: PropTypes.bool,
        chidren: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        canAutoPosition: PropTypes.bool,
        position: PropTypes.shape({
            left: PropTypes.number,
            top: PropTypes.number,
            collision: PropTypes.oneOf(['flip', 'fit'])
        }),
        offset: PropTypes.array,
        container: PropTypes.any,
        destroyPopupOnHide: PropTypes.bool,
        inline: PropTypes.bool
    };

    static defaultProps = {
        basedOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        autoCloseWhenOffScreen: false,
        canAutoPosition: false,
        onRequestClose: () => {},
        open: false,
        targetOrigin: {
            vertical: 'top',
            horizontal: 'left'
        },
        offset: [0, 0],
        useLayerForClickAway: true,
        destroyPopupOnHide: true,
        inline: false
    };

    constructor(props) {
        super(props);

        this.state = {
            open: props.open
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.state.open) {
            if (nextProps.open) {
                this.basedEl = nextProps.basedEl || this.props.basedEl;

                this.setState({open: true});
            } else {
                this.setState({open: false});
            }
        }

        //reset targetEl
        if (nextProps.basedEl !== this.props.basedEl ||
                (this.props.open === nextProps.open && nextProps.position)) {
            if (this.targetEl) {
                this.targetEl.style.top = 0;
                this.targetEl.style.left = 0;
                this.targetEl.style.opacity = 0;
            }
        }

    }

    componentDidMount() {
        window.addEventListener('resize', this.setPlacement);
        window.addEventListener('scroll', this.setPlacement);
    }

    componentDidUpdate() {
        //wait for RenderToLayer did update
        if (this.state.open) {
            this.timer = setTimeout(() => {
                this.setPlacement();
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setPlacement);
        window.removeEventListener('scroll', this.setPlacement);
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    renderLayer = () => {
        if (!this.state.open && this.props.destroyPopupOnHide) return null;

        const {children, style, className = ''} = this.props;
        return (
            <div style={Object.assign({}, rootStyle, style)} className={className}>
                {children}
            </div>
        );
    };

    requestClose(reason) {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(reason);
        }
    }

    componentClickAway = () => {
        this.requestClose('clickAway');
    };

    getBasedPosition(el) {
        if (!el) {
            el = ReactDOM.findDOMNode(this);
        }

        const rect = el.getBoundingClientRect();
        const pos = {
            top: rect.top,
            left: rect.left,
            width: el.offsetWidth,
            height: el.offsetHeight
        };

        pos.right = rect.right || pos.left + pos.width;
        pos.bottom = rect.bottom || pos.top + pos.height;
        pos.center = pos.left + (pos.right - pos.left) / 2;
        pos.middle = pos.top + (pos.bottom - pos.top) / 2;

        return pos;
    }

    setPlacement = (scrolling) => {
        if (!this.state.open) {
            return;
        }
        this.targetEl = this.props.inline ? this.refs.popoverContainer : (this.refs.layer ? this.refs.layer.getLayer().children[0] : null);
        const targetEl = this.targetEl;
        //console.log('popover did update', targetEl);

        if (!targetEl) {
            return;
        }

        let targetPos;
        const docST = document.body.scrollTop || document.documentElement.scrollTop,
              docSL = document.body.scrollLeft || document.documentElement.scrollLeft,
              docH = document.body.scrollHeight,
              docW = document.body.scrollWidth,
              winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
              winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (this.props.position) {
            targetPos = {
                top: this.props.position.top + parseInt(this.props.offset[0]),
                left: this.props.position.left + parseInt(this.props.offset[1])
            };

            const {collision} = this.props.position;

            if (collision) {
                const docScroll = {
                    top: docST,
                    left: docSL
                },docSize = {
                    width: docW,
                    height: docH
                },winSize = {
                    width: winW,
                    height: winH
                },targetSize = {
                    width: targetEl.offsetWidth,
                    height: targetEl.offsetHeight
                };

                //check vertical&horizontal
                for (let pos in docScroll) {
                    const sizeKey = pos === 'top' ? 'height' : 'width';
                    if (targetPos[pos] < docScroll[pos]) {
                        if (collision === 'fit') {
                            targetPos[pos] = docScroll[pos];
                        } /*else if (collision === 'flip') {
                            targetPos[pos] = targetPos[pos] + targetSize[sizeKey];
                            if (targetPos[pos] + targetSize[sizeKey] > docSize[sizeKey]){
                                targetPos[pos] = docSize[sizeKey] - targetSize[sizeKey];
                            }
                        }*/
                    } else if (targetPos[pos] + targetSize[sizeKey] - docScroll[pos] > Math.min(docSize[sizeKey],winSize[sizeKey])) {
                        if (collision === 'fit') {
                            targetPos[pos] = Math.min(docSize[sizeKey],winSize[sizeKey]) + docScroll[pos] - targetSize[sizeKey];
                        } else if (collision === 'flip') {
                            targetPos[pos] = targetPos[pos] - targetSize[sizeKey];
                            //console.log(targetPos[pos], targetSize[sizeKey]);
                            if (targetPos[pos] < 0) {
                                targetPos[pos] = 0;
                            }
                        }
                    }
                }
            }

            //position fixed
            if (this.props.useLayerForClickAway) {
                targetPos.top -= docST;
                targetPos.left -= docSL;
            }
        } else {
            const basedEl = this.props.basedEl || this.basedEl;
            /*if (!this.refs.layer.getLayer()) {
                return;
            }*/

            const {targetOrigin, basedOrigin} = this.props;
            const basedPos = this.getBasedPosition(basedEl);
            const initPos = {
                top: 0,
                middle: targetEl.offsetHeight / 2,
                bottom: targetEl.offsetHeight,
                left: 0,
                center: targetEl.offsetWidth / 2,
                right: targetEl.offsetWidth
            };

            targetPos = {
                top: basedPos[basedOrigin.vertical] - initPos[targetOrigin.vertical] + parseInt(this.props.offset[0]),
                left: basedPos[basedOrigin.horizontal] - initPos[targetOrigin.horizontal] + parseInt(this.props.offset[1])
            };

            if (scrolling && this.props.autoCloseWhenOffScreen) {
                this.autoCloseWhenOffScreen(basedPos);
            }

            if (this.props.canAutoPosition) {
                targetPos = this.autoPosition(basedPos, initPos, targetOrigin, basedOrigin, targetPos);
            }

            //position:absolute
            if (!this.props.useLayerForClickAway) {
                targetPos.top += docST;
                targetPos.left += docSL;
            }
        }




        //if (this.props.canAutoPosition) {
            targetPos.top = Math.max(0, targetPos.top);
            targetPos.left = Math.max(0, targetPos.left);
        //}


        if (this.props.inline) {
            const containerDOM = this.refs.popoverContainer.parentNode;

            targetPos.top = targetPos.top - containerDOM.offsetTop + containerDOM.scrollTop;
            targetPos.left = targetPos.left - containerDOM.offsetLeft + containerDOM.scrollLeft;
        }


        targetEl.style.top = `${targetPos.top}px`;
        targetEl.style.left = `${targetPos.left}px`;
        //targetEl.style.maxHeight = `${window.innerHeight}px`;
        //TODO: fix the delay of setPlacement
        targetEl.style.opacity = 1;
    };

    autoCloseWhenOffScreen(pos) {
        if (pos.top < 0 ||
            pos.top > window.innerHeight ||
            pos.left < 0 ||
            pos.left > window.innerWidth) {
            this.requestClose('offScreen');
        }
    }

    autoPosition(based, target, basedOrigin, targetOrigin, targetPos) {
        const {positions, basedPos} = this.getPositions(basedOrigin, targetOrigin);

        const winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
              winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (targetPos.top < 0 || targetPos.top + target.bottom > winH) {
            let top = based[basedPos.vertical] - target[positions.y[0]];
            if (top + target.bottom <= winH) {
                targetPos.top = Math.max(0, top);
            } else {
                top = based[basedPos.vertical] - target[positions.y[1]];
                if (top + target.bottom <= winH) {
                    targetPos.top = Math.max(0, top);
                } else {
                    targetPos.top = Math.max(0, winH - target.bottom);
                }
            }
        }

        //pin to baseElement
        if (targetPos.top > based.bottom) targetPos.top = based.bottom;
        if (targetPos.top + target.bottom < based.top) targetPos.top = based.top - target.bottom;


        if (targetPos.left < 0 || targetPos.left + target.right > winW) {
            let left = based[basedPos.horizontal] - target[positions.x[0]];
            if (left + target.right <= winW) {
                targetPos.left = Math.max(0, left);
            } else {
                left = based[basedPos.horizontal] - target[positions.x[1]];
                if (left + target.right <= winW) {
                    targetPos.left = Math.max(0, left);
                } else {
                    targetPos.left = Math.max(0, winW - target.right);
                }
            }
        }

        //pin to baseElement
        if (targetPos.left > based.right) targetPos.left = based.right;
        if (targetPos.left + target.right < based.left) targetPos.left = based.left - target.right;

        return targetPos;
    }

    getOverlapMode(based, target, median) {
        if ([based, target].indexOf(median) > -1) return 'auto';
        if (based === target) return 'inclusive';
        return 'exclusive';
    }

    getPositions(basedOrigin, targetOrigin) {
        const b = {...basedOrigin};
        const t = {...targetOrigin};

        const positions = {
            x: ['left', 'right'].filter((p) => p !== t.horizontal),
            y: ['top', 'bottom'].filter((p) => p !== t.vertical)
        };

        const overlap = {
            x: this.getOverlapMode(b.horizontal, t.horizontal, 'center'),
            y: this.getOverlapMode(b.vertical, t.vertical, 'middle')
        };

        positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'center');
        positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'middle');
        if (overlap.y !== 'auto') {
            b.vertical = b.vertical === 'top' ? 'bottom' : 'top';
        }

        if (overlap.x !== 'auto') {
            b.horizontal = b.horizontal === 'left' ? 'right' : 'left';
        }

        return {
            positions,
            basedPos: b
        };
    }

    render() {
        const {children, style, className = ''} = this.props;
        if (!children) return null;
        if (this.props.inline) {
            const popoverProps = {
                style: Object.assign({}, rootStyle, style),
                className,
                ref: 'popoverContainer'
            };

            if (this.state.open) {
                return <div {...popoverProps}>{children}</div>;
            } else {
                if (this.props.destroyPopupOnHide) {
                    return null;
                } else {
                    popoverProps.style = Object.assign({}, popoverProps.style, {display: 'none'});

                    return <div {...popoverProps}>{children}</div>;
                }
            }
        }
        return (
            <div style={invisibleStyle}>
                <RenderToLayer
                    ref="layer"
                    open={this.state.open}
                    componentClickAway={this.componentClickAway}
                    useLayerForClickAway={this.props.useLayerForClickAway}
                    render={this.renderLayer}
                    destroyPopupOnHide={this.props.destroyPopupOnHide}
                />
            </div>
        );
    }
}