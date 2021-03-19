import { IsArray, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { Competition } from '../interfaces/domain.interface';

export class CreateCompetitionDto implements Competition {
  @IsString()
  @MinLength(3)
  public title: string;

  @IsString()
  @MinLength(3)
  public description: string;

  @IsDateString({ strict: true })
  public opening_date: string;

  @IsDateString({ strict: true })
  public closing_date: string;

  @IsArray()
  @IsOptional()
  public membership_types: string[];
}

export class CompetitionEntryDto {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  competitionId: string;

  @IsString()
  @IsOptional()
  entry: string;
}
