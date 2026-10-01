import type { QueryObserverResult } from '@ngneat/query';

export type QueryState<T> =
  | { status: 'pending' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: T };

export function toQueryState<T>(result: QueryObserverResult<T>): QueryState<T> {
  if (result.isPending) {
    return { status: 'pending' };
  }
  if (result.isError) {
    return { status: 'error', error: result.error };
  }
  return { status: 'success', data: result.data as T };
}
