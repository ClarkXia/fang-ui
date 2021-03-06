export default function getPlacements(position) {
    const posArray = position.split('-');
    let basedOrigin = {
            vertical: '',
            horizontal: ''
        },
        targetOrigin = {
            vertical: '',
            horizontal: ''
        };

    const mapArray = [
        {position: 'top', direction: 'vertical'},
        {position: 'bottom', direction: 'vertical'},
        {position: 'left', direction: 'horizontal'},
        {position: 'right', direction: 'horizontal'}
    ];

    for (let i = 0; i < mapArray.length; i++) {
        const item = mapArray[i];
        if (posArray[0] === item.position) {
            basedOrigin[item.direction] = item.position;
            targetOrigin[item.direction] = getOpposite(item.direction, item.position);

            const oppositeDirection = getOpposite(item.direction);
            if (!posArray[1]) {
                basedOrigin[oppositeDirection] = targetOrigin[oppositeDirection] = getCenter(oppositeDirection);
            } else {
                basedOrigin[oppositeDirection] = targetOrigin[oppositeDirection] = posArray[1];
            }

            return {
                basedOrigin,
                targetOrigin,
                offset: [0, 0]
            };
        }
    }

    return false;
}

export function getTooltipPlacement(basedOrigin, targetOrigin) {
    const { vertical: basedVertical, horizontal: basedHorizontal } = basedOrigin;
    const { vertical: targetVertical, horizontal: targetHorizontal } = targetOrigin;
    let placement = '';

    ['vertical', 'horizontal'].forEach(key => {
        if (basedOrigin[key] !== targetOrigin[key]) {
            placement = basedOrigin[key];

            const oppositeKey = getOpposite(key);
            if (basedOrigin[oppositeKey] === targetOrigin[oppositeKey] && basedOrigin[oppositeKey] !== getCenter(oppositeKey)) {
                placement += `-${basedOrigin[oppositeKey]}`;
            }
        }
    });

    return placement;
}


function getOpposite(direction, position) {
    return typeof position === 'string' ?
            (direction === 'horizontal' ? (position === 'left' ? 'right' : 'left') : (position === 'top' ? 'bottom' : 'top')) :
            (direction === 'horizontal' ? 'vertical' : 'horizontal')
}

function getCenter(direction) {
    return direction === 'horizontal' ? 'center' : 'middle';
}