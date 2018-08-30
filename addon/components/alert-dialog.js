import ModalDialog from './modal-dialog';
import { set, observer } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default ModalDialog.extend({
	athlas: service('athlas-modal'),

	okLabel: oneWay('athlas.alertOkLabel'),
	okClass: oneWay('athlas.alertOkClass'),

	buttonObserver: observer('okLabel', 'okClass', function () {
		let buttons = this.get('buttons').slice();
		set(buttons[0], 'label', this.get('okLabel'));
		set(buttons[0], 'class', this.get('okClass'));
		this.set('buttons', buttons);
	}),

	init() {
		this._super(...arguments);

		this.set('buttons', [
			{
				class: this.get('okClass'),
				label: this.get('okLabel')
			}
		]);
	},
});
