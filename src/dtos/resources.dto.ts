import { IsOptional, IsString, MinLength } from 'class-validator';
import { Address } from '../interfaces/domain.interface';

export class CreateAddressDto implements Address {
  @IsString()
  @IsOptional()
  public city: string;

  @IsString()
  @MinLength(3)
  public state: string;

  @IsString()
  @MinLength(3)
  public lga: string;

  @IsString()
  @IsOptional()
  public street: string;
}
