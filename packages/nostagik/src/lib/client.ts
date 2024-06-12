import { Client } from '@notionhq/client';
import { GetNotionPageOption } from './types';

export function getNotionClient(option: GetNotionPageOption) {
  option;
  return new Client({
    auth: option.notionClientAuthToken,
  });
}
