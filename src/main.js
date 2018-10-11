const { fromEvent, combineLatest, merge } = rxjs;
const { map, filter, flatMap, takeUntil } = rxjs.operators;

const drawingArea = document.querySelector('#drawing-area')
const mouseDownObservable = fromEvent(drawingArea, 'mousedown')
const mouseUpObservable = fromEvent(document.documentElement, 'mouseup')
const mouseMoveObservable = fromEvent(drawingArea, 'mousemove')

const mouseDragObservable =
    mouseDownObservable
        .pipe(
            flatMap(
                () => mouseMoveObservable.pipe(takeUntil(mouseUpObservable))
            )
        )

const mouseDrawObservable = merge(mouseDownObservable, mouseDragObservable)

var context = drawingArea.getContext('2d');

mouseDrawObservable.subscribe({
    next: x => {
        if (x.type === 'mousedown') {
            context.moveTo(x.offsetX, x.offsetY);
        } else if (x.type === 'mousemove') {
            context.lineTo(x.offsetX, x.offsetY);
            context.stroke();
        }
    }
})