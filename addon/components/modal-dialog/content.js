import Component from '@ember/component';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import layout from '../../templates/components/modal-dialog/content';

export default Component.extend({
	layout,
	classNames: ['modal-content'],

	header: computed('dialog.{title,closeButton}', function () {
		return this.get('dialog.closeButton') || !isBlank(this.get('dialog.title'));
	}),
	footer: computed('dialog.buttons', function () {
		return this.get('dialog.buttons').length > 0;
	}),
});
