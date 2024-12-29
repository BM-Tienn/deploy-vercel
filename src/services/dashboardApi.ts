import { BaseXHR } from 'utils/axios';

export const getChartData = () =>
  BaseXHR.$get('/corepulse/cms/api/dashboard/chartData');
