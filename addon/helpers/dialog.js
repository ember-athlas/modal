import { helper } from '@ember/component/helper';

export function dialog(params/*, hash*/) {
	return function (/*...args*/) {
		if (params[0]) {
			const element = document.querySelector(params[0]);
			if (element && element.open && typeof (element.open) === 'function') {
				element.open();
			}
		}
	};
}

export default helper(dialog);
