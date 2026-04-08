import { ImageFolder } from "./types";

class AssetsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL as string;
  }

  getImagePath(folder: ImageFolder, name: string): string {
    return `${this.baseUrl}/assets/images/${folder}/${name}`;
  }
}

export const assetsService = new AssetsService();
