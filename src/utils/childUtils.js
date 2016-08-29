import createFragment from 'react-addons-create-fragment';

export function createChildFragment(fragments) {
    const newFragments = {};
    let validChildrenCount = 0;
    let firstKey;

    // Only create non-empty key fragments
    for (const key in fragments) {
    const currentChild = fragments[key];

    if (currentChild) {
        if (validChildrenCount === 0) firstKey = key;
            newFragments[key] = currentChild;
            validChildrenCount++;
        }
    }

    if (validChildrenCount === 0) return undefined;
    if (validChildrenCount === 1) return newFragments[firstKey];
    return createFragment(newFragments);
}