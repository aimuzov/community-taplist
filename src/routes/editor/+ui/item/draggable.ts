let dragEl: HTMLElement | null = null;

export type OnDragDrop = (current: number, next: number) => void;

function dragStart(this: HTMLElement, event: DragEvent) {
	document.body.classList.add('dragging');
	this.classList.add('highlighted');

	dragEl = this; // eslint-disable-line @typescript-eslint/no-this-alias

	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('index', this.dataset.index ?? '');
	}
}

function dragEnter(this: HTMLElement) {
	this.classList.add('over');
}

function dragLeave(this: HTMLElement) {
	this.classList.remove('over');
}

function dragOver(event: DragEvent) {
	event.preventDefault();

	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = 'move';
	}

	return false;
}

function dragDrop(this: HTMLElement, event: DragEvent, onDragDrop: OnDragDrop) {
	if (dragEl != this) {
		const current = Number(this.dataset.index);
		const next = Number(event.dataTransfer?.getData('index'));

		onDragDrop(current, next);
	}

	return false;
}

function dragEnd(this: HTMLElement) {
	document.body.classList.remove('dragging');

	document.querySelectorAll('.draggable.over').forEach((item) => item.classList.remove('over'));

	this.classList.remove('highlighted');
}

export function draggable(node: HTMLElement, onDragDrop: OnDragDrop) {
	node.draggable = true;

	function dragDropExtended(this: HTMLElement, event: DragEvent) {
		return dragDrop.call(this, event, onDragDrop);
	}

	node.addEventListener('dragstart', dragStart, false);
	node.addEventListener('dragenter', dragEnter, false);
	node.addEventListener('dragover', dragOver, false);
	node.addEventListener('dragleave', dragLeave, false);
	node.addEventListener('drop', dragDropExtended, false);
	node.addEventListener('dragend', dragEnd, false);

	return {
		destroy() {
			node.removeEventListener('dragstart', dragStart, false);
			node.removeEventListener('dragenter', dragEnter, false);
			node.removeEventListener('dragover', dragOver, false);
			node.removeEventListener('dragleave', dragLeave, false);
			node.removeEventListener('drop', dragDropExtended, false);
			node.removeEventListener('dragend', dragEnd, false);
		}
	};
}
