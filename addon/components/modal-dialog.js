import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import Evented from '@ember/object/evented';
import layout from '../templates/components/modal-dialog';

const ClassName = {
	SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
	BACKDROP: 'modal-backdrop',
	OPEN: 'modal-open',
	SHOW: 'show'
};

const Selector = {
	DIALOG: '.modal-dialog',
	DATA_DISMISS: '[data-dismiss="modal"]',
	FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
	STICKY_CONTENT: '.sticky-top',
	NAVBAR_TOGGLER: '.navbar-toggler'
};

const stack = [];

/**
 * A Modal Dialog Component
 *
 * @class ModalDialog
 */
export default Component.extend(Evented, {
	layout,

	classNames: ['modal'],
	classNameBindings: ['fade'],
	attributeBindings: ['tabindex', 'role', 'titleId:aria-labelledby'],
	ariaRole: 'dialog',
	tabindex: '-1',
	role: 'dialog',

	closeButton: true,
	visible: false,

	title: null,
	size: null,

	contentComponent: 'modal-dialog/content',
	headerComponent: 'modal-dialog/header',
	bodyComponent: 'modal-dialog/body',
	footerComponent: 'modal-dialog/footer',

	sizeClass: computed('size', function () {
		let size = this.get('size');
		return isBlank(size) ? null : `modal-${size}`;
	}),

	titleId: computed('elementId', function () {
		return this.get('elementId') + '-title';
	}),

	buttonsSupervised: computed('buttons', function () {
		let buttons = [];
		this.get('buttons').forEach(button => {
			if (!button.hasOwnProperty('type')) {
				button.type = 'button';
			}

			if (!button.hasOwnProperty('dismiss')) {
				button.dismiss = true;
			}

			set(button, 'disabled', button.hasOwnProperty('enabled') ? !button.enabled : false);

			buttons.push(button);
		});

		return buttons;
	}),

	init() {
		this._super(...arguments);

		if (this.get('buttons') === undefined) {
			this.set('buttons', []);
		}

		this.on('buttonPressed', (btn) => {
			if (btn.dismiss) {
				this.close();
			}
		});
	},

	didInsertElement() {
		this._super(...arguments);

		const element = this.get('element');

		// add keydown listener for closing on ESC
		document.body.addEventListener('keydown', this);

		// move to body from whereever it is
		element.parentElement.removeChild(element);
		document.body.appendChild(element);

		// public API
		element.close = () => {
			this.close();
		};

		element.open = () => {
			this.open();
		};

		element.on = (event, handler) => {
			this.on(event, handler);
		};

		element.one = (event, handler) => {
			this.one(event, handler);
		};

		element.off = (event, handler) => {
			this.off(event, handler);
		};

		if (this.get('visible')) {
			this.set('visible', false);
			this.open();
		}
	},

	willDestroyElement() {
		this._super(...arguments);

		const element = this.get('element');
		element.parentElement.removeChild(element);

		document.body.removeEventListener('keydown', this);
	},

	handleEvent(e) {
		switch (e.type) {
			case 'keydown':
				if (e.keyCode === 27) {
					const diag = this.getActiveDialog();
					if (diag) {
						diag.close();
					}
				}
				break;
		}
	},

	getActiveDialog() {
		if (stack.length) {
			return stack[stack.length - 1];
		}
	},

	open() {
		if (this.get('visible')) {
			return;
		}

		this.trigger('opening');

		const element = this.get('element');
		const content = element.querySelector('.modal-content');

		const elems = element.querySelectorAll(Selector.DATA_DISMISS);
		for (let elem of elems) {
			elem.addEventListener('click', () => {
				this.close();
			}, { once: true });
		}

		element.addEventListener('click', (e) => {
			if (e.path && typeof(e.path.includes) === 'function' && !e.path.includes(content)) {
				this.close();
			}
		});

		element.classList.add(ClassName.SHOW);
		element.scrollTop = 0;
		element.style.display = 'block';
		element.removeAttribute('aria-hidden');
		document.body.classList.add(ClassName.OPEN);
		this.showBackdrop();


		this.addStack();

		this.set('visible', true);
		this.trigger('opened');
	},

	close() {
		if (!this.get('visible')) {
			return;
		}
		this.trigger('closing');

		this.hideBackdrop();

		const element = this.get('element');
		element.classList.remove(ClassName.SHOW);
		if (stack.length === 0) {
			document.body.classList.remove(ClassName.OPEN);
		}

		element.style.display = 'none';
		element.setAttribute('aria-hidden', true);

		this.removeStack();

		this.set('visible', false);
		this.trigger('closed');
	},

	showBackdrop() {
		this.backdropElement = document.createElement('div');
		this.backdropElement.className = `${ClassName.BACKDROP} ${ClassName.SHOW}`;
		document.body.insertBefore(this.backdropElement, this.get('element'));
	},

	hideBackdrop() {
		document.body.removeChild(this.backdropElement);
	},

	addStack() {
		stack.push(this);
		this.updateActiveDialog();
	},

	removeStack() {
		const index = stack.indexOf(this);
		stack.splice(index, 1);
		this.updateActiveDialog();
	},

	updateActiveDialog() {
		stack.forEach(diag => {
			diag.get('element').classList.remove('modal-dialog-active');
			diag.get('element').classList.add('modal-dialog-inactive');
		});

		if (stack.length) {
			const active = this.getActiveDialog();
			active.get('element').classList.remove('modal-dialog-inactive');
			active.get('element').classList.add('modal-dialog-active');
		}
	}
});
