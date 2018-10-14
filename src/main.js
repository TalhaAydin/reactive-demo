const { fromEvent, combineLatest, merge } = rxjs;
const { map, filter, flatMap, takeUntil, startWith } = rxjs.operators;

const drawingArea = document.querySelector('#drawing-area')
const mouseDownObservable = fromEvent(drawingArea, 'mousedown')
const mouseUpObservable = fromEvent(document.documentElement, 'mouseup')
const mouseMoveObservable = fromEvent(drawingArea, 'mousemove')

const mouseDrawObservable =
    mouseDownObservable
        .pipe(
            flatMap(
                (mouseDownEvent) => mouseMoveObservable.pipe(
                  startWith(mouseDownEvent),
                  takeUntil(mouseUpObservable)
                )
            )
        )

const context = drawingArea.getContext('2d');

mouseDrawObservable.subscribe({
    next: x => {
        console.log(x)
        if (x.type === 'mousedown') {
            context.moveTo(x.offsetX, x.offsetY);
        } else if (x.type === 'mousemove') {
            context.lineTo(x.offsetX, x.offsetY);
            context.stroke();
        }
    }
})