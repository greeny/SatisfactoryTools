import '@src/../styles/bootstrap-theme.css';
import '@src/../styles/app.less';

import * as angular from 'angular';
import 'script-loader!../node_modules/jquery/dist/jquery.min.js';
import 'script-loader!../node_modules/popper.js/dist/umd/popper.min.js';
import 'script-loader!../node_modules/bootstrap/dist/js/bootstrap.min.js';
import 'script-loader!../node_modules/angular-sanitize/angular-sanitize.min.js';
import 'script-loader!../node_modules/angular-animate/angular-animate.min.js';
import 'script-loader!../node_modules/angular-ui-router/release/angular-ui-router.min.js';
import 'script-loader!../node_modules/ui-bootstrap4/dist/ui-bootstrap.js';
import 'script-loader!../node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js';
import 'script-loader!../node_modules/ngstorage/ngStorage.min';
import {AppModule} from '@src/Module/AppModule';

new AppModule(angular.module('app', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngStorage'])).register();
