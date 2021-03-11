import { IsArray, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumberString, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { Address, Event } from '../interfaces/domain.interface';

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

export class CreateEventDto implements Event {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsDateString({ strict: true })
  public start_date: string;

  @IsDateString({ strict: true })
  public end_date: string;

  public banner: any;

  @IsDateString()
  @IsOptional()
  public event_time: string;

  @IsObject({ message: 'Address is required' })
  @IsNotEmptyObject()
  public address!: CreateAddressDto;

  @IsArray()
  @IsNotEmptyObject()
  public membership_types: string[];
}

export class CreateTicketDto {
  @IsNumberString()
  amount_paid: string;

  @IsNumberString()
  quantity: number;

  @IsString()
  transaction_ref: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  eventId: string;
}
