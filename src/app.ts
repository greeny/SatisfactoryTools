import '@src/../styles/bootstrap.scss';
import '@src/../styles/custom_styles.scss';

import * as angular from 'angular';
import 'script-loader!../node_modules/angular-sanitize/angular-sanitize.min.js';
import 'script-loader!../node_modules/angular-ui-router/release/angular-ui-router.min.js';
import 'script-loader!../node_modules/angular-animate/angular-animate.min.js';
import 'script-loader!../node_modules/ui-bootstrap4/dist/ui-bootstrap.js';
import 'script-loader!../node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js';
import {AppModule} from '@src/Module/AppModule';

new AppModule(angular.module('app', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'ngAnimate'])).register();
