export interface MissionCreateDTO {
  missionName: string;
  description: string;
  reward: string;
}

export interface MissionUpdateDTO {
  missionName?: string;
  description?: string;
  reward?: string;
}
