let pos = { top: 0, left: 0, x: 0, y: 0 };

function allowDrop(e){
    e.preventDefault();
}

function dragEventHandler(e){
    e.dataTransfer.setData('drop_type', e.target.id);
    
    simulateMouseUp('container')
}

function dropEventHandler (e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('drop_type')
    const canvas = document.getElementById('canvas');
    let htmlNode = document.createElement('div');
    htmlNode.style.top = e.pageY + 'px';
    htmlNode.style.left = e.pageX + 'px';
    htmlNode.className = "canvas-element"
    htmlNode.innerHTML = `
    <div class="canvas-element-note">
        This is a ${data} at X: ${e.pageX} - Y: ${e.pageY}
        ${JSON.stringify(canvas.getBoundingClientRect())}
    </div>
    `
    canvas.appendChild(htmlNode);
    console.log(canvas.getBoundingClientRect());
    console.log('X: ' + e.pageX + ' - Y:' + e.pageY);
    console.log('ScrollTop: ' + pos.top + ' - ScrollLeft:' + pos.left);
}

function simulateMouseUp(id) {
    const element = document.getElementById(id);
    const mouseUpSimulator = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    element.dispatchEvent(mouseUpSimulator);
}

function domContentLoadedHandler() {
    const ele = document.getElementById('container');
    ele.style.cursor = 'grab';

    const canvas = document.getElementById('canvas');

    const rightBoundRect = canvas.getBoundingClientRect().right / 8;
    const bottomBoundRect = canvas.getBoundingClientRect().bottom / 8;

    ele.scrollTo(rightBoundRect * 3, bottomBoundRect * 3);

    const mouseDownHandler = function (e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    function mouseUpHandler() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
}

document.addEventListener('DOMContentLoaded', domContentLoadedHandler())