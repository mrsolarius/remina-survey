import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SurveyService } from './survey.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { SessionCompleteDto } from './dto/session-complete.dto';

@ApiTags('Survey')
@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @ApiOperation({ summary: 'Create a new session and return assigned words' })
  @Post('session')
  createSession(@Body() dto: CreateSessionDto) {
    return this.surveyService.createSession(dto);
  }

  @ApiOperation({ summary: 'Save an evaluation for a word' })
  @Post('evaluation')
  evaluate(@Body() dto: CreateEvaluationDto) {
    return this.surveyService.evaluate(dto);
  }

  @ApiOperation({ summary: 'Mark session as completed' })
  @Post('session/complete')
  complete(@Body() dto: SessionCompleteDto) {
    return this.surveyService.complete(dto);
  }
}
