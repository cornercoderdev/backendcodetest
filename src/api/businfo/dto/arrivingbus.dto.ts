import { IsOptional, IsString } from 'class-validator';

export class ArrivingBusDto {
  @IsString()
  readonly busRouteId: string;

  @IsString()
  @IsOptional()
  readonly plainNo1: string;

  @IsString()
  readonly vehId1: string;

  @IsString()
  readonly rtNm: string;

  @IsString()
  readonly traTime1: string;
}

// {
//   "busRouteId": "204000013",
//   "stId": "205000020",
//   "arsId": "0",
//   "stnNm": "모란역6.7번출구",
//   "adirection": "차고지대기(경유)",
//   "rtNm": "60성남",
//   "busRouteAbrv": "60",
//   "sectNm": "모란농협~모란역6.7번출구",
//   "firstTm": "0500  ",
//   "lastTm": "2200  ",
//   "term": "37",
//   "routeType": "8",
//   "nextBus": " ",
//   "staOrd": "108",
//   "vehId1": "204000568",
//   "plainNo1": null,
//   "sectOrd1": "91",
//   "stationNm1": "하원초등학교",
//   "traTime1": "1327",
//   "traSpd1": "16",
//   "isArrive1": "0",
//   "repTm1": "2022-12-28 12:25:06.0",
//   "isLast1": "0",
//   "busType1": "1",
//   "busDist1": null,
//   "vehId2": "204000480",
//   "plainNo2": null,
//   "sectOrd2": "62",
//   "stationNm2": "복정역환승센터1번승강장",
//   "traTime2": "3811",
//   "traSpd2": "16",
//   "isArrive2": "0",
//   "repTm2": null,
//   "isLast2": "0",
//   "arrmsg1": "22분7초후[17번째 전]",
//   "arrmsg2": "63분31초후[46번째 전]",
//   "posX": "211407.92331125223",
//   "posY": "436944.23179679085",
//   "gpsX": "127.1289110706",
//   "gpsY": "37.4317533655",
//   "busType2": "1",
//   "deTourAt": "00"
//   }
