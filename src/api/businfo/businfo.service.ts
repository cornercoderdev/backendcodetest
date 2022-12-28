import { Injectable } from '@nestjs/common';
import {
  StationDto,
  RouteDto,
  ArrivingBusDto,
  BusDto,
  VehicleDto,
  DataParamDto,
  BusinfoDto,
} from './dto';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import Util from '../../util/util';

@Injectable()
export class BusinfoService {
  constructor(private readonly httpService: HttpService) {}

  API_HOST: string = process.env.API_HOST;
  API_KEY: string = process.env.API_KEY;
  API_KEY_2: string | undefined = process.env.API_KEY_2;

  /**
   * Returns the Open API result by given parameters.
   * @param dataParam - Open API param object
   * @returns Open API result in JSON array format
   */
  async getData(dataParam: DataParamDto): Promise<any[]> {
    let paramUri = '';

    if (Object.keys(dataParam.params).length > 0) {
      for (const key in dataParam.params) {
        if (Object.prototype.hasOwnProperty.call(dataParam.params, key)) {
          paramUri += `&${key}=${dataParam.params[key]}`;
        }
      }
    }

    const uri = (apiKey: string) => {
      return `${this.API_HOST}${dataParam.api}/${dataParam.route}?serviceKey=${apiKey}&resultType=json${paramUri}`;
    };

    let data: AxiosResponse;

    try {
      data = await this.httpService.axiosRef.get(uri(this.API_KEY));
      if (!data || data?.data?.msgHeader?.headerCd !== '0') {
        throw new Error(
          `Failed to get ${dataParam.api}/${dataParam.route}. ${data?.data?.msgHeader?.headerMsg}`,
        );
      }
    } catch (e) {
      if (this.API_KEY_2) {
        data = await this.httpService.axiosRef.get(uri(this.API_KEY_2));
      }
    }

    if (!data || data?.data?.msgHeader?.headerCd !== '0') {
      throw {
        statusCode: 400,
        message: `Failed to get ${dataParam.api}/${dataParam.route}. ${data?.data?.msgHeader?.headerMsg}`,
        errorCode: data?.data?.msgHeader?.headerCd,
      };
    }

    return data?.data?.msgBody?.itemList;
  }

  /**
   * Returns all bus routes in Seoul. 서울특별시_노선정보조회 서비스
   * @returns All bus routes list in JSON array format
   */
  async getAllRoutes(): Promise<RouteDto[]> {
    return await this.getData({
      api: 'busRouteInfo',
      route: 'getBusRouteList',
      params: {},
    });
  }

  /**
   * Returns all stations the given bus route visits. 서울특별시_버스도착정보조회 서비스
   * @param routeId - Bus routeId
   * @returns All stations list visited by the bus route in JSON array format
   */
  async getRouteStations(routeId: string): Promise<StationDto[]> {
    return await this.getData({
      api: 'arrive',
      route: 'getArrInfoByRouteAll',
      params: { busRouteId: routeId },
    });
  }

  /**
   * Returns arriving buses by given station number. 서울특별시_정류소정보조회 서비스
   * @param arsId - Station number
   * @returns Arriving buses list in JSON array format
   */
  async getArrivalInfo(arsId: string): Promise<ArrivingBusDto[]> {
    return await this.getData({
      api: 'stationinfo',
      route: 'getStationByUid',
      params: { arsId: arsId },
    });
  }

  /**
   * Returns detailed informtion of the bus by vehicleId. 서울특별시_버스위치정보조회 서비스
   * @param vehId Vehicle id
   * @returns Vehicle detail information in JSON format
   */
  async getVehicleInfo(vehId: string): Promise<VehicleDto> {
    return (
      await this.getData({
        api: 'buspos',
        route: 'getBusPosByVehId',
        params: { vehId: vehId },
      })
    )[0];
  }

  /**
   * Returns 3 routes information extracted randomly from Seoul bus routes.
   * @returns 3 random Seoul bus routes information in JSON array format
   */
  async getRandomRoutes(): Promise<RouteDto[]> {
    const allRoutes = await this.getAllRoutes();

    if (!allRoutes) {
      throw {
        statusCode: 400,
        message: 'Failed to get bus routes.',
      };
    }

    const randomRoutes: RouteDto[] = [];

    while (randomRoutes.length < 3) {
      const route = allRoutes[Util.getRandomIntFromRange(0, allRoutes.length)];
      if (!randomRoutes.find((item) => item.busRouteId === route.busRouteId)) {
        randomRoutes.push(route);
      }
    }

    return randomRoutes;
  }

  /**
   * Returns all stations visited by given routes.
   * @param routes - List of bus routes
   * @returns All stations list in JSON array format
   */
  async getAllStations(routes: RouteDto[]): Promise<StationDto[]> {
    const allStations: StationDto[] = [];

    for (let i = 0; i < routes.length; i++) {
      const routeStations: StationDto[] = await this.getRouteStations(
        routes[i].busRouteId,
      );

      if (!routeStations) {
        throw {
          statusCode: 400,
          message: `Failed to get route stations. routeId: ${routes[i].busRouteId}`,
        };
      }

      routeStations.forEach((station: StationDto) => {
        if (!allStations.find((item) => item['arsId'] === station['arsId'])) {
          allStations.push(station);
        }
      });
    }

    return allStations;
  }

  /**
   * Returns 3 stations withthe most scheduled buses to arrive in 5 minutes among given stations.
   * @param stations - List of stations
   * @returns List of stations in JSON array format
   */
  async getBusyStations(stations: StationDto[]): Promise<StationDto[]> {
    let allStationsWithArrivalInfo: StationDto[] = [];
    let arrivalInfoRequestCount = 0; // TODO. remove this line

    // get arrival info
    for (let i = 0; i < stations.length; i++) {
      const station: StationDto = stations[i];
      let arrivalInfo: ArrivingBusDto[];

      try {
        arrivalInfo = await this.getArrivalInfo(station.arsId);
      } catch (e) {
        if (e.errorCode === '4') {
          continue;
        }

        throw {
          statusCode: 400,
          message: `Failed to get arrval information from station. arsId: ${station.arsId}.`,
        };
      }

      arrivalInfoRequestCount++; // TODO. remove this line
      // filter buses arriving in 5 min
      arrivalInfo = arrivalInfo.filter(
        (item) => Number(item.traTime1) <= 300 && Number(item.traTime1) > 0,
      );
      station.arrival = arrivalInfo;
      allStationsWithArrivalInfo.push(station);

      if (arrivalInfoRequestCount > 3) break; // TODO. remove this line
    }

    allStationsWithArrivalInfo = allStationsWithArrivalInfo.sort(
      (a, b) => b.arrival.length - a.arrival.length,
    );

    return allStationsWithArrivalInfo.splice(0, 3);
  }

  /**
   * Returns 3 random routes, 3 busiest stations and a list of bus information sorted by fastet arriving bus.
   * @returns 3 random routes, 3 busiest stations and list of fastest arriving buses in JSON object
   */
  async listBusInfo(): Promise<BusinfoDto> {
    const randomRoutes = await this.getRandomRoutes();
    const allStations = await this.getAllStations(randomRoutes);
    const busyStations = await this.getBusyStations(allStations);
    let arrivingBuses: ArrivingBusDto[] = [];

    for (let i = 0; i < busyStations.length; i++) {
      arrivingBuses = [...arrivingBuses, ...busyStations[i].arrival];
    }

    if (arrivingBuses.length === 0) {
      const result: BusinfoDto = {
        routes: randomRoutes, // Step 1
        stations: busyStations, // Step 2
        buses: 'There are no arriving buses', // Step 3
      };

      return result;
    }

    let buses: BusDto[] = [];

    for (let i = 0; i < arrivingBuses.length; i++) {
      const busInfo = {
        busNumber: arrivingBuses[i].rtNm,
        plateNumber: arrivingBuses[i].plainNo1,
        eta: arrivingBuses[i].traTime1,
      };

      if (!busInfo.plateNumber || busInfo.plateNumber === null) {
        const vehicleInfo: VehicleDto = await this.getVehicleInfo(
          arrivingBuses[i].vehId1,
        );
        if (!vehicleInfo) {
          throw {
            statusCode: 400,
            message: `Failed to get vehicle information. vehId: ${arrivingBuses[i].vehId1}`,
          };
        }
        busInfo.plateNumber = vehicleInfo.plainNo;
      }

      if (buses.find((item) => item.plateNumber === busInfo.plateNumber)) {
        continue;
      }

      buses = [...buses, busInfo];
    }

    if (buses.length === 0) {
      throw {
        statusCode: 400,
        message: 'Failed to get bus information.',
      };
    }

    const result: BusinfoDto = {
      routes: randomRoutes, // Step 1
      stations: busyStations, // Step 2
      buses: buses.sort((a, b) => Number(a.eta) - Number(b.eta)), // Step 3
    };

    return result;
  }
}
