export class InvalidData extends Error {
  public status: number;
  public message: string;

  constructor(status?: number, message?: string) {
    super(message);
    this.status = status || 401;
    this.message = message || 'Invalid input data';
  }
}
