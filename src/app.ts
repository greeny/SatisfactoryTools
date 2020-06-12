import '@src/../styles/bootstrap.scss';
import '@src/../node_modules/ui-select/dist/select.css';
import '@src/../styles/style.scss';

import 'script-loader!../node_modules/jquery/dist/jquery.min';
import 'script-loader!../node_modules/jquery-ui-dist/jquery-ui.min';
import 'script-loader!../node_modules/popper.js/dist/umd/popper.min';
import 'script-loader!../node_modules/bootstrap/dist/js/bootstrap.min';
import * as angular from 'angular';
import 'script-loader!../node_modules/angular-sanitize/angular-sanitize.min';
import 'script-loader!../node_modules/angular-animate/angular-animate.min';
import 'script-loader!../node_modules/angular-ui-router/release/angular-ui-router.min';
import 'script-loader!../node_modules/ui-bootstrap4/dist/ui-bootstrap';
import 'script-loader!../node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls';
import 'script-loader!../node_modules/ui-select/dist/select.min';
import 'script-loader!../node_modules/angular-ui-sortable/dist/sortable.min';
import 'script-loader!../node_modules/perfect-scrollbar/dist/perfect-scrollbar.min';
import 'script-loader!../node_modules/angular-breadcrumb/dist/angular-breadcrumb.min';

import {AppModule} from '@src/Module/AppModule';

new AppModule(angular.module('app', ['ui.sortable', 'ui.select', 'ui.router', 'ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ncy-angular-breadcrumb'])).register();
