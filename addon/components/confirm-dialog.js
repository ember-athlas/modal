import ModalDialog from './modal-dialog';
import { set, observer } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default ModalDialog.extend({
	athlas: service('athlas-modal'),

	okLabel: oneWay('athlas.confirmOkLabel'),
	okClass: oneWay('athlas.confirmOkClass'),

	cancelLabel: oneWay('athlas.cancelLabel'),
	cancelClass: oneWay('athlas.cancelClass'),

	buttonObserver: observer('okLabel', 'okClass', 'cancelLabel', 'cancelClass', function () {
		let buttons = this.get('buttons').slice();
		set(buttons[0], 'label', this.get('cancelLabel'));
		set(buttons[0], 'class', this.get('cancelClass'));
		set(buttons[1], 'label', this.get('okLabel'));
		set(buttons[1], 'class', this.get('okClass'));
		this.set('buttons', buttons);
	}),

	init() {
		this._super(...arguments);

		this.set('buttons', [
			{
				class: this.get('cancelClass'),
				label: this.get('cancelLabel')
			}, {
				type: 'submit',
				class: this.get('okClass'),
				label: this.get('okLabel')
			}
		]);

		this.on('buttonPressed', btn => {
			if (btn.type === 'submit') {
				this.trigger('okPressed');
			} else {
				this.trigger('cancelPressed');
			}
		});
	}
});
