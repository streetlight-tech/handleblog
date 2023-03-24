export class DateHelper {
  public static dateFromTimestampString(input?: string): Date | undefined {
    return input ? new Date(parseInt(input)) : undefined;
  }

  public static timestampStringFromDate(input?: Date): string | undefined {
    return input ? input.getTime().toString() : undefined;
  }
}