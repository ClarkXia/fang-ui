import React from 'react';

export function loopChildren(childs, callback, parent) {
    const loop = (children, level, _parent) => {
        const len = getChildrenLength(children);
        React.Children.forEach(children, (item, index) => {
            const pos = `${level}-${index}`;
            if (item.props.children && item.type && item.type.isTreeNode) {
                loop(item.props.children, pos, {node: item, pos});
            }
            callback(item, index, pos, item.key || pos, getSiblingPosition(index, len, {}), _parent);
        });
    };

    loop(childs, 0, parent);
}

export function filterParentPosition(arr) {
    const levelObj = {};
    arr.forEach((item) => {
        const posLen = item.split('-').length;
        if(!levelObj[posLen]) {
            levelObj[posLen] = [];
        }
        levelObj[posLen].push(item);
    })

    const levelArr = Object.keys(levelObj).sort();

    for (let i = 0; i < levelArr.length; i++) {
        if (levelArr[i + 1]) {
            levelObj[levelArr[i]].forEach((item) => {
                for (let j = i + 1; j< levelArr.length; j++) {
                    levelObj[levelArr[j]].forEach((_i, index) => {
                        if (isInclude(item.split('-'), _i.split('-'))) {
                            levelObj[levelArr[j]][index] = null;
                        }
                    });
                    levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(p => p);
                }
            })
        }
    }

    let nArr = [];
    levelArr.forEach(i => {
        nArr = nArr.concat(levelObj[i]);
    })

    return nArr;
}

export function handleCheck(obj, checkedPositions, checked){
    let objKeys = Object.keys(obj);
    objKeys.forEach((i, index) => {
        const posArr = i.split('-');
        let saved = false;

        checkedPositions.forEach((_pos) => {
            const _posArr = _pos.split('-');
            if (posArr.length > _posArr.length && isInclude(_posArr, posArr)) {
                obj[i].halfChecked = false;
                obj[i].checked = checked;
                objKeys[index] = null;
            }

            if (_posArr[0] === posArr[0] && _posArr[1] === posArr[1]) {
                saved = true;
            }
        });
        if (!saved) objKeys[index] = null;
    });
    objKeys = objKeys.filter(i => i);


    for (let pIndex = 0; pIndex < checkedPositions.length; pIndex++) {
        const loop = (_pos) => {
            const _posLen = _pos.split('-').length;
            if (_posLen <= 2) return;

            let sibling = 0;
            let siblingChecked = 0;
            const parentPosition = stripTail(_pos);
            objKeys.forEach((i) => {
                const iArr = i.split('-');
                if (iArr.length === _posLen && isInclude(parentPosition.split('-'), iArr)) {
                    sibling++;
                    if (obj[i].checked) {
                        siblingChecked++;
                        const _i = checkedPositions.indexOf(i);
                        if (_i > -1) {
                            checkedPositions.splice(_i, 1);
                            if (_i <= pIndex) {
                                pIndex--;
                            }
                        }
                    } else if (obj[i].halfChecked) {
                        siblingChecked += 0.5;
                    }
                }
            });
            const parent = obj[parentPosition];
            if (parent) {
                if (siblingChecked === 0) {
                    parent.checked = false;
                    parent.halfChecked = false;
                } else if (siblingChecked === sibling) {
                    parent.checked = true;
                    parent.halfChecked = false;
                } else {
                    parent.halfChecked = true;
                    parent.checked = false;
                }
            }

            loop(parentPosition);
        };

        loop(checkedPositions[pIndex], pIndex);
    }
}

export function getCheck(treeNodesStates) {
    const halfCheckedKeys = [];
    const checkedKeys = [];
    const checkedNodes = [];
    const checkedNodesPositions = [];
    Object.keys(treeNodesStates).forEach((item) => {
        const itemObj = treeNodesStates[item];
        if (itemObj.checked) {
            checkedKeys.push(itemObj.key);
            checkedNodes.push(itemObj.node);
            checkedNodesPositions.push({ node: itemObj.node, pos: item });
        } else if (itemObj.halfChecked) {
            halfCheckedKeys.push(itemObj.key);
        }
    });
    return {
        halfCheckedKeys, checkedKeys, checkedNodes, checkedNodesPositions, treeNodesStates
    };
}

export function arrayEqual(a, b) {
    if (a === b) return true;
    if (a === null || typeof a === 'undefined' || b === null || typeof b === 'undefined') {
        return false;
    }
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function stripTail(str) {
    const arr = str.match(/(.+)(-[^-]+)$/);
    let st = '';
    if (arr && arr.length === 3) {
        st = arr[1];
    }
    return st;
}

export function isInclude(smallArr, bigArr) {
    return smallArr.every((i, _i) => {
        return i === bigArr[_i];
    });
}

function getChildrenLength(children) {
    return Array.isArray(children) ? children.length : 1;
}

function getSiblingPosition(index, len, siblingPosition) {
    if (len === 1) {
        siblingPosition.first = true;
        siblingPosition.last = true;
    } else {
        siblingPosition.first = index === 0;
        siblingPosition.last = index === len - 1;
    }

    return siblingPosition;
}