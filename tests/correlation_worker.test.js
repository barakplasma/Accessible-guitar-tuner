import { describe, it, expect } from 'vitest';

// Import the correlation function logic
function compute_correlations(timeseries, test_frequencies, sample_rate) {
  const scale_factor = 2 * Math.PI / sample_rate;
  const amplitudes = test_frequencies.map(function(f) {
    const frequency = f.frequency;
    const accumulator = [0, 0];
    for (let t = 0; t < timeseries.length; t++) {
      accumulator[0] += timeseries[t] * Math.cos(scale_factor * frequency * t);
      accumulator[1] += timeseries[t] * Math.sin(scale_factor * frequency * t);
    }
    return accumulator;
  });
  return amplitudes;
}

describe('correlation_worker', () => {
  it('should compute correlations for simple sine wave', () => {
    const sample_rate = 44100;
    const frequency = 440; // A4
    const timeseries = [];
    
    // Generate a simple sine wave at 440 Hz
    for (let t = 0; t < 1000; t++) {
      timeseries.push(Math.sin(2 * Math.PI * frequency * t / sample_rate));
    }
    
    const test_frequencies = [{ frequency: 440, name: "A4" }];
    const result = compute_correlations(timeseries, test_frequencies, sample_rate);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
    expect(typeof result[0][0]).toBe('number');
    expect(typeof result[0][1]).toBe('number');
    
    // For a pure sine wave at the test frequency, we should get a high magnitude
    const magnitude = result[0][0] * result[0][0] + result[0][1] * result[0][1];
    expect(magnitude).toBeGreaterThan(100);
  });

  it('should return different results for different frequencies', () => {
    const sample_rate = 44100;
    const frequency = 440; // A4
    const timeseries = [];
    
    // Generate a sine wave at 440 Hz
    for (let t = 0; t < 1000; t++) {
      timeseries.push(Math.sin(2 * Math.PI * frequency * t / sample_rate));
    }
    
    const test_frequencies = [
      { frequency: 440, name: "A4" },
      { frequency: 880, name: "A5" },
      { frequency: 220, name: "A3" }
    ];
    
    const results = compute_correlations(timeseries, test_frequencies, sample_rate);
    
    expect(results).toHaveLength(3);
    
    // Calculate magnitudes
    const magnitudes = results.map(r => r[0] * r[0] + r[1] * r[1]);
    
    // The correct frequency (440 Hz) should have the highest magnitude
    expect(magnitudes[0]).toBeGreaterThan(magnitudes[1]);
    expect(magnitudes[0]).toBeGreaterThan(magnitudes[2]);
  });

  it('should handle empty timeseries', () => {
    const sample_rate = 44100;
    const timeseries = [];
    const test_frequencies = [{ frequency: 440, name: "A4" }];
    
    const result = compute_correlations(timeseries, test_frequencies, sample_rate);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([0, 0]);
  });

  it('should handle multiple test frequencies', () => {
    const sample_rate = 44100;
    const timeseries = [1, -1, 1, -1, 1, -1];
    const test_frequencies = [
      { frequency: 440, name: "A4" },
      { frequency: 880, name: "A5" },
      { frequency: 220, name: "A3" }
    ];
    
    const result = compute_correlations(timeseries, test_frequencies, sample_rate);
    
    expect(result).toHaveLength(3);
    result.forEach(amplitude => {
      expect(amplitude).toHaveLength(2);
      expect(typeof amplitude[0]).toBe('number');
      expect(typeof amplitude[1]).toBe('number');
    });
  });

  it('should compute complex amplitudes correctly', () => {
    const sample_rate = 44100;
    const frequency = 440;
    const timeseries = [];
    
    // Generate a cosine wave (cosine is real part of complex exponential)
    for (let t = 0; t < 1000; t++) {
      timeseries.push(Math.cos(2 * Math.PI * frequency * t / sample_rate));
    }
    
    const test_frequencies = [{ frequency: frequency, name: "A4" }];
    const result = compute_correlations(timeseries, test_frequencies, sample_rate);
    
    // For a cosine wave, the real part should be dominant
    expect(Math.abs(result[0][0])).toBeGreaterThan(Math.abs(result[0][1]));
  });
});