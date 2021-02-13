import { IsDateString, IsEmail, IsNotEmptyObject, IsObject, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Admin, User } from '../interfaces/domain.interface';
import { CreateAddressDto } from './resources.dto';

export class LoginUserDto {
  @IsPhoneNumber('NG', { message: 'check the length and the country code (+234)' })
  @MinLength(11)
  @MaxLength(14)
  public phoneNumber: string;

  @IsString()
  @MinLength(6)
  public password: string;
}
export class CreateUserDto implements User {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;

  @IsString({ message: 'Gender is required (male or female)' })
  public gender: string;

  @IsString({ message: 'School is required' })
  @MinLength(6)
  public school: string;

  @IsString({ message: 'Firstname is required' })
  @MinLength(3)
  public firstname: string;

  @IsString({ message: 'Lastname is required' })
  @MinLength(3)
  public lastname: string;

  @IsDateString({ strict: true })
  public dob: string;

  @IsObject({ message: 'Address is required' })
  @IsNotEmptyObject()
  public address!: CreateAddressDto;

  @IsPhoneNumber('NG', { message: 'check the length and the country code (+234)' })
  @MinLength(11)
  @MaxLength(14)
  public phoneNumber: string;
}

export class CreateAdminDto implements Admin {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;

  @IsString()
  @MinLength(3)
  public firstname: string;

  @IsString()
  @MinLength(3)
  public lastname: string;

  @IsPhoneNumber('NG', { message: 'check the length and the country code (+234)' })
  @MinLength(11)
  @MaxLength(14)
  public phoneNumber: string;
}

export class UpdateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;

  @IsString()
  @MinLength(3)
  public firstname: string;

  @IsString()
  @MinLength(3)
  public lastname: string;

  @IsDateString()
  public dob: string;

  @IsObject()
  @IsNotEmptyObject()
  public address: CreateAddressDto;

  @IsString()
  @MinLength(6)
  public school: string;

  @IsPhoneNumber('NG', { message: 'check the length and the country code (+234)' })
  @MinLength(11)
  @MaxLength(14)
  public phoneNumber: string;
}
