import { isBlank } from '@ember/utils';
import { oneWay } from '@ember/object/computed';
import FormDialog from './form-dialog';

export default FormDialog.extend({
	bodyComponent: 'prompt-dialog/body',

	okLabel: oneWay('athlas.formOkLabel'),
	okClass: oneWay('athlas.formOkClass'),

	message: '',

	required: true,
	errorMessage: oneWay('athlas.promptErrorMessage'),

	didInsertElement() {
		this._super(...arguments);

		this.on('opening', () => {
			this.set('showError', false);
		})

		this.on('opened', () => {
			const node = document.getElementById(this.get('elementId') + '-input');
			node.focus();
		});

		this.on('closed', () => {
			this.set('value', '');
		});
	},

	validate() {
		let valid = !this.get('allowEmpty') ? !isBlank(this.get('value')) : true;

		this.set('showError', !valid);

		return valid;
	},

	triggerSuccess() {
		this.trigger('success', this.get('value'));
	}
});
