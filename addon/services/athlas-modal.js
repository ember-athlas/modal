import Service from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Service.extend({
	okLabel: 'Ok',
	okClass: 'btn-primary',

	cancelLabel: 'Cancel',
	cancelClass: 'btn-secondary',

	saveLabel: 'Save',
	saveClass: 'btn-success',

	alertOkLabel: oneWay('okLabel'),
	alertOkClass: oneWay('okClass'),

	confirmOkLabel: oneWay('okLabel'),
	confirmOkClass: oneWay('okClass'),

	formOkLabel: oneWay('saveLabel'),
	formOkClass: oneWay('saveClass'),

	promptOkLabel: oneWay('okLabel'),
	promptOkClass: oneWay('saveClass'),
	promptErrorMessage: 'Cannot be empty'
});
