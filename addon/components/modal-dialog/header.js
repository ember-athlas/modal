import Component from '@ember/component';
import layout from '../../templates/components/modal-dialog/header';

export default Component.extend({
	layout,
	classNames: ['modal-header'],

	title: null,
	closeButton: true,
});
