import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { join } from 'path';
import { GetNotionPageOption } from './types';

/* Convert Notion Data */

export function richTextToString(input: RichTextItemResponse[]): string {
  return input.map((r) => r.plain_text).join('');
}

/* Path Management */

export function getCachePath(
  option: GetNotionPageOption,
  id: string,
  filename: string
) {
  return join(option.paths.data, id.replace(/-/g, ''), filename);
}

export const getPageJsonPath = (option: GetNotionPageOption, id: string) =>
  getCachePath(option, id, 'page.json');

export const getBlocksJsonPath = (option: GetNotionPageOption, id: string) =>
  getCachePath(option, id, 'blocks.json');

export function getImagePublicPath(
  option: GetNotionPageOption,
  id: string,
  filename: string
) {
  return join(option.paths.imagePublicPath, id, filename);
}

export function getImageStoragePath(
  option: GetNotionPageOption,
  id: string,
  filename: string
) {
  return join(option.paths.image, id, filename);
}

/* */

/**
 * groupItemsBy
 * used to group list items into a list object so we can render corrosponding HTML structure
 * @param inputArray
 * @param selectItem
 * @param createGroup
 * @returns
 */
export function groupItemsBy<T = unknown, P = unknown>(
  inputArray: T[],
  selectItem: (element: T) => boolean,
  createGroup: (element: T[]) => P
) {
  const result: (T | P)[] = [];
  const selectionArr: boolean[] = inputArray.map(selectItem);
  // iterate through the input array with the pointer `i`
  let i = 0;
  do {
    const isCurrentSelected = selectionArr[i];
    if (isCurrentSelected === false) {
      result.push(inputArray[i]);
    } else {
      // if encounter a selected item, start collecting items that should be in the group
      const groupItems = [inputArray[i]];
      // go forward in the array in a separated loop
      while (i < inputArray.length) {
        // look at the next one...
        i = i + 1;
        // if it is also a selected item, collect it into the group collection as well.
        if (selectionArr[i]) {
          groupItems.push(inputArray[i]);
        } else {
          // if not, break out from this internal loop
          break;
        }
      }
      // create a group object with the final group collection
      result.push(createGroup(groupItems));
      // don't forget to push the non-selected item we encountered above into the result after the group.
      if (i < inputArray.length) {
        result.push(inputArray[i]);
      }
    }
    i++;
  } while (i < inputArray.length);
  return result;
}

export function* uniqueId(prefix?: string): Generator<string, string, string> {
  let index = 0;
  while (true) {
    yield `${prefix}${index}`;
    index++;
  }
}
