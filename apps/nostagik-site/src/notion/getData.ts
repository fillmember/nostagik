import {
  GetNotionPageOption,
  getAllPages as getAll,
  getNotionPage as getOne,
} from '@nostagik/core';
import nostagikConfig from './nostagikConfig';

const option: Partial<GetNotionPageOption> = {};

export const getAllPages = () => getAll(nostagikConfig, option);

export const getNotionPage = (id: string) => getOne(id, option);
