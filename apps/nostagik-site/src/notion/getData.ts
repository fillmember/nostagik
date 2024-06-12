import {
  GetNotionPageOption,
  getAllPages as getAll,
  getNotionPage as getOne,
} from '@nostagik/core';
import nostagikConfig from './nostagikConfig';

const option: Partial<GetNotionPageOption> = {
  notionClientAuthToken: process.env['NOTION_TOKEN'],
  localDataMinimumValidTime: 0,
};

console.log(
  typeof process.env['NOTION_TOKEN'],
  process.env['NOTION_TOKEN']?.length
);

export const getAllPages = () => getAll(nostagikConfig, option);

export const getNotionPage = (id: string) => getOne(id, option);
