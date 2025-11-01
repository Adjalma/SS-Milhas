/**
 * Services Index
 * 
 * Exportação centralizada de todos os services da API
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import api from './api';
import * as movementAPI from './movementAPI';
import * as financialAPI from './financialAPI';
import * as taskAPI from './taskAPI';
import * as dashboardAPI from './dashboardAPI';
import * as reportAPI from './reportAPI';

export {
  api,
  movementAPI,
  financialAPI,
  taskAPI,
  dashboardAPI,
  reportAPI
};

export default {
  api,
  movements: movementAPI,
  financial: financialAPI,
  tasks: taskAPI,
  dashboard: dashboardAPI,
  reports: reportAPI
};

