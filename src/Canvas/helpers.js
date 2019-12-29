export function getOffset(mouseEvent, context) {
    return {
        x: mouseEvent.clientX - context.getBoundingClientRect().x,
        y: mouseEvent.clientY - context.getBoundingClientRect().y
    };
}