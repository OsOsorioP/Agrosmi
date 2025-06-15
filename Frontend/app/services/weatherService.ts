import { WeatherRequest, WeatherResponse } from '../types/WeatherTypes';
import { post } from './api';

export async function getWeatherForecast(request: WeatherRequest): Promise<WeatherResponse> {
    const endpoint = '/weather';
    const response = await post<WeatherResponse>(endpoint, request);
    return response;
}
