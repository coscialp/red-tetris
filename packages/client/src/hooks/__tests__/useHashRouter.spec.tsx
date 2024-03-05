import { act, renderHook } from "@testing-library/react";
import useHashRouter from "../useHashRouter";

describe('useHashRouter', () => {
  it('should initialize with empty hash', () => {
    const { result } = renderHook(() => useHashRouter());
    const [hash] = result.current;

    expect(hash).toBe('');
  });

  it('should update hash state when hash changes', () => {
    const { result } = renderHook(() => useHashRouter());
    // @ts-ignore
    const [_, setHash] = result.current;

    // Simulate a hash change
    act(() => {
      window.location.hash = '#test';
      window.dispatchEvent(new Event('hashchange'));
    });

    // Hash state should update to #test
    expect(result.current[0]).toBe('#test');

    // Simulate another hash change
    act(() => {
      window.location.hash = '#newhash';
      window.dispatchEvent(new Event('hashchange'));
    });

    // Hash state should update to #newhash
    expect(result.current[0]).toBe('#newhash');
  });

  it('should update hash state when setHash is called', () => {
    const { result } = renderHook(() => useHashRouter());
    const [_, setHash] = result.current;

    // Test setting hash manually
    act(() => {
      setHash('#manualhash');
    });

    // Hash state should update to #manualhash
    expect(result.current[0]).toBe('#manualhash');
  });
});
