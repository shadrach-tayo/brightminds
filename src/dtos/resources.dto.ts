import { IsString } from 'class-validator';
import { Address } from '../interfaces/domain.interface';

export class CreateAddressDto implements Address {
  @IsString()
  public city: string;

  @IsString()
  public state: string;

  @IsString()
  public lga?: string;

  @IsString()
  public street: string;
}
