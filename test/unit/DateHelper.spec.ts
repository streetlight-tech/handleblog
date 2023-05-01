import { DateHelper  } from "../../src";

describe('DateHelper', () => {
  describe('dateFromTimestampString', () => {
    it('should return date from timestamp', () => {
      const result = DateHelper.dateFromTimestampString('1672531200000');

      expect(result).toEqual(new Date('2023-01-01'));
    });
    
    it('should return undefined if null passed', () => {
      const result = DateHelper.dateFromTimestampString(undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('timestampStringFromDate', () => {
    it('should return timestamp from date', () => {
      const result = DateHelper.timestampStringFromDate(new Date('2023-01-01'));

      expect(result).toEqual('1672531200000');
    });
    it('should return undefined if null passed', () => {
      const result = DateHelper.timestampStringFromDate(undefined);

      expect(result).toBeUndefined();
    });
  });
});