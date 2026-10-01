import type { QueryObserverResult } from '@ngneat/query';
import { toQueryState } from './query-state';

interface FakeResultShape {
  isPending: boolean;
  isError: boolean;
  data?: string;
  error?: unknown;
}

function fakeResult(partial: Partial<FakeResultShape>): QueryObserverResult<string> {
  const shape: FakeResultShape = {
    isPending: false,
    isError: false,
    data: undefined,
    error: null,
    ...partial,
  };
  return shape as unknown as QueryObserverResult<string>;
}

describe('toQueryState', () => {
  it('maps a pending result to a pending state, regardless of stale data present', () => {
    const result = fakeResult({ isPending: true, data: 'stale-but-irrelevant' });

    expect(toQueryState(result)).toEqual({ status: 'pending' });
  });

  it('maps an error result to an error state carrying the original error', () => {
    const error = new Error('network down');
    const result = fakeResult({ isPending: false, isError: true, error });

    expect(toQueryState(result)).toEqual({ status: 'error', error });
  });

  it('maps a successful result to a success state carrying the data', () => {
    const result = fakeResult({ isPending: false, isError: false, data: 'hello' });

    expect(toQueryState(result)).toEqual({ status: 'success', data: 'hello' });
  });

  it('prioritizes the pending status over error when both flags are somehow set', () => {
    const result = fakeResult({ isPending: true, isError: true, error: new Error('x') });

    expect(toQueryState(result)).toEqual({ status: 'pending' });
  });
});
