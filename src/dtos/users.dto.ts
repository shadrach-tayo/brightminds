import { IsDateString, IsEmail, IsNotEmptyObject, IsObject, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Admin, User } from '../interfaces/domain.interface';
import { CreateAddressDto } from './resources.dto';
export class CreateUserDto implements User {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;

  @IsString()
  @MinLength(6)
  public school: string;

  // @IsString({ message: 'User type is not valid, try (MEMBER, ADMIN, SUPER_ADMIN)' })
  // public role: UserType;

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
