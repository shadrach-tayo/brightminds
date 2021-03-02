import { IsBooleanString, IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';
import { Plan, Subscription } from '../interfaces/domain.interface';

export class CreatePlanDto implements Plan {
  @IsNumberString()
  public price: string;

  @IsDateString({ strict: true })
  @IsOptional()
  public valid_to: string;

  @IsDateString({ strict: true })
  @IsOptional()
  public valid_from: string;

  @IsString()
  @MinLength(8)
  public plan_name: string;

  @IsBooleanString()
  public is_active: boolean;

  @IsString()
  @MinLength(8)
  public description: string;
}

export class CreateSubscriptionDto implements Subscription {
  @IsNumberString()
  @IsOptional()
  amount: string;

  @IsString()
  transaction_ref: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  planId?: string;
}
export class AdminCreateSubscriptionDto implements Subscription {
  @IsNumberString()
  @IsOptional()
  amount: string;

  @IsOptional()
  transaction_ref: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  planId?: string;
}
