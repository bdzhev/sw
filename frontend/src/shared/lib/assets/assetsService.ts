import { BASE_URL } from "@shared/lib/http";
import { ImageFolder } from "./types";

class AssetsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  getImagePath(folder: ImageFolder, name: string): string {
    return `${this.baseUrl}/assets/images/${folder}/${name}`;
  }
}

export const assetsService = new AssetsService();
