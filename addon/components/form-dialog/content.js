import ModalDialogContent from '@ember-athlas/modal/components/modal-dialog/content';

export default ModalDialogContent.extend({
	tagName: 'form',
	attributeBindings: ['novalidate'],
	novalidate: true
});
