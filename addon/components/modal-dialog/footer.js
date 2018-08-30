import Component from '@ember/component';
import layout from '../../templates/components/modal-dialog/footer';

export default Component.extend({
	layout,
	classNames: ['modal-footer'],

	actions: {
		button(btn) {
			this.get('dialog').trigger('buttonPressed', btn);
		}
	}
});
