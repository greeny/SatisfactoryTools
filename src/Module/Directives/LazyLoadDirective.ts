import {IDirective, IScope} from 'angular';

export class LazyLoadDirective implements IDirective
{
	public transclude = true;
	public restrict = 'A';
	public scope = {
		imgSrc: '@',
	};

	public link($scope: IScope, $element: JQLite): void
	{
		const updateImage = () => $element[0].setAttribute('src', $element[0].getAttribute('img-src') + '');
		const loadImg = (changes: IntersectionObserverEntry[]) => {
			changes.forEach((change: IntersectionObserverEntry) => {
				if ((change.isIntersecting || change.intersectionRatio > 0) && change.target.getAttribute('src') !== $element[0].getAttribute('img-src') + '') {
					updateImage();
				}
			});
		};

		const watch = $scope.$watch('imgSrc', ((newValue, oldValue) => {
			if (newValue !== oldValue) {
				updateImage();
			}
		}));
		const observer = new IntersectionObserver(loadImg);
		observer.observe($element[0]);
		$element.on('$destroy', watch);
	}
}
