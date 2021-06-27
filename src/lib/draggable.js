let dragEl;

function dragStart(event) {
	document.body.classList.add('dragging');
	this.classList.add('highlighted');

	dragEl = this;
	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData('index', this.dataset.index);
}

function dragEnter() {
	this.classList.add('over');
}

function dragLeave() {
	this.classList.remove('over');
}

function dragOver(event) {
	event.preventDefault();
	event.dataTransfer.dropEffect = 'move';
	return false;
}

function dragDrop(event, onDragDrop) {
	if (dragEl != this) {
		const current = this.dataset.index;
		const next = event.dataTransfer.getData('index');

		onDragDrop(current, next);
	}

	return false;
}

function dragEnd() {
	document.body.classList.remove('dragging');

	var listItems = document.querySelectorAll('.draggable');

	[].forEach.call(listItems, (item) => {
		item.classList.remove('over');
	});

	this.classList.remove('highlighted');
}

export function draggable(node, onDragDrop) {
	node.draggable = true;

	function dragDropExtended(event) {
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
