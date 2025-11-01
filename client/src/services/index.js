/**
 * Services Index
 * 
 * Exportação centralizada de todos os services da API
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

import api from './api';
import movementAPI from './movementAPI';
import financialAPI from './financialAPI';
import taskAPI from './taskAPI';
import dashboardAPI from './dashboardAPI';
import reportAPI from './reportAPI';

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

