export interface IEmailService {
  sendMail(options: any): Promise<any>;
}
