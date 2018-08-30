import { set, observer } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ConfirmDialog from './confirm-dialog';

export default ConfirmDialog.extend({
	athlas: service('athlas-modal'),

	contentComponent: 'form-dialog/content',

	canSubmit: true,
	hasSuccess: false,
	isValidated: false,

	okLabel: oneWay('athlas.formOkLabel'),
	okClass: oneWay('athlas.formOkClass'),

	init() {
		this._super(...arguments);

		// set 'submit' button to not dismissable
		let buttons = this.get('buttons');
		set(buttons[1], 'enabled', this.get('canSubmit'));
		buttons.forEach((btn) => {
			if ((btn.type && btn.type === 'submit')) {
				btn.dismiss = false;
			}
		});
		this.set('buttons', buttons);

		this.on('okPressed', () => {
			const form = document.getElementById(`${this.get('elementId')}-content`);
			if (form.checkValidity() === false || this.checkValidity() === false) {
				form.classList.add('was-validated');
				this.set('isValidated', true);
			} else {
				this.triggerSuccess();
			}
		});

		this.on('success', () => {
			this.set('hasSuccess', true);
			this.close();
		});

		this.on('opened', () => {
			this.set('hasSuccess', false);
			this.set('isValidated', false);
			const form = document.getElementById(`${this.get('elementId')}-content`);
			form.classList.remove('was-validated');
		});

		this.on('closed', () => {
			if (!this.get('hasSuccess')) {
				this.trigger('cancel');
			}
		});
	},

	canSubmitObserver: observer('canSubmit', function () {
		let buttons = this.get('buttons').slice();
		set(buttons[1], 'enabled', this.get('canSubmit'));
		this.set('buttons', buttons);
	}),

	canValidate() {
		return typeof this.validate === 'function' || this.get('validate');
	},

	checkValidity() {
		if (typeof this.validate === 'function') {
			return this.validate();
		}

		if (this.get('validate')) {
			return this.get('validate')();
		}

		return true;
	},

	triggerSuccess() {
		this.trigger('success');
	}
});
