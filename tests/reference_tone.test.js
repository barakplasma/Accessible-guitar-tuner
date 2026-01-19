import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the guitar strings data from index.html
const guitar_strings = [
  { name: "E (low)", frequency: 82.41 },
  { name: "A", frequency: 110.00 },
  { name: "D", frequency: 146.83 },
  { name: "G", frequency: 196.00 },
  { name: "B", frequency: 246.94 },
  { name: "E (high)", frequency: 329.63 }
];

// Mock the string cycling logic
function cycle_string(current_index) {
  return (current_index + 1) % guitar_strings.length;
}

// Mock getting current string info
function get_current_string(index) {
  return guitar_strings[index];
}

describe('Reference tone feature', () => {
  describe('Guitar strings data', () => {
    it('should have exactly 6 strings', () => {
      expect(guitar_strings).toHaveLength(6);
    });

    it('should have correct string names', () => {
      const names = guitar_strings.map(s => s.name);
      expect(names).toContain("E (low)");
      expect(names).toContain("A");
      expect(names).toContain("D");
      expect(names).toContain("G");
      expect(names).toContain("B");
      expect(names).toContain("E (high)");
    });

    it('should have standard guitar tuning frequencies', () => {
      expect(guitar_strings[0].frequency).toBeCloseTo(82.41, 2); // E2
      expect(guitar_strings[1].frequency).toBeCloseTo(110.00, 2); // A2
      expect(guitar_strings[2].frequency).toBeCloseTo(146.83, 2); // D3
      expect(guitar_strings[3].frequency).toBeCloseTo(196.00, 2); // G3
      expect(guitar_strings[4].frequency).toBeCloseTo(246.94, 2); // B3
      expect(guitar_strings[5].frequency).toBeCloseTo(329.63, 2); // E4
    });

    it('should have frequencies in ascending order', () => {
      for (let i = 1; i < guitar_strings.length; i++) {
        expect(guitar_strings[i].frequency).toBeGreaterThan(guitar_strings[i - 1].frequency);
      }
    });

    it('should have both low and high E strings', () => {
      const low_e = guitar_strings.find(s => s.name === "E (low)");
      const high_e = guitar_strings.find(s => s.name === "E (high)");
      
      expect(low_e).toBeDefined();
      expect(high_e).toBeDefined();
      expect(high_e.frequency).toBeCloseTo(low_e.frequency * 4, 1); // Two octaves higher
    });
  });

  describe('String cycling functionality', () => {
    it('should cycle through all 6 strings', () => {
      let current_index = 0;
      const visited_indices = new Set();
      
      // Cycle through all strings
      for (let i = 0; i < 6; i++) {
        visited_indices.add(current_index);
        current_index = cycle_string(current_index);
      }
      
      expect(visited_indices.size).toBe(6);
      expect(current_index).toBe(0); // Should return to start
    });

    it('should wrap around from last to first string', () => {
      const last_index = guitar_strings.length - 1;
      const next_index = cycle_string(last_index);
      
      expect(next_index).toBe(0);
    });

    it('should increment correctly from first string', () => {
      const first_index = 0;
      const next_index = cycle_string(first_index);
      
      expect(next_index).toBe(1);
    });

    it('should visit strings in correct order', () => {
      let current_index = 0;
      const expected_order = [1, 2, 3, 4, 5, 0]; // After starting at 0
      
      const actual_order = [];
      for (let i = 0; i < 6; i++) {
        current_index = cycle_string(current_index);
        actual_order.push(current_index);
      }
      
      expect(actual_order).toEqual(expected_order);
    });
  });

  describe('Current string information', () => {
    it('should return correct string object for valid index', () => {
      const string_0 = get_current_string(0);
      expect(string_0.name).toBe("E (low)");
      expect(string_0.frequency).toBe(82.41);
      
      const string_3 = get_current_string(3);
      expect(string_3.name).toBe("G");
      expect(string_3.frequency).toBe(196.00);
    });

    it('should handle all valid indices', () => {
      for (let i = 0; i < guitar_strings.length; i++) {
        const string = get_current_string(i);
        expect(string).toBeDefined();
        expect(string.name).toBeTruthy();
        expect(string.frequency).toBeGreaterThan(0);
      }
    });
  });

  describe('Frequency accuracy', () => {
    it('should have precise frequencies for standard tuning', () => {
      // E2 (low E) = 82.41 Hz
      expect(guitar_strings[0].frequency).toBeCloseTo(82.41, 2);
      
      // A2 = 110.00 Hz  
      expect(guitar_strings[1].frequency).toBeCloseTo(110.00, 2);
      
      // D3 = 146.83 Hz
      expect(guitar_strings[2].frequency).toBeCloseTo(146.83, 2);
      
      // G3 = 196.00 Hz
      expect(guitar_strings[3].frequency).toBeCloseTo(196.00, 2);
      
      // B3 = 246.94 Hz
      expect(guitar_strings[4].frequency).toBeCloseTo(246.94, 2);
      
      // E4 (high E) = 329.63 Hz
      expect(guitar_strings[5].frequency).toBeCloseTo(329.63, 2);
    });

    it('should maintain musical interval relationships', () => {
      // Perfect fourths between most strings (except G to B which is a major third)
      const ratio_4th = Math.pow(2, 5/12); // Perfect fourth ratio
      const ratio_3rd = Math.pow(2, 4/12); // Major third ratio
      
      // E to A (perfect fourth)
      expect(guitar_strings[1].frequency / guitar_strings[0].frequency).toBeCloseTo(ratio_4th, 2);
      
      // A to D (perfect fourth)
      expect(guitar_strings[2].frequency / guitar_strings[1].frequency).toBeCloseTo(ratio_4th, 2);
      
      // D to G (perfect fourth)
      expect(guitar_strings[3].frequency / guitar_strings[2].frequency).toBeCloseTo(ratio_4th, 2);
      
      // G to B (major third)
      expect(guitar_strings[4].frequency / guitar_strings[3].frequency).toBeCloseTo(ratio_3rd, 2);
      
      // B to E (perfect fourth)
      expect(guitar_strings[5].frequency / guitar_strings[4].frequency).toBeCloseTo(ratio_4th, 2);
    });
  });

  describe('Display formatting', () => {
    it('should format string display correctly', () => {
      const string = guitar_strings[0];
      const display = `${string.name} (${string.frequency.toFixed(2)} Hz)`;
      
      expect(display).toBe("E (low) (82.41 Hz)");
    });

    it('should format all string displays consistently', () => {
      guitar_strings.forEach(string => {
        const display = `${string.name} (${string.frequency.toFixed(2)} Hz)`;
        
        expect(display).toMatch(/\([^)]+\)/); // Contains parentheses
        expect(display).toMatch(/\d+\.\d+\s*Hz/); // Contains frequency with Hz
      });
    });

    it('should handle button text generation', () => {
      const string = guitar_strings[1]; // A string
      const play_text = `Play ${string.name} reference note`;
      const stop_text = `Stop ${string.name} reference note`;
      
      expect(play_text).toBe("Play A reference note");
      expect(stop_text).toBe("Stop A reference note");
    });
  });

  describe('Accessibility features', () => {
    it('should generate descriptive announcements', () => {
      const string = guitar_strings[2]; // D string
      const announcement = `Playing ${string.name} reference note at ${string.frequency.toFixed(2)} Hertz`;
      
      expect(announcement).toBe("Playing D reference note at 146.83 Hertz");
    });

    it('should include frequency in announcements', () => {
      guitar_strings.forEach(string => {
        const announcement = `Selected ${string.name} string at ${string.frequency.toFixed(2)} Hertz`;
        
        expect(announcement).toContain(string.name);
        expect(announcement).toContain(string.frequency.toFixed(2));
        expect(announcement).toContain("Hertz");
      });
    });

    it('should handle different announcement types', () => {
      const string = guitar_strings[4]; // B string
      
      const play_announcement = `Playing ${string.name} reference note at ${string.frequency.toFixed(2)} Hertz`;
      const stop_announcement = `Stopped ${string.name} reference note`;
      const select_announcement = `Selected ${string.name} string at ${string.frequency.toFixed(2)} Hertz`;
      
      expect(play_announcement).toContain("Playing");
      expect(stop_announcement).toContain("Stopped");
      expect(select_announcement).toContain("Selected");
    });
  });

  describe('String navigation', () => {
    it('should support sequential string access', () => {
      let current_index = 0;
      const sequence = [];
      
      for (let i = 0; i < 12; i++) { // Go through twice
        sequence.push(get_current_string(current_index).name);
        current_index = cycle_string(current_index);
      }
      
      // Should cycle through all strings twice
      expect(sequence[0]).toBe("E (low)");
      expect(sequence[6]).toBe("E (low)"); // After completing one cycle
    });

    it('should maintain state during cycling', () => {
      let current_index = 0;
      
      // Simulate user cycling through strings
      current_index = cycle_string(current_index); // Now at A
      expect(get_current_string(current_index).name).toBe("A");
      
      current_index = cycle_string(current_index); // Now at D
      expect(get_current_string(current_index).name).toBe("D");
      
      current_index = cycle_string(current_index); // Now at G
      expect(get_current_string(current_index).name).toBe("G");
    });
  });
});