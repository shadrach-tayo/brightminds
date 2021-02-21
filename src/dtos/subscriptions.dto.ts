import { IsBooleanString, IsDateString, IsNumberString, IsString, MinLength } from 'class-validator';
import { Plan, Subscription } from '../interfaces/domain.interface';

export class CreatePlanDto implements Plan {
  @IsNumberString()
  public price: string;

  @IsDateString({ strict: true })
  public valid_to: string;

  @IsDateString({ strict: true })
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
  amount: string;
  transaction_ref: string;
  planId?: string;
}
