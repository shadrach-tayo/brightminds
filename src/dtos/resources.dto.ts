import { IsArray, IsDateString, IsNotEmptyObject, IsOptional, IsString, MinLength } from 'class-validator';
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
  @MinLength(3)
  public title: string;

  @IsString()
  @MinLength(3)
  public description: string;

  @IsDateString({ strict: true })
  public start_date: string;

  @IsDateString({ strict: true })
  public end_date: string;

  public banner: any;

  @IsDateString()
  @IsOptional()
  public event_time: string;

  @IsString()
  @MinLength(3)
  public location: string;

  @IsArray()
  @IsNotEmptyObject()
  public membership_types: string[];
}

export class CreateTicketDto {
  @IsString()
  // @IsOptional()
  userId: string;

  @IsString()
  eventId: string;
}
