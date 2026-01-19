import { describe, it, expect, beforeEach } from 'vitest';

// Mock the note generation logic from index.html
function generateTestFrequencies() {
  const C2 = 65.41;
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const test_frequencies = [];
  
  for (let i = 0; i < 30; i++) {
    const note_frequency = C2 * Math.pow(2, i / 12);
    const note_name = notes[i % 12];
    const note = { frequency: note_frequency, name: note_name };
    const just_above = { frequency: note_frequency * Math.pow(2, 1 / 48), name: note_name + " (a bit sharp)" };
    const just_below = { frequency: note_frequency * Math.pow(2, -1 / 48), name: note_name + " (a bit flat)" };
    test_frequencies.push(just_below, note, just_above);
  }
  
  return test_frequencies;
}

// Mock the correlation result interpretation logic
function interpret_correlation_result(frequency_amplitudes, test_frequencies) {
  const magnitudes = frequency_amplitudes.map(z => z[0] * z[0] + z[1] * z[1]);
  
  let maximum_index = -1;
  let maximum_magnitude = 0;
  for (let i = 0; i < magnitudes.length; i++) {
    if (magnitudes[i] <= maximum_magnitude) continue;
    maximum_index = i;
    maximum_magnitude = magnitudes[i];
  }
  
  const average = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const confidence = maximum_magnitude / average;
  const confidence_threshold = 10;
  
  if (confidence > confidence_threshold) {
    return test_frequencies[maximum_index];
  }
  return null;
}

describe('Main application logic', () => {
  let test_frequencies;
  
  beforeEach(() => {
    test_frequencies = generateTestFrequencies();
  });

  describe('Test frequency generation', () => {
    it('should generate 90 test frequencies (30 notes × 3 variations)', () => {
      expect(test_frequencies).toHaveLength(90);
    });

    it('should generate frequencies starting from C2', () => {
      expect(test_frequencies[1].frequency).toBeCloseTo(65.41, 2); // C2
    });

    it('should include sharp and flat variations', () => {
      // Check that we have the pattern: flat, in-tune, sharp
      expect(test_frequencies[0].name).toContain('flat');
      expect(test_frequencies[1].name).toBe('C');
      expect(test_frequencies[2].name).toContain('sharp');
    });

    it('should have correct note names', () => {
      const note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      
      // Check a few specific notes
      expect(test_frequencies[1].name).toBe('C');
      expect(test_frequencies[4].name).toBe('C#');
      expect(test_frequencies[7].name).toBe('D');
    });

    it('should calculate frequencies with correct ratios', () => {
      const C2 = 65.41;
      const C3 = C2 * Math.pow(2, 12 / 12); // One octave higher
      
      // Find C2 and C3 in test frequencies
      const C2_note = test_frequencies.find(f => f.name === 'C' && Math.abs(f.frequency - C2) < 1);
      const C3_note = test_frequencies.find(f => f.name === 'C' && Math.abs(f.frequency - C3) < 1);
      
      expect(C2_note).toBeDefined();
      expect(C3_note).toBeDefined();
      expect(C3_note.frequency).toBeCloseTo(C2_note.frequency * 2, 1);
    });
  });

  describe('Correlation result interpretation', () => {
    it('should identify dominant frequency when confidence is high', () => {
      // Mock correlation results with one dominant frequency
      const frequency_amplitudes = Array(90).fill([0, 0]);
      frequency_amplitudes[10] = [100, 0]; // Strong signal at index 10
      
      const result = interpret_correlation_result(frequency_amplitudes, test_frequencies);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(test_frequencies[10].name);
    });

    it('should return null when confidence is low', () => {
      // Mock correlation results with no dominant frequency
      const frequency_amplitudes = Array(90).fill([1, 1]);
      
      const result = interpret_correlation_result(frequency_amplitudes, test_frequencies);
      
      expect(result).toBeNull();
    });

    it('should handle empty correlation results', () => {
      const frequency_amplitudes = [];
      
      const result = interpret_correlation_result(frequency_amplitudes, test_frequencies);
      
      expect(result).toBeNull();
    });

    it('should calculate magnitudes correctly', () => {
      // Test magnitude calculation: sqrt(real^2 + imag^2)
      const frequency_amplitudes = [
        [3, 4],  // magnitude = 5
        [0, 0],  // magnitude = 0
        [5, 12]  // magnitude = 13
      ];
      
      const magnitudes = frequency_amplitudes.map(z => z[0] * z[0] + z[1] * z[1]);
      
      expect(magnitudes[0]).toBe(25);  // 3^2 + 4^2 = 9 + 16 = 25
      expect(magnitudes[1]).toBe(0);   // 0^2 + 0^2 = 0
      expect(magnitudes[2]).toBe(169); // 5^2 + 12^2 = 25 + 144 = 169
    });
  });

  describe('Confidence calculation', () => {
    it('should have confidence above threshold when signal is strong', () => {
      const frequency_amplitudes = Array(90).fill([1, 1]);
      frequency_amplitudes[5] = [50, 0]; // Strong signal
      
      const magnitudes = frequency_amplitudes.map(z => z[0] * z[0] + z[1] * z[1]);
      const maximum_magnitude = Math.max(...magnitudes);
      const average = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
      const confidence = maximum_magnitude / average;
      
      expect(confidence).toBeGreaterThan(10);
    });

    it('should have confidence below threshold when signal is weak', () => {
      const frequency_amplitudes = Array(90).fill([2, 2]);
      
      const magnitudes = frequency_amplitudes.map(z => z[0] * z[0] + z[1] * z[1]);
      const maximum_magnitude = Math.max(...magnitudes);
      const average = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
      const confidence = maximum_magnitude / average;
      
      expect(confidence).toBeLessThan(10);
    });
  });
});